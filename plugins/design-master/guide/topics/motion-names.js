/* Topic: 움직임 이름 (motion-names). Reference: plugins/design-master/references/motion.md (A. 움직임 이름 9종)
   Every selector starts with .t-motion-names-<element>. Keyframe prefix: mn. */
(function () {
  const MV = ['ease-in', 'ease-out', 'spring'];
  const sel = (ids, rest) => ids.map(i => `.t-motion-names-${i} ${rest}`).join(',');

  /* small speed-curve chart: cubic-bezier points mapped into a 40x40 box (y may overshoot 1) */
  const curve = (x1, y1, x2, y2) => {
    const px = v => (4 + v * 32).toFixed(1), py = v => (26 - v * 22).toFixed(1);
    return `<svg class="cv" viewBox="0 -10 40 40" aria-hidden="true"><path class="ax" d="M4 26V0M4 26H38"/><path class="ln" d="M4 26L36 4"/><path class="cu" d="M4 26C${px(x1)} ${py(y1)} ${px(x2)} ${py(y2)} 36 4"/></svg>`;
  };
  /* two balls on two tracks: the named curve on top, a gray comparison below */
  const mv = (l1, l2, cv, extra) => `<span class="lb la"><b>${l1}</b></span><span class="lb lc"><b>${l2}</b></span><i class="tk ta"></i><i class="tk tc"></i>${extra || ''}<i class="bl ba"></i><i class="bl bc"></i>${cv}`;
  const mvPhases = [['대기', 0, 360], ['이동', 360, 2160], ['유지', 2160, 2950], ['퇴장', 2950, 3250]];

  /* stagger: four items per column, each with its own start */
  const STS = [10, 17, 24, 31];
  const stKf = STS.map((s, i) => `@keyframes mnSt${i + 1}{0%,${s}%{opacity:0;transform:translateY(.7em)}${s + 8}%,88%{opacity:1;transform:none}94%,100%{opacity:0;transform:translateY(.7em)}}`).join('\n');
  const NAMES = ['우유 2L', '달걀 10구', '두부', '대파'];

  UIGuide.registerTopic({
    id: 'motion-names',
    intro: '움직임의 이름과 성격이에요. 속도 곡선, 튀는 정도, 나타나는 순서, 이동하는 방식에 따라 느낌이 달라져요.',
    elements: [
      {
        id: 'ease-in', ko: '이즈 인', en: 'Ease-in', aka: ['ease in', '가속'],
        when: '화면 밖으로 나가는 요소(퇴장). 가속하며 사라지는 느낌',
        avoid: '등장하는 요소와 사용자 입력에 반응하는 요소(시작이 느려서 굼뜨게 느껴져요)',
        notes: [
          'cubic-bezier(0.4, 0, 1, 1) 또는 ease-in을 써요.',
          '퇴장은 150~250ms로 하고, 등장보다 20~30% 짧게 해요.',
          '처음에는 느리고 끝으로 갈수록 빨라져요. 사용자 입력에 대한 반응은 100ms 안에 시작해야 해서 이 곡선과 맞지 않아요.'
        ],
        vs: { id: 'ease-out', text: '이즈 아웃은 반대예요. 처음에 빠르게 시작해 끝에서 느려지며 멈춰요.' },
        demo: {
          frame: 'bare', cycle: 3600, still: 1260, phases: mvPhases,
          alt: '주황색 공이 처음에는 느리게 출발해 점점 빨라지며 오른쪽 끝까지 가고, 아래의 회색 공은 일정한 속도로 움직여 중간쯤에서 주황색 공이 뒤처져 있는 시연',
          html: K => mv('이즈 인', '선형(비교)', curve(.4, 0, 1, 1))
        }
      },
      {
        id: 'ease-out', ko: '이즈 아웃', en: 'Ease-out', aka: ['ease out', '감속'],
        when: '등장하는 요소, 사용자 입력에 대한 반응. 대부분의 UI 기본값',
        avoid: '끝에서 멈추는 것이 어색한 연속 회전(선형이 맞아요)',
        notes: [
          'cubic-bezier(0, 0, 0.2, 1) 또는 ease-out을 써요.',
          '200~300ms. 처음에 빠르게 시작해서 입력에 곧바로 반응하는 느낌을 줘요.',
          '모달, 시트의 등장은 이즈 아웃, 퇴장은 이즈 인으로 짝을 맞춰요.'
        ],
        vs: { id: 'spring', text: '스프링은 끝에서 목표를 살짝 넘었다가 돌아와요. 이즈 아웃은 넘치지 않고 그대로 멈춰요.' },
        demo: {
          frame: 'bare', cycle: 3600, still: 1260, phases: mvPhases,
          alt: '주황색 공이 처음에 빠르게 출발해 끝으로 갈수록 느려지며 멈추고, 아래의 회색 공은 일정한 속도로 움직여 중간쯤에서 주황색 공이 앞서 있는 시연',
          html: K => mv('이즈 아웃', '선형(비교)', curve(0, 0, .2, 1))
        }
      },
      {
        id: 'spring', ko: '스프링', en: 'Spring', aka: ['용수철', '물리 기반'],
        when: '드래그 후 놓았을 때, 시트나 카드가 제자리를 찾을 때, 살아 있는 느낌이 필요한 인터랙션',
        avoid: '업무용 화면의 잦은 전환, 접근성이 중요한 곳(많이 넘치는 설정)',
        notes: [
          '강성(stiffness)과 감쇠(damping)로 정의해요. 넘침은 약하게, 감쇠비는 약 0.7~0.9예요.',
          '전체 시간은 300~500ms. 이 시연은 곡선 모양이 보이도록 느리게 보여 줘요.',
          'CSS는 linear() 함수로 근사하거나 Framer Motion, React Spring 같은 라이브러리를 써요.'
        ],
        vs: { id: 'bounce', text: '바운스는 바닥에서 여러 번 튀고 스프링은 목표를 한두 번 넘었다가 돌아와 멈춰요.' },
        demo: {
          frame: 'bare', cycle: 3600, still: 1400, phases: mvPhases,
          alt: '주황색 공이 빠르게 출발해 점선으로 그은 목표 위치를 살짝 지나쳤다가 되돌아와 멈추고, 아래의 회색 공은 이즈 아웃으로 넘치지 않고 멈추는 시연',
          html: K => mv('스프링', '이즈 아웃(비교)', curve(.34, 1.56, .64, 1), '<i class="tg"></i>')
        }
      },
      {
        id: 'bounce', ko: '바운스', en: 'Bounce', aka: ['튕김', '통통'],
        when: '알림 주목, 장난스러운 브랜드, 어린이·게임 앱, 짧은 보상 연출',
        avoid: '반복되거나 업무·금융 화면. 눈에 띄는 만큼 피로가 커요.',
        notes: [
          '튀는 횟수는 2~3회, 총 600ms 이내로 해요. 이 시연은 보이도록 느리게 보여 줘요.',
          '반복 재생(무한)은 피하고 한 번만 재생해요.',
          'prefers-reduced-motion이면 생략해요.'
        ],
        vs: { id: 'spring', text: '스프링은 한두 번 넘치고 멈추고, 바운스는 바닥에 떨어진 공처럼 여러 번 튀어요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 1700,
          phases: [['낙하', 320, 1200], ['튕김', 1200, 2960], ['유지', 2960, 3520], ['퇴장', 3520, 3760]],
          alt: '주황색 공이 바닥으로 떨어져 세 번 튀며 점점 낮게 튀다 멈추고, 오른쪽의 회색 공은 한 번 떨어진 뒤 그대로 멈춰 있는 시연',
          html: K => '<i class="fl"></i><i class="bl x1"></i><i class="bl x2"></i><span class="lb l1"><b>바운스</b></span><span class="lb l2"><b>튀지 않고 멈춤</b></span>'
        }
      },
      {
        id: 'stagger', ko: '순차 등장', en: 'Stagger', aka: ['스태거', '차례로'],
        when: '목록, 카드 모음, 메뉴 항목이 처음 나타날 때',
        avoid: '항목이 많아(10개 이상) 마지막 항목까지 오래 걸릴 때. 반복 방문 화면.',
        notes: [
          '항목 간 지연은 30~80ms, 전체 지연의 합은 500ms 이하로 해요. 항목이 많으면 첫 몇 개만 순차로 해요. 이 시연은 차이가 보이도록 느리게 보여 줘요.',
          '각 항목은 8~16px 이동과 페이드를 함께 써요.',
          'animation-delay를 calc(var(--i) * 50ms)처럼 인덱스로 줘요.'
        ],
        vs: { id: 'fade', text: '페이드는 전체가 동시에 나타나고, 순차 등장은 짧은 간격을 두고 하나씩 차례로 나타나요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2400,
          phases: [['등장', 400, 1560], ['유지', 1560, 3520], ['퇴장', 3520, 3760]],
          alt: '왼쪽 목록은 항목 네 개가 위에서부터 하나씩 차례로 떠오르고, 오른쪽 목록은 네 개가 한꺼번에 나타나는 시연',
          html: K => '<span class="hd h1"><b>차례로</b></span><span class="hd h2"><b>한꺼번에</b></span>' +
            NAMES.map((n, i) => `<div class="it c1 y${i + 1} s${i + 1}"><b>${n}</b></div>`).join('') +
            NAMES.map((n, i) => `<div class="it c2 y${i + 1} sa"><b>${n}</b></div>`).join('')
        }
      },
      {
        id: 'fade', ko: '페이드', en: 'Fade', aka: ['투명도', 'opacity'],
        when: '요소의 등장·퇴장, 관계가 약한 화면의 교체, 접근성 대체 모션(다른 모션을 줄일 때)',
        avoid: '공간적 관계(어디서 왔는지)를 알려야 할 때(슬라이드나 공유 요소)',
        notes: [
          '150~300ms. 위치는 그대로 두고 투명도만 바꿔요.',
          '페이드로 사라진 요소는 visibility: hidden이나 inert로 포커스와 읽기 대상에서도 제거해요.',
          'prefers-reduced-motion일 때 이동, 확대 같은 큰 움직임을 페이드로 바꾸는 대체 모션으로 써요.'
        ],
        vs: { topic: 'transitions', id: 'fade-through', name: '페이드 스루', text: '페이드 스루는 이전 화면이 먼저 사라진 뒤 새 화면이 나타나 두 화면이 겹치지 않아요. 페이드는 단순히 투명도만 바꿔요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2000,
          phases: [['등장', 480, 1200], ['유지', 1200, 2800], ['퇴장', 2800, 3440]],
          alt: '점선으로 표시한 자리에서 ‘우유 2L를 담았어요’ 카드가 제자리에서 움직이지 않고 흐릿하다가 선명해지고 다시 흐려지며, 아래 막대가 투명도를 보여 주는 시연',
          html: K => `<i class="gh"></i><div class="cd"><span class="ico">${K.icon('checkCircle')}</span><b>우유 2L를 담았어요</b></div><div class="mt"><span class="ml">투명도</span><i class="mb"><i class="mf"></i></i></div>`
        }
      },
      {
        id: 'slide', ko: '슬라이드', en: 'Slide', aka: ['밀어 넣기', '이동'],
        when: '계층 이동(오른쪽에서 들어오는 상세), 시트나 드로어, 목록 항목 삭제',
        avoid: '방향 의미가 없는 곳. 방향은 정보예요.',
        notes: [
          'transform: translateX/Y를 써요. 등장은 이즈 아웃 250~350ms.',
          '앞으로 갈 때는 새 화면이 오른쪽에서 들어오고, 뒤로 갈 때는 현재 화면이 오른쪽으로 나가요.',
          '이동 거리가 짧으면 페이드와 합쳐요. 읽는 방향이 반대인 언어에서는 방향을 뒤집어요.'
        ],
        vs: { topic: 'transitions', id: 'push', name: '푸시', text: '푸시는 전체 화면 단위의 이동이고, 슬라이드는 요소 하나가 한 방향으로 들어오고 나가는 이동이에요.' },
        demo: {
          frame: 'bare', cycle: 4800, still: 1900,
          phases: [['들어옴', 480, 1250], ['유지', 1250, 2690], ['나감', 2690, 3460]],
          alt: '카드가 화면 오른쪽 밖에서 점선 자리로 미끄러져 들어와 머물다가 다시 오른쪽으로 나가는 시연. 들어올 때는 앞으로, 나갈 때는 뒤로라는 설명이 번갈아 나타난다',
          html: K => `<i class="gh"></i><div class="cd"><b>달걀 10구</b><i class="ln l1"></i><i class="ln l2"></i></div>` +
            `<div class="dl d1">${K.icon('arrowL')}<span>앞으로: 오른쪽에서 들어와요</span></div><div class="dl d2"><span>뒤로: 오른쪽으로 나가요</span>${K.icon('arrowR')}</div>`
        }
      },
      {
        id: 'zoom', ko: '확대 전환', en: 'Zoom transition', aka: ['줌 인', 'zoom in'],
        when: '썸네일에서 상세로, 이미지 확대 보기',
        avoid: '큰 배율로 확대할 때(scale을 0에서 시작하지 말고 0.9~0.95에서 시작해요)',
        notes: [
          'transform: scale을 쓰고 0에서 시작하지 말고 0.9~0.95에서 시작해 페이드와 함께 보여요.',
          '250~350ms. 이 시연은 보이도록 느리게 보여 줘요.',
          '화면 단위의 전환은 화면 전환 주제의 줌에 있어요. 닫을 때는 반대로 줄어들어요.'
        ],
        vs: { id: 'shared-element', text: '공유 요소 전환은 두 화면에 있는 같은 요소가 이어서 이동해요. 확대 전환은 화면 전체가 커지고 줄어드는 움직임이에요.' },
        demo: {
          frame: 'bare', cycle: 5000, still: 2000,
          phases: [['확대', 600, 1200], ['유지', 1200, 3100], ['축소', 3100, 3700]],
          alt: '사진 네 장이 놓인 화면에서 첫 번째 사진을 누르면 화면이 조금 커지며 흐려지고 상세 화면이 0.92배에서 1배로 커지며 나타난 뒤, 닫기를 누르면 반대로 줄어드는 시연',
          html: K => `<div class="pg pa">${['달걀', '두부', '대파', '사과'].map((n, i) => `<div class="ti t${i + 1}"><b>${n}</b></div>`).join('')}</div>` +
            `<div class="pg pb"><span class="xb">${K.icon('x')}</span><div class="cp"><b>달걀 10구</b><span>1판 · 가족이 담았어요</span></div></div>` +
            K.tap(4.5, 3.45, 'tp1') + K.tap(1.9, 1.9, 'tp2')
        }
      },
      {
        id: 'shared-element', ko: '공유 요소 전환', en: 'Shared element', aka: ['히어로', 'hero transition'],
        when: '목록의 카드를 눌러 상세로 갈 때, 사진을 열 때. 어디서 왔는지 맥락을 유지하고 싶을 때',
        avoid: '두 화면 사이에 대응되는 요소가 없을 때, 목록 항목이 많아 성능이 떨어질 때',
        notes: [
          '웹은 View Transitions API(view-transition-name)로 구현하고, 지원 여부를 확인해 페이드로 대체해요.',
          '뒤로 가기에서도 역방향으로 같은 요소가 돌아가야 해요. 300~400ms.',
          '모바일은 플랫폼의 Hero(Flutter)나 Shared Element Transition(Android)을 써요.'
        ],
        vs: { topic: 'transitions', id: 'card-expand', name: '카드 확장', text: '카드 확장은 카드가 그 자리에서 화면 전체로 커져요. 공유 요소 전환은 핵심 요소(사진) 하나만 이동하며 변해요.' },
        demo: {
          frame: 'bare', cycle: 5000, still: 2400,
          phases: [['이동', 700, 1500], ['유지', 1500, 3100], ['되돌아감', 3300, 3800]],
          alt: '목록에서 첫 번째 줄의 작은 사진을 누르면 그 사진이 같은 모습으로 커지며 상세 화면의 위쪽 큰 사진이 되고, 뒤로 가기를 누르면 같은 사진이 다시 목록의 작은 자리로 돌아가는 시연',
          html: K => `<div class="pg pa">${['달걀 10구', '두부', '대파'].map((n, i) => `<div class="rw r${i + 1}"><i X></i><b>${n}</b></div>`).join('')}</div>` +
            '<i class="hr"></i>' +
            `<span class="bk">${K.icon('chevL')}</span><div class="dt"><b>달걀 10구</b><span>가족 3명이 담았어요</span></div>${K.wf('text', 1, 9.4, 14, 1.8, 'dx')}` +
            K.tap(2.5, 2.7, 'tp1') + K.tap(1.5, 1.5, 'tp2')
        }
      }
    ],
    css: K => `
/* ease-in / ease-out / spring: two balls on two tracks */
${sel(MV, '.tk')}{position:absolute;left:1.5em;right:1.5em;height:.1em;background:var(--a-line)}
${sel(MV, '.ta')}{top:5.4em}${sel(MV, '.tc')}{top:9em}
${sel(MV, '.bl')}{position:absolute;left:1.5em;width:1.6em;height:1.6em;border-radius:50%;animation-name:mnMv}
${sel(MV, '.ba')}{top:4.66em;background:var(--a-brand)}
${sel(MV, '.bc')}{top:8.26em;background:#b9bab5}
${sel(MV, '.lb')}{position:absolute;left:1.5em}
${sel(MV, '.lb b')}{font-size:.66em;font-weight:700;color:var(--a-mut)}
${sel(MV, '.la')}{top:3.3em}${sel(MV, '.lc')}{top:6.9em}
${sel(MV, '.la b')}{color:var(--a-brand)}
${sel(MV, '.cv')}{position:absolute;left:11.4em;top:.4em;width:3.6em;height:3.6em}
${sel(MV, '.cv path')}{fill:none}
${sel(MV, '.cv .ax')}{stroke:#bfc2bd;stroke-width:1.2}
${sel(MV, '.cv .ln')}{stroke:#bdbfba;stroke-width:1.2;stroke-dasharray:2 2}
${sel(MV, '.cv .cu')}{stroke:var(--a-brand);stroke-width:2.2;stroke-linecap:round}
.t-motion-names-ease-in{--d:10.8em}.t-motion-names-ease-out{--d:10.8em}.t-motion-names-spring{--d:9.4em}
.t-motion-names-ease-in .ba{animation-timing-function:cubic-bezier(.4,0,1,1)}
.t-motion-names-ease-out .ba{animation-timing-function:cubic-bezier(0,0,.2,1)}
.t-motion-names-spring .ba{animation-timing-function:cubic-bezier(.34,1.56,.64,1)}
.t-motion-names-ease-in .bc,.t-motion-names-ease-out .bc{animation-timing-function:linear}
.t-motion-names-spring .bc{animation-timing-function:cubic-bezier(0,0,.2,1)}
.t-motion-names-spring .tg{position:absolute;left:11.7em;top:3.9em;height:6.6em;border-left:.1em dashed var(--a-mut)}
@keyframes mnMv{
  0%,10%{transform:translateX(0);opacity:1}
  60%,82%{transform:translateX(var(--d));opacity:1}
  90%{transform:translateX(var(--d));opacity:0}
  91%{transform:translateX(0);opacity:0}
  97%,100%{transform:translateX(0);opacity:1}
}

/* bounce */
.t-motion-names-bounce .fl{position:absolute;left:1em;right:1em;top:9.8em;height:.1em;background:var(--a-line)}
.t-motion-names-bounce .bl{position:absolute;top:1.4em;width:1.6em;height:1.6em;border-radius:50%}
.t-motion-names-bounce .x1{left:3.6em;background:var(--a-brand);animation-name:mnBn}
.t-motion-names-bounce .x2{left:10.8em;background:#b9bab5;animation-name:mnDrop;animation-timing-function:cubic-bezier(.5,0,1,.6)}
.t-motion-names-bounce .lb{position:absolute;top:10.4em;width:8em;text-align:center}
.t-motion-names-bounce .lb b{font-size:.66em;font-weight:700;color:var(--a-mut)}
.t-motion-names-bounce .l1{left:.4em}.t-motion-names-bounce .l1 b{color:var(--a-brand)}
.t-motion-names-bounce .l2{left:7.6em}
@keyframes mnBn{
  0%,8%{transform:translateY(0);opacity:1;animation-timing-function:cubic-bezier(.5,0,1,.6)}
  30%{transform:translateY(6.8em);animation-timing-function:cubic-bezier(0,.4,.5,1)}
  42%{transform:translateY(3.9em);animation-timing-function:cubic-bezier(.5,0,1,.6)}
  52%{transform:translateY(6.8em);animation-timing-function:cubic-bezier(0,.4,.5,1)}
  60%{transform:translateY(5.5em);animation-timing-function:cubic-bezier(.5,0,1,.6)}
  66%{transform:translateY(6.8em);animation-timing-function:cubic-bezier(0,.4,.5,1)}
  70%{transform:translateY(6.4em);animation-timing-function:cubic-bezier(.5,0,1,.6)}
  74%,88%{transform:translateY(6.8em);opacity:1}
  94%{transform:translateY(6.8em);opacity:0}
  95%{transform:translateY(0);opacity:0}
  100%{transform:translateY(0);opacity:1}
}
@keyframes mnDrop{
  0%,8%{transform:translateY(0);opacity:1}
  30%,88%{transform:translateY(6.8em);opacity:1}
  94%{transform:translateY(6.8em);opacity:0}
  95%{transform:translateY(0);opacity:0}
  100%{transform:translateY(0);opacity:1}
}

/* stagger */
.t-motion-names-stagger .hd{position:absolute;top:.8em}
.t-motion-names-stagger .hd b{font-size:.66em;font-weight:700;color:var(--a-mut)}
.t-motion-names-stagger .h1{left:1em}.t-motion-names-stagger .h1 b{color:var(--a-brand)}
.t-motion-names-stagger .h2{left:8.6em}
.t-motion-names-stagger .it{position:absolute;width:6.4em;height:1.9em;display:flex;align-items:center;padding:0 .8em;border-radius:.5em;background:#fff;border:1px solid var(--a-line);opacity:0}
.t-motion-names-stagger .it b{font-size:.72em;font-weight:500}
.t-motion-names-stagger .c1{left:1em;border-left:.25em solid var(--a-brand)}
.t-motion-names-stagger .c2{left:8.6em;border-left:.25em solid #b9bab5}
.t-motion-names-stagger .y1{top:2.6em}.t-motion-names-stagger .y2{top:4.8em}
.t-motion-names-stagger .y3{top:7em}.t-motion-names-stagger .y4{top:9.2em}
.t-motion-names-stagger .s1{animation-name:mnSt1}.t-motion-names-stagger .s2{animation-name:mnSt2}
.t-motion-names-stagger .s3{animation-name:mnSt3}.t-motion-names-stagger .s4{animation-name:mnSt4}
.t-motion-names-stagger .sa{animation-name:mnStAll}
${stKf}
@keyframes mnStAll{0%,10%{opacity:0;transform:translateY(.7em)}18%,88%{opacity:1;transform:none}94%,100%{opacity:0;transform:translateY(.7em)}}

/* fade */
.t-motion-names-fade .gh,.t-motion-names-slide .gh{position:absolute;left:3em;top:2.4em;width:10em;height:4.2em;border-radius:.7em;border:.1em dashed #c8cac5}
.t-motion-names-fade .cd{position:absolute;left:3em;top:2.4em;width:10em;height:4.2em;display:flex;align-items:center;justify-content:center;gap:.5em;border-radius:.7em;background:#fff;box-shadow:0 .3em 1em rgba(20,20,22,.14);animation-name:mnFd}
.t-motion-names-fade .cd b{font-size:.74em}
.t-motion-names-fade .ico{display:grid;color:var(--a-ok)}
.t-motion-names-fade .ico .k-i{width:1.1em;height:1.1em}
.t-motion-names-fade .mt{position:absolute;left:3em;right:3em;top:8.2em;display:flex;align-items:center;gap:.8em}
.t-motion-names-fade .ml{font-size:.62em;font-weight:700;color:var(--a-mut)}
.t-motion-names-fade .mb{position:relative;flex:1;height:.45em;border-radius:1em;background:var(--a-soft);overflow:hidden}
.t-motion-names-fade .mf{position:absolute;inset:0;background:var(--a-brand);transform-origin:left;transform:scaleX(0);animation-name:mnFdBar}
@keyframes mnFd{0%,12%{opacity:0}30%,70%{opacity:1}86%,100%{opacity:0}}
@keyframes mnFdBar{0%,12%{transform:scaleX(0)}30%,70%{transform:scaleX(1)}86%,100%{transform:scaleX(0)}}

/* slide */
.t-motion-names-slide .cd{position:absolute;left:3em;top:2.4em;width:10em;height:4.2em;padding:.9em 1em;border-radius:.7em;background:#fff;box-shadow:0 .3em 1em rgba(20,20,22,.14);animation-name:mnSl}
.t-motion-names-slide .cd b{font-size:.78em}
.t-motion-names-slide .ln{position:absolute;left:1em;height:.35em;border-radius:1em;background:var(--a-soft)}
.t-motion-names-slide .l1{top:2.1em;width:7em}.t-motion-names-slide .l2{top:3em;width:4.5em}
.t-motion-names-slide .dl{position:absolute;left:1em;right:1em;top:8.4em;display:flex;align-items:center;justify-content:center;gap:.4em;color:var(--a-ink);opacity:0}
.t-motion-names-slide .dl span{font-size:.66em;font-weight:700}
.t-motion-names-slide .dl .k-i{width:1em;height:1em}
.t-motion-names-slide .d1{animation-name:mnSlD1}.t-motion-names-slide .d2{animation-name:mnSlD2}
@keyframes mnSl{0%,10%{transform:translateX(13em)}26%,56%{transform:translateX(0)}72%,100%{transform:translateX(13em)}}
@keyframes mnSlD1{0%,8%{opacity:0}14%,34%{opacity:1}40%,100%{opacity:0}}
@keyframes mnSlD2{0%,56%{opacity:0}62%,82%{opacity:1}88%,100%{opacity:0}}

/* zoom */
.t-motion-names-zoom .pg{position:absolute;inset:0;transform-origin:4.5em 3.45em}
.t-motion-names-zoom .pa{background:var(--a-bg);animation-name:mnZmA}
.t-motion-names-zoom .pb{background:#e9cdbd;opacity:0;animation-name:mnZmB}
.t-motion-names-zoom .ti{position:absolute;width:6em;height:4.5em;border-radius:.5em;background:#e9cdbd;display:flex;align-items:flex-end;padding:.5em .7em}
.t-motion-names-zoom .ti b{font-size:.68em}
.t-motion-names-zoom .t1{left:1.5em;top:1.2em}.t-motion-names-zoom .t2{left:8.5em;top:1.2em}
.t-motion-names-zoom .t3{left:1.5em;top:6.3em}.t-motion-names-zoom .t4{left:8.5em;top:6.3em}
.t-motion-names-zoom .xb{position:absolute;left:1em;top:1em;width:1.8em;height:1.8em;display:grid;place-items:center}
.t-motion-names-zoom .xb .k-i{width:1.1em;height:1.1em}
.t-motion-names-zoom .cp{position:absolute;left:1.2em;bottom:1.2em;display:flex;flex-direction:column;gap:.2em}
.t-motion-names-zoom .cp b{font-size:1.1em}
.t-motion-names-zoom .cp span{font-size:.66em;color:#5b4a40}
.t-motion-names-zoom .tp1{animation-name:mnZmTap1}
.t-motion-names-zoom .tp2{animation-name:mnZmTap2}
@keyframes mnZmA{0%,12%{transform:scale(1);opacity:1}24%,62%{transform:scale(1.12);opacity:0}74%,100%{transform:scale(1);opacity:1}}
@keyframes mnZmB{0%,12%{transform:scale(.92);opacity:0}24%,62%{transform:scale(1);opacity:1}74%,100%{transform:scale(.92);opacity:0}}
${K.kf.tap('mnZmTap1', 8)}
${K.kf.tap('mnZmTap2', 56)}

/* shared element */
.t-motion-names-shared-element .pg{position:absolute;inset:0}
.t-motion-names-shared-element .pa{animation-name:mnShA}
.t-motion-names-shared-element .rw{position:absolute;left:1em;right:1em;height:3em;display:flex;align-items:center;gap:1em}
.t-motion-names-shared-element .rw b{font-size:.8em}
.t-motion-names-shared-element .r1{top:1.2em}.t-motion-names-shared-element .r2{top:4.6em}.t-motion-names-shared-element .r3{top:8em}
.t-motion-names-shared-element .th{flex:none;width:3em;height:3em;border-radius:.15em;background:#e9cdbd}
.t-motion-names-shared-element .th.ghost{background:transparent}
.t-motion-names-shared-element .hr{position:absolute;z-index:4;left:0;top:0;width:16em;height:5.4em;background:#e9cdbd;transform-origin:0 0;animation-name:mnShH}
.t-motion-names-shared-element .bk{position:absolute;z-index:5;left:.6em;top:.6em;width:1.8em;height:1.8em;display:grid;place-items:center;opacity:0;animation-name:mnShD}
.t-motion-names-shared-element .bk .k-i{width:1.1em;height:1.1em}
.t-motion-names-shared-element .dt{position:absolute;left:1em;top:6.4em;opacity:0;animation-name:mnShD}
.t-motion-names-shared-element .dt b{display:block;font-size:1.1em}
.t-motion-names-shared-element .dt span{display:block;margin-top:.3em;font-size:.66em;color:var(--a-mut)}
.t-motion-names-shared-element .dx{opacity:0;animation-name:mnShD}
.t-motion-names-shared-element .tp1{animation-name:mnShTap1}
.t-motion-names-shared-element .tp2{z-index:31;animation-name:mnShTap2}
@keyframes mnShA{0%,14%{opacity:1}24%,64%{opacity:0}74%,100%{opacity:1}}
@keyframes mnShH{0%,12%{transform:translate(1em,1.2em) scale(.1875,.5556)}30%,62%{transform:none}76%,100%{transform:translate(1em,1.2em) scale(.1875,.5556)}}
@keyframes mnShD{0%,26%{opacity:0}34%,56%{opacity:1}62%,100%{opacity:0}}
${K.kf.tap('mnShTap1', 8)}
${K.kf.tap('mnShTap2', 54)}
`
  });
})();
