/* Topic: 하단 메뉴 스타일 (bottom-nav-styles). Reference: plugins/design-master/references/navigation.md (section B), styles.md
   Every style draws the same five tabs; the active tab moves 1 -> 2 -> 4 -> 1 on taps.
   Selectors use "&" as a placeholder for .t-bottom-nav-styles-<element>; see E() below. Keyframe prefix: bn. */
(function () {
  const IDS = ['minimal', 'glass', 'floating', 'neumorph', 'pill', 'center-fab', 'gradient', 'outline', 'indicator', 'curved', 'dock'];
  const E = (id, css) => css.replace(/&/g, '.t-bottom-nav-styles-' + id);
  const TABS = [['home', '홈'], ['users', '가족'], ['plus', '추가'], ['bell', '알림'], ['user', '내 정보']];

  /* nav markup. o.fab: tab 3 is a raised button. o.tile: icons sit on colored tiles, no labels. */
  const nav = (K, o = {}) => '<i class="bl bl1"></i><i class="bl bl2"></i>' + K.app.screen({ title: '이번 주 장보기', icons: ['share', 'more'], rows: 8 }) +
    '<nav class="nb"><i class="ind"></i>' + (o.dotb ? '<i class="dotb"></i>' : '') +
    TABS.map(([ic, label], i) => {
      const n = i + 1;
      if (o.fab && n === 3) return `<span class="t t3"><i class="fabc">${K.icon('plus')}</i></span>`;
      if (o.tile) return `<span class="t t${n}"><i class="tile">${K.icon(ic)}</i></span>`;
      return `<span class="t t${n}">${K.icon(ic)}<em>${label}</em></span>`;
    }).join('') + '</nav>';
  const taps = (K, xs, y) => K.tap(xs[1], y, 'tp1') + K.tap(xs[3], y, 'tp2') + K.tap(xs[0], y, 'tp3');
  const C5 = [1.6, 4.8, 8, 11.2, 14.4];
  const demo = (alt, html) => ({
    frame: 'phone', cycle: 6000, still: 2400,
    phases: [['가족으로 이동', 1440, 1800], ['알림으로 이동', 3240, 3600], ['홈으로 복귀', 5040, 5400]],
    alt, html
  });

  const SHARED = `
& .bl,& .ind,& .dotb{display:none}
& .nb{position:absolute;z-index:6;display:grid;grid-template-columns:repeat(5,1fr)}
& .t{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.15em;color:var(--ic)}
& .t .k-i{width:1.1em;height:1.1em}
& .t em{font-style:normal;font-size:.5em;font-weight:700}
& .t1{animation-name:bnA1}.t-bottom-nav-styles-X .t2{animation-name:bnA2}.t-bottom-nav-styles-X .t4{animation-name:bnA4}
& .t1 .k-i{animation-name:bnF1}.t-bottom-nav-styles-X .t2 .k-i{animation-name:bnF2}.t-bottom-nav-styles-X .t4 .k-i{animation-name:bnF4}
& .tp1{animation-name:bnTap1}.t-bottom-nav-styles-X .tp2{animation-name:bnTap2}.t-bottom-nav-styles-X .tp3{animation-name:bnTap3}`;

  UIGuide.registerTopic({
    id: 'bottom-nav-styles',
    intro: '같은 다섯 탭을 스타일만 바꿔 그렸어요. 활성 탭이 홈, 가족, 알림, 홈 순서로 옮겨 가는 동안 스타일마다 활성을 어떻게 드러내는지 비교해 보세요. 공통 팁은 항목 4~5개, 분명한 활성 상태, 통일된 아이콘, 탭 영역 48x48px 이상이에요.',
    elements: [
      {
        id: 'minimal', ko: '미니멀', en: 'Minimal clean', aka: ['기본 탭바', '클린'],
        when: '어떤 제품이든 기본값이 필요할 때, 콘텐츠가 주인공일 때',
        avoid: '브랜드 개성이 필요한 소비자 앱(밋밋해 보일 수 있어요)',
        notes: [
          '배경 하나, 가는 구분선, 단색 아이콘과 라벨로만 구성해요.',
          '활성은 색과 아이콘 채움을 같이 바꾸고, 비활성 아이콘 대비도 3:1 이상으로 해요.',
          '높이 56~64px에 하단 안전 영역을 더해요. 하단 안전 영역과 홈 인디케이터가 겹치지 않게 해요.'
        ],
        vs: { id: 'outline', text: '외곽선 아이콘은 활성일 때 선이 완전한 채움으로 바뀌는 점이 중심이고, 미니멀은 색 변화와 옅은 채움을 함께 써요.' },
        demo: demo('배경 하나에 가는 구분선만 있는 하단 막대에서 활성 탭이 홈에서 가족, 알림, 다시 홈으로 옮겨 가며 색이 진해지는 시연', K => nav(K) + taps(K, C5, 19.68))
      },
      {
        id: 'glass', ko: '글래스모피즘', en: 'Glassmorphism', aka: ['반투명 탭바', '블러 탭바'],
        when: '뒤에 이미지나 색이 있는 화면, 앱이 가벼운 분위기일 때',
        avoid: '뒤 콘텐츠가 복잡한 텍스트일 때(아이콘과 라벨 대비가 뒤 배경에 따라 흔들려요)',
        notes: [
          'backdrop-filter: blur(16~24px)에 배경 알파 0.6~0.8을 쓰고, 미지원 브라우저용으로 불투명 대체 배경을 지정해요.',
          '어떤 배경 위에서도 아이콘 대비가 3:1인지 확인해요.',
          '스타일 일반론과 접근성 위험은 디자인 스타일 주제의 글래스모피즘을 봐요.'
        ],
        vs: { topic: 'design-styles', id: 'glassmorphism', name: '글래스모피즘', text: '디자인 스타일 주제의 글래스모피즘은 스타일 일반론이고, 여기서는 그 재질을 하단 막대에 입힌 모습이에요.' },
        demo: demo('뒤에서 색 원이 천천히 움직이는 화면 아래, 반투명 흐림 막대 위에서 활성 탭이 홈에서 가족, 알림, 다시 홈으로 옮겨 가는 시연', K => nav(K) + taps(K, C5, 19.63))
      },
      {
        id: 'floating', ko: '플로팅', en: 'Floating (detached)', aka: ['떠 있는 탭바', '알약 탭바'],
        when: '현대적 인상이 필요한 앱, 콘텐츠가 막대 뒤로 흐르는 화면',
        avoid: '막대에 가려 마지막 항목을 못 누를 수 있는 목록 화면에서 하단 패딩 없이 쓸 때',
        notes: [
          '좌우 16~24px, 하단 12~16px을 띄우고 안전 영역을 더해요.',
          '그림자는 약하게 쓰고, 스크롤 콘텐츠에 막대 높이만큼 하단 패딩을 줘요.',
          '활성 탭은 색과 굵은 라벨로 구분해요.'
        ],
        vs: { id: 'dock', text: '독 스타일은 라벨 없이 큰 아이콘이 늘어나는 막대이고, 플로팅은 라벨이 있는 알약 모양 막대가 가장자리에서 떨어져 있어요.' },
        demo: demo('목록이 막대 뒤로 흐르는 화면 아래에 둥근 알약 막대가 떠 있고 활성 탭이 홈에서 가족, 알림, 다시 홈으로 옮겨 가며 주황색이 되는 시연', K => nav(K) + taps(K, [2.4, 5.2, 8, 10.8, 13.6], 18.73))
      },
      {
        id: 'neumorph', ko: '뉴모피즘', en: 'Neumorphism', aka: ['소프트 탭바'],
        when: '장식적 목업, 단순한 기능의 제품',
        avoid: '대부분의 실제 제품(활성과 비활성 구분이 어렵고 대비가 낮아 접근성에서 위험해요)',
        notes: [
          '활성 항목은 그림자만이 아니라 색이나 아이콘 채움으로도 구분해요. 이 시연도 활성 아이콘을 주황색으로 바꿨어요.',
          '아이콘 대비 3:1을 확보할 수 있는지 먼저 계산해요.',
          '배경과 같은 색에서 솟고 눌리는 질감이라 대비가 매우 낮아요. 일반론은 디자인 스타일 주제의 뉴모피즘을 봐요.'
        ],
        vs: { topic: 'design-styles', id: 'neumorphism', name: '뉴모피즘', text: '디자인 스타일 주제의 뉴모피즘은 스타일 일반론이고, 여기서는 하단 막대에서 활성 탭을 눌린 홈으로 표시하는 방식이에요.' },
        demo: demo('배경과 같은 연회색 막대에서 눌린 동그란 홈이 홈에서 가족, 알림, 다시 홈으로 옮겨 가고 활성 아이콘은 주황색으로 바뀌는 시연', K => nav(K) + taps(K, C5, 19.53))
      },
      {
        id: 'pill', ko: '알약 강조', en: 'Pill highlight', aka: ['알약 탭바', '하이라이트 탭'],
        when: '활성 상태를 분명하게 보이고 싶을 때. 대부분의 모던 앱에 안전한 선택',
        avoid: '항목이 5개를 넘어 알약이 좁아질 때',
        notes: [
          '활성 탭 뒤에 알약 모양 배경을 깔아 현재 위치를 보여 줘요.',
          '알약 배경과 아이콘 대비를 따로 확인해요(활성 아이콘이 배경 위에서 4.5:1 또는 최소 3:1).',
          '알약이 옮겨 가는 모션은 탭 바 전환 모션 주제의 알약 슬라이드와 연결돼요.'
        ],
        vs: { topic: 'tab-bar-motion', id: 'sliding-pill', name: '미끄러지는 알약', text: '미끄러지는 알약은 알약이 옮겨 가는 모션을 다루고, 알약 강조는 정지 상태의 표시 방식을 다뤄요.' },
        demo: demo('활성 탭 아이콘 뒤에 옅은 주황 알약 배경이 깔려 있고, 탭을 누를 때마다 알약이 홈에서 가족, 알림, 다시 홈으로 미끄러지는 시연', K => nav(K) + taps(K, C5, 19.63))
      },
      {
        id: 'center-fab', ko: '가운데 FAB', en: 'Center FAB', aka: ['중앙 강조 버튼', '가운데 버튼'],
        when: '앱의 대표 행동이 분명할 때(글쓰기, 거래, 스캔)',
        avoid: '가운데 항목이 단순한 화면 이동일 때, 항목 수가 짝수가 되어 가운데가 없을 때',
        notes: [
          '일반 탭 4개와 가운데 1개로 구성하고, 가운데는 지름 56px 안팎으로 막대 위로 약간 돌출해요.',
          '왼쪽과 오른쪽 대칭을 맞추고 접근성 라벨을 반드시 붙여요.',
          '일반 탭의 활성 표시는 색으로 해요. 가운데 버튼은 이동이 아니라 행동을 시작해요.'
        ],
        vs: { topic: 'navigation', id: 'fab', name: '플로팅 버튼', text: '플로팅 버튼은 화면 위에 떠 있는 별도 버튼이고, 가운데 FAB은 탭 막대의 가운데 항목 자체를 도드라진 버튼으로 만든 거예요.' },
        demo: demo('다섯 탭 중 가운데 추가 버튼만 막대 위로 솟아 있고, 나머지 탭의 활성 표시가 홈에서 가족, 알림, 다시 홈으로 옮겨 가는 시연', K => nav(K, { fab: true }) + taps(K, C5, 19.68))
      },
      {
        id: 'gradient', ko: '그라디언트', en: 'Gradient bold', aka: ['그라디언트 탭바', '컬러 탭바'],
        when: '게임, 엔터테인먼트처럼 감정과 브랜드 개성이 중요한 앱',
        avoid: '업무·금융 앱, 라벨 글자가 그라디언트 위에서 대비가 흔들릴 때',
        notes: [
          '그라디언트 위 글자 대비는 가장 밝은 지점 기준으로 4.5:1인지 확인해요.',
          '그라디언트는 두 색, 인접 색상 위주로 써요.',
          '활성 탭은 밝은 막과 흰색 글자로 드러내고 비활성은 흐리게 해요.'
        ],
        vs: { id: 'minimal', text: '미니멀은 단색 배경에 색 변화만 쓰고, 그라디언트는 강한 색감으로 브랜드 개성을 줘요.' },
        demo: demo('짙은 주황 그라디언트 막대 위에서 흰 반투명 막이 활성 탭을 따라 홈에서 가족, 알림, 다시 홈으로 미끄러지는 시연', K => nav(K) + taps(K, C5, 19.68))
      },
      {
        id: 'outline', ko: '외곽선 아이콘', en: 'Outline icons', aka: ['선 아이콘 탭바', '채움 전환'],
        when: '정돈된 인상이 필요하고 활성 구분이 아이콘만으로 가능할 때',
        avoid: '선 굵기가 아이콘마다 다른 아이콘 세트를 섞을 때',
        notes: [
          '비활성은 선 아이콘, 활성은 채움 아이콘으로 바꿔요.',
          '같은 아이콘 세트에서 선 굵기 1.5~2px로 통일하고, 선 아이콘 비활성 대비는 3:1 이상으로 해요.',
          '채움과 선 두 버전이 모두 있는 세트를 골라요.'
        ],
        vs: { id: 'minimal', text: '미니멀은 색 변화가 중심이고, 외곽선 아이콘은 활성일 때 아이콘 모양 자체가 선에서 채움으로 바뀌어요.' },
        demo: demo('선으로 그린 아이콘이 나란히 있다가 탭을 누르면 활성 탭의 아이콘만 주황색으로 속이 채워지는 시연. 홈에서 가족, 알림, 다시 홈으로 옮겨 가요', K => nav(K) + taps(K, C5, 19.68))
      },
      {
        id: 'indicator', ko: '표시선 탭', en: 'Tab with indicator', aka: ['밑줄 탭', '막대 표시'],
        when: '위치를 명확히 하되 장식은 적게 하고 싶을 때. 상단 탭의 밑줄과 같은 문법',
        avoid: '표시 막대가 너무 가늘어(1px) 놓칠 때',
        notes: [
          '막대 두께 2~4px, 항목 폭의 40~60% 길이로 해요.',
          '막대 이동에는 150~250ms ease-out을 써요.',
          '탭 인디케이터 일반론은 완료·인디케이터 주제의 탭 인디케이터를 봐요.'
        ],
        vs: { topic: 'indicators', id: 'tab-indicator', name: '탭 인디케이터', text: '탭 인디케이터 일반론은 인디케이터 주제에서 봐요. 표시선 탭은 상단 탭의 밑줄 문법을 하단 막대에 가져온 거예요.' },
        demo: demo('하단 막대 맨 위 선에 짧은 주황 막대가 붙어 있고, 탭을 누르면 막대가 홈에서 가족, 알림, 다시 홈으로 미끄러지는 시연', K => nav(K) + taps(K, C5, 19.68))
      },
      {
        id: 'curved', ko: '곡선 배경', en: 'Curved background', aka: ['노치 탭바', '굴곡 탭바'],
        when: '브랜드 개성을 모션과 함께 보여 주는 소비자 앱, 항목 4~5개',
        avoid: '항목 수가 유동적이거나 태블릿·가로 모드 대응이 중요할 때(곡선 계산 때문에 유지보수가 어려워요)',
        notes: [
          'SVG path나 clip-path로 만들고, 곡선 반경과 막대 높이를 변수화해요.',
          '접근성 라벨과 포커스 링은 활성 항목 위치와 맞춰요.',
          '이동 모션은 탭 바 전환 모션 주제의 떠다니는 홈과 이어져요.'
        ],
        vs: { topic: 'tab-bar-motion', id: 'floating-notch', name: '떠다니는 홈', text: '떠다니는 홈은 홈이 옮겨 가는 모션을 다루고, 곡선 배경은 활성 위치가 파인 막대 모양 자체를 가리켜요.' },
        demo: demo('어두운 막대가 활성 탭 자리에서 둥글게 파이고, 그 안에서 아이콘이 주황 원 위로 솟아올라 홈에서 가족, 알림, 다시 홈으로 옮겨 가는 시연(웹에서는 원으로 근사)', K => nav(K, { dotb: true }) + taps(K, C5, 19.63))
      },
      {
        id: 'dock', ko: '독 스타일', en: 'Dock style (iOS inspired)', aka: ['아이콘 독', '확대 탭바'],
        when: '아이콘이 인지하기 쉬운 앱 런처형 화면, Apple 플랫폼 느낌',
        avoid: '라벨이 꼭 필요한 정보 구조(라벨 없이 아이콘만으로는 의미가 모호해요)',
        notes: [
          '아이콘은 약 48~56px에 간격 12~16px로 두고, 확대 모션은 스프링 느낌으로 짧게 써요.',
          '라벨을 숨긴다면 aria-label과 길게 눌러 보는 툴팁을 둬요.',
          '선택하거나 가리킨 아이콘이 커지고 이웃 아이콘이 조금 따라 커져요.'
        ],
        vs: { id: 'floating', text: '플로팅은 라벨이 있는 알약 막대이고, 독 스타일은 라벨 없이 큰 아이콘을 둥근 컨테이너에 담아 선택한 아이콘이 확대돼요.' },
        demo: demo('둥근 반투명 독 안의 큰 아이콘 다섯 개 중 선택한 아이콘이 위로 커지고 이웃이 조금 따라 커지면서, 홈에서 가족, 알림, 다시 홈으로 옮겨 가는 시연', K => nav(K, { tile: true }) + taps(K, [2.56, 5.28, 8, 10.72, 13.44], 18.63))
      }
    ],
    css: K => {
      /* dock tile scale per active state: [tab1 active, tab2 active, tab4 active] */
      const dk = (name, v) => `@keyframes ${name}{0%,25%{transform:scale(${v[0]})}28%,55%{transform:scale(${v[1]})}58%,85%{transform:scale(${v[2]})}88%,100%{transform:scale(${v[0]})}}`;
      const lift = (name, a) => `@keyframes ${name}{${a}}`;
      return [
        IDS.map(id => E(id, SHARED.replace(/-X /g, '-' + id + ' '))).join('\n'),
        `@keyframes bnA1{0%,25%{color:var(--ac)}28%,83%{color:var(--ic)}87%,100%{color:var(--ac)}}
@keyframes bnA2{0%,25%{color:var(--ic)}28%,55%{color:var(--ac)}58%,100%{color:var(--ic)}}
@keyframes bnA4{0%,55%{color:var(--ic)}58%,85%{color:var(--ac)}88%,100%{color:var(--ic)}}
@keyframes bnF1{0%,25%{fill:var(--af,none)}28%,83%{fill:none}87%,100%{fill:var(--af,none)}}
@keyframes bnF2{0%,25%{fill:none}28%,55%{fill:var(--af,none)}58%,100%{fill:none}}
@keyframes bnF4{0%,55%{fill:none}58%,85%{fill:var(--af,none)}88%,100%{fill:none}}
@keyframes bnInd{0%,25%{transform:translateX(0)}30%,55%{transform:translateX(var(--p))}60%,85%{transform:translateX(calc(var(--p) * 3))}90%,100%{transform:translateX(0)}}
${K.kf.tap('bnTap1', 24)}
${K.kf.tap('bnTap2', 54)}
${K.kf.tap('bnTap3', 84)}`,

        E('minimal', `
& .k-scr{--ic:#868a8e;--ac:#1d1e20;--af:rgba(29,30,32,.18)}
& .nb{left:0;right:0;bottom:0;height:3.3em;background:var(--a-bg);border-top:1px solid var(--a-line)}`),

        E('glass', `
& .k-scr{--ic:#55585d;--ac:#1d1e20;--af:rgba(29,30,32,.14)}
& .k-r{background:transparent}
& .bl{display:block;position:absolute;z-index:0;border-radius:50%}
& .bl1{left:.6em;top:13.4em;width:7em;height:7em;background:#f6a98b;animation-name:bnGlB1}
& .bl2{right:-.4em;top:14.6em;width:7em;height:7em;background:#8fd3cc;animation-name:bnGlB2}
& .nb{left:0;right:0;bottom:0;height:3.4em;background:rgba(255,255,255,.5);-webkit-backdrop-filter:blur(.9em) saturate(1.5);backdrop-filter:blur(.9em) saturate(1.5);border-top:.06em solid rgba(255,255,255,.85)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){& .nb{background:rgba(250,250,247,.96)}}
@keyframes bnGlB1{0%,100%{transform:translateX(0)}50%{transform:translateX(6.5em)}}
@keyframes bnGlB2{0%,100%{transform:translateX(0)}50%{transform:translateX(-6.5em)}}`),

        E('floating', `
& .k-scr{--ic:#868a8e;--ac:var(--a-brand);--p:2.8em}
& .nb{left:1em;right:1em;bottom:1em;height:3.2em;border-radius:1.6em;background:#fff;box-shadow:0 .4em 1.2em rgba(20,20,22,.18),0 .05em .2em rgba(20,20,22,.1)}`),

        E('neumorph', `
& .k-scr{--ic:#8a90a0;--ac:var(--a-brand);--p:3.2em}
& .k-scr{--a-bg:#e2e5eb;--a-line:#d3d6dd;--a-soft:#d9dce3;background:#e2e5eb}
& .nb{left:0;right:0;bottom:0;height:3.6em;background:#e2e5eb;border-radius:1.2em 1.2em 0 0;box-shadow:0 -.3em .7em #fff,0 -.1em .3em rgba(160,166,180,.55)}
& .ind{display:block;position:absolute;z-index:1;left:.35em;top:.55em;width:2.5em;height:2.5em;border-radius:50%;box-shadow:inset .15em .15em .3em #bfc3cc,inset -.15em -.15em .3em #fff;animation-name:bnInd}`),

        E('pill', `
& .k-scr{--ic:#686a6f;--ac:#8a2f0e;--p:3.2em}
& .nb{left:0;right:0;bottom:0;height:3.4em;background:var(--a-bg);border-top:1px solid var(--a-line)}
& .ind{display:block;position:absolute;z-index:1;left:.2em;top:.4em;width:2.8em;height:1.65em;border-radius:.85em;background:#fbe0d3;animation-name:bnInd}`),

        E('center-fab', `
& .k-scr{--ic:#868a8e;--ac:#1d1e20}
& .nb{left:0;right:0;bottom:0;height:3.3em;background:var(--a-bg);border-top:1px solid var(--a-line)}
& .t3{animation-name:none}
& .fabc{display:grid;place-items:center;width:3em;height:3em;margin-top:-1.7em;border-radius:50%;background:var(--a-brand);color:#fff;box-shadow:0 0 0 .3em var(--a-bg),0 .35em .9em rgba(194,71,25,.4)}
& .fabc .k-i{width:1.4em;height:1.4em;stroke-width:2.4}`),

        E('gradient', `
& .k-scr{--ic:rgba(255,255,255,.72);--ac:#fff;--p:3.2em}
& .nb{left:0;right:0;bottom:0;height:3.3em;background:linear-gradient(90deg,#8f2a10,#c24719)}
& .t em{font-weight:900}
& .ind{display:block;position:absolute;z-index:1;left:.25em;top:.4em;width:2.7em;height:2.5em;border-radius:.9em;background:rgba(255,255,255,.22);animation-name:bnInd}`),

        E('outline', `
& .k-scr{--ic:#868a8e;--ac:var(--a-brand);--af:currentColor}
& .nb{left:0;right:0;bottom:0;height:3.3em;background:var(--a-bg);border-top:1px solid var(--a-line)}`),

        E('indicator', `
& .k-scr{--ic:#868a8e;--ac:#1d1e20;--p:3.2em}
& .nb{left:0;right:0;bottom:0;height:3.3em;background:var(--a-bg);border-top:1px solid var(--a-line)}
& .ind{display:block;position:absolute;z-index:3;left:.8em;top:-1px;width:1.6em;height:.25em;border-radius:0 0 .2em .2em;background:var(--a-brand);animation-name:bnInd}`),

        E('curved', `
& .k-scr{--ic:#b4b7bb;--ac:#fff;--p:3.2em}
& .nb{left:0;right:0;bottom:0;height:3.4em;background:var(--a-dark)}
& .ind{display:block;position:absolute;z-index:1;left:-.3em;top:-1.9em;width:3.8em;height:3.8em;border-radius:50%;background:var(--a-bg);animation-name:bnInd}
& .dotb{display:block;position:absolute;z-index:1;left:.35em;top:-1.05em;width:2.5em;height:2.5em;border-radius:50%;background:var(--a-brand);box-shadow:0 .2em .5em rgba(194,71,25,.45);animation-name:bnInd}
& .t1 .k-i{animation-name:bnCvI1}.t-bottom-nav-styles-curved .t2 .k-i{animation-name:bnCvI2}.t-bottom-nav-styles-curved .t4 .k-i{animation-name:bnCvI4}
& .t1 em{animation-name:bnCvE1}.t-bottom-nav-styles-curved .t2 em{animation-name:bnCvE2}.t-bottom-nav-styles-curved .t4 em{animation-name:bnCvE4}
${lift('bnCvI1', '0%,25%{transform:translateY(-1.15em)}28%,83%{transform:none}87%,100%{transform:translateY(-1.15em)}')}
${lift('bnCvI2', '0%,25%{transform:none}28%,55%{transform:translateY(-1.15em)}58%,100%{transform:none}')}
${lift('bnCvI4', '0%,55%{transform:none}58%,85%{transform:translateY(-1.15em)}88%,100%{transform:none}')}
${lift('bnCvE1', '0%,25%{opacity:0}28%,83%{opacity:1}87%,100%{opacity:0}')}
${lift('bnCvE2', '0%,25%{opacity:1}28%,55%{opacity:0}58%,100%{opacity:1}')}
${lift('bnCvE4', '0%,55%{opacity:1}58%,85%{opacity:0}88%,100%{opacity:1}')}`),

        E('dock', `
& .k-scr{--ic:#fff;--ac:#fff}
& .k-r{background:transparent}
& .bl{display:block;position:absolute;z-index:0;border-radius:50%}
& .bl1{left:.4em;top:13.8em;width:7em;height:7em;background:#f6a98b;animation-name:bnGlB1}
& .bl2{right:-.4em;top:14.4em;width:7em;height:7em;background:#8fd3cc;animation-name:bnGlB2}
& .nb{left:1.2em;right:1.2em;bottom:.9em;height:3.6em;border-radius:1.3em;background:rgba(255,255,255,.55);-webkit-backdrop-filter:blur(.9em) saturate(1.5);backdrop-filter:blur(.9em) saturate(1.5);border:.06em solid rgba(255,255,255,.85);box-shadow:0 .4em 1em rgba(20,20,22,.18)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){& .nb{background:rgba(245,245,242,.96)}}
& .t1,& .t2,& .t3,& .t4,& .t5{animation-name:none}
& .t .k-i{animation-name:none}
& .tile{display:grid;place-items:center;width:2.2em;height:2.2em;border-radius:.65em;color:#fff;transform-origin:50% 100%}
& .tile .k-i{width:1.15em;height:1.15em}
& .t1 .tile{background:#c24719;animation-name:bnDk1}
& .t2 .tile{background:#23857d;animation-name:bnDk2}
& .t3 .tile{background:#b8860b;animation-name:bnDk3}
& .t4 .tile{background:#5c4fb3;animation-name:bnDk4}
& .t5 .tile{background:#4a5160;animation-name:bnDk5}
${dk('bnDk1', [1.4, 1.15, 1])}
${dk('bnDk2', [1.15, 1.4, 1])}
${dk('bnDk3', [1, 1.15, 1.15])}
${dk('bnDk4', [1, 1, 1.4])}
${dk('bnDk5', [1, 1, 1.15])}
@keyframes bnGlB1{0%,100%{transform:translateX(0)}50%{transform:translateX(6.5em)}}
@keyframes bnGlB2{0%,100%{transform:translateX(0)}50%{transform:translateX(-6.5em)}}`)
      ].join('\n');
    }
  });
})();
