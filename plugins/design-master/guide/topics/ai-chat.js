/* Topic: AI 채팅 화면 (ai-chat). Reference: plugins/design-master/references/ai-chat.md
   Selectors use "&" as a placeholder for .t-ai-chat-<element>; see E() below. Keyframe prefix: ai. */
(function () {
  const IDS = ['thinking', 'streaming', 'suggested-prompts', 'regenerate', 'citations', 'feedback-buttons', 'edit-resend', 'attachment', 'agent-steps'];
  const E = (id, css) => css.replace(/&/g, '.t-ai-chat-' + id);
  const win = (name, a, b) => `@keyframes ${name}{0%,${a - 4}%{opacity:0;transform:scale(.4)}${a}%,${b}%{opacity:1;transform:scale(1)}${b + 5}%,100%{opacity:0;transform:scale(.4)}}`;
  /* left-to-right reveal of a text line, then fade out before the loop restarts */
  const wipe = (name, a, b) => `@keyframes ${name}{0%,${a}%{clip-path:inset(0 100% 0 0);opacity:1}${b}%,90%{clip-path:inset(0 0 0 0);opacity:1}95%{clip-path:inset(0 0 0 0);opacity:0}96%,100%{clip-path:inset(0 100% 0 0);opacity:0}}`;

  const SHARED = `
& .inp{position:absolute;left:0;right:0;bottom:0;z-index:4;height:3.1em;border-top:1px solid var(--a-line);background:var(--a-bg)}
& .inp .pl{position:absolute;left:.7em;top:.55em;width:2em;height:2em;display:grid;place-items:center;color:var(--a-mut)}
& .inp .pl .k-i{width:1.1em;height:1.1em}
& .inp .fl{position:absolute;left:3em;right:3.4em;top:.55em;height:2em;border-radius:1em;background:var(--a-soft);display:flex;align-items:center;padding:0 .9em}
& .inp .phd{font-size:.64em;color:#9b9c98;white-space:nowrap}
& .inp .ty{position:absolute;left:1.4em}
& .inp .sd{position:absolute;right:.7em;top:.55em;width:2em;height:2em;border-radius:50%;background:#d8d8d4;color:#fff;display:grid;place-items:center}
& .inp .sd .k-i{width:1em;height:1em}
& .u{position:absolute;right:.9em;top:4.4em;left:3em;display:flex;justify-content:flex-end}
& .u p,& .u2 p{margin:0;padding:.6em .85em;border-radius:1em 1em .25em 1em;background:var(--a-brand);color:#fff;font-size:.68em;line-height:1.35}
& .a{position:absolute;left:.9em;right:.9em}
& .a .av,& .hd .av{position:absolute;left:0;top:0;width:1.5em;height:1.5em;border-radius:50%;background:#fbe6dc;color:var(--a-brand);display:grid;place-items:center}
& .a .av .k-i,& .hd .av .k-i{width:.85em;height:.85em}
& .a .tx{margin:0 0 0 3.18em;font-size:.66em;line-height:1.55}`;

  const bar = K => K.app.status() + K.app.bar('장보기 도우미', [], { back: true });
  const inp = (K, typed) => `<div class="inp"><span class="pl">${K.icon('plus')}</span><span class="fl"><span class="phd">메시지 보내기</span>${typed || ''}</span><span class="sd">${K.icon('send')}</span></div>`;
  const av = K => `<i class="av">${K.icon('sparkle')}</i>`;
  const ASK = '이번 주 저녁 메뉴 짜 줘';
  const ANS = '월 두부조림, 화 달걀말이, 수 김구이 정식을 추천해요.';

  UIGuide.registerTopic({
    id: 'ai-chat',
    intro: '일반 메신저와 달리 답변이 만들어지는 시간, 틀릴 수 있다는 점, 출처 확인, 다시 시도가 핵심인 화면이에요. 장보기 앱 안의 도우미에게 저녁 메뉴를 묻는 대화로 보여 드려요.',
    elements: [
      {
        id: 'thinking', ko: '생각 중 표시', en: 'Thinking indicator', aka: ['타이핑 점', '처리 중', 'typing dots'],
        when: '요청을 보낸 뒤 첫 글자가 도착하기 전',
        avoid: '아무 표시도 없는 정지 화면, 너무 요란한 연출',
        notes: [
          '전송 즉시(100ms 이내) 표시하고, 답변이 오기 시작하면 그 자리에서 자연스럽게 교체해요.',
          '5초가 넘으면 ‘생각하는 중…’ 같은 문구나 진행 단서를 더하고, 10초가 넘으면 오래 걸림을 알리고 중지 방법을 둬요.',
          'role="status"로 알리고, prefers-reduced-motion이면 움직이는 점 대신 정적 텍스트를 써요.'
        ],
        vs: { id: 'agent-steps', text: '에이전트 단계는 무슨 작업을 하는지 구체적으로 보여 주고, 생각 중 표시는 내용 없이 처리 중임만 알려요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 1800,
          phases: [['전송', 480, 1100], ['점 표시', 1100, 3100], ['문구 추가', 3100, 4700], ['답변 교체', 4700, 5100]],
          alt: '메시지를 보내면 내 말풍선이 올라오고 AI 자리에 점 세 개가 차례로 튀어 오르다가, 시간이 지나면 생각하는 중이라는 문구가 붙고, 답변이 시작되면 점이 글로 바뀌는 시연',
          html: K => bar(K) + `<div class="u"><p>${ASK}</p></div>` +
            `<div class="a th">${av(K)}<div class="thw"><span class="dots"><b></b><b></b><b></b></span><em>생각하는 중…</em></div></div>` +
            `<div class="a ans">${av(K)}<p class="tx">${ANS}</p></div>` +
            inp(K, `<span class="ty">${ASK}</span>`) + K.tap(14.3, 19.78, 'tp')
        }
      },
      {
        id: 'streaming', ko: '스트리밍 답변', en: 'Streaming response', aka: ['글자 스트리밍', '실시간 답변', 'token streaming'],
        when: '모든 AI 채팅 답변. 만들어지는 대로 글이 이어서 나타나요',
        avoid: '미완성 마크다운이 깨져 보이는 채로 두는 것',
        notes: [
          '자동 스크롤을 하되 사용자가 위로 올리면 멈추고 ‘맨 아래로’ 버튼을 보여 줘요.',
          '생성 중에는 보내기 버튼을 ‘중지’로 바꾸고, 복사나 피드백 버튼은 끝나면 나타내요.',
          '마크다운과 코드 블록이 미완성 상태로 깨져 보이지 않게 처리해요. 일반 규칙은 로딩 주제의 스트리밍 텍스트를 봐요.'
        ],
        vs: { topic: 'text-reveal', id: 'typewriter', name: '타이핑', text: '타이핑은 정해진 글을 연출로 보여 주는 효과이고, 스트리밍은 실제로 생성되는 결과가 도착하는 대로 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['스트리밍', 840, 4200], ['버튼 표시', 4560, 5640]],
          alt: '도우미 답변이 한 줄씩 왼쪽부터 이어서 나타나는 동안 보내기 버튼이 중지 버튼으로 바뀌어 있다가, 답변이 끝나면 복사와 좋아요 버튼이 나타나는 시연',
          html: K => bar(K) + `<div class="u"><p>${ASK}</p></div>` +
            `<div class="a">${av(K)}<div class="tx"><p class="l l1">이번 주 저녁은 이렇게 어때요?</p><p class="l l2">월 두부조림 (두부, 대파)</p><p class="l l3">화 달걀말이 (달걀, 대파)</p><p class="l l4">수 김구이 정식 (김, 참기름)</p></div></div>` +
            `<div class="act">${K.icon('copy')}${K.icon('thumbUp')}${K.icon('thumbDown')}</div>` +
            `<div class="inp"><span class="pl">${K.icon('plus')}</span><span class="fl"><span class="phd">메시지 보내기</span></span><span class="sd"><span class="isend">${K.icon('send')}</span><span class="istop"><i class="sq"></i></span></span></div>`
        }
      },
      {
        id: 'suggested-prompts', ko: '추천 질문 칩', en: 'Suggested prompts', aka: ['추천 질문', '빠른 질문', 'prompt chips'],
        when: '첫 화면에서 무엇을 물을지 막막할 때, 답변 뒤 후속 질문을 유도할 때',
        avoid: '5개를 넘게 늘어놓는 것, 앱 기능과 무관한 일반 질문',
        notes: [
          '2~4개, 한 줄 길이. 눌리면 입력창에 채우거나 바로 전송하는 둘 중 하나로 통일해요.',
          '모바일에서는 가로 스크롤 칩보다 세로 목록이 읽기 쉬워요.',
          '후속 질문 칩은 다음 메시지를 보내면 사라지게 해요.'
        ],
        vs: { topic: 'confusable-pairs', id: 'chip-badge', name: '칩', text: '여기서 칩은 눌러서 질문을 보내는 버튼 역할이에요. 일반 칩과 뱃지의 차이는 헷갈리는 짝 주제에서 비교해요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 1500,
          phases: [['등장', 360, 1200], ['선택', 2000, 2600], ['전송 후 사라짐', 2760, 3200]],
          alt: '빈 대화 화면에 추천 질문 세 개가 차례로 올라오고, 첫 질문을 누르면 칩이 사라지면서 그 질문이 내 말풍선으로 올라가는 시연',
          html: K => bar(K) +
            `<div class="gr"><i class="big">${K.icon('sparkle')}</i><b>무엇을 도와드릴까요?</b></div>` +
            '<div class="ch c1">이번 주 저녁 메뉴 짜 줘</div><div class="ch c2">남은 재료로 뭘 만들까?</div><div class="ch c3">장 볼 목록 정리해 줘</div>' +
            `<div class="u uu"><p>${ASK}</p></div>` + inp(K) + K.tap(8, 11.3, 'tp')
        }
      },
      {
        id: 'regenerate', ko: '다시 생성', en: 'Regenerate', aka: ['재생성', '다른 답변', 'retry'],
        when: '답변이 마음에 들지 않을 때',
        avoid: '질문을 바꿔야 하는 경우(고쳐 묻기)',
        notes: [
          '마지막 답변 아래에 아이콘과 라벨을 두고, 생성 중에는 비활성으로 해요.',
          '새 답변이 생겨도 이전 버전을 버리지 않고 ‘1/2’ 표시와 화살표로 오가게 해요.',
          '어떤 버전이 이후 대화의 기준인지 보이게 해요.'
        ],
        vs: { id: 'edit-resend', text: '고쳐 묻기는 질문을 바꿔서 다시 보내고, 다시 생성은 같은 질문에 새 답변을 받아요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['생성 중', 1800, 2520], ['버전 2 유지', 2760, 4560], ['이전 버전', 4800, 5160]],
          alt: '다시 생성을 누르면 기존 답변이 사라지고 점이 튀다가 새 답변이 나타나며 2/2 표시가 생기고, 왼쪽 화살표를 누르면 처음 답변으로 돌아가 1/2가 되는 시연',
          html: K => bar(K) + `<div class="u"><p>${ASK}</p></div>` +
            `<div class="a">${av(K)}<div class="ab"><p class="tx v1">${ANS}</p><p class="tx v2">월 순두부찌개, 화 계란볶음밥, 수 대파전을 추천해요.</p><span class="dots"><b></b><b></b><b></b></span></div></div>` +
            `<div class="act"><span class="rg">${K.icon('refresh')}<em>다시 생성</em></span><span class="cn"><i class="pv">${K.icon('chevL')}</i><span class="nn"><b class="n2">2/2</b><b class="n1">1/2</b></span><i class="nxt">${K.icon('chevR')}</i></span></div>` +
            inp(K) + K.tap(5.4, 10.45, 'tp1') + K.tap(10.05, 10.45, 'tp2')
        }
      },
      {
        id: 'citations', ko: '출처 표시', en: 'Citations', aka: ['근거', '인용', 'sources', 'references'],
        when: '사실 확인이 필요한 답변, 검색이나 문서 기반 답변',
        avoid: '근거 없는 출처를 장식으로 붙이는 것(신뢰를 해쳐요)',
        notes: [
          '문장 끝에 작은 번호를 붙이고, 누르면 출처 제목, 도메인, 해당 구절을 보여 줘요.',
          '답변 아래에 출처 목록을 두고 링크는 새 탭으로 열며 rel="noopener"를 써요.',
          '출처를 불러오지 못할 때의 오류 처리를 준비해요.'
        ],
        vs: { topic: 'feedback', id: 'badge', name: '뱃지', text: '뱃지는 알림 수 같은 개수를 알리는 표시이고, 출처 번호는 답변의 근거와 연결하는 표시예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4200,
          phases: [['답변 등장', 360, 1200], ['출처 표시', 2040, 2760], ['번호 선택', 3360, 3720], ['연결 강조', 3720, 5040]],
          alt: '답변 문장 끝에 번호 1과 2가 나타나고 아래에 출처 목록이 올라온 뒤, 번호 1을 누르면 번호가 진해지고 같은 번호의 출처 항목이 강조되는 시연',
          html: K => bar(K) + '<div class="u"><p>두부는 얼마나 두고 먹어?</p></div>' +
            `<div class="a">${av(K)}<div class="tx"><p class="s s1">두부는 냉장해 3일 안에 먹어요<sup class="c c1">1</sup></p><p class="s s2">대파는 씻지 말고 종이에 싸요<sup class="c c2">2</sup></p></div></div>` +
            '<span class="sl">출처</span>' +
            '<div class="sr sr1"><i>1</i><span><b>두부 보관 안내</b><em>foods.example</em></span></div>' +
            '<div class="sr sr2"><i>2</i><span><b>대파 오래 먹는 법</b><em>tips.example</em></span></div>' +
            inp(K) + K.tap(11.9, 7.4, 'tp')
        }
      },
      {
        id: 'feedback-buttons', ko: '답변 피드백', en: 'Feedback buttons', aka: ['좋아요 싫어요', '복사', '평가 버튼'],
        when: '답변 품질을 모으거나 답변을 다시 쓰게 할 때',
        avoid: '답변이 끝나기 전에 보여 주는 것',
        notes: [
          '아이콘만 쓰므로 aria-label과 툴팁을 달고 터치 영역은 44px로 해요.',
          '눌리면 채움 상태가 남고, 복사는 토스트로 확인해요.',
          '싫어요 뒤에는 이유를 선택으로 짧게 묻고, 생성이 끝난 뒤에만 보이게 해요.'
        ],
        vs: { topic: 'ratings', id: 'thumbs', name: '좋아요 싫어요', text: '일반 평가의 좋아요 싫어요와 같은 모양이지만, 여기서는 답변 품질을 모으는 용도라 복사 버튼과 함께 묶어요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2000,
          phases: [['버튼 등장', 400, 700], ['좋아요', 1400, 1800], ['복사', 2800, 4200]],
          alt: '답변이 끝나면 좋아요, 싫어요, 복사 버튼이 나타나고, 좋아요를 누르면 아이콘이 채워지며, 복사를 누르면 복사했어요 토스트가 떴다가 사라지는 시연',
          html: K => bar(K) + `<div class="u"><p>${ASK}</p></div>` +
            `<div class="a">${av(K)}<p class="tx">${ANS}</p></div>` +
            `<div class="fb"><span class="tu">${K.icon('thumbUp')}</span><span>${K.icon('thumbDown')}</span><span>${K.icon('copy')}</span></div>` +
            `<div class="tw"><span class="ts">${K.icon('check')}복사했어요</span></div>` +
            inp(K) + K.tap(3.9, 11.5, 'tp1') + K.tap(8.5, 11.5, 'tp2')
        }
      },
      {
        id: 'edit-resend', ko: '고쳐 묻기', en: 'Edit and resend', aka: ['질문 수정', '다시 보내기', 'edit message'],
        when: '오타, 조건 추가, 질문 방향 변경',
        avoid: '같은 질문으로 다른 답을 원할 때(다시 생성)',
        notes: [
          '내 말풍선에 연필 아이콘을 두고(호버나 길게 누르기), 수정하면 그 이후 대화가 분기됨을 알려요.',
          '이전 분기를 ‘1/2’처럼 오갈 수 있게 하고, 수정은 취소할 수 있어야 해요.',
          '수정하는 동안에는 입력 칸이 말풍선 자리에서 열려요.'
        ],
        vs: { id: 'regenerate', text: '다시 생성은 질문 그대로 새 답변을 받고, 고쳐 묻기는 내 질문을 바꿔서 보내요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4200,
          phases: [['수정 모드', 1440, 3240], ['보내기', 3480, 3720], ['분기 표시', 3840, 5400]],
          alt: '내 말풍선 옆 연필을 누르면 말풍선이 입력 칸으로 바뀌어 매운 거 빼고를 덧붙이고, 보내기를 누르면 새 질문과 새 답변이 나타나며 2/2 표시가 생기는 시연',
          html: K => bar(K) +
            `<div class="u ub1"><p>${ASK}</p></div><i class="pen">${K.icon('edit')}</i>` +
            `<div class="a a1">${av(K)}<p class="tx">${ANS}</p></div>` +
            `<div class="ed"><div class="tx2">${ASK}<span class="add"> (매운 거 빼고)</span></div><span class="cap">수정하면 이후 대화가 바뀌어요</span><div class="btns">${K.app.button('취소', 'ghost')}${K.app.button('보내기', 'primary')}</div></div>` +
            `<div class="u2"><p>${ASK} (매운 거 빼고)</p><span class="br">${K.icon('chevL')}<b>2/2</b>${K.icon('chevR')}</span></div>` +
            `<div class="a a2">${av(K)}<p class="tx">월 두부조림(순한 맛), 화 달걀찜, 수 김구이 정식을 추천해요.</p></div>` +
            inp(K) + K.tap(5.1, 5.27, 'tp1') + K.tap(13.0, 9.05, 'tp2')
        }
      },
      {
        id: 'attachment', ko: '파일 첨부', en: 'File attachment', aka: ['첨부', '업로드', '클립'],
        when: '문서 요약, 이미지 설명, 데이터 분석처럼 파일을 대화에 붙일 때',
        avoid: '허용 형식과 크기를 알리지 않고 업로드하게 하는 것',
        notes: [
          '입력창 옆 + 또는 클립 아이콘으로 열고 드래그 앤 드롭과 붙여넣기도 지원해요.',
          '첨부한 파일은 입력창 위에 이름, 크기, 제거 x가 있는 미리보기 칩으로 보여 주고 업로드 진행률과 실패 시 재시도를 둬요.',
          '허용 형식과 크기 제한을 미리 알리고, 파일에 개인정보가 있을 수 있음을 고려해 사용 범위를 알려요.'
        ],
        vs: { topic: 'inputs', id: 'tag-input', name: '태그 입력', text: '태그 입력은 입력한 글이 칩으로 바뀌는 칸이고, 파일 첨부 칩은 업로드한 파일을 입력창 위에 미리 보여 주는 표시예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['첨부 선택', 360, 720], ['업로드', 960, 2640], ['전송', 3720, 4080]],
          alt: '클립 아이콘을 누르면 입력창 위에 장보기목록.pdf 칩이 나타나 진행 바가 차오르고 완료 표시가 뜨며, 질문을 보내면 파일과 글이 함께 내 말풍선으로 올라가는 시연',
          html: K => bar(K) +
            `<div class="um"><div class="fc">${K.icon('note')}<span><b>장보기목록.pdf</b><em>120KB</em></span></div><p>이 목록 요약해 줘</p></div>` +
            `<div class="pc">${K.icon('note')}<span class="fnm"><b>장보기목록.pdf</b><em>120KB</em></span><span class="okk">${K.icon('checkCircle')}</span><span class="xx">${K.icon('x')}</span><span class="pb"><i></i></span></div>` +
            inp(K, '<span class="ty">이 목록 요약해 줘</span>') + K.tap(1.7, 19.8, 'tp1') + K.tap(14.3, 19.78, 'tp2')
        }
      },
      {
        id: 'agent-steps', ko: '에이전트 단계', en: 'Agent steps', aka: ['작업 단계', '도구 사용', 'tool calls'],
        when: '검색, 코드 실행, 파일 편집처럼 여러 단계를 AI가 직접 할 때',
        avoid: '내부 처리 로그를 그대로 노출하는 것(사용자가 이해할 수준으로 요약해요)',
        notes: [
          '단계마다 상태 아이콘(대기, 진행, 완료, 실패)과 사람이 읽을 수 있는 문장을 써요.',
          '기본은 접힌 한 줄 요약(‘4단계 완료’)이고 펼치면 자세히 보여 줘요. 진행 중에는 현재 단계를 강조해요.',
          '실패하면 어느 단계에서 왜 실패했는지와 재시도를 보여 주고, 결제나 삭제 같은 단계는 승인 버튼으로 멈춰요.'
        ],
        vs: { id: 'thinking', text: '생각 중 표시는 내용 없이 처리 중임만 알리고, 에이전트 단계는 지금 무슨 작업을 하는지 단계별로 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['단계 진행', 480, 3840], ['접힘', 4440, 4800], ['결과 표시', 4800, 5520]],
          alt: '도우미가 냉장고 재료 확인, 가족 취향 살펴보기, 메뉴 고르기, 목록에 담기 네 단계를 차례로 진행해 하나씩 완료 표시가 되고, 화살표를 누르면 4단계 완료 한 줄로 접히며 결과 문장이 나타나는 시연',
          html: K => bar(K) + `<div class="u"><p>${ASK}</p></div>` +
            `<div class="hd">${av(K)}<span class="ht run">작업 중…</span><span class="ht dn">4단계 완료</span><i class="chev">${K.icon('chevD')}</i></div>` +
            '<div class="rws">' + ['냉장고 재료 확인', '가족 취향 살펴보기', '메뉴 3개 고르기', '장보기 목록에 담기']
              .map((t, i) => `<div class="rw r${i + 1}"><i class="st"><b class="sp"></b><b class="ck">${K.icon('check')}</b></i><span>${t}</span></div>`).join('') + '</div>' +
            '<p class="res">저녁 메뉴 3가지를 목록에 담았어요. 월 두부조림, 화 달걀말이, 수 김구이 정식이에요.</p>' +
            inp(K) + K.tap(14.4, 7.6, 'tp')
        }
      }
    ],
    css: K => [
      IDS.map(id => E(id, SHARED)).join('\n'),

      E('thinking', `
& .u{animation-name:aiThU}
& .th{top:6.9em}
& .ans{top:6.9em;animation-name:aiThAns}
& .th{animation-name:aiThTh}
& .thw{margin-left:2.1em;height:1.5em;display:flex;align-items:center;gap:.6em}
& .dots{display:flex;gap:.3em}
& .dots b{width:.42em;height:.42em;border-radius:50%;background:var(--a-mut);animation-duration:1.2s;animation-timing-function:ease-in-out}
& .dots b:nth-child(1){animation-name:aiThD1}.t-ai-chat-thinking .dots b:nth-child(2){animation-name:aiThD2}.t-ai-chat-thinking .dots b:nth-child(3){animation-name:aiThD3}
& .thw em{font-style:normal;font-size:.62em;color:var(--a-mut);animation-name:aiThLab}
& .ty{font-size:.64em;white-space:nowrap;animation-name:aiThTy}
& .phd{animation-name:aiThPh}
& .sd{animation-name:aiThSd}
& .tp{animation-name:aiThTap}
@keyframes aiThD1{0%,40%,100%{transform:none;opacity:.35}20%{transform:translateY(-.3em);opacity:1}}
@keyframes aiThD2{0%,20%,60%,100%{transform:none;opacity:.35}40%{transform:translateY(-.3em);opacity:1}}
@keyframes aiThD3{0%,40%,80%,100%{transform:none;opacity:.35}60%{transform:translateY(-.3em);opacity:1}}
@keyframes aiThLab{0%,52%{opacity:0}58%,100%{opacity:1}}
@keyframes aiThTy{0%,8%{opacity:1}10%,94%{opacity:0}98%,100%{opacity:1}}
@keyframes aiThPh{0%,8%{opacity:0}10%,94%{opacity:1}98%,100%{opacity:0}}
@keyframes aiThSd{0%,8%{background:var(--a-brand)}10%,94%{background:#d8d8d4}98%,100%{background:var(--a-brand)}}
${K.kf.fade('aiThU', [[10, 16, 94, 100]], .8)}
${K.kf.fade('aiThTh', [[18, 24, 78, 82]], .5)}
${K.kf.fade('aiThAns', [[80, 86, 94, 100]], .4)}
${K.kf.tap('aiThTap', 8)}`),

      E('streaming', `
& .a{top:6.9em}
& .l{margin:0;width:fit-content}
& .l1{animation-name:aiStL1}.t-ai-chat-streaming .l2{animation-name:aiStL2}.t-ai-chat-streaming .l3{animation-name:aiStL3}.t-ai-chat-streaming .l4{animation-name:aiStL4}
& .act{position:absolute;left:3em;top:11.6em;display:flex;gap:.9em;color:var(--a-mut);animation-name:aiStAct}
& .act .k-i{width:1.05em;height:1.05em}
& .sd{animation-name:aiStSd}
& .isend,& .istop{position:absolute;inset:0;display:grid;place-items:center}
& .isend{animation-name:aiStIs}
& .istop{animation-name:aiStIp}
& .sq{width:.65em;height:.65em;border-radius:.12em;background:#fff}
${wipe('aiStL1', 14, 26)}
${wipe('aiStL2', 28, 40)}
${wipe('aiStL3', 42, 54)}
${wipe('aiStL4', 56, 68)}
@keyframes aiStSd{0%,12%{background:#d8d8d4}16%,70%{background:var(--a-dark)}74%,100%{background:#d8d8d4}}
@keyframes aiStIs{0%,12%{opacity:1}16%,70%{opacity:0}74%,100%{opacity:1}}
@keyframes aiStIp{0%,12%{opacity:0}16%,70%{opacity:1}74%,100%{opacity:0}}
${K.kf.fade('aiStAct', [[76, 82, 94, 100]], .5)}`),

      E('suggested-prompts', `
& .gr{position:absolute;left:0;right:0;top:4.2em;text-align:center;animation-name:aiSpGr}
& .big{display:grid;place-items:center;width:3em;height:3em;margin:0 auto .6em;border-radius:50%;background:#fbe6dc;color:var(--a-brand)}
& .big .k-i{width:1.6em;height:1.6em}
& .gr b{font-size:.84em}
& .ch{position:absolute;left:1.4em;right:1.4em;height:2.2em;display:flex;align-items:center;padding:0 1em;border:.08em solid #cfcfca;border-radius:1.1em;background:#fff;font-size:.68em}
& .ch{left:2.06em;right:2.06em;height:3.24em;border-radius:1.6em}
& .c1{top:15em;animation-name:aiSpC1}
& .c2{top:18.8em;animation-name:aiSpC2}
& .c3{top:22.6em;animation-name:aiSpC3}
& .uu{animation-name:aiSpU}
& .tp{animation-name:aiSpTap}
@keyframes aiSpC1{0%,6%{opacity:0;transform:translateY(.8em);background:#fff;border-color:#cfcfca}14%,36%{opacity:1;transform:none;background:#fff;border-color:#cfcfca}40%,44%{opacity:1;transform:scale(.98);background:#fbe6dc;border-color:var(--a-brand)}52%,100%{opacity:0;transform:none;background:#fbe6dc;border-color:var(--a-brand)}}
${K.kf.fade('aiSpC2', [[9, 17, 46, 52]], .8)}
${K.kf.fade('aiSpC3', [[12, 20, 46, 52]], .8)}
${K.kf.fade('aiSpGr', [[2, 8, 44, 50]], .6)}
${K.kf.fade('aiSpU', [[48, 54, 94, 100]], .8)}
${K.kf.tap('aiSpTap', 36)}`),

      E('regenerate', `
& .a{top:6.9em}
& .ab{position:relative;height:2.4em}
& .v1,& .v2{position:absolute;left:0;top:0;right:0}
& .v1{animation-name:aiRgV1}
& .v2{animation-name:aiRgV2}
& .dots{position:absolute;left:2.1em;top:.5em;display:flex;gap:.3em;opacity:0;animation-name:aiRgTh}
& .dots b{width:.42em;height:.42em;border-radius:50%;background:var(--a-mut);animation-name:aiRgD;animation-duration:1s}
& .dots b:nth-child(2){animation-name:aiRgD2}.t-ai-chat-regenerate .dots b:nth-child(3){animation-name:aiRgD3}
& .act{position:absolute;left:3em;top:9.5em;width:11.5em;height:1.9em}
& .rg{position:absolute;left:0;top:0;height:1.9em;display:flex;align-items:center;gap:.4em;color:var(--a-mut);animation-name:aiRgRg}
& .rg .k-i{width:1em;height:1em}
& .rg em{font-style:normal;font-size:.62em;font-weight:700}
& .cn{position:absolute;left:6.6em;top:0;height:1.9em;display:flex;align-items:center;color:var(--a-mut);opacity:0;animation-name:aiRgCn}
& .cn .k-i{width:.9em;height:.9em}
& .nn{position:relative;display:block;width:2.2em;height:1em;font-size:.62em;font-weight:700;text-align:center}
& .nn b{position:absolute;inset:0;line-height:1.6em}
& .n2{animation-name:aiRgN2}
& .n1{animation-name:aiRgN1}
& .tp1{animation-name:aiRgTap1}
& .tp2{animation-name:aiRgTap2}
@keyframes aiRgV1{0%,26%{opacity:1}30%,80%{opacity:0}86%,100%{opacity:1}}
@keyframes aiRgV2{0%,40%{opacity:0}46%,76%{opacity:1}80%,100%{opacity:0}}
@keyframes aiRgRg{0%,22%{opacity:1}26%,44%{opacity:.4}48%,100%{opacity:1}}
@keyframes aiRgN2{0%,79%{opacity:1}81%,100%{opacity:0}}
@keyframes aiRgN1{0%,79%{opacity:0}81%,100%{opacity:1}}
@keyframes aiRgD{0%,100%{transform:none;opacity:.35}50%{transform:translateY(-.3em);opacity:1}}
@keyframes aiRgD2{0%,16%,100%{transform:none;opacity:.35}50%,66%{transform:translateY(-.3em);opacity:1}}
@keyframes aiRgD3{0%,33%,100%{transform:none;opacity:.35}66%,83%{transform:translateY(-.3em);opacity:1}}
@keyframes aiRgTh{0%,30%{opacity:0}33%,38%{opacity:1}42%,100%{opacity:0}}
@keyframes aiRgCn{0%,44%{opacity:0}48%,94%{opacity:1}98%,100%{opacity:0}}
${K.kf.tap('aiRgTap1', 22)}
${K.kf.tap('aiRgTap2', 74)}`),

      E('citations', `
& .a{top:6.9em}
& .s{margin:0}
& .s1{animation-name:aiCtS1}.t-ai-chat-citations .s2{animation-name:aiCtS2}
& .c{display:inline-grid;place-items:center;width:1.15em;height:1.15em;margin-left:.3em;vertical-align:.2em;border-radius:50%;background:var(--a-soft);color:var(--a-mut);font-size:.8em;font-weight:700;font-style:normal}
& .c1{animation-name:aiCtC1}.t-ai-chat-citations .c2{animation-name:aiCtC2}
& .sl{position:absolute;left:1.4em;top:17.6em;font-size:.55em;font-weight:700;color:var(--a-mut);animation-name:aiCtSl}
& .sl{top:19em;left:2.5em}
& .sr{position:absolute;left:1.4em;right:1.4em;height:2.2em;display:flex;align-items:center;gap:.6em;padding:0 .8em;border:.08em solid var(--a-line);border-radius:.6em;background:#fff}
& .sr i{display:grid;place-items:center;flex:none;width:1.1em;height:1.1em;border-radius:50%;background:var(--a-soft);color:var(--a-mut);font-style:normal;font-size:.62em;font-weight:700}
& .sr i{width:1.7em;height:1.7em}
& .sr b{display:block;font-size:.64em}
& .sr em{display:block;font-style:normal;font-size:.5em;color:var(--a-mut)}
& .sr1{top:11.4em;animation-name:aiCtR1}
& .sr2{top:13.9em;animation-name:aiCtR2}
& .tp{animation-name:aiCtTap}
${K.kf.fade('aiCtS1', [[6, 12, 92, 98]], .5)}
${K.kf.fade('aiCtS2', [[14, 20, 92, 98]], .5)}
${K.kf.fade('aiCtSl', [[34, 40, 92, 98]], 0)}
${K.kf.fade('aiCtR2', [[40, 46, 92, 98]], .6)}
@keyframes aiCtC1{0%,18%{transform:scale(0);background:var(--a-soft);color:var(--a-mut)}22%{transform:scale(1.25);background:var(--a-soft);color:var(--a-mut)}25%,56%{transform:scale(1);background:var(--a-soft);color:var(--a-mut)}60%,90%{transform:scale(1);background:var(--a-brand);color:#fff}98%,100%{transform:scale(0);background:var(--a-soft);color:var(--a-mut)}}
@keyframes aiCtC2{0%,26%{transform:scale(0)}30%{transform:scale(1.25)}33%,92%{transform:scale(1)}98%,100%{transform:scale(0)}}
@keyframes aiCtR1{0%,34%{opacity:0;transform:translateY(.6em);background:#fff;border-color:var(--a-line)}40%,58%{opacity:1;transform:none;background:#fff;border-color:var(--a-line)}62%,86%{opacity:1;transform:none;background:#fbe6dc;border-color:var(--a-brand)}92%{opacity:1;background:#fbe6dc;border-color:var(--a-brand)}98%,100%{opacity:0;transform:none;background:#fbe6dc;border-color:var(--a-brand)}}
${K.kf.tap('aiCtTap', 56)}`),

      E('feedback-buttons', `
& .a{top:6.9em}
& .fb{position:absolute;left:2.8em;top:10.4em;display:flex;gap:.1em;color:var(--a-mut);animation-name:aiFbRow}
& .fb span{display:grid;place-items:center;width:2.2em;height:2.2em;border-radius:50%}
& .fb .k-i{width:1.1em;height:1.1em}
& .tu .k-i{animation-name:aiFbTu}
& .tw{position:absolute;left:0;right:0;bottom:3.9em;display:flex;justify-content:center}
& .ts{display:flex;align-items:center;gap:.4em;padding:.55em 1em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;font-size:.66em;opacity:0;animation-name:aiFbTs}
& .ts .k-i{width:1.1em;height:1.1em;color:#7fd6a3}
& .tp1{animation-name:aiFbTap1}
& .tp2{animation-name:aiFbTap2}
${K.kf.fade('aiFbRow', [[8, 14, 92, 98]], .6)}
${K.kf.fade('aiFbTs', [[60, 64, 80, 84]], .6)}
@keyframes aiFbTu{0%,28%{fill:none;stroke:var(--a-mut);transform:scale(1)}32%{fill:var(--a-brand);stroke:var(--a-brand);transform:scale(1.3)}36%,88%{fill:var(--a-brand);stroke:var(--a-brand);transform:scale(1)}94%,100%{fill:none;stroke:var(--a-mut);transform:scale(1)}}
${K.kf.tap('aiFbTap1', 28)}
${K.kf.tap('aiFbTap2', 56)}`),

      E('edit-resend', `
& .ub1{animation-name:aiEdU1}
& .pen{position:absolute;left:4.2em;top:4.37em;width:1.8em;height:1.8em;border-radius:50%;background:var(--a-soft);color:var(--a-mut);display:grid;place-items:center;opacity:0;animation-name:aiEdPen}
& .pen .k-i{width:.95em;height:.95em}
& .a1{top:6.9em;animation-name:aiEdA1}
& .a2{top:9em;animation-name:aiEdA2}
& .ed{position:absolute;z-index:3;left:1.2em;right:.9em;top:4.1em;height:6.6em;padding:.7em;border-radius:.8em;background:var(--a-soft);opacity:0;animation-name:aiEdEd}
& .tx2{border:.1em solid var(--a-brand);border-radius:.7em;padding:.6em .8em;background:#fff;font-size:.68em;line-height:1.4}
& .add{opacity:0;animation-name:aiEdAdd}
& .cap{position:absolute;left:1.7em;top:5.9em;font-size:.52em;color:var(--a-mut)}
& .btns{position:absolute;right:.7em;bottom:.7em;display:flex;gap:.4em}
& .btns .k-btn{width:4.2em;padding:0}
& .u2{position:absolute;right:.9em;left:3em;top:4.4em;display:flex;flex-direction:column;align-items:flex-end;opacity:0;animation-name:aiEdU2}
& .br{display:flex;align-items:center;gap:.2em;margin-top:.5em;color:var(--a-mut);font-size:.6em}
& .br .k-i{width:1.1em;height:1.1em}
& .br b{font-size:1em}
& .tp1{animation-name:aiEdTap1}
& .tp2{animation-name:aiEdTap2}
@keyframes aiEdU1{0%,20%{opacity:1}24%,94%{opacity:0}98%,100%{opacity:1}}
@keyframes aiEdA1{0%,22%{opacity:1}26%,94%{opacity:0}98%,100%{opacity:1}}
@keyframes aiEdAdd{0%,31%{opacity:0}35%,100%{opacity:1}}
${K.kf.fade('aiEdPen', [[8, 12, 19, 23]], 0)}
${K.kf.fade('aiEdEd', [[24, 28, 54, 58]], .4)}
${K.kf.fade('aiEdU2', [[58, 62, 92, 96]], .5)}
${K.kf.fade('aiEdA2', [[62, 68, 92, 96]], .5)}
${K.kf.tap('aiEdTap1', 14)}
${K.kf.tap('aiEdTap2', 50)}`),

      E('attachment', `
& .um{position:absolute;right:.9em;top:4.4em;width:9.8em;padding:.6em;border-radius:1em 1em .25em 1em;background:var(--a-brand);color:#fff;opacity:0;animation-name:aiAtUm}
& .um p{margin:.5em 0 0;font-size:.68em;padding:0 .2em}
& .fc{display:flex;align-items:center;gap:.5em;padding:.5em .6em;border-radius:.6em;background:#fff;color:var(--a-ink)}
& .fc .k-i{width:1.2em;height:1.2em;color:var(--a-brand)}
& .fc b,& .pc b{display:block;font-size:.62em}
& .fc em,& .pc em{display:block;font-style:normal;font-size:.5em;color:var(--a-mut)}
& .pc{position:absolute;left:.9em;bottom:3.5em;width:10.6em;height:2.4em;display:flex;align-items:center;gap:.5em;padding:0 .7em;border-radius:.7em;border:.08em solid var(--a-line);background:#fff;overflow:hidden;opacity:0;animation-name:aiAtPc}
& .pc>.k-i{width:1.2em;height:1.2em;color:var(--a-brand)}
& .fnm{margin-right:auto}
& .okk{display:grid;color:var(--a-ok);opacity:0;animation-name:aiAtOk}
& .okk .k-i,& .xx .k-i{width:1em;height:1em}
& .xx{display:grid;color:var(--a-mut)}
& .pb{position:absolute;left:0;right:0;bottom:0;height:.22em;background:var(--a-soft);animation-name:aiAtPbw}
& .pb i{position:absolute;inset:0;background:var(--a-brand);transform-origin:left;transform:scaleX(0);animation-name:aiAtPb}
& .ty{font-size:.64em;white-space:nowrap;opacity:0;animation-name:aiAtTy}
& .phd{animation-name:aiAtPh}
& .sd{animation-name:aiAtSd}
& .tp1{animation-name:aiAtTap1}
& .tp2{animation-name:aiAtTap2}
${K.kf.fade('aiAtUm', [[68, 74, 92, 98]], .8)}
${K.kf.fade('aiAtPc', [[10, 16, 62, 68]], .6)}
@keyframes aiAtOk{0%,45%{opacity:0}49%,100%{opacity:1}}
@keyframes aiAtPbw{0%,45%{opacity:1}48%,100%{opacity:0}}
@keyframes aiAtPb{0%,16%{transform:scaleX(0)}44%,100%{transform:scaleX(1)}}
@keyframes aiAtTy{0%,48%{opacity:0}52%,64%{opacity:1}67%,100%{opacity:0}}
@keyframes aiAtPh{0%,48%{opacity:1}52%,64%{opacity:0}67%,100%{opacity:1}}
@keyframes aiAtSd{0%,48%{background:#d8d8d4}52%,64%{background:var(--a-brand)}67%,100%{background:#d8d8d4}}
${K.kf.tap('aiAtTap1', 6)}
${K.kf.tap('aiAtTap2', 62)}`),

      E('agent-steps', `
& .hd{position:absolute;left:.9em;right:.9em;top:6.8em;height:1.6em;display:flex;align-items:center}
& .ht{position:absolute;left:3.1em;font-size:.68em;font-weight:700}
& .ht.run{color:var(--a-mut);animation-name:aiAsRun}
& .ht.dn{opacity:0;animation-name:aiAsDn}
& .chev{position:absolute;right:.2em;top:.3em;display:grid;color:var(--a-mut);animation-name:aiAsChev}
& .chev .k-i{width:1em;height:1em}
& .rws{position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;animation-name:aiAsRws}
& .rw{position:absolute;left:3em;right:1.4em;height:1.7em;display:flex;align-items:center;gap:.6em;color:var(--a-mut)}
& .rw span{font-size:.64em}
& .r1{top:8.7em;animation-name:aiAsT1}
& .r2{top:10.6em;animation-name:aiAsT2}
& .r3{top:12.5em;animation-name:aiAsT3}
& .r4{top:14.4em;animation-name:aiAsT4}
& .st{position:relative;flex:none;width:1.1em;height:1.1em;border-radius:50%;border:.09em solid #c7c7c2}
& .st b{position:absolute;inset:-.09em;border-radius:50%}
& .sp{border:.14em solid transparent;border-top-color:var(--a-brand);border-right-color:var(--a-brand);opacity:0}
& .ck{background:var(--a-brand);color:#fff;display:grid;place-items:center;opacity:0}
& .ck .k-i{width:.7em;height:.7em;stroke-width:3}
& .r1 .sp{animation-name:aiAsS1,aiAsSpin;animation-duration:var(--cyc),.9s;animation-timing-function:var(--k-ease),linear}
& .r2 .sp{animation-name:aiAsS2,aiAsSpin;animation-duration:var(--cyc),.9s;animation-timing-function:var(--k-ease),linear}
& .r3 .sp{animation-name:aiAsS3,aiAsSpin;animation-duration:var(--cyc),.9s;animation-timing-function:var(--k-ease),linear}
& .r4 .sp{animation-name:aiAsS4,aiAsSpin;animation-duration:var(--cyc),.9s;animation-timing-function:var(--k-ease),linear}
& .r1 .ck{animation-name:aiAsK1}.t-ai-chat-agent-steps .r2 .ck{animation-name:aiAsK2}.t-ai-chat-agent-steps .r3 .ck{animation-name:aiAsK3}.t-ai-chat-agent-steps .r4 .ck{animation-name:aiAsK4}
& .res{position:absolute;left:3em;right:1em;top:8.7em;margin:0;font-size:.66em;line-height:1.55;opacity:0;animation-name:aiAsRes}
& .res{left:4.55em;right:1.5em;top:13.2em}
& .tp{animation-name:aiAsTap}
@keyframes aiAsRun{0%,68%{opacity:1}72%,94%{opacity:0}98%,100%{opacity:1}}
@keyframes aiAsDn{0%,70%{opacity:0}74%,92%{opacity:1}96%,100%{opacity:0}}
@keyframes aiAsChev{0%,72%{transform:rotate(0)}78%,94%{transform:rotate(-90deg)}98%,100%{transform:rotate(0)}}
@keyframes aiAsRws{0%,74%{opacity:1}80%,94%{opacity:0}98%,100%{opacity:1}}
@keyframes aiAsSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes aiAsS1{0%,6%{opacity:0}8%,22%{opacity:1}24%,100%{opacity:0}}
@keyframes aiAsS2{0%,20%{opacity:0}22%,36%{opacity:1}38%,100%{opacity:0}}
@keyframes aiAsS3{0%,34%{opacity:0}36%,50%{opacity:1}52%,100%{opacity:0}}
@keyframes aiAsS4{0%,48%{opacity:0}50%,64%{opacity:1}66%,100%{opacity:0}}
${win('aiAsK1', 22, 86)}
${win('aiAsK2', 36, 86)}
${win('aiAsK3', 50, 86)}
${win('aiAsK4', 64, 86)}
@keyframes aiAsT1{0%,6%{color:var(--a-mut)}8%,86%{color:var(--a-ink)}90%,100%{color:var(--a-mut)}}
@keyframes aiAsT2{0%,20%{color:var(--a-mut)}22%,86%{color:var(--a-ink)}90%,100%{color:var(--a-mut)}}
@keyframes aiAsT3{0%,34%{color:var(--a-mut)}36%,86%{color:var(--a-ink)}90%,100%{color:var(--a-mut)}}
@keyframes aiAsT4{0%,48%{color:var(--a-mut)}50%,86%{color:var(--a-ink)}90%,100%{color:var(--a-mut)}}
${K.kf.fade('aiAsRes', [[80, 86, 92, 98]], .5)}
${K.kf.tap('aiAsTap', 72)}`)
    ].join('\n')
  });
})();
