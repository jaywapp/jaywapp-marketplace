/* Topic: 화면 이동 (navigation). Reference: plugins/design-master/references/navigation.md
   Every selector starts with .t-navigation-<element>. Keyframes use the nv prefix. */
(function () {
  const P = 'navigation';
  const op = (n, wins, base = 0) => {
    const f = [`0%{opacity:${base}}`];
    wins.forEach(([a, b, c, d]) => f.push(`${a}%{opacity:${base}}${b}%{opacity:${1 - base}}${c}%{opacity:${1 - base}}${d}%{opacity:${base}}`));
    f.push(`100%{opacity:${base}}`);
    return `@keyframes ${n}{${f.join('')}}`;
  };
  /* two-value keyframes: value `on` inside the listed spans, `off` elsewhere. spans: [[from, to]] fully-on ranges; 2% ramps */
  const tg = (n, spans, on, off) => {
    const f = [];
    spans.forEach(([a, b], i) => {
      if (a <= 0) f.push(`0%,${b}%{${on}}`);
      else { f.push(`${i === 0 ? '0%,' : ''}${a - 2}%{${off}}`); f.push(`${a}%,${b}%{${on}}`); }
      if (b < 100) f.push(`${b + 2}%{${off}}`);
    });
    if (spans[spans.length - 1][1] < 100) f.push(`100%{${off}}`);
    return `@keyframes ${n}{${f.join('')}}`;
  };
  const tag = (x, y, t, c) => `<b class="tg ${c}" style="left:${x}em;top:${y}em"><span>${t}</span></b>`;
  const IDS = ['tab-bar', 'top-tabs', 'drawer', 'breadcrumb', 'sticky-header', 'fab', 'pagination', 'infinite-scroll', 'back'];
  const sel = r => IDS.map(i => `.t-${P}-${i} ${r}`).join(',');
  const R = id => `.t-${P}-${id}`;

  UIGuide.registerTopic({
    id: P,
    intro: '사용자가 화면 사이를 옮겨 다니는 방법이에요. 이동하는 범위가 앱 전체인지, 한 화면 안인지, 목록의 다음 조각인지로 고릅니다.',
    elements: [
      {
        id: 'tab-bar', ko: '하단 탭바', en: 'Tab bar', aka: ['탭 바', '하단 메뉴', 'bottom navigation'],
        when: '서로 대등하고 자주 오가는 주요 화면이 3~5개일 때',
        avoid: '목적지가 6개 이상이거나 사용 빈도 차가 클 때 (더보기 탭이나 드로어), 순서가 있는 흐름 (스테퍼)',
        notes: [
          '항목은 4~5개, 터치 영역은 최소 48x48px, 아이콘과 라벨을 함께 써요.',
          '활성 상태는 색 하나에 의존하지 않고 채움이나 굵기, 표시 막대를 더해요.',
          '하단 안전 영역(env(safe-area-inset-bottom))을 비우고, 탭을 다시 누르면 맨 위로 스크롤하는 관례가 있어요.'
        ],
        vs: { name: '상단 탭', text: '상단 탭은 한 화면 안에서 같은 종류의 보기를 바꿔요. 하단 탭바는 앱 전체의 최상위 목적지를 오가요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 1800,
          phases: [['탭', 600, 1100], ['머묾', 1100, 2000], ['탭', 2000, 2500], ['머묾', 2500, 3500], ['탭', 3500, 4000], ['머묾', 4000, 5800]],
          alt: '화면 아래 탭바에서 가족 탭을 누르면 가족 화면으로, 설정 탭을 누르면 설정 화면으로 바뀌며 눌린 탭에 막대와 진한 색이 옮겨 가다가 다시 목록 탭으로 돌아오는 시연',
          html: K => `<div class="v v1">${K.app.status()}${K.app.bar('이번 주 장보기', ['search'])}${K.app.list(0, 6)}</div>` +
            `<div class="v v2">${K.app.status()}${K.app.bar('가족', ['plus'])}<div class="mbs">` +
            [['엄마', '관리자'], ['아빠', '편집'], ['나', '편집'], ['동생', '보기']].map(([n, r]) => `<div class="mb"><i class="av"></i><span>${n}</span><em>${r}</em></div>`).join('') + '</div></div>' +
            `<div class="v v3">${K.app.status()}${K.app.bar('설정', [])}<div class="fm">${K.app.field('가족 이름', '우리 집 장보기')}${K.app.field('알림', '매일 오후 6시')}${K.app.field('정렬', '매장 동선순')}</div></div>` +
            K.app.tabs(0) + K.tap(8, 19.9, 'tp1') + K.tap(13.33, 19.9, 'tp2') + K.tap(2.67, 19.9, 'tp3')
        }
      },
      {
        id: 'top-tabs', ko: '상단 탭', en: 'Top tabs', aka: ['탭', '필터 탭', 'tabs'],
        when: '한 주제의 하위 보기(전체, 진행 중, 완료)를 빠르게 바꿀 때',
        avoid: '앱 전체 이동 (하단 탭바), 탭 항목이 7개를 넘을 때, 상호 배타적 설정값 선택 (세그먼트)',
        notes: [
          '라벨은 짧게 1~2단어로 써요.',
          '활성 탭 아래 2~3px 밑줄과 글자 굵기 변화를 같이 써요.',
          '가로 스크롤 탭은 잘린 다음 항목이 보이게 하고, ARIA는 role="tablist", tab, tabpanel과 좌우 화살표 키예요.'
        ],
        vs: { name: '세그먼트 컨트롤', text: '세그먼트는 서로 배타적인 설정값을 고르는 작은 컨트롤이고, 상단 탭은 같은 종류 콘텐츠의 보기를 나눠요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 1800,
          phases: [['탭', 600, 1100], ['머묾', 1100, 2100], ['탭', 2000, 2500], ['머묾', 2500, 3500], ['탭', 3500, 4000], ['머묾', 4000, 5800]],
          alt: '앱 바 아래 상단 탭에서 진행 중을 누르면 밑줄이 옮겨 가며 아직 안 산 항목만, 완료를 누르면 산 항목만 보이고, 전체를 누르면 모두 다시 보이는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', []) +
            '<div class="tt"><span><b>전체</b></span><span><b>진행 중</b></span><span><b>완료</b></span><i class="ul"></i></div>' +
            '<div class="lw">' +
            `<div class="ly la">${K.app.rows(0, 5, { checked: [1, 3] })}</div>` +
            `<div class="ly lb">${K.app.row(0)}${K.app.row(2)}${K.app.row(4)}</div>` +
            `<div class="ly lc">${K.app.row(1, { checked: true })}${K.app.row(3, { checked: true })}</div></div>` +
            K.tap(8, 4.6, 'tp1') + K.tap(13.33, 4.6, 'tp2') + K.tap(2.67, 4.6, 'tp3')
        }
      },
      {
        id: 'drawer', ko: '드로어', en: 'Navigation drawer', aka: ['사이드 메뉴', '햄버거 메뉴', 'side drawer'],
        when: '메뉴 항목이 많고 대부분 자주 쓰지 않을 때, 계정과 설정을 모아 둘 때',
        avoid: '핵심 목적지를 숨기고 싶지 않을 때 (하단 탭바가 나아요)',
        notes: [
          '폭은 화면의 80% 이하, 최대 약 320px로 해요.',
          '뒤 배경에 어두운 스크림을 깔고 눌러 닫게 해요.',
          '열리면 포커스를 안으로 옮기고 Esc나 뒤로 가기로 닫혀요. 현재 위치 항목을 강조해요.'
        ],
        vs: { topic: 'screen-layouts', id: 'sidebar', name: '사이드바 레이아웃', text: '사이드바는 같은 메뉴가 항상 펼쳐진 형태이고, 드로어는 눌러야 밀려 나와요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2200,
          phases: [['열기', 500, 1200], ['머묾', 1200, 3000], ['닫기', 3100, 3700]],
          alt: '앱 바의 메뉴 아이콘을 누르면 왼쪽에서 메뉴 패널이 밀려 나오고 뒤 화면이 어두워지고, 어두운 부분을 누르면 패널이 다시 들어가는 시연',
          html: K => K.app.status() + `<div class="k-ab"><span class="k-ib k-ib-menu">${K.icon('menu')}</span><b>이번 주 장보기</b><span class="k-ib">${K.icon('search')}</span></div>` +
            K.app.list(0, 5) + K.scrim('sc') +
            '<div class="dw"><div class="hd"><i class="av"></i><span class="tx"><b>우리 가족</b><em>가족 4명</em></span></div>' +
            ['이번 주 목록', '지난 목록', '가족 관리', '설정', '도움말'].map((t, i) => `<span class="di${i === 0 ? ' on' : ''}" style="top:${5.6 + i * 2.2}em"><b>${t}</b></span>`).join('') + '</div>' +
            K.tap(1.9, 2.5, 'tp1') + K.tap(14.6, 11, 'tp2')
        }
      },
      {
        id: 'breadcrumb', ko: '브레드크럼', en: 'Breadcrumb', aka: ['경로 표시', 'path', '빵부스러기'],
        when: '계층이 깊은 웹사이트(문서, 쇼핑, 관리자)에서 위치 파악과 상위 이동이 필요할 때',
        avoid: '계층이 2단계 이하이거나 계층이 없는 앱 흐름, 모바일 앱의 기본 이동 (뒤로 가기가 대신해요)',
        notes: [
          '현재 페이지는 링크가 아닌 글자로 두고 aria-current="page"를 달아요.',
          '경로가 길면 가운데를 줄이고(…) 첫 단계와 마지막 단계는 남겨요.',
          '모바일에서는 바로 위 한 단계만 ‘‹ 상위’로 줄이는 방법이 있어요.'
        ],
        vs: { id: 'back', text: '뒤로 가기는 직전 화면 하나로 돌아가요. 브레드크럼은 홈에서 지금까지의 경로 전체를 보여 줘요.' },
        demo: {
          frame: 'browser', cycle: 6000, still: 800,
          phases: [['경로 보기', 0, 1300], ['클릭', 1200, 1800], ['상위로 이동', 1800, 3700], ['좁은 화면', 3900, 5400]],
          alt: '홈, 요리, 국물 요리, 된장찌개 경로에서 국물 요리를 누르면 경로가 국물 요리까지로 줄고 화면이 국물 요리 목록으로 바뀌고, 좁은 화면에서는 한 단계 위만 남은 ‘‹ 요리’로 줄어드는 시연',
          html: K => {
            const row = (items, cls) => `<div class="bc ${cls}">` + items.map(([t, w, cur]) => `<span class="cr${cur ? ' now' : ''}" style="width:${w}em"><b>${t}</b></span>`).join('') + '</div>';
            const ch = '<span class="sp"></span>';
            const link = (t, w) => [t, w, 0];
            const A = row([link('홈', 1.1), link('요리', 1.5), link('국물 요리', 2.9), ['된장찌개', 3, 1]], 'ba');
            return K.wf('nav', 0, 0, 16, .8) +
              A.replace(/<\/span><span class="cr/g, `</span>${ch}<span class="cr`) +
              row([link('홈', 1.1), link('요리', 1.5), ['국물 요리', 2.9, 1]], 'bb').replace(/<\/span><span class="cr/g, `</span>${ch}<span class="cr`) +
              row([link('‹ 요리', 2.2)], 'bm') +
              '<div class="pa"><b class="h1">된장찌개</b>' + K.wf('img', 1, 3.4, 6, 4.4) + K.wf('text', 7.6, 3.4, 7, 1.6) + K.wf('btn', 7.6, 5.6, 3, .8) + '</div>' +
              '<div class="pb"><b class="h1">국물 요리</b>' + [0, 1, 2].map(i => K.wf('img', 1 + i * 4.9, 3.4, 4.3, 3) + K.wf('title', 1 + i * 4.9, 6.6, 3, .35) + K.wf('text', 1 + i * 4.9, 7.3, 4.3, .5)).join('') + '</div>' +
              tag(3.8, 2.15, '좁은 화면은 한 단계 위만', 'tm') + K.tap(6.65, 1.65, 'tp') + K.cursor(11, 6, 'cur');
          }
        }
      },
      {
        id: 'sticky-header', ko: '고정 헤더', en: 'Sticky header', aka: ['상단 바 고정', 'sticky app bar'],
        when: '긴 목록이나 문서에서 검색, 필터, 뒤로 가기에 항상 접근해야 할 때',
        avoid: '화면이 낮아 본문이 가려질 때 (스크롤을 내릴 때만 숨기는 방식을 고려해요)',
        notes: [
          '높이는 모바일에서 44~56px 안팎이에요.',
          '스크롤 전엔 투명, 스크롤 후엔 배경과 구분선이나 약한 그림자를 더하는 전환을 주기도 해요.',
          '앵커 이동 시 scroll-margin-top을 쓰고 상태 표시줄 영역을 비워요.'
        ],
        vs: { topic: 'web-layouts', id: 'fixed-nav', name: '고정 내비게이션', text: '고정 내비게이션은 웹 사이트 전역 메뉴 관점이고, 고정 헤더는 화면 위 상단 바 자체의 동작이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['스크롤', 480, 1560], ['고정 유지', 1560, 3300], ['되돌림', 3600, 4800]],
          alt: '목록을 위로 밀어 올리면 항목들이 앱 바 뒤로 지나가는 동안 앱 바는 제자리에 남아 그림자가 생기고, 다시 내리면 그림자가 사라지는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['search', 'more']) + K.app.list(0, 8, { cls: 'sc' }) +
            K.dim({ x: 15.2, y: 1.3, len: 2.4, dir: 'v', label: '약 56px', side: 'left', cls: 'dm' }) +
            K.finger(8, 16, 'fg1') + K.finger(8, 9, 'fg2')
        }
      },
      {
        id: 'fab', ko: '플로팅 버튼', en: 'Floating action button', aka: ['FAB', '플로팅 액션 버튼', '추가 버튼'],
        when: '새로 만들기, 글쓰기, 추가처럼 화면에서 가장 자주 하는 단일 행동',
        avoid: '화면에 주 행동이 여러 개일 때, 하단 콘텐츠를 가릴 때, 삭제 같은 파괴적 행동',
        notes: [
          '지름은 56px(작은 것 40px), 우하단에서 16px 안쪽이에요.',
          '탭바와 겹치면 탭바 위로 올리고, 스크롤을 내리면 줄이거나 숨기고 올리면 보여요.',
          '아이콘만 쓸 때 aria-label이 필수예요. 목록 끝 항목을 가리지 않게 하단 패딩을 더해요.'
        ],
        vs: { topic: 'confusable-pairs', id: 'fab-iconbutton', name: 'FAB vs 아이콘 버튼', text: '아이콘 버튼은 앱 바 안의 보조 행동이고, FAB은 화면의 주 행동 하나를 콘텐츠 위에 띄워 가리켜요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 400,
          phases: [['내리면 숨김', 480, 1560], ['올리면 보임', 2160, 3000], ['누르기', 3600, 4200], ['추가됨', 4200, 5200]],
          alt: '목록을 아래로 스크롤하면 오른쪽 아래 추가 버튼이 아래로 숨고, 다시 올리면 나타나고, 버튼을 누르면 목록 맨 위에 새 항목이 생겼다가 정리되는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['search']) +
            `<div class="lw"><div class="nr">${K.app.row(0, { item: ['당근 1봉', '1봉'], cls: 'nrw' })}</div>${K.app.list(0, 8)}</div>` +
            K.app.fab('fb') + K.finger(8, 15, 'fg1') + K.finger(8, 9, 'fg2') + K.tap(13.6, 18.93, 'tp') +
            tag(2.8, 19, '내리면 숨어요', 't1') + tag(2.4, 19, '올리면 다시 보여요', 't2')
        }
      },
      {
        id: 'pagination', ko: '페이지네이션', en: 'Pagination', aka: ['페이지 번호', '페이징', 'paging'],
        when: '원하는 위치로 돌아가거나 위치 감각이 중요한 검색 결과, 관리자 표, 푸터에 도달해야 하는 페이지',
        avoid: '짧은 목록, 모바일 피드 (더 보기나 무한 스크롤)',
        notes: [
          '터치 영역은 44px 이상으로 하고 현재 페이지를 표시해요.',
          '처음과 끝 이동을 두고, 페이지 수가 많으면 생략 표기(1 … 5 6 7 … 20)를 써요.',
          '페이지는 URL에 반영해 새로고침과 공유가 되게 하고, nav에 aria-label="페이지"를 달아요.'
        ],
        vs: { id: 'infinite-scroll', text: '무한 스크롤은 위치 감각과 푸터 접근이 약해요. 페이지네이션은 번호로 정확한 자리에 돌아와요.' },
        demo: {
          frame: 'browser', cycle: 6000, still: 1000,
          phases: [['번호 클릭', 700, 1200], ['페이지 3', 1200, 3500], ['처음으로', 3500, 4200]],
          alt: '검색 결과 아래 페이지 번호에서 3을 누르면 현재 표시가 3으로 옮겨 가고 목록이 바뀌며 주소의 page 값도 3이 되고, 다시 1을 눌러 처음으로 돌아가는 시연',
          html: K => {
            const rows = (cls, ws) => `<div class="ly ${cls}">` + ws.map((w, i) => K.wf('img', 1, 2.4 + i * 1.4, 1.3, 1) + K.wf('title', 2.7, 2.5 + i * 1.4, w[0], .3) + K.wf('text', 2.7, 2.95 + i * 1.4, w[1], .3)).join('') + '</div>';
            const slots = [['chevL', 5], ['1', 6.1], ['2', 7.2], ['3', 8.3], ['…', 9.4], ['20', 10.5], ['chevR', 11.6]];
            return K.wf('nav', 0, 0, 16, .8) + K.wf('title', 1, 1.3, 4, .5) +
              '<b class="uc"><span class="u1">?page=1</span><span class="u3">?page=3</span></b>' +
              rows('p1', [[5, 9], [4, 11], [6, 8], [4.5, 10]]) + rows('p3', [[3.5, 10], [6, 7], [5, 11], [4, 9]]) +
              slots.map(([t, x]) => `<span class="pg" style="left:${x}em"><b>${t.startsWith('chev') ? K.icon(t) : t}</b></span>`).join('') +
              '<i class="cr"><b class="c1">1</b><b class="c3">3</b></i>' +
              K.tap(8.8, 8.8, 't1') + K.tap(6.6, 8.8, 't2') + K.cursor(13, 6, 'cur');
          }
        }
      },
      {
        id: 'infinite-scroll', ko: '무한 스크롤', en: 'Infinite scroll', aka: ['무한 목록', '이어 불러오기', 'endless scroll'],
        when: '소셜 피드, 사진 모음처럼 끝이 없고 훑어 보는 콘텐츠',
        avoid: '푸터나 특정 항목을 찾아야 할 때, 목적이 분명한 검색, 항목 위치로 돌아와야 하는 화면',
        notes: [
          '뒤로 가기 후 스크롤 위치와 불러온 목록을 복원해요.',
          '불러오는 중에는 하단에 스켈레톤이나 스피너, 실패 시 재시도 버튼을 둬요.',
          '일정 개수마다 ‘더 보기’ 버튼으로 끊으면 푸터에 닿을 수 있어요. 가상화로 DOM 수를 제한해요.'
        ],
        vs: { id: 'pagination', text: '페이지네이션은 번호로 위치를 알려 줘요. 무한 스크롤은 위치 감각과 푸터 접근이 약해요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2200,
          phases: [['스크롤', 480, 1560], ['불러오는 중', 1600, 2760], ['이어 붙음', 2760, 3700], ['스크롤', 3720, 4700]],
          alt: '목록을 위로 밀어 끝에 가까워지면 아래에 스피너가 돌며 불러오는 중이 되고, 새 항목들이 차례로 이어 붙은 뒤 계속 스크롤되는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['search']) +
            K.app.list(0, 8, {
              cls: 'lw', after: '<div class="ld"><svg class="spn" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg><em>불러오는 중</em></div>' +
                [['고등어', '2마리'], ['감자', '5개'], ['식빵', '1봉'], ['요거트', '4개']].map((it, i) => K.app.row(8 + i, { item: it, cls: 'nw nw' + (i + 1) })).join('')
            }) +
            K.finger(8, 15, 'fg1') + K.finger(8, 15, 'fg2') + tag(3.4, 19.7, '끝에 가까워지면 자동으로', 'tn')
        }
      },
      {
        id: 'back', ko: '뒤로 가기', en: 'Back navigation', aka: ['뒤로', 'back button', '이전 화면'],
        when: '푸시로 들어온 모든 하위 화면',
        avoid: '최상위 탭 화면에는 두지 않아요. 입력 도중 이탈이 데이터 손실을 일으키면 확인 없이 돌아가지 않아요.',
        notes: [
          '아이콘 터치 영역은 44~48px로 하고 위치는 왼쪽 위예요.',
          'aria-label은 ‘이전’처럼 달고, 시스템 뒤로 가기와 같은 결과를 내야 해요.',
          '저장하지 않은 변경이 있으면 폐기 확인을 띄워요.'
        ],
        vs: { id: 'breadcrumb', text: '브레드크럼은 홈에서 지금까지의 경로 전체를 보여 줘요. 뒤로 가기는 직전 화면 하나로 돌아가요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2200,
          phases: [['들어감', 600, 1320], ['머묾', 1320, 3600], ['뒤로', 3700, 4400]],
          alt: '목록에서 두부를 누르면 상세 화면이 오른쪽에서 밀려 들어오고, 왼쪽 위 뒤로 가기 화살표를 누르면 상세 화면이 오른쪽으로 빠지며 목록으로 돌아오는 시연',
          html: K => `<div class="s0">${K.app.screen({ icons: ['share', 'more'] })}</div>` +
            `<div class="s1">${K.app.status()}${K.app.bar('두부', ['more'], { back: true })}<div class="fm">${K.app.field('수량', '2모')}${K.app.field('메모', '부침용으로 사요')}${K.app.field('담은 사람', '엄마')}</div></div>` +
            K.tap(8, 9.45, 'tp1') + K.tap(1.4, 2.5, 'tp2')
        }
      }
    ],
    css: K => `
/* shared */
${sel('.tg')}{position:absolute;z-index:22;opacity:0;pointer-events:none}
${sel('.tg span')}{display:block;font-size:.52em;font-weight:700;padding:.3em .8em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;line-height:1.3}
${sel('.k-sb')}{position:relative;z-index:3;background:var(--a-bg)}

/* tab bar */
${R('tab-bar')} .v{position:absolute;inset:0}
${R('tab-bar')} .v1{animation-name:nvTbV1}.t-navigation-tab-bar .v2{opacity:0;animation-name:nvTbV2}.t-navigation-tab-bar .v3{opacity:0;animation-name:nvTbV3}
${R('tab-bar')} .mbs{position:absolute;left:0;right:0;top:3.7em}
${R('tab-bar')} .mb{height:2.5em;display:flex;align-items:center;gap:.7em;padding:0 1em;border-bottom:1px solid var(--a-line)}
${R('tab-bar')} .av{width:1.5em;height:1.5em;border-radius:50%;background:#d8cfc6}
${R('tab-bar')} .mb span{font-size:.78em;margin-right:auto}
${R('tab-bar')} .mb em{font-style:normal;font-size:.6em;color:var(--a-mut)}
${R('tab-bar')} .fm{position:absolute;left:1em;right:1em;top:4.8em;display:flex;flex-direction:column;gap:1em}
${R('tab-bar')} .k-tab{position:relative}
${R('tab-bar')} .k-tab::before{content:"";position:absolute;top:0;left:50%;width:1.6em;height:.14em;margin-left:-.8em;border-radius:.1em;background:var(--a-brand);opacity:0}
${R('tab-bar')} .k-tab-0{animation-name:nvTbC0}.t-navigation-tab-bar .k-tab-1{animation-name:nvTbC1}.t-navigation-tab-bar .k-tab-2{animation-name:nvTbC2}
${R('tab-bar')} .k-tab-0::before{animation-name:nvTbI0}.t-navigation-tab-bar .k-tab-1::before{animation-name:nvTbI1}.t-navigation-tab-bar .k-tab-2::before{animation-name:nvTbI2}
${R('tab-bar')} .tp1{animation-name:nvTbT1}.t-navigation-tab-bar .tp2{animation-name:nvTbT2}.t-navigation-tab-bar .tp3{animation-name:nvTbT3}
${op('nvTbV1', [[12, 14, 60, 62]], 1)}${op('nvTbV2', [[12, 14, 36, 38]])}${op('nvTbV3', [[36, 38, 60, 62]])}
${tg('nvTbC0', [[0, 12], [62, 100]], 'color:var(--a-ink)', 'color:var(--a-mut)')}
${tg('nvTbC1', [[14, 36]], 'color:var(--a-ink)', 'color:var(--a-mut)')}
${tg('nvTbC2', [[38, 60]], 'color:var(--a-ink)', 'color:var(--a-mut)')}
${tg('nvTbI0', [[0, 12], [62, 100]], 'opacity:1', 'opacity:0')}${tg('nvTbI1', [[14, 36]], 'opacity:1', 'opacity:0')}${tg('nvTbI2', [[38, 60]], 'opacity:1', 'opacity:0')}
${K.kf.tap('nvTbT1', 12)}${K.kf.tap('nvTbT2', 36)}${K.kf.tap('nvTbT3', 60)}

/* top tabs */
${R('top-tabs')} .tt{position:absolute;left:0;right:0;top:3.7em;height:1.8em;display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--a-line);background:var(--a-bg);z-index:2}
${R('top-tabs')} .tt span{display:grid;place-items:center}
${R('top-tabs')} .tt b{font-size:.74em;font-weight:500;color:var(--a-mut)}
${R('top-tabs')} .tt span:nth-child(1) b{animation-name:nvTtB0}.t-navigation-top-tabs .tt span:nth-child(2) b{animation-name:nvTtB1}.t-navigation-top-tabs .tt span:nth-child(3) b{animation-name:nvTtB2}
${R('top-tabs')} .ul{position:absolute;left:1.17em;bottom:-.07em;width:3em;height:.14em;border-radius:.1em;background:var(--a-brand);animation-name:nvTtUl}
${R('top-tabs')} .lw{position:absolute;left:0;right:0;top:5.5em}
${R('top-tabs')} .ly{position:absolute;left:0;right:0;top:0}
${R('top-tabs')} .la{animation-name:nvTtLa}.t-navigation-top-tabs .lb{opacity:0;animation-name:nvTtLb}.t-navigation-top-tabs .lc{opacity:0;animation-name:nvTtLc}
${R('top-tabs')} .tp1{animation-name:nvTtT1}.t-navigation-top-tabs .tp2{animation-name:nvTtT2}.t-navigation-top-tabs .tp3{animation-name:nvTtT3}
${tg('nvTtB0', [[0, 12], [62, 100]], 'color:var(--a-ink);font-weight:800', 'color:var(--a-mut);font-weight:500')}
${tg('nvTtB1', [[14, 36]], 'color:var(--a-ink);font-weight:800', 'color:var(--a-mut);font-weight:500')}
${tg('nvTtB2', [[38, 60]], 'color:var(--a-ink);font-weight:800', 'color:var(--a-mut);font-weight:500')}
@keyframes nvTtUl{0%,12%{transform:none}16%,36%{transform:translateX(5.33em)}40%,60%{transform:translateX(10.67em)}64%,100%{transform:none}}
${op('nvTtLa', [[12, 14, 60, 62]], 1)}${op('nvTtLb', [[12, 14, 36, 38]])}${op('nvTtLc', [[36, 38, 60, 62]])}
${K.kf.tap('nvTtT1', 12)}${K.kf.tap('nvTtT2', 36)}${K.kf.tap('nvTtT3', 60)}

/* drawer */
${R('drawer')} .sc{animation-name:nvDwSc}
${R('drawer')} .dw{position:absolute;z-index:11;left:0;top:0;bottom:0;width:12.8em;background:#fff;box-shadow:.3em 0 1.2em rgba(10,10,12,.25);transform:translateX(-101%);animation-name:nvDwIn}
${R('drawer')} .hd{position:absolute;left:1.2em;top:2em;display:flex;align-items:center;gap:.8em}
${R('drawer')} .av{width:2.4em;height:2.4em;border-radius:50%;background:#d8cfc6}
${R('drawer')} .tx{display:flex;flex-direction:column;gap:.15em}
${R('drawer')} .tx b{font-size:.84em}
${R('drawer')} .tx em{font-style:normal;font-size:.56em;color:var(--a-mut)}
${R('drawer')} .di{position:absolute;left:.7em;right:.7em;height:2em;padding:0 .7em;border-radius:.5em;display:flex;align-items:center}
${R('drawer')} .di b{font-size:.74em;font-weight:500}
${R('drawer')} .di.on{background:var(--a-soft)}.t-navigation-drawer .di.on b{font-weight:800}
${R('drawer')} .di.on::before{content:"";position:absolute;left:0;top:.4em;bottom:.4em;width:.16em;border-radius:.1em;background:var(--a-brand)}
${R('drawer')} .tp1{animation-name:nvDwT1}.t-navigation-drawer .tp2{animation-name:nvDwT2}
${op('nvDwSc', [[12, 22, 64, 74]])}
@keyframes nvDwIn{0%,12%{transform:translateX(-101%)}22%,64%{transform:none}74%,100%{transform:translateX(-101%)}}
${K.kf.tap('nvDwT1', 8)}${K.kf.tap('nvDwT2', 60)}

/* breadcrumb */
${R('breadcrumb')} .bc{position:absolute;left:1em;top:1.1em;display:flex;align-items:center;height:1em;opacity:0}
${R('breadcrumb')} .cr{display:block;text-align:center}
${R('breadcrumb')} .cr b{font-size:.62em;font-weight:500;color:var(--a-mut);text-decoration:underline;text-underline-offset:.18em}
${R('breadcrumb')} .cr.now b{color:var(--a-ink);font-weight:800;text-decoration:none}
${R('breadcrumb')} .sp{display:block;width:.8em;height:.8em;text-align:center}
${R('breadcrumb')} .sp::before{content:"";display:block;width:.28em;height:.28em;margin:.26em auto 0;border-top:.07em solid #8c8e92;border-right:.07em solid #8c8e92;transform:rotate(45deg)}
${R('breadcrumb')} .ba{opacity:1;animation-name:nvBcA}.t-navigation-breadcrumb .bb{animation-name:nvBcB}.t-navigation-breadcrumb .bm{animation-name:nvBcM}
${R('breadcrumb')} .pa,.t-navigation-breadcrumb .pb{position:absolute;inset:0}
${R('breadcrumb')} .pa{animation-name:nvBcPa}.t-navigation-breadcrumb .pb{opacity:0;animation-name:nvBcPb}
${R('breadcrumb')} .h1{position:absolute;left:1.18em;top:2.65em;font-size:.85em;line-height:1.2}
${R('breadcrumb')} .tm{animation-name:nvBcTm}
${R('breadcrumb')} .tp{animation-name:nvBcTp}
${R('breadcrumb')} .cur{animation-name:nvBcCur,nvBcCurO}
${op('nvBcA', [[26, 30, 92, 96]], 1)}${op('nvBcB', [[26, 30, 62, 66]])}${op('nvBcM', [[64, 68, 90, 94]])}
${op('nvBcPa', [[26, 30, 92, 96]], 1)}${op('nvBcPb', [[26, 30, 90, 94]])}${op('nvBcTm', [[66, 70, 88, 92]])}${op('nvBcCurO', [[2, 6, 34, 38]])}
${K.kf.tap('nvBcTp', 24)}
${K.kf.path('nvBcCur', [[0, 0, 0], [20, -4.35, -4.35], [100, -4.35, -4.35]])}

/* sticky header */
${R('sticky-header')} .k-ab::after{content:"";position:absolute;left:0;right:0;bottom:-.35em;height:.35em;background:linear-gradient(rgba(20,20,22,.16),rgba(20,20,22,0));opacity:0;animation-name:nvShSh}
${R('sticky-header')} .sc{animation-name:nvShSc}
${R('sticky-header')} .fg1{animation-name:nvShDrag1}.t-navigation-sticky-header .fg2{animation-name:nvShDrag2}
${R('sticky-header')} .dm{animation-name:nvShDm}
${op('nvShSh', [[14, 26, 58, 66]])}${op('nvShDm', [[40, 44, 54, 58]])}
@keyframes nvShSc{0%,8%{transform:none}26%,56%{transform:translateY(-6.9em)}74%,100%{transform:none}}
${K.kf.drag('nvShDrag1', 8, 26, 0, -7)}${K.kf.drag('nvShDrag2', 56, 74, 0, 7)}

/* fab */
${R('fab')} .lw{position:absolute;left:0;right:0;top:3.7em;animation-name:nvFbLw}
${R('fab')} .nr{position:absolute;left:0;right:0;top:-2.3em;opacity:0;animation-name:nvFbNr}
${R('fab')} .nrw{background:#f6e3d8}
${R('fab')} .fb{animation-name:nvFbFab}
${R('fab')} .fg1{animation-name:nvFbD1}.t-navigation-fab .fg2{animation-name:nvFbD2}
${R('fab')} .tp{animation-name:nvFbTp}
${R('fab')} .t1{animation-name:nvFbT1}.t-navigation-fab .t2{animation-name:nvFbT2}
@keyframes nvFbLw{0%,8%{transform:none}26%,36%{transform:translateY(-4.6em)}50%,62%{transform:none}70%,86%{transform:translateY(2.3em)}96%,100%{transform:none}}
@keyframes nvFbFab{0%,12%{transform:none}20%,38%{transform:translateY(4.5em)}48%,100%{transform:none}}
${op('nvFbNr', [[62, 68, 86, 94]])}${op('nvFbT1', [[20, 24, 34, 38]])}${op('nvFbT2', [[46, 50, 58, 62]])}
${K.kf.drag('nvFbD1', 8, 26, 0, -5)}${K.kf.drag('nvFbD2', 36, 50, 0, 5)}${K.kf.tap('nvFbTp', 60)}

/* pagination */
${R('pagination')} .ly{position:absolute;inset:0}
${R('pagination')} .p1{animation-name:nvPgP1}.t-navigation-pagination .p3{opacity:0;animation-name:nvPgP3}
${R('pagination')} .uc{position:absolute;right:1em;top:1.3em;width:5.2em;height:.9em;background:var(--a-soft);border-radius:.3em}
${R('pagination')} .uc span{position:absolute;inset:0;display:grid;place-items:center;font-size:.55em;font-weight:700;font-family:ui-monospace,Consolas,monospace}
${R('pagination')} .u1{animation-name:nvPgP1}.t-navigation-pagination .u3{opacity:0;animation-name:nvPgP3}
${R('pagination')} .pg{position:absolute;top:8.3em;width:1em;height:1em;display:grid;place-items:center}
${R('pagination')} .pg b{font-size:.6em;font-weight:500}
${R('pagination')} .pg .k-i{width:.75em;height:.75em;display:block}
${R('pagination')} .pg b{display:grid;place-items:center}
${R('pagination')} .cr{font-style:normal;position:absolute;left:6.1em;top:8.3em;width:1em;height:1em;border-radius:50%;background:var(--a-brand);color:#fff;z-index:3;animation-name:nvPgCr}
${R('pagination')} .cr b{position:absolute;inset:0;display:grid;place-items:center;font-size:.6em;font-weight:700}
${R('pagination')} .c1{animation-name:nvPgP1}.t-navigation-pagination .c3{opacity:0;animation-name:nvPgP3}
${R('pagination')} .t1{animation-name:nvPgT1}.t-navigation-pagination .t2{animation-name:nvPgT2}
${R('pagination')} .cur{animation-name:nvPgCur,nvPgCurO}
${op('nvPgP1', [[16, 18, 60, 62]], 1)}${op('nvPgP3', [[16, 18, 60, 62]])}
@keyframes nvPgCr{0%,16%{transform:none}20%,60%{transform:translateX(2.2em)}64%,100%{transform:none}}
${K.kf.tap('nvPgT1', 16)}${K.kf.tap('nvPgT2', 60)}
${K.kf.path('nvPgCur', [[0, 0, 0], [12, -4.2, 2.8], [44, -4.2, 2.8], [56, -6.4, 2.8], [100, -6.4, 2.8]])}
${op('nvPgCurO', [[2, 6, 70, 76]])}

/* infinite scroll */
${R('infinite-scroll')} .lw{animation-name:nvIsLw}
${R('infinite-scroll')} .ld{position:absolute;left:0;right:0;top:18.4em;height:2.3em;display:flex;align-items:center;justify-content:center;gap:.5em;background:var(--a-bg);z-index:2;opacity:0;animation-name:nvIsLd}
${R('infinite-scroll')} .ld em{font-style:normal;font-size:.6em;color:var(--a-mut);font-weight:700}
${R('infinite-scroll')} .spn{width:1.2em;height:1.2em;fill:none;stroke:var(--a-brand);stroke-width:3;stroke-linecap:round;stroke-dasharray:30 60;animation-name:nvIsSp;animation-timing-function:linear}
${R('infinite-scroll')} .nw{opacity:0}
${R('infinite-scroll')} .nw1{animation-name:nvIsN1}.t-navigation-infinite-scroll .nw2{animation-name:nvIsN2}.t-navigation-infinite-scroll .nw3{animation-name:nvIsN3}.t-navigation-infinite-scroll .nw4{animation-name:nvIsN4}
${R('infinite-scroll')} .fg1{animation-name:nvIsD1}.t-navigation-infinite-scroll .fg2{animation-name:nvIsD2}
${R('infinite-scroll')} .tn{animation-name:nvIsTn}
@keyframes nvIsLw{0%,8%{transform:none;opacity:1}26%,62%{transform:translateY(-5em);opacity:1}78%,90%{transform:translateY(-9.7em);opacity:1}93%{transform:translateY(-9.7em);opacity:0}94%{transform:none;opacity:0}100%{transform:none;opacity:1}}
${op('nvIsLd', [[26, 29, 44, 47]])}${op('nvIsTn', [[28, 32, 42, 46]])}
@keyframes nvIsSp{from{transform:rotate(0)}to{transform:rotate(1440deg)}}
${K.kf.fade('nvIsN1', [[46, 50, 92, 95]], .6)}${K.kf.fade('nvIsN2', [[50, 54, 92, 95]], .6)}${K.kf.fade('nvIsN3', [[54, 58, 92, 95]], .6)}${K.kf.fade('nvIsN4', [[58, 62, 92, 95]], .6)}
${K.kf.drag('nvIsD1', 8, 26, 0, -5)}${K.kf.drag('nvIsD2', 62, 78, 0, -4.7)}

/* back */
${R('back')} .s0{position:absolute;inset:0;animation-name:nvBkS0}
${R('back')} .s1{position:absolute;inset:0;z-index:6;background:var(--a-bg);transform:translateX(101%);animation-name:nvBkS1;box-shadow:-.4em 0 1em rgba(10,10,12,.14)}
${R('back')} .fm{position:absolute;left:1em;right:1em;top:4.8em;display:flex;flex-direction:column;gap:1em}
${R('back')} .tp1{animation-name:nvBkT1}.t-navigation-back .tp2{animation-name:nvBkT2}
@keyframes nvBkS0{0%,10%{transform:none}22%,62%{transform:translateX(-30%)}74%,100%{transform:none}}
@keyframes nvBkS1{0%,10%{transform:translateX(101%)}22%,62%{transform:none}74%,100%{transform:translateX(101%)}}
${K.kf.tap('nvBkT1', 8)}${K.kf.tap('nvBkT2', 60)}
`
  });
})();
