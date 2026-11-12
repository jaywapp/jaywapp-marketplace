/* Topic: 웹 레이아웃 (web-layouts). Reference: plugins/design-master/references/layout.md
   Every selector starts with .t-web-layouts-<element>. Keyframes use the wl prefix. */
(function () {
  const P = 'web-layouts';
  const IDS = ['two-column', 'split-screen', 'z-shape', 'asymmetrical', 'f-shape', 'featured-media', 'card-block', 'magazine', 'fixed-nav', 'masonry', 'hidden-nav', 'interactive'];
  const sel = r => IDS.map(i => `.t-${P}-${i} ${r}`).join(',');
  /* opacity-only keyframes. wins: [[a,b,c,d]] = off until a, fully on b..c, off again at d. base 1 flips the logic. */
  const op = (n, wins, base = 0) => {
    const f = [`0%{opacity:${base}}`];
    wins.forEach(([a, b, c, d]) => f.push(`${a}%{opacity:${base}}${b}%{opacity:${1 - base}}${c}%{opacity:${1 - base}}${d}%{opacity:${base}}`));
    f.push(`100%{opacity:${base}}`);
    return `@keyframes ${n}{${f.join('')}}`;
  };
  const ov = (x, y, w, h, c) => `<i class="ov ${c}" style="left:${x}em;top:${y}em;width:${w}em;height:${h}em"></i>`;
  const tag = (x, y, t, c) => `<b class="tg ${c}" style="left:${x}em;top:${y}em"><span>${t}</span></b>`;
  const mk = (x, y, t, c) => `<b class="mk ${c}" style="left:${x}em;top:${y}em"><span>${t}</span></b>`;

  UIGuide.registerTopic({
    id: P,
    intro: '넓은 화면에서 영역을 어떻게 나누고, 사용자의 시선이 어느 길로 움직이는지를 정하는 구성이에요. 내용의 양과 목적으로 고릅니다.',
    elements: [
      {
        id: 'two-column', ko: '투 칼럼', en: 'Two-column', aka: ['2열', '두 칼럼', 'two column'],
        when: '설명과 시각 자료를 함께 보여 줄 때, 본문 옆에 목차나 구매 카드를 고정할 때',
        avoid: '좁은 화면에서 비율을 유지하려 할 때 (모바일은 한 열로 쌓고 순서를 정해요)',
        notes: [
          '비율은 6:4나 7:3처럼 주종이 분명해야 해요.',
          '본문 줄 길이는 한글 기준 한 줄 30~40자 안팎이에요. grid-template-columns에 minmax를 써요.',
          '보조 열을 sticky로 둘 때는 top 값을 고정 헤더 높이만큼 띄워요.'
        ],
        vs: { id: 'split-screen', text: '스플릿 스크린은 두 영역이 대등하고 화면 전체를 써요. 투 칼럼은 본문과 보조처럼 주종이 있어요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 1500,
          phases: [['본문 강조', 200, 1650], ['보조 강조', 1800, 3050], ['스크롤 고정', 3300, 4800]],
          alt: '화면이 본문 열과 보조 열로 나뉘고, 본문 6 보조 4 비율이 차례로 강조된 뒤 본문만 스크롤되어도 보조 열은 제자리에 남는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1) +
            '<div class="lc">' + K.wf('title', 1, 1.7, 6, .6) + K.wf('text', 1, 2.8, 9.2, 2.6) + K.wf('text', 1, 5.8, 9.2, 2.6) + K.wf('text', 1, 9, 9.2, 2.6) + '</div>' +
            K.wf('img', 11, 1.7, 4, 2.6) + K.wf('block', 11, 4.6, 4, 2.4) + K.wf('btn', 11.5, 6, 3, .7) +
            ov(.7, 1.3, 9.8, 7.8, 'o1') + tag(4.2, 8.45, '본문 6', 'o1') +
            ov(10.7, 1.3, 4.6, 6.9, 'o2') + tag(11.9, 7.4, '보조 4', 'o2') + tag(10.9, 8.5, '보조 열은 제자리', 'o3')
        }
      },
      {
        id: 'split-screen', ko: '스플릿 스크린', en: 'Split screen', aka: ['스플릿', '반반 화면', 'split'],
        when: '로그인 화면(폼과 브랜드 이미지), 두 선택지 비교, 랜딩의 첫 화면',
        avoid: '내용이 한쪽으로 쏠릴 때, 모바일 폭 (위아래로 쌓거나 한쪽만 남겨요)',
        notes: [
          '높이는 min-height: 100dvh를 쓰고 모바일 주소창 변화를 고려해요.',
          '양쪽 모두 글자가 올라가면 각각 대비를 따로 확인해요.',
          '이미지 쪽은 alt를 비우거나 장식 처리해요.'
        ],
        vs: { id: 'two-column', text: '투 칼럼은 본문과 보조처럼 주종이 있어요. 스플릿은 두 면이 대등해요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 3200,
          phases: [['왼쪽 면', 200, 1500], ['오른쪽 면', 1700, 3000], ['화면 가득', 3200, 4600]],
          alt: '화면이 가운데에서 반으로 갈라져 왼쪽 브랜드 이미지 면과 오른쪽 로그인 폼 면이 차례로 강조되고, 두 면이 각각 50퍼센트로 화면 높이를 가득 채우는 시연',
          html: K => K.wf('img', 0, 0, 8, 10) + K.wf('title', 1, 8.2, 4, .5, 'lt') + K.wf('line', 7.97, 0, .06, 10) +
            K.wf('title', 9.6, 2.2, 4, .55) + K.wf('block', 9.6, 3.4, 5, .9) + K.wf('block', 9.6, 4.7, 5, .9) + K.wf('btn', 9.6, 6.2, 5, .9) +
            ov(0, 0, 8, 10, 'oL') + tag(1.2, .5, '브랜드 면', 'oL') +
            ov(8, 0, 8, 10, 'oR') + tag(9.6, .5, '폼 면', 'oR') +
            K.dim({ x: 0, y: 9.2, len: 8, dir: 'h', label: '50%', side: 'top', cls: 'dm' }) +
            K.dim({ x: 8, y: 9.2, len: 8, dir: 'h', label: '50%', side: 'top', cls: 'dm' }) +
            K.dim({ x: 15.5, y: 0, len: 10, dir: 'v', label: '100dvh', side: 'left', cls: 'dm' })
        }
      },
      {
        id: 'z-shape', ko: 'Z자형', en: 'Z-shape', aka: ['지그재그', 'Z 패턴', 'z pattern'],
        when: '콘텐츠가 적고 행동 유도가 하나인 랜딩, 로고, 메뉴, 핵심 문구, 버튼 순서가 분명할 때',
        avoid: '글이 많은 페이지 (글이 많으면 시선이 F자로 읽혀요)',
        notes: [
          '시선 끝인 우하단에 주 버튼을 둬요.',
          '이미지와 글을 좌우로 번갈아 놓는 지그재그 반복은 모바일에서 순서를 항상 같게 쌓아요.',
          '1 로고, 2 메뉴, 3 핵심 문구, 4 버튼처럼 읽는 순서를 먼저 정해요.'
        ],
        vs: { id: 'f-shape', text: 'F자형은 글이 많은 화면에서 왼쪽 가장자리를 따라 훑어요. Z자형은 시선이 대각선을 지나 우하단 버튼으로 가요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 4000,
          phases: [['시선 이동', 400, 4000], ['유지', 4000, 4500]],
          alt: '시선이 왼쪽 위 로고에서 오른쪽 위 메뉴로 가고, 대각선으로 왼쪽 아래 글을 거쳐 오른쪽 아래 버튼에 닿으며 Z자를 그리는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1.2) + K.wf('title', 1, .35, 2.2, .5) + K.wf('line', 10.5, .5, 1.1, .2) + K.wf('line', 12, .5, 1.1, .2) + K.wf('line', 13.5, .5, 1.1, .2) +
            K.wf('title', 4.5, 3.2, 7, .9) + K.wf('text', 5, 4.5, 6, 1.2) + K.wf('text', 1, 7.2, 5.5, 1.4) + K.wf('btn', 10.8, 7.4, 4, 1.1) +
            '<svg class="zl" viewBox="0 0 16 10" aria-hidden="true"><path pathLength="100" d="M2.1 .6 L12.3 .6 L3.75 7.9 L12.8 7.95"/></svg>' +
            mk(3.7, 1.7, '1', 'm1') + mk(13.7, 1.7, '2', 'm2') + mk(7, 8.9, '3', 'm3') + mk(15.1, 7.95, '4', 'm4') +
            K.dot(2.1, .6, 'gz')
        }
      },
      {
        id: 'asymmetrical', ko: '비대칭', en: 'Asymmetrical', aka: ['비대칭 레이아웃', 'asymmetric'],
        when: '브랜드 인상이 중요한 소개 페이지, 포트폴리오, 편집 느낌이 필요한 화면',
        avoid: '폼, 표, 업무용 화면처럼 정보를 빠르게 훑는 화면',
        notes: [
          '12열 격자 위에서 열을 비우는 방식으로 만들면 정렬선이 유지돼요.',
          '무게가 한쪽에 몰려도 읽는 순서는 DOM 순서와 같아야 해요.',
          '큰 면과 작은 글의 크기 대비와 여백으로 균형을 잡아요.'
        ],
        vs: { id: 'magazine', text: '매거진은 크기가 다른 여러 블록을 격자에 섞어요. 비대칭은 한쪽을 크게 두고 여백으로 균형을 잡아요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 3800,
          phases: [['무거운 쪽', 200, 1400], ['가벼운 쪽', 1500, 2700], ['격자', 3000, 4500]],
          alt: '왼쪽은 큰 이미지로 무겁고 오른쪽은 작은 글과 넓은 여백으로 가벼운 화면이 차례로 강조되고, 12열 격자선이 나타나 두 쪽이 같은 정렬선 위에 있음을 보여 주는 시연',
          html: K => K.wf('img', 0, 1.2, 9.33, 8.8) + K.wf('nav', 0, 0, 16, 1.2) +
            K.wf('title', 12, 2.5, 3, .6) + K.wf('text', 12, 3.6, 3, 1.6) + K.wf('btn', 12, 6, 2.4, .8) +
            '<div class="gl">' + Array.from({ length: 13 }, (_, i) => K.wf('line', +(i * 16 / 12 - .015).toFixed(3), 0, .03, 10)).join('') + '</div>' +
            ov(0, 1.2, 9.33, 8.8, 'a1') + tag(2.6, 8.9, '큰 면: 무게', 'a1') +
            ov(9.33, 1.2, 6.67, 8.8, 'a2') + tag(10.6, 8.9, '작은 글과 여백', 'a2') + tag(5.2, 4.6, '12열 격자 정렬선', 'a3')
        }
      },
      {
        id: 'f-shape', ko: 'F자형', en: 'F-shape', aka: ['F 패턴', 'F pattern'],
        when: '글, 목록, 검색 결과처럼 텍스트가 많은 화면',
        avoid: '감정적 몰입이나 하나의 행동을 강조할 화면 (Z자형이 맞아요)',
        notes: [
          '중요한 단어를 줄 맨 앞에 둬요.',
          '제목, 소제목, 굵은 단어로 왼쪽 가장자리에 읽을 거리를 만들어요.',
          '문단은 짧게, 한 문단에 한 생각이에요.'
        ],
        vs: { id: 'z-shape', text: 'Z자형은 글이 적고 버튼 하나로 이어져요. F자형은 글이 많아서 위쪽 가로줄을 읽고 왼쪽을 따라 내려가요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 3600,
          phases: [['시선 이동', 400, 3800], ['유지', 3800, 4500]],
          alt: '시선이 위쪽 긴 줄을 오른쪽으로 읽고, 조금 아래에서 한 번 더 짧게 읽은 뒤 왼쪽 가장자리를 따라 아래로 내려가며 F자를 그리는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1) + K.wf('title', 1, 1.5, 11.5, .6) + K.wf('title', 1, 2.7, 7.5, .6, 'sub') +
            K.wf('text', 1, 4, 13, 1.2) + K.wf('text', 1, 5.5, 12, 1.2) + K.wf('text', 1, 7, 12.5, 1.4) +
            '<svg class="zl" viewBox="0 0 16 10" aria-hidden="true"><path pathLength="100" d="M1.5 1.8 H12 M1.5 3 H8.5 M1.5 3 V8.5"/></svg>' +
            K.dot(1.5, 1.8, 'gz')
        }
      },
      {
        id: 'featured-media', ko: '대표 이미지·영상', en: 'Featured image or video', aka: ['히어로 이미지', '대표 이미지', 'hero image'],
        when: '제품, 장소, 이야기를 한눈에 전달해야 할 때 (히어로의 한 형태)',
        avoid: '이미지가 정보를 대신하지 못하거나 로딩이 느린 환경, 자동 재생 영상의 데이터와 배터리 부담',
        notes: [
          '이미지 위 글은 어두운 오버레이로 대비 4.5:1을 확보해요.',
          '영상은 muted autoplay playsinline loop와 포스터 이미지를 쓰고 정지 버튼을 줘요.',
          'prefers-reduced-motion이면 정지 상태로 두고, 종횡비를 지정해 레이아웃 흔들림을 막아요.'
        ],
        vs: { topic: 'screen-layouts', id: 'hero', name: '히어로', text: '히어로는 한 문장 제안과 버튼까지 포함한 첫 영역이고, 대표 이미지·영상은 그 영역을 이루는 시각 요소예요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 3300,
          phases: [['큰 면', 200, 1300], ['오버레이', 1500, 4400], ['재생', 3100, 4400]],
          alt: '화면 위쪽에 큰 이미지가 깔리고, 아래쪽이 어둡게 덮이며 흰 제목이 올라오고, 영상처럼 진행 막대가 차오르며 오른쪽 위에 정지 버튼이 나타나는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1) + K.wf('img', 0, 1, 16, 6.4) + '<div class="gr"></div>' +
            K.wf('title', 1, 5.6, 7, .7, 'ft') + K.wf('text', 1, 6.5, 5, .5, 'ft2') + K.wf('text', 1, 8.1, 10, 1.4) +
            K.wf('line', 0, 7.28, 16, .12, 'pb') +
            `<span class="pz">${K.icon('pause')}</span>` +
            ov(0, 1, 16, 6.4, 'f1') + tag(6.2, 3.8, '큰 이미지 또는 영상', 'f1') + tag(8.6, 2.2, '글자 대비는 오버레이로', 'f2') + tag(10.2, 1.45, '정지 버튼 제공', 'f3')
        }
      },
      {
        id: 'card-block', ko: '카드·블록', en: 'Card or block', aka: ['카드', '블록', 'card'],
        when: '서로 독립된 항목이 여러 개이고 훑어보며 고를 때 (상품, 글, 프로젝트)',
        avoid: '항목 간 비교가 핵심일 때 (표나 리스트), 카드 안에 카드를 넣는 중첩',
        notes: [
          '카드의 높이, 모서리 반경, 그림자를 하나로 통일해요.',
          '카드 전체가 링크면 링크는 하나만 두고 안에 또 다른 버튼을 넣지 않아요.',
          '카드 사이 간격은 12~24px 범위에서 하나로 정해요.'
        ],
        vs: { topic: 'screen-layouts', id: 'card-grid', name: '카드 그리드', text: '카드 그리드는 같은 카드를 열 수가 자동으로 바뀌게 배열하는 배치이고, 카드·블록은 정보를 사각형 묶음으로 나누는 개념이에요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 2900,
          phases: [['등장', 200, 1400], ['간격', 1700, 2700], ['링크 하나', 3200, 4500]],
          alt: '같은 모양의 카드 여섯 장이 차례로 나타나 격자를 이루고, 카드 사이 간격이 표시되고, 마우스가 카드 하나에 올라가면 카드 전체가 링크 하나로 강조되는 시연',
          html: K => {
            const xs = [1, 5.9, 10.8], ys = [1.5, 5.4];
            const cards = [0, 1, 2, 3, 4, 5].map(i => `<div class="cd c${i}" style="left:${xs[i % 3]}em;top:${ys[Math.floor(i / 3)]}em">` +
              K.wf('img', .2, .2, 3.9, 1.9) + K.wf('title', .3, 2.4, 2.2, .3) + K.wf('text', .3, 2.9, 3.6, .4) + '</div>').join('');
            return cards +
              K.dim({ x: 5.3, y: 4.9, len: .6, dir: 'h', label: '12~24px', side: 'bottom', cls: 'dm' }) +
              ov(5.8, 1.4, 4.5, 3.7, 'k1') + tag(5.9, 5.15, '카드 전체가 링크 하나', 'k1') + K.cursor(14, 9.4, 'cur');
          }
        }
      },
      {
        id: 'magazine', ko: '매거진', en: 'Magazine', aka: ['편집형', 'editorial'],
        when: '콘텐츠 양이 많고 우선순위가 있는 뉴스, 블로그, 커뮤니티 홈',
        avoid: '콘텐츠가 몇 개 안 되거나 모두 같은 중요도일 때',
        notes: [
          '큰 블록 1개, 중간 2~3개, 작은 것 나머지처럼 크기 단계를 3단계 이하로 둬요.',
          '격자의 열 수를 유지해 정렬선을 맞춰요.',
          '모바일에서는 큰 블록 다음에 작은 블록을 목록으로 쌓아요.'
        ],
        vs: { id: 'masonry', text: '메이슨리는 높이만 다르고 위계가 없어요. 카드·블록은 크기가 모두 같고, 매거진은 크기로 우선순위를 말해요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 4000,
          phases: [['큰 것', 200, 1300], ['중간', 1600, 2600], ['작은 것', 2900, 4300]],
          alt: '큰 대표 기사 하나, 중간 기사 둘, 작은 기사 목록으로 세 단계 크기가 차례로 강조되는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1) +
            K.wf('img', 1, 1.4, 6.4, 4.6) + K.wf('title', 1, 6.2, 5.2, .55) + K.wf('text', 1, 7.1, 6.4, .6) +
            K.wf('img', 7.8, 1.4, 3.6, 1.9) + K.wf('text', 7.8, 3.5, 3.6, .6) + K.wf('img', 7.8, 4.5, 3.6, 1.9) + K.wf('text', 7.8, 6.6, 3.6, .6) +
            [0, 1, 2, 3, 4].map(i => K.wf('img', 11.8, 1.4 + i * 1.15, .9, .7) + K.wf('text', 12.9, 1.4 + i * 1.15, 2.1, .7)).join('') +
            ov(.8, 1.2, 6.8, 6.8, 'm1') + tag(2.3, 8.3, '큰 블록 1개', 'm1') +
            ov(7.6, 1.2, 4, 6.3, 'm2') + tag(8.4, 7.8, '중간 2개', 'm2') +
            ov(11.6, 1.2, 3.6, 5.8, 'm3') + tag(11.9, 7.3, '작은 목록', 'm3')
        }
      },
      {
        id: 'fixed-nav', ko: '고정 내비게이션', en: 'Fixed navigation', aka: ['sticky nav', '고정 메뉴', '상단 고정'],
        when: '이동 빈도가 높고 페이지가 긴 서비스, 앱 형태의 웹',
        avoid: '가로가 좁고 세로 공간이 귀한 화면 (모바일 가로 모드, 읽기 중심 화면)',
        notes: [
          '높이는 56~72px 이하로 줄여요.',
          'position: sticky와 앵커 이동 시 scroll-margin-top을 함께 써요.',
          '불투명 배경이나 충분한 블러와 구분선으로 아래 글과 겹쳐 읽히지 않게 해요.'
        ],
        vs: { topic: 'navigation', id: 'sticky-header', name: '고정 헤더', text: '고정 헤더는 상단 바 자체의 동작이고, 고정 내비게이션은 사이트 전역 메뉴가 계속 보인다는 관점이에요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 2700,
          phases: [['제자리', 0, 800], ['스크롤', 800, 3500], ['되돌림', 4000, 4800]],
          alt: '페이지 내용이 아래로 스크롤되어 올라가는 동안 위쪽 메뉴 막대는 그 자리에 남고 아래에 구분 그림자가 생기는 시연',
          html: K => '<div class="pg">' + K.wf('img', 1, 1.4, 14, 3) + K.wf('title', 1, 4.8, 6, .6) + K.wf('text', 1, 5.8, 11, 1.6) + K.wf('img', 1, 8, 6.7, 3) + K.wf('img', 8.3, 8, 6.7, 3) + K.wf('text', 1, 11.4, 12, 2) + '</div>' +
            '<i class="sh"></i>' + K.wf('nav', 0, 0, 16, .8) + K.wf('title', 1, .22, 1.8, .36, 'lt') + K.wf('line', 10.5, .32, 1, .16, 'lt') + K.wf('line', 12, .32, 1, .16, 'lt') + K.wf('line', 13.5, .32, 1, .16, 'lt') +
            K.wf('line', 15.5, 1.2, .25, 2.4, 'thumb') + K.dim({ x: 14.5, y: 0, len: .8, dir: 'v', label: '64px', side: 'left', cls: 'dm' }) +
            tag(5.4, 1.15, '스크롤해도 제자리', 'fx')
        }
      },
      {
        id: 'masonry', ko: '메이슨리', en: 'Masonry', aka: ['벽돌형', 'pinterest', '핀터레스트형'],
        when: '사진, 이미지 모음, 영감 보드처럼 높이가 제각각인 시각 콘텐츠',
        avoid: '글 중심 항목, 비교나 순서가 중요한 목록 (읽는 순서가 열 단위로 흩어져요)',
        notes: [
          'CSS column-count는 위에서 아래로 열을 채워 순서가 직관과 달라요. 순서가 중요하면 JS 배치나 열별 분배를 써요.',
          '이미지 종횡비를 미리 알려 로딩 중 점프를 막아요.',
          '키보드 탭 순서와 화면 순서를 맞춰요.'
        ],
        vs: { id: 'card-block', text: '카드·블록은 높이가 같고, 메이슨리는 높이가 달라 빈틈 없이 열마다 쌓아요. 매거진은 크기에 위계가 있어요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 3200,
          phases: [['차례로 쌓기', 200, 3200], ['유지', 3200, 4400]],
          alt: '높이가 다른 카드 아홉 개가 번호 순서대로 가장 짧은 열에 쌓여 빈틈 없이 채워지는 시연',
          html: K => {
            const hs = [2.2, 3.4, 2.6, 2.4, 2, 2.8, 2.6, 2.2, 2.4], colH = [1.2, 1.2, 1.2], xs = [1, 5.9, 10.8];
            const cards = hs.map((h, i) => {
              let c = 0; colH.forEach((v, j) => { if (v < colH[c] - 1e-6) c = j; });
              const y = colH[c]; colH[c] += h + .4;
              return `<div class="ms m${i}" style="left:${xs[c]}em;top:${y}em;width:4.3em;height:${h}em">` + K.wf('img', .2, .2, 3.9, h - .9) + K.wf('text', .3, h - .55, 3, .3) + `<b>${i + 1}</b></div>`;
            }).join('');
            return cards + tag(3.8, 9.1, '순서는 열이 아니라 가장 짧은 열 기준이에요', 'mt');
          }
        }
      },
      {
        id: 'hidden-nav', ko: '숨은 내비게이션', en: 'Hidden navigation', aka: ['햄버거 메뉴', '숨김 내비게이션', 'hamburger'],
        when: '콘텐츠가 주인공인 화면, 메뉴 항목이 많거나 사용 빈도가 낮을 때',
        avoid: '핵심 이동이 자주 일어나는 서비스 (숨기면 발견성과 이동률이 떨어져요)',
        notes: [
          '열기 버튼에 aria-expanded와 aria-controls를 달고, 열릴 때 포커스를 메뉴로 옮겨요.',
          'Esc로 닫혀요.',
          '스크롤 방향으로 숨기는 헤더는 위로 조금만 올려도 다시 나오게 해요.'
        ],
        vs: { topic: 'navigation', id: 'drawer', name: '드로어', text: '드로어는 모바일에서 같은 메뉴가 가장자리에서 밀려 나오는 형태이고, 숨은 내비게이션은 메뉴를 감추는 구성 방식 전체를 말해요.' },
        demo: {
          frame: 'browser', cycle: 5000, still: 2400,
          phases: [['클릭', 700, 1300], ['열림', 1300, 2600], ['Esc로 닫기', 2800, 3500]],
          alt: '메뉴가 보이지 않는 화면에서 햄버거 아이콘을 누르면 왼쪽에서 메뉴가 밀려 나오고, Esc 키를 누르면 다시 닫히는 시연',
          html: K => `<div class="hd"><span class="hb">${K.icon('menu')}</span>` + K.wf('title', 2.2, .35, 2, .4) + '</div>' +
            K.wf('title', 1, 2, 7, .7) + K.wf('img', 1, 3.2, 14, 3) + K.wf('text', 1, 6.7, 9, 1.8) +
            K.scrim('sc') + '<div class="pn">' + K.wf('title', 1, .5, 3, .45) +
            ['목록', '가족', '지난 기록', '설정', '도움말'].map((t, i) => `<span class="mi${i === 0 ? ' on' : ''}" style="top:${1.7 + i * 1.3}em"><b>${t}</b></span>`).join('') + '</div>' +
            '<b class="esc"><span>Esc</span></b>' + K.tap(.95, .55, 'tp') + K.cursor(9, 5, 'cur')
        }
      },
      {
        id: 'interactive', ko: '인터랙티브', en: 'Interactive', aka: ['상호작용', '조작형', 'scrollytelling'],
        when: '제품 설명을 단계별로 보여 줄 때, 계산기나 비교 도구, 데이터 탐색',
        avoid: '정보를 빨리 찾아야 하는 화면, 저사양 기기, 접근성 요구가 높은 공공 서비스',
        notes: [
          '모든 조작에 키보드 대안을 둬요.',
          '스크롤을 가로채지 않아요(scroll hijacking 금지).',
          '모션은 prefers-reduced-motion이면 끄거나 줄이고, 조작 결과는 URL이나 상태로 복구할 수 있게 둬요.'
        ],
        vs: { name: '모션 항목 전반', text: '움직임 자체의 종류는 모션 주제에서 다뤄요. 인터랙티브는 사용자의 조작에 따라 내용이 바뀌는 구성이에요.' },
        demo: {
          frame: 'browser', cycle: 6000, still: 2200,
          phases: [['선택', 500, 1000], ['갱신', 1000, 2500], ['선택', 2500, 3000], ['갱신', 3000, 4400]],
          alt: '인원 선택에서 2인을 고르면 오른쪽 미리보기에 묶음이 두 개로 늘고 금액이 바뀌고, 4인을 고르면 네 개로 늘며 금액이 다시 바뀐 뒤 1인으로 돌아가는 시연',
          html: K => K.wf('nav', 0, 0, 16, 1) + K.wf('title', 1, 1.7, 5, .5) +
            '<div class="sg"><i class="hl"></i><span style="left:1em"><b>1인</b></span><span style="left:3.1em"><b>2인</b></span><span style="left:5.2em"><b>4인</b></span></div>' +
            K.wf('text', 1, 4.6, 6, 1.4) +
            '<div class="pv"><i class="sq s1"></i><i class="sq s2"></i><i class="sq s3"></i><i class="sq s4"></i>' +
            '<em class="p1">예상 4,500원</em><em class="p2">예상 8,200원</em><em class="p3">예상 15,000원</em></div>' +
            K.tap(4, 3.45, 't1') + K.tap(6.1, 3.45, 't2') + K.tap(1.9, 3.45, 't3') + K.cursor(9, 6.5, 'cur')
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

/* two-column */
.t-web-layouts-two-column .lc{position:absolute;inset:0;animation-name:wlTcScroll}
.t-web-layouts-two-column .o1{animation-name:wlTcA}
.t-web-layouts-two-column .o2{animation-name:wlTcB}
.t-web-layouts-two-column .o3{animation-name:wlTcC}
${op('wlTcA', [[4, 9, 28, 33]])}${op('wlTcB', [[36, 41, 56, 61]])}${op('wlTcC', [[66, 70, 92, 96]])}
@keyframes wlTcScroll{0%,64%{transform:none}72%,88%{transform:translateY(-2.4em)}96%,100%{transform:none}}

/* split screen */
.t-web-layouts-split-screen .oL{animation-name:wlSpL}
.t-web-layouts-split-screen .oR{animation-name:wlSpR}
.t-web-layouts-split-screen .dm{animation-name:wlSpD}
.t-web-layouts-split-screen .k-wf-img{background-color:#c9cdc7}
${op('wlSpL', [[4, 9, 30, 35]])}${op('wlSpR', [[36, 41, 62, 67]])}${op('wlSpD', [[66, 72, 92, 97]])}

/* z shape and f shape share the path drawing */
.t-web-layouts-z-shape .zl,.t-web-layouts-f-shape .zl{position:absolute;inset:0;width:100%;height:100%;z-index:14;pointer-events:none}
.t-web-layouts-z-shape .zl path,.t-web-layouts-f-shape .zl path{fill:none;stroke:var(--a-brand);stroke-width:.12;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;opacity:.6}
.t-web-layouts-z-shape .zl path{animation-name:wlZDraw;animation-timing-function:linear}
.t-web-layouts-z-shape .gz{animation-name:wlZPath,wlZDotO;animation-timing-function:linear,linear}
.t-web-layouts-z-shape .m1{animation-name:wlZm1}.t-web-layouts-z-shape .m2{animation-name:wlZm2}.t-web-layouts-z-shape .m3{animation-name:wlZm3}.t-web-layouts-z-shape .m4{animation-name:wlZm4}
@keyframes wlZDraw{0%,8%{stroke-dashoffset:100;opacity:.6}32.1%{stroke-dashoffset:66.5}58.7%{stroke-dashoffset:29.6}80%,90%{stroke-dashoffset:0;opacity:.6}96%,100%{stroke-dashoffset:0;opacity:0}}
${K.kf.path('wlZPath', [[0, 0, 0], [8, 0, 0], [32.1, 10.2, 0], [58.7, 1.65, 7.3], [80, 10.7, 7.35], [100, 10.7, 7.35]])}
${op('wlZDotO', [[3, 6, 86, 92]])}
${op('wlZm1', [[8, 12, 90, 96]])}${op('wlZm2', [[32, 36, 90, 96]])}${op('wlZm3', [[58.7, 62.7, 90, 96]])}${op('wlZm4', [[80, 84, 90, 96]])}

/* asymmetrical */
.t-web-layouts-asymmetrical .gl{position:absolute;inset:0;z-index:8;opacity:0;animation-name:wlAsG}
.t-web-layouts-asymmetrical .gl .k-wf{background:#b9bdb7}
.t-web-layouts-asymmetrical .a1{animation-name:wlAs1}
.t-web-layouts-asymmetrical .a2{animation-name:wlAs2}
.t-web-layouts-asymmetrical .a3{animation-name:wlAsG}
${op('wlAs1', [[4, 9, 26, 31]])}${op('wlAs2', [[32, 37, 54, 59]])}${op('wlAsG', [[62, 68, 90, 96]])}

/* f shape */
.t-web-layouts-f-shape .zl path{animation-name:wlFDraw;animation-timing-function:linear}
.t-web-layouts-f-shape .gz{animation-name:wlFPath,wlFDotO;animation-timing-function:linear,linear}
.t-web-layouts-f-shape .sub{background:#b5bab4}
@keyframes wlFDraw{0%,8%{stroke-dashoffset:100;opacity:.6}28%,31%{stroke-dashoffset:54.4}47%,50%{stroke-dashoffset:23.9}75%,90%{stroke-dashoffset:0;opacity:.6}96%,100%{stroke-dashoffset:0;opacity:0}}
${K.kf.path('wlFPath', [[0, 0, 0], [8, 0, 0], [28, 10.5, 0], [31, 0, 1.2], [47, 7, 1.2], [50, 0, 1.2], [75, 0, 6.7], [100, 0, 6.7]])}
${op('wlFDotO', [[3, 6, 80, 90]])}

/* featured media */
.t-web-layouts-featured-media .gr{position:absolute;z-index:3;left:0;right:0;top:3.9em;height:3.5em;background:linear-gradient(rgba(18,18,20,0),rgba(18,18,20,.72));opacity:0;animation-name:wlFmGr}
.t-web-layouts-featured-media .ft{z-index:4;background:#f4f4f2;opacity:0;animation-name:wlFmT}
.t-web-layouts-featured-media .ft2{z-index:4;background:repeating-linear-gradient(#d8d9d5 0 .28em,transparent .28em .62em);opacity:0;animation-name:wlFmT}
.t-web-layouts-featured-media .pb{z-index:5;background:var(--a-brand);transform-origin:left;transform:scaleX(0);animation-name:wlFmPb}
.t-web-layouts-featured-media .pz{position:absolute;z-index:6;right:.8em;top:1.7em;width:1.5em;height:1.5em;border-radius:50%;background:rgba(18,18,20,.62);color:#fff;display:grid;place-items:center;opacity:0;animation-name:wlFmPz}
.t-web-layouts-featured-media .pz .k-i{width:.8em;height:.8em}
.t-web-layouts-featured-media .f1{animation-name:wlFm1}
.t-web-layouts-featured-media .f2{animation-name:wlFm2}
.t-web-layouts-featured-media .f3{animation-name:wlFm3}
${op('wlFm1', [[4, 9, 24, 29]])}${op('wlFmGr', [[28, 36, 90, 96]])}${op('wlFm2', [[32, 38, 56, 61]])}${op('wlFmPz', [[62, 67, 90, 96]])}${op('wlFm3', [[64, 69, 88, 94]])}
${K.kf.fade('wlFmT', [[34, 42, 90, 96]], .6)}
@keyframes wlFmPb{0%,60%{transform:scaleX(0)}90%{transform:scaleX(1)}96%,100%{transform:scaleX(1);opacity:0}}

/* card or block */
.t-web-layouts-card-block .cd{position:absolute;width:4.3em;height:3.5em;background:#fff;border:.07em solid var(--a-line);border-radius:.5em;box-shadow:0 .1em .3em rgba(20,20,22,.06);opacity:0}
.t-web-layouts-card-block .cd .k-wf-img{background-color:#d3d6d1}
${[0, 1, 2, 3, 4, 5].map(i => `.t-web-layouts-card-block .c${i}{animation-name:wlCb${i}}`).join('')}
${[0, 1, 2, 3, 4, 5].map(i => K.kf.fade('wlCb' + i, [[3 + i * 4, 9 + i * 4, 92, 97]], .6)).join('')}
.t-web-layouts-card-block .dm{animation-name:wlCbD}
.t-web-layouts-card-block .k1{animation-name:wlCbK}
.t-web-layouts-card-block .cur{animation-name:wlCbCur,wlCbCurO}
${op('wlCbD', [[34, 38, 54, 58]])}${op('wlCbK', [[68, 73, 90, 95]])}${op('wlCbCurO', [[60, 64, 90, 95]])}
${K.kf.path('wlCbCur', [[0, 0, 0], [62, 0, 0], [72, -6, -5.7], [100, -6, -5.7]])}

/* magazine */
.t-web-layouts-magazine .m1{animation-name:wlMg1}
.t-web-layouts-magazine .m2{animation-name:wlMg2}
.t-web-layouts-magazine .m3{animation-name:wlMg3}
${op('wlMg1', [[4, 9, 24, 29]])}${op('wlMg2', [[32, 37, 50, 55]])}${op('wlMg3', [[58, 63, 86, 91]])}

/* fixed nav */
.t-web-layouts-fixed-nav .pg{position:absolute;inset:0;animation-name:wlFnPg}
.t-web-layouts-fixed-nav .sh{position:absolute;z-index:5;left:0;right:0;top:.8em;height:.3em;background:linear-gradient(rgba(20,20,22,.22),rgba(20,20,22,0));opacity:0;animation-name:wlFnSh}
.t-web-layouts-fixed-nav .thumb{z-index:4;animation-name:wlFnTh;border-radius:.2em}
.t-web-layouts-fixed-nav .dm{animation-name:wlFnD}
.t-web-layouts-fixed-nav .fx{animation-name:wlFnT}
@keyframes wlFnPg{0%,16%{transform:none}70%,80%{transform:translateY(-5.6em)}96%,100%{transform:none}}
@keyframes wlFnTh{0%,16%{transform:none}70%,80%{transform:translateY(4.6em)}96%,100%{transform:none}}
${op('wlFnSh', [[22, 30, 86, 94]])}${op('wlFnD', [[2, 6, 14, 18]])}${op('wlFnT', [[34, 40, 78, 84]])}

/* masonry */
.t-web-layouts-masonry .ms{position:absolute;background:#fff;border:.07em solid var(--a-line);border-radius:.4em;opacity:0}
.t-web-layouts-masonry .ms b{position:absolute;right:.35em;top:.3em;width:1em;height:1em;border-radius:50%;background:var(--a-dark);color:#fff;display:grid;place-items:center;font-size:.55em;font-weight:700;line-height:1}
.t-web-layouts-masonry .ms b{font-size:.6em}
.t-web-layouts-masonry .ms .k-wf-img{background-color:#d3d6d1}
${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `.t-web-layouts-masonry .m${i}{animation-name:wlMs${i}}`).join('')}
${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => K.kf.fade('wlMs' + i, [[3 + i * 3.4, 8 + i * 3.4, 92, 97]], .8)).join('')}
.t-web-layouts-masonry .mt{animation-name:wlMsT}
${op('wlMsT', [[40, 46, 88, 94]])}

/* hidden nav */
.t-web-layouts-hidden-nav .hd{position:absolute;z-index:4;left:0;right:0;top:0;height:1.1em;background:var(--a-bg);border-bottom:.07em solid var(--a-line)}
.t-web-layouts-hidden-nav .hb{position:absolute;left:.4em;top:.1em;width:1.1em;height:.9em;display:grid;place-items:center}
.t-web-layouts-hidden-nav .hb .k-i{width:.8em;height:.8em}
.t-web-layouts-hidden-nav .sc{animation-name:wlHnSc;z-index:8}
.t-web-layouts-hidden-nav .pn{position:absolute;z-index:11;left:0;top:0;width:6.2em;height:100%;background:#fff;box-shadow:.3em 0 1em rgba(10,10,12,.22);transform:translateX(-101%);animation-name:wlHnPn}
.t-web-layouts-hidden-nav .mi{position:absolute;left:.7em;right:.7em;height:1em;padding:0 .5em;border-radius:.3em;display:flex;align-items:center}
.t-web-layouts-hidden-nav .mi b{font-size:.6em;font-weight:500}
.t-web-layouts-hidden-nav .mi.on{background:var(--a-soft)}
.t-web-layouts-hidden-nav .mi.on b{font-weight:700}
.t-web-layouts-hidden-nav .esc{position:absolute;z-index:22;left:9em;top:4.5em;opacity:0;animation-name:wlHnEsc}
.t-web-layouts-hidden-nav .esc span{display:block;font-size:.6em;font-weight:700;padding:.35em .9em;border-radius:.4em;background:#fff;color:var(--a-ink);box-shadow:0 .15em 0 #b5b6b1,0 .3em .6em rgba(0,0,0,.3);border:.07em solid #c8c8c3}
.t-web-layouts-hidden-nav .tp{animation-name:wlHnTap}
.t-web-layouts-hidden-nav .cur{animation-name:wlHnCur,wlHnCurO}
${op('wlHnSc', [[22, 32, 66, 74]])}${op('wlHnEsc', [[54, 58, 66, 70]])}${op('wlHnCurO', [[1, 5, 26, 30]])}
@keyframes wlHnPn{0%,22%{transform:translateX(-101%)}32%,66%{transform:none}74%,100%{transform:translateX(-101%)}}
${K.kf.tap('wlHnTap', 22)}
${K.kf.path('wlHnCur', [[0, 0, 0], [4, 0, 0], [20, -8.1, -4.45], [100, -8.1, -4.45]])}

/* interactive */
.t-web-layouts-interactive .sg{position:absolute;left:0;top:0;width:100%;height:100%}
.t-web-layouts-interactive .sg>span{position:absolute;top:3em;width:1.8em;height:.9em;display:grid;place-items:center;z-index:2}
.t-web-layouts-interactive .sg>span b{font-size:.62em;font-weight:700;line-height:1}
.t-web-layouts-interactive .hl{position:absolute;left:1em;top:3em;width:1.8em;height:.9em;border-radius:.3em;background:var(--a-brand);animation-name:wlInHl;z-index:1}
.t-web-layouts-interactive .sg:before{content:"";position:absolute;left:.85em;top:2.85em;width:6.3em;height:1.2em;border-radius:.4em;background:var(--a-soft)}
.t-web-layouts-interactive .pv{position:absolute;left:8em;top:1.6em;width:7em;height:6.5em;border-radius:.5em;background:var(--a-soft)}
.t-web-layouts-interactive .sq{position:absolute;width:2.5em;height:2.2em;border-radius:.35em;background:#c9cdc7;border:.07em solid #aeb2ac;opacity:0}
.t-web-layouts-interactive .s1{left:.8em;top:.8em;opacity:1}
.t-web-layouts-interactive .s2{left:3.7em;top:.8em;animation-name:wlInS2}
.t-web-layouts-interactive .s3{left:.8em;top:3.2em;animation-name:wlInS3}
.t-web-layouts-interactive .s4{left:3.7em;top:3.2em;animation-name:wlInS3}
.t-web-layouts-interactive .pv em{position:absolute;left:.8em;bottom:.5em;font-style:normal;font-size:.62em;font-weight:700;opacity:0}
.t-web-layouts-interactive .p1{animation-name:wlInP1}
.t-web-layouts-interactive .p2{animation-name:wlInP2}
.t-web-layouts-interactive .p3{animation-name:wlInP3}
.t-web-layouts-interactive .t1{animation-name:wlInT1}
.t-web-layouts-interactive .t2{animation-name:wlInT2}
.t-web-layouts-interactive .t3{animation-name:wlInT3}
.t-web-layouts-interactive .cur{animation-name:wlInCur,wlInCurO}
@keyframes wlInHl{0%,14%{transform:none}17%,44%{transform:translateX(2.1em)}47%,74%{transform:translateX(4.2em)}77%,100%{transform:none}}
${op('wlInS2', [[14, 17, 74, 77]])}${op('wlInS3', [[44, 47, 74, 77]])}
${op('wlInP1', [[14, 17, 74, 77]], 1)}${op('wlInP2', [[14, 17, 44, 47]])}${op('wlInP3', [[44, 47, 74, 77]])}
${K.kf.tap('wlInT1', 14)}${K.kf.tap('wlInT2', 44)}${K.kf.tap('wlInT3', 74)}
${K.kf.path('wlInCur', [[0, 0, 0], [10, -5, -3.05], [34, -5, -3.05], [40, -2.9, -3.05], [64, -2.9, -3.05], [70, -7.1, -3.05], [94, -7.1, -3.05], [100, -7.1, -3.05]])}
${op('wlInCurO', [[2, 6, 90, 95]])}
`
  });
})();
