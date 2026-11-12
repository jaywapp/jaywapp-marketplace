/* Topic: 로딩 패턴 (loading). Reference: plugins/design-master/references/empty-loading.md (section B)
   Every selector starts with .t-loading-<element>. Keyframe prefix: ld. */
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
  const SK_W = [5.2, 5.8, 3.2, 3.8, 3.6];
  const WORDS = ['된장찌개에는', '두부 1모,', '대파 1단,', '양파 1개가', '필요해요.', '목록에서', '세', '가지를', '확인해', '두었어요.'];

  UIGuide.registerTopic({
    id: 'loading',
    intro: '기다리는 동안 보여 주는 9가지 방법이에요. 얼마나 걸리는지, 화면 모양을 아는지에 따라 고릅니다. 0.3초 미만이면 아예 보여 주지 않아요.',
    elements: [
      {
        id: 'spinner', ko: '스피너', en: 'Spinner', aka: ['로딩 아이콘', 'activity indicator', '빙글빙글'],
        when: '짧은 대기(0.3~1초)나 결과 모양이 정해지지 않은 대기, 버튼이나 작은 영역 안',
        avoid: '전체 화면을 스피너 하나로 채우는 긴 로딩(스켈레톤), 진행률을 알 수 있는 업로드(진행 바)',
        notes: [
          '크기는 버튼 안 16~24px, 영역 32~48px이에요. 색 대비는 3:1 이상.',
          'role="status"와 읽히는 텍스트(‘불러오는 중’)를 함께 둬요.',
          '0.3초 안에 끝나면 보이지 않게 지연 표시해요. prefers-reduced-motion이면 느리게 하거나 정적 표시로 바꿔요.'
        ],
        vs: { topic: 'confusable-pairs', id: 'spinner-skeleton', name: '스켈레톤', text: '스피너는 얼마나 걸릴지, 결과가 어떤 모양일지 모를 때 쓰고, 스켈레톤은 들어갈 내용의 윤곽을 알 때 써요.' },
        demo: {
          frame: 'phone', cycle: 4500, still: 1800,
          phases: [['지연', 360, 630], ['회전', 630, 2700], ['완료', 2700, 2900]],
          alt: '새로고침 아이콘을 누르고 아주 잠깐 기다린 뒤 목록이 흐려지며 가운데에 스피너와 불러오는 중 글자가 나타나고, 끝나면 사라지며 목록이 다시 선명해지는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['refresh', 'more']) + K.app.list(0, 5, { cls: 'ls' }) +
            '<div class="spw"><i class="sp"></i><span>불러오는 중</span></div>' + K.tap(12.7, 2.5, 'tp')
        }
      },
      {
        id: 'skeleton', ko: '스켈레톤', en: 'Skeleton screen', aka: ['스켈레톤 UI', 'shimmer', '자리표시'],
        when: '목록, 카드, 프로필처럼 구조가 정해진 화면의 첫 로딩. 1초 넘는 대기',
        avoid: '구조를 알 수 없는 내용, 아주 짧은 로딩(깜빡임), 로딩 후 레이아웃이 크게 달라질 때',
        notes: [
          '실제 콘텐츠와 같은 크기, 같은 간격으로 만들어요. 로딩이 끝나도 레이아웃이 움직이지 않아요.',
          '반짝이는 효과(shimmer)는 1.5~2초 주기로 약하게 하고, prefers-reduced-motion이면 멈춰요.',
          '보이는 블록에는 aria-hidden, 전체 영역에는 aria-busy="true"를 줘요.'
        ],
        vs: { id: 'blur-up', text: '블러 업은 이미지 한 장이 흐릿하다가 선명해지는 방식이에요. 스켈레톤은 화면 전체의 자리를 회색 블록으로 먼저 잡아 줘요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 1200,
          phases: [['윤곽 표시', 0, 2600], ['교체', 2600, 2900], ['실제 내용', 2900, 4500]],
          alt: '목록 자리에 회색 블록이 깔리고 빛이 훑고 지나가다가, 같은 크기 그대로 실제 항목이 나타나며 블록과 교체되는 시연',
          html: K => K.app.status() + K.app.bar() +
            '<div class="skw">' + SK_W.map(w => `<div class="srow"><i class="sc"></i><i class="sn" style="width:${w}em"></i><i class="sq"></i></div>`).join('') + '</div>' +
            K.app.list(0, 5, { cls: 'real' })
        }
      },
      {
        id: 'progress-bar', ko: '진행 바', en: 'Progress bar', aka: ['프로그레스 바', '업로드 바', 'determinate'],
        when: '진행률을 알 수 있는 업로드, 다운로드, 처리. 10초 이상 걸리면 진행률과 취소 방법을 함께 보여 줘요',
        avoid: '끝을 알 수 없는 작업(스피너나 불확정 바), 아주 짧은 작업',
        notes: [
          '두께 4~8px, 트랙과 채움의 대비 3:1 이상이에요.',
          'role="progressbar"와 aria-valuenow, aria-valuemin, aria-valuemax를 줘요. 퍼센트를 글로도 보여 줘요.',
          '진행이 뒤로 가지 않게 해요.'
        ],
        vs: { id: 'progress-ring', text: '진행 링은 공간이 정사각형에 가까운 곳에 맞고, 진행 바는 가로로 긴 곳과 여러 진행을 견줄 때 맞아요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2500,
          phases: [['채워짐', 500, 3500], ['완료', 3500, 4400]],
          alt: '영수증 사진을 올리는 카드에서 막대가 왼쪽부터 천천히 차오르고 0, 25, 50, 75, 100퍼센트 글자가 따라 바뀌며, 옆에 취소 글자가 계속 보이는 시연',
          html: K => K.app.status() + K.app.bar('사진 올리기', [], { back: true }) +
            '<div class="cd"><div class="tp0"><span class="th">' + K.icon('image') + '</span><div class="nt"><b>영수증.jpg</b><span>올리는 중</span></div></div>' +
            '<div class="tr"><i class="fl"></i></div>' +
            '<div class="ft"><span class="pc"><b class="p0">0%</b><b class="p1">25%</b><b class="p2">50%</b><b class="p3">75%</b><b class="p4">100%</b></span><span class="cn">취소</span></div></div>' +
            '<div class="hint">10초 넘게 걸리면 진행률과 취소를 보여 줘요</div>'
        }
      },
      {
        id: 'progress-ring', ko: '진행 링', en: 'Progress ring', aka: ['원형 진행', 'circular progress', '도넛'],
        when: '공간이 정사각형에 가까운 곳(썸네일 위, 카드 안)의 진행률',
        avoid: '좁고 긴 공간, 여러 개의 진행을 비교하는 화면(바가 비교하기 쉬워요)',
        notes: [
          'SVG circle의 stroke-dasharray로 구현해요. 시작 지점은 12시 방향.',
          '중앙에 퍼센트를 글로 쓰면 읽기 쉬워요.',
          'role="progressbar"와 값 속성을 줘요.'
        ],
        vs: { topic: 'indicators', id: 'progress-ring', name: '원형 진행률', text: '같은 모양이에요. 여기서는 올리는 동안 차오르는 진행이고, 인디케이터 쪽은 목표 달성률처럼 오래 머무는 지표예요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2500,
          phases: [['채워짐', 500, 3500], ['완료', 3500, 4200]],
          alt: '사과 사진을 올리는 카드에서 썸네일이 어두워지며 그 위의 원형 테두리가 12시 방향부터 시계 방향으로 차오르고 가운데 퍼센트가 올라가다가, 끝나면 사진이 선명해지고 올렸어요로 바뀌는 시연',
          html: K => K.app.status() + K.app.bar('사진 올리기', [], { back: true }) +
            '<div class="cd"><div class="th"><i class="ap"></i><div class="ov"><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="trk" cx="20" cy="20" r="16" pathLength="100"/><circle class="arc" cx="20" cy="20" r="16" pathLength="100"/></svg>' +
            '<span class="n0">0%</span><span class="n1">30%</span><span class="n2">60%</span><span class="n3">100%</span></div></div>' +
            '<div class="nt"><b>사과.jpg</b><span class="s1">올리는 중</span><span class="s2">올렸어요</span></div></div>'
        }
      },
      {
        id: 'stepper', ko: '단계 표시', en: 'Stepper', aka: ['처리 단계', '진행 단계', 'step list'],
        when: '가입, 결제처럼 순서가 있는 흐름에서 현재 위치를 알릴 때. 로딩에서는 처리 단계를 문장으로 보여 줘요',
        avoid: '단계가 7개 이상이거나 사용자 선택에 따라 단계가 바뀌는 흐름',
        notes: [
          '완료, 현재, 예정을 모양과 아이콘으로 구분해요. 색만 쓰지 않아요.',
          '현재 단계에 aria-current="step"을 줘요.',
          '로딩에서는 ‘파일 확인 중, 변환 중, 완료’처럼 처리 단계를 문장으로 보여 줘요.'
        ],
        vs: { topic: 'indicators', id: 'step', name: '스텝 인디케이터', text: '본문은 스텝 인디케이터에 있어요. 여기서는 기다리는 동안 시스템이 하는 일을 한 줄씩 알려 주는 쪽이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['확인', 480, 1800], ['읽기', 1800, 3300], ['담기', 3300, 4800], ['완료', 4800, 5580]],
          alt: '영수증 가져오기 화면에서 영수증 확인, 품목 읽기, 목록에 담기 세 줄이 차례로 돌아가는 표시로 바뀌었다가 체크 표시로 끝나고, 위의 완료 개수가 하나씩 늘어나는 시연',
          html: K => K.app.status() + K.app.bar('영수증 가져오기', [], { back: true }) +
            '<div class="hd"><b>가져오는 중</b><span class="cnt"><i class="h0">완료 0/3</i><i class="h1">완료 1/3</i><i class="h2">완료 2/3</i><i class="h3">완료 3/3</i></span></div>' +
            ['영수증 확인', '품목 읽기', '목록에 담기'].map((t, i) => `<div class="sr r${i}"><span class="ci"><i class="pn"></i><i class="ac"></i><i class="dn">${K.icon('check')}</i></span><span class="tx"><i class="t0">${t}</i><i class="t1">${t}</i></span></div>`).join('')
        }
      },
      {
        id: 'blur-up', ko: '블러 업', en: 'Blur-up image', aka: ['점진적 이미지', 'LQIP', '흐릿한 미리보기'],
        when: '큰 사진, 갤러리, 히어로 이미지처럼 원본이 늦게 도착하는 이미지',
        avoid: '아이콘, 작은 썸네일, 글자가 든 이미지(흐린 상태를 읽을 수 없어요)',
        notes: [
          '수십 바이트~수 KB 크기의 저해상도 미리보기를 CSS filter: blur(20px)로 확대해 두고, 원본이 로드되면 200~400ms 페이드해요.',
          '이미지 종횡비를 미리 지정해 레이아웃이 움직이지 않게 해요.',
          '대체 텍스트는 처음부터 제공해요.'
        ],
        vs: { id: 'skeleton', text: '스켈레톤은 단색 자리표시라 이미지 정보가 없고, 블러 업은 같은 이미지의 흐릿한 버전이 먼저 보여요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 3000,
          phases: [['미리보기', 0, 1900], ['전환', 1900, 2300], ['원본', 2300, 4400]],
          alt: '사과 사진 자리에 흐릿한 작은 미리보기가 먼저 보이다가, 0.4초 동안 같은 자리에서 선명한 원본으로 바뀌고 왼쪽 위 표시가 미리보기에서 원본으로 바뀌는 시연',
          html: K => K.app.status() + K.app.bar('오늘의 장보기', [], { back: true }) +
            '<div class="im"><div class="lo"><i class="bw"></i><i class="tb"></i><i class="ap"></i><i class="sm"></i><i class="lf"></i></div>' +
            '<div class="hi"><i class="bw"></i><i class="tb"></i><i class="ap"></i><i class="sm"></i><i class="lf"></i></div>' +
            '<span class="tg t1">미리보기 2KB</span><span class="tg t2">원본</span></div>' +
            '<div class="cp"><b>사과 4개</b><span>가족 장보기 사진</span></div>'
        }
      },
      {
        id: 'optimistic', ko: '낙관적 UI', en: 'Optimistic UI', aka: ['낙관적 업데이트', 'optimistic update'],
        when: '좋아요, 체크, 순서 변경, 메시지 전송처럼 성공 확률이 높고 가벼운 행동',
        avoid: '결제, 삭제 같은 되돌리기 어려운 행동, 서버의 판단이 결과를 바꾸는 행동',
        notes: [
          '실패하면 원래 상태로 복구하고 이유를 알려요(스낵바나 항목 옆 오류).',
          '전송 중인 항목은 약간 흐리게 해서 보류 상태를 구분하면 신뢰도가 높아요.',
          '중복 요청과 순서 꼬임을 막아요. 오프라인 대기열이 있으면 재시도 상태를 보여 줘요.'
        ],
        vs: { topic: 'completion', id: 'send', name: '보냄 애니메이션', text: '낙관적 반영 뒤의 완료 표시는 완료 표시에서 다뤄요. 낙관적 UI는 먼저 바꾸는 방식 자체를 말해요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2000,
          phases: [['즉시', 500, 650], ['서버 대기', 650, 2750], ['확인', 2750, 3000]],
          alt: '달걀 10구를 체크하자 서버 응답을 기다리지 않고 바로 체크 표시가 생기고 아래 개수가 1에서 2로 오르며, 행이 흐리게 보내는 중으로 머물다가 한참 뒤 저장됨으로 선명해지는 시연',
          html: K => K.app.screen() +
            '<div class="sy"><span class="y1"><i class="mini"></i>보내는 중</span><span class="y2">' + K.icon('check') + '저장됨</span></div>' +
            '<div class="cnt">담은 항목 <span class="nw"><b class="a">1</b><b class="b">2</b></span>/5</div>' + K.tap(1.5, 7.15, 'tp')
        }
      },
      {
        id: 'streaming', ko: '스트리밍 텍스트', en: 'Streaming text', aka: ['스트리밍', '실시간 답변', 'token streaming'],
        when: 'AI 답변, 긴 요약 생성, 로그 보기처럼 글이 만들어지는 대로 도착할 때',
        avoid: '부분적으로 보이면 오해를 부르는 내용(금액, 법적 안내), 끝난 뒤에만 의미가 있는 결과',
        notes: [
          '자동 스크롤은 사용자가 위로 스크롤하면 멈추고 ‘맨 아래로’ 버튼을 줘요. 문장 중간에 레이아웃이 튀지 않게 해요.',
          '스크린 리더는 aria-live="polite"로 하되 토큰마다 읽지 않고 완성된 단위로 알려요.',
          '중지 버튼을 꼭 제공해요.'
        ],
        vs: { topic: 'text-reveal', id: 'typewriter', name: '타이핑', text: '타이핑은 이미 있는 글을 연출로 한 글자씩 보여 주는 효과예요. 스트리밍은 실제로 도착하는 데이터를 도착하는 대로 이어 붙여요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['도착 중', 840, 3720], ['완성', 3720, 5400]],
          alt: '질문을 보내자 AI 답변이 단어 단위로 하나씩 이어서 나타나고, 그동안 입력창의 보내기 버튼이 중지 버튼으로 바뀌었다가 답변이 끝나면 다시 보내기로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('장보기 도우미', [], { back: true }) +
            '<div class="ub"><span>된장찌개 재료 알려줘</span></div>' +
            '<span class="ai">' + K.icon('sparkle') + '</span>' +
            '<div class="at">' + WORDS.map((w, i) => `<span class="tk tk${i}">${w}</span>`).join(' ') + '</div>' +
            '<div class="inb"><span class="ph2">메시지 보내기</span><span class="bt"><i class="snd">' + K.icon('send') + '</i><i class="stp"></i></span></div>'
        }
      },
      {
        id: 'loading-button', ko: '로딩 버튼', en: 'Loading button', aka: ['제출 중', '중복 제출 방지', 'submit busy'],
        when: '저장, 제출, 결제, 로그인처럼 한 번의 요청이 걸린 행동',
        avoid: '요청 시간이 길고 다른 작업을 계속해야 할 때(백그라운드 진행 표시)',
        notes: [
          '폭과 높이를 유지하고 스피너와 라벨(‘담는 중…’)을 함께 둬요. 중복 제출을 막아요.',
          'aria-busy와 aria-live를 써요. 실패하면 바로 원래 상태로 복구하고 이유를 알려요.',
          '버튼 상태 일람은 버튼 상태의 로딩에 있어요.'
        ],
        vs: { id: 'spinner', text: '스피너는 버튼 밖의 영역에 쓰고, 로딩 버튼은 누른 그 버튼 안에서 처리 중이라고 알려요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 1500,
          phases: [['요청', 500, 800], ['처리 중', 800, 3100], ['복귀', 3100, 3400]],
          alt: '항목 추가 폼에서 담기 버튼을 누르면 폭 그대로 스피너와 담는 중 글자로 바뀌고, 처리 중에 한 번 더 눌러도 한 번만 접수돼요라는 말풍선만 뜨다가, 끝나면 목록에 담기로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('항목 추가', [], { back: true }) +
            '<div class="f1">' + K.app.field('항목', '두부') + '</div><div class="f2">' + K.app.field('수량', '2모') + '</div>' +
            '<div class="bt"><span class="lb1">목록에 담기</span><span class="lb2"><i class="spn"></i>담는 중…</span></div>' +
            K.dim({ x: 1.2, y: 15.2, len: 13.6, dir: 'h', label: '폭 그대로', side: 'top', cls: 'dm' }) +
            '<div class="bb"><span>한 번만 접수돼요</span></div>' + K.tap(8, 17.05, 'tp1') + K.tap(8, 17.05, 'tp2')
        }
      }
    ],
    css: K => `
/* spinner */
.t-loading-spinner .ls{animation-name:ldSpRows}
.t-loading-spinner .spw{position:absolute;z-index:6;left:0;right:0;top:7.6em;display:flex;flex-direction:column;align-items:center;gap:.6em;opacity:0;animation-name:ldSpOn}
.t-loading-spinner .spw span{font-size:.62em;color:var(--a-mut)}
.t-loading-spinner .sp{display:block;width:2.2em;height:2.2em;border-radius:50%;border:.22em solid var(--a-line);border-top-color:var(--a-brand);animation-name:ldSpin;animation-duration:.8s;animation-timing-function:linear}
.t-loading-spinner .tp{animation-name:ldSpTap}
${vis('ldSpOn', [[14, 60]])}
@keyframes ldSpin{to{transform:rotate(360deg)}}
@keyframes ldSpRows{0%,12%{opacity:1}16%,58%{opacity:.3}64%,100%{opacity:1}}
${K.kf.tap('ldSpTap', 8)}

/* skeleton */
.t-loading-skeleton .skw{position:absolute;z-index:2;left:0;right:0;top:3.7em;overflow:hidden;animation-name:ldSkOn}
.t-loading-skeleton .srow{height:2.3em;display:flex;align-items:center;gap:.6em;padding:0 1em;border-bottom:1px solid var(--a-line)}
.t-loading-skeleton .sc{width:1em;height:1em;border-radius:50%;background:#e4e4df;flex:none}
.t-loading-skeleton .sn{height:.7em;border-radius:.35em;background:#e4e4df;margin-right:auto}
.t-loading-skeleton .sq{width:1.5em;height:.55em;border-radius:.3em;background:#e9e9e5}
.t-loading-skeleton .skw::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.75) 50%,transparent 70%);transform:translateX(-100%);animation-name:ldSkSh;animation-duration:1.6s;animation-timing-function:linear}
.t-loading-skeleton .real{position:absolute;z-index:1;left:0;right:0;top:3.7em;opacity:0;animation-name:ldSkReal}
${vis('ldSkOn', [[0, 52], [96, 100]])}${vis('ldSkReal', [[58, 90]])}
@keyframes ldSkSh{to{transform:translateX(100%)}}

/* progress bar */
.t-loading-progress-bar .cd{position:absolute;z-index:2;left:1em;right:1em;top:5em;padding:.9em .9em .8em;border:1px solid var(--a-line);border-radius:.7em;background:#fff;animation-name:ldPbCard}
.t-loading-progress-bar .tp0{display:flex;align-items:center;gap:.7em}
.t-loading-progress-bar .th{width:2.4em;height:2.4em;border-radius:.5em;background:var(--a-soft);display:grid;place-items:center;color:var(--a-mut)}
.t-loading-progress-bar .th .k-i{width:1.2em;height:1.2em}
.t-loading-progress-bar .nt b{display:block;font-size:.74em}
.t-loading-progress-bar .nt span{font-size:.6em;color:var(--a-mut)}
.t-loading-progress-bar .tr{height:.45em;margin-top:.9em;border-radius:.3em;background:var(--a-line);overflow:hidden}
.t-loading-progress-bar .fl{display:block;height:100%;background:var(--a-brand);transform-origin:left;transform:scaleX(0);animation-name:ldPbFill;animation-timing-function:linear}
.t-loading-progress-bar .ft{display:flex;justify-content:space-between;align-items:center;margin-top:.6em}
.t-loading-progress-bar .pc{position:relative;width:3em;height:1em}
.t-loading-progress-bar .pc b{position:absolute;left:0;top:0;font-size:.62em;font-weight:700;opacity:0}
.t-loading-progress-bar .cn{font-size:.62em;color:var(--a-mut);text-decoration:underline}
.t-loading-progress-bar .p0{animation-name:ldPb0}.t-loading-progress-bar .p1{animation-name:ldPb1}.t-loading-progress-bar .p2{animation-name:ldPb2}.t-loading-progress-bar .p3{animation-name:ldPb3}.t-loading-progress-bar .p4{animation-name:ldPb4}
.t-loading-progress-bar .hint{position:absolute;left:0;right:0;top:20.5em;text-align:center;font-size:.6em;color:var(--a-mut)}
${vis('ldPbCard', [[0, 88], [97, 100]])}${vis('ldPb0', [[0, 25], [97, 100]])}${vis('ldPb1', [[25, 40]])}${vis('ldPb2', [[40, 55]])}${vis('ldPb3', [[55, 70]])}${vis('ldPb4', [[70, 88]])}
@keyframes ldPbFill{0%,10%{transform:scaleX(0)}70%,92%{transform:scaleX(1)}94%,100%{transform:scaleX(0)}}

/* progress ring */
.t-loading-progress-ring .cd{position:absolute;z-index:2;left:1em;right:1em;top:5em;padding:.8em;border:1px solid var(--a-line);border-radius:.7em;background:#fff;display:flex;align-items:center;gap:.9em}
.t-loading-progress-ring .th{position:relative;flex:none;width:5em;height:5em;border-radius:.6em;background:#efe3d4;display:grid;place-items:center;color:#b5a38c;overflow:hidden}
.t-loading-progress-ring .ap{display:block;width:2.8em;height:2.7em;border-radius:50% 50% 46% 46%;background:#c3392b}
.t-loading-progress-ring .ov{position:absolute;inset:0;background:rgba(29,30,32,.7);display:grid;place-items:center;animation-name:ldPrOv}
.t-loading-progress-ring .ov svg{position:absolute;width:3.4em;height:3.4em;transform:rotate(-90deg)}
.t-loading-progress-ring .ov circle{fill:none;stroke-width:4}
.t-loading-progress-ring .trk{stroke:rgba(255,255,255,.3)}
.t-loading-progress-ring .arc{stroke:#fff;stroke-linecap:round;stroke-dasharray:100 100;stroke-dashoffset:100;animation-name:ldPrArc;animation-timing-function:linear}
.t-loading-progress-ring .ov span{position:absolute;font-size:.6em;font-weight:700;color:#fff;opacity:0}
.t-loading-progress-ring .n0{animation-name:ldPrN0}.t-loading-progress-ring .n1{animation-name:ldPrN1}.t-loading-progress-ring .n2{animation-name:ldPrN2}.t-loading-progress-ring .n3{animation-name:ldPrN3}
.t-loading-progress-ring .nt{position:relative;height:2.4em;flex:1}
.t-loading-progress-ring .nt b{position:absolute;left:0;top:0;font-size:.78em}
.t-loading-progress-ring .nt span{position:absolute;left:0;top:1.9em;font-size:.62em;color:var(--a-mut);opacity:0}
.t-loading-progress-ring .s1{animation-name:ldPrS1}.t-loading-progress-ring .s2{animation-name:ldPrS2}
${vis('ldPrOv', [[0, 84], [97, 100]])}${vis('ldPrN0', [[0, 22], [97, 100]])}${vis('ldPrN1', [[22, 40]])}${vis('ldPrN2', [[40, 58]])}${vis('ldPrN3', [[58, 84]])}${vis('ldPrS1', [[0, 84], [97, 100]])}${vis('ldPrS2', [[86, 94]])}
@keyframes ldPrArc{0%,10%{stroke-dashoffset:100}70%,92%{stroke-dashoffset:0}94%,100%{stroke-dashoffset:100}}

/* stepper */
.t-loading-stepper .hd{position:absolute;left:1.4em;right:1.4em;top:4.9em;display:flex;justify-content:space-between;align-items:center}
.t-loading-stepper .hd b{font-size:.84em}
.t-loading-stepper .cnt{position:relative;width:4.2em;height:1em}
.t-loading-stepper .cnt i{position:absolute;right:0;top:0;font-style:normal;font-size:.62em;color:var(--a-mut);white-space:nowrap;opacity:0}
.t-loading-stepper .h0{animation-name:ldStH0}.t-loading-stepper .h1{animation-name:ldStH1}.t-loading-stepper .h2{animation-name:ldStH2}.t-loading-stepper .h3{animation-name:ldStH3}
.t-loading-stepper .sr{position:absolute;left:1.4em;right:1.4em;height:2em;display:flex;align-items:center;gap:.8em}
.t-loading-stepper .r0{top:7.6em}.t-loading-stepper .r1{top:10.8em}.t-loading-stepper .r2{top:14em}
.t-loading-stepper .ci{position:relative;flex:none;width:1.7em;height:1.7em}
.t-loading-stepper .ci i{position:absolute;inset:0;border-radius:50%}
.t-loading-stepper .pn{border:.1em solid #b5b6b1}
.t-loading-stepper .ac{border:.16em solid var(--a-line);border-top-color:var(--a-brand);opacity:0;animation-duration:.8s;animation-timing-function:linear}
.t-loading-stepper .dn{background:var(--a-ok);color:#fff;display:grid;place-items:center;opacity:0}
.t-loading-stepper .dn .k-i{width:.95em;height:.95em;stroke-width:3}
.t-loading-stepper .tx{position:relative;flex:1;height:1.4em}
.t-loading-stepper .tx i{position:absolute;left:0;top:0;font-style:normal;font-size:.82em;white-space:nowrap;opacity:0}
.t-loading-stepper .t0{color:var(--a-mut)}
.t-loading-stepper .r0 .pn{animation-name:ldStP0}.t-loading-stepper .r0 .ac{animation-name:ldStA0,ldSpin}.t-loading-stepper .r0 .dn{animation-name:ldStD0}.t-loading-stepper .r0 .t0{animation-name:ldStT0}.t-loading-stepper .r0 .t1{animation-name:ldStI0}
.t-loading-stepper .r1 .ac{animation-name:ldStA1,ldSpin}.t-loading-stepper .r1 .dn{animation-name:ldStD1}.t-loading-stepper .r1 .t0{animation-name:ldStT1}.t-loading-stepper .r1 .t1{animation-name:ldStI1}
.t-loading-stepper .r2 .ac{animation-name:ldStA2,ldSpin}.t-loading-stepper .r2 .dn{animation-name:ldStD2}.t-loading-stepper .r2 .t0{animation-name:ldStT2}.t-loading-stepper .r2 .t1{animation-name:ldStI2}
.t-loading-stepper .ac{animation-duration:var(--cyc),.8s;animation-timing-function:var(--k-ease),linear}
${vis('ldStH0', [[0, 30], [96, 100]])}${vis('ldStH1', [[30, 55]])}${vis('ldStH2', [[55, 80]])}${vis('ldStH3', [[80, 93]])}
${vis('ldStA0', [[8, 30]])}${vis('ldStD0', [[30, 93]])}${vis('ldStT0', [[0, 8], [96, 100]])}${vis('ldStI0', [[8, 93]])}
${vis('ldStA1', [[30, 55]])}${vis('ldStD1', [[55, 93]])}${vis('ldStT1', [[0, 30], [96, 100]])}${vis('ldStI1', [[30, 93]])}
${vis('ldStA2', [[55, 80]])}${vis('ldStD2', [[80, 93]])}${vis('ldStT2', [[0, 55], [96, 100]])}${vis('ldStI2', [[55, 93]])}
@keyframes ldStP0{0%,100%{opacity:1}}

/* blur-up */
.t-loading-blur-up .im{position:absolute;left:2em;top:5em;width:12em;height:8.4em;border-radius:.7em;overflow:hidden;background:#f0e1d0}
.t-loading-blur-up .lo,.t-loading-blur-up .hi{position:absolute;inset:0}
.t-loading-blur-up .lo{filter:blur(.9em);transform:scale(1.2)}
.t-loading-blur-up .hi{opacity:0;animation-name:ldBuHi}
.t-loading-blur-up .im i{position:absolute;display:block}
.t-loading-blur-up .bw{inset:0;background:#f0e1d0}
.t-loading-blur-up .tb{left:0;right:0;bottom:0;height:3em;background:#d6b48a}
.t-loading-blur-up .ap{left:3.8em;top:2.2em;width:4.4em;height:4.2em;border-radius:50% 50% 46% 46%;background:#c3392b;box-shadow:inset -.5em -.4em 0 rgba(0,0,0,.12)}
.t-loading-blur-up .sm{left:5.9em;top:1.2em;width:.3em;height:1.3em;border-radius:.2em;background:#6b4a2b;transform:rotate(8deg)}
.t-loading-blur-up .lf{left:6.3em;top:1.1em;width:1.7em;height:.9em;border-radius:100% 0 100% 0;background:#3f8a52;transform:rotate(-12deg)}
.t-loading-blur-up .tg{position:absolute;z-index:2;left:1em;top:1em;padding:.3em .8em;border-radius:1em;background:rgba(35,36,39,.82);color:#fff;font-size:.56em;font-weight:700;white-space:nowrap}
.t-loading-blur-up .t1{animation-name:ldBuT1}
.t-loading-blur-up .t2{opacity:0;animation-name:ldBuT2}
.t-loading-blur-up .cp{position:absolute;left:2em;top:14.2em;display:flex;flex-direction:column;gap:.15em}
.t-loading-blur-up .cp b{font-size:.8em}
.t-loading-blur-up .cp span{font-size:.62em;color:var(--a-mut)}
@keyframes ldBuHi{0%,38%{opacity:0}46%,88%{opacity:1}94%,100%{opacity:0}}
${vis('ldBuT1', [[0, 38], [97, 100]])}${vis('ldBuT2', [[46, 92]])}

/* optimistic */
.t-loading-optimistic .k-r2{animation-name:ldOpRow}
.t-loading-optimistic .k-r2 .k-ck{animation-name:ldOpCk}
.t-loading-optimistic .sy{position:absolute;z-index:3;right:.6em;top:6em;width:5.4em;height:2.2em;display:flex;align-items:center;justify-content:flex-end;background:var(--a-bg)}
.t-loading-optimistic .sy>span{position:absolute;right:.4em;display:flex;align-items:center;gap:.3em;font-size:.6em;white-space:nowrap;opacity:0}
.t-loading-optimistic .y1{color:var(--a-mut);animation-name:ldOpY1}
.t-loading-optimistic .y2{color:var(--a-ok);font-weight:700;animation-name:ldOpY2}
.t-loading-optimistic .y2 .k-i{width:1.1em;height:1.1em;stroke-width:3}
.t-loading-optimistic .mini{display:block;width:1em;height:1em;border-radius:50%;border:.16em solid var(--a-line);border-top-color:var(--a-mut);animation-name:ldSpin;animation-duration:.8s;animation-timing-function:linear}
.t-loading-optimistic .cnt{position:absolute;z-index:3;left:50%;bottom:1.1em;display:flex;align-items:center;padding:.5em 1em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;font-size:.66em;white-space:nowrap;transform:translateX(-50%)}
.t-loading-optimistic .nw{position:relative;display:inline-block;width:.6em;height:1.3em;margin-left:.3em;animation-name:ldOpBump}
.t-loading-optimistic .nw b{position:absolute;left:0;top:0;opacity:0;line-height:1.3}
.t-loading-optimistic .a{animation-name:ldOpN1}.t-loading-optimistic .b{animation-name:ldOpN2}
.t-loading-optimistic .tp{animation-name:ldOpTap}
${vis('ldOpY1', [[13, 55]])}${vis('ldOpY2', [[58, 90]])}${vis('ldOpN1', [[0, 12], [96, 100]])}${vis('ldOpN2', [[12, 94]])}
@keyframes ldOpRow{0%,11%{opacity:1}13%,54%{opacity:.5}60%,100%{opacity:1}}
@keyframes ldOpCk{0%,11%{opacity:0;transform:scale(.4)}14%,92%{opacity:1;transform:scale(1)}97%,100%{opacity:0;transform:scale(1)}}
@keyframes ldOpBump{0%,11%{transform:scale(1)}14%{transform:scale(1.35)}18%,100%{transform:scale(1)}}
${K.kf.tap('ldOpTap', 10)}

/* streaming */
.t-loading-streaming .ub{position:absolute;right:1em;top:4.9em;max-width:10em;padding:.55em .8em;border-radius:.9em .9em .2em .9em;background:var(--a-soft)}
.t-loading-streaming .ub span{font-size:.72em;display:block}
.t-loading-streaming .ai{position:absolute;left:1.2em;top:7.6em;width:1.2em;height:1.2em;color:var(--a-brand)}
.t-loading-streaming .ai .k-i{width:1.2em;height:1.2em}
.t-loading-streaming .at{position:absolute;left:1.4em;right:1.6em;top:12.6em;font-size:.74em;line-height:1.7}
.t-loading-streaming .tk{display:inline-block;opacity:0}
.t-loading-streaming .inb{position:absolute;left:.8em;right:.8em;bottom:.8em;height:2.5em;border-radius:1.25em;background:var(--a-soft);display:flex;align-items:center;padding:0 .4em 0 1em}
.t-loading-streaming .ph2{flex:1;font-size:.66em;color:var(--a-mut)}
.t-loading-streaming .bt{position:relative;width:1.8em;height:1.8em;border-radius:50%;background:var(--a-dark);color:#fff}
.t-loading-streaming .bt i{position:absolute;inset:0;display:grid;place-items:center}
.t-loading-streaming .snd{animation-name:ldStmSnd}
.t-loading-streaming .snd .k-i{width:.95em;height:.95em}
.t-loading-streaming .stp::after{content:"";width:.6em;height:.6em;border-radius:.12em;background:#fff}
.t-loading-streaming .stp{opacity:0;animation-name:ldStmStp}
${WORDS.map((w, i) => { const t = 14 + i * 5; return `.t-loading-streaming .tk${i}{animation-name:ldStmW${i}}@keyframes ldStmW${i}{0%,${t - 1}%{opacity:0;transform:translateY(.25em)}${t + 1}%,90%{opacity:1;transform:none}94%,100%{opacity:0;transform:none}}`; }).join('\n')}
${vis('ldStmSnd', [[0, 10], [72, 100]])}${vis('ldStmStp', [[12, 68]])}

/* loading button */
.t-loading-loading-button .f1,.t-loading-loading-button .f2{position:absolute;left:1em;right:1em}
.t-loading-loading-button .f1{top:4.8em}.t-loading-loading-button .f2{top:8.2em}
.t-loading-loading-button .bt{position:absolute;left:1.2em;right:1.2em;top:15.6em;height:2.9em;border-radius:.8em;background:var(--a-brand);color:#fff;font-weight:700}
.t-loading-loading-button .bt>span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:.5em;font-size:.76em}
.t-loading-loading-button .lb1{animation-name:ldLbA}
.t-loading-loading-button .lb2{opacity:0;animation-name:ldLbB}
.t-loading-loading-button .spn{display:block;width:1.05em;height:1.05em;border-radius:50%;border:.16em solid rgba(255,255,255,.4);border-top-color:#fff;animation-name:ldSpin;animation-duration:.8s;animation-timing-function:linear}
.t-loading-loading-button .dm{opacity:0;animation-name:ldLbDim}
.t-loading-loading-button .bb{position:absolute;z-index:6;left:50%;top:11.9em;padding:.45em .9em;border-radius:1em;background:var(--a-dark);color:#fff;white-space:nowrap;opacity:0;transform:translateX(-50%);animation-name:ldLbBub}
.t-loading-loading-button .bb span{font-size:.62em}
.t-loading-loading-button .tp1{animation-name:ldLbT1}
.t-loading-loading-button .tp2{animation-name:ldLbT2}
${vis('ldLbA', [[0, 10], [66, 100]])}${vis('ldLbB', [[14, 62]])}${vis('ldLbDim', [[16, 60]])}${vis('ldLbBub', [[40, 58]])}
${K.kf.tap('ldLbT1', 10)}
${K.kf.tap('ldLbT2', 38)}
`
  });
})();
