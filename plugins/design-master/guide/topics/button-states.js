/* Topic: 버튼 상태 (button-states). Reference: plugins/design-master/references/inputs.md (section A)
   Every selector starts with .t-button-states-<element>. Keyframe prefix: bs. */
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
  const ids = ['default', 'hover', 'pressed', 'focus', 'disabled', 'loading', 'success', 'error', 'selected'];
  const each = (sel, body) => ids.map(i => `.t-button-states-${i} ${sel}`).join(',') + `{${body}}`;

  UIGuide.registerTopic({
    id: 'button-states',
    intro: '같은 버튼이 조작에 따라 모양을 바꾸는 9가지 순간이에요. 상태마다 색 하나에만 기대지 않고 아이콘이나 글자를 함께 바꿉니다.',
    elements: [
      {
        id: 'default', ko: '기본', en: 'Default', aka: ['rest', '평소', '주 버튼', 'primary'],
        when: '아무 조작도 하지 않았을 때의 기준 모양. 주 버튼은 채움, 보조는 윤곽, 약한 행동은 글자 버튼으로 위계를 나눠요',
        avoid: '한 화면에 채움 버튼을 여러 개 두는 것, 라벨을 ‘확인’처럼 모호하게 쓰는 것',
        notes: [
          '한 화면에 채움 버튼은 하나만 둬요. 라벨은 동사로 구체적으로 써요(‘저장’, ‘주문하기’).',
          '글자와 배경 대비는 4.5:1 이상이에요.',
          '터치 영역은 44~48px 이상, 버튼 사이 간격은 12px이에요. 상태 전환은 100~200ms.'
        ],
        vs: { id: 'hover', text: '기본은 조작 전의 기준 모양이고, 호버는 그 위에 마우스를 올렸을 때 한 단계 달라진 모양이에요.' },
        demo: {
          frame: 'bare', cycle: 4500, still: 2250,
          phases: [['채움', 360, 1350], ['윤곽', 1440, 2430], ['글자', 2520, 3510]],
          alt: '주문하기 채움 버튼, 나중에 하기 윤곽 버튼, 건너뛰기 글자 버튼이 위아래로 놓여 있고, 차례로 윤곽이 강조되며 주 버튼, 보조, 약한 행동이라는 이름이 붙는 시연',
          html: K => '<div class="b b1"><span>주문하기</span></div><div class="b b2"><span>나중에 하기</span></div><div class="b b3"><span>건너뛰기</span></div>' +
            '<span class="lab l1">주 버튼</span><span class="lab l2">보조</span><span class="lab l3">약한 행동</span>'
        }
      },
      {
        id: 'hover', ko: '호버', en: 'Hover', aka: ['마우스 올림', 'mouse over'],
        when: '데스크톱 웹에서 마우스를 올렸을 때 클릭할 수 있다고 알려 줄 때',
        avoid: '호버에만 중요한 정보를 두는 것(터치 기기에는 호버가 없어요)',
        notes: [
          '색을 한 단계 밝게나 어둡게 바꿔요. 호버에만 의미를 싣지 않아요.',
          '@media (hover: hover)로 감싸서 터치 기기에서 누른 뒤 호버 모양이 남는 문제를 막아요.',
          '터치 영역과 간격 기준은 기본 상태와 같아요. 전환은 100~200ms.'
        ],
        vs: { id: 'pressed', text: '호버는 올려만 둔 모양이라 한 단계만 달라지고, 눌림은 누르는 동안 더 진해지고 살짝 작아져요.' },
        demo: {
          frame: 'bare', cycle: 4000, still: 2000,
          phases: [['올림', 1000, 1120], ['호버', 1120, 2800], ['벗어남', 2800, 3040]],
          alt: '마우스 포인터가 주문하기 버튼 위로 들어오면 버튼 색이 한 단계 어두워지고 그림자가 생기며, 포인터가 떠나면 원래 색으로 돌아오는 시연',
          html: K => '<div class="b"><span>주문하기</span></div><div class="cap">마우스를 올리면 한 단계 어두워져요</div>' + K.cursor(8.2, 6.2, 'cur')
        }
      },
      {
        id: 'pressed', ko: '눌림', en: 'Pressed', aka: ['active', '누르는 중'],
        when: '눌렀다는 것을 바로 확인시켜야 하는 모든 버튼, 특히 터치 화면',
        avoid: '눌림 표시를 너무 약하게 해서 손가락에 가려졌을 때 알아보기 어렵게 하는 것',
        notes: [
          '색을 한 단계 더 진하게 하거나 scale(0.97) 정도로 살짝 눌린 느낌을 줘요.',
          '100ms 안에 반응해야 해요. 손가락에 가려질 수 있으니 색 변화를 크게 해요.',
          '손을 떼면 바로 원래 모양으로 돌아와요.'
        ],
        vs: { id: 'hover', text: '호버는 마우스만 올린 모양이고, 눌림은 실제로 누르는 동안만 나타나요.' },
        demo: {
          frame: 'bare', cycle: 3600, still: 1400,
          phases: [['누름', 720, 2020]],
          alt: '손가락이 주문하기 버튼을 누르고 있는 동안 버튼이 더 진한 색으로 바뀌며 살짝 작아지고, 손가락을 떼자 원래 모양으로 돌아오는 시연',
          html: K => '<div class="b"><span>주문하기</span></div><div class="cap">누르는 동안 더 진하고 살짝 작아져요</div>' + K.finger(8, 6.5, 'fg')
        }
      },
      {
        id: 'focus', ko: '포커스', en: 'Focus', aka: ['포커스 링', 'focus ring', 'focus-visible', '키보드 선택'],
        when: '키보드나 보조기기로 선택된 요소를 보여 줄 때. 모든 상호작용 요소에 필요해요',
        avoid: 'outline: none만 쓰고 대체 모양을 두지 않는 것',
        notes: [
          ':focus-visible에 2px 이상 윤곽선, 배경과의 대비 3:1 이상, outline-offset 2px을 줘요.',
          '키보드로 이동할 때만 보이게 하고 마우스 클릭에는 굳이 보이지 않게 해요.',
          'Tab 순서는 화면에서 읽는 순서와 같아야 해요.'
        ],
        vs: { id: 'hover', text: '호버는 마우스를 올릴 때, 포커스는 키보드로 닿았을 때 나타나요. 서로 대신할 수 없어요.' },
        demo: {
          frame: 'bare', cycle: 5000, still: 3200,
          phases: [['첫 포커스', 900, 2200], ['이동', 2500, 4000]],
          alt: 'Tab 키를 한 번 누르면 취소 버튼에 굵은 윤곽선이 생기고, 한 번 더 누르면 윤곽선이 저장 버튼으로 옮겨 갔다가 사라지는 시연',
          html: K => '<div class="key">Tab</div><div class="b b1"><span>취소</span></div><div class="b b2"><span>저장</span></div><i class="fr"></i><div class="cap">Tab 키로 이동하면 윤곽선이 따라가요</div>'
        }
      },
      {
        id: 'disabled', ko: '비활성', en: 'Disabled', aka: ['사용 불가', 'inactive'],
        when: '필수 입력이 비어 있는 제출 버튼처럼 지금은 누를 수 없는 상태',
        avoid: '왜 못 누르는지 알 수 없을 때(가능하면 활성으로 두고 눌렀을 때 인라인 오류로 이유를 알려요)',
        notes: [
          '흐리게(opacity 0.4~0.5) 하고 cursor: not-allowed를 써요. 너무 흐리면 읽을 수 없어요.',
          'disabled 속성은 포커스를 막아요. 이유를 읽어 줘야 하면 aria-disabled를 써요.',
          '조건이 채워지면 바로 활성으로 바뀌어야 해요.'
        ],
        vs: { id: 'default', text: '기본은 누를 수 있는 평소 모양이에요. 비활성은 눌러도 아무 일도 일어나지 않아요.' },
        demo: {
          frame: 'bare', cycle: 6000, still: 1000,
          phases: [['비활성', 0, 2640], ['입력', 1680, 2400], ['활성', 2760, 5520]],
          alt: '이름 칸이 빈 동안 저장 버튼이 흐리고 눌러도 반응이 없다가, 두부를 입력하자 버튼이 선명해지고 누르면 눌리는 시연',
          html: K => '<span class="lbl">항목 이름</span><div class="fld"><span class="pl">예: 두부</span><span class="val">두부</span></div>' +
            '<div class="b"><span>저장</span></div>' +
            '<div class="cap c1">채우기 전에는 흐리고 눌러도 반응이 없어요</div><div class="cap c2">채우면 선명해지고 누를 수 있어요</div>' +
            K.tap(8, 6.7, 'tp1') + K.tap(8, 6.7, 'tp2')
        }
      },
      {
        id: 'loading', ko: '로딩', en: 'Loading', aka: ['처리 중', 'busy'],
        when: '저장, 결제, 제출처럼 서버 요청을 보내는 동안 중복 클릭을 막아야 할 때',
        avoid: '요청이 길고 다른 작업을 계속해야 할 때(백그라운드 진행 표시)',
        notes: [
          '버튼 폭을 유지해 레이아웃이 흔들리지 않게 해요. 라벨은 ‘저장 중…’처럼 바꾸거나 스피너 옆에 남겨요.',
          'aria-busy="true"를 주고, 처리 중에는 다시 눌러도 요청이 한 번만 가게 해요.',
          '2초 넘게 걸리면 단계 안내를 더해요.'
        ],
        vs: { topic: 'loading', id: 'loading-button', name: '로딩 버튼', text: '같은 항목이에요. 여기서는 버튼 상태 중 하나로, 그쪽은 폼 안에서 요청 하나가 끝날 때까지의 흐름으로 봐요.' },
        demo: {
          frame: 'bare', cycle: 4500, still: 1600,
          phases: [['요청', 450, 700], ['처리 중', 700, 2800], ['복귀', 2800, 3100]],
          alt: '저장 버튼을 누르면 같은 크기 그대로 스피너와 저장 중 글자로 바뀌고, 처리 중에 다시 눌러도 반응하지 않다가 끝나면 저장으로 돌아오는 시연',
          html: K => '<div class="b"><span class="lb lb1">저장</span><span class="lb lb2"><i class="spn"></i><span>저장 중…</span></span></div>' +
            '<div class="cap">폭은 그대로, 눌러도 한 번만 보내요</div>' + K.tap(8, 5.9, 'tp1') + K.tap(8, 5.9, 'tp2')
        }
      },
      {
        id: 'success', ko: '성공', en: 'Success', aka: ['완료', 'done', '저장됨'],
        when: '저장, 복사, 전송처럼 결과가 바로 나오는 행동을 버튼 자체가 알릴 때',
        avoid: '여러 단계로 끝나는 큰 흐름(완료 화면)',
        notes: [
          '1~2초 유지한 뒤 기본 모양으로 돌아와요.',
          '초록색만 쓰지 않고 체크 아이콘과 라벨 변경(‘저장됨’)을 함께 써요.',
          '버튼이 변하는 연출은 완료 표시의 버튼 모핑을 참고해요.'
        ],
        vs: { topic: 'completion', id: 'button-morph', name: '버튼 모핑', text: '성공은 버튼의 상태 하나이고, 버튼 모핑은 로딩에서 성공으로 모양이 변해 가는 연출 전체예요.' },
        demo: {
          frame: 'bare', cycle: 4500, still: 2000,
          phases: [['성공', 630, 3150], ['복귀', 3500, 3800]],
          alt: '저장 버튼을 누르면 버튼이 초록색으로 바뀌며 체크 아이콘과 저장됨 글자가 나타나고, 잠시 뒤 원래 저장 버튼으로 돌아오는 시연',
          html: K => '<div class="b"><i class="bg2"></i><span class="lb lb1">저장</span><span class="lb lb2">' + K.icon('check') + '<span>저장됨</span></span></div>' +
            '<div class="cap">초록과 체크 아이콘, 글자가 함께 바뀌어요</div>' + K.tap(8, 5.9, 'tp')
        }
      },
      {
        id: 'error', ko: '오류', en: 'Error', aka: ['실패', 'failed', '다시 시도'],
        when: '요청에 실패한 직후 다시 시도하도록 이끌 때',
        avoid: '버튼만 붉게 바꾸고 이유를 알려 주지 않는 것',
        notes: [
          '버튼만 붉게 바꾸지 말고 이유와 재시도 방법을 근처 인라인 오류로 설명해요.',
          '라벨을 ‘다시 시도’로 바꾸는 방식이 흔해요. 아이콘과 글자로 색 없이도 알 수 있게 해요.',
          '다시 누르면 오류가 사라지고 로딩 상태로 넘어가요.'
        ],
        vs: { topic: 'feedback', id: 'inline-error', name: '인라인 오류', text: '버튼 오류는 실패했다는 신호이고, 이유 문장은 인라인 오류가 맡아요. 둘을 함께 써요.' },
        demo: {
          frame: 'bare', cycle: 5000, still: 2000,
          phases: [['오류', 600, 3200], ['재시도', 2900, 3300]],
          alt: '저장 버튼을 누르자 버튼이 살짝 떨리며 빨간색 다시 시도로 바뀌고 아래에 저장하지 못했다는 문장이 나타나며, 다시 누르면 원래 버튼으로 돌아오는 시연',
          html: K => '<div class="b"><i class="bg2"></i><span class="lb lb1">저장</span><span class="lb lb2">' + K.icon('alert') + '<span>다시 시도</span></span></div>' +
            '<div class="msg">' + K.icon('alert') + '<span>저장하지 못했어요. 연결을 확인해 주세요</span></div>' + K.tap(8, 5.9, 'tp1') + K.tap(8, 5.9, 'tp2')
        }
      },
      {
        id: 'selected', ko: '선택됨', en: 'Selected', aka: ['토글 버튼', 'pressed', '켜짐', 'on'],
        when: '필터 칩, 보기 전환, 좋아요처럼 켜짐과 꺼짐이 있는 버튼',
        avoid: '색 하나만으로 켜짐을 알리는 것, 한 번 누르면 바로 이동하는 일반 버튼에 쓰는 것',
        notes: [
          '배경 채움과 체크 아이콘, 굵기처럼 단서를 두 가지 이상 써요.',
          'aria-pressed="true" 또는 aria-selected로 상태를 알려요.',
          '선택됨과 호버, 포커스가 겹칠 때의 모양도 미리 정해 둬요.'
        ],
        vs: { id: 'pressed', text: '눌림은 누르는 순간만 나타나고, 선택됨은 손을 뗀 뒤에도 켜진 채로 남아요.' },
        demo: {
          frame: 'bare', cycle: 4500, still: 1800,
          phases: [['선택됨', 810, 2430], ['해제', 2520, 2900]],
          alt: '채소, 유제품, 과일 칩 가운데 유제품을 누르면 칩이 어두운 채움과 체크 표시로 바뀌어 켜진 채 머물고, 다시 누르면 꺼지는 시연',
          html: K => '<div class="tg c1"><span>채소</span></div><div class="tg c2"><span>유제품</span><div class="on">' + K.icon('check') + '<span>유제품</span></div></div><div class="tg c3"><span>과일</span></div>' +
            '<div class="cap">채움과 체크, 두 가지로 켜졌다고 알려요</div>' + K.tap(7.9, 5.7, 'tp1') + K.tap(7.9, 5.7, 'tp2')
        }
      }
    ],
    css: K => `
/* shared */
${each('.b', 'position:absolute;left:3em;top:4.6em;width:10em;height:2.6em;border-radius:.7em;display:flex;align-items:center;justify-content:center;gap:.4em;background:var(--a-brand);color:#fff;font-weight:700')}
${each('.b>span:not(.lb)', 'font-size:.8em')}
${each('.cap', 'position:absolute;left:0;right:0;bottom:1em;text-align:center;font-size:.64em;color:var(--a-mut)')}
${each('.lb', 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:.4em;z-index:1')}
${each('.lb>span', 'font-size:.8em')}
${each('.lb .k-i', 'width:1em;height:1em')}
${each('.bg2', 'position:absolute;inset:0;border-radius:inherit;background:var(--a-ok);opacity:0')}

/* default */
.t-button-states-default .b{left:1.2em;width:9em;height:2.4em}
.t-button-states-default .b1{top:1.4em}
.t-button-states-default .b2{top:4.5em;background:transparent;border:.09em solid var(--a-ink);color:var(--a-ink)}
.t-button-states-default .b3{top:7.6em;background:transparent;color:var(--a-mut)}
.t-button-states-default .b3 span{text-decoration:underline;text-underline-offset:.2em}
.t-button-states-default .b::after{content:"";position:absolute;inset:-.35em;border-radius:1em;border:.12em solid var(--a-brand);opacity:0}
.t-button-states-default .b1::after{animation-name:bsDfA}
.t-button-states-default .b2::after{animation-name:bsDfB}
.t-button-states-default .b3::after{animation-name:bsDfC}
.t-button-states-default .lab{position:absolute;left:16.6em;font-size:.66em;font-weight:700;color:var(--a-brand);opacity:0;white-space:nowrap}
.t-button-states-default .l1{top:3.3em;animation-name:bsDfA}
.t-button-states-default .l2{top:8em;animation-name:bsDfB}
.t-button-states-default .l3{top:12.7em;animation-name:bsDfC}
${vis('bsDfA', [[8, 30]])}${vis('bsDfB', [[32, 54]])}${vis('bsDfC', [[56, 78]])}

/* hover */
.t-button-states-hover .b{animation-name:bsHvBg}
.t-button-states-hover .cur{animation-name:bsHvCur}
@keyframes bsHvBg{0%,24%{background:#c24719;box-shadow:0 0 0 rgba(194,71,25,0)}28%,70%{background:#9c3510;box-shadow:0 .3em .8em rgba(194,71,25,.3)}76%,100%{background:#c24719;box-shadow:0 0 0 rgba(194,71,25,0)}}
@keyframes bsHvCur{0%,10%{opacity:0;transform:translate(5em,4em)}25%,70%{opacity:1;transform:none}90%{opacity:1;transform:translate(5em,4em)}96%,100%{opacity:0;transform:translate(5em,4em)}}

/* pressed */
.t-button-states-pressed .b{animation-name:bsPrBg}
.t-button-states-pressed .fg{animation-name:bsPrF}
@keyframes bsPrBg{0%,19%{background:#c24719;transform:scale(1)}22%,56%{background:#8a2d0b;transform:scale(.96)}60%,100%{background:#c24719;transform:scale(1)}}
${K.kf.press('bsPrF', 20, 56)}

/* focus */
.t-button-states-focus .b{top:4.6em;width:6.2em}
.t-button-states-focus .b1{left:1.4em;background:var(--a-soft);color:var(--a-ink)}
.t-button-states-focus .b2{left:8.4em}
.t-button-states-focus .key{position:absolute;left:8.6em;top:1.3em;width:2.4em;height:1.5em;border-radius:.35em;border:.08em solid #c3c3be;background:#fff;box-shadow:0 .15em 0 #c9c9c4;display:grid;place-items:center;font-size:.8em;font-weight:700;animation-name:bsFcKey}
.t-button-states-focus .fr{position:absolute;left:1.05em;top:4.25em;width:6.9em;height:3.3em;border-radius:1em;border:.16em solid var(--a-ink);opacity:0;animation-name:bsFcRing}
@keyframes bsFcKey{0%,12%{transform:none;box-shadow:0 .15em 0 #c9c9c4}14%,18%{transform:translateY(.12em);box-shadow:0 .03em 0 #c9c9c4}22%,46%{transform:none;box-shadow:0 .15em 0 #c9c9c4}48%,52%{transform:translateY(.12em);box-shadow:0 .03em 0 #c9c9c4}56%,100%{transform:none;box-shadow:0 .15em 0 #c9c9c4}}
@keyframes bsFcRing{0%,14%{opacity:0;transform:none}18%,44%{opacity:1;transform:none}50%,80%{opacity:1;transform:translateX(7em)}88%{opacity:0;transform:translateX(7em)}89%,100%{opacity:0;transform:none}}

/* disabled */
.t-button-states-disabled .lbl{position:absolute;left:2.4em;top:1.3em;font-size:.6em;font-weight:700;color:var(--a-mut)}
.t-button-states-disabled .fld{position:absolute;left:1.4em;right:1.4em;top:1.7em;height:2.3em;border:.07em solid #cfcfca;border-radius:.5em;background:#fff;display:flex;align-items:center;padding:0 .8em}
.t-button-states-disabled .fld span{position:absolute;left:.8em;font-size:.74em}
.t-button-states-disabled .pl{color:#9a9b96;animation-name:bsDsPh}
.t-button-states-disabled .val{opacity:0;animation-name:bsDsVal}
.t-button-states-disabled .b{top:5.4em;animation-name:bsDsBtn;cursor:not-allowed}
.t-button-states-disabled .c1{animation-name:bsDsC1}
.t-button-states-disabled .c2{opacity:0;animation-name:bsDsC2}
.t-button-states-disabled .tp1{animation-name:bsDsTp1}
.t-button-states-disabled .tp2{animation-name:bsDsTp2}
${vis('bsDsPh', [[0, 26], [97, 100]])}${vis('bsDsVal', [[28, 92]])}${vis('bsDsC1', [[0, 44], [97, 100]])}${vis('bsDsC2', [[48, 92]])}
@keyframes bsDsBtn{0%,44%{opacity:.4;transform:scale(1)}48%,60%{opacity:1;transform:scale(1)}62%{opacity:1;transform:scale(.96)}67%,90%{opacity:1;transform:scale(1)}96%,100%{opacity:.4;transform:scale(1)}}
${K.kf.tap('bsDsTp1', 10)}
${K.kf.tap('bsDsTp2', 62)}

/* loading */
.t-button-states-loading .lb1{animation-name:bsLdA}
.t-button-states-loading .lb2{opacity:0;animation-name:bsLdB}
.t-button-states-loading .spn{display:block;width:1em;height:1em;border-radius:50%;border:.16em solid rgba(255,255,255,.4);border-top-color:#fff;animation-name:bsSpin;animation-duration:.8s;animation-timing-function:linear}
.t-button-states-loading .tp1{animation-name:bsLdT1}
.t-button-states-loading .tp2{animation-name:bsLdT2}
${vis('bsLdA', [[0, 12], [66, 100]])}${vis('bsLdB', [[16, 62]])}
@keyframes bsSpin{to{transform:rotate(360deg)}}
${K.kf.tap('bsLdT1', 10)}
${K.kf.tap('bsLdT2', 50)}

/* success */
.t-button-states-success .lb1{animation-name:bsScA}
.t-button-states-success .lb2{opacity:0;animation-name:bsScB}
.t-button-states-success .lb2 .k-i{animation-name:bsScPop}
.t-button-states-success .bg2{animation-name:bsScBg}
.t-button-states-success .tp{animation-name:bsScT}
${vis('bsScA', [[0, 10], [78, 100]])}${vis('bsScB', [[14, 70]])}${vis('bsScBg', [[14, 72]])}
@keyframes bsScPop{0%,12%{transform:scale(.3)}20%{transform:scale(1.25)}26%,100%{transform:scale(1)}}
${K.kf.tap('bsScT', 8)}

/* error */
.t-button-states-error .b{animation-name:bsErShake}
.t-button-states-error .lb1{animation-name:bsErA}
.t-button-states-error .lb2{opacity:0;animation-name:bsErB}
.t-button-states-error .bg2{background:var(--a-err);animation-name:bsErBg}
.t-button-states-error .msg{position:absolute;left:3em;top:7.7em;display:flex;align-items:center;gap:.35em;color:var(--a-err);opacity:0;animation-name:bsErMsg}
.t-button-states-error .msg span{font-size:.62em;font-weight:700}
.t-button-states-error .msg .k-i{width:.85em;height:.85em}
.t-button-states-error .tp1{animation-name:bsErT1}
.t-button-states-error .tp2{animation-name:bsErT2}
${vis('bsErA', [[0, 10], [70, 100]])}${vis('bsErB', [[12, 64]])}${vis('bsErBg', [[12, 66]])}${vis('bsErMsg', [[16, 64]])}
@keyframes bsErShake{0%,11%{transform:none}13%{transform:translateX(-.35em)}15%{transform:translateX(.35em)}17%{transform:translateX(-.25em)}19%{transform:translateX(.2em)}21%,100%{transform:none}}
${K.kf.tap('bsErT1', 8)}
${K.kf.tap('bsErT2', 58)}

/* selected */
.t-button-states-selected .tg{position:absolute;top:4.6em;height:2.2em;border-radius:1.1em;border:.09em solid #b9bab5;background:#fff;display:grid;place-items:center;font-weight:700}
.t-button-states-selected .tg>span{font-size:.74em;font-weight:400}
.t-button-states-selected .c1{left:1.5em;width:3.8em}
.t-button-states-selected .c2{left:5.8em;width:4.4em}
.t-button-states-selected .c3{left:10.7em;width:3.8em}
.t-button-states-selected .on{position:absolute;inset:-.09em;border-radius:inherit;background:var(--a-dark);color:#fff;display:flex;align-items:center;justify-content:center;gap:.25em;opacity:0;animation-name:bsSlOn}
.t-button-states-selected .on span{font-size:.74em;font-weight:700}
.t-button-states-selected .on .k-i{width:.85em;height:.85em;stroke-width:3}
.t-button-states-selected .tp1{animation-name:bsSlT1}
.t-button-states-selected .tp2{animation-name:bsSlT2}
${vis('bsSlOn', [[18, 60]])}
${K.kf.tap('bsSlT1', 12)}
${K.kf.tap('bsSlT2', 54)}
`
  });
})();
