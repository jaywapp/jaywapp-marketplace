/* Topic: 제스처 (gestures). Reference: plugins/design-master/references/gestures.md
   Every selector starts with .t-gestures-<element>. Keyframe names start with "gs".
   Note: positioned boxes never set their own font-size, so em offsets are screen em. */
(function () {
  const f = n => +n.toFixed(2);
  const kfs = (name, frames) => `@keyframes ${name}{${frames.map(([p, c]) => `${[].concat(p).map(f).join('%,')}%{${c}}`).join('')}}`;
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

  const T = id => `.t-gestures-${id}`;
  const cap = text => `<span class="cap">${text}</span>`;
  const base = id => `
${T(id)} .cap{position:absolute;z-index:20;left:50%;bottom:.9em;transform:translateX(-50%);padding:.45em 1em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;font-size:.6em;font-weight:700;white-space:nowrap}
`;

  /* a small grocery photo drawn inline (no external image) */
  const photo = `<svg viewBox="0 0 130 97" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="130" height="97" fill="#eadfcf"/><rect y="66" width="130" height="31" fill="#d8c7a8"/>` +
    `<path d="M22 56h86l-7 30a6 6 0 0 1-6 5H35a6 6 0 0 1-6-5z" fill="#b98a55"/><path d="M26 66h78M29 77h72M48 56l3 35M65 56v35M82 56l-3 35" stroke="#9a6f3e" stroke-width="1.6" fill="none"/>` +
    `<circle cx="46" cy="50" r="15" fill="#c8402e"/><circle cx="72" cy="45" r="16" fill="#d24a36"/><circle cx="94" cy="51" r="13" fill="#b9362a"/>` +
    `<circle cx="41" cy="45" r="4" fill="#fff" opacity=".28"/><circle cx="67" cy="40" r="4.5" fill="#fff" opacity=".28"/><circle cx="90" cy="47" r="3.5" fill="#fff" opacity=".28"/>` +
    `<path d="M72 30c1-6 4-9 8-10" stroke="#5b4a2a" stroke-width="2" fill="none"/><ellipse cx="82" cy="22" rx="6" ry="3" fill="#5e8f3c" transform="rotate(-25 82 22)"/></svg>`;

  UIGuide.registerTopic({
    id: 'gestures',
    intro: '손가락으로 하는 조작이에요. 제스처는 숨은 조작이라 같은 일을 하는 눈에 보이는 버튼을 꼭 함께 둬요.',
    elements: [
      {
        id: 'tap', ko: '탭', en: 'Tap', aka: ['터치', '누르기', 'click'],
        when: '버튼, 링크, 항목 선택 등 모든 기본 행동',
        avoid: '오작동 위험이 큰 행동(삭제)을 탭 한 번으로 즉시 하는 것(확인이나 되돌리기가 필요해요)',
        notes: [
          '터치 영역은 44~48px, 인접 타깃 사이 간격은 8~12px로 해요.',
          '눌림에 즉시(100ms 이내) 반응해요.',
          '모바일 브라우저의 탭 지연은 touch-action: manipulation과 viewport 설정으로 막아요.'
        ],
        vs: { id: 'double-tap', text: '두 번 탭은 빠르게 두 번 눌러요. 탭은 한 번이고, 첫 탭에 바로 반응해요.' },
        demo: {
          frame: 'phone', cycle: 4000, still: 2000,
          phases: [['탭', 300, 700], ['반응', 700, 3400], ['되돌림', 3400, 3800]],
          alt: '장보기 목록에서 달걀 10구 줄을 손가락으로 한 번 짧게 누르면 체크 원이 채워지고 글자에 줄이 그어졌다가, 잠시 뒤 원래대로 돌아오는 시연',
          html: K => K.app.screen() + K.tap(1.5, 7.15, 'tp') + cap('탭: 짧게 한 번 누르기')
        }
      },
      {
        id: 'long-press', ko: '길게 누르기', en: 'Long press', aka: ['롱프레스', '꾹 누르기', 'press and hold', 'context menu'],
        when: '항목의 컨텍스트 메뉴, 다중 선택 시작, 미리보기를 열 때. 파워 사용자용 단축',
        avoid: '유일한 접근 경로로 쓰는 것(발견할 수 없어요. 반드시 대체 경로를 둬요)',
        notes: [
          '기준 시간은 약 400~600ms예요.',
          '누르는 동안 확대나 하이라이트 같은 진행 단서와 햅틱을 줘요.',
          '손가락이 일정 거리 이상 움직이면 취소하고, 스크린 리더용 대체 동작을 제공해요.'
        ],
        vs: { id: 'tap', text: '탭은 짧게 눌러 바로 실행하고, 길게 누르기는 0.5초 안팎 눌러서 부가 메뉴를 열어요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 3200,
          phases: [['누르는 중', 700, 2500], ['메뉴 유지', 2600, 4000], ['닫힘', 4000, 4200]],
          alt: '두부 줄을 손가락으로 누르고 있으면 둘레에 진행 링이 차오르며 줄이 살짝 떠오르고, 링이 다 차면 수정, 이동, 삭제 메뉴가 나타났다가 닫히는 시연',
          html: K => K.app.screen() + K.finger(6, 9.45, 'fg') +
            `<svg class="pr" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/></svg>` +
            `<div class="cm"><span>${K.icon('edit')}수정</span><span>${K.icon('forward')}이동</span><span class="rd">${K.icon('trash')}삭제</span></div>` + cap('길게 누르기: 0.5초 누르고 있기')
        }
      },
      {
        id: 'swipe', ko: '스와이프', en: 'Swipe', aka: ['쓸기', '넘기기', 'flick'],
        when: '캐러셀, 탭 사이 이동, 카드 넘기기, 시트 닫기',
        avoid: '중요한 행동을 스와이프에만 두는 것, 가로 스크롤과 충돌하는 곳',
        notes: [
          '거리 임계값 약 20~30%나 속도 임계값으로 확정하고, 미달이면 스프링으로 원위치해요.',
          '손가락을 따라오는 실시간 반응을 주고, 세로 스크롤과 구분되도록 방향을 잠가요.',
          '좌우 버튼 같은 대안과 페이지 인디케이터를 함께 둬요.'
        ],
        vs: { id: 'swipe-delete', text: '밀어서 삭제는 항목 하나에 묶인 스와이프예요. 스와이프는 화면이나 카드 전체를 옆으로 넘겨요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['왼쪽으로', 840, 2300], ['다음 카드 유지', 2300, 3300], ['오른쪽으로', 3360, 4800]],
          alt: '장보기 카드 한 장을 손가락으로 왼쪽으로 쓸면 다음 카드가 따라 들어오고 아래 점이 두 번째로 바뀌며, 오른쪽으로 쓸면 첫 카드로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('내 장보기 목록', [], { back: false }) +
            '<div class="vp"><div class="tk">' + [['이번 주 장보기', ['우유 2L', '달걀 10구', '두부']], ['다음 주 장보기', ['사과 4개', '참기름 1병', '양파 3개']], ['주말 바비큐', ['대파 1단', '김 1봉', '두부 2모']]].map(([t, l]) =>
              `<div class="cd"><b>${t}</b>${l.map(x => `<span>${x}</span>`).join('')}</div>`).join('') + '</div></div>' +
            '<div class="dts"><i class="d1"></i><i class="d2"></i><i class="d3"></i></div>' + K.finger(12, 10, 'fg') + cap('스와이프: 한쪽으로 쓸기')
        }
      },
      {
        id: 'swipe-delete', ko: '밀어서 삭제', en: 'Swipe to delete', aka: ['스와이프 삭제', '밀어서 지우기', 'swipe actions'],
        when: '메일, 할 일, 알림 같은 목록에서 빠른 정리를 할 때',
        avoid: '되돌릴 수 없는 삭제를 확인 없이 하는 것, 이것만이 삭제 수단인 경우',
        notes: [
          '끝까지 밀면 실행, 중간까지 밀면 버튼이 드러나요.',
          '행동 색(삭제는 붉은색)과 아이콘과 글자를 함께 쓰고, 삭제 뒤에는 되돌리기 스낵바를 보여요.',
          '항목 안 다른 제스처(가로 스크롤)와 충돌하는지 점검하고, 항목 메뉴(케밥)에도 삭제를 둬요.'
        ],
        vs: { id: 'swipe', text: '스와이프는 화면이나 카드를 넘겨요. 밀어서 삭제는 항목을 밀어 삭제나 보관 같은 특정 행동을 드러내요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['밀기', 600, 1800], ['버튼 노출', 1800, 2640], ['삭제', 2640, 3700], ['복구', 5400, 5700]],
          alt: '목록에서 두부 줄을 손가락으로 왼쪽으로 밀면 붉은 삭제 버튼이 드러나고, 버튼을 누르면 줄이 사라지고 아래 줄들이 올라오는 시연',
          html: K => K.app.status() + K.app.bar() +
            `<div class="k-ls">${K.app.rows(0, 2)}<div class="del"><span class="bt">${K.icon('trash')}<em>삭제</em></span></div>${K.app.row(2)}<div class="below">${K.app.rows(3, 5)}</div></div>` +
            K.finger(12, 9.45, 'fg') + K.tap(14.1, 9.45, 'tp') + cap('밀어서 삭제: 옆으로 밀어 버튼 열기')
        }
      },
      {
        id: 'drag-drop', ko: '드래그', en: 'Drag and drop', aka: ['끌어서 놓기', '순서 변경', 'reorder'],
        when: '순서 변경, 칸반 보드 이동, 파일 업로드',
        avoid: '터치 화면에서 유일한 방법으로 쓰는 것, 긴 거리 이동',
        notes: [
          '잡는 손잡이 아이콘을 보이고 영역은 44px 이상으로 해요.',
          '드래그 중에는 요소를 들어 올린 모양(그림자, 약간 확대), 놓을 위치 표시선, 자동 스크롤을 줘요.',
          '키보드 대안(위아래 이동 버튼이나 메뉴)과 aria-live 안내, 취소 방법(Esc, 제자리로)을 둬요.'
        ],
        vs: { id: 'long-press', text: '길게 누르기는 메뉴를 열거나 드래그를 시작하는 동작이고, 드래그는 누른 채 움직여 다른 자리에 놓는 조작이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3100,
          phases: [['잡기', 1100, 1200], ['끌기', 1200, 3100], ['놓기', 3100, 3500], ['제자리', 5400, 5760]],
          alt: '대파 줄 오른쪽 손잡이를 손가락으로 잡아 위로 끌면 줄이 떠오르고 놓을 자리에 표시선이 생기며, 놓으면 대파가 달걀 아래 두 번째 자리에 자리잡는 시연',
          html: K => K.app.screen() + '<i class="ln"></i>' + K.finger(14.65, 11.75, 'fg') + cap('드래그: 잡고 끌어서 옮기기')
        }
      },
      {
        id: 'pinch', ko: '핀치', en: 'Pinch to zoom', aka: ['핀치 줌', '확대 축소', '두 손가락 확대'],
        when: '사진, 지도, 도면, 큰 문서를 확대하거나 축소할 때',
        avoid: '일반 UI 화면 전체(페이지 확대는 사용자가 브라우저에서 할 수 있게 막지 않아요)',
        notes: [
          '확대 범위(1x~5x 정도)와 경계에서의 탄성을 정해요.',
          '두 번 탭 확대와 + − 버튼을 함께 제공해요.',
          '웹에서 user-scalable=no나 maximum-scale=1로 페이지 확대를 막지 않아요(접근성 위반).'
        ],
        vs: { id: 'double-tap', text: '두 번 탭도 확대를 할 수 있지만 단계가 정해져 있어요. 핀치는 두 손가락 간격을 따라 연속으로 확대해요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 3000,
          phases: [['벌리기', 800, 2600], ['확대 유지', 2600, 4300], ['되돌림', 4300, 4700]],
          alt: '사과 바구니 사진 위에서 두 손가락이 서로 반대 방향으로 벌어지면 사진이 두 배 넘게 커지고, 잠시 머문 뒤 원래 크기로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('사진', [], { back: true }) +
            `<div class="vp"><div class="ph">${photo}</div></div><span class="zp">2배 확대</span>` +
            K.finger(7, 9.2, 'fa') + K.finger(9, 10.9, 'fb') + cap('핀치: 두 손가락 벌리기')
        }
      },
      {
        id: 'double-tap', ko: '두 번 탭', en: 'Double tap', aka: ['더블 탭', '더블탭', 'double click', '좋아요'],
        when: '사진 확대와 원래 크기, 좋아요(소셜 피드의 관례)처럼 보조 단축으로 쓸 때',
        avoid: '중요한 행동의 유일한 수단, 일반 버튼에 두 번 탭을 요구하는 것',
        notes: [
          '두 탭 사이 간격은 약 300ms 이내예요.',
          '첫 탭의 동작이 지연되지 않도록 첫 탭 동작과 충돌하지 않는 곳에만 써요.',
          '눈에 보이는 버튼 대안을 함께 둬요.'
        ],
        vs: { id: 'pinch', text: '핀치도 확대지만 두 손가락으로 연속 조절해요. 두 번 탭은 한 손가락으로 빠르게 두 번 눌러요.' },
        demo: {
          frame: 'phone', cycle: 4000, still: 1800,
          phases: [['두 번 탭', 640, 1200], ['반응', 1160, 2700], ['되돌림', 3500, 3800]],
          alt: '사과 바구니 사진 한가운데를 손가락으로 빠르게 두 번 누르면 큰 하트가 튀어나왔다 사라지고, 아래 좋아요 하트가 채워지며 숫자가 12에서 13으로 바뀌는 시연',
          html: K => K.app.status() + K.app.bar('사진', [], { back: true }) +
            `<div class="vp"><div class="ph">${photo}</div><span class="big">${K.icon('heart')}</span></div>` +
            `<div class="act"><span class="hr">${K.icon('heart')}</span><span class="n12">12</span><span class="n13">13</span></div>` +
            K.tap(8, 10.05, 'ta') + K.tap(8, 10.05, 'tb') + cap('두 번 탭: 빠르게 두 번')
        }
      },
      {
        id: 'pull-refresh', ko: '당겨서 새로고침', en: 'Pull to refresh', aka: ['pull down', '새로고침', '당겨서 갱신'],
        when: '피드, 메일함 등 최신 내용을 확인하는 모바일 목록',
        avoid: '자동으로 갱신되는 목록(실시간), 데스크톱 화면, 브라우저 자체 당겨서 새로고침과 충돌할 때',
        notes: [
          '당기는 거리에 따라 인디케이터가 나타나고 임계값(약 60~80px)을 넘으면 새로고침해요.',
          '진행 중에는 스피너를 보여 주고 끝나면 닫아요. 오류 시 재시도를 안내해요.',
          '웹은 overscroll-behavior로 브라우저 기본 동작을 조정하고, 새로고침 버튼 대안을 둬요.'
        ],
        vs: { topic: 'navigation', id: 'infinite-scroll', name: '무한 스크롤', text: '무한 스크롤은 아래로 내려 더 불러오고, 당겨서 새로고침은 맨 위에서 아래로 당겨 최신 내용을 불러와요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3300,
          phases: [['당기기', 700, 2200], ['새로고침 중', 2400, 4200], ['복귀', 4200, 4700], ['완료 안내', 4700, 5500]],
          alt: '목록 맨 위에서 손가락으로 아래로 당기면 새로고침 아이콘이 나타나 돌며 목록이 조금 내려간 채 머물고, 끝나면 목록이 올라오며 ‘새로 불러왔어요’ 안내가 뜨는 시연',
          html: K => K.app.status() + K.app.bar() + `<span class="ind">${K.icon('refresh')}</span>` + K.app.list(0, 5, { cls: 'pl' }) +
            '<span class="nt">새로 불러왔어요</span>' + K.finger(8, 7, 'fg') + cap('당겨서 새로고침: 위에서 아래로')
        }
      },
      {
        id: 'edge-swipe', ko: '가장자리 스와이프', en: 'Edge swipe', aka: ['뒤로 가기 제스처', '엣지 스와이프', 'back gesture', '드로어'],
        when: 'iOS의 왼쪽 가장자리 뒤로 가기, 안드로이드 제스처 내비게이션, 드로어를 열 때',
        avoid: '가장자리 영역에 스와이프할 앱 자체 요소(캐러셀, 슬라이더)를 두는 것(시스템 제스처와 충돌해요)',
        notes: [
          '가장자리 약 20px 영역은 시스템이 예약했다고 가정하고 앱의 가로 제스처 시작점은 안쪽에 둬요.',
          '뒤로 가기는 시스템과 같은 결과를 내야 해요.',
          '뒤로 가기 버튼도 화면에 둬요.'
        ],
        vs: { id: 'swipe', text: '스와이프는 화면 어디서든 시작하고, 가장자리 스와이프는 화면 끝에서 시작해 뒤로 가기나 메뉴 열기에 써요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2300,
          phases: [['가장자리에서 밀기', 840, 2300], ['이전 화면', 2760, 4800], ['다시 열기', 4900, 5520]],
          alt: '두부 상세 화면의 왼쪽 가장자리에서 손가락이 안쪽으로 쓸면 상세 화면이 오른쪽으로 밀려나며 아래의 장보기 목록이 드러나고, 잠시 뒤 상세 화면이 다시 들어오는 시연',
          html: K => '<div class="pa">' + K.app.screen() + '</div>' +
            '<div class="dt">' + K.app.status() + K.app.bar('두부', ['more'], { back: true }) + K.wf('img', 1, 4.4, 14, 5.2) +
            '<div class="dr"><em>수량</em><span>2모</span></div><div class="dr d2"><em>메모</em><span>부침용으로 단단한 것</span></div></div>' +
            '<i class="ez"></i>' + K.finger(0.45, 10, 'fg') + cap('가장자리 스와이프: 끝에서 안쪽으로')
        }
      }
    ],
    css: K => {
      const out = [];

      /* tap */
      let t = T('tap');
      out.push(base('tap'));
      out.push(`
${t} .k-r2{animation-name:gsTapRow}
${t} .k-r2 .k-ck{animation-name:gsTapCk}
${t} .k-r2 .k-n::after{content:"";position:absolute;left:0;right:0;top:55%;height:.08em;background:currentColor;transform-origin:left;transform:scaleX(0);animation-name:gsTapStrike}
${t} .tp{animation-name:gsTapT}
${kfs('gsTapRow', [[[0, 8], 'background:var(--a-bg)'], [11, 'background:#ecebe7'], [18, 'background:var(--a-bg)'], [100, 'background:var(--a-bg)']])}
${kfs('gsTapCk', [[[0, 10], 'opacity:0;transform:scale(.4)'], [14, 'opacity:1;transform:scale(1)'], [[88], 'opacity:1;transform:scale(1)'], [[93, 100], 'opacity:0;transform:scale(1)']])}
${kfs('gsTapStrike', [[[0, 11], 'transform:scaleX(0)'], [19, 'transform:scaleX(1)'], [88, 'transform:scaleX(1)'], [[93, 100], 'transform:scaleX(0)']])}
${K.kf.tap('gsTapT', 10)}
`);

      /* long-press */
      t = T('long-press');
      out.push(base('long-press'));
      out.push(`
${t} .k-r3{z-index:3;animation-name:gsLpRow}
${t} .fg{animation-name:gsLpF}
${t} .pr{position:absolute;z-index:30;left:6em;top:9.45em;width:4em;height:4em;margin:-2em 0 0 -2em;transform:rotate(-90deg);pointer-events:none;overflow:visible}
${t} .pr circle{fill:none;stroke:var(--a-brand);stroke-width:3;stroke-linecap:round;stroke-dasharray:107;stroke-dashoffset:107;opacity:0;animation-name:gsLpRing}
${t} .cm{position:absolute;z-index:12;left:5.2em;top:10.8em;width:7.4em;padding:.3em 0;border-radius:.7em;background:#fff;box-shadow:0 .5em 1.4em rgba(20,20,22,.22);opacity:0;transform-origin:left top;animation-name:gsLpMenu}
${t} .cm span{display:flex;align-items:center;gap:.5em;height:2em;padding:0 .9em;font-size:.7em;font-weight:700}
${t} .cm .k-i{width:1.1em;height:1.1em}
${t} .cm .rd{color:var(--a-err)}
${K.kf.press('gsLpF', 18, 50)}
${kfs('gsLpRow', [[[0, 17], 'transform:none;box-shadow:none'], [[24, 78], 'transform:scale(1.03);box-shadow:0 .3em .9em rgba(20,20,22,.2)'], [[83, 100], 'transform:none;box-shadow:none']])}
${kfs('gsLpRing', [[[0, 18], 'opacity:0;stroke-dashoffset:107'], [19, 'opacity:1;stroke-dashoffset:107'], [50, 'opacity:1;stroke-dashoffset:0'], [53, 'opacity:0;stroke-dashoffset:0'], [100, 'opacity:0;stroke-dashoffset:107']])}
${kfs('gsLpMenu', [[[0, 51], 'opacity:0;transform:scale(.9)'], [56, 'opacity:1;transform:none'], [78, 'opacity:1;transform:none'], [[82, 100], 'opacity:0;transform:scale(.96)']])}
`);

      /* swipe */
      t = T('swipe');
      out.push(base('swipe'));
      out.push(`
${t} .vp{position:absolute;left:0;right:0;top:4.6em;height:10.6em;overflow:hidden}
${t} .tk{position:absolute;left:1em;top:0;display:flex;gap:.6em;animation-name:gsSwTk}
${t} .cd{flex:none;width:12.8em;height:10.2em;padding:1em;border-radius:.9em;background:var(--a-soft)}
${t} .cd b{display:block;font-size:.84em;margin-bottom:.9em}
${t} .cd span{display:block;font-size:.72em;padding:.7em 0;border-top:1px solid var(--a-line)}
${t} .dts{position:absolute;left:0;right:0;top:16.1em;display:flex;justify-content:center;gap:.5em}
${t} .dts i{width:.5em;height:.5em;border-radius:50%;background:#cfcfca}
${t} .d1{animation-name:gsSwD1}${t} .d2{animation-name:gsSwD2}
${t} .fg{animation-name:gsSwF}
${kfs('gsSwTk', [[[0, 14], 'transform:none'], [[38, 55], 'transform:translateX(-13.4em)'], [[80, 100], 'transform:none']])}
${win('gsSwD1', [[0, 36], [82, 100]], 'background:var(--a-ink);transform:scale(1.25)', 'background:#cfcfca;transform:scale(1)')}
${win('gsSwD2', [[39, 80]], 'background:var(--a-ink);transform:scale(1.25)', 'background:#cfcfca;transform:scale(1)')}
${kfs('gsSwF', [[[0, 11], 'opacity:0;transform:translate(0,0) scale(1.3)'], [14, 'opacity:1;transform:translate(0,0) scale(1)'], [34, 'opacity:1;transform:translate(-8em,0) scale(1)'], [37, 'opacity:0;transform:translate(-8em,0) scale(1.2)'], [[38, 53], 'opacity:0;transform:translate(-8em,0) scale(1.3)'], [56, 'opacity:1;transform:translate(-8em,0) scale(1)'], [76, 'opacity:1;transform:translate(0,0) scale(1)'], [79, 'opacity:0;transform:translate(0,0) scale(1.2)'], [100, 'opacity:0;transform:translate(0,0) scale(1.3)']])}
`);

      /* swipe-delete */
      t = T('swipe-delete');
      out.push(base('swipe-delete'));
      out.push(`
${t} .del{position:absolute;z-index:0;left:0;right:0;top:4.6em;height:2.3em;background:var(--a-err);color:#fff;display:flex;justify-content:flex-end;opacity:0;animation-name:gsSdDel}
${t} .bt{width:3.8em;display:flex;align-items:center;justify-content:center;gap:.3em}
${t} .bt .k-i{width:.95em;height:.95em}
${t} .bt em{font-style:normal;font-size:.68em;font-weight:700}
${t} .k-r3{z-index:2;animation-name:gsSdRow}
${t} .below{position:relative;z-index:2;animation-name:gsSdUp}
${t} .fg{animation-name:gsSdF}
${t} .tp{animation-name:gsSdT}
${kfs('gsSdDel', [[[0, 9], 'opacity:0'], [10, 'opacity:1'], [52, 'opacity:1'], [[54, 100], 'opacity:0']])}
${kfs('gsSdRow', [[[0, 9], 'transform:none;opacity:1'], [28, 'transform:translateX(-3.8em);opacity:1'], [50, 'transform:translateX(-3.8em);opacity:1'], [53, 'transform:translateX(-3.8em);opacity:0'], [[54, 89], 'transform:none;opacity:0'], [94, 'transform:none;opacity:1'], [100, 'transform:none;opacity:1']])}
${kfs('gsSdUp', [[[0, 53], 'transform:none'], [[59, 89], 'transform:translateY(-2.3em)'], [[94, 100], 'transform:none']])}
${K.kf.drag('gsSdF', 10, 28, -3.8, 0)}
${K.kf.tap('gsSdT', 44)}
`);

      /* drag-drop */
      t = T('drag-drop');
      out.push(base('drag-drop'));
      out.push(`
${t} .k-r::after{content:"";width:.7em;height:1em;margin-left:.6em;background:radial-gradient(circle,#b5b6b1 .09em,transparent .1em) 0 0/.35em .33em}
${t} .k-r4{z-index:5;animation-name:gsDdRow}
${t} .k-r3{animation-name:gsDdA}${t} .k-r2{animation-name:gsDdB}
${t} .ln{position:absolute;z-index:6;left:.8em;right:.8em;top:5.92em;height:.16em;border-radius:.1em;background:var(--a-brand);opacity:0;animation-name:gsDdLn}
${t} .fg{animation-name:gsDdF}
${kfs('gsDdRow', [[[0, 16], 'transform:none;box-shadow:none;background:var(--a-bg)'], [20, 'transform:scale(1.04);box-shadow:0 .4em 1em rgba(20,20,22,.2);background:#fff'], [52, 'transform:translateY(-4.6em) scale(1.04);box-shadow:0 .4em 1em rgba(20,20,22,.2);background:#fff'], [58, 'transform:translateY(-4.6em);box-shadow:none;background:var(--a-bg)'], [90, 'transform:translateY(-4.6em);box-shadow:none;background:var(--a-bg)'], [96, 'transform:none;box-shadow:none;background:var(--a-bg)'], [100, 'transform:none;box-shadow:none;background:var(--a-bg)']])}
${kfs('gsDdA', [[[0, 30], 'transform:none'], [[36, 90], 'transform:translateY(2.3em)'], [[96, 100], 'transform:none']])}
${kfs('gsDdB', [[[0, 42], 'transform:none'], [[48, 90], 'transform:translateY(2.3em)'], [[96, 100], 'transform:none']])}
${vis('gsDdLn', [[44, 58]])}
${K.kf.drag('gsDdF', 20, 52, 0, -4.6)}
`);

      /* pinch */
      t = T('pinch');
      out.push(base('pinch'));
      out.push(`
${t} .vp{position:absolute;left:1.5em;top:5.2em;width:13em;height:9.7em;border-radius:.6em;overflow:hidden;background:#eadfcf}
${t} .ph{position:absolute;inset:0;animation-name:gsPcZ}
${t} .ph svg{display:block;width:100%;height:100%}
${t} .zp{position:absolute;z-index:20;left:4.3em;top:23em;padding:.3em .8em;border-radius:2em;background:var(--a-dark);color:#fff;font-size:.56em;font-weight:700;white-space:nowrap;opacity:0;animation-name:gsPcZp}
${t} .fa{animation-name:gsPcA}${t} .fb{animation-name:gsPcB}
${kfs('gsPcZ', [[[0, 16], 'transform:scale(1)'], [[52, 86], 'transform:scale(2.2)'], [[94, 100], 'transform:scale(1)']])}
${vis('gsPcZp', [[44, 86]])}
${K.kf.drag('gsPcA', 16, 52, -3.2, -2.4)}
${K.kf.drag('gsPcB', 16, 52, 3.2, 2.4)}
`);

      /* double-tap */
      t = T('double-tap');
      out.push(base('double-tap'));
      out.push(`
${t} .vp{position:absolute;left:1.5em;top:5.2em;width:13em;height:9.7em;border-radius:.6em;overflow:hidden;background:#eadfcf}
${t} .vp svg{display:block;width:100%;height:100%}
${t} .big{position:absolute;left:50%;top:50%;width:4.4em;height:4.4em;margin:-2.2em 0 0 -2.2em;opacity:0;animation-name:gsDtBig}
${t} .big .k-i{width:100%;height:100%;fill:#fff;stroke:none;filter:drop-shadow(0 .15em .35em rgba(0,0,0,.3))}
${t} .act{position:absolute;left:1.5em;top:15.4em;display:flex;align-items:center;gap:.5em}
${t} .hr{display:block;width:1.5em;height:1.5em;color:var(--a-mut);animation-name:gsDtHr}
${t} .hr .k-i{display:block;width:100%;height:100%}
${t} .act span:not(.hr){position:absolute;left:2em;top:.2em;font-size:.84em;font-weight:700}
${t} .n12{animation-name:gsDtN12}${t} .n13{opacity:0;animation-name:gsDtN13}
${t} .ta{animation-name:gsDtTa}${t} .tb{animation-name:gsDtTb}
${kfs('gsDtBig', [[[0, 26], 'opacity:0;transform:scale(.4)'], [29, 'opacity:1;transform:scale(1.25)'], [33, 'opacity:1;transform:scale(1)'], [58, 'opacity:1;transform:scale(1)'], [[68, 100], 'opacity:0;transform:scale(1.1) translateY(-.8em)']])}
${kfs('gsDtHr', [[[0, 28], 'color:var(--a-mut);fill:transparent;transform:scale(1)'], [31, 'color:var(--a-brand);fill:var(--a-brand);transform:scale(1.3)'], [35, 'color:var(--a-brand);fill:var(--a-brand);transform:scale(1)'], [88, 'color:var(--a-brand);fill:var(--a-brand);transform:scale(1)'], [[93, 100], 'color:var(--a-mut);fill:transparent;transform:scale(1)']])}
${vis('gsDtN12', [[0, 29], [94, 100]])}
${vis('gsDtN13', [[31, 90]])}
${K.kf.tap('gsDtTa', 16)}
${K.kf.tap('gsDtTb', 23)}
`);

      /* pull-refresh */
      t = T('pull-refresh');
      out.push(base('pull-refresh'));
      out.push(`
${t} .ind{position:absolute;z-index:0;left:50%;top:4.1em;margin-left:-.95em;width:1.9em;height:1.9em;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 .15em .5em rgba(20,20,22,.15);opacity:0;animation-name:gsPrInd}
${t} .ind .k-i{width:1.05em;height:1.05em;color:var(--a-brand)}
${t} .pl{position:relative;z-index:1;animation-name:gsPrList}
${t} .nt{position:absolute;z-index:12;left:50%;bottom:5.15em;padding:.5em 1em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;font-size:.66em;white-space:nowrap;opacity:0;animation-name:gsPrNt}
${t} .fg{animation-name:gsPrF}
${kfs('gsPrList', [[[0, 11], 'transform:none'], [34, 'transform:translateY(3.2em)'], [[40, 70], 'transform:translateY(2.4em)'], [[78, 100], 'transform:none']])}
${kfs('gsPrInd', [[[0, 12], 'opacity:0;transform:rotate(0deg)'], [18, 'opacity:1;transform:rotate(0deg)'], [34, 'opacity:1;transform:rotate(180deg)'], [40, 'opacity:1;animation-timing-function:linear;transform:rotate(180deg)'], [70, 'opacity:1;transform:rotate(1260deg)'], [74, 'opacity:1;transform:rotate(1260deg)'], [78, 'opacity:0;transform:rotate(1260deg)'], [100, 'opacity:0;transform:rotate(0deg)']])}
${kfs('gsPrNt', [[[0, 77], 'opacity:0;transform:translate(-50%,.5em)'], [81, 'opacity:1;transform:translate(-50%,0)'], [90, 'opacity:1;transform:translate(-50%,0)'], [[95, 100], 'opacity:0;transform:translate(-50%,.5em)']])}
${K.kf.drag('gsPrF', 12, 34, 0, 3.4)}
`);

      /* edge-swipe */
      t = T('edge-swipe');
      out.push(base('edge-swipe'));
      out.push(`
${t} .pa{position:absolute;inset:0;animation-name:gsEsA}
${t} .dt{position:absolute;z-index:6;inset:0;background:var(--a-bg);box-shadow:-.4em 0 1.2em rgba(20,20,22,.16);animation-name:gsEsB}
${t} .dr{position:absolute;left:1em;right:1em;top:10.2em;display:flex;justify-content:space-between;align-items:center;height:2.2em;border-bottom:1px solid var(--a-line)}
${t} .dr.d2{top:12.4em}
${t} .dr em{font-style:normal;font-size:.62em;font-weight:700;color:var(--a-mut)}
${t} .dr span{font-size:.74em}
${t} .ez{position:absolute;z-index:8;left:0;top:0;bottom:0;width:.9em;background:rgba(194,71,25,.16);border-right:.08em dashed var(--a-brand);opacity:0;animation-name:gsEsEz}
${t} .fg{animation-name:gsEsF}
${kfs('gsEsA', [[[0, 13], 'transform:translateX(-3em)'], [[46, 80], 'transform:none'], [[92, 100], 'transform:translateX(-3em)']])}
${kfs('gsEsB', [[[0, 14], 'transform:none'], [38, 'transform:translateX(7.5em)'], [[46, 80], 'transform:translateX(16em)'], [[92, 100], 'transform:none']])}
${vis('gsEsEz', [[6, 44]])}
${K.kf.drag('gsEsF', 14, 38, 7.5, 0)}
`);

      return out.join('\n');
    }
  });
})();
