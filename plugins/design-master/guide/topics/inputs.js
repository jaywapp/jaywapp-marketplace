/* Topic: 입력 (inputs). Reference: plugins/design-master/references/inputs.md (sections B and C)
   Every selector starts with .t-inputs-<element>. Keyframe names start with "in". */
(function () {
  const f = n => +n.toFixed(2);
  const kfs = (name, frames) => `@keyframes ${name}{${frames.map(([p, c]) => `${[].concat(p).map(f).join('%,')}%{${c}}`).join('')}}`;
  /* on/off windows [[from, to], ...] in percent, 1% fades. First window may start at 0, last may end at 100. */
  function win(name, wins, on, off) {
    const fr = [];
    if (wins[0][0] > 0) fr.push([0, off]);
    wins.forEach(([a, b]) => {
      if (a > 0) fr.push([a - 1, off]);
      fr.push([Math.max(a, 0), on]);
      if (b < 100) fr.push([b, on], [b + 1, off]); else fr.push([100, on]);
    });
    if (wins[wins.length - 1][1] < 100) fr.push([100, off]);
    return kfs(name, fr);
  }
  const vis = (name, wins) => win(name, wins, 'opacity:1', 'opacity:0');
  /* typewriter reveal: letters appear in n steps between a and b, text hidden at `hide` */
  const typ = (name, a, b, hide, n) => kfs(name, [
    [[0, a - 0.1], 'opacity:0;clip-path:inset(0 100% 0 0)'],
    [a, `opacity:1;clip-path:inset(0 100% 0 0);animation-timing-function:steps(${n},end)`],
    [[b, hide], 'opacity:1;clip-path:inset(0 0 0 0)'],
    [hide + 0.1, 'opacity:0;clip-path:inset(0 0 0 0)'],
    [[hide + 1.1, 100], 'opacity:0;clip-path:inset(0 100% 0 0)']
  ]);

  const T = id => `.t-inputs-${id}`;
  const form = (K, title) => K.app.status() + K.app.bar(title, [], { back: true });
  const cy = Y => f(Y + 2.05);
  const go = label => `<div class="go">${label}</div>`;

  const base = id => `
${T(id)} .g{position:absolute;left:1em;right:1em}
${T(id)} .lbl{display:block;font-style:normal;font-size:.6em;line-height:1;font-weight:700;color:var(--a-mut);margin:0 0 .5em 0}
${T(id)} .fd{position:relative;height:2.3em;border:.07em solid #cfcfca;border-radius:.5em;background:#fff}
${T(id)} .tx{position:absolute;z-index:1;left:.8em;top:0;height:100%;display:flex;align-items:center;font-size:.74em;white-space:nowrap}
${T(id)} .ring{position:absolute;inset:-.07em;border-radius:.5em;border:.12em solid var(--a-brand);opacity:0;pointer-events:none}
${T(id)} .hp{position:relative;height:1.3em;margin-top:.3em}
${T(id)} .hp span{position:absolute;left:.1em;top:0;font-size:.6em;color:var(--a-mut);white-space:nowrap}
${T(id)} .go{position:absolute;left:1.39em;right:1.39em;bottom:1.39em;height:3.33em;border-radius:.83em;background:var(--a-brand);color:#fff;display:grid;place-items:center;font-size:.72em;font-weight:700}
${T(id)} .caret{position:absolute;z-index:2;top:50%;margin-top:-.52em;width:.07em;height:1.05em;background:var(--a-brand);opacity:0;animation-duration:var(--cyc),1s;animation-timing-function:linear,steps(1)}
`;

  /* ---- element-specific data ---- */
  const OTP = ['4', '8', '2', '9', '1', '7'];
  const OTP_AT = [14, 24, 34, 44, 54, 64];
  const KEYX = [2.88, 8, 13.12], KEYY = [14.74, 16.56, 18.38, 20.2];
  const keyPos = d => d === '0' ? [KEYX[1], KEYY[3]] : [KEYX[(+d - 1) % 3], KEYY[Math.floor((+d - 1) / 3)]];
  const PW_DOTS = 12;
  const pwAt = i => 10 + i * 6.5;
  const SELECT = ['채소', '유제품', '정육', '과일', '기타'];

  UIGuide.registerTopic({
    id: 'inputs',
    intro: '글자를 받는 입력 칸과 그 주변 연출이에요. 칸 상태를 분명히 보여 주고, 연출은 입력을 돕는 데만 써요.',
    elements: [
      {
        id: 'text-field-states', ko: '텍스트 필드 상태', en: 'Text field states', aka: ['입력 칸', 'input', 'text field', '포커스', '오류 상태'],
        when: '모든 폼. 입력 칸이 기본, 포커스, 입력됨, 오류, 비활성 등 어떤 상태인지 보여 줄 때',
        avoid: '플레이스홀더를 라벨로 대신하는 구성(입력을 시작하면 안내가 사라져요)',
        notes: [
          '라벨은 칸 위에 항상 보이게 해요. 플로팅 라벨도 입력 후 작게 남아야 해요.',
          '높이 44~56px, 글자 16px 이상(iOS 줌 방지). 포커스는 테두리 2px에 색 변화를 줘요.',
          '오류는 테두리, 아이콘, 문구를 모두 써요. 도움말 자리를 오류 문구로 바꿔요.',
          '적절한 type, inputmode, autocomplete로 모바일 키보드를 맞춰요.'
        ],
        vs: { topic: 'confusable-pairs', id: 'placeholder-label', name: '플레이스홀더 vs 라벨', text: '플레이스홀더는 입력 예시일 뿐이고, 라벨은 입력 중에도 남아 칸의 이름을 알려요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4200,
          phases: [['기본', 0, 700], ['포커스·입력', 800, 3400], ['오류', 3500, 4800], ['비활성', 4800, 5800]],
          alt: '수량 칸이 기본 상태에서 눌리면 주황 테두리로 강조되며 3개가 입력되고, 이어서 붉은 테두리와 오류 문구, 마지막으로 잠긴 비활성 상태로 바뀌며 아래 알약이 현재 상태를 알려 주는 시연',
          html: K => form(K, '항목 추가') +
            '<div class="g" style="top:5em"><em class="lbl">수량</em><div class="fd"><span class="dis"></span>' +
            '<span class="tx v0">예: 2모</span><span class="tx v1">3개</span><span class="tx v2">세 개</span><span class="tx v3">3개</span>' +
            '<i class="caret c1" style="left:.8em"></i><i class="caret c2" style="left:2.05em"></i><span class="ring rf"></span><span class="ring re"></span>' +
            `<span class="ic">${K.icon('alert')}</span><span class="lk">${K.icon('lock')}</span></div>` +
            '<div class="hp"><span class="h0">예: 2모, 3개처럼 적어요</span><span class="h1">숫자만 입력해 주세요</span><span class="h2">지금은 수정할 수 없어요</span></div></div>' +
            '<div class="pl"><i>기본</i><i>포커스</i><i>입력됨</i><i>오류</i><i>비활성</i></div>' + go('저장') + K.tap(8, cy(5), 'tp')
        }
      },
      {
        id: 'select', ko: '셀렉트', en: 'Select', aka: ['드롭다운', '선택 상자', 'dropdown', 'picker'],
        when: '선택지가 대략 5~15개이고 공간이 부족할 때(국가, 연도, 정렬)',
        avoid: '선택지 2~4개(라디오나 세그먼트), 15개 초과(검색 가능한 콤보박스), 메뉴 명령 모음(드롭다운 메뉴)',
        notes: [
          '모바일에서는 기본 select가 시스템 피커를 열어 가장 안정적이에요.',
          '직접 만들면 위아래, Enter, Esc, 글자 입력 이동과 aria-expanded를 구현해야 해요.',
          '현재 선택값을 항상 보이게 하고, 기본값이 없으면 ‘선택해 주세요’ 안내를 써요.'
        ],
        vs: { topic: 'confusable-pairs', id: 'dropdown-select', name: '드롭다운 메뉴 vs 셀렉트', text: '셀렉트는 값을 하나 고르는 입력이고, 드롭다운 메뉴는 명령을 모아 놓은 메뉴예요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 1900,
          phases: [['열기', 500, 900], ['선택지 유지', 900, 2700], ['닫힘', 2700, 2900]],
          alt: '분류 칸을 누르면 아래로 선택지 목록이 펼쳐지고 화살표가 뒤집히며, 유제품을 고르면 목록이 닫히고 칸에 유제품이 채워지는 시연',
          html: K => form(K, '항목 추가') +
            '<div class="g" style="top:5em"><em class="lbl">분류</em><div class="fd"><span class="tx v0">선택해 주세요</span><span class="tx v1">유제품</span><span class="ring rf"></span>' +
            `<span class="chev">${K.icon('chevD')}</span></div></div>` + go('목록에 담기') +
            '<div class="mn">' + SELECT.map((t, i) => `<div class="op o${i}"><span>${t}</span><span class="ck">${K.icon('check')}</span></div>`).join('') + '</div>' +
            K.tap(8, cy(5), 'tp1') + K.tap(6, 11.57, 'tp2')
        }
      },
      {
        id: 'otp-code', ko: 'OTP 코드', en: 'OTP code', aka: ['인증 코드', '인증 번호', 'one-time code', 'verification code'],
        when: '문자나 이메일로 받은 인증 번호 6자리 안팎을 입력할 때',
        avoid: '접근성 대책 없이 칸마다 따로 입력 요소를 두는 구성(하나의 입력으로 만들거나 autocomplete를 지정해요)',
        notes: [
          'autocomplete="one-time-code"를 지정해 문자 자동 채움이 되게 해요. 숫자 키패드는 inputmode="numeric"이에요.',
          '붙여넣기하면 전체를 칸에 나눠 넣고, 백스페이스는 앞 칸으로 돌아가요.',
          '칸 크기는 44px 이상으로 해요. 입력을 막거나 늦추는 연출은 쓰지 않아요.'
        ],
        vs: { id: 'text-field-states', text: '일반 텍스트 필드는 칸 하나에 이어 쓰고, OTP는 글자마다 칸이 나뉘어 자동으로 다음 칸으로 넘어가요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4700,
          phases: [['입력', 800, 4000], ['확인', 4300, 5300], ['초기화', 5400, 5700]],
          alt: '숫자 키패드에서 4, 8, 2, 9, 1, 7을 누를 때마다 인증 코드 칸이 하나씩 채워지며 활성 칸이 오른쪽으로 넘어가고, 여섯 칸이 차면 ‘인증됐어요’가 나타나는 시연',
          html: K => form(K, '인증') +
            '<div class="hd"><b>인증 코드를 입력해 주세요</b><p>문자로 받은 6자리 숫자예요</p></div>' +
            OTP.map((d, i) => `<div class="bx" style="left:${f(0.7 + i * 2.5)}em"><span class="dg d${i}">${d}</span><span class="ac a${i}"></span><span class="gr"></span></div>`).join('') +
            `<div class="okp">${K.icon('checkCircle')}<span>인증됐어요</span></div>` +
            '<div class="kp">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '지움'].map(k => `<span class="ky${k ? '' : ' em'}">${k}</span>`).join('') + '</div>' +
            OTP.map((d, i) => { const [x, y] = keyPos(d); return K.tap(x, y, 'p' + i); }).join('')
        }
      },
      {
        id: 'card-number', ko: '카드 번호', en: 'Card number', aka: ['결제 카드', 'credit card', 'cc-number'],
        when: '결제 폼에서 카드 번호를 4자리씩 묶어 입력받고 만료일로 이어질 때',
        avoid: '카드 번호를 로그나 분석 도구에 남기는 구현',
        notes: [
          '입력 중 공백을 넣어도 커서가 튀지 않게 해요. autocomplete는 cc-number, cc-exp예요.',
          '카드 종류 아이콘은 보조 정보로만 써요.',
          '만료일 칸으로 자동 이동하되 사용자가 되돌아가 고칠 수 있게 해요.'
        ],
        vs: { id: 'otp-code', text: '카드 번호는 칸 하나에 4자리씩 띄어 쓰고, OTP는 글자마다 칸이 따로 있어요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4300,
          phases: [['번호 입력', 600, 3000], ['만료일로 이동', 3100, 3500], ['만료일 입력', 3500, 5200]],
          alt: '카드 번호 칸에 4자리씩 네 묶음이 차례로 채워지고 카드 아이콘이 나타난 뒤, 강조 테두리가 만료일 칸으로 넘어가 08/29가 입력되는 시연',
          html: K => form(K, '카드 등록') +
            '<div class="g" style="top:5em"><em class="lbl">카드 번호</em><div class="fd"><span class="dis"></span>' +
            '<span class="tx cn"><span class="gp q0">4821</span><span class="gp q1">0375</span><span class="gp q2">9163</span><span class="gp q3">2048</span></span>' +
            '<span class="tx cph">0000 0000 0000 0000</span><span class="ring rf"></span>' +
            '<svg class="cdg" viewBox="0 0 24 16" aria-hidden="true"><rect x="1" y="1" width="22" height="14" rx="2.5"/><path d="M1 6h22"/></svg></div></div>' +
            '<div class="g ge" style="top:9.4em"><em class="lbl">만료일</em><div class="fd"><span class="tx pe">MM/YY</span><span class="tx te">08/29</span><span class="ring rf2"></span></div></div>' +
            '<div class="g gc" style="top:9.4em"><em class="lbl">보안 코드</em><div class="fd"><span class="tx pe2">CVC</span></div></div>' +
            '<p class="ht">4자리마다 띄어 쓰고, 다 쓰면 만료일 칸으로 넘어가요.</p>' + go('카드 등록') + K.tap(8, cy(5), 'tp')
        }
      },
      {
        id: 'strength-meter', ko: '강도 표시', en: 'Strength meter', aka: ['비밀번호 강도', 'password strength', '강도 표시기'],
        when: '회원가입, 비밀번호 변경에서 입력되는 동안 안전도를 4단계 막대로 보여 줄 때',
        avoid: '막대만 보여 주고 어떻게 고쳐야 하는지 알려 주지 않는 구성',
        notes: [
          '색만이 아니라 약함, 보통, 강함 같은 글자를 함께 써요.',
          '규칙 나열(대문자 포함 등)보다 길이를 우선 평가해요.',
          'aria-live="polite"로 단계 변경을 알리고, 비밀번호 보기 토글을 함께 둬요.'
        ],
        vs: { topic: 'indicators', id: 'strength', name: '강도 표시기', text: '인디케이터 주제의 강도 표시기가 같은 막대예요. 프로그레스 바는 진행 상태를, 강도 표시는 입력값의 안전도를 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4600,
          phases: [['약함', 1400, 2500], ['보통', 2500, 3700], ['강함', 3700, 4900], ['매우 강함', 4900, 5400]],
          alt: '비밀번호를 입력하는 동안 점이 하나씩 늘어나고 아래 4칸 막대가 빨강, 주황, 연두, 초록으로 채워지며 약함에서 매우 강함으로 글자가 바뀌는 시연',
          html: K => form(K, '회원가입') +
            '<div class="g" style="top:5em"><em class="lbl">비밀번호</em><div class="fd"><span class="dt">' + '<i></i>'.repeat(PW_DOTS) + '</span><span class="ring rf"></span><span class="ey">보기</span></div></div>' +
            '<div class="br"><i><b class="bf0"></b></i><i><b class="bf1"></b></i><i><b class="bf2"></b></i><i><b class="bf3"></b></i></div>' +
            '<div class="lv"><em>강도</em><span class="ls"><span class="s1">약함</span><span class="s2">보통</span><span class="s3">강함</span><span class="s4">매우 강함</span></span></div>' +
            '<p class="hn">길이가 길수록 더 안전해요.</p>' + go('가입하기') + K.tap(8, cy(5), 'tp')
        }
      },
      {
        id: 'auto-grow', ko: '자동 늘어남', en: 'Auto grow', aka: ['자동 높이', 'autosize', 'textarea', '여러 줄 입력'],
        when: '채팅 입력, 댓글, 메모처럼 줄이 늘어날수록 입력 칸이 따라 커져야 할 때',
        avoid: '최대 높이 없이 끝없이 커지는 구성(넘으면 내부 스크롤)',
        notes: [
          '최대 높이(예: 5~8줄)를 두고 넘으면 내부 스크롤로 바꿔요.',
          'field-sizing: content는 지원이 제한적이니 대체 구현을 준비해요.',
          '높이가 바뀔 때 주변 레이아웃이 튀지 않게 하고, 전송 후에는 한 줄로 되돌려요.'
        ],
        vs: { id: 'text-field-states', text: '일반 한 줄 입력은 높이가 고정이고, 자동 늘어남은 내용에 맞춰 위로 커져요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3900,
          phases: [['한 줄', 700, 1900], ['두 줄', 1900, 3100], ['세 줄', 3100, 4700], ['전송 후 한 줄', 4800, 5700]],
          alt: '채팅 입력 칸에 글을 쓰다 줄이 바뀔 때마다 칸이 위로 커져 세 줄이 되고, 전송 버튼을 누르면 말풍선이 올라가며 입력 칸이 다시 한 줄로 줄어드는 시연',
          html: K => K.app.status() + K.app.bar('가족 채팅', ['more'], { back: true }) +
            '<div class="rb">오늘 저녁 뭐 해 먹을까?</div><div class="sbb">카레 어때요? 감자랑 당근도 사다 줘요.</div>' +
            '<div class="bx bp"><span class="pt">메시지 입력</span></div>' +
            '<div class="bx b1"><span class="t1">카레 어때요?</span></div>' +
            '<div class="bx b2"><span class="ln">카레 어때요?</span><span class="t2">감자랑 당근도</span></div>' +
            '<div class="bx b3"><span class="ln">카레 어때요?</span><span class="ln">감자랑 당근도</span><span class="t3">사다 줘요.</span></div>' +
            `<span class="snd sd">${K.icon('send')}</span><span class="snd sa">${K.icon('send')}</span>` + K.tap(13.85, 19.08, 'tp')
        }
      },
      {
        id: 'tag-input', ko: '태그 입력', en: 'Tag input', aka: ['칩 입력', '태그', 'chips input', '수신자 입력'],
        when: '태그, 이메일 수신자 여러 명, 관심사처럼 단어를 여러 개 입력받을 때',
        avoid: '값이 하나뿐인 입력, 칩 개수나 중복 제한을 안내하지 않는 구성',
        notes: [
          '칩의 x 터치 영역은 44px 이상, 각 칩에 aria-label="삭제" 같은 이름을 줘요.',
          '백스페이스로 마지막 칩을 지우고, 붙여넣기는 여러 개로 나눠요.',
          '중복과 개수 제한은 인라인 안내로 알려요.'
        ],
        vs: { topic: 'confusable-pairs', id: 'chip-badge', name: '칩 vs 배지', text: '입력한 단어가 칩으로 바뀌어 지울 수 있다는 점이 달라요. 배지는 개수만 알리는 표시예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3600,
          phases: [['입력', 600, 2700], ['칩 삭제', 3500, 4100], ['백스페이스', 4700, 5100]],
          alt: '태그 칸에 냉장을 치고 Enter를 누르면 칩이 되고, 유기농을 치고 쉼표를 누르면 두 번째 칩이 생기며, x를 누르면 칩이 지워지고 백스페이스로 마지막 칩도 지워지는 시연',
          html: K => form(K, '항목 추가') +
            '<div class="g" style="top:5em"><em class="lbl">이름</em><div class="fd"><span class="tx">두부</span></div></div>' +
            '<div class="g" style="top:9.6em"><em class="lbl">태그</em><div class="fd">' +
            '<span class="tx ty ty1">냉장</span><span class="tx ty ty2" style="left:5.8em">유기농</span>' +
            `<span class="cw c1" style="left:.6em"><span class="chip">냉장<i>${K.icon('x')}</i></span></span>` +
            `<span class="cw c2" style="left:4.1em"><span class="chip">유기농<i>${K.icon('x')}</i></span></span>` +
            '<span class="ring rf"></span></div><div class="hp"><span>Enter나 쉼표를 누르면 태그가 돼요</span></div></div>' +
            '<span class="kb k1">Enter</span><span class="kb k2">쉼표 ,</span><span class="kb k3">Backspace</span>' + go('목록에 담기') +
            K.tap(8, cy(9.6), 'tp1') + K.tap(8.2, cy(9.6), 'tp2')
        }
      },
      {
        id: 'ghost-complete', ko: '고스트 자동완성', en: 'Ghost complete', aka: ['자동완성', 'inline autocomplete', 'typeahead', '예측 입력'],
        when: '명령 입력, 검색창, 이메일 도메인 완성처럼 입력이 예측 가능한 곳',
        avoid: '모바일 터치 중심 화면(Tab 키가 없어요. 제안 칩이나 → 버튼을 둬요)',
        notes: [
          '제안 글자는 입력 글자와 같은 폰트와 위치에 겹치고 대비는 낮추되 읽을 수 있게 해요.',
          '확정 방법을 힌트로 알려요(Tab).',
          '스크린 리더에는 aria-autocomplete와 제안을 aria-live로 전달하는 방안을 써요.'
        ],
        vs: { id: 'text-field-states', text: '일반 입력은 친 글자만 보이고, 고스트 자동완성은 뒤에 회색 제안이 겹쳐 보이다 Tab으로 확정돼요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 1900,
          phases: [['입력', 600, 900], ['제안 표시', 900, 2400], ['확정', 2450, 2700], ['유지', 2700, 4400]],
          alt: '항목 이름 칸에 참을 치면 뒤에 회색으로 기름 제안이 겹쳐 보이고 Tab 힌트가 뜨며, Tab을 누르면 제안이 진한 글자로 바뀌어 참기름으로 확정되는 시연',
          html: K => form(K, '항목 추가') +
            '<div class="g" style="top:5em"><em class="lbl">항목 이름</em><div class="fd"><span class="tx"><span class="ty">참</span><i class="gcar"></i><span class="gs">기름</span></span>' +
            '<span class="ring rf"></span><span class="tabh">Tab</span></div></div>' +
            '<p class="ht">터치 화면에서는 제안 칩이나 → 버튼을 함께 둬요.</p>' + go('목록에 담기') + K.tap(8, cy(5), 'tp')
        }
      }
    ],
    css: K => {
      const out = [];
      out.push('@keyframes inBlink{0%{visibility:visible}50%{visibility:hidden}}');

      /* text-field-states */
      let t = T('text-field-states');
      out.push(base('text-field-states'));
      out.push(`
${t} .tx{font-size:.74em}
${t} .v0,${t} .v3{color:#9a9b96}
${t} .v0{animation-name:inTfV0}${t} .v1{animation-name:inTfV1}${t} .v2{animation-name:inTfV2}${t} .v3{animation-name:inTfV3}
${t} .dis{position:absolute;inset:-.07em;border-radius:.5em;background:#eeeeeb;opacity:0;animation-name:inTfDis}
${t} .rf{animation-name:inTfRf}
${t} .re{border-color:var(--a-err);animation-name:inTfRe}
${t} .ic,${t} .lk{position:absolute;right:.7em;top:50%;margin-top:-.5em;width:1em;height:1em;opacity:0}
${t} .ic .k-i,${t} .lk .k-i{display:block}
${t} .ic{color:var(--a-err);animation-name:inTfIc}
${t} .lk{color:#9a9b96;animation-name:inTfLk}
${t} .caret{animation-name:inTfC1,inBlink}${t} .c2{animation-name:inTfC2,inBlink}
${t} .h0{animation-name:inTfH0}${t} .h1{color:var(--a-err);font-weight:700;opacity:0;animation-name:inTfH1}${t} .h2{opacity:0;animation-name:inTfH2}
${t} .pl{position:absolute;left:1em;right:1em;top:10.6em;display:flex;gap:.35em}
${t} .pl i{font-style:normal;font-size:.58em;padding:.4em .85em;border-radius:2em;background:var(--a-soft);color:var(--a-mut);font-weight:700}
${t} .pl i:nth-child(1){animation-name:inTfP0}${t} .pl i:nth-child(2){animation-name:inTfP1}${t} .pl i:nth-child(3){animation-name:inTfP2}${t} .pl i:nth-child(4){animation-name:inTfP3}${t} .pl i:nth-child(5){animation-name:inTfP4}
${t} .tp{animation-name:inTfTap}
${vis('inTfV0', [[0, 12], [98, 100]])}
${typ('inTfV1', 20, 25, 57, 2)}
${vis('inTfV2', [[58, 80]])}
${vis('inTfV3', [[81, 96]])}
${vis('inTfDis', [[81, 96]])}
${vis('inTfRf', [[14, 56]])}
${vis('inTfRe', [[60, 80]])}
${vis('inTfIc', [[60, 80]])}
${vis('inTfLk', [[81, 96]])}
${vis('inTfC1', [[14, 19]])}
${vis('inTfC2', [[26, 38]])}
${vis('inTfH0', [[0, 58], [98, 100]])}
${vis('inTfH1', [[60, 80]])}
${vis('inTfH2', [[82, 96]])}
${(() => { const on = 'background:var(--a-brand);color:#fff', off = 'background:var(--a-soft);color:var(--a-mut)';
  return [win('inTfP0', [[0, 12], [97, 100]], on, off), win('inTfP1', [[13, 38]], on, off), win('inTfP2', [[39, 58]], on, off), win('inTfP3', [[59, 80]], on, off), win('inTfP4', [[81, 96]], on, off)].join('\n'); })()}
${K.kf.tap('inTfTap', 12)}
`);

      /* select */
      t = T('select');
      out.push(base('select'));
      out.push(`
${t} .v0{color:#9a9b96;animation-name:inSelV0}${t} .v1{animation-name:inSelV1}
${t} .rf{animation-name:inSelRf}
${t} .chev{position:absolute;right:.7em;top:50%;margin-top:-.5em;width:1em;height:1em;color:var(--a-mut);animation-name:inSelChev}
${t} .chev .k-i{display:block}
${t} .mn{position:absolute;z-index:5;left:1em;right:1em;top:8.5em;background:#fff;border:.07em solid var(--a-line);border-radius:.6em;overflow:hidden;box-shadow:0 .5em 1.4em rgba(20,20,22,.16);opacity:0;transform-origin:top;animation-name:inSelMn}
${t} .op{height:2em;display:flex;align-items:center;justify-content:space-between;padding:0 .9em}
${t} .op span:first-child{font-size:.72em}
${t} .op .ck{width:1em;height:1em;color:var(--a-brand);opacity:0}
${t} .op .ck .k-i{display:block}
${t} .o1{animation-name:inSelHi}${t} .o1 .ck{animation-name:inSelCk}
${t} .tp1{animation-name:inSelT1}${t} .tp2{animation-name:inSelT2}
${vis('inSelV0', [[0, 50], [94, 100]])}
${vis('inSelV1', [[52, 92]])}
${vis('inSelRf', [[14, 56]])}
${kfs('inSelChev', [[[0, 13], 'transform:none'], [[18, 54], 'transform:rotate(180deg)'], [[58, 100], 'transform:none']])}
${kfs('inSelMn', [[[0, 13], 'opacity:0;transform:scaleY(.92) translateY(-.4em)'], [[18, 54], 'opacity:1;transform:none'], [[58, 100], 'opacity:0;transform:scaleY(.92) translateY(-.4em)']])}
${win('inSelHi', [[46, 55]], 'background:var(--a-soft)', 'background:transparent')}
${vis('inSelCk', [[47, 55]])}
${K.kf.tap('inSelT1', 12)}
${K.kf.tap('inSelT2', 46)}
`);

      /* otp-code */
      t = T('otp-code');
      out.push(`
${t} .hd{position:absolute;left:0;right:0;top:5em;text-align:center}
${t} .hd b{display:block;font-size:.9em}
${t} .hd p{margin:.4em 0 0;font-size:.62em;color:var(--a-mut)}
${t} .bx{position:absolute;top:8.4em;width:2.1em;height:2.6em;display:grid;place-items:center;border:.08em solid #cfcfca;border-radius:.5em;background:#fff}
${t} .dg{font-size:1.1em;font-weight:700;opacity:0}
${t} .ac,${t} .gr{position:absolute;inset:-.08em;border-radius:.5em;border:.12em solid var(--a-brand);opacity:0}
${t} .gr{border-color:var(--a-ok);animation-name:inOtpGr}
${t} .okp{position:absolute;left:50%;top:18.03em;transform:translateX(-50%);display:flex;align-items:center;gap:.3em;color:var(--a-ok);font-size:.66em;font-weight:700;white-space:nowrap;opacity:0;animation-name:inOtpOk}
${t} .okp .k-i{width:1.2em;height:1.2em}
${t} .kp{position:absolute;left:0;right:0;bottom:0;top:13.6em;background:#e6e6e3;display:grid;grid-template-columns:repeat(3,1fr);gap:.35em;padding:.4em .5em}
${t} .ky{display:grid;place-items:center;border-radius:.4em;background:#fff;font-size:.8em;font-weight:700}
${t} .ky.em{background:transparent}
${OTP.map((d, i) => `${t} .d${i}{animation-name:inOtpD${i}}${t} .a${i}{animation-name:inOtpA${i}}${t} .p${i}{animation-name:inOtpP${i}}`).join('\n')}
${OTP.map((d, i) => kfs('inOtpD' + i, [[[0, OTP_AT[i] - 0.5], 'opacity:0;transform:scale(.6)'], [OTP_AT[i] + 2, 'opacity:1;transform:scale(1)'], [89, 'opacity:1;transform:scale(1)'], [[90, 100], 'opacity:0;transform:scale(1)']])).join('\n')}
${OTP.map((d, i) => vis('inOtpA' + i, [[Math.max(OTP_AT[i] - 10, 3), OTP_AT[i]]])).join('\n')}
${OTP.map((d, i) => K.kf.tap('inOtpP' + i, OTP_AT[i] - 1)).join('\n')}
${vis('inOtpGr', [[70, 88]])}
${vis('inOtpOk', [[72, 88]]).replace(/opacity:1/g, 'opacity:1;transform:translateX(-50%)').replace(/opacity:0/g, 'opacity:0;transform:translateX(-50%)')}
`);

      /* card-number */
      t = T('card-number');
      out.push(base('card-number'));
      out.push(`
${t} .ge{right:auto;width:6.4em}${t} .gc{left:8.6em}
${t} .cn{gap:.55em}
${t} .gp{display:inline-block;letter-spacing:.04em}
${t} .gp.q0{animation-name:inCnQ0}${t} .gp.q1{animation-name:inCnQ1}${t} .gp.q2{animation-name:inCnQ2}${t} .gp.q3{animation-name:inCnQ3}
${t} .cph{color:#b3b4af;animation-name:inCnPh}
${t} .rf{animation-name:inCnRf}${t} .rf2{animation-name:inCnRf2}
${t} .cdg{position:absolute;right:.7em;top:50%;margin-top:-.5em;width:1.4em;height:.95em;fill:none;stroke:var(--a-mut);stroke-width:1.5;opacity:0;animation-name:inCnCd}
${t} .pe,${t} .pe2{color:#b3b4af}
${t} .pe{animation-name:inCnPe}${t} .te{animation-name:inCnTe}
${t} .ht{position:absolute;left:1.67em;right:1.67em;top:22.67em;margin:0;font-size:.6em;color:var(--a-mut);line-height:1.45}
${t} .tp{animation-name:inCnTap}
${typ('inCnQ0', 10, 17, 89, 4)}
${typ('inCnQ1', 20, 27, 89, 4)}
${typ('inCnQ2', 30, 37, 89, 4)}
${typ('inCnQ3', 40, 47, 89, 4)}
${vis('inCnPh', [[0, 9], [93, 100]])}
${vis('inCnRf', [[8, 51]])}
${vis('inCnRf2', [[53, 86]])}
${vis('inCnCd', [[49, 89]])}
${vis('inCnPe', [[0, 56], [93, 100]])}
${typ('inCnTe', 58, 66, 89, 5)}
${K.kf.tap('inCnTap', 8)}
`);

      /* strength-meter */
      t = T('strength-meter');
      const C = { r: '#c22f29', o: '#d08a1c', l: '#5b9a3c', g: '#1d7a49' };
      const bar = (name, steps) => kfs(name, [[[0, steps[0][0] - 1], `opacity:0;background:${C.r}`]].concat(
        steps.map(([p, c]) => [p, `opacity:1;background:${C[c]}`]),
        [[90, `opacity:1;background:${C.g}`], [91, `opacity:0;background:${C.g}`], [100, `opacity:0;background:${C.r}`]]));
      out.push(base('strength-meter'));
      out.push(`
${t} .dt{position:absolute;left:.9em;top:0;height:100%;display:flex;align-items:center;gap:.3em}
${t} .dt i{width:.55em;height:.55em;border-radius:50%;background:var(--a-ink);opacity:0}
${Array.from({ length: PW_DOTS }, (_, i) => `${t} .dt i:nth-child(${i + 1}){animation-name:inPwD${i}}`).join('\n')}
${t} .rf{animation-name:inPwRf}
${t} .ey{position:absolute;right:.8em;top:0;height:100%;display:flex;align-items:center;font-size:.6em;color:var(--a-mut)}
${t} .br{position:absolute;left:1em;right:1em;top:9.2em;display:grid;grid-template-columns:repeat(4,1fr);gap:.35em}
${t} .br i{position:relative;height:.45em;border-radius:1em;background:var(--a-soft);overflow:hidden}
${t} .br b{position:absolute;inset:0;border-radius:1em;opacity:0}
${t} .bf0{animation-name:inPwB0}${t} .bf1{animation-name:inPwB1}${t} .bf2{animation-name:inPwB2}${t} .bf3{animation-name:inPwB3}
${t} .lv{position:absolute;left:1.52em;top:15.45em;display:flex;align-items:center;gap:.6em;font-size:.66em}
${t} .lv em{font-style:normal;color:var(--a-mut)}
${t} .ls{position:relative;display:block;width:8em;height:1.3em}
${t} .ls span{position:absolute;left:0;top:0;font-weight:700;opacity:0}
${t} .s1{color:${C.r};animation-name:inPwS1}${t} .s2{color:${C.o};animation-name:inPwS2}${t} .s3{color:${C.l};animation-name:inPwS3}${t} .s4{color:${C.g};animation-name:inPwS4}
${t} .hn{position:absolute;left:1.67em;right:1.67em;top:20.5em;margin:0;font-size:.6em;color:var(--a-mut)}
${t} .tp{animation-name:inPwTap}
${Array.from({ length: PW_DOTS }, (_, i) => vis('inPwD' + i, [[pwAt(i), 90]])).join('\n')}
${vis('inPwRf', [[8, 88]])}
${bar('inPwB0', [[23, 'r'], [41, 'r'], [42, 'o'], [61, 'o'], [62, 'l'], [81, 'l'], [82, 'g']])}
${bar('inPwB1', [[42, 'o'], [61, 'o'], [62, 'l'], [81, 'l'], [82, 'g']])}
${bar('inPwB2', [[62, 'l'], [81, 'l'], [82, 'g']])}
${bar('inPwB3', [[82, 'g']])}
${vis('inPwS1', [[23, 41]])}${vis('inPwS2', [[42, 61]])}${vis('inPwS3', [[62, 81]])}${vis('inPwS4', [[82, 90]])}
${K.kf.tap('inPwTap', 6)}
`);

      /* auto-grow */
      t = T('auto-grow');
      out.push(`
${t} .rb,${t} .sbb{position:absolute;font-size:.7em;line-height:1.4;padding:.6em .9em;border-radius:1.1em}
${t} .rb{left:1.43em;top:7.15em;background:var(--a-soft);border-top-left-radius:.3em}
${t} .sbb{right:1.43em;top:12.3em;max-width:13.5em;background:#f6d9ca;color:#5b2308;border-top-right-radius:.3em;animation-name:inAgSb}
${t} .bx{position:absolute;left:1em;right:3.9em;bottom:1.1em;padding:.65em .8em;border:.07em solid #cfcfca;border-radius:.7em;background:#fff;opacity:0}
${t} .bx span{display:block;font-size:.72em;line-height:1.4;white-space:nowrap}
${t} .pt{color:#9a9b96}
${t} .bp{animation-name:inAgP}${t} .b1{animation-name:inAgB1}${t} .b2{animation-name:inAgB2}${t} .b3{animation-name:inAgB3}
${t} .t1{animation-name:inAgT1}${t} .t2{animation-name:inAgT2}${t} .t3{animation-name:inAgT3}
${t} .snd{position:absolute;right:1em;bottom:1.1em;width:2.3em;height:2.3em;border-radius:50%;display:grid;place-items:center;opacity:0}
${t} .snd .k-i{width:1.1em;height:1.1em}
${t} .sd{background:var(--a-soft);color:#9a9b96;animation-name:inAgSd}${t} .sa{background:var(--a-brand);color:#fff;animation-name:inAgSa}
${t} .tp{animation-name:inAgTap}
${vis('inAgP', [[0, 9], [79, 100]])}
${vis('inAgB1', [[11, 31]])}${vis('inAgB2', [[32, 52]])}${vis('inAgB3', [[53, 78]])}
${typ('inAgT1', 12, 20, 31, 5)}${typ('inAgT2', 33, 41, 52, 5)}${typ('inAgT3', 54, 60, 78, 3)}
${vis('inAgSd', [[0, 10], [79, 100]])}${vis('inAgSa', [[11, 78]])}
${kfs('inAgSb', [[[0, 8], 'opacity:1;transform:none'], [10, 'opacity:0;transform:none'], [[11, 80], 'opacity:0;transform:translateY(.8em)'], [85, 'opacity:1;transform:none'], [100, 'opacity:1;transform:none']])}
${K.kf.tap('inAgTap', 77)}
`);

      /* tag-input */
      t = T('tag-input');
      out.push(base('tag-input'));
      out.push(`
${t} .ty::after{content:"";display:inline-block;width:.07em;height:1em;margin-left:.1em;background:var(--a-brand)}
${t} .ty1{animation-name:inTgY1}${t} .ty2{animation-name:inTgY2}
${t} .cw{position:absolute;z-index:1;top:0;height:100%;display:flex;align-items:center}
${t} .chip{display:inline-flex;align-items:center;gap:.35em;height:2.2em;padding:0 .55em 0 .8em;border-radius:1.1em;background:var(--a-soft);font-size:.66em;white-space:nowrap}
${t} .chip i{display:block;width:1em;height:1em;color:var(--a-mut)}
${t} .chip .k-i{display:block;width:1em;height:1em}
${t} .c1 .chip{animation-name:inTgC1}${t} .c2 .chip{animation-name:inTgC2}
${t} .rf{animation-name:inTgRf}
${t} .kb{position:absolute;left:50%;top:24.3em;transform:translateX(-50%);padding:.25em .9em;border-radius:.4em;background:var(--a-dark);color:#fff;font-size:.6em;font-weight:700;opacity:0;white-space:nowrap}
${t} .k1{animation-name:inTgK1}${t} .k2{animation-name:inTgK2}${t} .k3{animation-name:inTgK3}
${t} .tp1{animation-name:inTgT1}${t} .tp2{animation-name:inTgT2}
${typ('inTgY1', 10, 16, 21, 2)}
${typ('inTgY2', 28, 36, 44, 3)}
${kfs('inTgC1', [[[0, 21], 'opacity:0;transform:scale(.6)'], [25, 'opacity:1;transform:scale(1)'], [83, 'opacity:1;transform:scale(1)'], [[85, 100], 'opacity:0;transform:scale(.6)']])}
${kfs('inTgC2', [[[0, 44], 'opacity:0;transform:scale(.6)'], [48, 'opacity:1;transform:scale(1)'], [66, 'opacity:1;transform:scale(1)'], [[68, 100], 'opacity:0;transform:scale(.6)']])}
${vis('inTgRf', [[6, 88]])}
${(n => vis(n, [[19, 26]]).replace(/opacity:1/g, 'opacity:1;transform:translateX(-50%)').replace(/opacity:0/g, 'opacity:0;transform:translateX(-50%)'))('inTgK1')}
${(n => vis(n, [[42, 49]]).replace(/opacity:1/g, 'opacity:1;transform:translateX(-50%)').replace(/opacity:0/g, 'opacity:0;transform:translateX(-50%)'))('inTgK2')}
${(n => vis(n, [[77, 85]]).replace(/opacity:1/g, 'opacity:1;transform:translateX(-50%)').replace(/opacity:0/g, 'opacity:0;transform:translateX(-50%)'))('inTgK3')}
${K.kf.tap('inTgT1', 6)}
${K.kf.tap('inTgT2', 62)}
`);

      /* ghost-complete */
      t = T('ghost-complete');
      out.push(base('ghost-complete'));
      out.push(`
${t} .ty{animation-name:inGhTy}
${t} .gs{color:#b9bab5;animation-name:inGhGs}
${t} .gcar{display:inline-block;width:.07em;height:1.05em;background:var(--a-brand);animation-name:inGhCx,inBlink;animation-duration:var(--cyc),1s;animation-timing-function:linear,steps(1);margin-right:-.07em}
${t} .rf{animation-name:inGhRf}
${t} .tabh{position:absolute;right:.6em;top:50%;margin-top:-.7em;padding:.25em .6em;border:.07em solid #cfcfca;border-radius:.35em;background:#fff;color:var(--a-mut);font-size:.55em;font-weight:700;opacity:0;animation-name:inGhTab}
${t} .ht{position:absolute;left:1.67em;right:1.67em;top:15.33em;margin:0;font-size:.6em;color:var(--a-mut);line-height:1.45}
${t} .tp{animation-name:inGhTap}
${vis('inGhTy', [[12, 88]])}
${vis('inGhCx', [[12, 50]])}
${kfs('inGhGs', [[[0, 17.9], 'opacity:0;color:#b9bab5'], [18, 'opacity:1;color:#b9bab5'], [49, 'opacity:1;color:#b9bab5'], [51, 'opacity:1;color:var(--a-ink)'], [88, 'opacity:1;color:var(--a-ink)'], [89, 'opacity:0;color:var(--a-ink)'], [100, 'opacity:0;color:#b9bab5']])}
${vis('inGhRf', [[8, 88]])}
${kfs('inGhTab', [[[0, 18], 'opacity:0;background:#fff;color:var(--a-mut);transform:none'], [19, 'opacity:1;background:#fff;color:var(--a-mut);transform:none'], [48, 'opacity:1;background:#fff;color:var(--a-mut);transform:none'], [50, 'opacity:1;background:var(--a-ink);color:#fff;transform:scale(.92)'], [53, 'opacity:1;background:var(--a-ink);color:#fff;transform:scale(.92)'], [54, 'opacity:0;background:var(--a-ink);color:#fff;transform:none'], [100, 'opacity:0;background:#fff;color:var(--a-mut);transform:none']])}
${K.kf.tap('inGhTap', 8)}
`);

      return out.join('\n');
    }
  });
})();
