/* Topic: 화면 배치 (screen-layouts). Reference: plugins/design-master/references/layout.md
   Every selector starts with .t-screen-layouts-<element>. Keyframes use the sl prefix. */
(function () {
  const P = 'screen-layouts';
  const IDS = ['hero', 'bento', 'split', 'card-grid', 'sidebar', 'magazine', 'dashboard', 'z-pattern', 'full-bleed'];
  const sel = r => IDS.map(i => `.t-${P}-${i} ${r}`).join(',');
  const op = (n, wins, base = 0) => {
    const f = [`0%{opacity:${base}}`];
    wins.forEach(([a, b, c, d]) => f.push(`${a}%{opacity:${base}}${b}%{opacity:${1 - base}}${c}%{opacity:${1 - base}}${d}%{opacity:${base}}`));
    f.push(`100%{opacity:${base}}`);
    return `@keyframes ${n}{${f.join('')}}`;
  };
  const pop = (n, a) => `@keyframes ${n}{0%,${a}%{opacity:0;transform:scale(.92)}${a + 6}%,92%{opacity:1;transform:none}97%,100%{opacity:0;transform:scale(.92)}}`;
  const ov = (x, y, w, h, c) => `<i class="ov ${c}" style="left:${x}em;top:${y}em;width:${w}em;height:${h}em"></i>`;
  const tag = (x, y, t, c) => `<b class="tg ${c}" style="left:${x}em;top:${y}em"><span>${t}</span></b>`;
  const mk = (x, y, t, c) => `<b class="mk ${c}" style="left:${x}em;top:${y}em"><span>${t}</span></b>`;

  UIGuide.registerTopic({
    id: P,
    intro: '한 화면 안에서 영역을 어떻게 짜는지 이름 붙인 패턴이에요. 웹 레이아웃이 시선의 길이라면, 화면 배치는 첫 화면의 완성된 모양이에요.',
    elements: [
      {
        id: 'hero', ko: '히어로', en: 'Hero section', aka: ['히어로 섹션', '첫 화면', 'hero'],
        when: '랜딩, 앱 소개, 캠페인 페이지의 맨 위에서 한 문장 제안과 주 행동을 크게 보여 줄 때',
        avoid: '업무용 앱의 내부 화면 (도구 화면에서는 작업 공간이 먼저예요)',
        notes: [
          '제목 한 개, 보조 문장 한두 줄, 주 버튼 하나, 보조 링크 하나까지만 둬요.',
          '첫 화면에서 다음 내용이 살짝 보이게 높이를 100dvh보다 약간 작게 해요.',
          '이미지가 있으면 어두운 오버레이로 글자 대비를 확보해요.'
        ],
        vs: { topic: 'web-layouts', id: 'featured-media', name: '대표 이미지·영상', text: '대표 이미지·영상은 히어로를 이루는 시각 요소예요. 히어로는 문구와 버튼까지 포함한 영역 전체예요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 2900,
          phases: [['차례로 등장', 200, 1700], ['다음 내용 엿보기', 1800, 2700], ['유지', 2700, 4400]],
          alt: '제목, 보조 문장, 주 버튼, 보조 링크와 이미지가 차례로 나타나고, 화면 아래쪽에 다음 섹션의 카드가 살짝 보여 첫 화면이 100dvh보다 약간 작다는 것을 보여 주는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1) +
            K.wf('title', 2, 2.4, 8, 1.1, 'h1') + K.wf('text', 2, 3.9, 6.5, .7, 'h2') + K.wf('btn', 2, 5.1, 3, .9, 'h3') + K.wf('line', 6, 5.5, 2.4, .18, 'h4') +
            K.wf('img', 10.5, 1.8, 4.5, 5.2, 'h5') +
            [0, 1, 2].map(i => K.wf('block', 1 + i * 5, 8.7, 4.3, 2, 'pk')).join('') +
            K.dim({ x: 15.55, y: 1, len: 7.6, dir: 'v', label: '100dvh보다 조금 작게', side: 'left', cls: 'dm' }) +
            ov(0, 8.5, 16, 1.5, 'hv') + tag(5.8, 7.9, '다음 내용이 살짝 보여요', 'hv')
        }
      },
      {
        id: 'bento', ko: '벤토 그리드', en: 'Bento grid', aka: ['벤토', 'bento box', '타일 배치'],
        when: '제품 기능 소개, 대시보드형 요약, 서로 다른 성격의 정보를 한 화면에 모을 때',
        avoid: '타일마다 정보 밀도와 중요도가 비슷할 때, 타일이 3개 이하일 때',
        notes: [
          '타일 간격 하나(12~16px)와 모서리 반경 하나를 써요.',
          'grid-template-areas로 크기를 정하고 모바일에서는 한 열로 풀어 쌓아요.',
          '타일 크기가 곧 중요도이므로 가장 큰 타일에 핵심을 둬요.'
        ],
        vs: { id: 'card-grid', text: '카드 그리드는 크기가 모두 같아요. 벤토는 크기가 달라서 크기 자체가 중요도를 말해요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 3000,
          phases: [['큰 타일 먼저', 200, 1000], ['나머지 채움', 1000, 2300], ['유지', 2300, 4400]],
          alt: '가장 큰 타일이 먼저 나타나고, 크기가 다른 작은 타일들이 빈틈 없이 도시락처럼 채워지며, 큰 타일이 핵심이라는 표시가 뜨는 시연',
          html: K => [[1, 1.4, 6.2, 4.4, 'A'], [7.5, 1.4, 3.7, 2.1, 'B'], [11.5, 1.4, 3.5, 2.1, 'C'], [7.5, 3.8, 3.7, 2, 'D'], [11.5, 3.8, 3.5, 2, 'E'], [1, 6.1, 8.9, 2.6, 'F'], [10.2, 6.1, 4.8, 2.6, 'G']]
            .map(([x, y, w, h, c], i) => `<div class="tl t${i}${i === 0 ? ' big' : ''}" style="left:${x}em;top:${y}em;width:${w}em;height:${h}em">` +
              K.wf('title', .5, .5, Math.min(2.4, w - 1.2), .35) + K.wf('text', .5, 1.2, w - 1.2, Math.min(1.2, h - 1.7)) + '</div>').join('') +
            tag(2.6, 5.05, '가장 큰 타일이 핵심', 'bt') + tag(9.7, 9.0, '간격 하나, 모서리 반경 하나', 'bt')
        }
      },
      {
        id: 'split', ko: '스플릿', en: 'Split screen', aka: ['화면 분할', '반반 레이아웃'],
        when: '로그인 화면, 두 선택지 비교, 랜딩의 첫 화면',
        avoid: '내용이 한쪽으로 쏠릴 때, 모바일 폭 (위아래로 쌓거나 한쪽만 남겨요)',
        notes: [
          '높이는 min-height: 100dvh를 쓰고 모바일 주소창 변화를 고려해요.',
          '양쪽 모두 글자가 올라가면 각각 대비를 따로 확인해요.',
          '이 시연은 두 선택지를 대등하게 보여 주는 쓰임이에요. 웹 레이아웃의 스플릿 스크린과 같은 항목이에요.'
        ],
        vs: { topic: 'web-layouts', id: 'two-column', name: '투 칼럼', text: '투 칼럼은 본문과 보조처럼 주종이 있어요. 스플릿은 두 면이 대등해요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 1500,
          phases: [['왼쪽 선택', 600, 1700], ['오른쪽 선택', 2300, 3600]],
          alt: '화면이 반으로 갈려 왼쪽은 개인용, 오른쪽은 가족용 선택지로 나란히 놓이고, 마우스가 한쪽씩 올라갈 때마다 그쪽 버튼이 강조되는 시연',
          html: K => '<div class="pa"></div><div class="pb"></div>' +
            K.wf('title', 1.2, 2.2, 4.8, .8, 'ta') + K.wf('text', 1.2, 3.5, 5.4, 1.4, 'ta') + K.wf('btn', 1.2, 5.5, 3.2, 1, 'ba') +
            K.wf('title', 9.2, 2.2, 4.8, .8, 'tb') + K.wf('text', 9.2, 3.5, 5.4, 1.4, 'tb') + K.wf('btn', 9.2, 5.5, 3.2, 1, 'bb') +
            '<i class="ha"></i><i class="hb"></i>' + K.cursor(7.6, 8.6, 'cur') + K.tap(2.8, 6, 'tp1') + K.tap(10.8, 6, 'tp2')
        }
      },
      {
        id: 'card-grid', ko: '카드 그리드', en: 'Card grid', aka: ['카드 목록', 'grid of cards', '갤러리'],
        when: '상품 목록, 템플릿 갤러리, 팀원 소개처럼 같은 종류의 항목이 많을 때',
        avoid: '항목마다 설명 길이가 크게 다를 때, 정렬·필터 중심의 업무 데이터 (표)',
        notes: [
          'repeat(auto-fill, minmax(240px, 1fr))처럼 최소 폭을 정해 열 수를 자동으로 바꿔요.',
          '글은 줄 수를 제한(line-clamp)하고 제목과 가격 위치를 모든 카드에서 같게 해요.',
          '로딩 중에는 같은 모양의 스켈레톤을 써요.'
        ],
        vs: { topic: 'web-layouts', id: 'card-block', name: '카드·블록', text: '카드·블록은 정보를 사각형 묶음으로 나눈다는 개념이고, 카드 그리드는 같은 카드를 열 수가 자동으로 바뀌는 격자에 배열하는 배치예요.' },
        demo: {
          frame: 'browser', cycle: 6000, still: 800,
          phases: [['열 4개', 0, 1800], ['열 3개', 2000, 3700], ['열 2개', 3800, 5300]],
          alt: '화면 폭이 줄어드는 동안 같은 크기의 카드가 열 4개, 3개, 2개로 알아서 다시 배열되었다가 처음으로 돌아오는 시연',
          html: K => {
            const layer = (cols, W, n, cls, label) => {
              const w = +((W - .4 * (cols - 1)) / cols).toFixed(3);
              const cards = Array.from({ length: n }, (_, i) => `<div class="cc" style="left:${(1 + (i % cols) * (w + .4)).toFixed(3)}em;top:${2.4 + Math.floor(i / cols) * 3.8}em;width:${w}em">` +
                K.wf('img', .15, .15, +(w - .3).toFixed(2), 1.8) + K.wf('title', .25, 2.15, +(w * .55).toFixed(2), .28) + K.wf('text', .25, 2.7, +(w - .5).toFixed(2), .4) + '</div>').join('');
              return `<div class="ly ${cls}"><i class="fr" style="left:1em;top:2.25em;width:${W}em"></i>` + K.dim({ x: 1, y: 2.05, len: W, dir: 'h', label, side: 'top' }) + cards + '</div>';
            };
            return layer(4, 14, 8, 'g1', '열 4개') + layer(3, 10.5, 6, 'g2', '열 3개') + layer(2, 7, 4, 'g3', '열 2개') +
              '<b class="cs"><span>repeat(auto-fill, minmax(240px, 1fr))</span></b>';
          }
        }
      },
      {
        id: 'sidebar', ko: '사이드바 레이아웃', en: 'Sidebar layout', aka: ['사이드바', '사이드 메뉴', 'side navigation'],
        when: '메뉴가 많은 관리자·설정·문서 화면, 필터가 많은 검색 결과',
        avoid: '모바일 주 화면 (드로어나 하단 탭으로 바꿔요), 메뉴가 4~5개 이하일 때',
        notes: [
          '폭은 보통 240~280px, 접힌 상태는 아이콘만 64~72px이에요.',
          '현재 위치를 배경과 굵기 두 가지로 표시해요.',
          '본문과 사이드바를 각각 독립 스크롤로 둘 때 키보드 포커스가 갇히지 않게 해요.'
        ],
        vs: { topic: 'navigation', id: 'drawer', name: '드로어', text: '드로어는 같은 메뉴가 눌러야 밀려 나오는 형태이고, 사이드바는 항상 펼쳐져 있어요. 보조 열이 내비게이션이 아니면 투 칼럼이에요.' },
        demo: {
          frame: 'browser', cycle: 6000, still: 1000,
          phases: [['클릭', 1000, 1600], ['현재 위치 이동', 1600, 3600], ['처음으로', 4400, 5000]],
          alt: '왼쪽 세로 메뉴에서 알림을 누르면 현재 위치 표시가 배경과 굵은 글씨로 알림 항목에 옮겨 가고 오른쪽 본문이 바뀌었다가, 다시 품목을 눌러 처음으로 돌아오는 시연',
          html: K => {
            const items = ['품목', '가족', '알림', '설정', '도움말'];
            return '<div class="sd"></div>' + K.wf('title', .6, .5, 2.2, .4) +
              '<i class="ah"></i>' +
              items.map((t, i) => `<span class="si" style="top:${1.9 + i * 1.25}em"><b>${t}</b></span>`).join('') +
              `<span class="si bd0" style="top:1.9em"><b>품목</b></span><span class="si bd2" style="top:${1.9 + 2 * 1.25}em"><b>알림</b></span>` +
              '<div class="c1">' + K.wf('title', 4.4, 1.4, 4, .6) + K.wf('text', 4.4, 2.6, 10.8, 1) + K.wf('text', 4.4, 4, 10.8, 1) + K.wf('img', 4.4, 5.5, 10.8, 3.4) + '</div>' +
              '<div class="c3">' + K.wf('title', 4.4, 1.4, 3, .6) + [0, 1, 2].map(i => K.wf('block', 4.4 + i * 3.7, 2.7, 3.4, 5)).join('') + '</div>' +
              K.dim({ x: 0, y: 9.4, len: 3.6, dir: 'h', label: '240~280px', side: 'top', cls: 'dm' }) +
              tag(4.4, 9.1, '현재 위치: 배경과 굵기', 'sn') + K.tap(2, 4.9, 'tp1') + K.tap(2, 2.4, 'tp2') + K.cursor(9, 8, 'cur');
          }
        }
      },
      {
        id: 'magazine', ko: '매거진', en: 'Magazine layout', aka: ['편집형 배치', '매거진 레이아웃'],
        when: '콘텐츠 양이 많고 우선순위가 있는 뉴스, 블로그, 커뮤니티 홈',
        avoid: '콘텐츠가 몇 개 안 되거나 모두 같은 중요도일 때',
        notes: [
          '큰 블록 1개, 중간 2~3개, 작은 것 나머지처럼 크기 단계를 3단계 이하로 둬요.',
          '격자의 열 수를 유지해 정렬선을 맞춰요.',
          '모바일에서는 큰 블록 다음에 작은 블록을 목록으로 쌓아요. 웹 레이아웃의 매거진과 같은 항목이에요.'
        ],
        vs: { topic: 'web-layouts', id: 'masonry', name: '메이슨리', text: '메이슨리는 높이만 다르고 위계가 없어요. 카드·블록은 크기가 모두 같아요.' },
        demo: {
          frame: 'compare', labels: ['넓은 화면', '좁은 화면'], cycle: 5000, still: 4000,
          phases: [['큰 것', 200, 1200], ['중간', 1500, 2500], ['작은 것', 2800, 4200]],
          alt: '넓은 화면에서는 큰 블록과 중간 블록, 작은 블록이 격자에 섞여 있고, 좁은 화면에서는 큰 블록 아래로 작은 블록이 목록처럼 쌓이며 큰 것, 중간, 작은 것 순서로 같은 단계가 강조되는 시연',
          html: K => {
            const wide = K.wf('nav', 0, 0, 16, 1.2) +
              K.wf('img', 1, 2, 9, 6.4) + K.wf('title', 1, 8.6, 6, .5) + K.wf('img', 10.4, 2, 4.6, 3) + K.wf('img', 10.4, 5.4, 4.6, 3) +
              [0, 1, 2].map(i => K.wf('img', 1 + i * 4.9, 9.8, 4.3, 2.4) + K.wf('text', 1 + i * 4.9, 12.5, 4.3, .5)).join('') +
              ov(.8, 1.8, 9.4, 7.5, 'a1') + mk(.8, 1.8, '1', 'a1') + ov(10.2, 1.8, 5, 6.9, 'a2') + mk(10.2, 1.8, '2', 'a2') + ov(.8, 9.6, 14.6, 3.8, 'a3') + mk(.8, 9.6, '3', 'a3');
            const narrow = K.wf('nav', 0, 0, 16, 1.2) +
              K.wf('img', 1, 2, 14, 6.4) + K.wf('title', 1, 8.6, 9, .5) +
              [0, 1, 2].map(i => K.wf('img', 1, 9.8 + i * 2.7, 3.4, 2.2) + K.wf('title', 4.8, 10 + i * 2.7, 8, .35) + K.wf('text', 4.8, 10.7 + i * 2.7, 10, .6)).join('') +
              ov(.8, 1.8, 14.4, 7.4, 'a1') + mk(.8, 1.8, '1', 'a1') + ov(.8, 9.6, 14.4, 8.2, 'a3') + mk(.8, 9.6, '3', 'a3');
            return [wide, narrow];
          }
        }
      },
      {
        id: 'dashboard', ko: '대시보드', en: 'Dashboard', aka: ['현황판', '지표 화면', 'KPI'],
        when: '운영 현황, 분석, 관리 도구의 첫 화면에서 현재 상태를 한눈에 볼 때',
        avoid: '사용자가 판단할 지표가 정해지지 않았을 때, 모바일에서 차트를 그대로 축소할 때',
        notes: [
          '맨 위에 가장 중요한 수치 3~4개, 그 아래 추이, 맨 아래 상세 표 순서로 둬요.',
          '수치마다 단위, 기간, 비교 기준을 쓰고, 색만으로 좋고 나쁨을 전하지 않고 화살표나 글자를 함께 써요.',
          '빈 데이터, 로딩, 오류 상태를 위젯마다 둬요.'
        ],
        vs: { id: 'bento', text: '벤토는 마케팅용 구성이고 실시간 수치가 없어요. 대시보드는 지금 상태를 판단하는 수치와 추이가 중심이에요.' },
        demo: {
          frame: 'browser', cycle: 6000, still: 4800,
          phases: [['핵심 수치', 200, 1600], ['추이', 2000, 3700], ['상세 표', 4000, 5400]],
          alt: '맨 위 핵심 수치 세 개, 가운데 추이 그래프가 그려지는 영역, 맨 아래 상세 표가 위에서 아래 순서로 차례로 강조되는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1) +
            [['담은 항목', '24', '12%', 1], ['남은 항목', '9', '3%', 0], ['이번 주 지출', '8.4만', '5%', 1]].map(([l, n, t, up], i) =>
              `<div class="kp" style="left:${1 + i * 4.85}em"><i>${l}</i><b>${n}</b><em class="${up ? 'up' : 'dn'}">${K.icon(up ? 'chevU' : 'chevD')}${t}</em></div>`).join('') +
            '<div class="ch"><svg viewBox="0 0 14 3.2" preserveAspectRatio="none" aria-hidden="true"><path pathLength="100" d="M.4 2.6 L2.6 2 L4.8 2.3 L7 1.2 L9.2 1.6 L11.4 .8 L13.6 .5"/></svg></div>' +
            [0, 1, 2].map(i => K.wf('line', 1, 7.7 + i * .75, 14, .06) + K.wf('text', 1.2, 7.85 + i * .75, 6, .3)).join('') +
            ov(.8, 1.2, 14.4, 2.6, 'd1') + tag(1.2, 3.3, '1 핵심 수치', 'd1') +
            ov(.8, 3.9, 14.4, 3.5, 'd2') + tag(1.2, 6.8, '2 추이', 'd2') +
            ov(.8, 7.5, 14.4, 2.5, 'd3') + tag(11.6, 9.1, '3 상세 표', 'd3')
        }
      },
      {
        id: 'z-pattern', ko: 'Z 패턴', en: 'Z-pattern', aka: ['Z자 배치', 'z layout'],
        when: '콘텐츠가 적고 행동 유도가 하나인 랜딩, 로고, 메뉴, 핵심 문구, 버튼 순서가 분명할 때',
        avoid: '글이 많은 페이지 (글이 많으면 시선이 F자로 읽혀요)',
        notes: [
          '시선 끝인 우하단에 주 버튼을 둬요.',
          '1 로고, 2 메뉴, 3 핵심 문구, 4 버튼처럼 읽는 순서를 먼저 정해요.',
          '웹 레이아웃의 Z자형과 같은 항목이에요. 모바일에서는 이미지와 글의 쌓는 순서를 항상 같게 해요.'
        ],
        vs: { topic: 'web-layouts', id: 'f-shape', name: 'F자형', text: 'F자형은 글이 많은 화면에서 왼쪽 가장자리를 따라 훑어요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 4100,
          phases: [['시선 이동', 400, 4000], ['유지', 4000, 4500]],
          alt: '시선이 왼쪽 위 로고에서 오른쪽 위 메뉴로 간 뒤 대각선으로 왼쪽 아래 핵심 문구로 내려오고, 마지막으로 오른쪽 아래 버튼에 닿으며 각 지점에 이름표가 붙는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1.2) + K.wf('title', 1, .35, 2.2, .5, 'lt') + [10.5, 12, 13.5].map(x => K.wf('line', x, .5, 1.1, .2, 'lt')).join('') +
            K.wf('img', 5, 2.1, 6, 3.6) + K.wf('title', 1, 6.9, 6.5, .9) + K.wf('text', 1, 8.1, 5.5, .9) + K.wf('btn', 11, 7.2, 4, 1.1) +
            '<svg class="zl" viewBox="0 0 16 10" aria-hidden="true"><path pathLength="100" d="M2.1 .6 L12.3 .6 L3.5 7.35 L13 7.75"/></svg>' +
            tag(1.3, 1.45, '1 로고', 't1') + tag(11.3, 1.45, '2 메뉴', 't2') + tag(2.3, 6.2, '3 핵심 문구', 't3') + tag(11.5, 6.45, '4 버튼', 't4') + K.dot(2.1, .6, 'gz')
        }
      },
      {
        id: 'full-bleed', ko: '풀블리드', en: 'Full bleed', aka: ['꽉 찬 배경', '전폭 이미지', 'edge to edge'],
        when: '사진이 주인공인 기사 상단, 구분 띠, 인용구 강조, 히어로 배경',
        avoid: '텍스트가 가장자리에 붙을 때 (본문은 항상 안쪽 여백을 유지해요)',
        notes: [
          '배경은 끝까지 채우고 내용은 max-width 컨테이너 안에 둬요.',
          '가로 스크롤이 생기지 않게 100vw보다 100%를 먼저 써요(스크롤바 폭 때문에 넘쳐요).',
          '모바일 노치 영역은 env(safe-area-inset-*)로 비워요.'
        ],
        vs: { topic: 'web-layouts', id: 'featured-media', name: '대표 이미지·영상', text: '대표 이미지·영상은 큰 이미지를 두는 구성이고, 풀블리드는 그 면이 좌우 여백 없이 끝까지 닿는 방식이에요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 3100,
          phases: [['컨테이너 안', 200, 1400], ['끝까지 확장', 1500, 2100], ['유지', 2100, 4200]],
          alt: '컨테이너 안에 있던 이미지 띠가 좌우로 늘어나 화면 끝까지 닿고, 글은 안쪽 여백을 그대로 지키는 시연',
          html: K => '<i class="ct"></i>' + K.wf('title', 1.5, 1.7, 5, .5) + K.wf('text', 1.5, 2.5, 8, .5) +
            K.wf('img', 1, 3.4, 14, 3, 'bd') + K.wf('text', 1.5, 6.9, 9, 1.2) + K.wf('text', 1.5, 8.5, 7, .6) +
            K.dim({ x: 0, y: 9.5, len: 1.5, dir: 'h', label: '여백', side: 'top', cls: 'dm' }) +
            tag(5.4, 6.45, '내용은 컨테이너 안', 'u1') + tag(5.6, 6.45, '배경은 화면 끝까지', 'u2')
        }
      }
    ],
    css: K => `
/* shared */
${sel('.ov')}{position:absolute;z-index:15;border:.12em solid var(--a-brand);background:rgba(194,71,25,.12);border-radius:.3em;opacity:0;pointer-events:none}
${sel('.tg')}{position:absolute;z-index:22;opacity:0;pointer-events:none}
${sel('.tg span')}{display:block;font-size:.52em;font-weight:700;padding:.3em .8em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;line-height:1.3}
${sel('.mk')}{position:absolute;z-index:22;width:1.2em;height:1.2em;margin:-.6em 0 0 -.6em;border-radius:50%;background:var(--a-brand);color:#fff;display:grid;place-items:center;opacity:0}
${sel('.mk span')}{font-size:.6em;font-weight:700;line-height:1}
${sel('.k-wf-nav')}{z-index:6}
${sel('.lt')}{background:#a9aeaa}
${sel('.k-wf-img')}{background-color:#d3d6d1}

/* hero */
.t-screen-layouts-hero .h1,.t-screen-layouts-hero .h2,.t-screen-layouts-hero .h3,.t-screen-layouts-hero .h4,.t-screen-layouts-hero .h5,.t-screen-layouts-hero .pk{opacity:0}
.t-screen-layouts-hero .h1{animation-name:slH1}.t-screen-layouts-hero .h2{animation-name:slH2}.t-screen-layouts-hero .h3{animation-name:slH3}.t-screen-layouts-hero .h4{animation-name:slH4}.t-screen-layouts-hero .h5{animation-name:slH5}.t-screen-layouts-hero .pk{animation-name:slHPk}
.t-screen-layouts-hero .hv{animation-name:slHv}
.t-screen-layouts-hero .dm{animation-name:slHd}
${K.kf.fade('slH1', [[3, 11, 92, 97]], .6)}${K.kf.fade('slH2', [[10, 18, 92, 97]], .6)}${K.kf.fade('slH3', [[17, 25, 92, 97]], .6)}${K.kf.fade('slH4', [[24, 32, 92, 97]], .6)}${K.kf.fade('slH5', [[8, 18, 92, 97]], .6)}${K.kf.fade('slHPk', [[34, 42, 92, 97]], .8)}
${op('slHv', [[36, 42, 86, 94]])}${op('slHd', [[44, 50, 86, 94]])}

/* bento */
.t-screen-layouts-bento .tl{position:absolute;border-radius:.6em;background:var(--a-soft);border:.07em solid var(--a-line);opacity:0}
.t-screen-layouts-bento .big{background:rgba(194,71,25,.14);border-color:rgba(194,71,25,.3)}
${[0, 1, 2, 3, 4, 5, 6].map(i => `.t-screen-layouts-bento .t${i}{animation-name:slBt${i}}`).join('')}
${[3, 16, 20, 24, 28, 32, 36].map((a, i) => pop('slBt' + i, a)).join('')}
.t-screen-layouts-bento .bt{animation-name:slBtT}
${op('slBtT', [[46, 52, 88, 94]])}

/* split */
.t-screen-layouts-split .pa,.t-screen-layouts-split .pb{position:absolute;top:0;bottom:0;width:8em}
.t-screen-layouts-split .pa{left:0;background:var(--a-soft)}
.t-screen-layouts-split .pb{left:8em;background:var(--a-dark)}
.t-screen-layouts-split .tb{background:#9ea39d}
.t-screen-layouts-split .k-wf-text.tb{background:repeating-linear-gradient(#6b706b 0 .28em,transparent .28em .62em)}
.t-screen-layouts-split .ha,.t-screen-layouts-split .hb{position:absolute;top:0;width:8em;height:10em;border:.14em solid var(--a-brand);opacity:0;pointer-events:none;z-index:6}
.t-screen-layouts-split .ha{left:0;animation-name:slSpA}
.t-screen-layouts-split .hb{left:8em;animation-name:slSpB}
.t-screen-layouts-split .ba{animation-name:slSpBa}
.t-screen-layouts-split .bb{animation-name:slSpBb}
.t-screen-layouts-split .cur{animation-name:slSpCur,slSpCurO}
.t-screen-layouts-split .tp1{animation-name:slSpT1}
.t-screen-layouts-split .tp2{animation-name:slSpT2}
${op('slSpA', [[10, 14, 38, 42]])}${op('slSpB', [[48, 52, 78, 82]])}${op('slSpCurO', [[2, 6, 84, 90]])}
@keyframes slSpBa{0%,18%{transform:none}22%,34%{transform:scale(1.08)}40%,100%{transform:none}}
@keyframes slSpBb{0%,56%{transform:none}60%,74%{transform:scale(1.08)}80%,100%{transform:none}}
${K.kf.path('slSpCur', [[0, 0, 0], [8, -4.8, -2.6], [34, -4.8, -2.6], [46, 3.2, -2.6], [74, 3.2, -2.6], [100, 3.2, -2.6]])}
${K.kf.tap('slSpT1', 26)}${K.kf.tap('slSpT2', 64)}

/* card grid */
.t-screen-layouts-card-grid .ly{position:absolute;inset:0}
.t-screen-layouts-card-grid .g1{animation-name:slCgA}.t-screen-layouts-card-grid .g2{animation-name:slCgB}.t-screen-layouts-card-grid .g3{animation-name:slCgC}
.t-screen-layouts-card-grid .cc{position:absolute;height:3.4em;background:#fff;border:.07em solid var(--a-line);border-radius:.5em}
.t-screen-layouts-card-grid .fr{position:absolute;height:7.6em;border:.07em dashed #b9bdb7;border-radius:.4em}
.t-screen-layouts-card-grid .cs{position:absolute;left:1em;top:.15em;z-index:22}
.t-screen-layouts-card-grid .cs span{display:block;font-size:.42em;font-weight:700;padding:.3em .8em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;font-family:ui-monospace,Consolas,monospace}
${op('slCgA', [[28, 34, 90, 96]], 1)}${op('slCgB', [[28, 34, 60, 66]])}${op('slCgC', [[60, 66, 90, 96]])}

/* sidebar */
.t-screen-layouts-sidebar .sd{position:absolute;left:0;top:0;width:3.6em;height:10em;background:var(--a-soft);border-right:.07em solid var(--a-line)}
.t-screen-layouts-sidebar .si{position:absolute;left:.3em;width:3em;height:1em;padding-left:.45em;display:flex;align-items:center}
.t-screen-layouts-sidebar .si b{font-size:.6em;font-weight:500;white-space:nowrap}
.t-screen-layouts-sidebar .bd0,.t-screen-layouts-sidebar .bd2{z-index:3;opacity:0}
.t-screen-layouts-sidebar .bd0 b,.t-screen-layouts-sidebar .bd2 b{font-weight:800;color:var(--a-brand)}
.t-screen-layouts-sidebar .bd0{animation-name:slSbB0}
.t-screen-layouts-sidebar .bd2{animation-name:slSbB2}
.t-screen-layouts-sidebar .ah{position:absolute;left:.3em;top:1.9em;width:3em;height:1em;border-radius:.3em;background:rgba(194,71,25,.16);animation-name:slSbAh;z-index:2}
.t-screen-layouts-sidebar .ah::before{content:"";position:absolute;left:0;top:.15em;bottom:.15em;width:.14em;border-radius:.1em;background:var(--a-brand)}
.t-screen-layouts-sidebar .c1{position:absolute;inset:0;animation-name:slSbC1}
.t-screen-layouts-sidebar .c3{position:absolute;inset:0;opacity:0;animation-name:slSbC3}
.t-screen-layouts-sidebar .dm{animation-name:slSbD}
.t-screen-layouts-sidebar .sn{animation-name:slSbN}
.t-screen-layouts-sidebar .tp1{animation-name:slSbT1}.t-screen-layouts-sidebar .tp2{animation-name:slSbT2}
.t-screen-layouts-sidebar .cur{animation-name:slSbCur,slSbCurO}
@keyframes slSbAh{0%,24%{transform:none}30%,78%{transform:translateY(2.5em)}84%,100%{transform:none}}
@keyframes slSbB0{0%,22%{opacity:1}28%,80%{opacity:0}86%,100%{opacity:1}}
${op('slSbB2', [[24, 30, 78, 84]])}
${op('slSbC1', [[28, 34, 78, 84]], 1)}${op('slSbC3', [[28, 34, 78, 84]])}
${op('slSbD', [[2, 6, 18, 22]])}${op('slSbN', [[34, 40, 66, 72]])}${op('slSbCurO', [[2, 6, 86, 92]])}
${K.kf.tap('slSbT1', 22)}${K.kf.tap('slSbT2', 78)}
${K.kf.path('slSbCur', [[0, 0, 0], [6, -7, -3.1], [60, -7, -3.1], [72, -7, -5.6], [100, -7, -5.6]])}

/* magazine */
.t-screen-layouts-magazine .a1{animation-name:slMgA}.t-screen-layouts-magazine .a2{animation-name:slMgB}.t-screen-layouts-magazine .a3{animation-name:slMgC}
${op('slMgA', [[4, 9, 24, 29]])}${op('slMgB', [[32, 37, 50, 55]])}${op('slMgC', [[58, 63, 86, 91]])}

/* dashboard */
.t-screen-layouts-dashboard .kp{position:absolute;top:1.4em;width:4.3em;height:2.4em;padding:.3em .5em;background:#fff;border:.07em solid var(--a-line);border-radius:.45em;display:flex;flex-direction:column;justify-content:center}
.t-screen-layouts-dashboard .kp i{font-style:normal;font-size:.5em;color:var(--a-mut);font-weight:700}
.t-screen-layouts-dashboard .kp b{font-size:.85em;line-height:1.1}
.t-screen-layouts-dashboard .kp em{display:flex;align-items:center;font-style:normal;font-size:.5em;font-weight:700}
.t-screen-layouts-dashboard .kp em .k-i{width:1.1em;height:1.1em}
.t-screen-layouts-dashboard .kp .up{color:var(--a-ok)}.t-screen-layouts-dashboard .kp .dn{color:var(--a-err)}
.t-screen-layouts-dashboard .ch{position:absolute;left:1em;top:3.9em;width:14em;height:3.4em;background:#fff;border:.07em solid var(--a-line);border-radius:.45em;padding:.1em .3em}
.t-screen-layouts-dashboard .ch svg{width:100%;height:100%}
.t-screen-layouts-dashboard .ch path{fill:none;stroke:var(--a-brand);stroke-width:.08;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;vector-effect:non-scaling-stroke;stroke-width:2.2px;animation-name:slDbDraw}
.t-screen-layouts-dashboard .d1{animation-name:slDb1}.t-screen-layouts-dashboard .d2{animation-name:slDb2}.t-screen-layouts-dashboard .d3{animation-name:slDb3}
${op('slDb1', [[4, 8, 30, 34]])}${op('slDb2', [[36, 40, 62, 66]])}${op('slDb3', [[68, 72, 90, 94]])}
@keyframes slDbDraw{0%,34%{stroke-dashoffset:100}60%,90%{stroke-dashoffset:0}96%,100%{stroke-dashoffset:100}}

/* z pattern */
.t-screen-layouts-z-pattern .zl{position:absolute;inset:0;width:100%;height:100%;z-index:14;pointer-events:none}
.t-screen-layouts-z-pattern .zl path{fill:none;stroke:var(--a-brand);stroke-width:.12;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;opacity:.6;animation-name:slZDraw;animation-timing-function:linear}
.t-screen-layouts-z-pattern .gz{animation-name:slZPath,slZDotO;animation-timing-function:linear,linear}
.t-screen-layouts-z-pattern .t1{animation-name:slZt1}.t-screen-layouts-z-pattern .t2{animation-name:slZt2}.t-screen-layouts-z-pattern .t3{animation-name:slZt3}.t-screen-layouts-z-pattern .t4{animation-name:slZt4}
@keyframes slZDraw{0%,8%{stroke-dashoffset:100;opacity:.6}31.8%{stroke-dashoffset:66.9}57.7%{stroke-dashoffset:30.9}80%,90%{stroke-dashoffset:0;opacity:.6}96%,100%{stroke-dashoffset:0;opacity:0}}
${K.kf.path('slZPath', [[0, 0, 0], [8, 0, 0], [31.8, 10.2, 0], [57.7, 1.4, 6.75], [80, 10.9, 7.15], [100, 10.9, 7.15]])}
${op('slZDotO', [[3, 6, 86, 92]])}
${op('slZt1', [[8, 12, 90, 96]])}${op('slZt2', [[31.8, 35.8, 90, 96]])}${op('slZt3', [[57.7, 61.7, 90, 96]])}${op('slZt4', [[80, 84, 90, 96]])}

/* full bleed */
.t-screen-layouts-full-bleed .ct{position:absolute;left:1em;top:1.2em;width:14em;height:8em;border:.07em dashed #b9bdb7;border-radius:.3em}
.t-screen-layouts-full-bleed .bd{animation-name:slFbBd}
.t-screen-layouts-full-bleed .dm{animation-name:slFbD}
.t-screen-layouts-full-bleed .u1{animation-name:slFbU1}
.t-screen-layouts-full-bleed .u2{animation-name:slFbU2}
@keyframes slFbBd{0%,28%{transform:none}38%,84%{transform:scaleX(1.1429)}94%,100%{transform:none}}
${op('slFbD', [[44, 48, 84, 90]])}${op('slFbU1', [[4, 8, 26, 30]])}${op('slFbU2', [[42, 47, 84, 90]])}
`
  });
})();
