/* Topic: 텍스트 등장 (text-reveal). Reference: plugins/design-master/references/motion.md (C. 텍스트 등장 9종)
   Every selector starts with .t-text-reveal-<element>. Keyframe prefix: tx. */
(function () {
  const IDS = ['typewriter', 'fade-up', 'letter-stagger', 'count-up', 'scramble', 'mask-reveal', 'highlight', 'word-rotate', 'blur-in'];
  const all = rest => IDS.map(i => `.t-text-reveal-${i} ${rest}`).join(',');
  const NB = '&nbsp;';
  const TITLE = ['이', '번', NB, '주', NB, '장', '보', '기'];

  /* typewriter: letter i pops in at 10 + 6i %, the caret follows the last letter */
  const twStart = i => 10 + i * 6;
  const twKf = TITLE.map((_, i) => {
    const s = twStart(i), e = i === TITLE.length - 1 ? 88 : twStart(i + 1);
    return `@keyframes txTwG${i}{0%,${s}%{opacity:0}${s + .1}%,88%{opacity:1}94%,100%{opacity:0}}` +
      `@keyframes txTwC${i}{0%,${s}%{opacity:0}${s + .1}%,${e}%{opacity:1}${e + .1}%,100%{opacity:0}}`;
  }).join('\n');
  const twBind = TITLE.map((_, i) => `.t-text-reveal-typewriter .g${i}{animation-name:txTwG${i}}.t-text-reveal-typewriter .k${i}{animation-name:txTwC${i}}`).join('\n');

  /* letter stagger */
  const lsKf = TITLE.map((_, i) => {
    const s = 8 + i * 3;
    return `@keyframes txLs${i}{0%,${s}%{opacity:0;transform:translateY(.7em)}${s + 14}%,86%{opacity:1;transform:none}94%{opacity:0;transform:none}95%,100%{opacity:0;transform:translateY(.7em)}}`;
  }).join('\n');
  const lsBind = TITLE.map((_, i) => `.t-text-reveal-letter-stagger .c${i}{animation-name:txLs${i}}`).join('\n');

  /* scramble */
  const WORD = 'JANGBOM'.split('');
  const GL = [['#', '7', 'X'], ['@', 'Q', '3'], ['%', 'Z', '8'], ['&', 'K', '1'], ['$', 'W', '5'], ['*', 'V', '9'], ['?', 'M', '2']];
  const scS = i => 24 + i * 5;
  const scKf = WORD.map((_, i) => {
    const s = scS(i);
    return `@keyframes txScW${i}{0%,6%{opacity:0}7%,${s}%{opacity:1}${s + .1}%,100%{opacity:0}}` +
      `@keyframes txScF${i}{0%,${s}%{opacity:0}${s + .1}%,88%{opacity:1}94%,100%{opacity:0}}`;
  }).join('\n');
  const scBind = WORD.map((_, i) => `.t-text-reveal-scramble .w${i} .sg{animation-name:txScW${i}}.t-text-reveal-scramble .w${i} .fin{animation-name:txScF${i}}`).join('\n');

  UIGuide.registerTopic({
    id: 'text-reveal',
    intro: '글이 나타나는 방식이에요. 글을 읽기 전에 사라지거나 읽는 속도를 늦추면 안 되니, 중요한 정보에는 쓰지 않고 같은 화면에서는 한 가지만 써요.',
    elements: [
      {
        id: 'typewriter', ko: '타이핑', en: 'Typewriter', aka: ['타자기', 'typing effect'],
        when: '짧은 히어로 문구, 터미널 느낌, AI 답변 흉내',
        avoid: '긴 문장, 사용자가 읽어야 할 안내(실제 스트리밍 데이터는 로딩 패턴의 스트리밍 텍스트)',
        notes: [
          '글자당 30~60ms, 전체 2~3초 이내로 해요. 이 시연은 보이도록 느리게 보여 줘요.',
          '줄바꿈으로 레이아웃이 흔들리지 않게 최종 텍스트 크기를 미리 확보해요. 커서 깜빡임은 선택이에요.',
          '스크린 리더에는 완성된 텍스트를 처음부터 주고, 효과용 글자에는 aria-hidden="true"를 둬요. prefers-reduced-motion이면 즉시 표시해요.'
        ],
        vs: { id: 'letter-stagger', text: '글자 순차 등장은 글자가 떠오르며 서로 겹쳐 나타나고, 타이핑은 한 글자씩 딱딱 끊겨 입력되고 커서가 따라가요.' },
        demo: {
          frame: 'bare', cycle: 4500, still: 3000,
          phases: [['타이핑', 450, 2340], ['유지', 2340, 3960], ['퇴장', 3960, 4230]],
          alt: '‘이번 주 장보기’ 글자가 커서를 따라 한 글자씩 딱딱 입력되어 완성되고, 잠시 머문 뒤 사라지는 시연',
          html: K => `<div class="stg"><div class="tx" aria-hidden="true">${TITLE.map((c, i) => `<span class="ch"><b class="g${i}">${c}</b><i class="cr k${i}"></i></span>`).join('')}</div></div>`
        }
      },
      {
        id: 'fade-up', ko: '페이드 업', en: 'Fade up', aka: ['떠오르며 등장', 'fade in up'],
        when: '스크롤 시 섹션 제목, 문단의 등장. 가장 무난한 선택',
        avoid: '이미 본 위치로 스크롤을 되돌릴 때마다 반복하는 경우(한 번만 보여 줘요)',
        notes: [
          '400~600ms, ease-out. 이동 거리는 8~24px로 짧게 해요. 이 시연은 보이도록 느리게 보여 줘요.',
          '뷰포트에 들어올 때 한 번만 재생해요(IntersectionObserver). 이미 본 위치로 스크롤을 되돌려도 반복하지 않아요.',
          'prefers-reduced-motion이면 즉시 표시해요.'
        ],
        vs: { id: 'blur-in', text: '블러 인은 흐려졌다가 선명해지고, 페이드 업은 선명한 채로 아래에서 위로 올라오며 나타나요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2200,
          phases: [['등장', 320, 1120], ['유지', 1120, 3440], ['퇴장', 3440, 3760]],
          alt: '제목 ‘이번 주 장보기’가 아래에서 위로 살짝 떠오르며 나타나고, 이어서 ‘가족과 함께 담아요’ 줄이 같은 방식으로 나타났다가 사라지는 시연',
          html: K => '<div class="stg"><div class="tx"><div class="a1">이번 주 장보기</div><div class="a2">가족과 함께 담아요</div></div></div>'
        }
      },
      {
        id: 'letter-stagger', ko: '글자 순차 등장', en: 'Letter stagger', aka: ['글자별 등장', 'split text'],
        when: '큰 제목 한 줄, 브랜드 이름',
        avoid: '본문, 긴 제목. 한글은 자모 결합이 있으니 글자(음절) 단위로 나눠요.',
        notes: [
          '글자 간 지연은 20~50ms, 전체 1초 이내로 해요. 이 시연은 보이도록 느리게 보여 줘요.',
          '글자를 span으로 나눌 때 원문은 .sr-only 텍스트로 한 번 넣고, 나뉜 span들은 aria-hidden="true"로 둬요.',
          'prefers-reduced-motion이면 즉시 표시해요.'
        ],
        vs: { id: 'typewriter', text: '타이핑은 글자가 하나씩 딱딱 끊겨 입력되고, 글자 순차 등장은 글자마다 시간차를 두고 떠오르며 서로 겹쳐요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2200,
          phases: [['등장', 320, 1720], ['유지', 1720, 3440], ['퇴장', 3440, 3760]],
          alt: '‘이번 주 장보기’ 글자가 왼쪽부터 시간차를 두고 하나씩 아래에서 떠오르며 서로 겹치듯 나타나고, 잠시 머문 뒤 사라지는 시연',
          html: K => `<div class="stg"><div class="tx big" aria-hidden="true">${TITLE.map((c, i) => `<b class="c${i}">${c}</b>`).join('')}</div></div>`
        }
      },
      {
        id: 'count-up', ko: '카운트 업', en: 'Count up', aka: ['숫자 올라가기', 'counter'],
        when: '지표 소개, 통계, 점수 결과. 큰 수치를 강조할 때',
        avoid: '정확한 값을 빨리 읽어야 하는 업무 화면, 값이 자주 바뀌는 실시간 지표',
        notes: [
          '1~2초, 끝에서 느려지는 이즈 아웃으로 해요.',
          '숫자 폭이 변해 레이아웃이 흔들리지 않게 font-variant-numeric: tabular-nums를 써요.',
          '최종 값은 .sr-only 텍스트로 제공하고 올라가는 숫자는 aria-hidden="true"로 둬요. 뷰포트 진입 시 한 번만 재생해요.'
        ],
        vs: { id: 'typewriter', text: '타이핑은 글이 입력되고, 카운트 업은 숫자가 0에서 목표값까지 올라가며 보여요.' },
        demo: {
          frame: 'bare', cycle: 4500, still: 2600,
          phases: [['대기', 0, 450], ['증가', 450, 2250], ['유지', 2250, 3960], ['퇴장', 3960, 4320]],
          alt: '‘이번 달 담은 항목’ 아래의 큰 숫자가 0에서 시작해 점점 느려지며 128까지 올라가 머물렀다가 사라지는 시연',
          html: K => '<div class="stg"><div class="cuw"><div class="cap">이번 달 담은 항목</div><div class="num" aria-hidden="true"><span class="cu"></span><small>개</small></div></div></div>'
        }
      },
      {
        id: 'scramble', ko: '스크램블', en: 'Scramble', aka: ['해독', 'decode text'],
        when: '기술적·사이버 느낌의 브랜드, 해독하는 연출',
        avoid: '대부분의 일반 서비스. 읽기 어렵고 한글은 효과가 어색해요.',
        notes: [
          '0.6~1.2초. 이 시연은 보이도록 느리게 보여 줘요.',
          '최종 텍스트로 확정되기 전에는 읽히지 않으니 중요 정보에는 쓰지 않아요.',
          '고정폭 글꼴이면 폭이 흔들리지 않아요. prefers-reduced-motion이면 즉시 표시해요.'
        ],
        vs: { id: 'typewriter', text: '타이핑은 글자가 순서대로 쌓여 가고, 스크램블은 모든 칸이 무작위 글자로 흔들리다가 왼쪽부터 최종 글자로 확정돼요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2800,
          phases: [['섞임', 320, 2160], ['유지', 2160, 3520], ['퇴장', 3520, 3760]],
          alt: '‘JANGBOM’의 모든 칸에서 무작위 문자가 빠르게 바뀌다가 왼쪽부터 하나씩 최종 글자로 정해져 완성되고, 잠시 머문 뒤 사라지는 시연',
          html: K => `<div class="stg"><div class="tx mono" aria-hidden="true">${WORD.map((c, i) => `<span class="cell w${i}"><span class="sg">${GL[i].map(g => `<b>${g}</b>`).join('')}</span><b class="fin">${c}</b></span>`).join('')}</div></div>`
        }
      },
      {
        id: 'mask-reveal', ko: '마스크 리빌', en: 'Mask reveal', aka: ['가려진 글 드러내기', 'line reveal'],
        when: '편집 느낌의 제목, 브랜드 소개',
        avoid: '줄바꿈이 자주 바뀌는 반응형 본문(줄 분할을 너비 변화에 맞춰 다시 계산해야 해요)',
        notes: [
          '줄마다 overflow: hidden인 래퍼를 두고, 안의 텍스트를 translateY(100%)에서 0으로 올려요.',
          '줄 단위로 40~80ms 간격, 600~800ms. 이 시연은 보이도록 느리게 보여 줘요.',
          '줄바꿈이 반응형으로 바뀌므로 줄 분할을 너비 변화에 맞춰 다시 계산해요.'
        ],
        vs: { id: 'fade-up', text: '페이드 업은 글이 투명하게 시작해 올라오고, 마스크 리빌은 가려진 줄 뒤에서 글이 그대로 솟아올라요.' },
        demo: {
          frame: 'bare', cycle: 4500, still: 2600,
          phases: [['드러남', 450, 1440], ['유지', 1440, 3510], ['사라짐', 3510, 4050]],
          alt: '점선으로 표시한 두 줄의 가림막 뒤에서 ‘이번 주’와 ‘장보기 목록’ 글이 차례로 아래에서 솟아올라 드러났다가 위로 사라지는 시연',
          html: K => '<div class="stg"><div class="tx"><span class="ln"><b class="m1">이번 주</b></span><span class="ln"><b class="m2">장보기 목록</b></span></div></div>'
        }
      },
      {
        id: 'highlight', ko: '하이라이트', en: 'Highlight', aka: ['형광펜', 'marker'],
        when: '핵심 단어를 한 번 짚어 줄 때',
        avoid: '한 화면에서 3곳 이상 칠할 때(1~2곳만 써요)',
        notes: [
          '배경 크기를 0%에서 100%로 키워요(background-size). 500~800ms. 이 시연은 보이도록 느리게 보여 줘요.',
          '강조 색과 글자 색의 대비는 4.5:1을 유지하고, 한 화면에서 1~2곳만 써요.',
          '효과가 끝난 상태로도 의미가 보존되게 해요. prefers-reduced-motion이면 즉시 칠해 둬요.'
        ],
        vs: { id: 'mask-reveal', text: '마스크 리빌은 글 자체가 드러나고, 하이라이트는 이미 보이는 글 뒤에 형광펜 같은 배경이 그려져요.' },
        demo: {
          frame: 'bare', cycle: 4500, still: 2400,
          phases: [['칠함', 540, 1980], ['유지', 1980, 3870], ['퇴장', 3870, 4230]],
          alt: '‘오늘은 우유와 달걀은 꼭 사야 해요’ 문장에서 ‘우유’와 ‘달걀’ 뒤에 노란 형광펜이 왼쪽에서 오른쪽으로 차례로 그려지고 잠시 뒤 지워지는 시연',
          html: K => '<div class="stg"><div class="tx sm">오늘은 <span class="hl h1">우유</span>와 <span class="hl h2">달걀</span>은<br>꼭 사야 해요</div></div>'
        }
      },
      {
        id: 'word-rotate', ko: '단어 교체', en: 'Word rotate', aka: ['단어 바꾸기', 'rotating words'],
        when: '제품이 쓰이는 여러 상황을 짧게 보여 줄 때(___를 위한 도구)',
        avoid: '중요한 정보를 단어 하나에 담을 때(놓쳐요), 긴 단어들(폭 변화)',
        notes: [
          '단어당 2~3초 노출, 전환 300ms. 가장 긴 단어로 폭을 고정해요. 5개 이내로 해요.',
          'aria-live를 쓰지 않고 정적 문장 또는 첫 단어만 읽히게 해요.',
          '일시정지 수단을 둬요(호버나 포커스 시 정지). prefers-reduced-motion이면 첫 단어로 고정해요.'
        ],
        vs: { id: 'fade-up', text: '페이드 업은 글이 한 번 나타나고 끝나요. 단어 교체는 문장 속 한 단어가 시간마다 다른 단어로 계속 바뀌어요.' },
        demo: {
          frame: 'bare', cycle: 6000, still: 800,
          phases: [['유지', 0, 1680], ['교체', 1680, 1980], ['유지', 1980, 3660], ['교체', 3660, 3960], ['유지', 3960, 5640], ['교체', 5640, 6000]],
          alt: '‘이번 주 장보기 목록’ 문장에서 가운데 단어만 위로 밀려 올라가며 식단, 간식으로 차례로 바뀌고 다시 장보기로 돌아오는 시연',
          html: K => '<div class="stg"><div class="tx sm" aria-hidden="true">이번 주 <span class="wd"><b class="w0">장보기</b><b class="w1">식단</b><b class="w2">간식</b></span> 목록</div></div>'
        }
      },
      {
        id: 'blur-in', ko: '블러 인', en: 'Blur in', aka: ['흐릿하다 선명하게', 'blur reveal'],
        when: '부드럽고 몽환적인 분위기의 제목, 히어로 문구',
        avoid: '읽기 대상이 되는 글, 큰 영역과 반복 사용(블러는 성능 비용이 커요)',
        notes: [
          'filter: blur(8px → 0)과 opacity를 함께 써요. 500~800ms. 이 시연은 보이도록 느리게 보여 줘요.',
          '블러는 성능 비용이 크므로 큰 영역과 반복 사용을 피해요.',
          '읽기 대상이 되는 글에는 쓰지 않아요. prefers-reduced-motion이면 즉시 표시해요.'
        ],
        vs: { id: 'fade-up', text: '페이드 업은 선명한 글이 위로 올라오고, 블러 인은 제자리에서 흐릿하던 글이 선명해져요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2000,
          phases: [['선명해짐', 320, 1040], ['유지', 1040, 3360], ['퇴장', 3360, 3680]],
          alt: '제자리에서 흐릿하고 투명하던 ‘이번 주 장보기’ 제목이 선명해지고, 이어서 아래 문구도 같은 방식으로 선명해진 뒤 다시 흐려지며 사라지는 시연',
          html: K => '<div class="stg"><div class="tx"><div class="b1">이번 주 장보기</div><div class="b2">가족과 함께 담아요</div></div></div>'
        }
      }
    ],
    css: K => `
/* shared stage */
${all('.stg')}{position:absolute;inset:0;display:grid;place-items:center;text-align:center}
${all('.tx')}{font-size:1.55em;font-weight:700;line-height:1.35;color:var(--a-ink)}
${all('.tx.sm')}{font-size:1.2em;font-weight:500;line-height:1.7}

/* typewriter */
.t-text-reveal-typewriter .ch{position:relative;display:inline-block}
.t-text-reveal-typewriter .ch b{font-weight:700;opacity:0}
.t-text-reveal-typewriter .cr{position:absolute;left:100%;top:.12em;width:.07em;height:1.1em;background:var(--a-brand);opacity:0}
${twBind}
${twKf}

/* fade up */
.t-text-reveal-fade-up .a1{animation-name:txFuA;opacity:0}
.t-text-reveal-fade-up .a2{margin-top:.2em;font-size:.62em;font-weight:500;color:var(--a-mut);opacity:0;animation-name:txFuB}
@keyframes txFuA{0%,8%{opacity:0;transform:translateY(1em)}22%,86%{opacity:1;transform:none}94%{opacity:0;transform:none}95%,100%{opacity:0;transform:translateY(1em)}}
@keyframes txFuB{0%,16%{opacity:0;transform:translateY(1em)}30%,86%{opacity:1;transform:none}94%{opacity:0;transform:none}95%,100%{opacity:0;transform:translateY(1em)}}

/* letter stagger */
.t-text-reveal-letter-stagger .tx.big{font-size:1.9em}
.t-text-reveal-letter-stagger .tx b{display:inline-block;font-weight:900;opacity:0}
${lsBind}
${lsKf}

/* count up */
@property --tx-n{syntax:'<integer>';inherits:false;initial-value:0}
.t-text-reveal-count-up .cuw{animation-name:txCuW}
.t-text-reveal-count-up .cap{font-size:.55em;font-weight:700;color:var(--a-mut)}
.t-text-reveal-count-up .num{display:flex;align-items:baseline;justify-content:center;gap:.15em;margin-top:.1em}
.t-text-reveal-count-up .cu{font-size:2.6em;font-weight:900;font-variant-numeric:tabular-nums;min-width:2.2ch;text-align:right;color:var(--a-brand);counter-reset:txn var(--tx-n);animation-name:txCu}
.t-text-reveal-count-up .cu::after{content:counter(txn)}
.t-text-reveal-count-up small{font-size:.6em;font-weight:700}
@keyframes txCu{0%,10%{--tx-n:0}50%,92%{--tx-n:128}92.1%,100%{--tx-n:0}}
@keyframes txCuW{0%,88%{opacity:1}92%,96%{opacity:0}100%{opacity:1}}

/* scramble */
.t-text-reveal-scramble .tx.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:1.9em;font-weight:700}
.t-text-reveal-scramble .cell{position:relative;display:inline-block;width:.75em;text-align:center}
.t-text-reveal-scramble .cell b{display:block;font-weight:700}
.t-text-reveal-scramble .fin{opacity:0}
.t-text-reveal-scramble .sg{position:absolute;inset:0;color:var(--a-brand);opacity:0}
.t-text-reveal-scramble .sg b{position:absolute;inset:0;opacity:0;animation-duration:calc(var(--cyc) * .04);animation-timing-function:linear}
.t-text-reveal-scramble .sg b:nth-child(1){animation-name:txScG0}
.t-text-reveal-scramble .sg b:nth-child(2){animation-name:txScG1}
.t-text-reveal-scramble .sg b:nth-child(3){animation-name:txScG2}
@keyframes txScG0{0%,32%{opacity:1}33%,100%{opacity:0}}
@keyframes txScG1{0%,33%{opacity:0}34%,65%{opacity:1}66%,100%{opacity:0}}
@keyframes txScG2{0%,66%{opacity:0}67%,100%{opacity:1}}
${scBind}
${scKf}

/* mask reveal */
.t-text-reveal-mask-reveal .tx{font-size:2em;font-weight:900;line-height:1.25}
.t-text-reveal-mask-reveal .ln{display:block;overflow:hidden;padding:.05em 1em;border-bottom:.05em dashed #cfd1cc}
.t-text-reveal-mask-reveal .ln b{display:block;font-weight:900}
.t-text-reveal-mask-reveal .m1{animation-name:txMk1}
.t-text-reveal-mask-reveal .m2{animation-name:txMk2}
@keyframes txMk1{0%,10%{transform:translateY(110%)}26%,78%{transform:translateY(0)}90%{transform:translateY(-110%)}91%,100%{transform:translateY(110%)}}
@keyframes txMk2{0%,18%{transform:translateY(110%)}34%,78%{transform:translateY(0)}90%{transform:translateY(-110%)}91%,100%{transform:translateY(110%)}}

/* highlight */
.t-text-reveal-highlight .tx{isolation:isolate}
.t-text-reveal-highlight .hl{position:relative;z-index:0;padding:0 .15em;font-weight:700}
.t-text-reveal-highlight .hl::before{content:"";position:absolute;z-index:-1;left:0;right:0;top:.2em;bottom:.15em;border-radius:.1em;background:#f6d78a;transform-origin:left;transform:scaleX(0)}
.t-text-reveal-highlight .h1::before{animation-name:txHl1}
.t-text-reveal-highlight .h2::before{animation-name:txHl2}
@keyframes txHl1{0%,12%{transform:scaleX(0)}28%,86%{transform:scaleX(1)}94%,100%{transform:scaleX(0)}}
@keyframes txHl2{0%,30%{transform:scaleX(0)}46%,86%{transform:scaleX(1)}94%,100%{transform:scaleX(0)}}

/* word rotate */
.t-text-reveal-word-rotate .wd{position:relative;display:inline-block;width:3.1em;height:1.5em;vertical-align:bottom;overflow:hidden;text-align:center}
.t-text-reveal-word-rotate .wd b{position:absolute;left:0;right:0;top:0;font-weight:700;color:var(--a-brand);opacity:0}
.t-text-reveal-word-rotate .w0{animation-name:txWr0}.t-text-reveal-word-rotate .w1{animation-name:txWr1}.t-text-reveal-word-rotate .w2{animation-name:txWr2}
@keyframes txWr0{0%,28%{opacity:1;transform:none}33%{opacity:0;transform:translateY(-.6em)}34%,94%{opacity:0;transform:translateY(.6em)}100%{opacity:1;transform:none}}
@keyframes txWr1{0%,28%{opacity:0;transform:translateY(.6em)}33%,61%{opacity:1;transform:none}66%{opacity:0;transform:translateY(-.6em)}67%,100%{opacity:0;transform:translateY(.6em)}}
@keyframes txWr2{0%,61%{opacity:0;transform:translateY(.6em)}66%,94%{opacity:1;transform:none}99%{opacity:0;transform:translateY(-.6em)}100%{opacity:0;transform:translateY(.6em)}}

/* blur in */
.t-text-reveal-blur-in .b1{opacity:0;animation-name:txBl1}
.t-text-reveal-blur-in .b2{margin-top:.2em;font-size:.62em;font-weight:500;color:var(--a-mut);opacity:0;animation-name:txBl2}
@keyframes txBl1{0%,8%{opacity:0;filter:blur(.7em)}26%,84%{opacity:1;filter:blur(0)}92%,100%{opacity:0;filter:blur(.7em)}}
@keyframes txBl2{0%,16%{opacity:0;filter:blur(.7em)}34%,84%{opacity:1;filter:blur(0)}92%,100%{opacity:0;filter:blur(.7em)}}
`
  });
})();
