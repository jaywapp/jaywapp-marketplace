/* Topic: 모바일 스페이싱 (spacing). Reference: plugins/design-master/references/spacing.md
   Every selector starts with .t-spacing-<element>. Keyframes use the sp prefix.
   The phone screen is 16em for a 360px phone, so K.px(n) turns device px into screen em. */
(function () {
  const P = 'spacing';
  const IDS = ['side-margin', 'title-content', 'section-gap', 'repeat-gap', 'button-gap', 'tabbar-padding'];
  const sel = r => IDS.map(i => `.t-${P}-${i} ${r}`).join(',');
  const R = id => `.t-${P}-${id}`;
  const op = (n, wins, base = 0) => {
    const f = [`0%{opacity:${base}}`];
    wins.forEach(([a, b, c, d]) => f.push(`${a}%{opacity:${base}}${b}%{opacity:${1 - base}}${c}%{opacity:${1 - base}}${d}%{opacity:${base}}`));
    f.push(`100%{opacity:${base}}`);
    return `@keyframes ${n}{${f.join('')}}`;
  };
  const tag = (x, y, t, c) => `<b class="tg ${c}" style="left:${x}em;top:${y}em"><span>${t}</span></b>`;
  const f2 = n => +n.toFixed(3);

  UIGuide.registerTopic({
    id: P,
    intro: '간격이 일정하면 화면이 정돈되어 보여요. 값은 6개뿐이고, 같은 종류의 관계에는 항상 같은 값을 써요. 아래 시연의 폰 화면은 폭 360px 기준이에요.',
    elements: [
      {
        id: 'side-margin', ko: '좌우 여백 24px', en: 'Side margin', aka: ['좌우 패딩', '화면 여백', 'horizontal padding', 'gutter'],
        when: '모든 모바일 화면의 콘텐츠와 기기 가장자리 사이. 가독성과 여러 해상도 대응의 표준 수치',
        avoid: '화면마다 다른 값을 쓰는 것 (공통 컨테이너로 만들어요). 폭 360px 이하 좁은 폰은 16~20px로 줄여도 되지만 모든 화면에서 같게 써요.',
        notes: [
          '좌우 24px를 가장 먼저 고정해요.',
          '한 번 정한 값은 공통 컨테이너로 만들어 화면마다 다르게 쓰지 않아요.',
          '넓은 화면에서는 콘텐츠를 max-width 컨테이너(1080~1280px)에 두고 가운데 정렬해요.'
        ],
        vs: { name: '웹 데스크톱 여백', text: '태블릿은 32~40px로 늘리고, 데스크톱은 max-width 컨테이너에 두어 여백이 자동으로 늘어나요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 3200,
          phases: [['8px 좁음', 150, 1900], ['24px 기본값', 2100, 4500]],
          alt: '카드가 화면 가장자리에서 8픽셀 떨어져 답답해 보이는 장면에서, 24픽셀 여백이 치수선과 함께 나타나 정돈된 장면으로 바뀌는 시연',
          html: K => {
            const scene = (px, cls, label) => {
              const m = K.px(px), w = f2(16 - 2 * m);
              return `<div class="ly ${cls}">` + K.app.status() + K.app.bar('우리 집 장보기', []) +
                '<i class="ms" style="left:0;width:' + m + 'em"></i><i class="ms" style="right:0;width:' + m + 'em"></i>' +
                K.wf('title', m, 4.5, 5, .55) +
                [0, 1].map(i => `<div class="cd" style="left:${m}em;width:${w}em;top:${5.6 + i * 4.8}em">` + K.wf('title', .8, .8, 4, .4) + K.wf('text', .8, 1.7, f2(w - 1.6), 1.6) + '</div>').join('') +
                K.dim({ x: 0, y: 7.4, len: m, dir: 'h', label: '', side: 'top' }) + K.dim({ x: f2(16 - m), y: 7.4, len: m, dir: 'h', label: '', side: 'top' }) +
                tag(3, 16.4, label, 'tl') + '</div>';
            };
            return scene(8, 'la', '좌우 8px는 너무 좁아요') + scene(24, 'lb', '좌우 24px가 기본값이에요');
          }
        }
      },
      {
        id: 'title-content', ko: '제목과 콘텐츠 16px', en: 'Title to content', aka: ['제목 간격', '헤드라인 간격', 'heading gap', 'proximity'],
        when: '제목과 그 제목의 내용 사이. 가까이 둘수록 한 묶음으로 읽혀요(근접성)',
        avoid: '제목과 위쪽 섹션 사이 간격이 아래 내용과의 간격보다 작거나 같을 때 (제목이 어느 쪽 것인지 모호해져요)',
        notes: [
          '제목은 아래 내용에 더 가까워야 해요. 위쪽 간격은 섹션 32px, 아래쪽은 16px이에요.',
          '테두리나 면이 없는 묶음은 안쪽 간격을 묶음 사이 간격보다 작게 해요.',
          '글자 크기와 줄 높이는 4px 격자에 맞추면 정렬이 쉬워요(예: 16/24, 14/20).'
        ],
        vs: { id: 'section-gap', text: '섹션 간 32px는 독립된 묶음 사이의 쉼이고, 제목과 콘텐츠 16px는 한 묶음 안의 가까움이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4300,
          phases: [['제목이 떠 있음', 200, 2400], ['제목이 내용에 붙음', 3000, 5400]],
          alt: '제목이 위 카드와 가깝고 아래 내용과 멀어 누구 것인지 모호한 장면에서, 위쪽 32픽셀 아래쪽 16픽셀로 바뀌어 제목이 아래 내용과 한 묶음으로 읽히는 시연',
          html: K => {
            const scene = (a, b, cls, label) => {
              const ea = K.px(a), eb = K.px(b), end0 = 6.6, tt = f2(end0 + ea), tb = f2(tt + 1), ct = f2(tb + eb);
              return `<div class="ly ${cls}">` + K.app.status() + K.app.bar('우리 집 장보기', []) +
                `<div class="cd" style="left:1.067em;right:1.067em;top:4.4em;height:2.2em">` + K.wf('text', .8, .6, 8, .9) + '</div>' +
                `<b class="ttl" style="top:${tt}em">이번 주 추천 품목</b>` +
                `<div class="cd" style="left:1.067em;right:1.067em;top:${ct}em;height:3.6em">` + K.wf('text', .8, .7, 9, 2.2) + '</div>' +
                K.dim({ x: 14.3, y: end0, len: ea, dir: 'v', label: a + 'px', side: 'left' }) + K.dim({ x: 14.3, y: tb, len: eb, dir: 'v', label: b + 'px', side: 'left' }) +
                tag(3.6, 16.6, label, 'tl') + '</div>';
            };
            return scene(16, 32, 'la', '제목이 위쪽 같아 보여요') + scene(32, 16, 'lb', '제목이 아래 내용과 한 묶음이에요');
          }
        }
      },
      {
        id: 'section-gap', ko: '섹션 간 32px', en: 'Section gap', aka: ['섹션 간격', '묶음 사이', 'section spacing'],
        when: '독립된 묶음 사이. 시각적 쉼을 줘서 인지 부하를 줄여요',
        avoid: '같은 묶음 안의 요소 사이 (요소 12px) 에 32px를 쓰는 것',
        notes: [
          '섹션 32px와 요소 12px의 2단계로 위계를 만들어요.',
          '같은 종류의 관계에는 항상 같은 값을 써요.',
          '넓은 화면에서는 48~96px로 늘리고, 랜딩의 큰 섹션은 80~120px도 써요.'
        ],
        vs: { id: 'repeat-gap', text: '탭·카드 사이 12px는 요소 하나하나의 독립성과 리듬이고, 섹션 32px는 묶음과 묶음 사이의 쉼이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4000,
          phases: [['첫 묶음', 200, 1500], ['둘째 묶음', 1500, 2800], ['간격 측정', 3100, 5400]],
          alt: '두 묶음이 차례로 강조된 뒤, 묶음 안 항목 사이는 12픽셀 묶음과 묶음 사이는 32픽셀이라는 치수선이 차례로 나타나는 시연',
          html: K => {
            const g = K.px(12), s = K.px(32), rh = 1.8;
            const t1 = 4.3, r1 = f2(t1 + 1 + K.px(16)), r2 = f2(r1 + rh + g), t2 = f2(r2 + rh + s), r3 = f2(t2 + 1 + K.px(16)), r4 = f2(r3 + rh + g);
            const row = y => `<div class="rw" style="top:${y}em">` + K.wf('text', .8, .55, 6, .7) + '</div>';
            const ttl = (y, t) => `<b class="ttl" style="top:${y}em">${t}</b>`;
            return K.app.status() + K.app.bar('우리 집 장보기', []) +
              ttl(t1, '채소와 과일') + row(r1) + row(r2) + ttl(t2, '유제품') + row(r3) + row(r4) +
              `<i class="ov o1" style="left:.5em;top:${f2(t1 - .3)}em;width:15em;height:${f2(r2 + rh - t1 + .6)}em"></i>` +
              `<i class="ov o2" style="left:.5em;top:${f2(t2 - .3)}em;width:15em;height:${f2(r4 + rh - t2 + .6)}em"></i>` +
              K.dim({ x: 12, y: f2(r1 + rh), len: g, dir: 'v', label: '요소 12px', side: 'right', cls: 'd1' }) +
              K.dim({ x: 12, y: f2(r2 + rh), len: s, dir: 'v', label: '섹션 32px', side: 'right', cls: 'd2' });
          }
        }
      },
      {
        id: 'repeat-gap', ko: '탭·카드 사이 12px', en: 'Repeated items', aka: ['반복 요소 간격', '카드 간격', '칩 간격', 'item gap'],
        when: '같은 모양이 반복되는 탭, 칩, 카드, 목록 항목 사이',
        avoid: '묶음 사이 (섹션 32px) 나 버튼 사이 (버튼도 12px지만 오입력 방지가 목적이에요)',
        notes: [
          '12px는 8px 체계의 중간값(1.5배)이며 4px 단위로 허용돼요.',
          '경계가 없는 카드는 안쪽 패딩보다 사이 간격을 크게 해요. 테두리나 면이 있는 카드는 안쪽 16px에 사이 12px처럼 안쪽이 커도 돼요.',
          '넓은 화면에서는 카드 사이를 16~24px(격자 간격)로 올려요.'
        ],
        vs: { id: 'section-gap', text: '섹션 간 32px는 독립된 묶음 사이의 쉼이에요. 반복 요소는 12px로 리듬을 만들어요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4300,
          phases: [['칩 12px', 200, 2000], ['카드 12px', 2000, 3600], ['측정', 3300, 5400]],
          alt: '가로로 놓인 칩 넷이 차례로 나타나고 세로로 쌓인 카드 셋이 이어 나타난 뒤, 칩 사이와 카드 사이 모두 12픽셀이라는 치수선이 표시되는 시연',
          html: K => {
            const g = K.px(12), m = K.px(24), cw = 3, chipX = i => f2(m + i * (cw + g));
            const cardY = i => f2(6.6 + i * (2.8 + g));
            return K.app.status() + K.app.bar('우리 집 장보기', []) +
              ['전체', '채소', '과일', '유제품'].map((t, i) => `<div class="chip c${i}" style="left:${chipX(i)}em;top:4.4em;width:${cw}em"><b>${t}</b></div>`).join('') +
              [0, 1, 2].map(i => `<div class="cdr r${i}" style="left:${m}em;right:${m}em;top:${cardY(i)}em">` + K.wf('title', .8, .6, 4, .4) + K.wf('text', .8, 1.4, 9, 1) + '</div>').join('') +
              K.dim({ x: f2(chipX(0) + cw), y: 5.55, len: g, dir: 'h', label: '12px', side: 'bottom', cls: 'dA' }) +
              K.dim({ x: 8, y: f2(cardY(0) + 2.8), len: g, dir: 'v', label: '12px', side: 'right', cls: 'dB' }) +
              K.dim({ x: 8, y: f2(cardY(1) + 2.8), len: g, dir: 'v', label: '12px', side: 'right', cls: 'dB' });
          }
        }
      },
      {
        id: 'button-gap', ko: '버튼 간 12px', en: 'Between buttons', aka: ['버튼 간격', '버튼 사이', 'button spacing'],
        when: '버튼이 나란히 또는 세로로 붙는 모든 곳. 터치 오입력을 막는 안전 거리',
        avoid: '버튼 두 개가 붙어 있는 것 (12px 이상 띄워요). 하단 고정 버튼이 홈 인디케이터에 닿는 것 (env(safe-area-inset-bottom)을 더해요)',
        notes: [
          '터치 요소 높이는 44~48px이고, 버튼 안 좌우 패딩은 16~24px이에요.',
          '마우스 환경에서도 같은 12px로 충분해요.',
          '가로로 나란히 둘 때와 세로로 쌓을 때 같은 값을 써요.'
        ],
        vs: { id: 'repeat-gap', text: '탭·카드 사이도 12px지만 목적이 달라요. 반복 요소는 독립성과 리듬이고, 버튼은 오입력 방지예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4300,
          phases: [['4px 오입력', 400, 2400], ['12px 안전', 2900, 5400]],
          alt: '버튼 두 개가 4픽셀로 붙어 있어 손가락이 사이를 눌러 잘못 눌리는 장면에서, 12픽셀로 벌어져 정확히 한 버튼만 눌리는 장면으로 바뀌는 시연',
          html: K => {
            const scene = (px, cls, label) => {
              const m = K.px(24), g = K.px(px), W = f2(16 - 2 * m), w = f2((W - g) / 2), y1 = 9.6, y2 = 13.6, bh = 2.2;
              const btn = (x, y, w2, kind, t) => `<div class="bt ${kind}" style="left:${x}em;top:${y}em;width:${w2}em;height:${bh}em"><b>${t}</b></div>`;
              const cx = f2(m + w + g / 2);
              return `<div class="ly ${cls}">` + K.app.status() + K.app.bar('목록 비우기', []) + K.wf('title', m, 4.6, 6, .55) + K.wf('text', m, 5.9, W, 2) +
                btn(m, y1, w, 'g', '취소') + btn(f2(m + w + g), y1, w, 'p', '비우기') +
                btn(m, y2, W, 'p', '저장') + btn(m, f2(y2 + bh + g), W, 'g', '나중에') +
                K.dim({ x: f2(m + w), y: f2(y1 - .55), len: g, dir: 'h', label: px + 'px', side: 'top' }) +
                K.dim({ x: 8, y: f2(y2 + bh), len: g, dir: 'v', label: px + 'px', side: 'right' }) +
                tag(3.4, 18.6, label, 'tl') + '</div>';
            };
            return scene(4, 'la', '4px: 사이를 잘못 눌러요') + scene(12, 'lb', '12px: 안전 거리예요') + K.tap(8, 10.7, 'tpA') + K.tap(11.8, 10.7, 'tpB');
          }
        }
      },
      {
        id: 'tabbar-padding', ko: '탭 바 패딩 16px', en: 'Tab bar padding', aka: ['탭바 안쪽 여백', '하단 메뉴 패딩', '홈 인디케이터 여백'],
        when: '하단 탭 바의 아이콘과 라벨을 감싸는 위아래 안쪽 여백. 홈 인디케이터와의 간섭을 줄이고 하단 균형을 유지해요',
        avoid: '패딩을 줄여 아이콘이 홈 인디케이터에 닿게 하는 것',
        notes: [
          '탭 안쪽 위아래 패딩은 16px이고, 터치 영역은 최소 48x48px이에요.',
          '하단 안전 영역(env(safe-area-inset-bottom))은 이 패딩과 별도로 더해요.',
          '탭 바 높이는 56~64px에 안전 영역을 추가해요.'
        ],
        vs: { topic: 'bottom-nav-styles', id: 'minimal', name: '미니멀 클린', text: '하단 메뉴 스타일 11종은 모두 이 16px 패딩을 공통으로 써요. 스타일은 모양을, 패딩은 간격을 정해요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2800,
          phases: [['위아래 16px', 600, 2400], ['홈 인디케이터', 2800, 4400]],
          alt: '하단 탭 바의 아이콘과 라벨 위아래에 각각 16픽셀 안쪽 여백이 색 띠와 치수선으로 표시되고, 그 아래 홈 인디케이터 막대가 따로 놓여 있음을 보여 주는 시연',
          html: K => K.app.status() + K.app.bar('우리 집 장보기', []) + K.app.list(0, 5) + K.app.tabs(0) + '<i class="hi"></i>' +
            '<i class="bd bd1"></i><i class="bd bd2"></i>' +
            K.dim({ x: 5.1, y: 17.16, len: K.px(16), dir: 'v', label: '16px', side: 'right', cls: 'dd' }) +
            K.dim({ x: 5.1, y: f2(17.16 + K.px(16) + 1.9), len: K.px(16), dir: 'v', label: '16px', side: 'right', cls: 'dd' }) +
            tag(9.5, 15.5, '홈 인디케이터는 따로', 'tl')
        }
      }
    ],
    css: K => `
/* shared */
${sel('.tg')}{position:absolute;z-index:26;opacity:0;pointer-events:none}
${sel('.tg span')}{display:block;font-size:.55em;font-weight:700;padding:.3em .8em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;line-height:1.3}
${sel('.ly')}{position:absolute;inset:0}
${sel('.cd')}{position:absolute;background:#fff;border:.07em solid var(--a-line);border-radius:.5em}
${sel('.ttl')}{position:absolute;left:1.067em;font-size:.9em;line-height:1.11;white-space:nowrap}
${sel('.ov')}{position:absolute;z-index:15;border:.12em solid var(--a-brand);background:rgba(194,71,25,.1);border-radius:.4em;opacity:0;pointer-events:none}
${sel('.k-sb')}{position:relative;z-index:3;background:var(--a-bg)}

/* side margin */
${R('side-margin')} .k-dim em{display:none}
${R('side-margin')} .ms{position:absolute;top:3.7em;bottom:0;background:rgba(194,71,25,.1)}
${R('side-margin')} .la{animation-name:spSmA}.t-spacing-side-margin .lb{opacity:0;animation-name:spSmB}
${R('side-margin')} .lb .k-dim,${R('side-margin')} .lb .k-dim em{color:#1d7a49}
${op('spSmA', [[40, 46, 90, 96]], 1)}${op('spSmB', [[40, 46, 90, 96]])}
${R('side-margin')} .tg.tl{opacity:1}

/* title content */
${R('title-content')} .la{animation-name:spTcA}.t-spacing-title-content .lb{opacity:0;animation-name:spTcB}
${R('title-content')} .lb .k-dim,${R('title-content')} .lb .k-dim em{color:#1d7a49}
${R('title-content')} .tg.tl{opacity:1}
${op('spTcA', [[40, 46, 90, 96]], 1)}${op('spTcB', [[40, 46, 90, 96]])}

/* section gap */
${R('section-gap')} .rw{position:absolute;left:1.067em;right:1.067em;height:1.8em;background:var(--a-soft);border-radius:.45em}
${R('section-gap')} .o1{animation-name:spSgA}.t-spacing-section-gap .o2{animation-name:spSgB}
${R('section-gap')} .d1{animation-name:spSgD1}.t-spacing-section-gap .d2{animation-name:spSgD2}
${op('spSgA', [[4, 8, 22, 26]])}${op('spSgB', [[26, 30, 44, 48]])}${op('spSgD1', [[52, 56, 90, 95]])}${op('spSgD2', [[64, 68, 90, 95]])}

/* repeat gap */
${R('repeat-gap')} .chip{position:absolute;height:1.4em;border-radius:.7em;background:var(--a-soft);display:grid;place-items:center;opacity:0}
${R('repeat-gap')} .chip b{font-size:.62em;font-weight:700}
${R('repeat-gap')} .chip.c0{background:var(--a-ink);color:#fff}
${R('repeat-gap')} .cdr{position:absolute;height:2.8em;background:#fff;border:.07em solid var(--a-line);border-radius:.5em;opacity:0}
${[0, 1, 2, 3].map(i => `${R('repeat-gap')} .c${i}{animation-name:spRgC${i}}`).join('')}
${[0, 1, 2].map(i => `${R('repeat-gap')} .r${i}{animation-name:spRgR${i}}`).join('')}
${[0, 1, 2, 3].map(i => K.kf.fade('spRgC' + i, [[4 + i * 5, 10 + i * 5, 92, 96]], .5)).join('')}
${[0, 1, 2].map(i => K.kf.fade('spRgR' + i, [[26 + i * 6, 32 + i * 6, 92, 96]], .5)).join('')}
${R('repeat-gap')} .dA{animation-name:spRgDA}.t-spacing-repeat-gap .dB{animation-name:spRgDB}
${op('spRgDA', [[50, 54, 90, 95]])}${op('spRgDB', [[58, 62, 90, 95]])}

/* button gap */
${R('button-gap')} .la{animation-name:spBgA}.t-spacing-button-gap .lb{opacity:0;animation-name:spBgB}
${R('button-gap')} .bt{position:absolute;border-radius:.55em;display:grid;place-items:center}
${R('button-gap')} .bt b{font-size:.68em;font-weight:700}
${R('button-gap')} .bt.p{background:var(--a-brand);color:#fff}
${R('button-gap')} .bt.g{background:var(--a-soft);color:var(--a-ink)}
${R('button-gap')} .lb .k-dim,${R('button-gap')} .lb .k-dim em{color:#1d7a49}
${R('button-gap')} .tg.tl{opacity:1}
${R('button-gap')} .tpA{animation-name:spBgTa;z-index:30}.t-spacing-button-gap .tpB{animation-name:spBgTb;z-index:30}
${op('spBgA', [[44, 50, 90, 96]], 1)}${op('spBgB', [[44, 50, 90, 96]])}
${K.kf.tap('spBgTa', 20)}${K.kf.tap('spBgTb', 64)}

/* tab bar padding */
${R('tabbar-padding')} .k-tb{height:4.17em;padding:.711em 0 1.559em;align-items:stretch;border-top:1px solid var(--a-line)}
${R('tabbar-padding')} .hi{position:absolute;z-index:6;left:50%;bottom:.4em;width:5em;height:.22em;margin-left:-2.5em;border-radius:1em;background:#1d1e20;animation-name:spTpHi}
${R('tabbar-padding')} .bd{position:absolute;z-index:5;left:0;right:0;background:rgba(194,71,25,.18);opacity:0;animation-name:spTpBd}
${R('tabbar-padding')} .bd1{top:17.16em;height:.711em}
${R('tabbar-padding')} .bd2{top:19.771em;height:.711em}
${R('tabbar-padding')} .dd{animation-name:spTpBd}
${R('tabbar-padding')} .tg.tl{animation-name:spTpTg}
${op('spTpBd', [[10, 16, 90, 95]])}${op('spTpTg', [[56, 62, 90, 95]])}
@keyframes spTpHi{0%,52%{transform:none}58%,68%{transform:scaleX(1.18)}76%,100%{transform:none}}
`
  });
})();
