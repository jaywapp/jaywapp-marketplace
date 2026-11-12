/* Topic: 완료 표시 (completion). Reference: plugins/design-master/references/indicators-completion.md (section B)
   Every selector starts with .t-completion-<element>. Keyframe prefix: cm. */
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
  const CONF = ['#c24719', '#1d7a49', '#e0a526', '#232427', '#3b6fd4'];
  const confetti = () => {
    let seed = 11;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    let s = '';
    for (let i = 0; i < 24; i++) {
      const dx = ((rnd() - .5) * 15).toFixed(2), ry = (-(2.5 + rnd() * 4)).toFixed(2), dy = (9 + rnd() * 6).toFixed(2), r = Math.round((rnd() - .5) * 900);
      s += `<i class="pc" style="--dx:${dx}em;--ry:${ry}em;--dy:${dy}em;--r:${r}deg;background:${CONF[i % CONF.length]}"></i>`;
    }
    return s;
  };
  // strikethrough timings: [row number, tap %]
  const STRIKES = [[2, 10], [3, 40]];

  UIGuide.registerTopic({
    id: 'completion',
    intro: '끝났다는 것을 알리는 9가지 연출이에요. 의미는 글자와 아이콘이 전하고 모션은 거들 뿐이라서, 자주 하는 행동에는 작게, 드문 큰 성취에만 크게 씁니다.',
    elements: [
      {
        id: 'check-draw', ko: '체크 그리기', en: 'Check animation', aka: ['체크 애니메이션', 'success check', '성공 체크'],
        when: '저장, 결제, 인증 완료 같은 확실한 성공의 순간',
        avoid: '자주 반복되는 가벼운 행동(체크 연출이 번거로워져요)',
        notes: [
          'SVG stroke-dashoffset으로 400~600ms. 원을 그린 다음 체크 순서예요.',
          '마지막 상태가 정지 이미지로도 의미가 통해야 해요. 옆에 글(‘완료됐어요’)을 둬요.',
          'prefers-reduced-motion이면 그려지는 과정 없이 최종 상태만 보여요.'
        ],
        vs: { id: 'success-screen', text: '완료 화면은 체크가 화면 전체를 대표하고 다음 행동까지 안내해요. 체크 그리기는 그 안의 작은 연출이에요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2400,
          phases: [['원 그리기', 800, 1400], ['체크 그리기', 1400, 1900], ['머묾', 1900, 4400]],
          alt: '항목 저장 폼에서 저장 버튼을 누르면 화면이 하얗게 덮이며 초록 원이 먼저 그려지고 이어서 체크 표시가 그려진 뒤 저장됐어요 글자가 나타났다가 사라지는 시연',
          html: K => K.app.status() + K.app.bar('항목 저장', [], { back: true }) +
            '<div class="f1">' + K.app.field('항목', '두부') + '</div><div class="f2">' + K.app.field('수량', '2모') + '</div>' +
            '<div class="go"><span>저장</span></div>' +
            '<div class="ov"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="arc" cx="26" cy="26" r="23" pathLength="100"/><path class="ck" d="M15.5 27l8 8 14-16" pathLength="100"/></svg><b>저장됐어요</b></div>' + K.tap(8, 18.63, 'tp')
        }
      },
      {
        id: 'strikethrough', ko: '할 일 줄긋기', en: 'Strikethrough', aka: ['취소선', '체크리스트 완료', 'line-through'],
        when: '체크리스트나 할 일 목록에서 체크하면 해당 항목에 취소선이 그어지고 약간 흐려지는 완료 표현',
        avoid: '완료된 항목이 중요하게 읽혀야 하는 화면(청구서 내역)',
        notes: [
          '선이 왼쪽에서 오른쪽으로 그려지는 200~300ms예요.',
          '흐려져도 읽을 수 있는 대비를 유지해요(4.5:1 미만이 되면 접근성 위험).',
          '체크박스 상태와 aria-checked가 일치해야 해요. 완료 항목을 아래로 보낼지 그대로 둘지 정해요.'
        ],
        vs: { id: 'check-draw', text: '체크 그리기는 체크 표시 자체가 그려지는 모션이고, 할 일 줄긋기는 항목 글자 위에 선이 지나가는 모션이에요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 3000,
          phases: [['줄 긋기', 700, 950], ['줄 긋기', 2200, 2450], ['머묾', 2450, 4500]],
          alt: '장보기 목록에서 달걀 10구를 체크하면 체크 원이 채워지며 글자 위로 왼쪽에서 오른쪽으로 선이 그어지고 글자가 살짝 흐려지고, 이어 두부도 같은 모양으로 완료되는 시연',
          html: K => K.app.screen() + K.tap(1.5, 7.15, 'tp1') + K.tap(1.5, 9.45, 'tp2')
        }
      },
      {
        id: 'button-morph', ko: '버튼 모핑', en: 'Button morph', aka: ['버튼 변신', 'morphing button', '제출 버튼 연출'],
        when: '제출, 저장, 구독처럼 버튼 하나에서 흐름이 끝나는 행동',
        avoid: '버튼 주변 레이아웃이 흔들리는 구성, 한 번에 끝나지 않는 긴 처리',
        notes: [
          '폭이 줄었다 다시 복귀하므로 주변 레이아웃을 흔들지 않게 컨테이너 폭을 고정해요.',
          '단계(기본, 로딩, 성공)를 버튼 상태와 맞춰요.',
          '1~2초 뒤 기본으로 복귀하거나 다음 행동 버튼으로 바뀌어요.'
        ],
        vs: { topic: 'button-states', id: 'success', name: '성공', text: '성공은 버튼의 상태 하나이고, 버튼 모핑은 기본에서 로딩, 성공으로 모양이 변해 가는 연출 전체예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3400,
          phases: [['줄어듦', 720, 1320], ['로딩', 1320, 2760], ['성공 원', 2880, 3720], ['펼쳐짐', 3720, 4320]],
          alt: '저장 버튼을 누르면 버튼이 동그랗게 줄어들며 안에서 스피너가 돌고, 초록색으로 바뀌며 체크가 나타났다가 다시 넓게 펼쳐져 저장됨으로 머문 뒤 원래 버튼으로 돌아가는 시연',
          html: K => K.app.status() + K.app.bar('항목 저장', [], { back: true }) +
            '<div class="f1">' + K.app.field('항목', '두부') + '</div><div class="f2">' + K.app.field('수량', '2모') + '</div>' +
            '<div class="bm"><i class="bg1"></i><i class="bg2"></i><span class="lb1">저장</span><span class="sp"><i></i></span><span class="ck">' + K.icon('check') + '</span><span class="lb2">' + K.icon('check') + '저장됨</span></div>' + K.tap(8, 15.9, 'tp')
        }
      },
      {
        id: 'progress-complete', ko: '진행률 완료', en: 'Progress complete', aka: ['100% 완료', '업로드 완료'],
        when: '업로드, 설치, 프로필 완성도처럼 진행 바나 링이 100%에 이르러 끝나는 순간',
        avoid: '100%인데 실제 처리가 안 끝난 상태를 만드는 것(마지막 몇 퍼센트는 실제 완료 후에 채워요)',
        notes: [
          '100%에서 잠깐 머문 뒤 색이 바뀌고 체크로 전환해 완료 상태로 넘어가요.',
          '완료 문구(‘업로드 완료’)를 함께 써요. 색만으로 알리지 않아요.',
          'prefers-reduced-motion이면 최종 상태만 즉시 보여 줘요.'
        ],
        vs: { topic: 'loading', id: 'progress-bar', name: '진행 바', text: '진행 바는 채워지는 동안을 보여 주고, 진행률 완료는 100%에 닿은 뒤 완료로 바뀌는 마지막 순간을 다뤄요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3900,
          phases: [['채워짐', 480, 3000], ['100% 머묾', 3000, 3480], ['완료로 전환', 3480, 3840], ['완료 유지', 3840, 5520]],
          alt: '영수증 업로드 막대가 차올라 100퍼센트에 닿아 잠깐 머물다가, 막대가 주황에서 초록으로 바뀌며 퍼센트 글자가 체크 표시로, 올리는 중 문구가 업로드 완료로 바뀌는 시연',
          html: K => K.app.status() + K.app.bar('사진 올리기', [], { back: true }) +
            '<div class="cd"><div class="hd"><span class="th">' + K.icon('image') + '</span><div class="nt"><b>영수증.jpg</b><span class="s1">올리는 중</span><span class="s2">업로드 완료</span></div></div>' +
            '<div class="tr"><i class="fl"></i><i class="fl2"></i></div>' +
            '<div class="rt"><b class="q0">0%</b><b class="q1">40%</b><b class="q2">80%</b><b class="q3">100%</b><span class="ok">' + K.icon('check') + '</span></div></div>'
        }
      },
      {
        id: 'send', ko: '보냄 애니메이션', en: 'Send animation', aka: ['전송', '종이비행기', 'sent'],
        when: '메시지 전송, 문의 제출처럼 보냈다는 것을 종이비행기나 위로 사라지는 입력으로 알릴 때',
        avoid: '실제 전송 상태와 따로 도는 연출(실패했는데 보낸 것처럼 보이면 안 돼요)',
        notes: [
          '400~700ms. 실제 전송 상태(전송 중, 전송됨, 실패)와 연동해요.',
          '날아간 뒤 실패하면 되돌려서 재시도를 보여 줘요. 낙관적 UI와 같이 쓰면 실패 처리가 필수예요.',
          '상태 글자(‘전송됨’)를 함께 둬서 모션을 놓쳐도 알 수 있게 해요.'
        ],
        vs: { id: 'button-morph', text: '버튼 모핑은 누른 버튼이 변하고, 보냄 애니메이션은 보낸 내용이 입력 칸에서 대화로 날아가는 움직임이에요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 3000,
          phases: [['날아감', 700, 1300], ['보내는 중', 1500, 2400], ['전송됨', 2500, 4500]],
          alt: '가족 채팅 입력창의 응 살게 글자를 보내기로 누르면 종이비행기가 위로 날아가고 글자가 말풍선이 되어 대화에 올라오며, 보내는 중 글자가 전송됨 체크로 바뀌는 시연',
          html: K => K.app.status() + K.app.bar('가족 채팅', [], { back: true }) +
            '<div class="rb"><span>퇴근길에 두부 사 올래?</span></div>' +
            '<div class="mb"><span>응, 살게!</span></div><div class="sd"><span class="d1">보내는 중</span><span class="d2">' + K.icon('check') + '전송됨</span></div>' +
            '<div class="inb"><span class="it">응, 살게!</span><span class="snd">' + K.icon('send') + '</span></div>' + K.tap(13.85, 19.28, 'tp')
        }
      },
      {
        id: 'stamp', ko: '스탬프', en: 'Stamp', aka: ['도장', '승인 도장', 'stamp animation'],
        when: '출석, 승인, 인증 완료처럼 기록됐다는 느낌이 중요한 순간',
        avoid: '사소한 행동마다 찍는 것(가치가 떨어져요)',
        notes: [
          '300~500ms, 크게 시작해서 1.0으로 안착하며 약간의 바운스를 줘요.',
          '도장 글자는 번역 가능한 텍스트로 만들어요(이미지 속 글자 금지).',
          '사라지지 않고 상태로 남아야 해요.'
        ],
        vs: { id: 'badge-unlock', text: '배지 획득은 수집 요소를 얻는 연출이고, 스탬프는 이미 한 일이 기록됐다고 찍어 주는 연출이에요.' },
        demo: {
          frame: 'phone', cycle: 4500, still: 2200,
          phases: [['도장 찍힘', 630, 1080], ['상태로 남음', 1260, 3600]],
          alt: '영수증 카드 아래 확인 버튼을 누르면 장보기 끝 도장이 크게 내려와 살짝 튕기며 카드 오른쪽 아래에 찍히고, 그대로 남아 있다가 사라지는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 영수증', [], { back: true }) +
            '<div class="rc"><b>이번 주 장보기</b><i class="r1"></i><i class="r2"></i><i class="r3"></i><span class="tot">합계 18,400원</span><span class="stamp"><i>장보기<br>끝</i></span></div>' +
            '<div class="go"><span>확인하기</span></div>' + K.tap(8, 18.63, 'tp')
        }
      },
      {
        id: 'badge-unlock', ko: '배지 획득', en: 'Badge unlock', aka: ['업적 달성', '해금', 'achievement'],
        when: '학습, 게임화 요소, 첫 번째 달성처럼 업적이나 보상을 얻었을 때',
        avoid: '사소한 행동마다 터뜨리는 것(가치가 떨어져요)',
        notes: [
          '획득 이유를 글로 알려요(‘7일 연속 달성’).',
          '닫기 쉬운 오버레이로 열고, 나중에 다시 볼 수 있는 보관 화면을 둬요.',
          '600~1000ms. 빛이나 회전은 prefers-reduced-motion이면 정적으로 보여 줘요.'
        ],
        vs: { topic: 'feedback', id: 'badge', name: '뱃지', text: '알림 수를 알리는 뱃지와는 다른 요소예요. 배지 획득은 업적을 얻는 순간의 연출이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2700,
          phases: [['등장', 1200, 1800], ['유지', 1800, 4440], ['퇴장', 4440, 4920]],
          alt: '목록의 마지막 항목을 체크하면 화면이 어두워지고 별 배지가 작게 돌며 커져 배지를 얻었어요 카드가 나타나고, 닫기를 누르면 카드와 배경이 사라지는 시연',
          html: K => K.app.screen({ checked: [0, 1, 2, 3] }) + K.tap(1.5, 14.05, 'tp1') + K.scrim('sc') +
            '<div class="cdd"><span class="md">' + K.icon('star') + '</span><i class="sp1">' + K.icon('sparkle') + '</i><i class="sp2">' + K.icon('sparkle') + '</i><b>배지를 얻었어요</b><span class="ds">7일 연속 장보기를 했어요</span><span class="cl"><span>닫기</span><i class="k-tap tpb"></i></span></div>'
        }
      },
      {
        id: 'confetti', ko: '컨페티', en: 'Confetti', aka: ['색종이', '축하', 'celebration'],
        when: '첫 결제 완료, 목표 달성, 출시 이벤트 같은 드문 큰 성취',
        avoid: '반복 행동, 업무·금융처럼 신중한 맥락, 실제 완료를 확인하기 전',
        notes: [
          '1.5~2초 안에 끝나게 하고 입자 수를 제한해 성능을 지켜요.',
          '화면 조작을 막지 않아요(pointer-events: none).',
          'prefers-reduced-motion이면 생략하고 의미는 글로 전달해요.'
        ],
        vs: { id: 'success-screen', text: '완료 화면은 결과와 다음 행동을 담고, 컨페티는 그 위에 얹는 축하 연출이에요. 컨페티만으로는 의미를 전할 수 없어요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 1500,
          phases: [['터짐', 700, 1200], ['낙하', 1200, 2700], ['메시지 유지', 2700, 3800]],
          alt: '장보기 끝내기 버튼을 누르면 위쪽에서 색종이 조각이 터져 올랐다가 아래로 흩날리며 사라지고, 가운데에는 첫 장보기를 마쳤어요 글자 카드가 남았다가 사라지는 시연',
          html: K => K.app.screen({ checked: [0, 1, 2, 3, 4] }) + '<div class="go"><span>장보기 끝내기</span></div>' +
            '<div class="msg"><b>첫 장보기를 마쳤어요</b><span>다음 주도 같이 담아요</span></div>' + K.tap(8, 18.63, 'tp') + '<div class="cf">' + confetti() + '</div>'
        }
      },
      {
        id: 'success-screen', ko: '완료 화면', en: 'Success screen', aka: ['주문 완료', '접수 완료', 'confirmation'],
        when: '주문, 가입, 신청처럼 여러 단계 흐름이 끝났음을 전체 화면으로 알리고 다음 행동을 안내할 때',
        avoid: '작은 저장 같은 가벼운 행동(토스트나 버튼 성공 상태로 충분해요)',
        notes: [
          '체크 아이콘, 한 줄 결과(‘주문이 접수됐어요’), 핵심 정보(번호, 날짜), 주 행동 하나와 보조 하나를 둬요.',
          '뒤로 가면 제출 화면이 다시 뜨지 않게 이력을 정리해요.',
          '확인 메일 같은 후속 정보를 알려요.'
        ],
        vs: { id: 'check-draw', text: '체크 그리기는 화면 중앙의 작은 아이콘 연출이고, 완료 화면은 결과, 정보, 다음 행동을 모두 담은 화면이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['화면 이동', 800, 1320], ['완료 화면 유지', 1320, 5160], ['되돌아감', 5160, 5640]],
          alt: '주문하기 화면에서 주문하기 버튼을 누르면 오른쪽에서 새 화면이 밀려 들어와 체크 아이콘, 주문이 접수됐어요, 주문번호와 도착 안내, 주문 내역 보기 버튼과 홈으로 버튼이 보이다가 다시 밀려 나가는 시연',
          html: K => K.app.status() + K.app.bar('주문하기', [], { back: true }) + K.app.list(0, 3) + '<div class="go"><span>주문하기</span></div>' + K.tap(8, 18.63, 'tp') +
            '<div class="ss">' + K.app.status() + '<span class="big">' + K.icon('check') + '</span><b>주문이 접수됐어요</b><span class="inf">주문번호 2318 · 내일 오전 도착</span><span class="b1">주문 내역 보기</span><span class="b2">홈으로</span></div>'
        }
      }
    ],
    css: K => `
/* shared form bits */
.t-completion-check-draw .f1,.t-completion-check-draw .f2,.t-completion-button-morph .f1,.t-completion-button-morph .f2{position:absolute;left:1em;right:1em}
.t-completion-check-draw .f1,.t-completion-button-morph .f1{top:4.8em}
.t-completion-check-draw .f2,.t-completion-button-morph .f2{top:8.2em}
.t-completion-check-draw .go,.t-completion-stamp .go,.t-completion-confetti .go,.t-completion-success-screen .go{position:absolute;left:1.2em;right:1.2em;bottom:1.4em;height:2.6em;border-radius:.8em;background:var(--a-brand);color:#fff;display:grid;place-items:center}
.t-completion-check-draw .go span,.t-completion-stamp .go span,.t-completion-confetti .go span,.t-completion-success-screen .go span{font-size:.76em;font-weight:700}

/* check draw */
.t-completion-check-draw .ov{position:absolute;z-index:10;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1em;background:rgba(251,251,249,.97);opacity:0;animation-name:cmCdOv}
.t-completion-check-draw .ov svg{width:6em;height:6em}
.t-completion-check-draw .ov circle,.t-completion-check-draw .ov path{fill:none;stroke:var(--a-ok);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100 100}
.t-completion-check-draw .arc{stroke-dashoffset:100;transform:rotate(-90deg);transform-origin:center;animation-name:cmCdArc}
.t-completion-check-draw .ck{stroke-dashoffset:100;animation-name:cmCdCk}
.t-completion-check-draw .ov b{font-size:.9em;opacity:0;animation-name:cmCdTx}
.t-completion-check-draw .tp{animation-name:cmCdTap}
${vis('cmCdOv', [[14, 88]])}${vis('cmCdTx', [[34, 88]])}
@keyframes cmCdArc{0%,15%{stroke-dashoffset:100}27%,90%{stroke-dashoffset:0}95%,100%{stroke-dashoffset:100}}
@keyframes cmCdCk{0%,27%{stroke-dashoffset:100}37%,90%{stroke-dashoffset:0}95%,100%{stroke-dashoffset:100}}
${K.kf.tap('cmCdTap', 8)}

/* strikethrough */
${STRIKES.map(([n, t], i) => `.t-completion-strikethrough .k-r${n} .k-ck{animation-name:cmSkCk${i}}
.t-completion-strikethrough .k-r${n} .k-n{animation-name:cmSkCl${i}}
.t-completion-strikethrough .k-r${n} .k-n::after{content:"";position:absolute;left:0;right:0;top:55%;height:.09em;background:currentColor;transform-origin:left;transform:scaleX(0);animation-name:cmSkLn${i}}
.t-completion-strikethrough .tp${i + 1}{animation-name:cmSkTap${i}}
@keyframes cmSkCk${i}{0%,${t}%{opacity:0;transform:scale(.4)}${t + 3}%,92%{opacity:1;transform:scale(1)}96%,100%{opacity:0;transform:scale(1)}}
@keyframes cmSkCl${i}{0%,${t + 2}%{color:#1d1e20}${t + 9}%,92%{color:#6f7176}97%,100%{color:#1d1e20}}
@keyframes cmSkLn${i}{0%,${t + 3}%{transform:scaleX(0)}${t + 9}%,92%{transform:scaleX(1)}96%,100%{transform:scaleX(0)}}
${K.kf.tap('cmSkTap' + i, t)}`).join('\n')}

/* button morph */
.t-completion-button-morph .bm{position:absolute;left:2em;right:2em;top:14.6em;height:2.6em;color:#fff;font-weight:700}
.t-completion-button-morph .bm i.bg1,.t-completion-button-morph .bm i.bg2{position:absolute;inset:0;display:block;border-radius:.8em;animation-name:cmBmClip}
.t-completion-button-morph .bg1{background:var(--a-brand)}
.t-completion-button-morph .bg2{background:var(--a-ok);opacity:0;animation-name:cmBmClip,cmBmGreen}
.t-completion-button-morph .bm>span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:.4em;opacity:0}
.t-completion-button-morph .lb1,.t-completion-button-morph .lb2{font-size:.76em}
.t-completion-button-morph .lb1{animation-name:cmBmL1}
.t-completion-button-morph .lb2{animation-name:cmBmL2}
.t-completion-button-morph .lb2 .k-i{width:1.1em;height:1.1em;stroke-width:3}
.t-completion-button-morph .sp{animation-name:cmBmSp}
.t-completion-button-morph .sp i{display:block;width:1.2em;height:1.2em;border-radius:50%;border:.17em solid rgba(255,255,255,.4);border-top-color:#fff;animation-name:cmSpin;animation-duration:.8s;animation-timing-function:linear}
.t-completion-button-morph .ck{animation-name:cmBmCk}
.t-completion-button-morph .ck .k-i{width:1.3em;height:1.3em;stroke-width:3}
.t-completion-button-morph .tp{animation-name:cmBmTap}
${vis('cmBmL1', [[0, 10], [90, 100]])}${vis('cmBmSp', [[20, 46]])}${vis('cmBmCk', [[48, 62]])}${vis('cmBmL2', [[70, 86]])}${vis('cmBmGreen', [[44, 86]])}
@keyframes cmBmClip{0%,12%{clip-path:inset(0 0 0 0 round .8em)}22%,62%{clip-path:inset(0 4.7em 0 4.7em round 1.3em)}72%,100%{clip-path:inset(0 0 0 0 round .8em)}}
@keyframes cmSpin{to{transform:rotate(360deg)}}
${K.kf.tap('cmBmTap', 8)}

/* progress complete */
.t-completion-progress-complete .cd{position:absolute;z-index:2;left:1em;right:1em;top:5em;padding:.9em .9em .8em;border:1px solid var(--a-line);border-radius:.7em;background:#fff}
.t-completion-progress-complete .hd{display:flex;align-items:center;gap:.7em}
.t-completion-progress-complete .th{width:2.4em;height:2.4em;border-radius:.5em;background:var(--a-soft);display:grid;place-items:center;color:var(--a-mut)}
.t-completion-progress-complete .th .k-i{width:1.2em;height:1.2em}
.t-completion-progress-complete .nt{position:relative;height:2.4em}
.t-completion-progress-complete .nt b{display:block;font-size:.74em}
.t-completion-progress-complete .nt span{position:absolute;left:0;top:1.35em;font-size:.6em;white-space:nowrap}
.t-completion-progress-complete .s1{color:var(--a-mut);animation-name:cmPcS1}
.t-completion-progress-complete .s2{color:var(--a-ok);font-weight:700;opacity:0;animation-name:cmPcS2}
.t-completion-progress-complete .tr{position:relative;height:.5em;margin-top:.9em;border-radius:.3em;background:var(--a-line);overflow:hidden}
.t-completion-progress-complete .tr i{position:absolute;inset:0;transform-origin:left;transform:scaleX(0);animation-name:cmPcFill;animation-timing-function:linear}
.t-completion-progress-complete .fl{background:var(--a-brand)}
.t-completion-progress-complete .fl2{background:var(--a-ok);opacity:0;animation-name:cmPcFill,cmPcGreen}
.t-completion-progress-complete .rt{position:relative;height:1.1em;margin-top:.55em}
.t-completion-progress-complete .rt b{position:absolute;right:0;top:0;font-size:.62em;font-weight:700;opacity:0}
.t-completion-progress-complete .q0{animation-name:cmPcQ0}.t-completion-progress-complete .q1{animation-name:cmPcQ1}.t-completion-progress-complete .q2{animation-name:cmPcQ2}.t-completion-progress-complete .q3{animation-name:cmPcQ3}
.t-completion-progress-complete .ok{position:absolute;right:0;top:-.05em;color:var(--a-ok);opacity:0;animation-name:cmPcOk}
.t-completion-progress-complete .ok .k-i{width:1.1em;height:1.1em;stroke-width:3}
${vis('cmPcS1', [[0, 58], [97, 100]])}${vis('cmPcS2', [[62, 92]])}${vis('cmPcGreen', [[58, 92]])}${vis('cmPcOk', [[62, 92]])}
${vis('cmPcQ0', [[0, 14], [97, 100]])}${vis('cmPcQ1', [[14, 28]])}${vis('cmPcQ2', [[28, 44]])}${vis('cmPcQ3', [[44, 59]])}
@keyframes cmPcFill{0%,8%{transform:scaleX(0)}50%,92%{transform:scaleX(1)}96%,100%{transform:scaleX(0)}}

/* send */
.t-completion-send .rb{position:absolute;left:1em;top:4.9em;max-width:10em;padding:.55em .8em;border-radius:.9em .9em .9em .2em;background:var(--a-soft)}
.t-completion-send .rb span,.t-completion-send .mb span{font-size:.72em;display:block}
.t-completion-send .mb{position:absolute;right:1em;top:7.4em;max-width:10em;padding:.55em .85em;border-radius:.9em .9em .2em .9em;background:var(--a-brand);color:#fff;opacity:0;animation-name:cmSnMb}
.t-completion-send .sd{position:absolute;right:1em;top:9.6em;width:5em;height:1em}
.t-completion-send .sd span{position:absolute;right:0;top:0;display:flex;align-items:center;gap:.25em;font-size:.58em;white-space:nowrap;opacity:0}
.t-completion-send .d1{color:var(--a-mut);animation-name:cmSnD1}
.t-completion-send .d2{color:var(--a-ok);font-weight:700;animation-name:cmSnD2}
.t-completion-send .d2 .k-i{width:1.1em;height:1.1em;stroke-width:3}
.t-completion-send .inb{position:absolute;left:.8em;right:.8em;bottom:.8em;height:2.5em;border-radius:1.25em;background:var(--a-soft);display:flex;align-items:center;padding:0 .4em 0 1em}
.t-completion-send .it{flex:1;font-size:.72em;animation-name:cmSnIt}
.t-completion-send .snd{width:1.9em;height:1.9em;border-radius:50%;background:var(--a-brand);color:#fff;display:grid;place-items:center}
.t-completion-send .snd .k-i{width:.95em;height:.95em;animation-name:cmSnPlane}
.t-completion-send .tp{animation-name:cmSnTap}
${vis('cmSnD1', [[30, 48]])}${vis('cmSnD2', [[50, 90]])}${vis('cmSnIt', [[0, 14], [97, 100]])}
@keyframes cmSnMb{0%,17%{opacity:0;transform:translateY(10em)}30%,90%{opacity:1;transform:none}96%,100%{opacity:0;transform:none}}
@keyframes cmSnPlane{0%,14%{transform:none;opacity:1}24%{transform:translate(2.4em,-3em) scale(.6);opacity:0}25%{transform:translate(-2em,2em);opacity:0}32%,100%{transform:none;opacity:1}}
${K.kf.tap('cmSnTap', 14)}

/* stamp */
.t-completion-stamp .rc{position:absolute;left:1.6em;right:1.6em;top:5em;height:10em;padding:1em;border-radius:.7em;border:1px solid var(--a-line);background:#fff;animation-name:cmStCard}
.t-completion-stamp .rc b{display:block;font-size:.8em}
.t-completion-stamp .rc i.r1,.t-completion-stamp .rc i.r2,.t-completion-stamp .rc i.r3{display:block;height:.5em;margin-top:.9em;border-radius:.3em;background:#e4e4df}
.t-completion-stamp .r1{width:70%}.t-completion-stamp .r2{width:55%}.t-completion-stamp .r3{width:62%}
.t-completion-stamp .tot{position:absolute;left:1em;bottom:1em;font-size:.66em;font-weight:700}
.t-completion-stamp .stamp{position:absolute;right:.9em;bottom:.8em;width:4.6em;height:4.6em;border-radius:50%;border:.2em solid var(--a-brand);color:var(--a-brand);display:grid;place-items:center;text-align:center;font-weight:900;opacity:0;animation-name:cmStStamp}
.t-completion-stamp .stamp::after{content:"";position:absolute;inset:.22em;border-radius:50%;border:.08em solid var(--a-brand)}
.t-completion-stamp .stamp i{font-style:normal;font-size:.8em;line-height:1.2}
.t-completion-stamp .tp{animation-name:cmStTap}
@keyframes cmStStamp{0%,14%{opacity:0;transform:rotate(-12deg) scale(2.4)}20%{opacity:1;transform:rotate(-12deg) scale(.9)}24%{opacity:1;transform:rotate(-12deg) scale(1.05)}28%,86%{opacity:1;transform:rotate(-12deg) scale(1)}92%,100%{opacity:0;transform:rotate(-12deg) scale(1)}}
@keyframes cmStCard{0%,19%{transform:none}21%{transform:translateY(.18em)}25%,100%{transform:none}}
${K.kf.tap('cmStTap', 8)}

/* badge unlock */
.t-completion-badge-unlock .k-r5 .k-ck{animation-name:cmBdCk}
.t-completion-badge-unlock .sc{animation-name:cmBdSc}
.t-completion-badge-unlock .cdd{position:absolute;z-index:11;left:1.8em;right:1.8em;top:5.4em;padding:1.4em 1em 1em;border-radius:.9em;background:#fff;text-align:center;display:flex;flex-direction:column;align-items:center;opacity:0;animation-name:cmBdCard}
.t-completion-badge-unlock .md{width:4.6em;height:4.6em;border-radius:50%;background:var(--a-brand);box-shadow:0 0 0 .3em var(--a-warn-bg);color:#fff;display:grid;place-items:center;animation-name:cmBdSpin}
.t-completion-badge-unlock .md .k-i{width:2.2em;height:2.2em;fill:#fff;stroke-width:1.4}
.t-completion-badge-unlock .cdd>i{position:absolute;display:block;color:var(--a-brand);opacity:0}
.t-completion-badge-unlock .cdd>i .k-i{width:1.2em;height:1.2em}
.t-completion-badge-unlock .sp1{left:3.2em;top:1em;animation-name:cmBdSp}
.t-completion-badge-unlock .sp2{right:3.2em;top:2.6em;animation-name:cmBdSp}
.t-completion-badge-unlock .cdd b{margin-top:.9em;font-size:.86em}
.t-completion-badge-unlock .ds{margin-top:.35em;font-size:.62em;color:var(--a-mut)}
.t-completion-badge-unlock .cl{position:relative;margin-top:1.1em;height:2.3em;width:7em;border-radius:.7em;background:var(--a-soft);display:grid;place-items:center}
.t-completion-badge-unlock .cl>span{font-size:.7em;font-weight:700}
.t-completion-badge-unlock .cl .k-tap{left:50%;top:50%;animation-name:cmBdTap2}
.t-completion-badge-unlock .tp1{animation-name:cmBdTap1}
@keyframes cmBdCk{0%,8%{opacity:0;transform:scale(.4)}11%,90%{opacity:1;transform:scale(1)}96%,100%{opacity:0;transform:scale(1)}}
@keyframes cmBdSc{0%,18%{opacity:0}24%,74%{opacity:1}80%,100%{opacity:0}}
@keyframes cmBdCard{0%,20%{opacity:0;transform:scale(.6)}26%{opacity:1;transform:scale(1.06)}30%,74%{opacity:1;transform:scale(1)}80%,100%{opacity:0;transform:scale(.96)}}
@keyframes cmBdSpin{0%,20%{transform:rotate(-30deg) scale(.4)}30%{transform:rotate(6deg) scale(1.1)}34%,100%{transform:none}}
@keyframes cmBdSp{0%,30%{opacity:0;transform:scale(.3)}36%{opacity:1;transform:scale(1.2)}42%,74%{opacity:1;transform:scale(1)}80%,100%{opacity:0;transform:scale(1)}}
${K.kf.tap('cmBdTap1', 8)}
${K.kf.tap('cmBdTap2', 70)}

/* confetti */
.t-completion-confetti .msg{position:absolute;z-index:12;left:1.8em;right:1.8em;top:7.4em;padding:1.1em;border-radius:.9em;background:#fff;text-align:center;box-shadow:0 .8em 2em rgba(10,10,12,.2);opacity:0;animation-name:cmCfMsg}
.t-completion-confetti .msg b{display:block;font-size:.86em}
.t-completion-confetti .msg span{display:block;margin-top:.4em;font-size:.62em;color:var(--a-mut)}
.t-completion-confetti .cf{position:absolute;z-index:11;inset:0;pointer-events:none;overflow:hidden}
.t-completion-confetti .pc{position:absolute;left:8em;top:7em;width:.5em;height:.28em;border-radius:.06em;opacity:0;animation-name:cmCfFly}
.t-completion-confetti .tp{animation-name:cmCfTap}
${vis('cmCfMsg', [[14, 76]])}
@keyframes cmCfFly{0%,13%{opacity:0;transform:translate(0,0) rotate(0deg)}14%{opacity:1;transform:translate(0,0) rotate(0deg);animation-timing-function:cubic-bezier(.2,.7,.3,1)}24%{opacity:1;transform:translate(calc(var(--dx) * .7),var(--ry)) rotate(calc(var(--r) * .4));animation-timing-function:cubic-bezier(.5,0,.9,.6)}52%{opacity:1;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}56%,100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}
${K.kf.tap('cmCfTap', 8)}

/* success screen */
.t-completion-success-screen .tp{animation-name:cmSsTap}
.t-completion-success-screen .ss{position:absolute;z-index:12;inset:0;background:var(--a-bg);display:flex;flex-direction:column;align-items:center;transform:translateX(100%);animation-name:cmSsIn;box-shadow:-.5em 0 1.4em rgba(10,10,12,.12)}
.t-completion-success-screen .ss .k-sb{align-self:stretch}
.t-completion-success-screen .big{margin-top:3.6em;width:4.6em;height:4.6em;border-radius:50%;background:var(--a-ok);color:#fff;display:grid;place-items:center;animation-name:cmSsPop}
.t-completion-success-screen .big .k-i{width:2.2em;height:2.2em;stroke-width:3}
.t-completion-success-screen .ss b{margin-top:1.1em;font-size:.95em}
.t-completion-success-screen .inf{margin-top:.5em;font-size:.62em;color:var(--a-mut)}
.t-completion-success-screen .b1{margin-top:1.8em;width:12em;height:2.6em;border-radius:.8em;background:var(--a-brand);color:#fff;display:grid;place-items:center;font-size:.76em;font-weight:700}
.t-completion-success-screen .b1{width:15.8em;height:3.4em;border-radius:1em}
.t-completion-success-screen .b2{margin-top:1em;font-size:.7em;color:var(--a-mut)}
@keyframes cmSsIn{0%,14%{transform:translateX(100%)}22%,86%{transform:translateX(0)}94%,100%{transform:translateX(100%)}}
@keyframes cmSsPop{0%,22%{transform:scale(.5)}30%{transform:scale(1.1)}35%,100%{transform:scale(1)}}
${K.kf.tap('cmSsTap', 8)}
`
  });
})();
