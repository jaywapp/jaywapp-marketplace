/* Topic: 헷갈리는 짝 (confusable-pairs). Reference: plugins/design-master/references/confusable-pairs.md
   Every pair is a compare demo: same trigger on both sides, only the reaction differs.
   Selectors start with .t-confusable-pairs-<element>; keyframes start with cp. */
(function () {
  const T = 'confusable-pairs';
  const S = (id, css) => css.replace(/&/g, '.t-' + T + '-' + id);
  /* caption pill. Wrapper is positioned in screen em, inner span carries the small font. */
  const cap = (t, c) => `<div class="cap${c ? ' ' + c : ''}"><span>${t}</span></div>`;

  const IDS = ['toggle-checkbox', 'radio-checkbox', 'tabs-segmented', 'modal-sheet', 'toast-snackbar', 'tooltip-popover',
    'chip-badge', 'spinner-skeleton', 'stepper-slider', 'dropdown-select', 'button-link', 'placeholder-label',
    'hamburger-kebab', 'appbar-tabbar', 'card-list', 'avatar-thumbnail', 'banner-popup', 'fab-iconbutton'];

  UIGuide.registerTopic({
    id: T,
    intro: '두 요소 중 무엇을 쓸지 고르는 기준이에요. 두 칸이 같은 조작을 받으니 반응이 어떻게 다른지만 보세요.',
    elements: [
      {
        id: 'toggle-checkbox', ko: '토글 vs 체크박스', en: 'Toggle vs checkbox', aka: ['스위치', 'switch', '체크 박스'],
        when: '누르는 즉시 적용되는 설정이면 토글(알림 켜기), 나중에 제출할 때 함께 반영되면 체크박스(약관 동의)',
        avoid: '제출형 폼에 토글을 쓰는 것(켰는데 저장이 안 된 것처럼 보여요), 바로 적용되는 설정에 체크박스를 쓰는 것',
        notes: [
          '토글은 즉시 적용만 맡겨요. 저장 버튼이 따로 필요하면 체크박스예요.',
          '켜짐과 꺼짐은 색만이 아니라 손잡이 위치와 라벨로도 구분해요.',
          '체크박스는 폼 안에 모아 두고 제출할 때 한꺼번에 반영해요.'
        ],
        vs: { id: 'radio-checkbox', text: '하나만 고를지 여러 개 고를지로 가르는 짝은 라디오 vs 체크박스예요. 이 짝은 적용 시점이 기준이에요.' },
        demo: {
          frame: 'compare', labels: ['토글', '체크박스'], cycle: 5000, still: 3000,
          phases: [['조작', 500, 800], ['유지', 800, 4400], ['정리', 4400, 4700]],
          alt: '왼쪽은 알림 토글을 누르는 즉시 켜지고 바로 적용돼요라고 알리고, 오른쪽은 약관 체크박스를 체크해도 저장 전이라고 뜨다가 저장 버튼을 눌러야 저장했어요로 바뀌는 시연',
          html: K => [
            K.app.status() + K.app.bar('알림 설정', []) +
            '<div class="rw lrow r1"><span>가족 알림</span><i class="sw sw1"><b></b></i></div>' +
            '<div class="rw lrow r2"><span>소리</span><i class="sw"><b></b></i></div>' +
            '<div class="stw stl"><span class="ls1">꺼짐</span><span class="ls2">켜짐, 바로 적용돼요</span></div>' +
            K.tap(13.75, 5.9, 'tpl') + cap('누르는 즉시 적용돼요'),
            K.app.status() + K.app.bar('가입하기', []) +
            `<div class="rw r1"><i class="cbx"><u>${K.icon('check')}</u></i><span>약관에 동의해요</span></div>` +
            '<div class="stw str"><span class="rs1">저장 전이에요</span><span class="rs2">저장했어요</span></div>' +
            '<div class="go"><span>저장</span></div>' +
            K.tap(1.65, 5.9, 'tpr1') + K.tap(8, 10.8, 'tpr2') + cap('저장해야 반영돼요')
          ]
        }
      },
      {
        id: 'radio-checkbox', ko: '라디오 vs 체크박스', en: 'Radio vs checkbox', aka: ['라디오 버튼', 'radio button', '단일 선택', '다중 선택'],
        when: '하나만 고르면 라디오(배송 방법 택1), 여러 개 고를 수 있으면 체크박스(관심 분야)',
        avoid: '여러 개 고를 수 있는 항목을 라디오로 막는 것, 하나만 골라야 하는 항목에 체크박스를 쓰는 것',
        notes: [
          '라디오는 한 묶음으로 연결돼서 하나를 고르면 앞의 선택이 풀려요.',
          '체크박스는 항목마다 독립이라 고른 개수에 제한이 없어요.',
          '선택지가 2~4개면 라디오나 세그먼트가 알맞아요.'
        ],
        vs: { id: 'toggle-checkbox', text: '같은 체크박스라도 누르는 즉시 적용되는 설정이면 토글이에요. 이 짝은 고를 수 있는 개수가 기준이에요.' },
        demo: {
          frame: 'compare', labels: ['라디오', '체크박스'], cycle: 5000, still: 3000,
          phases: [['첫 선택', 500, 800], ['유지', 800, 2000], ['두 번째 선택', 2000, 2300], ['유지', 2300, 4600]],
          alt: '왼쪽은 배송 방법에서 일반 배송을 고른 뒤 매장 픽업을 고르면 앞의 선택이 풀리고, 오른쪽은 채소와 유제품을 차례로 체크하면 둘 다 체크된 채 남는 시연',
          html: K => [
            K.app.status() + K.app.bar('배송 방법', []) +
            ['일반 배송', '새벽 배송', '매장 픽업'].map((t, i) => `<div class="op o${i + 1}"><i class="rd"><u class="d${i + 1}"></u></i><span>${t}</span></div>`).join('') +
            K.tap(1.9, 5.6, 'tpl1') + K.tap(1.9, 10.4, 'tpl2') + cap('하나만 고를 수 있어요'),
            K.app.status() + K.app.bar('관심 분야', []) +
            ['채소', '과일', '유제품'].map((t, i) => `<div class="op o${i + 1}"><i class="cbx"><u class="c${i + 1}">${K.icon('check')}</u></i><span>${t}</span></div>`).join('') +
            K.tap(1.9, 5.6, 'tpr1') + K.tap(1.9, 10.4, 'tpr2') + cap('여러 개 고를 수 있어요')
          ]
        }
      },
      {
        id: 'tabs-segmented', ko: '탭 vs 세그먼트', en: 'Tabs vs segmented control', aka: ['세그먼티드 컨트롤', 'segmented control', 'tabs'],
        when: '콘텐츠 영역 자체를 바꾸면 탭(프로필의 게시물, 후기, 정보), 같은 콘텐츠를 보는 방식이나 필터를 바꾸면 세그먼트(일간 / 주간 / 월간)',
        avoid: '같은 목록을 거르는 일에 탭을 쓰는 것, 서로 다른 화면 내용을 세그먼트로 바꾸는 것',
        notes: [
          '탭은 현재 위치를 밑줄로, 세그먼트는 선택된 칸의 배경으로 알려요.',
          '3~5개의 대등한 목적지는 하단 탭, 같은 화면의 보기 전환은 상단 탭이나 세그먼트예요.',
          '세그먼트는 선택지가 2~4개일 때 알맞아요.'
        ],
        vs: { topic: 'navigation', id: 'top-tabs', name: '상단 탭', text: '상단 탭은 이 짝의 탭이에요. 화면의 내용 영역을 통째로 바꾸고, 세그먼트는 같은 내용을 걸러 보여 줘요.' },
        demo: {
          frame: 'compare', labels: ['탭', '세그먼트'], cycle: 5000, still: 1900,
          phases: [['전환', 600, 1000], ['유지', 1000, 2600], ['되돌림', 2600, 3000]],
          alt: '왼쪽은 가족 탭을 누르면 밑줄이 옮겨 가며 목록 영역이 가족 구성원 영역으로 통째로 바뀌고, 오른쪽은 담은 것 칸을 누르면 같은 목록에서 체크한 항목만 남는 시연',
          html: K => [
            K.app.status() + K.app.bar('가족 장보기', []) +
            '<div class="tbs"><span class="t0">목록</span><span class="t1">가족</span><span class="t2">기록</span><i class="ul"></i></div>' +
            `<div class="pn p1">${K.app.rows(0, 3)}</div>` +
            '<div class="pn p2">' + [['엄', '엄마', '편집 가능'], ['아', '아빠', '편집 가능'], ['나', '나', '소유자']].map(([a, n, q]) => `<div class="fr"><i class="av">${a}</i><span>${n}</span><em>${q}</em></div>`).join('') + '</div>' +
            K.tap(8, 4.8, 'tpl1') + K.tap(2.67, 4.8, 'tpl2') + cap('영역 자체가 바뀌어요'),
            K.app.status() + K.app.bar('이번 주 장보기', []) +
            '<div class="sg"><i class="th"></i><span>전체</span><span>남은 것</span><span>담은 것</span></div>' +
            `<div class="pn p1">${K.app.rows(0, 5, { checked: [1, 3] })}</div>` +
            `<div class="pn p2">${K.app.row(1, { checked: true })}${K.app.row(3, { checked: true })}</div>` +
            K.tap(12.67, 5.2, 'tpr1') + K.tap(3.33, 5.2, 'tpr2') + cap('같은 목록을 걸러 봐요')
          ]
        }
      },
      {
        id: 'modal-sheet', ko: '모달 vs 바텀시트', en: 'Modal vs bottom sheet', aka: ['대화상자', '시트', 'dialog', 'bottom sheet'],
        when: '반드시 결정해야 하는 확인이면 모달(정말 삭제할까요?), 선택지나 부가 작업을 보여 주면 바텀시트(정렬 기준, 공유 옵션)',
        avoid: '모바일에서 단순 선택지를 모달로 띄우는 것(닫기와 조작이 불편해요), 데스크톱 폭에서 바텀시트를 쓰는 것(모달이나 팝오버)',
        notes: [
          '모달은 제목 한 줄, 설명 한두 문장, 버튼 2개 이하로 하고, 열리면 포커스가 안에 갇히고 Esc로 닫혀요.',
          '바텀시트는 위쪽 손잡이를 두고 아래로 끌어 닫되 닫기 버튼도 따로 둬요.',
          '데스크톱 폭에서는 바텀시트 대신 모달이나 팝오버로 바꿔요.'
        ],
        vs: { topic: 'feedback', id: 'modal', name: '모달', text: '각 요소의 단독 설명은 알림·피드백의 모달과 바텀시트에 있어요. 화면 가운데서 결정을 강제하면 모달, 아래에서 올라와 맥락을 남기면 바텀시트예요.' },
        demo: {
          frame: 'compare', labels: ['모달', '바텀시트'], cycle: 5000, still: 2000,
          phases: [['등장', 700, 1100], ['유지', 1100, 3200], ['퇴장', 3200, 3700]],
          alt: '왼쪽은 휴지통을 누르면 화면 가운데에 목록을 비울까요 대화상자가 떠서 취소를 눌러야 닫히고, 오른쪽은 정렬 아이콘을 누르면 아래에서 정렬 기준 시트가 올라와 이름순을 고르면 내려가는 시연',
          html: K => [
            K.app.screen({ icons: ['trash', 'more'] }) + K.tap(12.7, 2.5, 'dtp1') + K.scrim('dsc') +
            `<div class="dlg"><b>목록을 비울까요?</b><p>담아 둔 항목 5개가 모두 지워져요.</p><div class="btns">${K.app.button('취소', 'ghost')}${K.app.button('비우기', 'danger')}</div></div>` +
            K.tap(7.5, 12.15, 'dtp2') + cap('가운데서 결정을 요구해요', 'capT'),
            K.app.screen({ icons: ['sort', 'more'] }) + K.tap(12.7, 2.5, 'stp1') + K.scrim('ssc') +
            '<div class="sh"><i class="grab"></i><b>정렬 기준</b>' +
            ['추가한 순서', '이름순', '매장 동선순'].map((t, i) => `<div class="op o${i + 1}"><span>${t}</span><span class="rd"><i></i></span></div>`).join('') +
            '</div>' + K.tap(4, 17.18, 'stp2') + cap('아래서 선택지를 보여 줘요', 'capT')
          ]
        }
      },
      {
        id: 'toast-snackbar', ko: '토스트 vs 스낵바', en: 'Toast vs snackbar', aka: ['토스트 메시지', '되돌리기'],
        when: '알리기만 하면 토스트(링크를 복사했어요), 되돌리기 같은 액션이 붙으면 스낵바(메일을 삭제했어요 [되돌리기])',
        avoid: '오류를 토스트로만 알리는 것(몇 초 뒤 사라져 놓쳐요), 되돌릴 수 있는 행동의 결과를 버튼 없는 토스트로 끝내는 것',
        notes: [
          '토스트는 2~4초, 스낵바는 4~10초(액션이 있으면 5초 이상) 보여 줘요.',
          '되돌릴 수 있는 행동의 결과가 토스트라면 스낵바로 바꿔요. 되돌리기 전까지 실제 삭제는 미뤄요.',
          '스낵바의 액션 버튼은 터치 영역 48px 이상으로 두고 키보드로 닿게 해요.'
        ],
        vs: { topic: 'feedback', id: 'snackbar', name: '스낵바', text: '각 요소의 단독 설명은 알림·피드백의 토스트와 스낵바에 있어요. 버튼 없이 저절로 사라지면 토스트, 되돌리기 버튼이 있으면 스낵바예요.' },
        demo: {
          frame: 'compare', labels: ['토스트', '스낵바'], cycle: 6000, still: 2400,
          phases: [['등장', 1100, 1500], ['유지', 1500, 4200], ['퇴장', 4200, 4700]],
          alt: '왼쪽은 달걀을 체크하면 담았어요 토스트가 떠서 버튼 없이 저절로 사라지고, 오른쪽은 두부를 밀어 지우면 되돌리기 버튼이 붙은 스낵바가 떠서 그 버튼을 누르자 두부가 돌아오는 시연',
          html: K => [
            K.app.screen({ cls: 'lA' }) + K.tap(1.5, 7.15, 'tpl') +
            `<div class="toast">${K.icon('checkCircle')}<span>달걀 10구를 담았어요</span></div>` + cap('버튼 없이 저절로 사라져요', 'capH'),
            K.app.status() + K.app.bar() +
            `<div class="k-ls rB"><div class="del">${K.icon('trash')}</div>${K.app.rows(0, 3)}<div class="below">${K.app.rows(3, 5)}</div></div>` +
            K.finger(12, 9.45, 'fg') + K.tap(12.9, 19.2, 'tpr') +
            '<div class="snk"><span>두부를 삭제했어요</span><b>되돌리기</b></div>' + cap('되돌리기를 눌러 살려요', 'capH')
          ]
        }
      },
      {
        id: 'tooltip-popover', ko: '툴팁 vs 팝오버', en: 'Tooltip vs popover', aka: ['말풍선', 'hint'],
        when: '한두 줄 설명이면 툴팁(아이콘 위에 새로고침), 링크·버튼·폼이 든 보충 패널이면 팝오버(프로필 요약과 로그아웃)',
        avoid: '터치 화면에서 필수 정보를 툴팁에만 두는 것(호버가 없어요), 버튼이 든 내용을 툴팁에 넣는 것',
        notes: [
          '툴팁은 호버나 포커스로 나오는 한두 줄 글이에요. 터치 화면에는 호버가 없으니 필수 정보는 화면에 보이게 둬요.',
          '팝오버는 눌러서 열고, 다시 누르거나 바깥을 눌러 닫아요. 안에 버튼과 링크를 담을 수 있어요.',
          '툴팁은 키보드 포커스에도 나오고 aria-describedby로 연결해요.'
        ],
        vs: { topic: 'feedback', id: 'tooltip', name: '툴팁', text: '툴팁의 단독 설명은 알림·피드백에 있어요. 가리키면 나타나는 한두 줄은 툴팁이고, 눌러서 열고 버튼을 담는 패널은 팝오버예요.' },
        demo: {
          frame: 'compare', labels: ['툴팁', '팝오버'], cycle: 5000, still: 2400,
          phases: [['지연', 1000, 1600], ['유지', 1600, 3200], ['퇴장', 3200, 3600]],
          alt: '왼쪽은 커서가 공유 아이콘 위에 멈추면 잠시 뒤 한 줄짜리 툴팁이 뜨고 커서가 떠나면 사라지고, 오른쪽은 사용자 아이콘을 누르면 프로필 요약과 로그아웃 버튼이 든 팝오버가 열려 바깥을 누를 때 닫히는 시연',
          html: K => [
            K.app.screen({ cls: 'pl' }) + '<div class="tt"><span>가족과 목록 공유</span></div>' + K.cursor(0, 0, 'cur') + cap('가리키면 한 줄 설명'),
            K.app.status() + K.app.bar('이번 주 장보기', ['bell', 'user'], { cls: 'pr' }) + K.app.list(0, 5) +
            `<div class="pop"><div class="who"><i class="av">엄</i><div><b>엄마</b><em>가족 3명</em></div></div><div class="lo">로그아웃</div></div>` +
            K.tap(14.5, 2.5, 'tpr1') + K.tap(4, 15.4, 'tpr2') + cap('눌러서 열고 버튼도 담아요')
          ]
        }
      },
      {
        id: 'chip-badge', ko: '칩 vs 배지', en: 'Chip vs badge', aka: ['칩', '배지', '뱃지', 'tag'],
        when: '사용자가 누르거나 지울 수 있으면 칩(선택한 필터 냉동 x), 상태나 개수를 읽기만 하면 배지(알림 아이콘 위 3, 진행 중)',
        avoid: '눌러지지 않는 상태 표시를 칩처럼 꾸미는 것, 모든 곳에 배지를 붙여 중요한 것이 묻히게 하는 것',
        notes: [
          '칩은 누르거나 지울 수 있는 값이에요. 지우는 x의 터치 영역은 44px 이상으로 둬요.',
          '배지는 읽기만 해요. 숫자 배지는 99를 넘으면 99+로 쓰고 aria-label로 의미를 줘요.',
          '누를 수 있는 모양은 누를 수 있는 것에만 써요.'
        ],
        vs: { topic: 'feedback', id: 'badge', name: '뱃지', text: '뱃지의 단독 설명은 알림·피드백에 있어요. 누르고 지우는 값은 칩, 개수나 새 소식을 알리는 작은 표시는 배지예요.' },
        demo: {
          frame: 'compare', labels: ['칩', '배지'], cycle: 5000, still: 1900,
          phases: [['선택', 600, 900], ['유지', 900, 2500], ['해제', 2500, 2800]],
          alt: '왼쪽은 냉동 칩을 누르면 선택되며 x가 생기고 x를 누르면 선택이 풀리고, 오른쪽은 알림 배지 숫자가 3에서 4로 늘고 진행 중 배지는 눌러도 아무 반응이 없는 시연',
          html: K => [
            K.app.status() + K.app.bar('장보기 필터', []) +
            ['냉장', '냉동', '상온'].map((t, i) => `<div class="ch c${i + 1}"><b>${t}</b><i class="x">${K.icon('x')}</i></div>`).join('') +
            `<div class="lst">${K.app.rows(0, 4)}</div>` +
            K.tap(6.8, 5.25, 'tpl1') + K.tap(8.7, 5.25, 'tpl2') + cap('눌러서 켜고 지워요'),
            K.app.status() + K.app.bar('이번 주 장보기', ['bell', 'more']) + K.app.list(0, 5) +
            '<div class="bdg"><b class="n3">3</b><b class="n4">4</b></div>' +
            '<div class="tg"><span>진행 중</span></div>' +
            K.tap(12.7, 2.5, 'tpr1') + K.tap(10.65, 5.0, 'tpr2') + cap('눌러도 읽기만 해요')
          ]
        }
      },
      {
        id: 'spinner-skeleton', ko: '스피너 vs 스켈레톤', en: 'Spinner vs skeleton', aka: ['로딩', 'loading', 'placeholder'],
        when: '짧은 대기(약 0.3~1초)이거나 결과 모양을 모르면 스피너, 1초 이상 걸리고 화면 구조를 아는 목록이나 카드면 스켈레톤',
        avoid: '1초 넘는 대기를 스피너 하나로 두는 것(멈춘 것처럼 느껴져요), 0.3초 미만에 로딩 표시를 띄우는 것',
        notes: [
          '약 0.3~1초 대기이거나 결과 모양을 모르면 스피너, 1초 이상이면서 구조를 알면 스켈레톤이에요.',
          '0.3초 미만은 아예 표시하지 않아요.',
          '시간 기준은 로딩 패턴의 공통 기준 한 벌만 따라요.'
        ],
        vs: { topic: 'loading', id: 'skeleton', name: '스켈레톤', text: '스켈레톤의 단독 설명은 로딩 패턴에 있어요. 모양을 모르면 스피너, 곧 채워질 구조를 알면 그 자리를 먼저 보여 주는 스켈레톤이에요.' },
        demo: {
          frame: 'compare', labels: ['스피너', '스켈레톤'], cycle: 5000, still: 2200,
          phases: [['대기', 700, 2900], ['채움', 2900, 3200]],
          alt: '왼쪽은 새로고침을 누르면 목록이 사라진 빈 화면 가운데에서 스피너만 돌다가 목록이 나타나고, 오른쪽은 같은 대기 동안 항목이 들어갈 자리가 회색 막대로 먼저 보이다가 실제 목록으로 채워지는 시연',
          html: K => [
            K.app.status() + K.app.bar('이번 주 장보기', ['refresh', 'more']) + K.app.list(0, 5, { cls: 'cont' }) +
            '<div class="spn"><i></i></div>' + K.tap(12.7, 2.5, 'tpl') + cap('빈 화면에서 돌기만 해요'),
            K.app.status() + K.app.bar('이번 주 장보기', ['refresh', 'more']) + K.app.list(0, 5, { cls: 'cont' }) +
            '<div class="sk">' + [0, 1, 2, 3, 4].map(i => `<div class="sr"><i class="sc"></i><i class="s1" style="width:${[5, 3.6, 4.4, 3, 4][i]}em"></i><i class="s2"></i></div>`).join('') + '</div>' +
            K.tap(12.7, 2.5, 'tpr') + cap('들어갈 자리를 먼저 보여 줘요')
          ]
        }
      },
      {
        id: 'stepper-slider', ko: '스테퍼 vs 슬라이더', en: 'Stepper vs slider', aka: ['수량 입력', '범위 선택', 'range'],
        when: '정확한 값을 소량 조절하면 스테퍼(수량 1~10), 넓은 범위에서 대략적인 값이나 위치를 고르면 슬라이더(가격 범위, 볼륨)',
        avoid: '정확한 값이 필요한데 슬라이더만 두는 것(값 입력이 어려워요), 넓은 범위를 스테퍼로 하나씩 올리게 하는 것',
        notes: [
          '이 짝의 스테퍼는 숫자를 하나씩 올리고 내리는 입력(− 2 +)이에요. 단계 진행을 보여 주는 스텝 인디케이터와 달라요.',
          '슬라이더는 정확한 값 입력이 어려우니 값을 확인하는 숫자 표시나 입력 칸을 함께 둬요.',
          '슬라이더의 터치 손잡이는 44px 이상으로 둬요.'
        ],
        vs: { topic: 'indicators', id: 'step', name: '스텝 인디케이터', text: '단계 진행을 보여 주는 스텝 인디케이터와 이름이 비슷하지만 다른 요소예요. 여기서 스테퍼는 숫자를 하나씩 바꾸는 입력이에요.' },
        demo: {
          frame: 'compare', labels: ['스테퍼', '슬라이더'], cycle: 6000, still: 2800,
          phases: [['올림', 600, 1700], ['유지', 1700, 3200], ['내림', 3200, 4100]],
          alt: '왼쪽은 사과 수량의 더하기를 두 번 눌러 4에서 6이 되고 빼기를 두 번 눌러 다시 4가 되는 정확한 한 칸씩의 변화이고, 오른쪽은 예산 슬라이더 손잡이를 끌어 3만원에서 7만원 근처로 대략 옮겼다가 되돌리는 시연',
          html: K => [
            K.app.status() + K.app.bar('사과 담기', []) +
            '<div class="lw"><span>사과 수량</span></div>' +
            `<i class="bm">${K.icon('minus')}</i><div class="num"><b class="n4">4</b><b class="n5">5</b><b class="n6">6</b></div><i class="bp">${K.icon('plus')}</i>` +
            K.tap(11, 7.7, 'tpl1') + K.tap(11, 7.7, 'tpl2') + K.tap(5, 7.7, 'tpl3') + K.tap(5, 7.7, 'tpl4') + cap('하나씩 정확하게 바꿔요'),
            K.app.status() + K.app.bar('예산 정하기', []) +
            '<div class="lw"><span>예산 한도</span></div>' +
            '<div class="val"><b class="v1">30,000원</b><b class="v2">50,000원</b><b class="v3">70,000원</b></div>' +
            '<div class="trk"></div><i class="fill"></i><i class="thb"></i>' + K.finger(5, 9.6, 'fg') + cap('끌어서 대략 맞춰요')
          ]
        }
      },
      {
        id: 'dropdown-select', ko: '드롭다운 메뉴 vs 셀렉트', en: 'Dropdown menu vs select', aka: ['더보기 메뉴', 'select box', 'action menu'],
        when: '명령을 실행하는 메뉴면 드롭다운 메뉴(복제, 이동, 삭제), 값을 하나 고르는 폼 입력이면 셀렉트(국가 선택, 정렬 기준)',
        avoid: '셀렉트에 명령(삭제 등)을 섞는 것, 값을 고르는 입력을 명령 메뉴처럼 만드는 것',
        notes: [
          '드롭다운 메뉴는 고르는 순간 명령이 실행되고 메뉴가 닫혀요. 값이 남지 않아요.',
          '셀렉트는 고른 값이 칸에 남는 폼 입력이에요. 명령은 섞지 않아요.',
          '선택지가 2~4개면 라디오나 세그먼트, 15개를 넘으면 검색 가능한 콤보박스가 알맞아요.'
        ],
        vs: { topic: 'inputs', id: 'select', name: '셀렉트', text: '셀렉트의 단독 설명은 입력에 있어요. 명령을 실행하는 메뉴는 드롭다운 메뉴, 값을 하나 골라 칸에 남기는 입력은 셀렉트예요.' },
        demo: {
          frame: 'compare', labels: ['드롭다운 메뉴', '셀렉트'], cycle: 6000, still: 2000,
          phases: [['열림', 700, 1200], ['유지', 1200, 2400], ['닫힘', 2400, 2700]],
          alt: '왼쪽은 더보기 아이콘을 누르면 복제, 이동, 삭제 메뉴가 열리고 복제를 누르면 메뉴가 닫히며 우유 항목이 하나 더 생기고, 오른쪽은 정렬 기준 칸을 누르면 옵션이 열려 이름순을 고르면 칸에 이름순이 남는 시연',
          html: K => [
            K.app.status() + K.app.bar('이번 주 장보기', ['more']) +
            `<div class="k-ls">${K.app.row(0)}<div class="dup">${K.app.row(0)}</div><div class="below">${K.app.rows(1, 4)}</div></div>` +
            '<div class="mnu"><div class="mi mi1"><span>복제</span></div><div class="mi"><span>이동</span></div><div class="mi dng"><span>삭제</span></div></div>' +
            K.tap(14.5, 2.5, 'tpl1') + K.tap(11.9, 5.2, 'tpl2') + cap('고르면 명령이 실행돼요'),
            K.app.status() + K.app.bar('정렬하기', []) +
            '<div class="lw lwr"><span>정렬 기준</span></div>' +
            `<div class="sel"><div class="sv"><span class="v1">추가한 순서</span><span class="v2">이름순</span></div>${K.icon('chevD')}</div>` +
            '<div class="opt">' + ['추가한 순서', '이름순', '매장 동선순'].map((t, i) => `<div class="oi"><span>${t}</span><u class="ck${i + 1}">${K.icon('check')}</u></div>`).join('') + '</div>' +
            K.tap(8, 6.55, 'tpr1') + K.tap(6, 11.45, 'tpr2') + cap('고른 값이 칸에 남아요')
          ]
        }
      },
      {
        id: 'button-link', ko: '버튼 vs 링크', en: 'Button vs link', aka: ['하이퍼링크', 'hyperlink', 'anchor'],
        when: '현재 화면에서 행동(저장, 제출)이면 버튼, 다른 위치나 페이지로 이동이면 링크(이용약관 보기)',
        avoid: '이동을 버튼처럼 꾸며 행동으로 오해하게 하는 것, 행동(저장, 주문)을 밑줄 친 글자 링크로 만드는 것',
        notes: [
          '행동에는 button, 이동에는 a href를 써요. 키보드와 스크린 리더가 역할을 다르게 읽어요.',
          '링크는 문장 속 참조에 어울리고 색과 밑줄로 눌러지는 것을 알려요.',
          '버튼은 눌린 뒤 같은 화면에서 결과가 보이게 하고, 링크는 이동한 곳에서 돌아올 길을 둬요.'
        ],
        vs: { id: 'placeholder-label', text: '같은 폼 안에서도 칸의 이름과 예시를 가르는 일은 플레이스홀더 vs 라벨이에요. 이 짝은 행동인지 이동인지가 기준이에요.' },
        demo: {
          frame: 'compare', labels: ['버튼', '링크'], cycle: 5000, still: 2400,
          phases: [['반응', 500, 800], ['유지', 800, 3000], ['정리', 3000, 3300]],
          alt: '왼쪽은 저장 버튼을 누르면 같은 화면에서 버튼이 저장했어요로 바뀌고, 오른쪽은 이용약관 보기 링크를 누르면 새 화면이 옆에서 밀려 들어와 뒤로 가기를 누르면 돌아오는 시연',
          html: K => [
            K.app.status() + K.app.bar('메모 남기기', []) +
            `<div class="fl">${K.app.field('메모', '우유는 2L로 사 주세요')}</div>` +
            `<div class="go"><span class="g1">저장</span><span class="g2">${K.icon('check')}저장했어요</span></div>` +
            K.tap(8, 10.75, 'tpl') + cap('같은 화면에서 행동해요'),
            '<div class="pg p1">' + K.app.status() + K.app.bar('회원가입', []) +
            `<div class="fl">${K.app.field('이름', '김민아')}</div>` +
            `<div class="lnk"><span>이용약관 보기</span>${K.icon('chevR')}</div></div>` +
            '<div class="pg p2">' + K.app.status() + K.app.bar('이용약관', [], { back: true }) +
            K.wf('title', 1, 5, 6, .7) + K.wf('text', 1, 6.5, 14, 5.6) + '</div>' +
            K.tap(3.4, 9.7, 'tpr1') + K.tap(1.4, 2.5, 'tpr2') + cap('다른 화면으로 이동해요')
          ]
        }
      },
      {
        id: 'placeholder-label', ko: '플레이스홀더 vs 라벨', en: 'Placeholder vs label', aka: ['입력 안내', 'input label', 'hint text'],
        when: '입력 형식 예시만이면 플레이스홀더(칸 안의 name@example.com), 항상 있어야 하는 이름은 라벨(칸 위의 이메일)',
        avoid: '플레이스홀더로 라벨을 대신하는 것(입력하면 칸의 이름이 사라져요)',
        notes: [
          '라벨은 칸 위에 항상 보이게 둬요. 플로팅 라벨도 입력 후 작게 남아요.',
          '플레이스홀더 색은 대비가 낮아 라벨 역할을 못 해요.',
          '플레이스홀더에는 name@example.com 같은 입력 형식 예시만 담아요.'
        ],
        vs: { topic: 'inputs', id: 'text-field-states', name: '텍스트 필드 상태', text: '텍스트 필드 상태에 라벨, 포커스, 오류 규칙이 모여 있어요. 이 짝은 칸 이름을 어디에 두느냐의 차이예요.' },
        demo: {
          frame: 'compare', labels: ['플레이스홀더만', '라벨 있음'], cycle: 5000, still: 2800,
          phases: [['입력', 900, 2100], ['유지', 2100, 4600]],
          alt: '왼쪽은 칸 안의 예시 글만 있어서 이메일을 입력하기 시작하면 안내가 사라져 무슨 칸인지 알 수 없고, 오른쪽은 입력해도 칸 위의 이메일 라벨이 그대로 남아 있는 시연',
          html: K => [
            K.app.status() + K.app.bar('로그인', []) +
            '<div class="fd"><div class="v"><span class="ph">name@example.com</span><span class="tx">mina@jangbom.example</span></div><i class="ring"></i></div>' +
            K.tap(8, 6.55, 'tp') + cap('입력하면 안내가 사라져요'),
            K.app.status() + K.app.bar('로그인', []) +
            '<div class="lw"><span>이메일</span></div>' +
            '<div class="fd"><div class="v"><span class="ph">name@example.com</span><span class="tx">mina@jangbom.example</span></div><i class="ring"></i></div>' +
            K.tap(8, 6.55, 'tp') + cap('라벨은 계속 남아요')
          ]
        }
      },
      {
        id: 'hamburger-kebab', ko: '햄버거 vs 케밥', en: 'Hamburger vs kebab', aka: ['햄버거 메뉴', '더보기 아이콘', 'overflow menu', 'meatballs'],
        when: '앱·사이트 전체 메뉴를 열면 햄버거(≡), 항목 하나에 대한 추가 작업이면 케밥(세로 점 셋)',
        avoid: '케밥 메뉴 안에 주 행동을 숨기는 것, 항목 하나의 작업을 앱 전체 메뉴(햄버거)에 섞는 것',
        notes: [
          '케밥 아이콘만 있는 버튼에는 aria-label="더보기" 같은 이름이 필요해요.',
          '케밥 메뉴 안에 주 행동을 숨기지 않아요.',
          '햄버거는 앱 전체 이동을, 케밥은 눈앞의 한 항목을 가리켜요.'
        ],
        vs: { topic: 'web-layouts', id: 'hidden-nav', name: '숨은 내비게이션', text: '햄버거 뒤에 메뉴를 감추는 구성은 숨은 내비게이션과 같은 영향을 줘요. 케밥은 항목 하나의 작업만 감춰요.' },
        demo: {
          frame: 'compare', labels: ['햄버거', '케밥'], cycle: 5000, still: 2400,
          phases: [['열림', 700, 1100], ['유지', 1100, 3000], ['닫힘', 3000, 3400]],
          alt: '왼쪽은 헤더 왼쪽 햄버거를 누르면 목록, 가족, 설정이 든 앱 전체 메뉴가 옆에서 나오고, 오른쪽은 두 번째 항목 끝의 케밥을 누르면 그 항목에만 해당하는 수정과 삭제 메뉴가 열리는 시연',
          html: K => [
            K.app.status() + `<div class="k-ab"><span class="k-ib hb">${K.icon('menu')}</span><b>이번 주 장보기</b></div>` + K.app.list(0, 5) +
            K.scrim('sc') +
            '<div class="dr"><div class="dh">장보기 앱</div>' +
            [['list', '목록'], ['users', '가족'], ['sliders', '설정'], ['info', '도움말']].map(([ic, t]) => `<div class="di">${K.icon(ic)}<span>${t}</span></div>`).join('') + '</div>' +
            K.tap(1.9, 2.5, 'tpl1') + K.tap(14, 12.5, 'tpl2') + cap('앱 전체 메뉴가 열려요'),
            K.app.status() + K.app.bar('이번 주 장보기', []) + K.app.list(0, 4, { cls: 'kl' }) +
            [0, 1, 2, 3].map(i => `<span class="kb" style="top:${(3.95 + 2.3 * i).toFixed(2)}em">${K.icon('moreV')}</span>`).join('') +
            '<div class="mnu"><div class="mi"><span>수정</span></div><div class="mi dng"><span>삭제</span></div></div>' +
            K.tap(14.6, 7.15, 'tpr1') + K.tap(12.5, 9.2, 'tpr2') + cap('이 항목의 메뉴가 열려요')
          ]
        }
      },
      {
        id: 'appbar-tabbar', ko: '앱 바 vs 탭 바', en: 'App bar vs tab bar', aka: ['상단 바', '하단 바', 'top app bar', 'bottom navigation'],
        when: '현재 화면의 제목과 행동은 앱 바(상단), 앱 전체 이동은 탭 바(하단)',
        avoid: '탭 바에 현재 화면 제목이나 보조 행동을 넣는 것, 앱 전체 이동을 앱 바의 아이콘 몇 개로 때우는 것',
        notes: [
          '앱 바는 현재 화면의 제목, 뒤로 가기, 검색 같은 행동을 맡아요. 화면이 바뀌면 같이 바뀌어요.',
          '탭 바는 앱 전체의 대등한 목적지 이동만 맡고, 화면이 바뀌어도 그대로 있어요.',
          '3~5개의 대등한 목적지는 하단 탭, 그보다 많으면 드로어나 더보기예요.'
        ],
        vs: { topic: 'navigation', id: 'tab-bar', name: '하단 탭바', text: '하단 탭바의 단독 설명은 화면 이동에 있어요. 탭 바에는 현재 화면 제목이나 보조 행동을 넣지 않아요.' },
        demo: {
          frame: 'compare', labels: ['앱 바(상단)', '탭 바(하단)'], cycle: 5000, still: 2200,
          phases: [['이동', 500, 1000], ['유지', 1000, 2600], ['되돌림', 2600, 3000]],
          alt: '왼쪽은 두부 항목을 누르면 상단 앱 바의 제목이 두부로 바뀌고 뒤로 가기와 편집 아이콘이 생기고, 오른쪽은 아래 가족 탭을 누르면 앱 전체 영역이 가족 화면으로 바뀌고 탭 강조가 옮겨 가는 시연',
          html: K => [
            '<div class="pg p1">' + K.app.status() + K.app.bar('이번 주 장보기', ['search', 'more']) + K.app.list(0, 5) + '</div>' +
            '<div class="pg p2">' + K.app.status() + K.app.bar('두부', ['edit'], { back: true }) +
            `<div class="fw f1">${K.app.field('수량', '2모')}</div><div class="fw f2">${K.app.field('메모', '부침용으로 부탁해요')}</div></div>` +
            '<i class="hl hlt"></i>' + K.tap(8, 9.45, 'tpl1') + K.tap(1.4, 2.5, 'tpl2') + cap('상단: 이 화면의 제목과 행동'),
            K.app.status() + K.app.bar('이번 주 장보기', []) + K.app.list(0, 5, { cls: 'rl' }) +
            '<div class="fam">' + [['엄', '엄마', '편집 가능'], ['아', '아빠', '편집 가능'], ['나', '나', '소유자']].map(([a, n, q]) => `<div class="fr"><i class="av">${a}</i><span>${n}</span><em>${q}</em></div>`).join('') + '</div>' +
            K.app.tabs(0) + '<i class="hl hlb"></i>' + K.tap(8, 19.9, 'tpr1') + K.tap(2.67, 19.9, 'tpr2') + cap('하단: 앱 전체 이동', 'capR')
          ]
        }
      },
      {
        id: 'card-list', ko: '카드 vs 리스트', en: 'Card vs list', aka: ['카드 그리드', 'card grid', '목록'],
        when: '이미지와 훑어보기가 중요하면 카드(숙소 탐색, 레시피 모음), 비교와 빠른 스캔, 많은 항목이면 리스트(메일함, 설정 항목, 거래 내역)',
        avoid: '훑어보기가 아닌 비교 용도로 카드를 쓰는 것(눈이 지그재그로 움직여 느려요), 이미지가 핵심인 탐색을 글자만 리스트로 두는 것',
        notes: [
          '카드는 이미지와 훑어보기가 중요할 때 알맞아요. 눈이 칸을 따라 지그재그로 움직여요.',
          '리스트는 눈이 위에서 아래로 곧게 내려가 비교와 빠른 스캔, 많은 항목에 알맞아요.',
          '카드를 비교 용도로 쓰면 지그재그 때문에 느려져요.'
        ],
        vs: { topic: 'screen-layouts', id: 'card-grid', name: '카드 그리드', text: '카드 그리드의 단독 설명은 화면 배치에 있어요. 같은 항목이라도 훑어볼 거리면 카드, 하나씩 비교할 거리면 리스트예요.' },
        demo: {
          frame: 'compare', labels: ['카드', '리스트'], cycle: 5000, still: 2200,
          phases: [['시선', 500, 4400]],
          alt: '왼쪽은 카드 네 장을 눈이 위 왼쪽, 위 오른쪽, 아래 왼쪽, 아래 오른쪽으로 지그재그로 따라가고, 오른쪽은 같은 항목을 리스트로 보면 눈이 위에서 아래로 곧게 내려가는 시연',
          html: K => [
            K.app.status() + K.app.bar('이번 주 장보기', []) +
            ['우유 2L', '달걀 10구', '두부', '대파'].map((t, i) => `<div class="cd c${i + 1}"><i class="im"></i><span>${t}</span></div>`).join('') +
            K.dot(4.5, 6.3, 'dtl') + cap('눈이 지그재그로 움직여요'),
            K.app.status() + K.app.bar('이번 주 장보기', []) + K.app.list(0, 6) +
            K.dot(1.5, 4.85, 'dtr') + cap('눈이 위에서 아래로 훑어요')
          ]
        }
      },
      {
        id: 'avatar-thumbnail', ko: '아바타 vs 썸네일', en: 'Avatar vs thumbnail', aka: ['프로필 이미지', '미리보기', 'profile picture', 'preview'],
        when: '사람이나 계정을 나타내면 아바타(보통 원형: 댓글 작성자, 채팅 상대), 콘텐츠의 미리보기면 썸네일(사각형, 콘텐츠 비율: 영상 목록, 파일 미리보기)',
        avoid: '사람을 사각 미리보기로 그리는 것, 콘텐츠 미리보기를 원형 프로필처럼 잘라 내는 것',
        notes: [
          '아바타는 보통 원형이에요. 사진이 없으면 이니셜이나 기본 아바타를 둬요.',
          '썸네일은 사각형이고 콘텐츠의 비율을 따라요.',
          '모양까지 달리 써서 사람인지 콘텐츠인지 한눈에 구분되게 해요.'
        ],
        vs: { topic: 'first-run', id: 'profile-setup', name: '프로필 설정', text: '아바타에 쓰이는 사진은 프로필 설정에서 정해요. 썸네일은 콘텐츠에서 만들어져 사람과 상관이 없어요.' },
        demo: {
          frame: 'compare', labels: ['아바타', '썸네일'], cycle: 5000, still: 2400,
          phases: [['반응', 600, 1100], ['유지', 1100, 4300]],
          alt: '왼쪽은 채팅 목록에서 엄마 원형 아바타에 접속 중 표시가 켜지고, 오른쪽은 영상 목록에서 사각 썸네일을 누르면 재생 표시와 진행 막대가 차오르는 시연',
          html: K => [
            K.app.status() + K.app.bar('가족 채팅', []) +
            [['엄', '엄마', '우유는 내가 살게'], ['아', '아빠', '두부 있어?'], ['나', '나', '대파 4단 샀어']].map(([a, n, m], i) =>
              `<div class="pr" style="top:${(4.1 + 3.2 * i).toFixed(1)}em"><i class="av av${i}">${a}${i === 0 ? '<s class="rg"></s><s class="on"></s>' : ''}</i><div class="tx"><b>${n}</b><span>${m}</span></div></div>`).join('') +
            K.tap(2.1, 5.6, 'tpl') + cap('사람을 나타내요'),
            K.app.status() + K.app.bar('장보기 레시피', []) +
            [['두부조림 만들기', '0:42'], ['대파 손질법', '1:10'], ['달걀말이 팁', '0:58']].map(([t, d], i) =>
              `<div class="pr" style="top:${(4.1 + 3.2 * i).toFixed(1)}em"><i class="th">${i === 0 ? `<u class="pl">${K.icon('play')}</u><s class="pg2"></s>` : ''}<em class="du">${d}</em></i><div class="tx"><b>${t}</b><span>레시피 영상</span></div></div>`).join('') +
            K.tap(3.4, 5.6, 'tpr') + cap('내용을 미리 보여 줘요')
          ]
        }
      },
      {
        id: 'banner-popup', ko: '배너 vs 팝업', en: 'Banner vs popup', aka: ['공지', '모달 팝업', 'announcement', 'popup'],
        when: '화면을 쓰는 데 방해하지 않는 지속 안내는 배너(오프라인 안내, 점검 공지), 즉시 응답이 필요해 흐름을 막아야 하면 팝업(결제 취소 확인)',
        avoid: '첫 진입에 팝업을 연달아 띄우는 것(이탈 원인이 돼요), 꼭 응답받아야 하는 확인을 배너로 흘려보내는 것',
        notes: [
          '배너는 닫거나 상태가 풀릴 때까지 남고, 그동안 화면은 그대로 쓸 수 있어요.',
          '팝업(모달)은 응답하기 전까지 뒤 화면을 막아요. 즉시 응답이 필요할 때만 써요.',
          '광고는 둘 다 신중히 써요.'
        ],
        vs: { topic: 'feedback', id: 'banner', name: '배너', text: '배너의 단독 설명은 알림·피드백에 있어요. 팝업은 모달 항목을 참고하세요. 쓰는 데 방해가 없으면 배너, 흐름을 막아야 하면 팝업이에요.' },
        demo: {
          frame: 'compare', labels: ['배너', '팝업'], cycle: 5000, still: 2400,
          phases: [['등장', 400, 800], ['유지', 800, 2800], ['퇴장', 2800, 3300]],
          alt: '왼쪽은 위에 점검 안내 배너가 내려온 채로 목록 항목을 눌러 체크할 수 있고, 오른쪽은 주문을 취소할까요 팝업이 뜨면 뒤 화면을 눌러도 반응이 없고 아니요를 눌러야 닫히는 시연',
          html: K => [
            K.app.status() + K.app.bar() +
            `<div class="bn">${K.icon('info')}<span>오늘 밤 12시에 점검해요</span></div>` + K.app.list(0, 5, { cls: 'push lA' }) +
            K.tap(1.5, 9.85, 'tpl') + cap('안내가 있어도 계속 써요'),
            K.app.screen({ cls: 'rA' }) + K.tap(1.5, 7.15, 'tpr1') + K.scrim('dsc') +
            `<div class="dlg"><b>주문을 취소할까요?</b><p>취소하면 장바구니로 돌아가요.</p><div class="btns">${K.app.button('아니요', 'ghost')}${K.app.button('취소하기', 'danger')}</div></div>` +
            K.tap(7.5, 12.15, 'tpr2') + cap('응답하기 전엔 막혀요', 'capH')
          ]
        }
      },
      {
        id: 'fab-iconbutton', ko: 'FAB vs 아이콘 버튼', en: 'FAB vs icon button', aka: ['플로팅 액션 버튼', 'floating action button', '앱 바 아이콘'],
        when: '화면의 주 행동 하나를 강조하면 FAB(메일 앱의 새 메일 쓰기), 보조 행동이나 여러 개의 도구면 아이콘 버튼(앱 바의 검색, 공유, 더보기)',
        avoid: '화면마다 다른 행동을 FAB에 붙이는 것(학습이 안 돼요), 한 화면에 FAB를 여러 개 두는 것',
        notes: [
          '하나의 화면에는 FAB 하나만 둬요. 화면마다 행동이 다르면 학습이 안 돼요.',
          '앱 바의 검색, 공유, 더보기 같은 보조 행동은 아이콘 버튼으로 나란히 둬요.',
          '아이콘 버튼에는 aria-label로 이름을 줘요.'
        ],
        vs: { topic: 'navigation', id: 'fab', name: '플로팅 버튼', text: '플로팅 버튼의 단독 설명은 화면 이동에 있어요. 주 행동 하나를 키워 띄우면 FAB, 작은 도구 여럿을 앱 바에 두면 아이콘 버튼이에요.' },
        demo: {
          frame: 'compare', labels: ['FAB', '아이콘 버튼'], cycle: 5000, still: 2200,
          phases: [['반응', 500, 1100], ['유지', 1100, 4300]],
          alt: '왼쪽은 오른쪽 아래의 큰 FAB 하나를 누르면 목록에 새 항목이 추가되고, 오른쪽은 앱 바의 작은 검색, 공유, 더보기 아이콘 버튼을 차례로 눌러 각각 눌린 표시가 생기는 시연',
          html: K => [
            K.app.status() + K.app.bar('이번 주 장보기', []) +
            K.app.list(0, 5, { after: `<div class="nw">${K.app.row(5, { item: ['새 항목', '1개'] })}</div>` }) +
            K.app.fab() + K.tap(13.6, 18.93, 'tpl') + cap('주 행동 하나를 크게'),
            K.app.status() + K.app.bar('이번 주 장보기', ['search', 'share', 'more']) + K.app.list(0, 5) +
            K.tap(10.9, 2.5, 'tpr1') + K.tap(12.7, 2.5, 'tpr2') + K.tap(14.5, 2.5, 'tpr3') + cap('보조 행동은 작게 여럿')
          ]
        }
      }
    ],
    css: K => [
      /* shared caption pill; per-pair rules below may move it */
      IDS.map(id => S(id, `& .cap{position:absolute;z-index:13;left:0;right:0;bottom:.9em;display:flex;justify-content:center;pointer-events:none}
& .cap span{font-size:.56em;font-weight:700;white-space:nowrap;padding:.5em 1.1em;border-radius:2em;background:rgba(35,36,39,.88);color:#f4f4f2}
& .lw{position:absolute;left:1.1em;top:4em}
& .lw span{font-size:.6em;font-weight:700;color:var(--a-mut)}
& .cbx{position:relative;display:block;flex:none;width:1.3em;height:1.3em;border-radius:.3em;border:.12em solid #b5b6b1}
& .cbx u{position:absolute;inset:-.12em;border-radius:.3em;background:var(--a-brand);color:#fff;display:grid;place-items:center;opacity:0;text-decoration:none}
& .cbx u .k-i{width:.9em;height:.9em;stroke-width:3}
& .av{position:relative;display:grid;place-items:center;flex:none;width:2.2em;height:2.2em;border-radius:50%;background:#f3d9c9;color:#7a3414;font-style:normal;font-weight:700;font-size:.9em}`)).join('\n'),

      /* 1 toggle vs checkbox */
      S('toggle-checkbox', `
& .rw{position:absolute;left:0;right:0;height:2.6em;display:flex;align-items:center;gap:.7em;padding:0 1em;border-bottom:1px solid var(--a-line)}
& .r1{top:4.6em}& .r2{top:7.2em}
& .rw>span{font-size:.76em}
& .lrow>span{margin-right:auto}
& .sw{position:relative;display:block;flex:none;width:2.5em;height:1.4em;border-radius:1em;background:#c9cac5}
& .sw b{position:absolute;left:.15em;top:.15em;width:1.1em;height:1.1em;border-radius:50%;background:#fff;box-shadow:0 .1em .2em rgba(0,0,0,.25)}
& .sw1{animation-name:cpTgSw}
& .sw1 b{animation-name:cpTgKn}
& .stw{position:absolute;left:1em}
& .stl{top:10.2em}& .str{top:7.7em}
& .stw span{position:absolute;left:0;white-space:nowrap;font-size:.64em;font-weight:700;color:var(--a-mut)}
& .ls2,& .rs2{color:var(--a-ok)}
& .ls1{animation-name:cpTgL1}& .ls2{animation-name:cpTgL2}
& .rs1{animation-name:cpTgR1}& .rs2{animation-name:cpTgR2}
& .cbx u{animation-name:cpTgCk}
& .go{position:absolute;left:1.1em;right:1.1em;top:9.6em;height:2.4em;border-radius:.7em;background:var(--a-brand);color:#fff;display:grid;place-items:center;animation-name:cpTgGo}
& .go span{font-size:.72em;font-weight:700}
& .tpl{animation-name:cpTgTapL}& .tpr1{animation-name:cpTgTapR1}& .tpr2{animation-name:cpTgTapR2}
@keyframes cpTgSw{0%,13%{background:#c9cac5}16%,88%{background:var(--a-brand)}92%,100%{background:#c9cac5}}
@keyframes cpTgKn{0%,13%{transform:none}16%,88%{transform:translateX(1.1em)}92%,100%{transform:none}}
@keyframes cpTgL1{0%,14%{opacity:1}16%,88%{opacity:0}90%,100%{opacity:1}}
@keyframes cpTgL2{0%,14%{opacity:0}16%,88%{opacity:1}90%,100%{opacity:0}}
@keyframes cpTgR1{0%,52%{opacity:1}54%,90%{opacity:0}92%,100%{opacity:1}}
@keyframes cpTgR2{0%,54%{opacity:0}56%,88%{opacity:1}90%,100%{opacity:0}}
@keyframes cpTgCk{0%,13%{opacity:0}15%,88%{opacity:1}92%,100%{opacity:0}}
@keyframes cpTgGo{0%,48%{transform:none}50%{transform:scale(.95)}54%,100%{transform:none}}
${K.kf.tap('cpTgTapL', 12)}${K.kf.tap('cpTgTapR1', 12)}${K.kf.tap('cpTgTapR2', 50)}`),

      /* 2 radio vs checkbox */
      S('radio-checkbox', `
& .op{position:absolute;left:0;right:0;height:2.4em;display:flex;align-items:center;gap:.8em;padding:0 1em;border-bottom:1px solid var(--a-line)}
& .o1{top:4.4em}& .o2{top:6.8em}& .o3{top:9.2em}
& .op>span{font-size:.76em}
& .rd{position:relative;display:grid;place-items:center;flex:none;width:1.3em;height:1.3em;border-radius:50%;border:.12em solid #b5b6b1}
& .rd u{width:.62em;height:.62em;border-radius:50%;background:var(--a-brand);opacity:0}
& .d1{animation-name:cpRdA}& .d3{animation-name:cpRdB}
& .c1{animation-name:cpRcA}& .c3{animation-name:cpRcB}
& .tpl1,& .tpr1{animation-name:cpRdT1}& .tpl2,& .tpr2{animation-name:cpRdT2}
@keyframes cpRdA{0%,9%{opacity:0;transform:scale(.4)}12%,40%{opacity:1;transform:scale(1)}42%,100%{opacity:0;transform:scale(.4)}}
@keyframes cpRdB{0%,40%{opacity:0;transform:scale(.4)}42%,92%{opacity:1;transform:scale(1)}95%,100%{opacity:0;transform:scale(.4)}}
@keyframes cpRcA{0%,9%{opacity:0}12%,92%{opacity:1}95%,100%{opacity:0}}
@keyframes cpRcB{0%,39%{opacity:0}42%,92%{opacity:1}95%,100%{opacity:0}}
${K.kf.tap('cpRdT1', 10)}${K.kf.tap('cpRdT2', 40)}`),

      /* 3 tabs vs segmented */
      S('tabs-segmented', `
& .tbs{position:absolute;left:0;right:0;top:3.7em;height:2.2em;display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--a-line)}
& .tbs span{display:grid;place-items:center;font-size:.72em;font-weight:700;color:var(--a-mut)}
& .t0{color:var(--a-ink)!important;animation-name:cpTbC0}& .t1{animation-name:cpTbC1}
& .ul{position:absolute;left:0;bottom:-1px;width:33.333%;height:.16em;background:var(--a-brand);animation-name:cpTbUl}
& .pn{position:absolute;left:0;right:0;top:5.9em}
& .p1{animation-name:cpTbP1}& .p2{animation-name:cpTbP2}
& .fr{height:2.3em;display:flex;align-items:center;gap:.7em;padding:0 1em;border-bottom:1px solid var(--a-line)}
& .fr span{font-size:.74em;margin-right:auto}
& .fr em{font-style:normal;font-size:.62em;color:var(--a-mut)}
& .fr .av{width:1.6em;height:1.6em;font-size:.7em}
& .sg{position:absolute;left:1em;right:1em;top:4.2em;height:2em;border-radius:.6em;background:var(--a-soft);display:grid;grid-template-columns:repeat(3,1fr)}
& .sg span{position:relative;z-index:1;display:grid;place-items:center;font-size:.7em;font-weight:700}
& .th{position:absolute;left:.2em;top:.2em;bottom:.2em;width:4.267em;border-radius:.45em;background:#fff;box-shadow:0 .1em .3em rgba(0,0,0,.14);animation-name:cpTbTh}
& .sg~.pn{top:6.5em}
& .tpl1,& .tpr1{animation-name:cpTbT1}& .tpl2,& .tpr2{animation-name:cpTbT2}
@keyframes cpTbC0{0%,14%{color:var(--a-ink)}20%,52%{color:var(--a-mut)}58%,100%{color:var(--a-ink)}}
@keyframes cpTbC1{0%,14%{color:var(--a-mut)}20%,52%{color:var(--a-ink)}58%,100%{color:var(--a-mut)}}
@keyframes cpTbUl{0%,14%{transform:none}20%,52%{transform:translateX(100%)}58%,100%{transform:none}}
@keyframes cpTbTh{0%,14%{transform:none}20%,52%{transform:translateX(9.333em)}58%,100%{transform:none}}
@keyframes cpTbP1{0%,14%{opacity:1}18%,54%{opacity:0}58%,100%{opacity:1}}
@keyframes cpTbP2{0%,14%{opacity:0}18%,54%{opacity:1}58%,100%{opacity:0}}
${K.kf.tap('cpTbT1', 12)}${K.kf.tap('cpTbT2', 52)}`),

      /* 4 modal vs bottom sheet */
      S('modal-sheet', `
& .capT{top:4.1em;bottom:auto}
& .dsc{animation-name:cpMsDsc}
& .dlg{position:absolute;z-index:11;left:1.6em;right:1.6em;top:6.2em;height:8em;padding:1.1em;border-radius:.8em;background:#fff;opacity:0;animation-name:cpMsDlg;box-shadow:0 .8em 2em rgba(10,10,12,.28)}
& .dlg b{display:block;font-size:.82em}
& .dlg p{margin:.6em 0 0;font-size:.64em;color:var(--a-mut);line-height:1.45}
& .btns{position:absolute;right:1.1em;bottom:1.1em;display:flex;gap:.4em}
& .btns .k-btn{width:5.45em;padding:0}
& .dtp1{animation-name:cpMsDt1}& .dtp2{animation-name:cpMsDt2}
& .ssc{animation-name:cpMsSsc}
& .sh{position:absolute;z-index:11;left:0;right:0;bottom:0;height:10.4em;background:#fff;border-radius:1em 1em 0 0;transform:translateY(100%);animation-name:cpMsSh;box-shadow:0 -.4em 1.4em rgba(10,10,12,.16)}
& .grab{position:absolute;left:50%;top:.6em;width:2.2em;height:.25em;margin-left:-1.1em;border-radius:1em;background:#cfcfcb}
& .sh b{position:absolute;left:1.35em;top:1.55em;font-size:.76em}
& .sh .op{position:absolute;left:1em;right:1em;height:2.1em;display:flex;align-items:center;justify-content:space-between;gap:0;padding:0;border-top:1px solid var(--a-line);border-bottom:0}
& .sh .o1{top:3.1em}& .sh .o2{top:5.2em}& .sh .o3{top:7.3em}
& .sh .op span:first-child{font-size:.7em}
& .sh .rd{width:1em;height:1em;border-radius:50%;border:.09em solid #b5b6b1;display:grid;place-items:center}
& .sh .rd i{width:.5em;height:.5em;border-radius:50%;background:var(--a-brand);opacity:0}
& .sh .o1 .rd i{animation-name:cpMsR1}& .sh .o2 .rd i{animation-name:cpMsR2}
& .stp1{animation-name:cpMsSt1}& .stp2{animation-name:cpMsSt2}
@keyframes cpMsDsc{0%,13%{opacity:0}19%,66%{opacity:1}74%,100%{opacity:0}}
@keyframes cpMsDlg{0%,14%{opacity:0;transform:scale(.94)}21%,64%{opacity:1;transform:scale(1)}70%,100%{opacity:0;transform:scale(.97)}}
@keyframes cpMsSsc{0%,13%{opacity:0}20%,66%{opacity:1}76%,100%{opacity:0}}
@keyframes cpMsSh{0%,13%{transform:translateY(100%)}24%,64%{transform:translateY(0)}76%,100%{transform:translateY(100%)}}
@keyframes cpMsR1{0%,52%{opacity:1}55%,100%{opacity:0}}
@keyframes cpMsR2{0%,52%{opacity:0}55%,100%{opacity:1}}
${K.kf.tap('cpMsDt1', 9)}${K.kf.tap('cpMsDt2', 60)}${K.kf.tap('cpMsSt1', 9)}${K.kf.tap('cpMsSt2', 50)}`),

      /* 5 toast vs snackbar */
      S('toast-snackbar', `
& .capH{bottom:4.8em}
& .lA .k-r2 .k-ck{animation-name:cpTsCk}
& .lA .k-r2 .k-n::after{content:"";position:absolute;left:0;right:0;top:55%;height:.08em;background:currentColor;transform-origin:left;transform:scaleX(0);animation-name:cpTsStrike}
& .toast{position:absolute;z-index:12;left:50%;bottom:1.5em;display:flex;align-items:center;gap:.45em;padding:.6em 1em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;opacity:0;animation-name:cpTsIn;box-shadow:0 .4em 1em rgba(20,20,22,.18)}
& .toast span{font-size:.7em}
& .toast .k-i{color:#7fd6a3;width:.95em;height:.95em}
& .tpl{animation-name:cpTsTap}
& .rB .del{position:absolute;z-index:0;left:0;right:0;top:0;height:2.3em;background:var(--a-err);color:#fff;display:flex;align-items:center;justify-content:flex-end;padding-right:1.1em;opacity:0;animation-name:cpSnDel}
& .rB .k-r3{animation-name:cpSnRow}
& .rB .below{position:relative;z-index:2;animation-name:cpSnUp}
& .snk{position:absolute;z-index:12;left:.7em;right:.7em;bottom:.8em;height:2.6em;display:flex;align-items:center;justify-content:space-between;padding:0 .9em;border-radius:.45em;background:var(--a-dark);color:#f3f3f1;transform:translateY(3.6em);animation-name:cpSnIn;box-shadow:0 .4em 1em rgba(20,20,22,.2)}
& .snk span{font-size:.68em}
& .snk b{font-size:.68em;color:#ffb48f}
& .fg{animation-name:cpSnDrag}
& .tpr{animation-name:cpSnTap}
@keyframes cpTsCk{0%,11%{opacity:0;transform:scale(.4)}15%,66%{opacity:1;transform:scale(1)}72%,100%{opacity:0;transform:scale(1)}}
@keyframes cpTsStrike{0%,12%{transform:scaleX(0)}19%,66%{transform:scaleX(1)}72%,100%{transform:scaleX(0)}}
@keyframes cpTsIn{0%,18%{opacity:0;transform:translate(-50%,.8em)}24%,66%{opacity:1;transform:translate(-50%,0)}74%,100%{opacity:0;transform:translate(-50%,.4em)}}
@keyframes cpSnDel{0%,7%{opacity:0}9%,17%{opacity:1}22%,100%{opacity:0}}
@keyframes cpSnRow{0%,8%{transform:translateX(0);opacity:1}17%,64%{transform:translateX(-105%);opacity:0}72%,100%{transform:translateX(0);opacity:1}}
@keyframes cpSnUp{0%,16%{transform:translateY(0)}24%,62%{transform:translateY(-2.3em)}70%,100%{transform:translateY(0)}}
@keyframes cpSnIn{0%,20%{transform:translateY(3.6em)}26%,60%{transform:translateY(0)}66%,100%{transform:translateY(3.6em)}}
${K.kf.tap('cpTsTap', 10)}${K.kf.drag('cpSnDrag', 6, 15, -7, 0)}${K.kf.tap('cpSnTap', 58)}`),

      /* 6 tooltip vs popover */
      S('tooltip-popover', `
& .k-ab.pl .k-ib-share::before{content:"";position:absolute;inset:0;border-radius:50%;background:#e9e8e4;opacity:0;animation-name:cpTpHov}
& .tt{position:absolute;z-index:12;top:3.75em;right:.4em;padding:.5em .75em;border-radius:.45em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;opacity:0;animation-name:cpTpIn}
& .tt::before{content:"";position:absolute;top:-.3em;right:2.5em;width:.6em;height:.6em;background:inherit;transform:rotate(45deg);border-radius:.08em}
& .tt span{font-size:.62em;position:relative}
& .cur{animation-name:cpTpCur}
& .k-ab.pr .k-ib-user::before{content:"";position:absolute;inset:0;border-radius:50%;background:#e9e8e4;opacity:0;animation-name:cpTpHu}
& .pop{position:absolute;z-index:12;top:3.9em;right:.6em;width:9.6em;padding:.8em;border-radius:.7em;background:#fff;opacity:0;animation-name:cpTpPop;box-shadow:0 .6em 1.6em rgba(10,10,12,.22),0 0 0 1px var(--a-line)}
& .pop::before{content:"";position:absolute;top:-.3em;right:.95em;width:.6em;height:.6em;background:#fff;transform:rotate(45deg);box-shadow:-1px -1px 0 var(--a-line)}
& .who{display:flex;align-items:center;gap:.6em;margin-bottom:.8em}
& .who .av{width:2em;height:2em;font-size:.8em}
& .who b{display:block;font-size:.72em}
& .who em{display:block;font-style:normal;font-size:.58em;color:var(--a-mut)}
& .lo{display:grid;place-items:center;height:2em;border-radius:.5em;background:var(--a-soft);font-size:.68em;font-weight:700}
& .tpr1{animation-name:cpTpT1}& .tpr2{animation-name:cpTpT2}
@keyframes cpTpHov{0%,24%{opacity:0}27%,70%{opacity:1}73%,100%{opacity:0}}
@keyframes cpTpIn{0%,32%{opacity:0;transform:translateY(-.25em)}40%,70%{opacity:1;transform:none}78%,100%{opacity:0;transform:none}}
@keyframes cpTpCur{0%{opacity:0;transform:translate(6em,12em)}6%{opacity:1;transform:translate(6em,12em)}25%,70%{opacity:1;transform:translate(12.55em,2.45em)}88%{opacity:1;transform:translate(9em,8em)}96%,100%{opacity:0;transform:translate(9em,8em)}}
@keyframes cpTpHu{0%,14%{opacity:0}18%,60%{opacity:1}66%,100%{opacity:0}}
@keyframes cpTpPop{0%,16%{opacity:0;transform:translateY(-.3em)}22%,60%{opacity:1;transform:none}66%,100%{opacity:0;transform:none}}
${K.kf.tap('cpTpT1', 14)}${K.kf.tap('cpTpT2', 56)}`),

      /* 7 chip vs badge */
      S('chip-badge', `
& .ch{position:absolute;top:4.3em;width:4.2em;height:1.9em;border-radius:1em;border:.08em solid #c4c5c0;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 .6em 0 .9em}
& .ch b{font-size:.68em}
& .ch .x{display:block;width:.8em;height:.8em;opacity:0}
& .ch .x .k-i{width:.8em;height:.8em;stroke-width:2.6}
& .c1{left:1em}& .c2{left:5.6em;animation-name:cpChSel}& .c3{left:10.2em}
& .c2 .x{animation-name:cpChX}
& .lst{position:absolute;left:0;right:0;top:6.8em}
& .tpl1{animation-name:cpChT1}& .tpl2{animation-name:cpChT2}
& .bdg{position:absolute;z-index:6;left:13.15em;top:1.35em;width:1.05em;height:1.05em;border-radius:50%;background:#d42f1d;color:#fff;box-shadow:0 0 0 .12em var(--a-bg);animation-name:cpChBump}
& .bdg b{position:absolute;inset:0;display:grid;place-items:center;font-size:.6em;line-height:1;opacity:0}
& .n3{animation-name:cpChN3}& .n4{animation-name:cpChN4}
& .tg{position:absolute;z-index:3;left:9.2em;top:4.45em}
& .tg span{display:block;font-size:.58em;font-weight:700;padding:.45em 1em;border-radius:2em;background:var(--a-warn-bg);color:var(--a-warn-ink);white-space:nowrap}
& .tpr1{animation-name:cpChR1}& .tpr2{animation-name:cpChR2}
@keyframes cpChSel{0%,13%{background:#fff;border-color:#c4c5c0}15%,50%{background:#fbe7dc;border-color:var(--a-brand)}52%,100%{background:#fff;border-color:#c4c5c0}}
@keyframes cpChX{0%,13%{opacity:0}15%,50%{opacity:1}52%,100%{opacity:0}}
@keyframes cpChBump{0%,29%{transform:scale(1)}33%{transform:scale(1.3)}37%,100%{transform:scale(1)}}
@keyframes cpChN3{0%,31%{opacity:1}32%,100%{opacity:0}}
@keyframes cpChN4{0%,31%{opacity:0}32%,88%{opacity:1}92%,100%{opacity:0}}
${K.kf.tap('cpChT1', 12)}${K.kf.tap('cpChT2', 48)}${K.kf.tap('cpChR1', 12)}${K.kf.tap('cpChR2', 50)}`.replace('@keyframes cpChN3{0%,31%{opacity:1}32%,100%{opacity:0}}', '@keyframes cpChN3{0%,31%{opacity:1}32%,90%{opacity:0}92%,100%{opacity:1}}')),

      /* 8 spinner vs skeleton */
      S('spinner-skeleton', `
& .cont{animation-name:cpSpCont}
& .spn{position:absolute;left:50%;top:9.6em;width:2.4em;height:2.4em;margin-left:-1.2em;opacity:0;animation-name:cpSpOp}
& .spn i{display:block;width:100%;height:100%;border-radius:50%;border:.28em solid var(--a-soft);border-top-color:var(--a-brand);animation-name:cpSpin;animation-duration:1s;animation-timing-function:linear}
& .sk{position:absolute;left:0;right:0;top:3.7em;opacity:0;animation-name:cpSkOp}
& .sr{height:2.3em;display:flex;align-items:center;gap:.6em;padding:0 1em;border-bottom:1px solid var(--a-line);animation-name:cpSkPulse;animation-duration:1.2s;animation-timing-function:ease-in-out}
& .sr i{display:block;background:#e3e4e0;border-radius:.3em}
& .sr .sc{width:1em;height:1em;border-radius:50%}
& .sr .s1{height:.7em;margin-right:auto}
& .sr .s2{width:1.6em;height:.6em}
& .tpl{animation-name:cpSpT}& .tpr{animation-name:cpSpT}
@keyframes cpSpCont{0%,12%{opacity:1}15%,58%{opacity:0}62%,100%{opacity:1}}
@keyframes cpSpOp{0%,12%{opacity:0}15%,58%{opacity:1}62%,100%{opacity:0}}
@keyframes cpSkOp{0%,12%{opacity:0}15%,58%{opacity:1}62%,100%{opacity:0}}
@keyframes cpSpin{to{transform:rotate(360deg)}}
@keyframes cpSkPulse{0%,100%{opacity:1}50%{opacity:.45}}
${K.kf.tap('cpSpT', 10)}`),

      /* 9 stepper vs slider */
      S('stepper-slider', `
& .bm,& .bp{position:absolute;top:6.8em;display:grid;place-items:center;width:1.8em;height:1.8em;border-radius:50%;border:.09em solid #c4c5c0;background:#fff}
& .bm{left:4.1em}& .bp{left:10.1em}
& .bm .k-i,& .bp .k-i{width:1em;height:1em}
& .num{position:absolute;left:6.5em;top:6.8em;width:3em;height:1.8em}
& .num b{position:absolute;inset:0;display:grid;place-items:center;font-size:1.15em;opacity:0}
& .n4{animation-name:cpStN4}& .n5{animation-name:cpStN5}& .n6{animation-name:cpStN6}
& .tpl1{animation-name:cpStT1}& .tpl2{animation-name:cpStT2}& .tpl3{animation-name:cpStT3}& .tpl4{animation-name:cpStT4}
& .val{position:absolute;left:0;right:0;top:5.9em;height:1.6em}
& .val b{position:absolute;left:0;right:0;text-align:center;font-size:1.05em;opacity:0}
& .v1{animation-name:cpSlV1}& .v2{animation-name:cpSlV2}& .v3{animation-name:cpSlV3}
& .trk{position:absolute;left:2em;top:9.4em;width:12em;height:.35em;border-radius:1em;background:#d9dad5}
& .fill{position:absolute;left:2em;top:9.4em;width:12em;height:.35em;border-radius:1em;background:var(--a-brand);transform-origin:left;transform:scaleX(.25);animation-name:cpSlFill}
& .thb{position:absolute;left:4.25em;top:8.825em;width:1.5em;height:1.5em;border-radius:50%;background:#fff;border:.1em solid var(--a-brand);box-shadow:0 .15em .4em rgba(0,0,0,.2);animation-name:cpSlThb}
& .fg{animation-name:cpSlFg}
@keyframes cpStN4{0%,13%{opacity:1}14%,66%{opacity:0}67%,100%{opacity:1}}
@keyframes cpStN5{0%,13%{opacity:0}14%,25%{opacity:1}26%,54%{opacity:0}55%,66%{opacity:1}67%,100%{opacity:0}}
@keyframes cpStN6{0%,25%{opacity:0}26%,53%{opacity:1}54%,100%{opacity:0}}
@keyframes cpSlV1{0%,17%{opacity:1}18%,77%{opacity:0}78%,100%{opacity:1}}
@keyframes cpSlV2{0%,17%{opacity:0}18%,32%{opacity:1}33%,62%{opacity:0}63%,77%{opacity:1}78%,100%{opacity:0}}
@keyframes cpSlV3{0%,32%{opacity:0}33%,62%{opacity:1}63%,100%{opacity:0}}
@keyframes cpSlFill{0%,10%{transform:scaleX(.25)}40%,55%{transform:scaleX(.7)}85%,100%{transform:scaleX(.25)}}
@keyframes cpSlThb{0%,10%{transform:none}40%,55%{transform:translateX(5.4em)}85%,100%{transform:none}}
@keyframes cpSlFg{0%,7%{opacity:0;transform:translate(0,0) scale(1.3)}10%{opacity:1;transform:translate(0,0) scale(1)}40%{opacity:1;transform:translate(5.4em,0) scale(1)}43%,52%{opacity:0;transform:translate(5.4em,0) scale(1.2)}55%{opacity:1;transform:translate(5.4em,0) scale(1)}85%{opacity:1;transform:translate(0,0) scale(1)}88%,100%{opacity:0;transform:translate(0,0) scale(1.2)}}
${K.kf.tap('cpStT1', 12)}${K.kf.tap('cpStT2', 24)}${K.kf.tap('cpStT3', 52)}${K.kf.tap('cpStT4', 64)}`),

      /* 10 dropdown menu vs select */
      S('dropdown-select', `
& .dup{position:absolute;z-index:0;left:0;right:0;top:2.3em;opacity:0;animation-name:cpDdDup}
& .below{position:relative;z-index:2;animation-name:cpDdBelow}
& .mnu{position:absolute;z-index:12;top:3.9em;right:.6em;width:7em;padding:.3em 0;border-radius:.6em;background:#fff;box-shadow:0 .6em 1.6em rgba(10,10,12,.22),0 0 0 1px var(--a-line);opacity:0;animation-name:cpDdMenu}
& .mi{height:2em;display:flex;align-items:center;padding:0 .9em}
& .mi span{font-size:.72em}
& .mi1{animation-name:cpDdHl}
& .dng{color:var(--a-err)}
& .lwr{top:4.1em}
& .sel{position:absolute;left:1em;right:1em;top:5.4em;height:2.3em;border:.07em solid #cfcfca;border-radius:.5em;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 .8em}
& .sel .k-i{width:1em;height:1em;color:var(--a-mut)}
& .sv{position:relative;flex:1;height:100%}
& .sv span{position:absolute;left:0;top:0;bottom:0;display:flex;align-items:center;font-size:.74em}
& .sv .v1{animation-name:cpDdV1}& .sv .v2{animation-name:cpDdV2}
& .opt{position:absolute;z-index:6;left:1em;right:1em;top:8em;padding:.3em 0;border-radius:.5em;background:#fff;box-shadow:0 .6em 1.6em rgba(10,10,12,.2),0 0 0 1px var(--a-line);opacity:0;animation-name:cpDdOpt}
& .oi{height:2.1em;display:flex;align-items:center;justify-content:space-between;padding:0 .9em}
& .oi span{font-size:.72em}
& .oi u{display:block;width:1em;height:1em;color:var(--a-brand);text-decoration:none;opacity:0}
& .oi u .k-i{width:1em;height:1em;stroke-width:2.6}
& .ck1{animation-name:cpDdC1}& .ck2{animation-name:cpDdC2}
& .tpl1{animation-name:cpDdT1}& .tpl2{animation-name:cpDdT2}& .tpr1{animation-name:cpDdT1}& .tpr2{animation-name:cpDdT3}
@keyframes cpDdMenu{0%,14%{opacity:0;transform:translateY(-.4em)}20%,40%{opacity:1;transform:none}44%,100%{opacity:0;transform:none}}
@keyframes cpDdHl{0%,34%{background:transparent}36%,42%{background:var(--a-soft)}44%,100%{background:transparent}}
@keyframes cpDdDup{0%,45%{opacity:0}50%,88%{opacity:1}94%,100%{opacity:0}}
@keyframes cpDdBelow{0%,44%{transform:none}50%,88%{transform:translateY(2.3em)}94%,100%{transform:none}}
@keyframes cpDdOpt{0%,14%{opacity:0;transform:translateY(-.4em)}20%,42%{opacity:1;transform:none}48%,100%{opacity:0;transform:none}}
@keyframes cpDdV1{0%,43%{opacity:1}45%,92%{opacity:0}94%,100%{opacity:1}}
@keyframes cpDdV2{0%,43%{opacity:0}45%,92%{opacity:1}94%,100%{opacity:0}}
@keyframes cpDdC1{0%,40%{opacity:1}42%,92%{opacity:0}94%,100%{opacity:1}}
@keyframes cpDdC2{0%,40%{opacity:0}42%,92%{opacity:1}94%,100%{opacity:0}}
${K.kf.tap('cpDdT1', 12)}${K.kf.tap('cpDdT2', 38)}${K.kf.tap('cpDdT3', 40)}`),

      /* 11 button vs link */
      S('button-link', `
& .fl{position:absolute;left:1em;right:1em;top:5em}
& .go{position:absolute;left:1em;right:1em;top:9.4em;height:2.7em;border-radius:.7em;background:var(--a-brand);color:#fff;display:grid;place-items:center;animation-name:cpBlGo}
& .go span{position:absolute;display:flex;align-items:center;gap:.3em;font-size:.72em;font-weight:700}
& .go .g2 .k-i{width:1em;height:1em;stroke-width:3}
& .g1{animation-name:cpBlG1}& .g2{animation-name:cpBlG2}
& .pg{position:absolute;inset:0;background:var(--a-bg)}
& .p1{animation-name:cpBlP1}
& .p2{animation-name:cpBlP2;box-shadow:-.4em 0 1em rgba(0,0,0,.12)}
& .lnk{position:absolute;left:1em;top:9.2em;display:flex;align-items:center;gap:.15em;color:var(--a-brand)}
& .lnk span{font-size:.74em;font-weight:700;text-decoration:underline;text-underline-offset:.2em}
& .lnk .k-i{width:.9em;height:.9em}
& .tpl{animation-name:cpBlT0}& .tpr1{animation-name:cpBlT1}& .tpr2{animation-name:cpBlT2}
@keyframes cpBlGo{0%,13%{background:var(--a-brand);transform:none}15%{transform:scale(.97)}18%,60%{background:var(--a-ok);transform:none}66%,100%{background:var(--a-brand);transform:none}}
@keyframes cpBlG1{0%,13%{opacity:1}16%,60%{opacity:0}66%,100%{opacity:1}}
@keyframes cpBlG2{0%,13%{opacity:0}16%,60%{opacity:1}66%,100%{opacity:0}}
@keyframes cpBlP1{0%,14%{transform:none}22%,54%{transform:translateX(-30%)}62%,100%{transform:none}}
@keyframes cpBlP2{0%,14%{transform:translateX(101%)}22%,54%{transform:none}62%,100%{transform:translateX(101%)}}
${K.kf.tap('cpBlT0', 10)}${K.kf.tap('cpBlT1', 10)}${K.kf.tap('cpBlT2', 50)}`),

      /* 12 placeholder vs label */
      S('placeholder-label', `
& .fd{position:absolute;left:1em;right:1em;top:5.4em;height:2.3em;border:.07em solid #cfcfca;border-radius:.5em;background:#fff;padding:0 .8em}
& .fd .v{position:relative;height:100%;font-size:.74em}
& .fd .v span{position:absolute;left:0;top:0;bottom:0;display:flex;align-items:center;white-space:nowrap}
& .ph{color:#9b9c97;animation-name:cpPlPh}
& .tx{clip-path:inset(0 100% 0 0);animation-name:cpPlTx;animation-timing-function:steps(20,end)}
& .ring{position:absolute;inset:-.07em;border-radius:.5em;border:.12em solid var(--a-brand);opacity:0;pointer-events:none;animation-name:cpPlRing}
& .tp{animation-name:cpPlTap}
@keyframes cpPlPh{0%,16%{opacity:1}18%,92%{opacity:0}95%,100%{opacity:1}}
@keyframes cpPlTx{0%,18%{clip-path:inset(0 100% 0 0)}42%,92%{clip-path:inset(0 0 0 0)}95%,100%{clip-path:inset(0 100% 0 0)}}
@keyframes cpPlRing{0%,10%{opacity:0}12%,92%{opacity:1}95%,100%{opacity:0}}
${K.kf.tap('cpPlTap', 8)}`),

      /* 13 hamburger vs kebab */
      S('hamburger-kebab', `
& .hb .k-i{width:1.15em;height:1.15em}
& .sc{animation-name:cpHkSc}
& .dr{position:absolute;z-index:12;left:0;top:0;bottom:0;width:10.6em;padding-top:2.6em;background:#fff;transform:translateX(-100%);animation-name:cpHkDr;box-shadow:.6em 0 1.6em rgba(10,10,12,.2)}
& .dh{padding:0 1.2em 1em;font-size:.9em;font-weight:700}
& .di{height:2.4em;display:flex;align-items:center;gap:.7em;padding:0 1.2em}
& .di .k-i{width:1.05em;height:1.05em;color:var(--a-mut)}
& .di span{font-size:.74em}
& .kl .k-r{padding-right:2.6em}
& .kl .k-r2{animation-name:cpHkRow}
& .kb{position:absolute;z-index:3;right:.5em;width:1.8em;height:1.8em;display:grid;place-items:center}
& .kb .k-i{width:1.05em;height:1.05em}
& .mnu{position:absolute;z-index:12;top:7.9em;right:.7em;width:5.6em;padding:.3em 0;border-radius:.6em;background:#fff;box-shadow:0 .6em 1.6em rgba(10,10,12,.22),0 0 0 1px var(--a-line);opacity:0;animation-name:cpHkMenu}
& .mi{height:2em;display:flex;align-items:center;padding:0 .9em}
& .mi span{font-size:.72em}
& .dng{color:var(--a-err)}
& .tpl1{animation-name:cpHkT1}& .tpl2{animation-name:cpHkT2}& .tpr1{animation-name:cpHkT1}& .tpr2{animation-name:cpHkT3}
@keyframes cpHkSc{0%,13%{opacity:0}20%,62%{opacity:1}70%,100%{opacity:0}}
@keyframes cpHkDr{0%,13%{transform:translateX(-100%)}22%,62%{transform:none}70%,100%{transform:translateX(-100%)}}
@keyframes cpHkRow{0%,13%{background:var(--a-bg)}16%,62%{background:var(--a-soft)}68%,100%{background:var(--a-bg)}}
@keyframes cpHkMenu{0%,14%{opacity:0;transform:translateY(-.4em)}20%,60%{opacity:1;transform:none}66%,100%{opacity:0;transform:none}}
${K.kf.tap('cpHkT1', 12)}${K.kf.tap('cpHkT2', 56)}${K.kf.tap('cpHkT3', 52)}`),

      /* 14 app bar vs tab bar */
      S('appbar-tabbar', `
& .pg{position:absolute;inset:0;background:var(--a-bg)}
& .p1{animation-name:cpAtP1}
& .p2{animation-name:cpAtP2;box-shadow:-.4em 0 1em rgba(0,0,0,.12)}
& .fw{position:absolute;left:1em;right:1em}
& .f1{top:5em}& .f2{top:8.4em}
& .hl{position:absolute;z-index:14;left:.2em;right:.2em;border:.12em dashed var(--a-brand);border-radius:.5em;pointer-events:none}
& .hlt{top:1.3em;height:2.5em}
& .hlb{bottom:.15em;height:2.6em}
& .capR{bottom:3.5em}
& .fam{position:absolute;z-index:2;left:0;right:0;top:3.7em;bottom:2.9em;background:var(--a-bg);opacity:0;animation-name:cpAtFam}
& .fr{height:2.3em;display:flex;align-items:center;gap:.7em;padding:0 1em;border-bottom:1px solid var(--a-line)}
& .fr span{font-size:.74em;margin-right:auto}
& .fr em{font-style:normal;font-size:.62em;color:var(--a-mut)}
& .fr .av{width:1.6em;height:1.6em;font-size:.7em}
& .k-tab-0{animation-name:cpAtT0}& .k-tab-1{animation-name:cpAtT1}
& .tpl1{animation-name:cpAtA}& .tpl2{animation-name:cpAtB}& .tpr1{animation-name:cpAtA}& .tpr2{animation-name:cpAtB}
@keyframes cpAtP1{0%,14%{transform:none}22%,54%{transform:translateX(-30%)}62%,100%{transform:none}}
@keyframes cpAtP2{0%,14%{transform:translateX(101%)}22%,54%{transform:none}62%,100%{transform:translateX(101%)}}
@keyframes cpAtFam{0%,14%{opacity:0}20%,54%{opacity:1}60%,100%{opacity:0}}
@keyframes cpAtT0{0%,14%{color:var(--a-ink)}20%,54%{color:var(--a-mut)}60%,100%{color:var(--a-ink)}}
@keyframes cpAtT1{0%,14%{color:var(--a-mut)}20%,54%{color:var(--a-ink)}60%,100%{color:var(--a-mut)}}
${K.kf.tap('cpAtA', 10)}${K.kf.tap('cpAtB', 50)}`),

      /* 15 card vs list */
      S('card-list', `
& .cd{position:absolute;width:6.8em;height:7em;border:1px solid var(--a-line);border-radius:.6em;background:#fff;overflow:hidden}
& .c1{left:1.1em;top:4.1em}& .c2{left:8.1em;top:4.1em}& .c3{left:1.1em;top:11.5em}& .c4{left:8.1em;top:11.5em}
& .cd .im{display:block;height:4.4em;background:#d3d6d1 linear-gradient(135deg,transparent 46%,#bfc3bd 46%,#bfc3bd 54%,transparent 54%)}
& .cd span{display:block;padding:.5em .7em;font-size:.72em;font-weight:700}
& .dtl{animation-name:cpClZ;animation-timing-function:linear}
& .dtr{animation-name:cpClL;animation-timing-function:linear}
@keyframes cpClZ{0%,6%{opacity:0;transform:translate(0,0)}10%{opacity:1;transform:translate(0,0)}30%{opacity:1;transform:translate(7em,0)}55%{opacity:1;transform:translate(0,7.4em)}78%{opacity:1;transform:translate(7em,7.4em)}90%{opacity:1;transform:translate(7em,7.4em)}95%,100%{opacity:0;transform:translate(7em,7.4em)}}
@keyframes cpClL{0%,6%{opacity:0;transform:translate(0,0)}10%{opacity:1;transform:translate(0,0)}85%{opacity:1;transform:translate(0,11.5em)}92%,100%{opacity:0;transform:translate(0,11.5em)}}`),

      /* 16 avatar vs thumbnail */
      S('avatar-thumbnail', `
& .pr{position:absolute;left:0;right:0;height:3.1em;display:flex;align-items:center;gap:.8em;padding:0 1em;border-bottom:1px solid var(--a-line)}
& .pr .tx{display:flex;flex-direction:column;min-width:0}
& .pr .tx b{font-size:.76em}
& .pr .tx span{font-size:.62em;color:var(--a-mut);white-space:nowrap}
& .av0{animation-name:cpAvRow}
& .rg{position:absolute;inset:-.2em;border-radius:50%;border:.1em solid var(--a-ok);opacity:0;animation-name:cpAvRg}
& .on{position:absolute;right:-.05em;bottom:-.05em;width:.7em;height:.7em;border-radius:50%;background:var(--a-ok);border:.12em solid var(--a-bg);transform:scale(0);animation-name:cpAvOn}
& .th{position:relative;display:block;flex:none;width:4.8em;height:2.5em;border-radius:.4em;overflow:hidden;background:#d3d6d1 linear-gradient(135deg,transparent 46%,#bfc3bd 46%,#bfc3bd 54%,transparent 54%)}
& .du{position:absolute;right:.25em;bottom:.3em;padding:.1em .4em;border-radius:.3em;background:rgba(35,36,39,.82);color:#fff;font-style:normal;font-size:.5em;line-height:1.3}
& .pl{position:absolute;left:50%;top:50%;width:1.3em;height:1.3em;margin:-.65em 0 0 -.65em;border-radius:50%;background:rgba(35,36,39,.78);color:#fff;display:grid;place-items:center;text-decoration:none;opacity:0;animation-name:cpAvPl}
& .pl .k-i{width:.7em;height:.7em;stroke-width:2.4}
& .pg2{position:absolute;left:0;right:0;bottom:0;height:.25em;background:var(--a-brand);transform-origin:left;transform:scaleX(0);animation-name:cpAvPg}
& .tpl{animation-name:cpAvT}& .tpr{animation-name:cpAvT}
@keyframes cpAvOn{0%,14%{transform:scale(0)}18%{transform:scale(1.3)}22%,86%{transform:scale(1)}92%,100%{transform:scale(0)}}
@keyframes cpAvRg{0%,14%{opacity:0;transform:scale(.9)}20%{opacity:.8;transform:scale(1)}34%{opacity:0;transform:scale(1.3)}100%{opacity:0;transform:scale(1.3)}}
@keyframes cpAvRow{0%{opacity:1}100%{opacity:1}}
@keyframes cpAvPl{0%,14%{opacity:0}18%,80%{opacity:1}86%,100%{opacity:0}}
@keyframes cpAvPg{0%,18%{transform:scaleX(0)}75%{transform:scaleX(.9)}86%,100%{transform:scaleX(0)}}
${K.kf.tap('cpAvT', 12)}`),

      /* 17 banner vs popup */
      S('banner-popup', `
& .capH{bottom:.9em}
& .bn{position:absolute;z-index:2;left:0;right:0;top:3.7em;height:2.7em;display:flex;align-items:center;gap:.55em;padding:0 1em;background:var(--a-warn-bg);color:var(--a-warn-ink);transform:translateY(-100%);animation-name:cpBpIn}
& .bn span{font-size:.62em;line-height:1.35}
& .bn .k-i{width:1.05em;height:1.05em}
& .push{animation-name:cpBpPush}
& .lA .k-r2 .k-ck{animation-name:cpBpCk}
& .dsc{animation-name:cpBpSc}
& .dlg{position:absolute;z-index:11;left:1.6em;right:1.6em;top:6.2em;height:8em;padding:1.1em;border-radius:.8em;background:#fff;opacity:0;animation-name:cpBpDlg;box-shadow:0 .8em 2em rgba(10,10,12,.28)}
& .dlg b{display:block;font-size:.82em}
& .dlg p{margin:.6em 0 0;font-size:.64em;color:var(--a-mut);line-height:1.45}
& .btns{position:absolute;right:1.1em;bottom:1.1em;display:flex;gap:.4em}
& .btns .k-btn{width:5.45em;padding:0}
& .tpl{animation-name:cpBpT0}& .tpr1{animation-name:cpBpT0}& .tpr2{animation-name:cpBpT2}
@keyframes cpBpIn{0%,8%{transform:translateY(-100%)}16%,84%{transform:translateY(0)}92%,100%{transform:translateY(-100%)}}
@keyframes cpBpPush{0%,8%{transform:translateY(0)}16%,84%{transform:translateY(2.7em)}92%,100%{transform:translateY(0)}}
@keyframes cpBpCk{0%,39%{opacity:0;transform:scale(.4)}43%,82%{opacity:1;transform:scale(1)}90%,100%{opacity:0;transform:scale(1)}}
@keyframes cpBpSc{0%,7%{opacity:0}14%,62%{opacity:1}68%,100%{opacity:0}}
@keyframes cpBpDlg{0%,8%{opacity:0;transform:scale(.94)}16%,60%{opacity:1;transform:scale(1)}66%,100%{opacity:0;transform:scale(.97)}}
${K.kf.tap('cpBpT0', 36)}${K.kf.tap('cpBpT2', 56)}`),

      /* 18 FAB vs icon button */
      S('fab-iconbutton', `
& .k-fab{animation-name:cpFbFab}
& .nw .k-r{background:#fbe7dc}
& .nw{opacity:0;animation-name:cpFbNew}
& .k-ib-search::before,& .k-ib-share::before,& .k-ib-more::before{content:"";position:absolute;inset:0;border-radius:50%;background:#e4e3df;opacity:0}
& .k-ib-search::before{animation-name:cpFbH1}& .k-ib-share::before{animation-name:cpFbH2}& .k-ib-more::before{animation-name:cpFbH3}
& .tpl{animation-name:cpFbT0}& .tpr1{animation-name:cpFbT1}& .tpr2{animation-name:cpFbT2}& .tpr3{animation-name:cpFbT3}
@keyframes cpFbFab{0%,8%{transform:scale(1)}11%{transform:scale(.88)}16%,100%{transform:scale(1)}}
@keyframes cpFbNew{0%,15%{opacity:0;transform:translateY(.8em)}22%,86%{opacity:1;transform:none}92%,100%{opacity:0;transform:none}}
@keyframes cpFbH1{0%,11%{opacity:0}13%,22%{opacity:1}26%,100%{opacity:0}}
@keyframes cpFbH2{0%,33%{opacity:0}35%,44%{opacity:1}48%,100%{opacity:0}}
@keyframes cpFbH3{0%,55%{opacity:0}57%,66%{opacity:1}70%,100%{opacity:0}}
${K.kf.tap('cpFbT0', 10)}${K.kf.tap('cpFbT1', 10)}${K.kf.tap('cpFbT2', 32)}${K.kf.tap('cpFbT3', 54)}`)
    ].join('\n')
  });
})();
