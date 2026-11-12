/* Topic: 디자인 스타일 (design-styles). Reference: plugins/design-master/references/styles.md
   Every style draws the same shopping memo card and "담기" button so only the material changes.
   Selectors use "&" as a placeholder for .t-design-styles-<element>; see E() below. Keyframe prefix: ds. */
(function () {
  const IDS = ['skeuomorphism', 'flat', 'material', 'neumorphism', 'glassmorphism', 'claymorphism', 'neo-brutalism', 'icon-3d', 'liquid-glass'];
  const E = (id, css) => css.replace(/&/g, '.t-design-styles-' + id);

  const memo = (K, cap) => '<i class="bg"></i><i class="o1"></i><i class="o2"></i><i class="o3"></i>' +
    '<div class="card"><b>장보기 메모</b><ul>' +
    ['우유 2L', '달걀 10구', '두부'].map(t => `<li><i></i><span>${t}</span></li>`).join('') +
    '</ul><div class="btn"><span>담기</span></div></div>' +
    `<span class="cap">${cap}</span>` + K.tap(10.25, 7.8, 'tp');

  const SHARED = `
& .bg{position:absolute;inset:0}
& .o1,& .o2,& .o3{position:absolute;display:none;border-radius:50%}
& .card{position:absolute;left:3.2em;top:1.3em;width:9.6em;height:8.2em;padding:.9em 1em}
& .card b{display:block;font-size:.8em}
& .card ul{list-style:none;margin:.5em 0 0;padding:0}
& .card li{display:flex;align-items:center;gap:.55em;height:1.6em}
& .card li i{flex:none;width:.85em;height:.85em}
& .card li span{font-size:.62em}
& .btn{position:absolute;right:.9em;bottom:.8em;height:1.8em;padding:0 1em;display:grid;place-items:center}
& .btn span{font-size:.62em;font-weight:700;position:relative}
& .cap{position:absolute;left:0;right:0;bottom:.5em;text-align:center;font-size:.55em;font-weight:700}
& .tp{animation-name:dsTap}`;

  UIGuide.registerTopic({
    id: 'design-styles',
    intro: '화면 전체의 질감과 분위기를 정하는 선택지예요. 스타일은 장식이 아니라 사용성과 접근성에 영향을 줘요. 이미 쓰는 스타일이 있으면 따르고, 한 화면에 여러 스타일을 섞지 않아요. 같은 장보기 메모 카드를 스타일마다 그려 차이를 보여 드려요.',
    elements: [
      {
        id: 'skeuomorphism', ko: '스큐어모피즘', en: 'Skeuomorphism', aka: ['실물 질감', '사실적 디자인'],
        when: '악기, 계산기, 도구처럼 실제 물건을 모사하는 앱, 게임 UI, 교육용',
        avoid: '장식이 정보를 가려 대비가 낮아지는 화면, 에셋이 많아 성능과 해상도 대응이 부담되는 제품',
        notes: [
          '다층 box-shadow(바깥과 inset)와 linear-gradient 광택, 이미지 텍스처(background-image)로 질감을 만들고 해상도별 에셋은 image-set으로 내려요.',
          '버튼 눌림은 inset 그림자로 표현해요.',
          '접근성 위험은 낮음~중간. 장식이 정보를 가려 대비가 낮아지기 쉬우니 질감 위 글자 대비를 꼭 확인해요.'
        ],
        vs: { id: 'flat', text: '플랫은 질감과 그림자를 걷어 내고 색과 모양만 써요. 스큐어모피즘은 실제 사물의 질감과 그림자를 세밀하게 흉내 내요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2300,
          phases: [['대기', 0, 1800], ['눌림 유지', 2000, 2400], ['복귀', 2600, 3000]],
          alt: '나무 책상 위 가죽 띠가 달린 종이 메모와 금속 버튼을 보여 주고, 버튼을 누르면 버튼이 안쪽으로 들어가며 그림자가 줄었다가 되돌아오는 시연',
          html: K => memo(K, '질감, 광택, 다층 그림자')
        }
      },
      {
        id: 'flat', ko: '플랫 디자인', en: 'Flat design', aka: ['플랫', '단색 면'],
        when: '대부분의 웹·모바일 서비스의 기본 선택, 업무 도구, 빠른 로딩이 필요한 제품',
        avoid: '눌러야 하는 요소가 장식과 구분되지 않는 화면(버튼에 면색이나 윤곽선을 확실히)',
        notes: [
          '단색 background와 border-radius를 쓰고 그림자는 없애거나 아주 약한 한 단계만 둬요. 색 토큰을 중심으로 위계를 만들어요.',
          '접근성 위험은 낮음. 눌러야 하는 요소가 장식과 구분되지 않아 클릭 가능성이 모호해지기 쉬워요.',
          '버튼에 면색이나 윤곽선을 확실히 주고 포커스 링을 명시해요.'
        ],
        vs: { id: 'material', text: '머티리얼은 높이 단계별 그림자와 상태 레이어 같은 규칙이 있는 시스템이고, 플랫은 그림자까지 줄여 색과 모양만 써요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2300,
          phases: [['대기', 0, 1800], ['눌림 유지', 2000, 2400], ['복귀', 2600, 3000]],
          alt: '그림자 없는 흰 메모 카드와 단색 담기 버튼을 보여 주고, 버튼을 누르면 색만 살짝 진해졌다가 돌아오는 시연',
          html: K => memo(K, '단색 면, 그림자 없음')
        }
      },
      {
        id: 'material', ko: '머티리얼', en: 'Material design', aka: ['머티리얼 디자인', '구글 디자인'],
        when: '안드로이드 앱, 구글 계열 느낌의 웹, 컴포넌트 라이브러리를 그대로 쓰는 업무 도구',
        avoid: '터치 48dp와 대비 같은 규칙을 깨뜨리며 마음대로 커스터마이징할 때',
        notes: [
          '공식 컴포넌트 라이브러리(Material Web, MUI 등)와 디자인 토큰을 쓰고, 직접 구현하면 토큰을 한 곳에 정의해요.',
          '높이 단계별 그림자, 상태 레이어(hover와 pressed에 반투명 덮개), 리플 효과를 써요.',
          '접근성 위험은 낮음. 시스템이 대비와 터치 영역을 규정하지만 커스터마이징하면서 규칙(터치 48dp, 대비)을 깨기 쉬워요.'
        ],
        vs: { id: 'flat', text: '플랫은 그림자와 규칙 없이 색 면만 쓰고, 머티리얼은 종이가 쌓인 듯한 높이(elevation)와 모션 규칙이 정해져 있어요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2300,
          phases: [['대기', 0, 1800], ['리플 퍼짐', 2000, 2700], ['복귀', 2700, 3100]],
          alt: '살짝 떠 있는 흰 카드와 담기 버튼을 보여 주고, 버튼을 누르면 누른 자리에서 물결 모양 리플이 퍼지고 버튼이 더 높이 떠올랐다 돌아오는 시연',
          html: K => memo(K, '높이 단계, 리플, 상태 레이어')
        }
      },
      {
        id: 'neumorphism', ko: '뉴모피즘', en: 'Neumorphism', aka: ['소프트 UI', 'soft UI'],
        when: '장식적 목업, 스마트홈 컨트롤, 제한된 소수의 버튼이 있는 단순 화면',
        avoid: '실제 제품의 중요한 요소(요소와 배경의 대비가 매우 낮고 활성과 비활성 구분이 어려워요)',
        notes: [
          'box-shadow: 8px 8px 16px 어두운색, -8px -8px 16px 밝은색을 함께 쓰고 눌림은 inset으로 바꿔요. 배경은 중간 명도의 단색이에요.',
          '접근성 위험은 높음. 요소와 배경의 대비가 매우 낮고 활성과 비활성, 포커스 구분이 어려워요. 글자 색은 배경과 4.5:1이 되는지 직접 계산해요.',
          '실제 제품에서는 중요한 요소에 쓰지 않거나 윤곽선과 색 구분을 반드시 더해요.'
        ],
        vs: { id: 'claymorphism', text: '클레이모피즘은 부드러운 색과 안팎 그림자로 통통한 입체를 만들고 배경과 색이 구분돼요. 뉴모피즘은 배경과 같은 색이라 경계가 흐려요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2300,
          phases: [['대기', 0, 1800], ['눌림 유지', 2000, 2400], ['복귀', 2600, 3000]],
          alt: '배경과 같은 회색 위에 돋아난 카드와 버튼을 보여 주고, 버튼을 누르면 버튼이 돋은 모양에서 눌린 모양으로 바뀌었다가 돌아오는 시연',
          html: K => memo(K, '배경과 같은 색, 돋고 눌림')
        }
      },
      {
        id: 'glassmorphism', ko: '글래스모피즘', en: 'Glassmorphism', aka: ['유리 효과', '블러 카드', 'frosted glass'],
        when: '날씨, 음악, 대시보드 위 카드 오버레이, 배경 이미지나 그라디언트가 있는 소비자 앱',
        avoid: '복잡한 글이 뒤에 깔린 화면(배경이 바뀌면 글자 대비도 바뀌어요)',
        notes: [
          'background: rgba(255,255,255,0.12~0.25), backdrop-filter: blur(12~24px) saturate(1.2), border: 1px solid rgba(255,255,255,0.2~0.3)을 써요.',
          '@supports not (backdrop-filter: blur(1px))에 불투명한 대체 배경을 두고, 글자 아래에 충분히 어두운(또는 밝은) 오버레이를 깔아요.',
          '접근성 위험은 중간~높음. 뒤 배경이 바뀌면 글자 대비가 바뀌니 가장 밝고 가장 복잡한 배경 위에서 확인해요. 흐림 효과는 성능 비용이 커요.'
        ],
        vs: { id: 'liquid-glass', text: '리퀴드 글래스는 Apple 플랫폼의 재질로 형태를 바꾸며 반응하고, 글래스모피즘은 반투명 흐림 카드가 배경 위에 가만히 떠 있어요.' },
        demo: {
          frame: 'bare', cycle: 5000, still: 2800,
          phases: [['배경 이동', 0, 4000], ['눌림', 2400, 3000]],
          alt: '색 원들이 천천히 움직이는 어두운 배경 위에 반투명 흐림 카드가 떠 있어 뒤의 색이 번져 보이고, 담기 버튼을 누르면 버튼의 유리 막이 잠깐 밝아지는 시연',
          html: K => memo(K, '반투명, 배경 흐림, 얇은 테두리')
        }
      },
      {
        id: 'claymorphism', ko: '클레이모피즘', en: 'Claymorphism', aka: ['점토 스타일', 'clay'],
        when: '어린이·교육 앱, 친근한 브랜드, 일러스트 중심 랜딩',
        avoid: '글자 대비가 중요한 정보 밀도 높은 화면(파스텔 위 글자 대비가 낮기 쉬워요)',
        notes: [
          '큰 border-radius(20~32px), 이중 inset 그림자(inset 0 -8px 12px 어두운색, inset 0 8px 12px 밝은색)와 바깥 box-shadow: 0 12px 24px rgba(…,0.2)를 겹쳐요.',
          '색은 같은 계열의 두세 톤으로 제한하고 글자는 짙은 색으로 대비를 확보해요.',
          '접근성 위험은 중간. 파스텔 위 글자 대비가 낮기 쉽고 큰 그림자가 정보 밀도를 낮춰요.'
        ],
        vs: { id: 'neumorphism', text: '뉴모피즘은 배경과 같은 색에서 솟고 눌려 경계가 흐리고, 클레이모피즘은 말랑한 색 덩어리가 배경과 구분돼 통통하게 보여요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2300,
          phases: [['대기', 0, 1800], ['찌그러짐', 2000, 2500], ['복원', 2500, 3100]],
          alt: '분홍 점토처럼 둥글고 통통한 카드와 담기 버튼을 보여 주고, 버튼을 누르면 말랑하게 납작해졌다가 탄력 있게 되돌아오는 시연',
          html: K => memo(K, '둥근 덩어리, 안팎 그림자')
        }
      },
      {
        id: 'neo-brutalism', ko: '네오 브루탈리즘', en: 'Neo brutalism', aka: ['브루탈리즘', 'neobrutalism'],
        when: '개발자·크리에이터 도구, 신생 브랜드의 개성 강한 랜딩, 캐주얼 앱',
        avoid: '모든 요소를 같은 강도로 강조해 위계가 사라질 때(강조는 한 곳에만)',
        notes: [
          'border: 2~3px solid #000과 box-shadow: 4px 4px 0 #000(블러 0)를 쓰고, 눌림은 transform: translate(2px, 2px)와 그림자 축소로 표현해요.',
          '모서리는 각지게(0~8px), 색 팔레트는 3~4개로 제한해요.',
          '접근성 위험은 낮음. 대비가 높아 읽기 쉽지만 색이 강해 눈이 피로하고 정보 위계가 모두 같은 강도가 되기 쉬워요.'
        ],
        vs: { id: 'flat', text: '플랫은 윤곽선과 그림자 없이 색 면만 쓰고, 네오 브루탈리즘은 굵은 검은 테두리와 번지지 않는 단단한 그림자를 드러내요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2300,
          phases: [['대기', 0, 1800], ['눌림 유지', 2000, 2400], ['복귀', 2600, 3000]],
          alt: '굵은 검은 테두리와 단단한 그림자가 있는 노란 바탕 카드와 주황 버튼을 보여 주고, 버튼을 누르면 그림자 쪽으로 내려앉으며 그림자가 사라졌다가 돌아오는 시연',
          html: K => memo(K, '굵은 테두리, 번지지 않는 그림자')
        }
      },
      {
        id: 'icon-3d', ko: '3D 아이콘', en: '3D icon', aka: ['입체 아이콘', '3D 일러스트'],
        when: '기능 소개 랜딩, 온보딩 일러스트, 빈 화면, 보상 연출',
        avoid: '탭바, 툴바 같은 작은 UI 아이콘(입체감이 뭉개져요)',
        notes: [
          'PNG, WebP 또는 SVG와 <picture>로 해상도에 대응하고, 배경은 투명하게 두고 다크 모드에서는 그림자 색을 조정해요.',
          '같은 광원(왼쪽 위)과 같은 각도로 세트를 통일하고, 용량 제한을 위해 지연 로딩을 써요.',
          '접근성 위험은 낮음. 장식 이미지는 alt=""로 처리하고 의미는 글로 전달해요. 에셋 용량과 다크 모드 대응이 부담이에요.'
        ],
        vs: { id: 'claymorphism', text: '클레이모피즘은 UI 요소 전체의 질감이고, 3D 아이콘은 보통 이미지 에셋으로 쓰는 입체 일러스트예요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 1000,
          phases: [['떠오름', 0, 1800], ['내려앉음', 1800, 3600]],
          alt: '목록, 완료, 알림을 뜻하는 입체 아이콘 세 개가 같은 왼쪽 위 광원으로 빛나며 시차를 두고 위아래로 둥실 떠오르고, 바닥 그림자가 함께 커졌다 작아지는 시연',
          html: K => '<i class="bg"></i>' +
            [['1', 'list'], ['2', 'checkCircle'], ['3', 'bell']].map(([n, ic]) => `<i class="sh sh${n}"></i><div class="ic ic${n}"><i class="gl"></i>${K.icon(ic)}</div>`).join('') +
            '<span class="cap">같은 광원, 같은 각도</span>'
        }
      },
      {
        id: 'liquid-glass', ko: '리퀴드 글래스', en: 'Liquid glass', aka: ['유동 유리', 'Apple glass'],
        when: 'Apple 플랫폼의 네이티브 앱(시스템 컴포넌트가 제공), 같은 느낌을 낸 소비자 웹',
        avoid: '배경에 따라 글자 대비가 흔들리는 화면, 움직임이 부담스러운 사용자 환경',
        notes: [
          'Apple 플랫폼(iOS, macOS 등)이 제시한 재질이에요. 웹에서는 네이티브 재질을 그대로 재현할 수 없고 backdrop-filter: blur() saturate() 기반의 근사(반투명 배경, 안쪽 하이라이트 테두리, 미세한 그라디언트)예요. 네이티브 앱은 시스템 컴포넌트를 쓰는 편이 정확해요.',
          '접근성 위험은 중간~높음. 글래스모피즘처럼 배경에 따라 대비가 흔들리고 움직임이 많아요. Apple의 투명도 감소와 모션 감소 설정을 존중하고, prefers-reduced-motion이 켜지면 정적인 대체를 보여요.',
          'prefers-reduced-transparency는 브라우저 지원이 제한적이에요. 이 쿼리가 없어도 읽히도록 기본 배경 불투명도를 글자 대비 4.5:1이 되게 충분히 높게 잡고, 지원되는 환경에서만 불투명 대체를 더해요.'
        ],
        vs: { id: 'glassmorphism', text: '글래스모피즘은 반투명 흐림 카드가 가만히 떠 있고, 리퀴드 글래스는 Apple 플랫폼의 재질로 빛이 흐르고 형태가 변하며 반응해요.' },
        demo: {
          frame: 'bare', cycle: 5000, still: 2800,
          phases: [['빛 이동', 500, 2000], ['눌림과 변형', 2400, 3400]],
          alt: '어두운 배경 위 두꺼운 유리 카드 위로 밝은 빛이 지나가고, 담기 버튼을 누르면 유리 버튼이 늘어났다 눌리며 출렁이다 제자리로 돌아오는 시연(웹에서는 근사 표현)',
          html: K => memo(K, '웹 근사: 빛 이동, 출렁이는 형태')
        }
      }
    ],
    css: K => [
      IDS.map(id => E(id, SHARED)).join('\n'),
      K.kf.tap('dsTap', 48),

      E('skeuomorphism', `
& .bg{background:repeating-linear-gradient(90deg,#7a4b2a 0 .6em,#6d4224 .6em 1.1em,#835230 1.1em 1.9em)}
& .card{background:#f7efd0;border-radius:.25em;box-shadow:0 .5em 1em rgba(0,0,0,.5),inset 0 0 .1em rgba(255,255,255,.9)}
& .card::before{content:"";position:absolute;left:0;right:0;top:0;height:.5em;border-radius:.25em .25em 0 0;background:#5a3418}
& .card::after{content:"";position:absolute;left:.3em;right:.3em;top:.22em;border-top:.07em dashed #d9b27a}
& .card b{margin-top:.2em;color:#4a2f14}
& .card li{border-bottom:1px solid rgba(80,110,160,.4);color:#3b3226}
& .card li i{border-radius:.2em;background:#efe5c0;box-shadow:inset 0 .08em .15em rgba(0,0,0,.45)}
& .btn{border-radius:.35em;background:linear-gradient(#f3f3f3,#bdbdbd 55%,#a6a6a6);color:#2f2f2f;box-shadow:0 .16em 0 #6e6e6e,0 .35em .5em rgba(0,0,0,.4),inset 0 .06em 0 rgba(255,255,255,.9);animation-name:dsSkBtn}
& .btn span{text-shadow:0 .06em 0 rgba(255,255,255,.8)}
& .cap{color:#f0d9b8}
@keyframes dsSkBtn{0%,46%{transform:none;box-shadow:0 .16em 0 #6e6e6e,0 .35em .5em rgba(0,0,0,.4),inset 0 .06em 0 rgba(255,255,255,.9)}50%,58%{transform:translateY(.14em);box-shadow:0 .02em 0 #6e6e6e,0 .08em .15em rgba(0,0,0,.4),inset 0 .12em .3em rgba(0,0,0,.4)}64%,100%{transform:none;box-shadow:0 .16em 0 #6e6e6e,0 .35em .5em rgba(0,0,0,.4),inset 0 .06em 0 rgba(255,255,255,.9)}}`),

      E('flat', `
& .bg{background:#e9ece8}
& .card{background:#fff;border-radius:.6em}
& .card b{color:#1d1e20}
& .card li{color:#1d1e20}
& .card li i{border:.1em solid #9aa0a6;border-radius:.2em;background:#fff}
& .card li:first-child i{background:var(--a-brand);border-color:var(--a-brand)}
& .btn{border-radius:.4em;background:var(--a-brand);color:#fff;animation-name:dsFlBtn}
& .cap{color:#686a6f}
@keyframes dsFlBtn{0%,46%{background:#c24719;transform:none}50%,58%{background:#8f3411;transform:scale(.97)}64%,100%{background:#c24719;transform:none}}`),

      E('material', `
& .bg{background:#f4efe8}
& .card{background:#fff;border-radius:.7em;box-shadow:0 .05em .12em rgba(0,0,0,.2),0 .1em .35em rgba(0,0,0,.14)}
& .card b{color:#1d1e20}
& .card li{color:#1d1e20}
& .card li i{border:.1em solid #6b6e73;border-radius:.2em}
& .card li:first-child i{background:var(--a-brand);border-color:var(--a-brand)}
& .btn{overflow:hidden;border-radius:1em;background:var(--a-brand);color:#fff;box-shadow:0 .05em .15em rgba(0,0,0,.3),0 .12em .3em rgba(0,0,0,.2);animation-name:dsMtBtn}
& .btn::before{content:"";position:absolute;inset:0;background:rgba(255,255,255,.18);opacity:0;animation-name:dsMtLayer}
& .btn::after{content:"";position:absolute;left:50%;top:50%;width:5em;height:5em;margin:-2.5em 0 0 -2.5em;border-radius:50%;background:rgba(255,255,255,.4);opacity:0;transform:scale(0);animation-name:dsMtRipple}
& .cap{color:#686a6f}
@keyframes dsMtBtn{0%,46%{box-shadow:0 .05em .15em rgba(0,0,0,.3),0 .12em .3em rgba(0,0,0,.2)}52%,64%{box-shadow:0 .15em .35em rgba(0,0,0,.3),0 .3em .7em rgba(0,0,0,.22)}74%,100%{box-shadow:0 .05em .15em rgba(0,0,0,.3),0 .12em .3em rgba(0,0,0,.2)}}
@keyframes dsMtLayer{0%,47%{opacity:0}51%,60%{opacity:1}72%,100%{opacity:0}}
@keyframes dsMtRipple{0%,48%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(.1)}70%{opacity:0;transform:scale(1)}100%{opacity:0;transform:scale(1)}}`),

      E('neumorphism', `
& .bg{background:#e2e5eb}
& .card{background:#e2e5eb;border-radius:1.2em;box-shadow:.5em .5em 1em #bfc3cc,-.5em -.5em 1em #fff}
& .card b{color:#6c7381}
& .card li{color:#7d8493}
& .card li i{border-radius:50%;box-shadow:inset .12em .12em .25em #bfc3cc,inset -.12em -.12em .25em #fff}
& .btn{border-radius:1em;background:#e2e5eb;color:#7d8493;box-shadow:.3em .3em .6em #bfc3cc,-.3em -.3em .6em #fff;animation-name:dsNmBtn}
& .cap{color:#8a90a0}
@keyframes dsNmBtn{0%,46%{box-shadow:.3em .3em .6em #bfc3cc,-.3em -.3em .6em #fff}50%,58%{box-shadow:inset .25em .25em .5em #bfc3cc,inset -.25em -.25em .5em #fff}64%,100%{box-shadow:.3em .3em .6em #bfc3cc,-.3em -.3em .6em #fff}}`),

      E('glassmorphism', `
& .bg{background:#1b2535}
& .o1,& .o2,& .o3{display:block}
& .o1{left:1.2em;top:5.2em;width:6.4em;height:6.4em;background:#d9582a;animation-name:dsGlO1}
& .o2{left:8.6em;top:-1.6em;width:6.4em;height:6.4em;background:#2a9d94;animation-name:dsGlO2}
& .o3{left:6em;top:4.4em;width:3.6em;height:3.6em;background:#e8b030;animation-name:dsGlO3}
& .card{background:rgba(255,255,255,.14);-webkit-backdrop-filter:blur(.9em) saturate(1.3);backdrop-filter:blur(.9em) saturate(1.3);border:.06em solid rgba(255,255,255,.38);border-radius:1em;color:#fff;text-shadow:0 .05em .2em rgba(0,0,0,.35)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){& .card{background:rgba(60,72,95,.92)}}
& .card li i{border:.08em solid rgba(255,255,255,.75);border-radius:.25em}
& .btn{border-radius:.9em;background:rgba(255,255,255,.26);border:.06em solid rgba(255,255,255,.5);color:#fff;animation-name:dsGlBtn}
& .cap{color:#c9d3e3}
@keyframes dsGlO1{0%,100%{transform:translate(0,0)}50%{transform:translate(5.5em,-2.6em)}}
@keyframes dsGlO2{0%,100%{transform:translate(0,0)}50%{transform:translate(-5em,3.4em)}}
@keyframes dsGlO3{0%,100%{transform:translate(0,0)}50%{transform:translate(2.6em,2.2em)}}
@keyframes dsGlBtn{0%,46%{background:rgba(255,255,255,.26);transform:none}52%,62%{background:rgba(255,255,255,.46);transform:scale(.97)}70%,100%{background:rgba(255,255,255,.26);transform:none}}`),

      E('claymorphism', `
& .bg{background:#ffeaf2}
& .card{background:#ffd6e5;border-radius:1.6em;box-shadow:inset 0 -.5em .7em rgba(214,120,160,.4),inset 0 .5em .7em rgba(255,255,255,.9),0 .8em 1.4em rgba(190,100,140,.3)}
& .card b{color:#5b2a40}
& .card li{color:#5b2a40}
& .card li i{border-radius:50%;background:#ffb8d1;box-shadow:inset 0 -.15em .2em rgba(214,120,160,.5),inset 0 .12em .2em rgba(255,255,255,.9)}
& .btn{border-radius:1em;background:#ff8fb4;color:#4a1530;box-shadow:inset 0 -.25em .4em rgba(190,70,115,.45),inset 0 .22em .35em rgba(255,255,255,.7),0 .35em .6em rgba(190,100,140,.35);animation-name:dsClBtn}
& .cap{color:#8a5068}
@keyframes dsClBtn{0%,46%{transform:none}50%{transform:scale(1.05,.86)}56%{transform:scale(.97,1.07)}61%{transform:scale(1.02,.98)}66%,100%{transform:none}}`),

      E('neo-brutalism', `
& .bg{background:#ffe66d}
& .card{background:#fff;border:.18em solid #000;border-radius:.3em;box-shadow:.45em .45em 0 #000;color:#000}
& .card b{font-weight:900}
& .card li i{border:.14em solid #000;background:#fff;border-radius:0}
& .card li:first-child i{background:#ff8a3d}
& .btn{border:.16em solid #000;border-radius:.3em;background:#ff8a3d;color:#000;box-shadow:.3em .3em 0 #000;animation-name:dsNbBtn}
& .cap{color:#000;font-weight:900}
@keyframes dsNbBtn{0%,46%{transform:none;box-shadow:.3em .3em 0 #000}50%,58%{transform:translate(.3em,.3em);box-shadow:0 0 0 #000}64%,100%{transform:none;box-shadow:.3em .3em 0 #000}}`),

      E('icon-3d', `
& .bg{background:#e9edf5}
& .ic{position:absolute;top:2.6em;width:3.8em;height:3.8em;border-radius:1.2em;display:grid;place-items:center;color:#fff;overflow:hidden}
& .ic .k-i{position:relative;width:1.8em;height:1.8em;stroke-width:2.2;filter:drop-shadow(.08em .1em .08em rgba(0,0,0,.35))}
& .gl{position:absolute;left:.35em;top:.25em;width:2em;height:1.2em;border-radius:50%;background:rgba(255,255,255,.45);transform:rotate(-18deg)}
& .ic1{left:1.6em;background:radial-gradient(circle at 30% 25%,#ff9a6b,#c24719 72%);box-shadow:inset -.3em -.4em .6em rgba(80,20,0,.35),inset .25em .3em .5em rgba(255,255,255,.5);animation-name:dsIcBob1}
& .ic2{left:6.1em;background:radial-gradient(circle at 30% 25%,#6fe0a2,#1f8a55 72%);box-shadow:inset -.3em -.4em .6em rgba(0,50,25,.35),inset .25em .3em .5em rgba(255,255,255,.5);animation-name:dsIcBob2}
& .ic3{left:10.6em;background:radial-gradient(circle at 30% 25%,#ffd76b,#d68a10 72%);box-shadow:inset -.3em -.4em .6em rgba(90,50,0,.35),inset .25em .3em .5em rgba(255,255,255,.5);animation-name:dsIcBob3}
& .sh{position:absolute;top:7.4em;width:3.2em;height:.6em;border-radius:50%;background:rgba(40,50,80,.28);filter:blur(.15em)}
& .sh1{left:1.9em;animation-name:dsIcSh1}
& .sh2{left:6.4em;animation-name:dsIcSh2}
& .sh3{left:10.9em;animation-name:dsIcSh3}
& .cap{color:#5b6275;bottom:1.4em}
@keyframes dsIcBob1{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-.9em) rotate(2deg)}}
@keyframes dsIcBob2{0%,100%{transform:translateY(-.5em) rotate(1deg)}25%{transform:translateY(-.9em) rotate(2deg)}75%{transform:translateY(0) rotate(-2deg)}}
@keyframes dsIcBob3{0%,100%{transform:translateY(-.9em) rotate(2deg)}50%{transform:translateY(0) rotate(-2deg)}}
@keyframes dsIcSh1{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(.7);opacity:.55}}
@keyframes dsIcSh2{0%,100%{transform:scale(.85);opacity:.7}25%{transform:scale(.7);opacity:.55}75%{transform:scale(1);opacity:.9}}
@keyframes dsIcSh3{0%,100%{transform:scale(.7);opacity:.55}50%{transform:scale(1);opacity:.9}}`),

      E('liquid-glass', `
& .bg{background:#10161f}
& .o1,& .o2,& .o3{display:block}
& .o1{left:.6em;top:5em;width:7em;height:7em;background:#d9582a;animation-name:dsLgO1}
& .o2{left:8.8em;top:-1.8em;width:7em;height:7em;background:#2a9d94;animation-name:dsLgO2}
& .o3{left:7em;top:5.2em;width:3.2em;height:3.2em;background:#e8b030;animation-name:dsLgO3}
& .card{overflow:hidden;background:rgba(255,255,255,.2);-webkit-backdrop-filter:blur(1.1em) saturate(1.8);backdrop-filter:blur(1.1em) saturate(1.8);border:.05em solid rgba(255,255,255,.5);border-radius:1.5em;color:#fff;text-shadow:0 .05em .2em rgba(0,0,0,.35);box-shadow:inset .1em .12em .1em rgba(255,255,255,.65),inset -.1em -.1em .25em rgba(255,255,255,.18),0 .8em 1.6em rgba(0,0,0,.4)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){& .card{background:rgba(70,82,105,.94)}}
& .card::after{content:"";position:absolute;top:-20%;bottom:-20%;left:0;width:45%;background:linear-gradient(105deg,rgba(255,255,255,0),rgba(255,255,255,.4),rgba(255,255,255,0));transform:translateX(-120%) skewX(-12deg);animation-name:dsLgShine}
& .card li i{border:.08em solid rgba(255,255,255,.8);border-radius:50%}
& .btn{border-radius:1.2em;background:rgba(255,255,255,.3);border:.05em solid rgba(255,255,255,.6);color:#fff;box-shadow:inset .08em .1em .08em rgba(255,255,255,.7),inset -.06em -.08em .15em rgba(255,255,255,.2);z-index:1;animation-name:dsLgBtn}
& .cap{color:#c9d3e3}
@keyframes dsLgO1{0%,100%{transform:translate(0,0)}50%{transform:translate(5.5em,-2.8em)}}
@keyframes dsLgO2{0%,100%{transform:translate(0,0)}50%{transform:translate(-5.4em,3.6em)}}
@keyframes dsLgO3{0%,100%{transform:translate(0,0)}50%{transform:translate(-3em,2.2em)}}
@keyframes dsLgShine{0%,10%{transform:translateX(-120%) skewX(-12deg)}40%,100%{transform:translateX(260%) skewX(-12deg)}}
@keyframes dsLgBtn{0%,46%{transform:none}51%{transform:scale(1.16,.84)}57%{transform:scale(.95,1.1)}63%{transform:scale(1.04,.97)}70%,100%{transform:none}}`)
    ].join('\n')
  });
})();
