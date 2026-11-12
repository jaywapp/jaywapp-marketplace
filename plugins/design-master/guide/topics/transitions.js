/* Topic: 화면 전환 (transitions). Reference: plugins/design-master/references/motion.md (B. 화면 전환 9종)
   Every selector starts with .t-transitions-<element>. Keyframe prefix: tr. */
(function () {
  const IDS = ['push', 'modal-present', 'fade-through', 'shared-element', 'card-expand', 'zoom', 'stagger-in', 'tab-switch', 'sheet-expand'];
  const all = rest => IDS.map(i => `.t-transitions-${i} ${rest}`).join(',');

  /* a detail screen for the grocery app */
  const detail = (K, t) => K.app.status() + K.app.bar(t, [], { back: true }) + K.wf('img', 1, 4.4, 14, 6) + K.wf('title', 1, 11.4, 7, .8) + K.wf('text', 1, 12.8, 14, 3);
  const BACK = [1.4, 2.5];

  /* stagger-in: five elements, each starts 6% after the previous */
  const STS = [24, 30, 36, 42, 48];
  const stKf = STS.map((s, i) => `@keyframes trSt${i}{0%,${s}%{opacity:0;transform:translateY(.8em)}${s + 8}%,92%{opacity:1;transform:none}93%,100%{opacity:0;transform:translateY(.8em)}}`).join('\n');

  UIGuide.registerTopic({
    id: 'transitions',
    intro: '화면이 바뀔 때의 움직임이에요. 화면 사이의 관계(위계, 독립 작업, 동등한 화면)에 맞는 전환을 골라요.',
    elements: [
      {
        id: 'push', ko: '푸시', en: 'Push', aka: ['밀어 넣기', 'slide in'],
        when: '목록에서 상세로, 설정에서 하위 설정으로',
        avoid: '계층이 아니라 위에 얹는 독립 작업(모달 등장)',
        notes: [
          '새 화면은 오른쪽에서 들어오고 이전 화면은 왼쪽으로 30% 정도 밀려요. 300~350ms.',
          '뒤로 가기는 반대 방향이며 가장자리 스와이프로도 조작할 수 있게 해요.',
          '이 시연은 보이도록 느리게 보여 줘요.'
        ],
        vs: { id: 'modal-present', text: '모달 등장은 아래에서 올라와 현재 화면 위에 얹혀요. 푸시는 같은 계층 안에서 옆으로 밀고 들어와요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2300,
          phases: [['푸시', 700, 1300], ['유지', 1300, 3300], ['뒤로', 3300, 3900]],
          alt: '장보기 목록에서 달걀 10구를 누르면 상세 화면이 오른쪽에서 밀고 들어오며 목록은 왼쪽으로 조금 밀려나고, 뒤로 가기를 누르면 상세가 오른쪽으로 나가고 목록이 돌아오는 시연',
          html: K => `<div class="pg pa">${K.app.screen()}</div><i class="dm"></i><div class="pg pb">${detail(K, '달걀 10구')}</div>` +
            K.tap(8, 7.15, 'tp1') + K.tap(BACK[0], BACK[1], 'tp2')
        }
      },
      {
        id: 'modal-present', ko: '모달 등장', en: 'Modal present', aka: ['아래에서 올라오기', 'present'],
        when: '새로 만들기, 독립 작업(작성, 설정), 흐름이 끝나면 돌아올 곳이 명확한 작업',
        avoid: '같은 계층으로 이동하는 화면(푸시)',
        notes: [
          '아래에서 위로 이동하며 300~350ms. 뒤 화면은 살짝 어둡게 해요.',
          '닫을 때는 반대로 내려가요. 닫기 버튼과 아래로 쓸기를 모두 제공해요.',
          '이 시연은 보이도록 느리게 보여 줘요.'
        ],
        vs: { id: 'sheet-expand', text: '시트 확장은 올라온 시트가 절반에서 전체 높이로 늘어나요. 모달 등장은 새 화면이 올라와 얹히는 것까지예요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2300,
          phases: [['등장', 600, 1300], ['유지', 1300, 3300], ['퇴장', 3300, 3900]],
          alt: '추가 버튼을 누르면 뒤 화면이 살짝 어두워지며 ‘새 항목’ 화면이 아래에서 올라와 얹히고, 닫기를 누르면 다시 아래로 내려가는 시연',
          html: K => `<div class="pg pa">${K.app.screen()}${K.app.fab()}</div><i class="sc"></i>` +
            `<div class="md"><div class="mh"><span class="xb">${K.icon('x')}</span><b>새 항목</b><span class="sp"></span></div><div class="mf">${K.app.field('이름', '우유 2L')}${K.app.field('수량', '1개')}</div><div class="mb">${K.app.button('목록에 담기', 'primary')}</div></div>` +
            K.tap(13.6, 18.9, 'tp1') + K.tap(1.5, 3.2, 'tp2')
        }
      },
      {
        id: 'fade-through', ko: '페이드 스루', en: 'Fade through', aka: ['페이드 아웃 후 인', 'fade thru'],
        when: '하단 탭 사이 전환처럼 서로 관계가 약한 동등한 화면 사이',
        avoid: '위계가 있는 이동(푸시)이나 어디서 왔는지 보여야 할 때(공유 요소)',
        notes: [
          '이전 화면이 90ms 페이드 아웃한 뒤 새 화면이 210ms 페이드 인해요. 새 화면은 0.92에서 1로 살짝 커져요.',
          '총 300ms 안팎. 두 화면이 겹치지 않아 잠깐 비는 순간이 있어요.',
          '이 시연은 보이도록 느리게 보여 줘요.'
        ],
        vs: { id: 'tab-switch', text: '탭 전환은 같은 개념의 구체 사례예요. 상단 탭은 좌우로 넘기는 슬라이드가 자연스럽고, 하단 탭은 페이드 스루가 어울려요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2200,
          phases: [['전환', 600, 1400], ['유지', 1400, 3000], ['전환', 3000, 3800]],
          alt: '하단의 가족 탭을 누르면 목록 화면이 먼저 사라지고 잠깐 빈 뒤 가족 화면이 살짝 커지며 나타나고, 목록 탭을 누르면 같은 순서로 목록으로 돌아오는 시연',
          html: K => `<div class="cn"><div class="pg pa">${K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more']) + K.app.list(0, 5)}</div>` +
            `<div class="pg pb">${K.app.status() + K.app.bar('가족', []) + ['엄마|3개 담음', '아빠|2개 담음', '동생|1개 담음'].map(s => { const [n, q] = s.split('|'); return `<div class="mr"><span class="av">${K.icon('user')}</span><b>${n}</b><em>${q}</em></div>`; }).join('')}</div></div>` +
            K.app.tabs(0) + K.tap(8, 19.9, 'tp1') + K.tap(2.67, 19.9, 'tp2')
        }
      },
      {
        id: 'shared-element', ko: '공유 요소', en: 'Shared element', aka: ['히어로', 'hero'],
        when: '목록의 카드를 눌러 상세로 갈 때, 사진을 열 때. 어디서 왔는지 맥락을 유지하고 싶을 때',
        avoid: '두 화면 사이에 대응되는 요소가 없을 때, 목록 항목이 많아 성능이 떨어질 때',
        notes: [
          '웹은 View Transitions API(view-transition-name)로 구현하고, 지원 여부를 확인해 페이드로 대체해요.',
          '뒤로 가기에서도 역방향으로 같은 요소가 돌아가야 해요. 300~400ms.',
          '모바일은 플랫폼의 Hero(Flutter)나 Shared Element Transition(Android)을 써요.'
        ],
        vs: { id: 'card-expand', text: '카드 확장은 카드 전체가 화면이 되고, 공유 요소는 핵심 요소(사진)만 두 화면 사이를 이동해요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2300,
          phases: [['이동', 700, 1500], ['유지', 1500, 3100], ['되돌아감', 3300, 3900]],
          alt: '두 장의 카드 목록에서 달걀 카드의 사진을 누르면 그 사진이 커지며 상세 화면의 큰 사진이 되고 나머지 카드는 사라지며, 뒤로 가기를 누르면 같은 사진이 카드 자리로 돌아가는 시연',
          html: K => `<div class="pg">${K.app.status()}<div class="ba">${K.app.bar('이번 주 장보기', ['share', 'more'])}</div><div class="bb">${K.app.bar('달걀 10구', [], { back: true })}</div>` +
            '<div class="cdA"><b>달걀 10구</b><span>1판 · 가족이 담았어요</span></div>' +
            '<div class="cdB"><i class="im"></i><b>두부</b><span>2모</span></div>' +
            '<div class="dtl"><b>달걀 10구</b><p>1판 · 가족 3명이 담았어요</p></div>' + K.wf('text', 1, 14.4, 14, 2.4, 'dtx') + '</div>' +
            '<i class="hr"></i>' + K.tap(8, 6.6, 'tp1') + K.tap(BACK[0], BACK[1], 'tp2')
        }
      },
      {
        id: 'card-expand', ko: '카드 확장', en: 'Card expand', aka: ['컨테이너 변형', 'container transform'],
        when: '카드형 목록에서 항목을 열 때, 지도 위 카드에서 상세로',
        avoid: '카드와 상세 사이에 이어 보여 줄 핵심 요소가 하나뿐일 때(공유 요소)',
        notes: [
          '카드의 위치와 크기에서 화면 크기로 컨테이너가 변형돼요. 내용은 늦게 페이드로 나타나요.',
          '닫을 때는 같은 카드 위치로 돌아가요. 스크롤 위치를 보존해요. 350~400ms.',
          '이 시연은 보이도록 느리게 보여 줘요.'
        ],
        vs: { id: 'sheet-expand', text: '시트 확장은 아래에서 올라온 시트가 높이만 늘어나요. 카드 확장은 카드가 그 자리에서 사방으로 커져요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2300,
          phases: [['확장', 600, 1400], ['유지', 1400, 3100], ['축소', 3200, 3900]],
          alt: '두 장의 카드 중 첫 번째 카드를 누르면 카드가 그 자리에서 화면 전체로 커지고 그 안에 상세 내용이 늦게 나타나며, 뒤로 가기를 누르면 같은 카드 모양으로 다시 줄어드는 시연',
          html: K => `<div class="pg">${K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more'])}<div class="cd"><div class="tw"><b>달걀 10구</b><span>1판 · 가족 3명이 담았어요</span></div></div><div class="cd c2"><div class="tw"><b>두부</b><span>2모 · 가족 1명이 담았어요</span></div></div></div>` +
            `<div class="ex">${K.app.status()}<div class="dbar">${K.app.bar('상세', [], { back: true })}</div><div class="tw"><b>달걀 10구</b><span>1판 · 가족 3명이 담았어요</span></div><div class="dc">${K.wf('img', 1, 9, 14, 6)}${K.wf('text', 1, 15.8, 14, 2.6)}</div></div>` +
            K.tap(8, 7.1, 'tp1') + K.tap(BACK[0], BACK[1], 'tp2')
        }
      },
      {
        id: 'zoom', ko: '줌', en: 'Zoom', aka: ['확대 이동', 'zoom in'],
        when: '갤러리의 사진 열기, 폴더 열기, 계층 깊이를 표현할 때',
        avoid: '배율이 3배 이상으로 커질 때(멀미를 줄 수 있어 줄여요)',
        notes: [
          'scale은 0.9~1.1 범위에서 페이드와 함께 써요. 큰 배율(3배 이상)은 멀미를 줄 수 있어요.',
          '들어갈 때 새 화면은 작게 시작해 커지고, 이전 화면은 더 커지며 사라져요. 닫을 때는 반대로 줄어들어요.',
          '확대의 기본 개념은 움직임 이름의 확대 전환이에요. 이 시연은 보이도록 느리게 보여 줘요.'
        ],
        vs: { id: 'card-expand', text: '카드 확장은 출발 요소(카드)가 있고 그 자리에서 커져요. 줌은 화면 전체가 깊이감 있게 확대되며 들어가요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2000,
          phases: [['확대', 600, 1200], ['유지', 1200, 3100], ['축소', 3100, 3700]],
          alt: '장보기 목록에서 두부를 누르면 목록이 조금 커지며 흐려지고 두부 상세 화면이 0.92배에서 1배로 커지며 나타나고, 뒤로 가기를 누르면 상세가 줄어들며 사라지고 목록이 돌아오는 시연',
          html: K => `<div class="pg pa">${K.app.screen()}</div><div class="pg pb">${detail(K, '두부')}</div>` + K.tap(8, 9.45, 'tp1') + K.tap(BACK[0], BACK[1], 'tp2')
        }
      },
      {
        id: 'stagger-in', ko: '순차 등장', en: 'Stagger in', aka: ['차례로 등장', 'staggered entrance'],
        when: '새 화면의 주요 요소 3~5개를 순차로 보여 줄 때',
        avoid: '요소가 많아 마지막까지 오래 걸릴 때, 반복해서 방문하는 화면',
        notes: [
          '새 화면의 주요 요소 3~5개를 순차로 보여 줘요.',
          '항목 간 지연은 30~80ms, 전체 지연의 합은 500ms 이하로 해요. 이 시연은 차이가 보이도록 느리게 보여 줘요.',
          '각 요소는 8~16px 이동과 페이드를 함께 써요.'
        ],
        vs: { topic: 'motion-names', id: 'stagger', name: '순차 등장', text: '움직임 이름의 순차 등장은 목록 하나가 나타나는 연출이고, 이 항목은 화면이 바뀐 직후 새 화면의 요소를 차례로 보여 주는 쓰임이에요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2900,
          phases: [['푸시', 500, 1000], ['순차', 1200, 2800], ['유지', 2800, 4100], ['뒤로', 4100, 4600]],
          alt: '추가 버튼을 누르면 새 화면이 옆에서 들어오고, 요약 카드와 항목 네 개가 위에서부터 하나씩 차례로 떠오르며 나타난 뒤 뒤로 가기로 돌아가는 시연',
          html: K => `<div class="pg pa">${K.app.screen()}${K.app.fab()}</div>` +
            `<div class="pg pb">${K.app.status() + K.app.bar('이번 주 장보기', [], { back: true })}<div class="sm"><b>남은 항목 5개</b><span>가족 3명이 함께 담고 있어요</span></div>${K.app.list(0, 4)}</div>` +
            K.tap(13.6, 18.9, 'tp1') + K.tap(BACK[0], BACK[1], 'tp2')
        }
      },
      {
        id: 'tab-switch', ko: '탭 전환', en: 'Tab switch', aka: ['탭 내용 전환', 'tab content'],
        when: '상단 탭과 하단 탭의 내용 전환',
        avoid: '탭마다 스크롤 위치나 입력 상태가 사라질 때(탭을 바꿔도 보존해요)',
        notes: [
          '하단 탭은 보통 즉시 교체나 페이드 스루예요. 상단 탭은 좌우로 넘기는 슬라이드가 자연스러워요(탭 순서 방향과 일치).',
          '각 탭의 스크롤 위치와 입력 상태를 보존해요.',
          '200~300ms. 이 시연은 보이도록 느리게 보여 줘요.'
        ],
        vs: { id: 'fade-through', text: '페이드 스루는 하단 탭처럼 동등한 화면을 겹치지 않게 교체해요. 탭 전환의 상단 탭은 순서 방향으로 좌우로 밀어요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2000,
          phases: [['넘김', 550, 1100], ['유지', 1100, 3000], ['넘김', 3000, 3550]],
          alt: '상단의 담은 것 탭을 누르면 밑줄이 오른쪽으로 옮겨 가고 내용이 왼쪽으로 밀리며 담은 항목 목록이 나타나고, 담을 것 탭을 누르면 반대 방향으로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', []) +
            '<div class="tt"><span class="tl tl0">담을 것</span><span class="tl tl1">담은 것</span><i class="ul"></i></div>' +
            `<div class="pn"><div class="tr"><div>${K.app.list(0, 4)}</div><div>${K.app.list(4, 8, { checked: [4, 5, 6, 7] })}</div></div></div>` +
            K.tap(12, 4.8, 'tp1') + K.tap(4, 4.8, 'tp2')
        }
      },
      {
        id: 'sheet-expand', ko: '시트 확장', en: 'Sheet expand', aka: ['시트 늘리기', 'expandable sheet'],
        when: '지도 위 상세, 음악 플레이어 미니에서 전체로, 공유나 선택 시트',
        avoid: '끌어서 높이를 바꿀 필요가 없는 짧은 선택 시트(바텀시트 그대로)',
        notes: [
          '끌기에 따라 연속적으로 따라오게 해요(제스처 연동). 놓을 때 가까운 단계로 스프링 스냅해요.',
          '확장되면서 안의 레이아웃이 바뀌면 크로스페이드로 이어요.',
          '시트 자체는 알림·피드백 주제의 바텀시트예요. 이 시연은 보이도록 느리게 보여 줘요.'
        ],
        vs: { id: 'modal-present', text: '모달 등장은 새 화면이 올라와 얹히는 것까지예요. 시트 확장은 올라온 시트를 끌어 절반에서 전체 높이로 늘려요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3200,
          phases: [['등장', 480, 1080], ['유지', 1080, 1800], ['확장', 1800, 2880], ['유지', 2880, 3720], ['닫힘', 3720, 4680]],
          alt: '추가 버튼을 누르면 시트가 화면 절반 높이로 올라오고, 손가락이 손잡이를 끌어 올리면 시트가 따라 올라가 놓는 순간 스프링처럼 전체 높이에 붙으며, 다시 끌어 내리면 아래로 닫히는 시연',
          html: K => `<div class="pg">${K.app.screen()}${K.app.fab()}</div><i class="sc"></i>` +
            `<div class="sh"><i class="grab"></i><b>장보기 목록 8개</b>${K.app.rows(0, 8)}</div>` +
            K.tap(13.6, 18.9, 'tp') + K.finger(8, 12.6, 'f1') + K.finger(8, 2.4, 'f2')
        }
      }
    ],
    css: K => `
/* shared page layers */
${all('.pg')}{position:absolute;inset:0;background:var(--a-bg);overflow:hidden}

/* push */
.t-transitions-push .pa{animation-name:trPuA}
.t-transitions-push .pb{z-index:3;box-shadow:-.6em 0 1.2em rgba(0,0,0,.14);animation-name:trPuB}
.t-transitions-push .dm{position:absolute;inset:0;z-index:2;background:#000;opacity:0;animation-name:trPuD}
.t-transitions-push .tp1{animation-name:trPuTap1}
.t-transitions-push .tp2{animation-name:trPuTap2}
@keyframes trPuA{0%,14%{transform:translateX(0)}26%,66%{transform:translateX(-30%)}78%,100%{transform:translateX(0)}}
@keyframes trPuB{0%,14%{transform:translateX(100%)}26%,66%{transform:translateX(0)}78%,100%{transform:translateX(100%)}}
@keyframes trPuD{0%,14%{opacity:0}26%,66%{opacity:.14}78%,100%{opacity:0}}
${K.kf.tap('trPuTap1', 10)}
${K.kf.tap('trPuTap2', 62)}

/* modal present */
.t-transitions-modal-present .pa{animation-name:trMdA}
.t-transitions-modal-present .sc{position:absolute;inset:0;z-index:5;background:rgba(18,18,20,.5);opacity:0;animation-name:trMdS}
.t-transitions-modal-present .md{position:absolute;z-index:6;left:0;right:0;bottom:0;top:1.8em;background:var(--a-bg);border-radius:1.1em 1.1em 0 0;box-shadow:0 -.4em 1.4em rgba(10,10,12,.2);transform:translateY(100%);animation-name:trMdM}
.t-transitions-modal-present .mh{height:2.8em;display:flex;align-items:center;justify-content:space-between;padding:0 .6em;border-bottom:1px solid var(--a-line)}
.t-transitions-modal-present .mh b{font-size:.84em}
.t-transitions-modal-present .xb,.t-transitions-modal-present .sp{width:1.8em;height:1.8em;display:grid;place-items:center}
.t-transitions-modal-present .xb .k-i{width:1.1em;height:1.1em}
.t-transitions-modal-present .mf{padding:1.1em 1em;display:flex;flex-direction:column;gap:.9em}
.t-transitions-modal-present .mb{position:absolute;left:1em;right:1em;bottom:1.2em}
.t-transitions-modal-present .mb .k-btn{display:grid;width:100%;height:3.4em;font-size:.72em}
.t-transitions-modal-present .tp1{animation-name:trMdTap1}
.t-transitions-modal-present .tp2{animation-name:trMdTap2}
@keyframes trMdA{0%,12%{transform:scale(1) translateY(0)}26%,66%{transform:scale(.94) translateY(.5em)}78%,100%{transform:scale(1) translateY(0)}}
@keyframes trMdS{0%,12%{opacity:0}26%,66%{opacity:1}78%,100%{opacity:0}}
@keyframes trMdM{0%,12%{transform:translateY(100%)}26%,66%{transform:translateY(0)}78%,100%{transform:translateY(100%)}}
${K.kf.tap('trMdTap1', 8)}
${K.kf.tap('trMdTap2', 62)}

/* fade through */
.t-transitions-fade-through .cn{position:absolute;left:0;right:0;top:0;bottom:2.9em;overflow:hidden}
.t-transitions-fade-through .pa{animation-name:trFtA}
.t-transitions-fade-through .pb{opacity:0;transform:scale(.92);animation-name:trFtB}
.t-transitions-fade-through .mr{display:flex;align-items:center;gap:.7em;height:2.6em;padding:0 1em;border-bottom:1px solid var(--a-line)}
.t-transitions-fade-through .av{width:1.6em;height:1.6em;border-radius:50%;background:var(--a-soft);display:grid;place-items:center;color:var(--a-mut)}
.t-transitions-fade-through .av .k-i{width:.95em;height:.95em}
.t-transitions-fade-through .mr b{margin-right:auto;font-size:.74em}
.t-transitions-fade-through .mr em{font-style:normal;font-size:.62em;color:var(--a-mut)}
.t-transitions-fade-through .k-tab-0{animation-name:trFtT0}
.t-transitions-fade-through .k-tab-1{animation-name:trFtT1}
.t-transitions-fade-through .tp1{animation-name:trFtTap1}
.t-transitions-fade-through .tp2{animation-name:trFtTap2}
@keyframes trFtA{0%,12%{opacity:1;transform:scale(1)}18%{opacity:0;transform:scale(1)}19%,66%{opacity:0;transform:scale(.92)}76%,100%{opacity:1;transform:scale(1)}}
@keyframes trFtB{0%,18%{opacity:0;transform:scale(.92)}28%,60%{opacity:1;transform:scale(1)}66%{opacity:0;transform:scale(1)}67%,100%{opacity:0;transform:scale(.92)}}
@keyframes trFtT0{0%,12%{color:var(--a-ink)}16%,60%{color:var(--a-mut)}66%,100%{color:var(--a-ink)}}
@keyframes trFtT1{0%,12%{color:var(--a-mut)}16%,60%{color:var(--a-ink)}66%,100%{color:var(--a-mut)}}
${K.kf.tap('trFtTap1', 10)}
${K.kf.tap('trFtTap2', 58)}

/* shared element */
.t-transitions-shared-element .ba{position:absolute;left:0;right:0;top:1.3em;animation-name:trShBa}
.t-transitions-shared-element .bb{position:absolute;left:0;right:0;top:1.3em;opacity:0;animation-name:trShBb}
.t-transitions-shared-element .cdA{position:absolute;left:1em;top:9em;animation-name:trShCa}
.t-transitions-shared-element .cdA b,.t-transitions-shared-element .cdB b{display:block;font-size:.82em}
.t-transitions-shared-element .cdA span,.t-transitions-shared-element .cdB span{display:block;margin-top:.15em;font-size:.62em;color:var(--a-mut)}
.t-transitions-shared-element .cdB{position:absolute;left:1em;top:11.2em;width:14em;animation-name:trShCa}
.t-transitions-shared-element .cdB .im{display:block;width:14em;height:4em;margin-bottom:.35em;border-radius:.5em;background:#e3e4e0}
.t-transitions-shared-element .dtl{position:absolute;left:1em;top:10.9em;opacity:0;animation-name:trShDt}
.t-transitions-shared-element .dtl b{display:block;font-size:1.05em}
.t-transitions-shared-element .dtl p{margin:.35em 0 0;font-size:.64em;color:var(--a-mut)}
.t-transitions-shared-element .dtx{opacity:0;animation-name:trShDt}
.t-transitions-shared-element .hr{position:absolute;z-index:4;left:0;top:3.7em;width:16em;height:6.4em;background:#e9cdbd;transform-origin:0 0;animation-name:trShH}
.t-transitions-shared-element .tp1{animation-name:trShTap1}
.t-transitions-shared-element .tp2{animation-name:trShTap2}
@keyframes trShBa{0%,14%{opacity:1}22%,66%{opacity:0}76%,100%{opacity:1}}
@keyframes trShBb{0%,14%{opacity:0}24%,64%{opacity:1}72%,100%{opacity:0}}
@keyframes trShCa{0%,14%{opacity:1}22%,66%{opacity:0}76%,100%{opacity:1}}
@keyframes trShDt{0%,22%{opacity:0}32%,60%{opacity:1}66%,100%{opacity:0}}
@keyframes trShH{0%,12%{transform:translate(1em,.9em) scale(.875,.625)}30%,62%{transform:none}78%,100%{transform:translate(1em,.9em) scale(.875,.625)}}
${K.kf.tap('trShTap1', 8)}
${K.kf.tap('trShTap2', 58)}

/* card expand */
.t-transitions-card-expand .cd{position:absolute;left:1em;top:4.6em;width:14em;height:5em;border-radius:.7em;background:var(--a-soft)}
.t-transitions-card-expand .c2{top:10.4em}
.t-transitions-card-expand .tw{position:absolute;left:.9em;top:.9em}
.t-transitions-card-expand .tw b{display:block;font-size:.84em}
.t-transitions-card-expand .tw span{display:block;margin-top:.3em;font-size:.62em;color:var(--a-mut)}
.t-transitions-card-expand .ex{position:absolute;inset:0;z-index:20;opacity:0;background:var(--a-soft);clip-path:inset(4.6em 1em 11.73em 1em round .7em);animation-name:trCxL}
.t-transitions-card-expand .ex .k-sb{position:absolute;left:0;right:0;top:0}
.t-transitions-card-expand .dbar{position:absolute;left:0;right:0;top:1.3em;opacity:0;animation-name:trCxB}
.t-transitions-card-expand .ex .tw{left:1.9em;top:5.5em}
.t-transitions-card-expand .dc{position:absolute;inset:0;opacity:0;animation-name:trCxC}
.t-transitions-card-expand .tp1{animation-name:trCxTap1}
.t-transitions-card-expand .tp2{animation-name:trCxTap2}
@keyframes trCxL{
  0%,11%{opacity:0;clip-path:inset(4.6em 1em 11.73em 1em round .7em);background:var(--a-soft)}
  11.5%{opacity:1;clip-path:inset(4.6em 1em 11.73em 1em round .7em);background:var(--a-soft)}
  28%,64%{opacity:1;clip-path:inset(0 0 0 0 round 0);background:var(--a-bg)}
  78%{opacity:1;clip-path:inset(4.6em 1em 11.73em 1em round .7em);background:var(--a-soft)}
  78.5%,100%{opacity:0;clip-path:inset(4.6em 1em 11.73em 1em round .7em);background:var(--a-soft)}
}
@keyframes trCxB{0%,22%{opacity:0}32%,58%{opacity:1}64%,100%{opacity:0}}
@keyframes trCxC{0%,26%{opacity:0}36%,56%{opacity:1}62%,100%{opacity:0}}
${K.kf.tap('trCxTap1', 8)}
${K.kf.tap('trCxTap2', 58)}

/* zoom */
.t-transitions-zoom .pg{transform-origin:8em 9.45em}
.t-transitions-zoom .pa{animation-name:trZmA}
.t-transitions-zoom .pb{opacity:0;animation-name:trZmB}
.t-transitions-zoom .tp1{animation-name:trZmTap1}
.t-transitions-zoom .tp2{animation-name:trZmTap2}
@keyframes trZmA{0%,12%{transform:scale(1);opacity:1}24%,62%{transform:scale(1.1);opacity:0}74%,100%{transform:scale(1);opacity:1}}
@keyframes trZmB{0%,12%{transform:scale(.92);opacity:0}24%,62%{transform:scale(1);opacity:1}74%,100%{transform:scale(.92);opacity:0}}
${K.kf.tap('trZmTap1', 8)}
${K.kf.tap('trZmTap2', 58)}

/* stagger in */
.t-transitions-stagger-in .pa{animation-name:trSiA}
.t-transitions-stagger-in .pb{z-index:3;animation-name:trSiB}
.t-transitions-stagger-in .sm{margin:.9em 1em .6em;padding:.8em 1em;border-radius:.8em;background:var(--a-soft);animation-name:trSt0}
.t-transitions-stagger-in .sm b{display:block;font-size:.84em}
.t-transitions-stagger-in .sm span{display:block;margin-top:.2em;font-size:.62em;color:var(--a-mut)}
.t-transitions-stagger-in .k-r1{animation-name:trSt1}.t-transitions-stagger-in .k-r2{animation-name:trSt2}
.t-transitions-stagger-in .k-r3{animation-name:trSt3}.t-transitions-stagger-in .k-r4{animation-name:trSt4}
.t-transitions-stagger-in .tp1{animation-name:trSiTap1}
.t-transitions-stagger-in .tp2{animation-name:trSiTap2}
@keyframes trSiA{0%,10%{transform:translateX(0)}20%,82%{transform:translateX(-30%)}92%,100%{transform:translateX(0)}}
@keyframes trSiB{0%,10%{transform:translateX(100%)}20%,82%{transform:translateX(0)}92%,100%{transform:translateX(100%)}}
${stKf}
${K.kf.tap('trSiTap1', 6)}
${K.kf.tap('trSiTap2', 76)}

/* tab switch */
.t-transitions-tab-switch .tt{position:absolute;left:0;right:0;top:3.7em;height:2.2em;display:flex;border-bottom:1px solid var(--a-line);background:var(--a-bg);z-index:2}
.t-transitions-tab-switch .tl{flex:1;display:grid;place-items:center;font-size:.74em;font-weight:700;color:var(--a-mut)}
.t-transitions-tab-switch .tl0{animation-name:trTsT0}.t-transitions-tab-switch .tl1{animation-name:trTsT1}
.t-transitions-tab-switch .ul{position:absolute;left:0;bottom:-1px;width:8em;height:.18em;background:var(--a-brand);animation-name:trTsU}
.t-transitions-tab-switch .pn{position:absolute;left:0;right:0;top:5.9em;bottom:0;overflow:hidden}
.t-transitions-tab-switch .tr{display:flex;width:32em;height:100%;animation-name:trTsP}
.t-transitions-tab-switch .tr>div{width:16em;flex:none}
.t-transitions-tab-switch .tp1{animation-name:trTsTap1}
.t-transitions-tab-switch .tp2{animation-name:trTsTap2}
@keyframes trTsP{0%,11%{transform:translateX(0)}22%,60%{transform:translateX(-16em)}71%,100%{transform:translateX(0)}}
@keyframes trTsU{0%,11%{transform:translateX(0)}22%,60%{transform:translateX(8em)}71%,100%{transform:translateX(0)}}
@keyframes trTsT0{0%,11%{color:var(--a-ink)}16%,56%{color:var(--a-mut)}62%,100%{color:var(--a-ink)}}
@keyframes trTsT1{0%,11%{color:var(--a-mut)}16%,56%{color:var(--a-ink)}62%,100%{color:var(--a-mut)}}
${K.kf.tap('trTsTap1', 8)}
${K.kf.tap('trTsTap2', 56)}

/* sheet expand */
.t-transitions-sheet-expand .sc{position:absolute;inset:0;z-index:10;background:rgba(18,18,20,.5);opacity:0;animation-name:trShS}
.t-transitions-sheet-expand .sh{position:absolute;z-index:12;left:0;right:0;top:1.6em;height:20.7em;background:var(--a-bg);border-radius:1em 1em 0 0;box-shadow:0 -.4em 1.4em rgba(10,10,12,.18);overflow:hidden;transform:translateY(20em);animation-name:trShT}
.t-transitions-sheet-expand .grab{position:absolute;left:50%;top:.6em;width:2.2em;height:.25em;margin-left:-1.1em;border-radius:1em;background:#cfcfcb}
.t-transitions-sheet-expand .sh>b{display:block;padding:1.3em 1em .6em;font-size:.76em}
.t-transitions-sheet-expand .tp{animation-name:trShTap}
.t-transitions-sheet-expand .f1{animation-name:trShF1}
.t-transitions-sheet-expand .f2{animation-name:trShF2}
@keyframes trShS{0%,8%{opacity:0}18%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes trShT{
  0%,8%{transform:translateY(20em)}
  18%,30%{transform:translateY(10.2em)}
  40%{transform:translateY(.6em);animation-timing-function:cubic-bezier(.3,1.5,.6,1)}
  48%,62%{transform:translateY(0)}
  70%{transform:translateY(6em)}
  78%,100%{transform:translateY(20em)}
}
${K.kf.tap('trShTap', 5)}
${K.kf.drag('trShF1', 30, 40, 0, -9.6)}
${K.kf.drag('trShF2', 62, 70, 0, 6)}
`
  });
})();
