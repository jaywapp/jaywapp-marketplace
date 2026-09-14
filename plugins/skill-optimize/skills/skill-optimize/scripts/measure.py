#!/usr/bin/env python3
"""SKILL.md 컨텍스트 비용 측정기 (결정적 분석).

usage:
  python measure.py <skill-dir | SKILL.md> [--out FILE]
  python measure.py --selftest

출력: always-on 토큰(SKILL.md 전체), 섹션별 토큰·코드비율·힌트, 중복 후보 줄,
지연 로드 파일(references/scripts 등)과 SKILL.md가 참조하지 않는 orphan.
토큰은 추정치(ASCII 4자≈1, CJK 1.5자≈1). 절대값이 아니라 전/후 비교·비율용.
"""
import difflib
import re
import sys
import tempfile
from pathlib import Path

# ponytail: 휴리스틱 토크나이저. 정밀값이 필요해지면 실제 tokenizer로 교체
CJK = re.compile(r"[ᄀ-ᇿ㄰-㆏가-힯぀-ヿ一-鿿]")
# 순서 = 우선순위. HOT을 COLD보다 먼저 두어 규칙 섹션이 COLD로 오판되는 쪽을 피한다(오판 시 안전한 방향).
HINTS = [
    ("EXAMPLE", r"example|예시|예제|sample|샘플|시나리오|scenario"),
    ("HOT", r"rule|규칙|invariant|원칙|principle|must|절대|directive|workflow|절차|순서|step|protocol"
            r"|when to use|사용 시점|trigger|goal|목적|overview|개요|done|완료|checklist|체크리스트"
            r"|routing|references|load|guardrail"),
    ("COLD", r"troubleshoot|트러블|문제\s*해결|오류|error|faq|edge|예외|경계|pitfall|함정|주의|caveat"
             r"|platform|windows|mac|linux|migration|history|이력|changelog|appendix|부록|배경|background"
             r"|비교|comparison|rationale|anti-?pattern|안티"),
]
BULLET = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s+(.*)")
SKIP_FILES = {"SKILL.md"}
SKIP_PARTS = {"__pycache__", ".git"}


def est_tokens(text: str) -> int:
    cjk = len(CJK.findall(text))
    return round((len(text) - cjk) / 4 + cjk / 1.5)


def split_frontmatter(text: str):
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n", text, re.S)
    if not m:
        return None, text, 0
    return m.group(1), text[m.end():], text[: m.end()].count("\n")


def hint_for(title: str):
    for name, pat in HINTS:
        if re.search(pat, title, re.I):
            return name
    return "-"


def parse_sections(body: str, line_offset: int):
    """헤딩 기준 분할. 코드블록 내부 헤딩은 무시. 각 섹션에 토큰·코드토큰·불릿을 붙인다."""
    secs = []
    cur = {"title": "(preamble)", "level": 0, "line": line_offset + 1, "text": [], "code": [], "bullets": []}
    in_code = False
    for i, line in enumerate(body.splitlines(), start=line_offset + 1):
        if line.strip().startswith("```"):
            in_code = not in_code
            cur["code"].append(line)
            cur["text"].append(line)
            continue
        m = re.match(r"^(#{1,6})\s+(.*)", line)
        if m and not in_code:
            secs.append(cur)
            cur = {"title": m.group(2).strip(), "level": len(m.group(1)), "line": i, "text": [], "code": [], "bullets": []}
            continue
        cur["text"].append(line)
        if in_code:
            cur["code"].append(line)
        else:
            b = BULLET.match(line)
            if b:
                cur["bullets"].append((i, b.group(1)))
    secs.append(cur)
    out = []
    for s in secs:
        if s["level"] == 0 and not any(t.strip() for t in s["text"]):
            continue
        txt = "\n".join(s["text"])
        s["tokens"] = est_tokens(txt)
        s["code_tokens"] = est_tokens("\n".join(s["code"]))
        s["hint"] = hint_for(s["title"]) if s["level"] else "-"
        out.append(s)
    return out


