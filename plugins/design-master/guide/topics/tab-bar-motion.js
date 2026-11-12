/* Topic: 탭 바 전환 모션 (tab-bar-motion). Reference: plugins/design-master/references/navigation.md (C. 탭 바 전환 모션 6종)
   Every selector starts with .t-tab-bar-motion-<element>. All six demos share one timeline:
   tap tab 2 at 10%, tab 3 at 40%, tab 1 at 70%; each move runs 11-20%, 41-50%, 71-80% of the cycle. */
(function () {
  const IDS = ['sliding-pill', 'liquid-bulge', 'floating-notch', 'icon-fill', 'expanding-label', 'bubble-float'];
  const all = rest => IDS.map(i => `.t-tab-bar-motion-${i} ${rest}`).join(',');
  const TABS = [['list', '목록'], ['users', '가족'], ['sliders', '설정']];
  const TW = 14 / 3; // one tab width in em (bar is 14em wide)
  const TX = [3.333, 8, 12.667];

  /* state keyframes for tab k: `on` while the tab is active, `off` otherwise, switching when a move starts */
  const S = [11, 41, 71];
  const kfState = (name, k, on, off, L = 6) => {
    const en = S[(k + 2) % 3], ex = S[k];
    if (k === 0) return `@keyframes ${name}{0%,${ex}%{${on}}${ex + L}%,${en}%{${off}}${en + L}%,100%{${on}}}`;
    return `@keyframes ${name}{0%,${en}%{${off}}${en + L}%,${ex}%{${on}}${ex + L}%,100%{${off}}}`;
  };
  const stateSet = (prefix, on, off, L) => [0, 1, 2].map(k => kfState(`${prefix}${k}`, k, on, off, L)).join('\n');
  const bindSet = (cls, prefix) => [0, 1, 2].map(k => `.t-tab-bar-motion-${cls} .tb${k}{animation-name:${prefix}${k}}`).join('\n');

  const tabsHtml = K => TABS.map(([ic, lb], k) => `<span class="tb tb${k}"><span class="tic">${K.icon(ic)}</span><em>${lb}</em></span>`).join('');
  const taps = K => K.tap(TX[1], 5.9, 'tp1') + K.tap(TX[2], 5.9, 'tp2') + K.tap(TX[0], 5.9, 'tp3');

  const PH = [['이동', 660, 1200], ['유지', 1200, 2460], ['이동', 2460, 3000], ['유지', 3000, 4260], ['이동', 4260, 4800], ['유지', 4800, 6000]];
  const base = { frame: 'bare', cycle: 6000, still: 1800, phases: PH };

  const BIND = id => ({ id });

  UIGuide.registerTopic({
    id: 'tab-bar-motion',
    intro: '탭을 눌렀을 때 활성 표시가 어떻게 옮겨 가는지를 정하는 모션이에요. 세 탭을 차례로 눌러서 표시가 어떻게 움직이는지 비교해 보세요.',
    elements: [
      {
        id: 'sliding-pill', ko: '미끄러지는 알약', en: 'Sliding pill', aka: ['알약 슬라이드', 'pill slide'],
        when: '알약 강조 막대의 기본 모션. 활성 알약이 새 위치로 미끄러져요.',
        avoid: '탭마다 배경을 따로 껐다 켜서 알약이 이어지지 않고 깜빡여 보일 때(알약 하나를 움직여요)',
        notes: [
          '알약 하나를 transform: translateX로 움직여요. 탭마다 배경을 따로 껐다 켜지 않아요.',
          '300ms 안팎. 알약 양 끝이 뭉개지면 알약 배경만 절대 위치 요소로 두고 폭 변화를 쓰는 예외를 허용해요.',
          'prefers-reduced-motion이면 위치만 즉시 바꾸고 색 변화만 남겨요. 탭 이동은 모션이 끝나기를 기다리지 않아요.'
        ],
        vs: { topic: 'bottom-nav-styles', id: 'pill', name: '알약 강조', text: '알약 강조는 막대의 모양이고, 미끄러지는 알약은 그 알약이 탭 사이를 옮겨 가는 모션이에요.' },
        demo: Object.assign({}, base, {
          alt: '하단 탭 막대에서 가족 탭, 설정 탭, 목록 탭을 차례로 누르면 알약 배경이 하나로 늘어났다가 새 탭 아래에 자리 잡으며 미끄러지는 시연',
          html: K => `<div class="bar"><i class="pl"></i>${tabsHtml(K)}</div>` + taps(K)
        })
      },
      {
        id: 'liquid-bulge', ko: '액체 부풂', en: 'Liquid bulge', aka: ['액체 부풀기', 'liquid indicator'],
        when: '개성 있는 소비자 앱, 표시 막대 탭 스타일',
        avoid: '저사양 기기에서 프레임이 끊길 때(단순 이동으로 대체해요)',
        notes: [
          'SVG 필터나 path 보간은 성능 부담이 커요. 이 시연은 막대 하나의 transform만 늘렸다 줄여요.',
          '모바일 저사양에서 프레임이 끊기면 단순 이동으로 대체해요.',
          '400ms 이내. prefers-reduced-motion이면 위치만 즉시 바꿔요.'
        ],
        vs: { id: 'sliding-pill', text: '미끄러지는 알약은 배경이 이동하고, 액체 부풂은 탭 아래 막대가 부풀며 이동해요.' },
        demo: Object.assign({}, base, {
          alt: '하단 탭 막대 아래의 작은 막대가 탭을 누를 때마다 길고 두껍게 부풀어 늘어났다가 새 탭 아래에서 다시 작아지는 시연',
          html: K => `<div class="bar"><i class="bl"></i>${tabsHtml(K)}</div>` + taps(K)
        })
      },
      {
        id: 'floating-notch', ko: '떠다니는 홈', en: 'Floating notch', aka: ['곡선 홈', 'curved notch'],
        when: '곡선 배경 막대와 함께. 홈을 따라 공이 활성 탭으로 이동해요.',
        avoid: '곡선 홈과 공의 위치가 어긋날 수 있는 가변 탭 폭(홈과 공을 같은 변수로 움직여요)',
        notes: [
          '홈의 위치와 공의 위치를 같은 변수로 움직여 어긋남을 막아요.',
          '아이콘은 공 안에서 약간 올라가요. 300~400ms.',
          'prefers-reduced-motion이면 위치만 즉시 바꾸고 색 변화만 남겨요.'
        ],
        vs: { topic: 'bottom-nav-styles', id: 'curved', name: '곡선 배경', text: '곡선 배경은 막대의 모양이고, 떠다니는 홈은 그 홈을 따라 공이 이동하는 모션이에요.' },
        demo: Object.assign({}, base, {
          alt: '어두운 탭 막대의 위쪽 곡선 홈에 담긴 주황색 공이 탭을 누를 때마다 살짝 떠올랐다가 새 탭 위로 이동하며 안의 아이콘이 바뀌는 시연',
          html: K => `<div class="bar"><i class="nt"></i>${TABS.map(([ic, lb], k) => `<span class="tb tb${k}"><span class="tic">${K.icon(ic)}</span></span>`).join('')}` +
            `<span class="ba">${TABS.map(([ic], k) => `<span class="bi bi${k}">${K.icon(ic)}</span>`).join('')}</span></div>` + taps(K)
        })
      },
      {
        id: 'icon-fill', ko: '아이콘 채움', en: 'Icon fill', aka: ['선 아이콘 채움', 'filled icon'],
        when: '선 아이콘 막대에 가장 가볍고 안전한 모션',
        avoid: '채움 아이콘을 따로 만들 수 없는 아이콘 세트(선 굵기나 색만 바꿔요)',
        notes: [
          '선 아이콘과 채움 아이콘 두 장을 겹쳐 clip이나 opacity로 전환해요.',
          '150~250ms. 점은 색 외에 위치로도 구분되므로 접근성 이점이 있어요.',
          'prefers-reduced-motion이면 위치만 즉시 바꾸고 색 변화만 남겨요.'
        ],
        vs: { topic: 'bottom-nav-styles', id: 'outline', name: '외곽선 아이콘', text: '외곽선 아이콘은 막대의 모양이고, 아이콘 채움은 활성 아이콘이 채워지는 가장 가벼운 모션이에요.' },
        demo: Object.assign({}, base, {
          alt: '선으로 그린 탭 아이콘을 누르면 중심에서부터 색이 채워지고 아이콘 아래에 작은 점이 생기며, 다른 탭을 누르면 이전 아이콘은 다시 선으로 돌아가는 시연',
          html: K => {
            const svg = (inner, cls) => `<svg class="k-i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${inner}</svg>`;
            const G = [
              '<rect class="s" x="5" y="3.5" width="14" height="17" rx="2.6"/><path d="M9 9h6M9 13h6"/>',
              '<path class="s" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
              '<circle class="s" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/>'
            ];
            return `<div class="bar">${G.map((g, k) => `<span class="tb tb${k}"><span class="tic">${svg(g)}${svg(g, 'fl')}</span><i class="dt"></i></span>`).join('')}</div>` + taps(K);
          }
        })
      },
      {
        id: 'expanding-label', ko: '라벨 펼침', en: 'Expanding label', aka: ['라벨 확장', 'label expand'],
        when: '공간이 좁은데 활성 항목의 이름을 보여 주고 싶을 때',
        avoid: '라벨이 길거나 번역으로 길어질 때. 활성 탭 폭이 다른 탭 폭을 흔들어요.',
        notes: [
          '활성 탭 폭의 최대값을 정해 레이아웃이 흔들리지 않게 해요.',
          '비활성 탭의 이름은 aria-label로 항상 제공해요.',
          '250~350ms. prefers-reduced-motion이면 위치만 즉시 바꾸고 색 변화만 남겨요.'
        ],
        vs: { id: 'sliding-pill', text: '미끄러지는 알약은 탭 폭이 모두 같고, 라벨 펼침은 활성 탭만 커지며 라벨이 나타나고 다른 탭은 아이콘만 남아요.' },
        demo: Object.assign({}, base, {
          alt: '탭을 누르면 눌린 탭만 알약으로 커지며 이름이 나타나고, 나머지 탭은 아이콘만 남은 채 옆으로 밀려나는 시연',
          html: K => `<div class="bar"><div class="in"><i class="pl"></i>${TABS.map(([ic, lb], k) => `<span class="tb tb${k}"><span class="tic">${K.icon(ic)}</span><span class="lb"><b>${lb}</b></span></span>`).join('')}</div></div>` +
            K.tap(9.6, 5.9, 'tp1') + K.tap(13.0, 5.9, 'tp2') + K.tap(3.0, 5.9, 'tp3')
        })
      },
      {
        id: 'bubble-float', ko: '거품 떠오름', en: 'Bubble float', aka: ['거품', 'bubbles'],
        when: '장난스러운 브랜드, 게임이나 어린이 앱',
        avoid: '업무·금융 앱, 반복 사용이 잦은 곳(탭을 누를 때마다 반복되어 피로해요)',
        notes: [
          '입자는 5개 이하로 600ms 안에 끝내요.',
          'prefers-reduced-motion이면 입자를 생략하고 아이콘 색만 바꿔요.',
          '터치 반응을 막지 않아요. 입자는 pointer-events: none으로 둬요.'
        ],
        vs: { id: 'icon-fill', text: '아이콘 채움은 아이콘이 채워지기만 하는 조용한 모션이고, 거품 떠오름은 아이콘이 떠오르며 입자가 올라가는 눈에 띄는 모션이에요.' },
        demo: Object.assign({}, base, {
          alt: '탭을 누르면 눌린 탭의 아이콘이 위로 떠오르고 작은 거품 다섯 개가 올라가다 사라지며, 다른 탭을 누르면 이전 아이콘은 제자리로 내려오는 시연',
          html: K => {
            const B = [[-1.1, -2.4, .5], [-.5, -3.1, .38], [0, -2.7, .46], [.6, -3.3, .36], [1.1, -2.5, .42]];
            return `<div class="bar">${TABS.map(([ic, lb], k) => `<span class="tb tb${k}"><span class="bs">${B.map(([dx, dy, s]) => `<i class="bb bb${k}" style="--dx:${dx}em;--dy:${dy}em;--s:${s}em"></i>`).join('')}</span><span class="tic">${K.icon(ic)}</span><em>${lb}</em></span>`).join('')}</div>` + taps(K);
          }
        })
      }
    ],
    css: K => `
/* shared bar */
${all('.bar')}{position:absolute;left:1em;right:1em;top:4.2em;height:3.4em;display:grid;grid-template-columns:repeat(3,1fr);background:#fff;border:1px solid var(--a-line);border-radius:.9em;box-shadow:0 .3em 1em rgba(20,20,22,.07)}
${all('.tb')}{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2em;color:var(--a-mut)}
${all('.tb em')}{font-style:normal;font-size:.55em;font-weight:700}
${all('.tic')}{position:relative;display:block;width:1.2em;height:1.2em}
${all('.tic .k-i')}{display:block;width:100%;height:100%}
${all('.tp1')}{animation-name:tmTap1}
${all('.tp2')}{animation-name:tmTap2}
${all('.tp3')}{animation-name:tmTap3}
${K.kf.tap('tmTap1', 10)}
${K.kf.tap('tmTap2', 40)}
${K.kf.tap('tmTap3', 70)}

/* sliding pill */
.t-tab-bar-motion-sliding-pill .pl{position:absolute;z-index:1;left:.4em;top:.5em;width:3.87em;height:2.4em;border-radius:1.2em;background:rgba(194,71,25,.15);animation-name:tmPill}
${bindSet('sliding-pill', 'tmSpT')}
${stateSet('tmSpT', 'color:var(--a-brand)', 'color:var(--a-mut)')}
@keyframes tmPill{
  0%,11%{transform:translateX(0);width:3.87em}
  15.5%{transform:translateX(0);width:8.53em}
  20%,41%{transform:translateX(${TW.toFixed(3)}em);width:3.87em}
  45.5%{transform:translateX(${TW.toFixed(3)}em);width:8.53em}
  50%,71%{transform:translateX(${(TW * 2).toFixed(3)}em);width:3.87em}
  75.5%{transform:translateX(1.2em);width:8.6em}
  80%,100%{transform:translateX(0);width:3.87em}
}

/* liquid bulge */
.t-tab-bar-motion-liquid-bulge .bl{position:absolute;z-index:1;left:1.333em;bottom:.2em;width:2em;height:.28em;border-radius:1em;background:var(--a-brand);animation-name:tmLb}
${bindSet('liquid-bulge', 'tmLbT')}
${stateSet('tmLbT', 'color:var(--a-ink)', 'color:var(--a-mut)')}
@keyframes tmLb{
  0%,11%{transform:translateX(0) scale(1,1)}
  15.5%{transform:translateX(1.5em) scale(2.8,1.9)}
  20%,41%{transform:translateX(${TW.toFixed(3)}em) scale(1,1)}
  45.5%{transform:translateX(${(TW + 1.5).toFixed(3)}em) scale(2.8,1.9)}
  50%,71%{transform:translateX(${(TW * 2).toFixed(3)}em) scale(1,1)}
  75.5%{transform:translateX(${TW.toFixed(3)}em) scale(4.2,2)}
  80%,100%{transform:translateX(0) scale(1,1)}
}

/* floating notch */
.t-tab-bar-motion-floating-notch .bar{background:var(--a-dark);border-color:var(--a-dark)}
.t-tab-bar-motion-floating-notch .tb{color:#c9cacc}
.t-tab-bar-motion-floating-notch .nt{position:absolute;z-index:3;left:.5em;top:-1.6em;width:3.6em;height:3.6em;border-radius:50%;background:var(--a-bg);animation-name:tmFnN}
.t-tab-bar-motion-floating-notch .ba{position:absolute;z-index:4;left:1.13em;top:-1.1em;width:2.4em;height:2.4em;border-radius:50%;background:var(--a-brand);color:#fff;box-shadow:0 .3em .7em rgba(194,71,25,.35);animation-name:tmFnB}
.t-tab-bar-motion-floating-notch .bi{position:absolute;inset:0;display:grid;place-items:center;opacity:0}
.t-tab-bar-motion-floating-notch .bi .k-i{width:1.1em;height:1.1em}
${bindSet('floating-notch', 'tmFnI')}
${stateSet('tmFnI', 'opacity:0', 'opacity:1', 4)}
.t-tab-bar-motion-floating-notch .bi0{animation-name:tmFnC0}.t-tab-bar-motion-floating-notch .bi1{animation-name:tmFnC1}.t-tab-bar-motion-floating-notch .bi2{animation-name:tmFnC2}
${stateSet('tmFnC', 'opacity:1;transform:translateY(-.1em)', 'opacity:0;transform:translateY(.4em)', 4)}
@keyframes tmFnN{
  0%,11%{transform:translateX(0)}
  15.5%{transform:translateX(${(TW / 2).toFixed(3)}em)}
  20%,41%{transform:translateX(${TW.toFixed(3)}em)}
  45.5%{transform:translateX(${(TW * 1.5).toFixed(3)}em)}
  50%,71%{transform:translateX(${(TW * 2).toFixed(3)}em)}
  75.5%{transform:translateX(${TW.toFixed(3)}em)}
  80%,100%{transform:translateX(0)}
}
@keyframes tmFnB{
  0%,11%{transform:translate(0,0)}
  15.5%{transform:translate(${(TW / 2).toFixed(3)}em,-.7em)}
  20%,41%{transform:translate(${TW.toFixed(3)}em,0)}
  45.5%{transform:translate(${(TW * 1.5).toFixed(3)}em,-.7em)}
  50%,71%{transform:translate(${(TW * 2).toFixed(3)}em,0)}
  75.5%{transform:translate(${TW.toFixed(3)}em,-.9em)}
  80%,100%{transform:translate(0,0)}
}

/* icon fill */
.t-tab-bar-motion-icon-fill .tic{width:1.5em;height:1.5em}
.t-tab-bar-motion-icon-fill .tic .fl{position:absolute;inset:0;clip-path:circle(0% at 50% 50%)}
.t-tab-bar-motion-icon-fill .fl .s{fill:currentColor}
.t-tab-bar-motion-icon-fill .fl :not(.s){stroke:#fff}
.t-tab-bar-motion-icon-fill .dt{position:absolute;bottom:.28em;left:50%;width:.3em;height:.3em;margin-left:-.15em;border-radius:50%;background:var(--a-brand);transform:scale(0)}
${bindSet('icon-fill', 'tmIfT')}
${stateSet('tmIfT', 'color:var(--a-brand)', 'color:var(--a-mut)')}
.t-tab-bar-motion-icon-fill .tb0 .fl{animation-name:tmIfC0}.t-tab-bar-motion-icon-fill .tb1 .fl{animation-name:tmIfC1}.t-tab-bar-motion-icon-fill .tb2 .fl{animation-name:tmIfC2}
.t-tab-bar-motion-icon-fill .tb0 .dt{animation-name:tmIfD0}.t-tab-bar-motion-icon-fill .tb1 .dt{animation-name:tmIfD1}.t-tab-bar-motion-icon-fill .tb2 .dt{animation-name:tmIfD2}
${stateSet('tmIfC', 'clip-path:circle(75% at 50% 50%)', 'clip-path:circle(0% at 50% 50%)', 5)}
${stateSet('tmIfD', 'transform:scale(1)', 'transform:scale(0)', 4)}

/* expanding label */
.t-tab-bar-motion-expanding-label .bar{display:block}
.t-tab-bar-motion-expanding-label .in{position:absolute;left:.3em;top:0;bottom:0;width:13.4em}
.t-tab-bar-motion-expanding-label .pl{position:absolute;z-index:1;left:0;top:.5em;width:6.6em;height:2.2em;border-radius:1.1em;background:rgba(194,71,25,.15);animation-name:tmElP}
.t-tab-bar-motion-expanding-label .tb{position:absolute;left:0;top:0;height:100%;width:6.6em;flex-direction:row;justify-content:flex-start;gap:.45em;padding-left:1.15em}
.t-tab-bar-motion-expanding-label .lb{display:block}
.t-tab-bar-motion-expanding-label .lb b{font-size:.66em;white-space:nowrap}
${bindSet('expanding-label', 'tmElT')}
${[0, 1, 2].map(k => `.t-tab-bar-motion-expanding-label .tb${k}{animation-name:tmElT${k},tmElX${k}}.t-tab-bar-motion-expanding-label .tb${k} .lb{animation-name:tmElL${k}}`).join('\n')}
${stateSet('tmElT', 'color:var(--a-brand)', 'color:var(--a-mut)')}
${stateSet('tmElL', 'opacity:1;transform:none', 'opacity:0;transform:translateX(-.4em)')}
@keyframes tmElP{0%,11%{transform:translateX(0)}20%,41%{transform:translateX(3.4em)}50%,71%{transform:translateX(6.8em)}80%,100%{transform:translateX(0)}}
@keyframes tmElX0{0%,11%{transform:translateX(0)}20%,41%{transform:translateX(0)}50%,71%{transform:translateX(0)}80%,100%{transform:translateX(0)}}
@keyframes tmElX1{0%,11%{transform:translateX(6.6em)}20%,41%{transform:translateX(3.4em)}50%,71%{transform:translateX(3.4em)}80%,100%{transform:translateX(6.6em)}}
@keyframes tmElX2{0%,11%{transform:translateX(10em)}20%,41%{transform:translateX(10em)}50%,71%{transform:translateX(6.8em)}80%,100%{transform:translateX(10em)}}

/* bubble float */
.t-tab-bar-motion-bubble-float .bar{overflow:visible}
.t-tab-bar-motion-bubble-float .bs{position:absolute;left:50%;top:.9em;width:0;height:0;pointer-events:none}
.t-tab-bar-motion-bubble-float .bb{position:absolute;left:0;top:0;width:var(--s);height:var(--s);margin:calc(var(--s) / -2) 0 0 calc(var(--s) / -2);border-radius:50%;border:.1em solid var(--a-brand);background:rgba(194,71,25,.14);opacity:0}
${[0, 1, 2].map(k => `.t-tab-bar-motion-bubble-float .tb${k}{animation-name:tmBfT${k}}.t-tab-bar-motion-bubble-float .tb${k} .tic{animation-name:tmBfI${k}}.t-tab-bar-motion-bubble-float .bb${k}{animation-name:tmBfB${k}}`).join('\n')}
${stateSet('tmBfT', 'color:var(--a-brand)', 'color:var(--a-mut)', 4)}
${stateSet('tmBfI', 'transform:translateY(-.5em) scale(1.18)', 'transform:none', 6)}
${[[0, 71], [1, 11], [2, 41]].map(([k, s]) => `@keyframes tmBfB${k}{0%,${s}%{opacity:0;transform:translate(0,0) scale(.4)}${s + 2}%{opacity:.95;transform:translate(calc(var(--dx) * .3),calc(var(--dy) * .3)) scale(.8)}${s + 10}%,100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1)}}`).join('\n')}
`
  });
})();
