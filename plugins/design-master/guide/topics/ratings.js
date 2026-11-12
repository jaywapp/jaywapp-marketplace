/* Topic: 평점 UI (ratings). Reference: plugins/design-master/references/ratings-share.md (section A)
   Every selector starts with .t-ratings-<element>. Keyframe names start with "rt".
   Positioned boxes never set their own font-size, so em offsets are screen em. */
(function () {
  const f = n => +n.toFixed(2);
  const kfs = (name, frames) => `@keyframes ${name}{${frames.map(([p, c]) => `${[].concat(p).map(f).join('%,')}%{${c}}`).join('')}}`;
  function win(name, wins, on, off) {
    const fr = [];
    if (wins[0][0] > 0) fr.push([0, off]);
    wins.forEach(([a, b]) => {
      if (a > 0) fr.push([a - 1, off]);
      fr.push([Math.max(a, 0), on]);
      if (b < 100) fr.push([b, on], [b + 1, off]); else fr.push([100, on]);
    });
    if (wins[wins.length - 1][1] < 100) fr.push([100, off]);
    return kfs(name, fr);
  }
  const vis = (name, wins) => win(name, wins, 'opacity:1', 'opacity:0');

  const T = id => `.t-ratings-${id}`;
  const FULL = 'clip-path:inset(0 0 0 0)', NONE = 'clip-path:inset(0 100% 0 0)', HALF = 'clip-path:inset(0 50% 0 0)';
  const sbtn = label => `<span class="sb sbd">${label}</span><span class="sba">${label}</span>`;

  const common = id => `
${T(id)} .sb,${T(id)} .sba{position:absolute;left:1.39em;right:1.39em;bottom:1.39em;height:3.33em;border-radius:.83em;display:grid;place-items:center;font-size:.72em;font-weight:700}
${T(id)} .sb{background:var(--a-soft);color:#9a9b96}
${T(id)} .sba{background:var(--a-brand);color:#fff;opacity:0}
${T(id)} .pc{position:absolute;left:1em;right:1em;top:4.8em;height:3.6em;display:flex;align-items:center;gap:.8em;padding:0 .8em;border-radius:.8em;background:var(--a-soft)}
${T(id)} .pc .th{flex:none;width:2.2em;height:2.2em;border-radius:.5em;background:#e9d7b5}
${T(id)} .pc b{display:block;font-size:.8em}
${T(id)} .pc span{display:block;font-size:.6em;color:var(--a-mut)}
${T(id)} .q{position:absolute;left:1em;right:1em}
${T(id)} .q b{display:block;font-size:.8em;line-height:1.35}
${T(id)} .st{position:absolute;width:2.1em;height:2.1em}
${T(id)} .st .ol,${T(id)} .st .fl{position:absolute;inset:0}
${T(id)} .st .k-i{display:block;width:100%;height:100%}
${T(id)} .st .ol .k-i{color:#b9b9b4}
${T(id)} .st .fl{${NONE}}
${T(id)} .st .fl .k-i{color:#b87f00;fill:#f2b01e}
${T(id)} .vw{position:absolute;left:0;right:0;height:1.4em}
${T(id)} .vw span{position:absolute;left:0;right:0;text-align:center;font-size:.74em;font-weight:700;opacity:0}
${T(id)} .vw .mut{color:var(--a-mut);font-weight:400}
`;

  const starRow = (K, top, left0, step) => [0, 1, 2, 3, 4].map(i =>
    `<span class="st s${i}" style="left:${f(left0 + i * step)}em;top:${top}em"><span class="ol">${K.icon('star')}</span><span class="fl">${K.icon('star')}</span></span>`).join('');

  const face = (i, d) => {
    const brows = i === 0 ? '<path d="M6.4 7.4L10 8.8M17.6 7.4L14 8.8" stroke="#6b5518" stroke-width="1.3" stroke-linecap="round" fill="none"/>' : '';
    const mouths = [
      '<path d="M7.5 17.2Q12 12.4 16.5 17.2" fill="none"/>',
      '<path d="M8.3 16.4Q12 13.8 15.7 16.4" fill="none"/>',
      '<path d="M8.5 15.2H15.5" fill="none"/>',
      '<path d="M8.3 14Q12 17.4 15.7 14" fill="none"/>',
      '<path d="M7.2 13.2H16.8Q12 20 7.2 13.2Z" fill="#fff"/>'
    ];
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#f4e1a6" stroke="#6b5518" stroke-width="1.2"/>${brows}<circle cx="8.3" cy="10" r="1.15" fill="#6b5518"/><circle cx="15.7" cy="10" r="1.15" fill="#6b5518"/><g stroke="#6b5518" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${mouths[i]}</g></svg>`;
  };

  const NPS_X = i => f(1.125 + (i < 6 ? i : i - 6) * 2.35);
  const NPS_Y = i => i < 6 ? 8.7 : 11.3;

  UIGuide.registerTopic({
    id: 'ratings',
    intro: '사용자의 만족도를 받는 요소예요. 평가를 얼마나 세밀하게 받을지, 이유까지 물을지로 고릅니다. 현재 값은 글로도 알려 줘요.',
    elements: [
      {
        id: 'star', ko: '별점', en: 'Star rating', aka: ['별 평점', '별 다섯 개', '5점 만점'],
        when: '상품, 앱, 장소 후기처럼 사용자에게 익숙한 일반 평가',
        avoid: '세밀한 평가가 필요하거나 별점 해석이 문화적으로 달라 오해가 있을 때(NPS나 설문)',
        notes: [
          '별 크기는 32~44px, 간격은 8px이고, 채운 별과 빈 별의 대비는 3:1이에요.',
          '선택값을 ‘4점 / 5점’처럼 글로도 표시해요.',
          '입력용과 표시용(읽기 전용)을 구분하고, 표시용은 aria-label="5점 중 4.5점"처럼 알려요.'
        ],
        vs: { id: 'half-star', text: '반 별점은 0.5점 단위로 받아요. 별점은 별 하나씩 1점 단위예요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2500,
          phases: [['선택', 900, 1650], ['값 표시', 1700, 4400], ['초기화', 4500, 4800]],
          alt: '후기 쓰기 화면에서 네 번째 별을 누르면 별이 왼쪽부터 네 개 채워지고 ‘4점 / 5점’ 글자와 활성 버튼이 나타났다가 처음 상태로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('후기 쓰기', [], { back: true }) +
            '<div class="pc"><i class="th"></i><div><b>달걀 10구</b><span>받은 지 이틀 됐어요</span></div></div>' +
            '<div class="q" style="top:9.2em"><b>이 상품은 어땠나요?</b></div>' + starRow(K, 10.55, 1.75, 2.6) +
            '<div class="vw" style="top:13.5em"><span class="v0 mut">별을 눌러 평가해요</span><span class="v1">4점 / 5점</span></div>' + sbtn('후기 남기기') + K.tap(10.6, 11.6, 'tp')
        }
      },
      {
        id: 'half-star', ko: '반 별점', en: 'Half-star rating', aka: ['0.5점 단위', '반쪽 별', 'half rating'],
        when: '영화, 책, 음식처럼 세밀한 취향이 갈리는 평가',
        avoid: '모바일 화면이 좁을 때(반쪽을 누르기 어려워요)',
        notes: [
          '별의 왼쪽 절반과 오른쪽 절반을 각각 눌림 영역으로 만들어요.',
          '모바일에서는 탭으로 한 별, 한 번 더 탭으로 반 별, 또는 슬라이드 입력을 써요.',
          '평균 표시는 소수 한 자리로 해요.'
        ],
        vs: { id: 'star', text: '별점은 1점 단위, 반 별점은 별의 왼쪽을 누르면 0.5점이 더해져요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['왼쪽 절반', 1000, 1900], ['3.5점 유지', 1900, 3300], ['오른쪽 절반', 3300, 3800], ['4점 유지', 3800, 5400]],
          alt: '네 번째 별의 왼쪽 절반을 누르면 그 별이 반만 채워져 ‘3.5점’이 되고, 같은 별의 오른쪽 절반을 누르면 꽉 차서 ‘4점’이 되는 시연',
          html: K => K.app.status() + K.app.bar('후기 쓰기', [], { back: true }) +
            '<div class="pc"><i class="th"></i><div><b>해물 파전</b><span>어제 먹었어요</span></div></div>' +
            '<div class="q" style="top:9.2em"><b>맛은 어땠나요?</b></div>' + starRow(K, 10.55, 1.75, 2.6) +
            '<div class="vw" style="top:13.5em"><span class="v0 mut">별을 눌러 평가해요</span><span class="v1">3.5점 / 5점</span><span class="v2">4점 / 5점</span></div>' +
            '<div class="vw" style="top:15.1em"><span class="hint mut">별 왼쪽을 누르면 0.5점이에요</span></div>' + sbtn('후기 남기기') +
            K.tap(10.07, 11.6, 'tp1') + K.tap(11.13, 11.6, 'tp2')
        }
      },
      {
        id: 'nps', ko: 'NPS 점수', en: 'NPS score', aka: ['추천 의향', 'net promoter score', '0~10점'],
        when: '서비스 전반의 충성도를 ‘추천할 의향이 얼마나 되나요’로 물을 때',
        avoid: '개별 콘텐츠나 상품 평가(별점이 맞아요)',
        notes: [
          '11개 버튼을 한 줄에 두면 모바일에서 눌림 영역이 좁아져요. 2줄로 나누거나 폭에 맞게 줄여요.',
          '양 끝 라벨(‘전혀 추천하지 않음’, ‘적극 추천’)을 반드시 표시해요.',
          '0~6 비추천, 7~8 중립, 9~10 추천 집계 기준은 기억해 두되 입력 화면에는 노출하지 않아요.'
        ],
        vs: { id: 'slider', text: '평점 슬라이더는 연속 값이고, NPS는 0부터 10까지 정해진 숫자 버튼 중 하나를 골라요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2500,
          phases: [['선택', 900, 1300], ['선택 유지', 1300, 4400], ['초기화', 4500, 4800]],
          alt: '0부터 10까지 숫자 버튼이 두 줄로 놓인 화면에서 9를 누르면 9 버튼이 주황색으로 채워지고 ‘9점을 골랐어요’와 활성 버튼이 나타났다가 처음으로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('설문', [], { back: true }) +
            '<div class="q" style="top:4.9em"><b>이 앱을 친구에게 추천할 의향이 얼마나 되나요?</b></div>' +
            '<span class="lt l0">0 = 전혀 추천하지 않음</span><span class="lt l1">10 = 적극 추천</span>' +
            Array.from({ length: 11 }, (_, i) => `<span class="nb" style="left:${NPS_X(i)}em;top:${NPS_Y(i)}em"><span>${i}</span></span>`).join('') +
            `<span class="nb nsel" style="left:${NPS_X(9)}em;top:${NPS_Y(9)}em"><span>9</span></span>` +
            '<div class="vw" style="top:15em"><span class="v1 mut">9점을 골랐어요</span></div>' + sbtn('보내기') + K.tap(+(NPS_X(9) + 1).toFixed(2), 12.3, 'tp')
        }
      },
      {
        id: 'emoji', ko: '이모지 평가', en: 'Emoji rating', aka: ['표정 평가', '이모티콘 평점', 'face rating', 'smiley'],
        when: '가벼운 만족도 조사, 어린이·캐주얼 서비스, 빠른 피드백',
        avoid: '정밀한 점수가 필요할 때, 표정의 해석이 모호할 때',
        notes: [
          '표정마다 ‘매우 불만’부터 ‘매우 만족’까지 글 라벨을 달고 접근성 라벨을 필수로 줘요.',
          '색만 믿지 않고 표정 모양으로 구분해요.',
          '선택한 것을 확대나 테두리로 강조해요.'
        ],
        vs: { id: 'thumbs', text: '좋아요 싫어요는 2단계이고, 이모지 평가는 표정 3~5개로 감정의 정도를 나눠요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2500,
          phases: [['선택', 1000, 1300], ['강조 유지', 1300, 4400], ['초기화', 4500, 4800]],
          alt: '다섯 가지 표정이 늘어선 화면에서 네 번째 ‘만족’ 표정을 누르면 그 표정이 커지고 테두리가 생기며 나머지는 흐려지고 ‘만족을 골랐어요’ 글자가 나타나는 시연',
          html: K => K.app.status() + K.app.bar('오늘의 장보기', [], { back: true }) +
            '<div class="q" style="top:5.2em"><b>오늘 장보기는 어땠나요?</b></div>' +
            ['매우 불만', '불만', '보통', '만족', '매우 만족'].map((t, i) => {
              const c = 2.4 + i * 2.8;
              return `<span class="fc fc${i}" style="left:${f(c - 1.1)}em">${face(i)}${i === 3 ? '<i class="rg"></i>' : ''}</span><span class="fn fn${i}" style="left:${f((c - 1.4) / 0.56)}em">${t}</span>`;
            }).join('') +
            '<div class="vw" style="top:13.4em"><span class="v1">‘만족’을 골랐어요</span></div>' + sbtn('보내기') + K.tap(10.8, 10, 'tp')
        }
      },
      {
        id: 'thumbs', ko: '좋아요 싫어요', en: 'Thumbs up/down', aka: ['엄지', '추천 비추천', 'like dislike'],
        when: '콘텐츠, 답변, 추천 품질에 대한 가장 가벼운 긍정·부정 평가',
        avoid: '중간 평가가 의미 있는 곳, 부정 선택 뒤에 이유를 못 받는 것이 아쉬울 때(이유 선택지를 이어서 물어요)',
        notes: [
          '선택된 아이콘은 채움으로 바꾸고, 다시 누르면 취소돼요. 터치 영역은 44px예요.',
          '싫어요를 고르면 짧은 이유 칩을 제안하는 선택형 후속 질문을 이어요.',
          'AI 답변 피드백은 AI 채팅 화면 주제를 참고해요.'
        ],
        vs: { id: 'emoji', text: '이모지 평가는 표정으로 정도를 나누고, 좋아요 싫어요는 긍정과 부정 두 가지뿐이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3200,
          phases: [['싫어요 선택', 600, 1200], ['이유 묻기', 1300, 3900], ['취소', 3800, 4300]],
          alt: '추천 카드 아래에서 싫어요 엄지를 누르면 엄지가 채워지고 이유 칩이 올라오며, 이미 있어요 칩을 고른 뒤 싫어요를 다시 누르면 선택이 취소되고 칩이 사라지는 시연',
          html: K => K.app.status() + K.app.bar('추천', [], { back: true }) +
            '<div class="pc"><i class="th"></i><div><b>제주 감귤 1kg</b><span>이번 주 추천 상품이에요</span></div></div>' +
            '<div class="q" style="top:9.4em"><b>이 추천이 도움이 됐나요?</b></div>' +
            `<span class="tb up" style="left:3.6em">${K.icon('thumbUp')}</span><span class="tb dn" style="left:9.2em">${K.icon('thumbDown')}</span>` +
            '<span class="tl" style="left:6.55em">좋아요</span><span class="tl" style="left:16.73em">별로예요</span>' +
            '<div class="rs"><span class="cp c1">너무 비싸요</span><span class="cp c2">이미 있어요</span><span class="cp c3">취향이 아니에요</span></div>' +
            K.tap(10.8, 12.4, 'tp1') + K.tap(8.5, 16.3, 'tp2') + K.tap(10.8, 12.4, 'tp3')
        }
      },
      {
        id: 'slider', ko: '평점 슬라이더', en: 'Rating slider', aka: ['만족도 슬라이더', '0~10 슬라이더', 'range rating'],
        when: '통증, 만족도, 난이도처럼 정도를 연속적으로 표현해야 할 때',
        avoid: '정확한 값이 중요하거나 키보드와 보조기기로 조작하기 어려운 구성',
        notes: [
          '손잡이 크기는 44px 이상이고, 현재 값을 손잡이 근처 숫자로 보여요.',
          '시작값을 한쪽에 두면 편향이 생겨요. 건드리기 전에는 값이 없는 상태로 두고 선택해야 제출할 수 있게 해요.',
          '양 끝 라벨과 키보드 화살표 조작을 지원해요.'
        ],
        vs: { id: 'nps', text: 'NPS는 정해진 숫자 버튼 중 하나를 고르고, 평점 슬라이더는 연속 값을 끌어서 골라요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3500,
          phases: [['잡기', 1000, 1140], ['끌기', 1140, 3000], ['값 유지', 3000, 5200], ['초기화', 5200, 5500]],
          alt: '아무 값도 없던 슬라이더 트랙을 손가락으로 짚어 오른쪽으로 끌면 손잡이가 나타나 위의 숫자가 5, 6, 7, 8로 커지며 트랙이 주황색으로 채워지고 활성 버튼이 나타나는 시연',
          html: K => K.app.status() + K.app.bar('후기 쓰기', [], { back: true }) +
            '<div class="q" style="top:5.2em"><b>오늘 장보기 만족도</b></div>' +
            '<i class="tr"></i><i class="fi"></i>' +
            '<span class="lt l0 ll">0 별로예요</span><span class="lt l1 lr">10 아주 좋아요</span>' +
            '<span class="hd"><i></i><b class="bb"><span class="b5">5</span><span class="b6">6</span><span class="b7">7</span><span class="b8">8</span></b></span>' +
            '<div class="vw" style="top:13.2em"><span class="v0 mut">움직여서 선택해 주세요</span><span class="v1">8점을 골랐어요</span></div>' + sbtn('후기 남기기') + K.finger(8, 10.2, 'fg')
        }
      },
      {
        id: 'summary', ko: '평점 요약', en: 'Rating summary', aka: ['평점 분포', '리뷰 요약', 'histogram', '평균 평점'],
        when: '상품 상세나 앱 스토어 형태의 후기 상단에서 평균과 분포를 함께 보여 줄 때',
        avoid: '평균만 보여 주는 구성(양극화를 알아볼 수 없어요)',
        notes: [
          '큰 숫자(평균 4.3), 별 표시, 총 평가 수, 5점부터 1점까지의 분포 막대와 비율을 함께 보여요.',
          '막대 색은 하나로 통일하고 라벨은 글로 써요. 숫자는 소수점 한 자리예요.',
          '막대를 누르면 해당 점수의 후기만 걸러 보여요.'
        ],
        vs: { id: 'badge', text: '평점 배지는 ‘★ 4.8’ 한 조각으로 줄인 요약이고, 평점 요약은 분포까지 펼쳐 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3800,
          phases: [['막대 채우기', 700, 1800], ['분포 유지', 1800, 3100], ['5점 거르기', 3150, 5100], ['초기화', 5300, 5600]],
          alt: '평균 4.3 옆에 5점부터 1점까지 분포 막대가 차례로 차오르고, 5점 막대를 누르면 나머지 막대가 흐려지며 ‘5점 후기만 보기’ 칩과 5점 후기만 남는 시연',
          html: K => K.app.status() + K.app.bar('후기', [], { back: true }) +
            `<div class="sm"><b class="bn">4.3</b><span class="ss">${[0, 1, 2, 3].map(() => `<span class="sf">${K.icon('star')}</span>`).join('')}<span class="sf hs"><span class="ol">${K.icon('star')}</span><span class="fl">${K.icon('star')}</span></span></span><em>후기 128개</em></div>` +
            '<div class="bars">' + [['5', 62], ['4', 22], ['3', 9], ['2', 4], ['1', 3]].map(([n, p], i) => `<div class="br r${i + 1}"><em>${n}</em><i class="tr"><b></b></i><span>${p}%</span></div>`).join('') + '</div>' +
            '<span class="fcp">5점 후기만 보기 ×</span>' +
            '<div class="rvs">' + [['5', '신선하고 맛있어요'], ['4', '포장이 꼼꼼했어요'], ['5', '배송이 빨라요']].map(([n, t], i) => `<div class="rv v${i + 1}"><span class="sf">${K.icon('star')}</span><b>${n}</b><span>${t}</span></div>`).join('') + '</div>' +
            K.tap(10, 5.73, 'tp')
        }
      },
      {
        id: 'tags', ko: '평가 태그', en: 'Rating tags', aka: ['이유 태그', '칭찬 태그', 'feedback chips'],
        when: '점수만으로는 이유를 알기 어려운 서비스(배달, 숙소, 운전, 상담)',
        avoid: '선택 태그가 너무 많을 때(8개 이하로), 빠른 평가가 우선인 경우',
        notes: [
          '점수에 따라 긍정 또는 부정 태그 세트를 바꿔 보여 줘요.',
          '칩 형태 다중 선택으로 만들고, 선택 사항으로 두며 직접 입력 칸은 접어 둬요.',
          '개수는 8개 이하로 줄여요.'
        ],
        vs: { id: 'star', text: '별점은 점수 자체를 받고, 평가 태그는 그 점수의 이유를 짧은 칩으로 받아요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3200,
          phases: [['점수 올림', 800, 1900], ['태그 세트 교체', 1200, 1500], ['태그 선택', 1700, 3600], ['초기화', 5400, 5700]],
          alt: '별점을 2점에서 4점으로 올리면 ‘기대와 달랐어요’ 같은 부정 태그가 ‘신선해요’ 같은 긍정 태그로 바뀌고, 칩 두 개를 누르면 선택 표시가 붙는 시연',
          html: K => K.app.status() + K.app.bar('후기 쓰기', [], { back: true }) +
            '<div class="q" style="top:4.8em"><b>달걀 10구는 어땠나요?</b></div>' +
            [0, 1, 2, 3, 4].map(i => `<span class="st s${i}" style="left:${f(1.2 + i * 1.9)}em;top:6.4em"><span class="ol">${K.icon('star')}</span><span class="fl">${K.icon('star')}</span></span>`).join('') +
            '<div class="q" style="top:9.2em"><b class="sub">어떤 점이 그랬나요? (선택)</b></div>' +
            '<div class="cs ng">' + ['기대와 달랐어요', '포장이 아쉬웠어요', '배송이 늦었어요'].map(t => `<span class="cp">${t}</span>`).join('') + '</div>' +
            '<div class="cs ps">' + ['신선해요', '포장이 꼼꼼해요', '가격이 적당해요', '배송이 빨라요'].map((t, i) => `<span class="cp p${i + 1}">${t}</span>`).join('') + '</div>' +
            '<span class="wr">직접 쓰기</span>' + sbtn('후기 남기기').replace('sbd', 'sbd never') +
            K.tap(7.7, 7.2, 'tp0') + K.tap(4.4, 11.2, 'tp1') + K.tap(11.6, 13.7, 'tp2')
        }
      },
      {
        id: 'badge', ko: '평점 배지', en: 'Rating badge', aka: ['평점 표시', '별 4.8', 'rating chip', '평균 평점 배지'],
        when: '목록이나 카드에서 평점을 한눈에 비교하게 해야 할 때',
        avoid: '평가 수 없이 평균만 보여 줘서 건수가 적은 평점을 믿게 만드는 것',
        notes: [
          '별 아이콘, 평균 한 자리, 필요하면 ‘(1,234)’ 같은 평가 수를 함께 써요.',
          '평가가 몇 건 안 되면 평균을 믿기 어려우니 수를 같이 보여 줘요.',
          '글자 대비는 4.5:1이에요. 알림 수를 뜻하는 일반 뱃지와는 다른 요소예요.'
        ],
        vs: { id: 'summary', text: '평점 요약은 분포까지 펼쳐 보여 주고, 평점 배지는 목록에 붙는 작은 한 조각이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3300,
          phases: [['등장', 700, 1950], ['유지', 1950, 2700], ['표본 수 강조', 2760, 4900], ['퇴장', 5300, 5600]],
          alt: '인기 상품 목록의 세 카드에 ‘별 4.8 (1,234)’ 같은 평점 배지가 차례로 튀어나오고, 평가가 3건뿐인 세 번째 카드의 배지에 ‘평가 수가 적으면 수도 같이 보여요’ 안내가 붙는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 인기 상품', [], { back: true }) +
            [['제주 감귤 1kg', '3,900원', '4.8', '(1,234)', '#f0c27a'], ['국산 두부 2모', '2,800원', '4.5', '(856)', '#f2ead9'], ['유기농 대파 1단', '2,400원', '4.9', '(3)', '#b7d4a3']].map(([n, pr, s, c, col], i) =>
              `<div class="cd" style="top:${f(4.6 + i * 4.5)}em"><i class="th" style="background:${col}"></i><div><b>${n}</b><span class="pr">${pr}</span><span class="rb rb${i + 1}">${K.icon('star')}${s} <em>${c}</em>${i === 2 ? '<i class="hr"></i>' : ''}</span></div></div>`).join('') +
            '<div class="co"><span>평가 수가 적으면 수도 같이 보여요</span></div>'
        }
      }
    ],
    css: K => {
      const out = [];
      let t;

      /* star */
      t = T('star');
      out.push(common('star'));
      out.push(`
${[0, 1, 2, 3].map(i => `${t} .s${i} .fl{animation-name:rtStS${i}}`).join('\n')}
${t} .v0{animation-name:rtStV0}${t} .v1{animation-name:rtStV1}
${t} .sbd{animation-name:rtStBd}${t} .sba{animation-name:rtStBa}
${t} .tp{animation-name:rtStTap}
${[0, 1, 2, 3].map(i => kfs('rtStS' + i, [[[0, 19 + i * 3], NONE], [22 + i * 3, FULL], [89, FULL], [93, NONE], [100, NONE]])).join('\n')}
${vis('rtStV0', [[0, 19], [94, 100]])}
${vis('rtStV1', [[34, 90]])}
${vis('rtStBd', [[0, 38], [93, 100]])}
${vis('rtStBa', [[39, 90]])}
${K.kf.tap('rtStTap', 20)}
`);

      /* half-star */
      t = T('half-star');
      out.push(common('half-star'));
      out.push(`
${[0, 1, 2].map(i => `${t} .s${i} .fl{animation-name:rtHsS${i}}`).join('\n')}
${t} .s3 .fl{animation-name:rtHsS3}
${t} .v0{animation-name:rtHsV0}${t} .v1{animation-name:rtHsV1}${t} .v2{animation-name:rtHsV2}
${t} .hint{opacity:1!important}
${t} .sbd{animation-name:rtHsBd}${t} .sba{animation-name:rtHsBa}
${t} .tp1{animation-name:rtHsT1}${t} .tp2{animation-name:rtHsT2}
${[0, 1, 2].map(i => kfs('rtHsS' + i, [[[0, 15 + i * 2], NONE], [18 + i * 2, FULL], [89, FULL], [93, NONE], [100, NONE]])).join('\n')}
${kfs('rtHsS3', [[[0, 17], NONE], [24, HALF], [54, HALF], [60, FULL], [89, FULL], [93, NONE], [100, NONE]])}
${vis('rtHsV0', [[0, 17], [94, 100]])}
${vis('rtHsV1', [[26, 56]])}
${vis('rtHsV2', [[61, 90]])}
${vis('rtHsBd', [[0, 25], [93, 100]])}
${vis('rtHsBa', [[26, 90]])}
${K.kf.tap('rtHsT1', 18)}
${K.kf.tap('rtHsT2', 56)}
`);

      /* nps */
      t = T('nps');
      out.push(common('nps'));
      out.push(`
${t} .lt{position:absolute;font-size:.6em;color:var(--a-mut);white-space:nowrap}
${t} .l0{left:1.88em;top:12.5em}
${t} .l1{right:1.88em;top:22.6em}
${t} .nb{position:absolute;width:2em;height:2em;border-radius:.5em;background:var(--a-soft);display:grid;place-items:center}
${t} .nb span{font-size:.74em;font-weight:700}
${t} .nsel{background:var(--a-brand);color:#fff;opacity:0;animation-name:rtNpSel}
${t} .v1{animation-name:rtNpV1}
${t} .sbd{animation-name:rtNpBd}${t} .sba{animation-name:rtNpBa}
${t} .tp{animation-name:rtNpTap}
${kfs('rtNpSel', [[[0, 20], 'opacity:0;transform:scale(.8)'], [24, 'opacity:1;transform:scale(1)'], [88, 'opacity:1;transform:scale(1)'], [[92, 100], 'opacity:0;transform:scale(1)']])}
${vis('rtNpV1', [[26, 90]])}
${vis('rtNpBd', [[0, 25], [93, 100]])}
${vis('rtNpBa', [[26, 90]])}
${K.kf.tap('rtNpTap', 20)}
`);

      /* emoji */
      t = T('emoji');
      out.push(common('emoji'));
      out.push(`
${t} .fc{position:absolute;top:8.9em;width:2.2em;height:2.2em}
${t} .fc svg{display:block;width:100%;height:100%}
${t} .fn{position:absolute;top:20.5em;width:5em;text-align:center;font-size:.56em;color:var(--a-mut)}
${t} .fn{left:auto}
${t} .rg{position:absolute;inset:-.25em;border-radius:50%;border:.14em solid var(--a-brand);opacity:0;animation-name:rtEmRg}
${t} .fc0,${t} .fc1,${t} .fc2,${t} .fc4{animation-name:rtEmDim}
${t} .fc3{animation-name:rtEmPick}
${t} .fn3{animation-name:rtEmLab}
${t} .v1{animation-name:rtEmV1}
${t} .sbd{animation-name:rtEmBd}${t} .sba{animation-name:rtEmBa}
${t} .tp{animation-name:rtEmTap}
${kfs('rtEmDim', [[[0, 20], 'opacity:1'], [24, 'opacity:.38'], [88, 'opacity:.38'], [[92, 100], 'opacity:1']])}
${kfs('rtEmPick', [[[0, 20], 'transform:scale(1)'], [24, 'transform:scale(1.3)'], [88, 'transform:scale(1.3)'], [[92, 100], 'transform:scale(1)']])}
${kfs('rtEmLab', [[[0, 20], 'color:var(--a-mut)'], [24, 'color:var(--a-ink)'], [88, 'color:var(--a-ink)'], [[92, 100], 'color:var(--a-mut)']])}
${vis('rtEmRg', [[24, 88]])}
${vis('rtEmV1', [[26, 90]])}
${vis('rtEmBd', [[0, 25], [93, 100]])}
${vis('rtEmBa', [[26, 90]])}
${K.kf.tap('rtEmTap', 20)}
`);

      /* thumbs */
      t = T('thumbs');
      out.push(common('thumbs'));
      out.push(`
${t} .tb{position:absolute;top:10.8em;width:3.2em;height:3.2em;border-radius:50%;background:var(--a-soft);display:grid;place-items:center}
${t} .tb .k-i{width:1.5em;height:1.5em}
${t} .dn .k-i{animation-name:rtThFill}
${t} .tl{position:absolute;top:26em;width:5.82em;text-align:center;font-size:.55em;color:var(--a-mut)}
${t} .rs{position:absolute;left:1em;right:1em;top:15.4em;display:flex;flex-wrap:wrap;gap:.45em;animation-name:rtThRs}
${t} .cp{display:inline-flex;align-items:center;height:2.8em;padding:0 1em;border-radius:1.5em;background:var(--a-soft);color:var(--a-ink);font-size:.62em;white-space:nowrap}
${t} .c2{animation-name:rtThC2}
${t} .tp1{animation-name:rtThT1}${t} .tp2{animation-name:rtThT2}${t} .tp3{animation-name:rtThT3}
${kfs('rtThFill', [[[0, 13], 'fill:transparent;transform:scale(1)'], [16, 'fill:var(--a-ink);transform:scale(1.25)'], [[20, 64], 'fill:var(--a-ink);transform:scale(1)'], [[68, 100], 'fill:transparent;transform:scale(1)']])}
${kfs('rtThRs', [[[0, 18], 'opacity:0;transform:translateY(.5em)'], [24, 'opacity:1;transform:none'], [66, 'opacity:1;transform:none'], [[72, 100], 'opacity:0;transform:translateY(.5em)']])}
${kfs('rtThC2', [[[0, 42], 'background:var(--a-soft);color:var(--a-ink)'], [45, 'background:#f6d9ca;color:#8a3410'], [66, 'background:#f6d9ca;color:#8a3410'], [[72, 100], 'background:var(--a-soft);color:var(--a-ink)']])}
${K.kf.tap('rtThT1', 14)}
${K.kf.tap('rtThT2', 42)}
${K.kf.tap('rtThT3', 64)}
`);

      /* slider */
      t = T('slider');
      out.push(common('slider'));
      out.push(`
${t} .tr,${t} .fi{position:absolute;left:2em;top:10.05em;width:12em;height:.3em;border-radius:1em}
${t} .tr{background:#dcdcd7}
${t} .fi{background:var(--a-brand);transform-origin:left;opacity:0;animation-name:rtSlFi}
${t} .lt{position:absolute;top:19.17em;font-size:.6em;color:var(--a-mut);white-space:nowrap}
${t} .ll{left:3.33em}${t} .lr{right:3.33em}
${t} .hd{position:absolute;left:7.1em;top:9.3em;width:1.8em;height:1.8em;opacity:0;animation-name:rtSlHd}
${t} .hd i{position:absolute;inset:0;border-radius:50%;background:#fff;border:.18em solid var(--a-brand);box-shadow:0 .15em .5em rgba(20,20,22,.2)}
${t} .bb{position:absolute;left:50%;bottom:2.2em;transform:translateX(-50%);min-width:1.7em;height:1.7em;border-radius:.5em;background:var(--a-dark);color:#fff;display:grid;place-items:center}
${t} .bb span{grid-area:1/1;font-size:.8em;font-weight:700;opacity:0}
${t} .b5{animation-name:rtSlB5}${t} .b6{animation-name:rtSlB6}${t} .b7{animation-name:rtSlB7}${t} .b8{animation-name:rtSlB8}
${t} .v0{animation-name:rtSlV0}${t} .v1{animation-name:rtSlV1}
${t} .sbd{animation-name:rtSlBd}${t} .sba{animation-name:rtSlBa}
${t} .fg{animation-name:rtSlF}
${kfs('rtSlFi', [[[0, 17], 'opacity:0;transform:scaleX(.5)'], [19, 'opacity:1;transform:scaleX(.5)'], [52, 'opacity:1;transform:scaleX(.783)'], [86, 'opacity:1;transform:scaleX(.783)'], [90, 'opacity:0;transform:scaleX(.783)'], [100, 'opacity:0;transform:scaleX(.5)']])}
${kfs('rtSlHd', [[[0, 17], 'opacity:0;transform:translateX(0) scale(.6)'], [19, 'opacity:1;transform:translateX(0) scale(1)'], [52, 'opacity:1;transform:translateX(3.4em) scale(1)'], [86, 'opacity:1;transform:translateX(3.4em) scale(1)'], [90, 'opacity:0;transform:translateX(3.4em) scale(.6)'], [100, 'opacity:0;transform:translateX(0) scale(.6)']])}
${vis('rtSlB5', [[19, 24]])}${vis('rtSlB6', [[25, 33]])}${vis('rtSlB7', [[34, 43]])}${vis('rtSlB8', [[44, 88]])}
${vis('rtSlV0', [[0, 17], [94, 100]])}
${vis('rtSlV1', [[46, 88]])}
${vis('rtSlBd', [[0, 20], [93, 100]])}
${vis('rtSlBa', [[21, 90]])}
${K.kf.drag('rtSlF', 17, 50, 3.4, 0)}
`);

      /* summary */
      t = T('summary');
      const R = [0.62, 0.22, 0.09, 0.04, 0.03];
      out.push(common('summary'));
      out.push(`
${t} .sm{position:absolute;left:1.2em;top:4.9em;width:5.2em}
${t} .bn{display:block;font-size:2.6em;line-height:1;font-weight:900}
${t} .ss{display:flex;gap:.12em;margin-top:.5em}
${t} .sf{position:relative;display:block;width:.95em;height:.95em}
${t} .sf .k-i{display:block;width:100%;height:100%;color:#b87f00;fill:#f2b01e}
${t} .sf.hs .ol,${t} .sf.hs .fl{position:absolute;inset:0}
${t} .sf.hs .ol .k-i{color:#b9b9b4;fill:none}
${t} .sf.hs .fl{clip-path:inset(0 70% 0 0)}
${t} .sm em{display:block;margin-top:.5em;font-style:normal;font-size:.6em;color:var(--a-mut)}
${t} .bars{position:absolute;left:6.6em;right:1em;top:5.1em}
${t} .br{display:flex;align-items:center;gap:.5em;height:1.25em}
${t} .br em{width:.8em;font-style:normal;font-size:.62em;font-weight:700;color:var(--a-mut);text-align:center}
${t} .br .tr{position:relative;flex:1;height:.5em;border-radius:1em;background:var(--a-soft);overflow:hidden}
${t} .br .tr b{position:absolute;inset:0;border-radius:1em;background:var(--a-brand);transform-origin:left;transform:scaleX(0)}
${t} .br span{width:3em;white-space:nowrap;font-size:.6em;color:var(--a-mut);text-align:right;opacity:0}
${R.map((r, i) => `${t} .r${i + 1} .tr b{animation-name:rtSmB${i}}${t} .r${i + 1} span{animation-name:rtSmP${i}}`).join('\n')}
${[2, 3, 4, 5].map(n => `${t} .r${n}{animation-name:rtSmDim}`).join('\n')}
${t} .fcp{position:absolute;left:1.67em;top:18.5em;padding:.35em .9em;border-radius:2em;background:#f6d9ca;color:#8a3410;font-size:.6em;font-weight:700;white-space:nowrap;opacity:0;animation-name:rtSmChip}
${t} .rvs{position:absolute;left:1em;right:1em;top:12.4em}
${t} .rv{display:flex;align-items:center;gap:.4em;height:2em;border-top:1px solid var(--a-line)}
${t} .rv .sf{width:.85em;height:.85em}
${t} .rv b{font-size:.7em}
${t} .rv span:last-child{font-size:.7em;margin-left:.3em}
${t} .v2{animation-name:rtSmV2}
${t} .tp{animation-name:rtSmTap}
${R.map((r, i) => kfs('rtSmB' + i, [[[0, 12 + i * 3], 'transform:scaleX(0)'], [22 + i * 3, `transform:scaleX(${r})`], [88, `transform:scaleX(${r})`], [[93, 100], 'transform:scaleX(0)']])).join('\n')}
${R.map((r, i) => vis('rtSmP' + i, [[20 + i * 3, 90]])).join('\n')}
${kfs('rtSmDim', [[[0, 50], 'opacity:1'], [54, 'opacity:.3'], [84, 'opacity:.3'], [[88, 100], 'opacity:1']])}
${vis('rtSmChip', [[56, 86]])}
${kfs('rtSmV2', [[[0, 55], 'opacity:1'], [58, 'opacity:.2'], [84, 'opacity:.2'], [[88, 100], 'opacity:1']])}
${K.kf.tap('rtSmTap', 52)}
`);

      /* tags */
      t = T('tags');
      out.push(common('tags'));
      out.push(`
${t} .st{width:1.6em;height:1.6em}
${t} .s0 .fl,${t} .s1 .fl{${FULL}}
${t} .s2 .fl{animation-name:rtTgS2}${t} .s3 .fl{animation-name:rtTgS3}
${t} .sub{font-size:.66em!important;color:var(--a-mut);font-weight:400!important}
${t} .cs{position:absolute;left:1em;right:1em;top:10.2em;display:grid;grid-template-columns:1fr 1fr;gap:.5em}
${t} .cp{display:grid;place-items:center;height:2em;border-radius:1em;background:var(--a-soft);font-size:.62em;white-space:nowrap}
${t} .ng{animation-name:rtTgNg}${t} .ps{animation-name:rtTgPs}
${t} .p1{animation-name:rtTgP1}${t} .p4{animation-name:rtTgP4}
${t} .wr{position:absolute;left:1.61em;top:26.6em;font-size:.62em;color:var(--a-mut);text-decoration:underline}
${t} .sbd.never{display:none}
${t} .sbd.never+.sba{opacity:1}
${t} .tp0{animation-name:rtTgT0}${t} .tp1{animation-name:rtTgT1}${t} .tp2{animation-name:rtTgT2}
${kfs('rtTgS2', [[[0, 13], NONE], [16, FULL], [89, FULL], [93, NONE], [100, NONE]])}
${kfs('rtTgS3', [[[0, 16], NONE], [19, FULL], [89, FULL], [93, NONE], [100, NONE]])}
${vis('rtTgNg', [[0, 18], [93, 100]])}
${vis('rtTgPs', [[22, 91]])}
${kfs('rtTgP1', [[[0, 30], 'background:var(--a-soft);color:var(--a-ink)'], [33, 'background:#f6d9ca;color:#8a3410'], [88, 'background:#f6d9ca;color:#8a3410'], [[92, 100], 'background:var(--a-soft);color:var(--a-ink)']])}
${kfs('rtTgP4', [[[0, 44], 'background:var(--a-soft);color:var(--a-ink)'], [47, 'background:#f6d9ca;color:#8a3410'], [88, 'background:#f6d9ca;color:#8a3410'], [[92, 100], 'background:var(--a-soft);color:var(--a-ink)']])}
${K.kf.tap('rtTgT0', 14)}
${K.kf.tap('rtTgT1', 30)}
${K.kf.tap('rtTgT2', 44)}
`);

      /* badge */
      t = T('badge');
      out.push(common('badge'));
      out.push(`
${t} .cd{position:absolute;left:1em;right:1em;height:4em;display:flex;align-items:center;gap:.9em;padding:0 .9em;border-radius:.8em;background:var(--a-soft)}
${t} .cd .th{flex:none;width:2.4em;height:2.4em;border-radius:.6em}
${t} .cd b{display:block;font-size:.74em}
${t} .cd .pr{display:block;font-size:.6em;color:var(--a-mut)}
${t} .rb{position:relative;display:inline-flex;align-items:center;gap:.25em;margin-top:.35em;padding:.2em .6em;border-radius:2em;background:#fdecc4;color:#5a3d00;font-size:.64em;font-weight:700;transform:scale(0)}
${t} .rb .k-i{width:.95em;height:.95em;fill:#d99a14;stroke:#d99a14}
${t} .rb em{font-style:normal;font-weight:400}
${t} .rb1{animation-name:rtBdP1}${t} .rb2{animation-name:rtBdP2}${t} .rb3{animation-name:rtBdP3}
${t} .hr{position:absolute;inset:-.3em;border-radius:2em;border:.14em solid var(--a-brand);opacity:0;animation-name:rtBdHr}
${t} .co{position:absolute;z-index:12;left:1.2em;right:1.2em;top:18.2em;padding:.55em .9em;border-radius:.6em;background:var(--a-dark);color:#f4f4f2;opacity:0;animation-name:rtBdCo}
${t} .co span{font-size:.62em}
${t} .co::before{content:"";position:absolute;left:5.2em;top:-.3em;width:.6em;height:.6em;background:inherit;transform:rotate(45deg)}
${[[1, 14], [2, 22], [3, 30]].map(([n, a]) => kfs('rtBdP' + n, [[[0, a - 3], 'opacity:0;transform:scale(.6)'], [a + 2, 'opacity:1;transform:scale(1.12)'], [a + 5, 'opacity:1;transform:scale(1)'], [88, 'opacity:1;transform:scale(1)'], [[92, 100], 'opacity:0;transform:scale(.6)']])).join('\n')}
${vis('rtBdHr', [[46, 82]])}
${vis('rtBdCo', [[46, 82]])}
`);

      return out.join('\n');
    }
  });
})();
