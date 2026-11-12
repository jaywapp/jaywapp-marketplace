/* Topic: 인디케이터 (indicators). Reference: plugins/design-master/references/indicators-completion.md (section A)
   Every selector starts with .t-indicators-<element>. Keyframe prefix: id. */
(function () {
  // opacity windows [[from, to], ...] in % of the cycle, with a short fade on both sides
  const vis = (name, wins, f = 1.5) => {
    const fr = [`0%{opacity:${wins[0][0] === 0 ? 1 : 0}}`];
    wins.forEach(([a, b], i) => {
      if (!(i === 0 && a === 0)) fr.push(`${+(a - f).toFixed(2)}%{opacity:0}${a}%{opacity:1}`);
      if (!(i === wins.length - 1 && b === 100)) fr.push(`${b}%{opacity:1}${+(b + f).toFixed(2)}%{opacity:0}`);
    });
    if (wins[wins.length - 1][1] === 100) fr.push('100%{opacity:1}');
    return `@keyframes ${name}{${fr.join('')}}`;
  };
  const NODE_X = [2.9, 8, 13.1];
  const SLIDES = [['users', '함께 담아요', '가족이 같은 목록에 담아요'], ['bell', '알림 받아요', '누가 담으면 바로 알려 줘요'], ['check', '같이 정리해요', '다 산 항목은 한 번에 비워요']];
  const TABS = [['전체', 1.2, 2.0], ['유제품', 4.4, 2.8], ['채소', 8.4, 2.0], ['과일', 11.6, 2.0]];
  const ROW_TAPS = [12, 34, 56];

  UIGuide.registerTopic({
    id: 'indicators',
    intro: '지금 어디에 있는지, 얼마나 왔는지를 알려 주는 9가지 표시예요. 막대, 점, 링처럼 모양이 달라도 답하는 질문이 무엇인지로 구분해요.',
    elements: [
      {
        id: 'progress-bar', ko: '프로그레스 바', en: 'Progress bar', aka: ['진행 바', '완성도', 'progress'],
        when: '여러 단계 중 한 구간의 진행(프로필 완성도, 장보기 진행도)이나 진행률을 알 수 있는 업로드를 보여 줄 때',
        avoid: '끝을 알 수 없는 작업(스피너나 불확정 바), 아주 짧은 작업',
        notes: [
          '두께 4~8px, 트랙과 채움의 대비 3:1 이상이에요.',
          'role="progressbar"와 aria-valuenow, aria-valuemin, aria-valuemax를 줘요. 퍼센트나 개수를 글로도 보여 줘요.',
          '진행이 되돌아가지 않게 해요.'
        ],
        vs: { id: 'step', text: '스텝 인디케이터는 단계 단위로 끊어서 보여 주고, 프로그레스 바는 이어지는 값이 얼마나 찼는지 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4200,
          phases: [['1개', 720, 1080], ['2개', 2040, 2400], ['3개', 3360, 3720]],
          alt: '장보기 진행 카드의 막대가 비어 있다가, 우유와 달걀과 두부를 하나씩 체크할 때마다 한 칸씩 차올라 5개 중 3개를 담았다는 글자와 함께 60퍼센트가 되는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more']) +
            '<div class="pg"><div class="pt"><b>담은 항목</b><span class="cn"><i class="c0">0/5</i><i class="c1">1/5</i><i class="c2">2/5</i><i class="c3">3/5</i></span></div><div class="tr"><i class="fl"></i></div></div>' +
            K.app.list(0, 5, { cls: 'rows' }) + K.tap(1.5, 8.75, 'tp1') + K.tap(1.5, 11.05, 'tp2') + K.tap(1.5, 13.35, 'tp3')
        }
      },
      {
        id: 'step', ko: '스텝 인디케이터', en: 'Step indicator', aka: ['스테퍼', 'stepper', '단계 표시'],
        when: '가입, 결제, 설문처럼 순서가 있는 3~6단계 흐름에서 전체 단계 수와 현재 위치를 보여 줄 때',
        avoid: '단계가 7개 이상이거나 사용자의 선택에 따라 단계가 바뀌는 흐름(진행 바나 ‘2/8’ 텍스트가 낫습니다)',
        notes: [
          '완료, 현재, 예정을 모양과 색, 아이콘으로 구분해요(색만 쓰지 않아요). 현재 단계에 aria-current="step".',
          '모바일에서는 번호 ‘2 / 4’와 막대로 줄여요.',
          '이미 지나온 단계로 돌아갈 수 있으면 눌림 가능하게 하되 방법을 보여 줘요.'
        ],
        vs: { id: 'page', text: '페이지 인디케이터는 나란한 콘텐츠 중 위치라 순서가 필수는 아니고, 스텝 인디케이터는 반드시 거쳐 가는 순서예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['1단계', 0, 1900], ['2단계', 2040, 3840], ['3단계', 3960, 5520]],
          alt: '가족 초대 화면 위쪽의 동그라미 세 개 중 첫 번째가 현재 단계였다가, 다음을 누를 때마다 지난 단계는 체크로 채워지고 선이 이어지며 현재 표시가 두 번째, 세 번째로 옮겨 가는 시연',
          html: K => K.app.status() + K.app.bar('가족 초대', [], { back: true }) +
            NODE_X.map((x, i) => `<div class="nd n${i + 1}" style="left:${x - .9}em"><i class="b">${i + 1}</i><i class="cur">${i + 1}</i><i class="dn">${K.icon('check')}</i></div><span class="lb" style="left:${((x - 2.5) / .6).toFixed(2)}em">${['방법', '연락처', '확인'][i]}</span>`).join('') +
            '<i class="ln l1"><b></b></i><i class="ln l2"><b></b></i>' +
            '<div class="ct"><b class="a1">초대 방법을 골라요</b><b class="a2">연락처를 입력해요</b><b class="a3">초대를 확인해요</b></div>' +
            K.wf('block', 1, 11.4, 14, 4.8) +
            '<div class="nx"><span class="x1">다음</span><span class="x2">초대 보내기</span></div>' + K.tap(8, 18.63, 'tp1') + K.tap(8, 18.63, 'tp2')
        }
      },
      {
        id: 'page', ko: '페이지 인디케이터', en: 'Page indicator', aka: ['점 인디케이터', '캐러셀 점', 'dots', 'pagination dots'],
        when: '가로로 넘기는 슬라이드 3~7장(캐러셀, 온보딩, 이미지 갤러리)에서 현재 위치를 알릴 때',
        avoid: '항목이 8개 이상일 때(점이 너무 많아지니 ‘3 / 12’처럼 숫자로 보여 줘요)',
        notes: [
          '점 지름 6~8px, 간격 8px. 활성 점은 색과 크기(길어진 알약)로 구분해요.',
          '점이 작아 누르기 어려우면 눌림 영역만 키우고 보이는 크기는 유지해요.',
          '접근성을 위해 이전·다음 버튼도 둬요. 자동 넘김이 있으면 일시정지를 줘요.'
        ],
        vs: { id: 'story', text: '스토리 바는 시간이 지나면 저절로 채워지며 넘어가고, 페이지 인디케이터는 사용자가 직접 넘길 때만 바뀌어요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2100,
          phases: [['첫 스와이프', 780, 1560], ['두 번째 스와이프', 2580, 3360]],
          alt: '안내 카드 세 장 중 첫 장에서 손가락으로 왼쪽으로 밀면 카드가 넘어가고, 아래 점 세 개 가운데 길쭉한 활성 표시가 첫 번째에서 두 번째, 세 번째로 미끄러져 옮겨 가는 시연',
          html: K => K.app.status() + K.app.bar('이렇게 써요', []) +
            '<div class="strip">' + SLIDES.map(([ic, t, d]) => `<div class="sl"><div class="cd"><span class="cir">${K.icon(ic)}</span><b>${t}</b><span>${d}</span></div></div>`).join('') + '</div>' +
            '<div class="dots"><i class="d" style="left:6.325em"></i><i class="d" style="left:7.725em"></i><i class="d" style="left:9.125em"></i><i class="pill"></i></div>' + K.finger(12, 9.7, 'fg')
        }
      },
      {
        id: 'story', ko: '스토리 바', en: 'Story progress', aka: ['스토리 진행', '자동 넘김', 'stories'],
        when: '자동으로 넘어가는 스토리형 콘텐츠나 짧은 하이라이트의 길이를 보여 줄 때',
        avoid: '읽는 데 시간이 필요한 콘텐츠를 자동으로 넘길 때(정지 수단이 필수예요)',
        notes: [
          '항목당 5~7초가 흔해요. 막대 높이 2~3px, 사이 간격 2~4px.',
          '길게 눌러 일시정지, 좌우 탭으로 이동할 수 있게 해요.',
          '자동 전환은 접근성을 위해 정지할 수 있어야 해요.'
        ],
        vs: { id: 'page', text: '페이지 인디케이터는 사람이 넘길 때 바뀌고, 스토리 바는 시간이 흐르며 저절로 채워져요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2900,
          phases: [['1번째 막대', 0, 1680], ['2번째 막대', 1680, 2640], ['머묾', 2640, 3240], ['2번째 이어서', 3240, 3960], ['3번째 막대', 3960, 5400]],
          alt: '위쪽 막대 세 개가 시간에 따라 차례로 하얗게 채워지며 내용이 바뀌고, 화면을 길게 누르는 동안에는 막대 채움이 멈췄다가 손을 떼면 이어서 채워지는 시연',
          html: K => '<div class="bg"></div>' +
            '<div class="bars"><i><b class="b1"></b></i><i><b class="b2"></b></i><i><b class="b3"></b></i></div>' +
            '<span class="hd">우리 가족 이번 주</span>' +
            '<div class="sc s1"><span>이번 주 아낀 돈</span><b>12,400원</b></div><div class="sc s2"><span>가장 많이 담은 것</span><b>우유 5번</b></div><div class="sc s3"><span>다음 장보기는</span><b>토요일</b></div>' +
            '<div class="pz">' + K.icon('pause') + '<span>멈춤</span></div><div class="hn">길게 누르면 멈춰요</div>' + K.finger(8, 13, 'fg')
        }
      },
      {
        id: 'scroll-progress', ko: '스크롤 진행 바', en: 'Scroll progress', aka: ['읽기 진행', 'reading progress'],
        when: '긴 글, 문서, 블로그에서 얼마나 읽었는지를 화면 위쪽 가는 막대로 보여 줄 때',
        avoid: '짧은 페이지, 무한 스크롤(끝이 없어요)',
        notes: [
          '높이 2~4px. 고정 헤더와 겹치지 않게 헤더 위나 아래에 붙여요.',
          '계산은 스크롤 위치 ÷ (문서 높이 - 뷰포트 높이). animation-timeline: scroll()이나 requestAnimationFrame으로 처리하고 스크롤 이벤트마다 레이아웃을 읽지 않아요.',
          '장식이므로 aria-hidden.'
        ],
        vs: { id: 'progress-bar', text: '프로그레스 바는 작업이 얼마나 진행됐는지, 스크롤 진행 바는 글의 어디까지 읽었는지를 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['읽는 중', 600, 4800], ['처음으로', 5400, 5880]],
          alt: '긴 글을 아래로 스크롤하면 글이 위로 올라가고, 앱 바 바로 아래의 가는 막대가 스크롤한 만큼 왼쪽부터 차올라 끝에 닿았다가, 처음으로 돌아가며 막대도 비워지는 시연',
          html: K => '<div class="art"><b class="tt">냉장고 정리 요령</b><i class="hh"></i><i class="ln1"></i><i class="im"></i><i class="hh"></i><i class="ln1"></i><i class="ln1"></i><i class="im"></i><i class="hh"></i><i class="ln1"></i></div>' +
            '<div class="cv"></div>' + K.app.status() + K.app.bar('냉장고 정리 요령', ['share'], { back: true }) +
            '<div class="sp" aria-hidden="true"><i></i></div><i class="sb"></i>'
        }
      },
      {
        id: 'progress-ring', ko: '원형 진행률', en: 'Progress ring', aka: ['링', '목표 달성률', '도넛 차트', 'goal ring'],
        when: '목표 달성률, 운동 링, 타이머처럼 오래 머무는 지속 지표를 정사각형에 가까운 곳에 보여 줄 때',
        avoid: '좁고 긴 공간, 여러 개의 진행을 비교하는 화면(바가 비교하기 쉬워요)',
        notes: [
          'SVG circle의 stroke-dasharray로 구현하고 시작 지점은 12시 방향이에요.',
          '중앙에 값을 글로 써요. role="progressbar"와 값 속성을 줘요.',
          '값이 바뀔 때 부드럽게 이어지게 해요.'
        ],
        vs: { topic: 'loading', id: 'progress-ring', name: '진행 링', text: '같은 모양이에요. 로딩의 진행 링은 올리는 동안 차오르다 끝나는 한시적 표시이고, 여기서는 이번 주 목표처럼 계속 머무는 값을 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 5500, still: 3000,
          phases: [['체크', 440, 660], ['갱신', 990, 1650], ['머묾', 1650, 4950]],
          alt: '이번 주 목표 링이 8개 중 4개에서 멈춰 있다가, 달걀을 체크하자 링이 12시 방향에서 이어진 만큼 조금 더 차오르고 가운데 숫자가 4에서 5로 바뀌는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 목표', []) +
            '<div class="rg"><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="trk" cx="20" cy="20" r="16" pathLength="100"/><circle class="arc" cx="20" cy="20" r="16" pathLength="100"/></svg>' +
            '<div class="cc"><span class="nn"><i class="a">4</i><i class="b">5</i></span><span class="of">/ 8개 담음</span></div></div>' +
            '<span class="rl">방금 체크한 항목</span><div class="rw">' + K.app.row(1) + '</div>' + K.tap(1.5, 16.75, 'tp')
        }
      },
      {
        id: 'strength', ko: '강도 표시기', en: 'Strength meter', aka: ['신호 세기', '난이도 표시', 'level meter'],
        when: '신호 세기, 난이도, 비밀번호 강도처럼 값이 몇 단계 중 어디인지 4단계 막대로 보여 줄 때',
        avoid: '막대만 보여 주고 어떻게 고쳐야 하는지 알려 주지 않을 때',
        notes: [
          '색만이 아니라 ‘약함, 보통, 좋음’ 같은 글자를 함께 써요.',
          '단계가 바뀌면 aria-live="polite"로 알려요.',
          '비밀번호 말고 연결 신호처럼 단계형 값에도 같은 4단계 막대 방식을 써요.'
        ],
        vs: { id: 'progress-bar', text: '프로그레스 바는 어디까지 진행됐는지를, 강도 표시기는 지금 값이 얼마나 센지를 몇 단계로 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4800,
          phases: [['약함', 0, 2040], ['보통', 2160, 3840], ['좋음', 3960, 5640]],
          alt: '공유 목록 연결 상태 카드에서 막대 네 칸이 처음에는 한 칸만 빨갛게 약함으로, 다음에는 두 칸이 노랗게 보통으로, 마지막에는 네 칸이 모두 초록으로 좋음으로 채워지며 안내 문장도 함께 바뀌는 시연',
          html: K => K.app.status() + K.app.bar('연결 상태', []) +
            `<span class="ico">${K.icon('wifi')}</span><b class="ti">공유 목록 연결</b>` +
            [0, 1, 2, 3].map(i => `<span class="sgm" style="left:${1.9 + i * 3.15}em">${i < 1 ? '<i class="l1"></i>' : ''}${i < 2 ? '<i class="l2"></i>' : ''}<i class="l3"></i></span>`).join('') +
            '<div class="tx t1"><b>약함</b><span>와이파이에 가까이 가 보세요</span></div><div class="tx t2"><b>보통</b><span>조금만 더 가까이 가 보세요</span></div><div class="tx t3"><b>좋음</b><span>바로 동기화할 수 있어요</span></div>'
        }
      },
      {
        id: 'tab-indicator', ko: '탭 인디케이터', en: 'Tab indicator', aka: ['탭 밑줄', 'underline', '활성 탭 표시'],
        when: '상단 탭, 세그먼트, 하단 메뉴에서 활성 탭 아래에 막대나 하이라이트로 현재 위치를 알릴 때',
        avoid: '색만으로 활성 탭을 구분하는 것(글자 굵기도 함께 바꿔요)',
        notes: [
          '두께 2~3px, 탭 폭에 맞춰 길이가 변하고 이동은 200~300ms ease-out이에요.',
          '색만 아니라 글자 굵기도 바꿔요.',
          '탭 목록이 스크롤되면 활성 탭이 화면 안에 들어오게 스크롤해요.'
        ],
        vs: { id: 'page', text: '페이지 인디케이터는 점으로 나란한 화면의 위치를, 탭 인디케이터는 이름이 붙은 탭 중 활성 탭을 알려요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['이동', 840, 1200], ['이동', 2520, 2760], ['되돌아옴', 4080, 4320]],
          alt: '상단 탭의 전체에서 유제품, 채소로 탭을 누를 때마다 아래 막대가 글자 폭에 맞게 늘거나 줄며 미끄러져 옮겨 가고 활성 탭 글자가 굵어지며, 다시 전체를 누르면 되돌아오는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more']) +
            '<div class="trow">' + TABS.map(([t, l, w], i) => `<span class="tb tb${i}" style="left:${l}em;width:${w}em"><i class="n">${t}</i>${i < 3 ? `<i class="a">${t}</i>` : ''}</span>`).join('') + '<i class="ind"></i></div>' +
            K.app.list(0, 5, { cls: 'rows' }) + K.tap(5.8, 4.8, 'tp1') + K.tap(9.4, 4.8, 'tp2') + K.tap(2.2, 4.8, 'tp3')
        }
      },
      {
        id: 'home-indicator', ko: '홈 인디케이터', en: 'Home indicator', aka: ['안전 영역', 'safe area', '홈 바'],
        when: '직접 만드는 요소가 아니라 피해야 하는 영역이에요. 하단 탭바, 하단 버튼, 바텀시트가 이 영역과 겹치지 않게 할 때',
        avoid: '중요한 버튼을 화면 맨 아래 가장자리에 붙이는 것(홈으로 가는 제스처와 충돌해요)',
        notes: [
          'padding-bottom: env(safe-area-inset-bottom)을 쓰고 viewport-fit=cover를 지정해야 값이 들어와요.',
          '안드로이드 제스처 바도 비슷해요.',
          '탭 안쪽 위아래 패딩 16px 기준은 모바일 스페이싱을 참고해요.'
        ],
        vs: { topic: 'navigation', id: 'tab-bar', name: '하단 탭바', text: '하단 탭바는 이 영역을 비워야 하는 대표 요소예요. 홈 인디케이터는 직접 만들지 않는 시스템 요소입니다.' },
        demo: {
          frame: 'compare', labels: ['겹침', '안전 영역 확보'], cycle: 5000, still: 2000,
          phases: [['끌어올림', 1000, 2400], ['결과 표시', 2400, 3500]],
          alt: '왼쪽은 탭바가 화면 맨 아래까지 닿아 홈 막대와 겹쳐서 아래에서 위로 끌어올릴 때 가운데 탭이 눌려 버리고, 오른쪽은 탭바를 위로 띄워 두어 같은 동작이 홈으로 가는 제스처로만 처리되는 시연',
          html: K => [
            K.app.status() + K.app.bar('장보기', []) + K.app.list(0, 4) + K.app.tabs(0, {}, { cls: 'bad' }) + '<i class="hi"></i><span class="oc o1">탭이 눌려요</span>' + K.finger(8, 20.6, 'fg'),
            K.app.status() + K.app.bar('장보기', []) + K.app.list(0, 4) + K.app.tabs(0, {}, { cls: 'good' }) + '<i class="hi"></i><span class="oc o2">홈으로 가요</span>' +
              K.dim({ x: 14.9, y: 20.23, len: 1.1, dir: 'v', label: '안전 영역', side: 'left' }) + K.finger(8, 20.6, 'fg')
          ]
        }
      }
    ],
    css: K => `
/* progress bar */
.t-indicators-progress-bar .pg{position:absolute;z-index:2;left:1em;right:1em;top:4em;padding:.7em .9em .75em;border-radius:.7em;background:var(--a-soft)}
.t-indicators-progress-bar .pt{display:flex;justify-content:space-between;align-items:center}
.t-indicators-progress-bar .pt b{font-size:.74em}
.t-indicators-progress-bar .cn{position:relative;width:2em;height:1em}
.t-indicators-progress-bar .cn i{position:absolute;right:0;top:0;font-style:normal;font-size:.7em;font-weight:700;color:var(--a-mut);opacity:0}
.t-indicators-progress-bar .tr{height:.5em;margin-top:.55em;border-radius:.3em;background:#dcdcd7;overflow:hidden}
.t-indicators-progress-bar .fl{display:block;height:100%;background:var(--a-brand);transform-origin:left;transform:scaleX(0);animation-name:idPbFill;animation-timing-function:linear}
.t-indicators-progress-bar .rows{position:absolute;left:0;right:0;top:7.6em}
.t-indicators-progress-bar .c0{animation-name:idPbC0}.t-indicators-progress-bar .c1{animation-name:idPbC1}.t-indicators-progress-bar .c2{animation-name:idPbC2}.t-indicators-progress-bar .c3{animation-name:idPbC3}
${ROW_TAPS.map((t, i) => `.t-indicators-progress-bar .k-r${i + 1} .k-ck{animation-name:idPbCk${i}}.t-indicators-progress-bar .tp${i + 1}{animation-name:idPbTap${i}}@keyframes idPbCk${i}{0%,${t}%{opacity:0;transform:scale(.4)}${t + 3}%,92%{opacity:1;transform:scale(1)}96%,100%{opacity:0;transform:scale(1)}}${K.kf.tap('idPbTap' + i, t)}`).join('\n')}
${vis('idPbC0', [[0, 15], [96, 100]])}${vis('idPbC1', [[17, 37]])}${vis('idPbC2', [[39, 59]])}${vis('idPbC3', [[61, 94]])}
@keyframes idPbFill{0%,13%{transform:scaleX(0)}18%,35%{transform:scaleX(.2)}40%,57%{transform:scaleX(.4)}62%,92%{transform:scaleX(.6)}97%,100%{transform:scaleX(0)}}

/* step */
.t-indicators-step .nd{position:absolute;top:5em;width:1.8em;height:1.8em}
.t-indicators-step .nd i{position:absolute;inset:0;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:.7em;font-weight:700}
.t-indicators-step .nd .b{border:.12em solid #b5b6b1;color:var(--a-mut)}
.t-indicators-step .nd .cur{border:.16em solid var(--a-brand);background:#fbe9df;color:var(--a-brand);opacity:0}
.t-indicators-step .nd .dn{background:var(--a-dark);color:#fff;opacity:0}
.t-indicators-step .nd .dn .k-i{width:1.1em;height:1.1em;stroke-width:3}
.t-indicators-step .lb{position:absolute;top:11.7em;width:8.3em;text-align:center;font-size:.6em;color:var(--a-mut)}
.t-indicators-step .ln{position:absolute;top:5.85em;height:.16em;border-radius:.1em;background:#d4d4cf;overflow:hidden}
.t-indicators-step .l1{left:4.1em;width:2.7em}.t-indicators-step .l2{left:9.2em;width:2.7em}
.t-indicators-step .ln b{display:block;height:100%;background:var(--a-dark);transform-origin:left;transform:scaleX(0)}
.t-indicators-step .l1 b{animation-name:idStL1}.t-indicators-step .l2 b{animation-name:idStL2}
.t-indicators-step .n1 .cur{animation-name:idStC1}
.t-indicators-step .ct{position:absolute;left:1em;right:1em;top:9.2em;height:1.6em;text-align:center}
.t-indicators-step .ct b{position:absolute;left:0;right:0;top:0;font-size:.86em;opacity:0}
.t-indicators-step .a1{animation-name:idStA1}.t-indicators-step .a2{animation-name:idStA2}.t-indicators-step .a3{animation-name:idStA3}
.t-indicators-step .nx{position:absolute;left:1.2em;right:1.2em;bottom:1.4em;height:2.6em;border-radius:.8em;background:var(--a-brand);color:#fff}
.t-indicators-step .nx span{position:absolute;inset:0;display:grid;place-items:center;font-size:.76em;font-weight:700}
.t-indicators-step .x1{animation-name:idStX1}.t-indicators-step .x2{opacity:0;animation-name:idStX2}
.t-indicators-step .tp1{animation-name:idStT1}.t-indicators-step .tp2{animation-name:idStT2}
${vis('idStA1', [[0, 32], [96, 100]])}${vis('idStA2', [[34, 64]])}${vis('idStA3', [[66, 92]])}${vis('idStX1', [[0, 66], [96, 100]])}${vis('idStX2', [[68, 92]])}
${vis('idStC1', [[0, 32], [96, 100]])}${vis('idStC2', [[34, 64]])}${vis('idStC3', [[66, 92]])}${vis('idStD1', [[33, 93]])}${vis('idStD2', [[65, 93]])}
.t-indicators-step .n2 .cur{animation-name:idStC2}.t-indicators-step .n3 .cur{animation-name:idStC3}
.t-indicators-step .n1 .dn{animation-name:idStD1}.t-indicators-step .n2 .dn{animation-name:idStD2}
@keyframes idStL1{0%,28%{transform:scaleX(0)}36%,92%{transform:scaleX(1)}97%,100%{transform:scaleX(0)}}
@keyframes idStL2{0%,60%{transform:scaleX(0)}68%,92%{transform:scaleX(1)}97%,100%{transform:scaleX(0)}}
${K.kf.tap('idStT1', 28)}
${K.kf.tap('idStT2', 60)}

/* page */
.t-indicators-page .strip{position:absolute;left:0;top:4.9em;width:48em;display:flex;animation-name:idPgSlide}
.t-indicators-page .sl{width:16em;padding:0 1.5em}
.t-indicators-page .cd{height:9.6em;border-radius:1em;background:var(--a-soft);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5em;text-align:center}
.t-indicators-page .cir{width:3em;height:3em;border-radius:50%;background:var(--a-brand);color:#fff;display:grid;place-items:center}
.t-indicators-page .cir .k-i{width:1.4em;height:1.4em}
.t-indicators-page .cd b{font-size:.86em}
.t-indicators-page .cd>span:last-child{font-size:.62em;color:var(--a-mut)}
.t-indicators-page .dots{position:absolute;left:0;right:0;top:15.6em;height:.55em}
.t-indicators-page .d{position:absolute;top:0;width:.55em;height:.55em;border-radius:50%;background:#cfcfca}
.t-indicators-page .pill{position:absolute;left:5.95em;top:0;width:1.3em;height:.55em;border-radius:.3em;background:var(--a-brand);animation-name:idPgPill}
.t-indicators-page .fg{animation-name:idPgFg}
@keyframes idPgSlide{0%,13%{transform:translateX(0)}26%,43%{transform:translateX(-16em)}56%,92%{transform:translateX(-32em)}98%,100%{transform:translateX(0)}}
@keyframes idPgPill{0%,13%{transform:translateX(0)}26%,43%{transform:translateX(1.4em)}56%,92%{transform:translateX(2.8em)}98%,100%{transform:translateX(0)}}
@keyframes idPgFg{0%,10%{opacity:0;transform:translate(0,0) scale(1.3)}13%{opacity:1;transform:translate(0,0) scale(1)}24%{opacity:1;transform:translate(-7em,0) scale(1)}27%,40%{opacity:0;transform:translate(-7em,0) scale(1.2)}41%{opacity:0;transform:translate(0,0) scale(1.3)}43%{opacity:1;transform:translate(0,0) scale(1)}54%{opacity:1;transform:translate(-7em,0) scale(1)}57%,100%{opacity:0;transform:translate(-7em,0) scale(1.2)}}

/* story */
.t-indicators-story .bg{position:absolute;inset:0;z-index:1;background:#c24719}
.t-indicators-story .bars{position:absolute;z-index:3;left:1em;right:1em;top:.9em;display:flex;gap:.3em}
.t-indicators-story .bars i{flex:1;height:.22em;border-radius:.2em;background:rgba(255,255,255,.35);overflow:hidden}
.t-indicators-story .bars b{display:block;height:100%;background:#fff;transform-origin:left;transform:scaleX(0);animation-timing-function:linear}
.t-indicators-story .b1{animation-name:idSyB1}.t-indicators-story .b2{animation-name:idSyB2}.t-indicators-story .b3{animation-name:idSyB3}
.t-indicators-story .hd{position:absolute;z-index:3;left:1.6em;top:3.6em;font-size:.62em;font-weight:700;color:#fff}
.t-indicators-story .sc{position:absolute;z-index:2;left:1.2em;right:1.2em;top:8em;color:#fff;opacity:0}
.t-indicators-story .sc span{display:block;font-size:.72em}
.t-indicators-story .sc b{display:block;margin-top:.3em;font-size:1.7em;line-height:1.2}
.t-indicators-story .s1{animation-name:idSyS1}.t-indicators-story .s2{animation-name:idSyS2}.t-indicators-story .s3{animation-name:idSyS3}
.t-indicators-story .pz{position:absolute;z-index:3;left:50%;top:3.4em;transform:translateX(-50%);display:flex;align-items:center;gap:.3em;padding:.3em .8em;border-radius:1em;background:rgba(29,30,32,.55);color:#fff;opacity:0;animation-name:idSyPz}
.t-indicators-story .pz .k-i{width:.9em;height:.9em}
.t-indicators-story .pz span{font-size:.62em;font-weight:700}
.t-indicators-story .hn{position:absolute;z-index:3;left:0;right:0;bottom:1.6em;text-align:center;font-size:.62em;color:#fff;opacity:0;animation-name:idSyHn}
.t-indicators-story .fg{z-index:40;animation-name:idSyFg}
${vis('idSyS1', [[0, 28], [97, 100]])}${vis('idSyS2', [[28, 66]])}${vis('idSyS3', [[66, 94]])}${vis('idSyPz', [[44, 54]])}${vis('idSyHn', [[44, 54]])}
@keyframes idSyB1{0%{transform:scaleX(0)}28%,94%{transform:scaleX(1)}98%,100%{transform:scaleX(0)}}
@keyframes idSyB2{0%,28%{transform:scaleX(0)}44%,54%{transform:scaleX(.55)}66%,94%{transform:scaleX(1)}98%,100%{transform:scaleX(0)}}
@keyframes idSyB3{0%,66%{transform:scaleX(0)}90%,94%{transform:scaleX(1)}98%,100%{transform:scaleX(0)}}
${K.kf.press('idSyFg', 44, 54)}

/* scroll progress */
.t-indicators-scroll-progress .art{position:absolute;z-index:1;left:1.2em;right:1.4em;top:4.4em;animation-name:idScArt;animation-timing-function:linear}
.t-indicators-scroll-progress .cv{position:absolute;z-index:2;left:0;right:0;top:0;height:1.3em;background:var(--a-bg)}
.t-indicators-scroll-progress .k-sb{position:relative;z-index:3}
.t-indicators-scroll-progress .tt{display:block;font-size:.9em;margin-bottom:.7em}
.t-indicators-scroll-progress .art i{display:block}
.t-indicators-scroll-progress .hh{width:6em;height:.6em;margin:1em 0 .6em;border-radius:.15em;background:#9ea39d}
.t-indicators-scroll-progress .ln1{height:4.2em;background:repeating-linear-gradient(to bottom,#d4d6d1 0,#d4d6d1 .32em,transparent .32em,transparent .86em)}
.t-indicators-scroll-progress .im{height:5em;margin:.9em 0;border-radius:.5em;background:#e3e4e0}
.t-indicators-scroll-progress .sp{position:absolute;z-index:4;left:0;right:0;top:3.7em;height:.2em;background:var(--a-line)}
.t-indicators-scroll-progress .sp i{display:block;height:100%;background:var(--a-brand);transform-origin:left;transform:scaleX(0);animation-name:idScFill;animation-timing-function:linear}
.t-indicators-scroll-progress .sb{position:absolute;z-index:2;right:.3em;top:4.5em;width:.2em;height:5em;border-radius:.2em;background:#b5b6b1;animation-name:idScThumb;animation-timing-function:linear}
@keyframes idScArt{0%,10%{transform:translateY(0)}80%,90%{transform:translateY(-19em)}98%,100%{transform:translateY(0)}}
@keyframes idScFill{0%,10%{transform:scaleX(0)}80%,90%{transform:scaleX(1)}98%,100%{transform:scaleX(0)}}
@keyframes idScThumb{0%,10%{transform:translateY(0)}80%,90%{transform:translateY(11em)}98%,100%{transform:translateY(0)}}

/* progress ring */
.t-indicators-progress-ring .rg{position:absolute;left:3.5em;top:4.9em;width:9em;height:9em}
.t-indicators-progress-ring .rg svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
.t-indicators-progress-ring .rg circle{fill:none;stroke-width:4}
.t-indicators-progress-ring .trk{stroke:var(--a-line)}
.t-indicators-progress-ring .arc{stroke:var(--a-brand);stroke-linecap:round;stroke-dasharray:100 100;stroke-dashoffset:50;animation-name:idRgArc}
.t-indicators-progress-ring .cc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.t-indicators-progress-ring .nn{position:relative;width:2em;height:2em;animation-name:idRgBump}
.t-indicators-progress-ring .nn i{position:absolute;inset:0;display:grid;place-items:center;font-style:normal;font-size:1.9em;font-weight:700;opacity:0}
.t-indicators-progress-ring .a{animation-name:idRgA}.t-indicators-progress-ring .b{animation-name:idRgB}
.t-indicators-progress-ring .of{font-size:.62em;color:var(--a-mut)}
.t-indicators-progress-ring .rl{position:absolute;left:2em;top:24.3em;font-size:.6em;font-weight:700;color:var(--a-mut)}
.t-indicators-progress-ring .rw{position:absolute;left:0;right:0;top:15.6em}
.t-indicators-progress-ring .k-r2 .k-ck{animation-name:idRgCk}
.t-indicators-progress-ring .tp{animation-name:idRgTap}
${vis('idRgA', [[0, 14], [96, 100]])}${vis('idRgB', [[16, 92]])}
@keyframes idRgArc{0%,12%{stroke-dashoffset:50}20%,90%{stroke-dashoffset:37.5}97%,100%{stroke-dashoffset:50}}
@keyframes idRgBump{0%,13%{transform:scale(1)}16%{transform:scale(1.18)}21%,100%{transform:scale(1)}}
@keyframes idRgCk{0%,10%{opacity:0;transform:scale(.4)}13%,90%{opacity:1;transform:scale(1)}94%,100%{opacity:0;transform:scale(1)}}
${K.kf.tap('idRgTap', 10)}

/* strength */
.t-indicators-strength .ico{position:absolute;left:50%;top:5em;width:3.4em;height:3.4em;margin-left:-1.7em;border-radius:50%;background:var(--a-soft);display:grid;place-items:center;color:var(--a-ink)}
.t-indicators-strength .ico .k-i{width:1.6em;height:1.6em}
.t-indicators-strength .ti{position:absolute;left:0;right:0;top:10.9em;text-align:center;font-size:.84em}
.t-indicators-strength .sgm{position:absolute;top:11.2em;width:2.8em;height:.7em;border-radius:.4em;background:var(--a-line);overflow:hidden}
.t-indicators-strength .sgm i{position:absolute;inset:0;opacity:0}
.t-indicators-strength .l1{background:var(--a-err);animation-name:idSgS1}
.t-indicators-strength .l2{background:#d49a14;animation-name:idSgS2}
.t-indicators-strength .l3{background:var(--a-ok);animation-name:idSgS3}
.t-indicators-strength .tx{position:absolute;left:0;right:0;top:12.6em;text-align:center;opacity:0}
.t-indicators-strength .tx b{display:block;font-size:.9em}
.t-indicators-strength .tx span{display:block;margin-top:.3em;font-size:.62em;color:var(--a-mut)}
.t-indicators-strength .t1{animation-name:idSgS1}.t-indicators-strength .t2{animation-name:idSgS2}.t-indicators-strength .t3{animation-name:idSgS3}
.t-indicators-strength .t1 b{color:var(--a-err)}.t-indicators-strength .t2 b{color:#8a5d00}.t-indicators-strength .t3 b{color:var(--a-ok)}
${vis('idSgS1', [[0, 34], [97, 100]])}${vis('idSgS2', [[36, 64]])}${vis('idSgS3', [[66, 94]])}

/* tab indicator */
.t-indicators-tab-indicator .trow{position:absolute;z-index:3;left:0;right:0;top:3.7em;height:2.2em;background:var(--a-bg);border-bottom:1px solid var(--a-line)}
.t-indicators-tab-indicator .tb{position:absolute;top:0;height:2.2em;display:grid;place-items:center}
.t-indicators-tab-indicator .tb i{grid-area:1/1;font-style:normal;font-size:.8em;white-space:nowrap}
.t-indicators-tab-indicator .tb .n{color:var(--a-mut)}
.t-indicators-tab-indicator .tb .a{color:var(--a-ink);font-weight:700;opacity:0}
.t-indicators-tab-indicator .tb0 .a{animation-name:idTbA0}.t-indicators-tab-indicator .tb1 .a{animation-name:idTbA1}.t-indicators-tab-indicator .tb2 .a{animation-name:idTbA2}
.t-indicators-tab-indicator .ind{position:absolute;left:0;bottom:-.02em;width:1em;height:.22em;background:var(--a-ink);transform-origin:left;animation-name:idTbInd}
.t-indicators-tab-indicator .rows{position:absolute;left:0;right:0;top:5.9em;animation-name:idTbRows}
.t-indicators-tab-indicator .tp1{animation-name:idTbT1}.t-indicators-tab-indicator .tp2{animation-name:idTbT2}.t-indicators-tab-indicator .tp3{animation-name:idTbT3}
${vis('idTbA0', [[0, 18], [70, 100]])}${vis('idTbA1', [[18, 44]])}${vis('idTbA2', [[44, 70]])}
@keyframes idTbInd{0%,16%{transform:translateX(1.2em) scaleX(2)}20%,42%{transform:translateX(4.4em) scaleX(2.8)}46%,68%{transform:translateX(8.4em) scaleX(2)}72%,100%{transform:translateX(1.2em) scaleX(2)}}
@keyframes idTbRows{0%,16%{opacity:1;transform:none}18%{opacity:0;transform:translateX(.6em)}22%,42%{opacity:1;transform:none}44%{opacity:0;transform:translateX(.6em)}48%,68%{opacity:1;transform:none}70%{opacity:0;transform:translateX(.6em)}74%,100%{opacity:1;transform:none}}
${K.kf.tap('idTbT1', 14)}
${K.kf.tap('idTbT2', 40)}
${K.kf.tap('idTbT3', 66)}

/* home indicator */
.t-indicators-home-indicator .k-tb.bad .k-tab{justify-content:flex-end;padding-bottom:.35em}
.t-indicators-home-indicator .k-tb.good{bottom:1.1em}
.t-indicators-home-indicator .bad .k-tab-1{animation-name:idHmTab}
.t-indicators-home-indicator .hi{position:absolute;z-index:8;left:50%;bottom:.4em;width:5em;height:.28em;margin-left:-2.5em;border-radius:.2em;background:#1d1e20}
.t-indicators-home-indicator .k-pane-b .hi{animation-name:idHmPill}
.t-indicators-home-indicator .oc{position:absolute;z-index:9;left:50%;top:24em;padding:.35em .9em;border-radius:1em;transform:translateX(-50%);font-size:.62em;font-weight:700;color:#fff;white-space:nowrap;opacity:0}
.t-indicators-home-indicator .o1{background:var(--a-err);animation-name:idHmO}
.t-indicators-home-indicator .o2{background:var(--a-ok);animation-name:idHmO}
.t-indicators-home-indicator .fg{z-index:40;animation-name:idHmF}
${vis('idHmO', [[26, 70]])}
@keyframes idHmTab{0%,19%{background:transparent}22%,46%{background:#e4e3df}50%,100%{background:transparent}}
@keyframes idHmPill{0%,19%{transform:none}30%,46%{transform:translateY(-2.4em)}52%,100%{transform:none}}
${K.kf.drag('idHmF', 20, 45, 0, -3.6)}
`
  });
})();
