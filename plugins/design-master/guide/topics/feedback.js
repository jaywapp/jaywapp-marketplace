/* Topic: 알림·피드백 (feedback). Reference: plugins/design-master/references/feedback.md
   Model topic file. Every selector starts with .t-feedback-<element>. */
UIGuide.registerTopic({
  id: 'feedback',
  intro: '사용자 행동의 결과나 시스템 상태를 알리는 요소예요. 얼마나 급한지, 사용자가 무엇을 해야 하는지로 고릅니다.',
  elements: [
    {
      id: 'toast', ko: '토스트', en: 'Toast', aka: ['토스트 메시지', 'toast message'],
      when: '‘복사했어요’, ‘저장됐어요’처럼 결과만 알리면 되는 가벼운 확인',
      avoid: '오류 원인 설명, 되돌리기가 필요한 행동, 꼭 읽어야 하는 정보',
      notes: [
        '2~4초 보여 주고, 글이 길면 5초 안쪽으로 늘려요.',
        '위치는 한 곳에 고정하고 한 번에 하나만 보여요. 여러 개가 생기면 대기열로 돌려요.',
        'role="status"와 aria-live="polite"로 읽히게 하고, 마우스를 올린 동안에는 사라지지 않게 해요.'
      ],
      vs: { id: 'snackbar', text: '스낵바는 되돌리기 같은 액션 버튼이 하나 있고 되돌릴 수 있는 결과에 써요. 토스트는 버튼 없이 확인만 해요.' },
      demo: {
        frame: 'phone', cycle: 5000, still: 2000,
        phases: [['등장', 900, 1200], ['유지', 1200, 3500], ['퇴장', 3500, 3900]],
        alt: '장보기 목록에서 달걀 10구를 체크하면 화면 아래에 ‘달걀 10구를 담았어요’ 토스트가 떠올랐다가 버튼 없이 저절로 사라지는 시연',
        html: K => K.app.screen() + K.tap(1.5, 7.15, 'tp') +
          `<div class="toast">${K.icon('checkCircle')}<span>달걀 10구를 담았어요</span></div>`
      }
    },
    {
      id: 'snackbar', ko: '스낵바', en: 'Snackbar', aka: ['되돌리기', 'undo'],
      when: '삭제, 보관, 이동처럼 되돌릴 수 있는 행동의 결과를 알리며 취소 기회를 줄 때',
      avoid: '액션이 필요 없는 확인(토스트), 놓치면 안 되는 오류, 액션이 2개 이상일 때',
      notes: [
        '4~10초 보여 주고, 액션이 있으면 5초 이상 둬요.',
        '액션 버튼 터치 영역은 48px 이상. 키보드로 닿게 하고 마우스를 올리면 시간을 멈춰요.',
        'FAB이나 탭바와 겹치지 않게 위로 올리고, 되돌리기 전까지 실제 삭제는 미뤄요.'
      ],
      vs: { id: 'toast', text: '토스트에는 액션 버튼이 없어요. 되돌릴 기회가 필요하면 스낵바예요.' },
      demo: {
        frame: 'phone', cycle: 6000, still: 2400,
        phases: [['등장', 1200, 1560], ['유지', 1560, 3600], ['퇴장', 3600, 3960]],
        alt: '목록에서 두부를 밀어서 지우면 아래에 ‘두부를 삭제했어요, 되돌리기’ 스낵바가 올라오고, 되돌리기를 누르자 두부가 다시 돌아오는 시연',
        html: K => K.app.status() + K.app.bar() +
          `<div class="k-ls"><div class="del">${K.icon('trash')}</div>${K.app.rows(0, 3)}<div class="below">${K.app.rows(3, 5)}</div></div>` +
          K.finger(12, 9.45, 'fg') + K.tap(12.9, 19.2, 'tp') +
          '<div class="snk"><span>두부를 삭제했어요</span><b>되돌리기</b></div>'
      }
    },
    {
      id: 'banner', ko: '배너', en: 'Banner', aka: ['오프라인', '공지', 'offline'],
      when: '오프라인, 점검 예정, 인증 필요처럼 계속 알려야 하는 상태',
      avoid: '한 번 확인하고 끝나는 정보(토스트), 계속 띄워 두는 광고성 안내',
      notes: [
        '종류(정보, 성공, 경고, 오류)마다 아이콘과 색을 쓰되 색만으로 구분하지 않아요.',
        '닫기 버튼 영역은 44px, 주 행동은 1개만 둬요.',
        '긴급 오류는 role="alert", 일반 안내는 role="status". 콘텐츠를 밀어 내릴지 덮을지 한 방식으로 유지해요.'
      ],
      vs: { id: 'toast', text: '토스트는 몇 초 뒤 사라지고, 배너는 닫거나 상태가 풀릴 때까지 남아요.' },
      demo: {
        frame: 'phone', cycle: 6000, still: 2400,
        phases: [['등장', 600, 1080], ['유지', 1080, 4800], ['퇴장', 4800, 5280]],
        alt: '앱 위쪽에 ‘오프라인이에요’ 배너가 내려오며 목록을 아래로 밀고, 연결되자 ‘다시 연결됐어요’로 바뀐 뒤 올라가는 시연',
        html: K => K.app.status() + K.app.bar() +
          `<div class="bn"><div class="off">${K.icon('wifiOff')}<span>오프라인이에요. 연결되면 자동으로 저장해요.</span></div><div class="on">${K.icon('checkCircle')}<span>다시 연결됐어요</span></div></div>` +
          K.app.list(0, 5, { cls: 'push' })
      }
    },
    {
      id: 'modal', ko: '모달', en: 'Modal dialog', aka: ['대화상자', '다이얼로그', 'dialog', 'confirm'],
      when: '되돌릴 수 없는 삭제나 결제 확인처럼 반드시 결정해야 계속할 수 있을 때',
      avoid: '단순 안내(토스트), 긴 폼, 모바일의 선택지 목록(바텀시트)',
      notes: [
        '제목 한 줄, 설명 한두 문장, 버튼 2개 이하. 파괴적 행동은 ‘확인’ 대신 ‘비우기’처럼 행동 이름을 써요.',
        '열리면 포커스가 안으로 들어가 갇히고(aria-modal), Esc로 닫히며, 닫으면 원래 요소로 돌아가요.',
        '뒤 화면 스크롤을 잠가요. 폭은 모바일에서 좌우 24px 여백, 데스크톱에서 400~560px.'
      ],
      vs: { id: 'bottom-sheet', text: '바텀시트는 모바일에서 같은 일을 덜 막는 방식이에요. 화면 맥락을 보이게 둔 채 아래에서 올라와요.' },
      demo: {
        frame: 'phone', cycle: 5000, still: 2000,
        phases: [['등장', 700, 1100], ['유지', 1100, 3200], ['퇴장', 3200, 3700]],
        alt: '휴지통 아이콘을 누르면 배경이 어두워지고 ‘목록을 비울까요?’ 대화상자가 가운데 떠서, 취소를 누르면 닫히는 시연',
        html: K => K.app.screen({ icons: ['trash', 'more'] }) + K.tap(12.7, 2.5, 'tp1') + K.scrim('sc') +
          `<div class="dlg"><b>목록을 비울까요?</b><p>담아 둔 항목 5개가 모두 지워져요.</p><div class="btns">${K.app.button('취소', 'ghost')}${K.app.button('비우기', 'danger')}</div></div>` +
          K.tap(7.5, 12.15, 'tp2')
      }
    },
    {
      id: 'bottom-sheet', ko: '바텀시트', en: 'Bottom sheet', aka: ['시트', 'action sheet'],
      when: '모바일에서 옵션 선택, 필터, 공유, 짧은 폼을 보여 줄 때',
      avoid: '넓은 데스크톱 화면(모달이나 팝오버), 긴 폼 전체, 꼭 읽어야 하는 오류',
      notes: [
        '위쪽에 손잡이(약 32~40px, 높이 4px)를 두고 아래로 끌어 닫되, 닫기 버튼도 따로 둬요.',
        '높이는 내용에 맞추거나 절반, 전체 단계로 두고, 모달형은 뒤에 스크림을 깔아요.',
        '하단 안전 영역만큼 패딩을 주고, 키보드가 올라오면 함께 위로 밀려요.'
      ],
      vs: { id: 'modal', text: '모달은 화면 가운데 떠서 더 강하게 막아요. 결정을 강제해야 하면 모달이에요.' },
      demo: {
        frame: 'phone', cycle: 5000, still: 2000,
        phases: [['등장', 650, 1200], ['유지', 1200, 3200], ['퇴장', 3200, 3800]],
        alt: '정렬 아이콘을 누르면 아래에서 ‘정렬 기준’ 시트가 올라오고, 이름순을 고른 뒤 다시 내려가는 시연',
        html: K => K.app.screen({ icons: ['sort', 'more'] }) + K.tap(12.7, 2.5, 'tp1') + K.scrim('sc') +
          '<div class="sh"><i class="grab"></i><b>정렬 기준</b>' +
          ['추가한 순서', '이름순', '매장 동선순'].map((t, i) => `<div class="op o${i + 1}"><span>${t}</span><span class="rd"><i></i></span></div>`).join('') +
          '</div>' + K.tap(4, 17.18, 'tp2')
      }
    },
    {
      id: 'inline-error', ko: '인라인 오류', en: 'Inline error', aka: ['폼 오류', '유효성 검사', 'validation'],
      when: '폼 검증 실패. 어디가 왜 틀렸고 어떻게 고치는지 알려야 할 때',
      avoid: '폼 전체 제출 실패 같은 전역 오류, 입력 도중 너무 일찍 나무랄 때',
      notes: [
        '칸 아래에 붙이고 오류 색(대비 4.5:1), 아이콘, 칸 테두리 변화를 함께 써요.',
        'aria-invalid="true"와 aria-describedby로 칸과 문구를 연결해요.',
        '포커스를 잃을 때나 제출할 때 검사하고, 오류가 여럿이면 첫 오류 칸으로 포커스를 옮겨요.'
      ],
      vs: { id: 'banner', text: '배너는 화면 전체에 걸친 문제를 위에 알리고, 인라인 오류는 문제가 난 칸 하나에 붙어요.' },
      demo: {
        frame: 'phone', cycle: 6000, still: 2700,
        phases: [['등장', 1680, 1980], ['유지', 1980, 3780], ['퇴장', 3780, 4080]],
        alt: '수량 칸에 0을 입력하고 칸을 벗어나면 테두리가 빨갛게 바뀌고 ‘1개 이상 입력해 주세요’ 문장이 나타났다가, 2로 고치자 사라지는 시연',
        html: K => K.app.status() + K.app.bar('항목 추가', [], { back: true }) +
          '<div class="fm"><span class="lb l1">이름</span><div class="fd f1"><span>두부</span></div>' +
          `<span class="lb l2">수량</span><div class="fd f2"><span class="slot"><span class="c0">0</span><span class="c2">2</span></span><i class="caret"></i><span class="ring rf"></span><span class="ring re"></span><span class="ok">${K.icon('checkCircle')}</span></div>` +
          `<div class="msg">${K.icon('alert')}<span>1개 이상 입력해 주세요</span></div><div class="go">목록에 담기</div></div>` +
          K.tap(8, 16, 'tp1') + K.tap(8, 10.25, 'tp2')
      }
    },
    {
      id: 'tooltip', ko: '툴팁', en: 'Tooltip', aka: ['말풍선', 'hint'],
      when: '라벨 없는 아이콘 버튼의 이름, 잘린 글 전체 보기, 용어 한 줄 설명',
      avoid: '필수 정보(터치 기기에는 호버가 없어요), 링크나 버튼이 든 긴 내용(팝오버)',
      notes: [
        '글은 한두 줄. 마우스를 올리고 약 300~500ms 뒤에 보여 줘요.',
        '키보드 포커스에도 나오고 aria-describedby로 연결하며, Esc로 닫혀요.',
        '포인터가 말풍선으로 옮겨도 유지하고, 화면 경계에서는 위치를 뒤집어요.'
      ],
      vs: { id: 'coach-mark', text: '코치마크는 앱이 처음 한 번 먼저 알려 주고, 툴팁은 사용자가 가리킬 때만 나와요. 버튼을 담아야 하면 팝오버를 써요.' },
      demo: {
        frame: 'phone', cycle: 4000, still: 2000,
        phases: [['지연', 1000, 1280], ['등장', 1280, 1600], ['유지', 1600, 2800], ['퇴장', 2800, 3120]],
        alt: '커서가 공유 아이콘 위에 멈추면 잠시 뒤 ‘가족과 목록 공유’ 툴팁이 나타나고, 커서가 떠나면 사라지는 시연',
        html: K => K.app.screen() + '<div class="tt"><span>가족과 목록 공유</span></div>' + K.cursor(0, 0, 'cur')
      }
    },
    {
      id: 'coach-mark', ko: '코치마크', en: 'Coach mark', aka: ['온보딩 안내', '스포트라이트', 'spotlight'],
      when: '처음 방문 때 핵심 기능 1~3개를 짚거나 새 기능을 알릴 때',
      avoid: '첫 화면에서 5개 이상 연속으로 띄울 때, 화면 자체가 설명이 필요할 만큼 복잡할 때',
      notes: [
        '한 번에 하나씩 보여 주고 ‘건너뛰기’와 ‘다음’을 함께 둬요.',
        '강조 영역 밖은 어둡게 하고, 스크롤이나 리사이즈 때 대상 위치를 다시 계산해요.',
        '본 뒤에는 다시 띄우지 않게 저장하고, 키보드와 스크린 리더로도 읽히게 해요.'
      ],
      vs: { id: 'tooltip', text: '툴팁은 사용자가 요청해야 나와요. 코치마크는 앱이 먼저 띄워서 안내해요.' },
      demo: {
        frame: 'phone', cycle: 5000, still: 2000,
        phases: [['등장', 400, 1100], ['유지', 1100, 3200], ['퇴장', 3200, 3600]],
        alt: '화면이 어두워지며 오른쪽 아래 추가 버튼만 밝게 남고 ‘새 항목은 여기서 추가해요’ 말풍선이 뜬 뒤, 다음을 누르면 사라지는 시연',
        html: K => K.app.screen() + K.app.fab() +
          '<div class="spot"></div><div class="cm"><em>1 / 2</em><b>새 항목은 여기서 추가해요</b><p>가족이 담은 항목도 같은 목록에 모여요.</p><div class="row"><span>건너뛰기</span><span class="nx">다음</span></div></div>' +
          K.tap(13.5, 15.5, 'tp')
      }
    },
    {
      id: 'badge', ko: '뱃지', en: 'Badge', aka: ['배지', '알림 숫자', 'count'],
      when: '알림 수, 읽지 않은 메시지, 장바구니 개수, 새 기능 점',
      avoid: '상태를 설명하는 글자 라벨(칩), 모든 곳에 붙여 중요한 것이 묻힐 때',
      notes: [
        '숫자 뱃지는 지름 16~20px 이상이고 99를 넘으면 99+. 점 뱃지는 8px 안팎.',
        '색과 숫자의 대비는 4.5:1, aria-label로 ‘읽지 않은 알림 3개’처럼 의미를 줘요.',
        '사용자가 확인하면 사라지게 해요.'
      ],
      vs: { topic: 'confusable-pairs', id: 'chip-badge', name: '칩', text: '칩은 상태를 설명하는 글자 라벨이나 필터이고, 뱃지는 개수나 새 소식을 알리는 작은 표시예요.' },
      demo: {
        frame: 'phone', cycle: 5000, still: 2800,
        phases: [['등장', 700, 1100], ['갱신', 1750, 2800], ['퇴장', 3500, 3800]],
        alt: '아래 탭바의 가족 탭에 빨간 뱃지가 1로 튀어나와 2, 3으로 늘어나고, 가족 탭을 누르자 사라지는 시연',
        html: K => K.app.screen() + K.app.tabs(0, { 1: '<span class="bdg"><span class="bw"><b class="n1">1</b><b class="n2">2</b><b class="n3">3</b></span></span>' }) +
          K.tap(8, 19.9, 'tp')
      }
    }
  ],
  css: K => `
/* toast */
.t-feedback-toast .k-r2 .k-ck{animation-name:fbToastCk}
.t-feedback-toast .k-r2 .k-n::after{content:"";position:absolute;left:0;right:0;top:55%;height:.08em;background:currentColor;transform-origin:left;transform:scaleX(0);animation-name:fbToastStrike}
.t-feedback-toast .toast{position:absolute;z-index:12;left:50%;bottom:1.5em;display:flex;align-items:center;gap:.45em;padding:.6em 1em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;opacity:0;animation-name:fbToastIn;box-shadow:0 .4em 1em rgba(20,20,22,.18)}
.t-feedback-toast .toast span{font-size:.7em}
.t-feedback-toast .toast .k-i{color:#7fd6a3;width:.95em;height:.95em}
.t-feedback-toast .tp{animation-name:fbToastTap}
@keyframes fbToastCk{0%,11%{opacity:0;transform:scale(.4)}15%,92%{opacity:1;transform:scale(1)}97%,100%{opacity:0;transform:scale(1)}}
@keyframes fbToastStrike{0%,12%{transform:scaleX(0)}19%,92%{transform:scaleX(1)}97%,100%{transform:scaleX(0)}}
@keyframes fbToastIn{0%,18%{opacity:0;transform:translate(-50%,.8em)}24%,70%{opacity:1;transform:translate(-50%,0)}78%,100%{opacity:0;transform:translate(-50%,.4em)}}
${K.kf.tap('fbToastTap', 10)}

/* snackbar */
.t-feedback-snackbar .del{position:absolute;z-index:0;left:0;right:0;top:4.6em;height:2.3em;background:var(--a-err);color:#fff;display:flex;align-items:center;justify-content:flex-end;padding-right:1.1em;opacity:0;animation-name:fbSnkDel}
.t-feedback-snackbar .k-r3{animation-name:fbSnkRow}
.t-feedback-snackbar .below{position:relative;z-index:2;animation-name:fbSnkUp}
.t-feedback-snackbar .snk{position:absolute;z-index:12;left:.7em;right:.7em;bottom:.8em;height:2.6em;display:flex;align-items:center;justify-content:space-between;padding:0 .9em;border-radius:.45em;background:var(--a-dark);color:#f3f3f1;transform:translateY(3.6em);animation-name:fbSnkIn;box-shadow:0 .4em 1em rgba(20,20,22,.2)}
.t-feedback-snackbar .snk span{font-size:.68em}
.t-feedback-snackbar .snk b{font-size:.68em;color:#ffb48f}
.t-feedback-snackbar .fg{animation-name:fbSnkDrag}
.t-feedback-snackbar .tp{animation-name:fbSnkTap}
@keyframes fbSnkDel{0%,7%{opacity:0}9%,17%{opacity:1}22%,100%{opacity:0}}
@keyframes fbSnkRow{0%,8%{transform:translateX(0);opacity:1}17%,64%{transform:translateX(-105%);opacity:0}72%,100%{transform:translateX(0);opacity:1}}
@keyframes fbSnkUp{0%,16%{transform:translateY(0)}24%,62%{transform:translateY(-2.3em)}70%,100%{transform:translateY(0)}}
@keyframes fbSnkIn{0%,20%{transform:translateY(3.6em)}26%,60%{transform:translateY(0)}66%,100%{transform:translateY(3.6em)}}
${K.kf.drag('fbSnkDrag', 6, 15, -7, 0)}
${K.kf.tap('fbSnkTap', 58)}

/* banner */
.t-feedback-banner .bn{position:absolute;z-index:2;left:0;right:0;top:3.7em;height:2.7em;transform:translateY(-100%);animation-name:fbBnIn}
.t-feedback-banner .bn>div{position:absolute;inset:0;display:flex;align-items:center;gap:.55em;padding:0 1em}
.t-feedback-banner .bn span{font-size:.62em;line-height:1.35}
.t-feedback-banner .bn .k-i{width:1.05em;height:1.05em}
.t-feedback-banner .off{background:var(--a-warn-bg);color:var(--a-warn-ink);animation-name:fbBnOff}
.t-feedback-banner .on{background:#dcf1e3;color:#124a2c;opacity:0;animation-name:fbBnOn}
.t-feedback-banner .push{animation-name:fbBnPush}
@keyframes fbBnIn{0%,10%{transform:translateY(-100%)}18%,80%{transform:translateY(0)}88%,100%{transform:translateY(-100%)}}
@keyframes fbBnPush{0%,10%{transform:translateY(0)}18%,80%{transform:translateY(2.7em)}88%,100%{transform:translateY(0)}}
@keyframes fbBnOff{0%,62%{opacity:1}66%,100%{opacity:0}}
@keyframes fbBnOn{0%,62%{opacity:0}66%,100%{opacity:1}}

/* modal */
.t-feedback-modal .sc{animation-name:fbMdScrim}
.t-feedback-modal .dlg{position:absolute;z-index:11;left:1.6em;right:1.6em;top:6.2em;height:8em;padding:1.1em;border-radius:.8em;background:#fff;opacity:0;animation-name:fbMdDlg;box-shadow:0 .8em 2em rgba(10,10,12,.28)}
.t-feedback-modal .dlg b{display:block;font-size:.82em}
.t-feedback-modal .dlg p{margin:.6em 0 0;font-size:.64em;color:var(--a-mut);line-height:1.45}
.t-feedback-modal .btns{position:absolute;right:1.1em;bottom:1.1em;display:flex;gap:.4em}
.t-feedback-modal .btns .k-btn{width:5.45em;padding:0}
.t-feedback-modal .tp1{animation-name:fbMdTap1}
.t-feedback-modal .tp2{animation-name:fbMdTap2}
@keyframes fbMdScrim{0%,13%{opacity:0}19%,66%{opacity:1}74%,100%{opacity:0}}
@keyframes fbMdDlg{0%,14%{opacity:0;transform:scale(.94)}21%,64%{opacity:1;transform:scale(1)}70%,100%{opacity:0;transform:scale(.97)}}
${K.kf.tap('fbMdTap1', 9)}
${K.kf.tap('fbMdTap2', 60)}

/* bottom sheet */
.t-feedback-bottom-sheet .sc{animation-name:fbShScrim}
.t-feedback-bottom-sheet .sh{position:absolute;z-index:11;left:0;right:0;bottom:0;height:10.4em;background:#fff;border-radius:1em 1em 0 0;transform:translateY(100%);animation-name:fbShUp;box-shadow:0 -.4em 1.4em rgba(10,10,12,.16)}
.t-feedback-bottom-sheet .grab{position:absolute;left:50%;top:.6em;width:2.2em;height:.25em;margin-left:-1.1em;border-radius:1em;background:#cfcfcb}
.t-feedback-bottom-sheet .sh b{position:absolute;left:1.35em;top:1.55em;font-size:.76em}
.t-feedback-bottom-sheet .op{position:absolute;left:1em;right:1em;height:2.1em;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--a-line)}
.t-feedback-bottom-sheet .o1{top:3.1em}.t-feedback-bottom-sheet .o2{top:5.2em}.t-feedback-bottom-sheet .o3{top:7.3em}
.t-feedback-bottom-sheet .op span:first-child{font-size:.7em}
.t-feedback-bottom-sheet .rd{width:1em;height:1em;border-radius:50%;border:.09em solid #b5b6b1;display:grid;place-items:center}
.t-feedback-bottom-sheet .rd i{width:.5em;height:.5em;border-radius:50%;background:var(--a-brand);opacity:0}
.t-feedback-bottom-sheet .o1 .rd i{animation-name:fbShR1}
.t-feedback-bottom-sheet .o2 .rd i{animation-name:fbShR2}
.t-feedback-bottom-sheet .tp1{animation-name:fbShTap1}
.t-feedback-bottom-sheet .tp2{animation-name:fbShTap2}
@keyframes fbShScrim{0%,13%{opacity:0}20%,66%{opacity:1}76%,100%{opacity:0}}
@keyframes fbShUp{0%,13%{transform:translateY(100%)}24%,64%{transform:translateY(0)}76%,100%{transform:translateY(100%)}}
@keyframes fbShR1{0%,52%{opacity:1}55%,100%{opacity:0}}
@keyframes fbShR2{0%,52%{opacity:0}55%,100%{opacity:1}}
${K.kf.tap('fbShTap1', 9)}
${K.kf.tap('fbShTap2', 50)}

/* inline error */
.t-feedback-inline-error .fm{position:absolute;left:0;right:0;top:3.7em;bottom:0}
.t-feedback-inline-error .lb{position:absolute;left:1.67em;font-size:.6em;font-weight:700;color:var(--a-mut)}
.t-feedback-inline-error .l1{top:1.1em}.t-feedback-inline-error .l2{top:7.6em}
.t-feedback-inline-error .fd{position:absolute;left:1em;right:1em;height:2.3em;border:.07em solid #cfcfca;border-radius:.5em;display:flex;align-items:center;padding:0 .8em;background:#fff}
.t-feedback-inline-error .f1{top:1.5em}.t-feedback-inline-error .f2{top:5.4em}
.t-feedback-inline-error .fd>span:first-child{font-size:.74em}
.t-feedback-inline-error .slot{position:relative;display:inline-block;width:.62em;height:1.3em}
.t-feedback-inline-error .slot span{position:absolute;left:0;top:0;opacity:0}
.t-feedback-inline-error .c0{animation-name:fbInZero}
.t-feedback-inline-error .c2{animation-name:fbInTwo}
.t-feedback-inline-error .caret{display:inline-block;vertical-align:middle;width:.07em;height:1.05em;margin-left:.08em;background:var(--a-brand);animation-name:fbInCaret,fbBlink;animation-duration:var(--cyc),1s;animation-timing-function:linear,steps(1)}
.t-feedback-inline-error .ring{position:absolute;inset:-.07em;border-radius:.5em;border:.12em solid var(--a-brand);opacity:0;pointer-events:none}
.t-feedback-inline-error .rf{animation-name:fbInF}
.t-feedback-inline-error .re{border-color:var(--a-err);animation-name:fbInE}
.t-feedback-inline-error .ok{position:absolute;right:.7em;top:50%;margin-top:-.5em;width:1em;height:1em;color:var(--a-ok);opacity:0;animation-name:fbInOk}
.t-feedback-inline-error .ok .k-i{display:block}
.t-feedback-inline-error .msg{position:absolute;left:1em;top:8em;display:flex;align-items:center;gap:.35em;color:var(--a-err);opacity:0;animation-name:fbInMsg}
.t-feedback-inline-error .msg span{font-size:.62em;font-weight:700}
.t-feedback-inline-error .msg .k-i{width:.85em;height:.85em}
.t-feedback-inline-error .go{position:absolute;left:1.39em;right:1.39em;bottom:1.39em;height:3.33em;border-radius:.83em;background:var(--a-brand);color:#fff;display:grid;place-items:center;font-size:.72em;font-weight:700}
.t-feedback-inline-error .tp1{animation-name:fbInTap1}
.t-feedback-inline-error .tp2{animation-name:fbInTap2}
@keyframes fbInZero{0%,13%{opacity:0}14%,62%{opacity:1}63%,100%{opacity:0}}
@keyframes fbInTwo{0%,63%{opacity:0}65%,96%{opacity:1}100%{opacity:0}}
@keyframes fbInCaret{0%,26%{opacity:1}27%,57%{opacity:0}58%,80%{opacity:1}81%,100%{opacity:0}}
@keyframes fbBlink{0%{visibility:visible}50%{visibility:hidden}}
@keyframes fbInF{0%,26%{opacity:1}28%,57%{opacity:0}59%,80%{opacity:1}84%,100%{opacity:0}}
@keyframes fbInE{0%,27%{opacity:0}30%,63%{opacity:1}66%,100%{opacity:0}}
@keyframes fbInMsg{0%,28%{opacity:0;transform:translateY(-.3em)}33%,63%{opacity:1;transform:none}68%,100%{opacity:0;transform:translateY(-.3em)}}
@keyframes fbInOk{0%,84%{opacity:0}88%,96%{opacity:1}100%{opacity:0}}
${K.kf.tap('fbInTap1', 26)}
${K.kf.tap('fbInTap2', 58)}

/* tooltip */
.t-feedback-tooltip .k-ib-share::before{content:"";position:absolute;inset:0;border-radius:50%;background:#e9e8e4;opacity:0;animation-name:fbTtHov}
.t-feedback-tooltip .tt{position:absolute;z-index:12;top:3.75em;right:.4em;padding:.5em .75em;border-radius:.45em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;opacity:0;animation-name:fbTtIn}
.t-feedback-tooltip .tt::before{content:"";position:absolute;top:-.3em;right:2.5em;width:.6em;height:.6em;background:inherit;transform:rotate(45deg);border-radius:.08em}
.t-feedback-tooltip .tt span{font-size:.62em;position:relative}
.t-feedback-tooltip .cur{animation-name:fbTtCur}
@keyframes fbTtHov{0%,24%{opacity:0}27%,70%{opacity:1}73%,100%{opacity:0}}
@keyframes fbTtIn{0%,32%{opacity:0;transform:translateY(-.25em)}40%,70%{opacity:1;transform:none}78%,100%{opacity:0;transform:none}}
@keyframes fbTtCur{0%{opacity:0;transform:translate(6em,12em)}6%{opacity:1;transform:translate(6em,12em)}25%,70%{opacity:1;transform:translate(12.55em,2.45em)}88%{opacity:1;transform:translate(9em,8em)}96%,100%{opacity:0;transform:translate(9em,8em)}}

/* coach mark */
.t-feedback-coach-mark .spot{position:absolute;z-index:10;right:.7em;bottom:.7em;width:3.4em;height:3.4em;border-radius:50%;box-shadow:0 0 0 40em rgba(14,14,16,.64);opacity:0;animation-name:fbCmSpot}
.t-feedback-coach-mark .cm{position:absolute;z-index:12;right:1em;bottom:4.6em;width:10.6em;padding:.75em .85em .8em;border-radius:.7em;background:#fff;opacity:0;animation-name:fbCmIn}
.t-feedback-coach-mark .cm::after{content:"";position:absolute;right:1.05em;bottom:-.3em;width:.6em;height:.6em;background:#fff;transform:rotate(45deg)}
.t-feedback-coach-mark .cm em{display:block;font-style:normal;font-size:.52em;color:var(--a-mut);margin-bottom:.3em}
.t-feedback-coach-mark .cm b{display:block;font-size:.7em}
.t-feedback-coach-mark .cm p{margin:.4em 0 .7em;font-size:.58em;color:var(--a-mut);line-height:1.45}
.t-feedback-coach-mark .row{display:flex;justify-content:space-between;align-items:center}
.t-feedback-coach-mark .row span{font-size:.62em;color:var(--a-mut)}
.t-feedback-coach-mark .row .nx{color:var(--a-brand);font-weight:700}
.t-feedback-coach-mark .tp{animation-name:fbCmTap}
@keyframes fbCmSpot{0%,8%{opacity:0}16%,64%{opacity:1}72%,100%{opacity:0}}
@keyframes fbCmIn{0%,14%{opacity:0;transform:translateY(.4em)}22%,64%{opacity:1;transform:none}70%,100%{opacity:0;transform:none}}
${K.kf.tap('fbCmTap', 60)}

/* badge */
.t-feedback-badge .bdg{position:absolute;top:-.4em;right:-.65em;min-width:1em;height:1em;border-radius:.5em;background:#d42f1d;color:#fff;display:grid;place-items:center;box-shadow:0 0 0 .12em var(--a-bg);transform:scale(0);animation-name:fbBdPop}
.t-feedback-badge .bw{position:relative;width:1em;height:1em;animation-name:fbBdBump}
.t-feedback-badge .bw b{position:absolute;inset:0;display:grid;place-items:center;font-size:.58em;line-height:1;opacity:0}
.t-feedback-badge .n1{animation-name:fbBdN1}.t-feedback-badge .n2{animation-name:fbBdN2}.t-feedback-badge .n3{animation-name:fbBdN3}
.t-feedback-badge .k-tab-1 em{animation-name:fbBdAct}
.t-feedback-badge .tp{animation-name:fbBdTap}
@keyframes fbBdPop{0%,14%{transform:scale(0)}18%{transform:scale(1.25)}22%,68%{transform:scale(1)}74%,100%{transform:scale(0)}}
@keyframes fbBdBump{0%,35%{transform:scale(1)}38%{transform:scale(1.25)}41%,49%{transform:scale(1)}52%{transform:scale(1.25)}55%,100%{transform:scale(1)}}
@keyframes fbBdN1{0%,36%{opacity:1}37%,100%{opacity:0}}
@keyframes fbBdN2{0%,36%{opacity:0}37%,50%{opacity:1}51%,100%{opacity:0}}
@keyframes fbBdN3{0%,50%{opacity:0}51%,100%{opacity:1}}
@keyframes fbBdAct{0%,69%{color:var(--a-mut)}72%,95%{color:var(--a-ink)}100%{color:var(--a-mut)}}
${K.kf.tap('fbBdTap', 68)}
`
});