def norm(s: str) -> str:
    s = re.sub(r"[`*_>#\[\]()]", "", s.lower())
    s = re.sub(r"[^\w\s가-힯]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def find_duplicates(bullets, ratio=0.75, min_len=20, cap=30):
    """규칙성 줄(불릿·번호) 쌍별 유사도. ponytail: O(n²) — SKILL.md 규모(수백 줄)에선 충분"""
    items = [(ln, raw, norm(raw)) for ln, raw in bullets]
    items = [it for it in items if len(it[2]) >= min_len]
    pairs = []
    for a in range(len(items)):
        for b in range(a + 1, len(items)):
            r = difflib.SequenceMatcher(None, items[a][2], items[b][2]).ratio()
            if r >= ratio:
                pairs.append((r, items[a][0], items[b][0], items[a][1], items[b][1]))
    pairs.sort(reverse=True)
    return pairs[:cap]


def lazy_files(skill_dir: Path, skill_text: str):
    out = []
    for p in sorted(skill_dir.rglob("*")):
        if not p.is_file() or p.name in SKIP_FILES or SKIP_PARTS & set(p.parts):
            continue
        rel = p.relative_to(skill_dir).as_posix()
        try:
            txt = p.read_text(encoding="utf-8", errors="replace")
        except OSError:
            txt = ""
        referenced = rel in skill_text or p.name in skill_text
        out.append({"rel": rel, "tokens": est_tokens(txt), "referenced": referenced})
    return out


def analyze(target: Path) -> dict:
    target = Path(target)
    skill_dir = target if target.is_dir() else target.parent
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.is_file():
        raise FileNotFoundError(f"SKILL.md not found under {skill_dir}")
    text = skill_md.read_text(encoding="utf-8", errors="replace")
    fm, body, fm_lines = split_frontmatter(text)
    desc = ""
    if fm:
        m = re.search(r"^description:\s*(.*)$", fm, re.M)
        desc = m.group(1).strip() if m else ""
    secs = parse_sections(body, fm_lines)
    bullets = [b for s in secs for b in s["bullets"]]
    stays = sum(s["tokens"] for s in secs if s["hint"] in ("HOT", "-"))
    moves = sum(s["tokens"] for s in secs if s["hint"] in ("EXAMPLE", "COLD"))
    return {
        "dir": str(skill_dir),
        "name": skill_dir.name,
        "lines": text.count("\n") + 1,
        "always_on": est_tokens(text),
        "fm_chars": len(fm) if fm else 0,
        "desc_chars": len(desc),
        "has_fm": fm is not None,
        "sections": secs,
        "dups": find_duplicates(bullets),
        "lazy": lazy_files(skill_dir, text),
        "stays": stays,
        "moves": moves,
    }


def render(r: dict) -> str:
    L = []
    L.append(f"# skill-optimize measure: {r['name']}  ({r['dir']})")
    total_all = r["always_on"] + sum(f["tokens"] for f in r["lazy"])
    L.append(f"SKILL.md: {r['lines']} lines / ~{r['always_on']:,} tokens (always-on)")
    L.append(f"total (SKILL.md + lazy files): ~{total_all:,} tokens  <- 전/후 비교: 크게 줄었으면 내용 유실·압축 의심")
    if r["has_fm"]:
        warn = "  WARN frontmatter >1024 chars" if r["fm_chars"] > 1024 else ""
        warn += "  WARN description >500 chars" if r["desc_chars"] > 500 else ""
        L.append(f"frontmatter: {r['fm_chars']} chars, description {r['desc_chars']} chars{warn}")
    else:
        L.append("frontmatter: MISSING")
    if r["lazy"]:
        L.append("lazy files (loaded on demand):")
        for f in r["lazy"]:
            flag = "" if f["referenced"] else "   <-- ORPHAN (SKILL.md가 참조하지 않음)"
            L.append(f"  {f['rel']:<40} ~{f['tokens']:>6,} tok{flag}")
    else:
        L.append("lazy files: none (모든 내용이 always-on)")
    L.append("")
    L.append("## sections (hint는 헤딩 기반 추정 — 최종 Hot/Warm/Cold 판정은 본문을 읽고 한다)")
    L.append(f"{'line':>5} {'lvl':>3} {'tokens':>7} {'code%':>5} {'bul':>3} {'hint':<8} title")
    for s in r["sections"]:
        code_pct = round(100 * s["code_tokens"] / s["tokens"]) if s["tokens"] else 0
        L.append(f"{s['line']:>5} {s['level']:>3} {s['tokens']:>7,} {code_pct:>4}% {len(s['bullets']):>3} {s['hint']:<8} {s['title'][:70]}")
    L.append("")
    L.append("## duplicate-candidate lines (similarity >= 0.75)")
    if r["dups"]:
        for ratio, a, b, ra, rb in r["dups"]:
            L.append(f"  L{a} ~ L{b} ({ratio:.2f})")
            L.append(f"      {ra.strip()[:110]}")
            L.append(f"      {rb.strip()[:110]}")
    else:
        L.append("  none")
    L.append("")
    total = r["stays"] + r["moves"] or 1
    L.append("## projection (hint 기준 가정: EXAMPLE/COLD 섹션을 references로 이동)")
    L.append(f"  stays ~{r['stays']:,} tok / moves ~{r['moves']:,} tok  -> always-on -{round(100 * r['moves'] / total)}%")
    return "\n".join(L)


def selftest():
    with tempfile.TemporaryDirectory() as td:
        d = Path(td) / "t"
        (d / "references").mkdir(parents=True)
        (d / "SKILL.md").write_text(
            "---\nname: t\ndescription: Use when testing\n---\n# T\nintro\n"
            "## Core Rules\n- Do not modify files outside the requested scope of work\n"
            "- Never modify files that are outside the requested scope of the work\n"
            "## Workflow\n1. read `references/used.md`\n"
            "## Examples\n```py\n# not a heading\nprint(1)\n```\n"
            "## Troubleshooting\n- x\n", encoding="utf-8")
        (d / "references" / "used.md").write_text("u", encoding="utf-8")
        (d / "references" / "orphan.md").write_text("o", encoding="utf-8")
        r = analyze(d)
        hints = {s["title"]: s["hint"] for s in r["sections"]}
        assert hints["Core Rules"] == "HOT" and hints["Examples"] == "EXAMPLE" and hints["Troubleshooting"] == "COLD", hints
        assert "# not a heading" not in hints, "code block heading leaked"
        assert r["dups"] and r["dups"][0][1] == 8 and r["dups"][0][2] == 9, r["dups"]
        assert [f["rel"] for f in r["lazy"] if not f["referenced"]] == ["references/orphan.md"], r["lazy"]
        assert r["always_on"] > 0 and r["moves"] > 0 and r["has_fm"]
        assert est_tokens("한글") > est_tokens("ab")
        render(r)
    print("selftest OK")


def main(argv):
    if "--selftest" in argv:
        return selftest()
    out = argv[argv.index("--out") + 1] if "--out" in argv else None
    args = [a for a in argv if not a.startswith("--") and a != out]
    if not args:
        print(__doc__)
        return 2
    r = analyze(Path(args[0]))
    text = render(r)
    if out:
        Path(out).write_text(text + "\n", encoding="utf-8")
        print(f"written: {out}")
    else:
        print(text)


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    sys.exit(main(sys.argv[1:]))
