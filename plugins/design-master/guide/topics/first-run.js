/* Topic: 앱 첫 화면 (first-run). Reference: plugins/design-master/references/onboarding.md
   Selectors use "&" as a placeholder for .t-first-run-<element>; see E() below. */
(function () {
  const E = (id, css) => css.replace(/&/g, '.t-first-run-' + id);
  /* checkbox-like window: hidden, pops in at a, leaves after b */
  const win = (name, a, b) => `@keyframes ${name}{0%,${a - 4}%{opacity:0;transform:scale(.4)}${a}%,${b}%{opacity:1;transform:scale(1)}${b + 5}%,100%{opacity:0;transform:scale(.4)}}`;
  const onoff = (name, a, b) => `@keyframes ${name}{0%,${a}%{opacity:0}${a + 3}%,${b}%{opacity:1}${b + 4}%,100%{opacity:0}}`;

  UIGuide.registerTopic({
    id: 'first-run',
    intro: '앱을 처음 열고 쓰기 시작하기까지 만나는 화면들이에요. 단계마다 사용자가 가치를 얻기까지의 거리가 늘어나니 정말 필요한 것만 넣어요.',
    elements: [
      {
        id: 'splash', ko: '스플래시', en: 'Splash screen', aka: ['로딩 화면', '시작 화면', 'launch screen'],
        when: '앱이 초기화되는 동안 빈 화면을 대신해야 할 때',
        avoid: '일부러 시간을 늘리는 연출, 광고성 스플래시',
        notes: [
          '실제 로딩에 걸리는 시간만 보여 주고 1~2초를 넘기지 않아요.',
          '배경색은 시스템 다크 모드에 맞추고 첫 화면과 점프 없이 이어지게 해요.',
          '모바일 OS의 스플래시 규격(Android 12+의 Splash Screen API, iOS Launch Screen)을 따라요. 로고에 모션을 더해도 건너뛸 수 있어야 해요.'
        ],
        vs: { id: 'welcome', text: '웰컴 화면은 가입한 뒤 사용자에게 말을 걸고, 스플래시는 로딩 동안 로고만 잠깐 보여 줘요.' },
        demo: {
          frame: 'phone', cycle: 4500, still: 1500,
          phases: [['로고 등장', 200, 700], ['스플래시 유지', 700, 2300], ['홈으로 전환', 2300, 2800]],
          alt: '주황색 바탕 가운데에 앱 로고와 이름이 나타나 잠시 머물다가 사라지면서 장보기 목록 홈 화면이 드러나는 시연',
          html: K => K.app.screen() + K.app.tabs(0) +
            `<div class="sp"><i class="lg">${K.icon('list')}</i><b>장보기</b></div>`
        }
      },
      {
        id: 'onboarding', ko: '온보딩', en: 'Onboarding', aka: ['소개 화면', '인트로', 'intro slides'],
        when: '앱의 개념이 낯설어 첫 화면만으로 이해되기 어려울 때',
        avoid: '설명하지 않아도 쓸 수 있는 앱, 5장 이상 이어지는 소개(건너뛰게 돼요)',
        notes: [
          '2~4장, 장당 한 가지 메시지. 항상 건너뛰기를 둬요.',
          '페이지 인디케이터를 두고 마지막 장의 주 버튼은 ‘시작하기’로 바꿔요.',
          '설명 대신 직접 해 보게 하면 더 효과적이에요. 다시 볼 수 있는 경로(설정 > 도움말)를 둬요.'
        ],
        vs: { id: 'coach-mark', text: '코치마크는 실제 화면 위에서 요소를 짚어 주고, 온보딩은 별도 화면 몇 장으로 가치를 소개해요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2700,
          phases: [['1장', 0, 1300], ['넘김', 1300, 1800], ['2장', 1800, 3100], ['넘김 ', 3100, 3600], ['3장 유지', 3600, 5400]],
          alt: '다음을 누르면 소개 화면이 옆으로 넘어가며 점 표시가 따라 움직이고, 마지막 3장에서는 버튼이 시작하기로 바뀌는 시연',
          html: K => K.app.status() + '<span class="skp">건너뛰기</span>' +
            '<div class="vw"><div class="trk">' +
            [['users', '가족이 한 목록에', '같이 담고 같이 지워요.'], ['check', '마트에서 바로 체크', '담은 항목을 눌러 표시해요.'], ['bell', '다 사면 알려 줘요', '남은 가족에게 알림이 가요.']]
              .map(([ic, t, p]) => `<div class="pgx"><i class="ill">${K.icon(ic)}</i><b>${t}</b><p>${p}</p></div>`).join('') +
            '</div></div><div class="dots"><span><i class="d1"></i></span><span><i class="d2"></i></span><span><i class="d3"></i></span></div>' +
            '<div class="nx"><span class="la">다음</span><span class="lb">시작하기</span></div>' +
            K.tap(8, 18.63, 'tp1') + K.tap(8, 18.63, 'tp2')
        }
      },
      {
        id: 'permission', ko: '권한 요청', en: 'Permission request', aka: ['알림 권한', '사전 설명', 'permission prompt'],
        when: '해당 기능을 처음 쓰려는 순간, 필요한 이유를 알린 뒤',
        avoid: '첫 실행 때 한꺼번에 여러 권한을 묻는 것(시스템 대화상자는 거부하면 다시 못 묻는 경우가 많아요)',
        notes: [
          '시스템 요청 직전에 앱 자체 화면으로 왜 필요한지와 무엇을 얻는지 한 문장씩 알려요.',
          '사용자가 사전 설명을 거절하면 시스템 요청을 띄우지 않아요.',
          '필요한 최소 권한만 요청하고, 거부된 뒤의 화면은 빈 화면 주제의 ‘권한 필요’를 봐요.'
        ],
        vs: { id: 'terms', text: '약관 동의는 법적 동의를 받는 화면이고, 권한 요청은 알림이나 카메라 같은 기기 기능 접근을 묻는 화면이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 1500,
          phases: [['사전 설명', 600, 2300], ['시스템 요청', 2500, 4400]],
          alt: '앱이 먼저 알림이 필요한 이유를 설명하는 카드를 보여 주고, 알림 켜기를 누르면 시스템 허용 대화상자가 뜨고, 허용을 누르면 닫히는 시연',
          html: K => K.app.screen() + K.scrim('sc') +
            `<div class="pre"><i class="bl">${K.icon('bell')}</i><b>알림을 켤까요?</b><p>가족이 항목을 담으면 바로 알려요. 필요한 알림만 보내요.</p><div class="btns">${K.app.button('나중에', 'ghost')}${K.app.button('알림 켜기', 'primary')}</div></div>` +
            '<div class="sys"><b>장보기 앱이 알림을 보내려고 해요</b><div class="bt"><span>허용 안 함</span><span>허용</span></div></div>' +
            K.tap(10.8, 13.15, 'tp1') + K.tap(10.75, 12.15, 'tp2')
        }
      },
      {
        id: 'coach-mark', ko: '코치마크', en: 'Coach mark', aka: ['온보딩 안내', '스포트라이트', 'spotlight'],
        when: '홈에 처음 들어온 직후 핵심 기능 1~3개를 짚을 때',
        avoid: '첫 화면에서 5개 이상 연속으로 띄울 때',
        notes: [
          '홈 진입 직후 핵심 기능 1~3개만 짚고, 건너뛰기를 함께 둬요.',
          '한 번에 하나씩 보여 주고 다음을 누르면 강조 영역이 옮겨 가요.',
          '본 뒤에는 다시 띄우지 않게 저장해요. 자세한 규칙은 알림·피드백 주제의 코치마크를 봐요.'
        ],
        vs: { id: 'onboarding', text: '온보딩은 별도 화면 몇 장으로 소개하고, 코치마크는 실제 홈 화면 위에서 요소를 짚어요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['1단계', 480, 2400], ['2단계', 2700, 4900]],
          alt: '홈 화면이 어두워지며 추가 버튼만 밝게 남아 첫 안내가 뜨고, 다음을 누르면 강조가 가족 탭으로 옮겨 가 두 번째 안내가 뜬 뒤 완료를 누르면 사라지는 시연',
          html: K => K.app.screen() + K.app.tabs(0) + K.app.fab() +
            '<div class="s1"></div><div class="s2"></div>' +
            '<div class="b1"><em>1 / 2</em><b>새 항목은 여기서 추가해요</b><p>가족이 담은 항목도 같은 목록에 모여요.</p><div class="row"><span>건너뛰기</span><span class="nx">다음</span></div></div>' +
            '<div class="b2"><em>2 / 2</em><b>가족을 초대해 보세요</b><p>같이 담으면 장보기가 빨라져요.</p><div class="row"><span></span><span class="nx">완료</span></div></div>' +
            K.tap(13.5, 13, 'tp1') + K.tap(11.9, 16.5, 'tp2')
        }
      },
      {
        id: 'social-login', ko: '간편 로그인', en: 'Social login', aka: ['소셜 로그인', '계정으로 시작'],
        when: '가입 장벽을 낮추고 비밀번호 관리 부담을 줄이고 싶을 때',
        avoid: '제공자 선택지를 너무 많이 늘어놓을 때(3~4개 이내)',
        notes: [
          '각 제공자의 공식 버튼 규격과 문구를 따르고, iOS 앱이 다른 소셜 로그인을 제공하면 Apple 로그인 제공이 정책상 요구될 수 있어 플랫폼 정책을 확인해요.',
          '버튼 높이 48~56px, 같은 폭으로 정렬하고 간격은 12px.',
          '직전에 쓴 방법을 먼저 보이게 하고, 이메일 대안을 함께 둬요.'
        ],
        vs: { id: 'profile-setup', text: '프로필 설정은 로그인한 뒤 이름이나 사진 같은 정보를 입력하는 화면이에요. 간편 로그인은 계정을 연결해서 들어오는 단계예요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 1500,
          phases: [['등장', 100, 700], ['유지', 700, 2100], ['연결 중', 2300, 3400], ['완료 유지', 3400, 4400]],
          alt: '로그인 버튼 세 개가 차례로 올라오고, 최근에 쓴 간편 로그인을 누르면 버튼 안에서 원이 돌다가 완료 표시로 바뀌는 시연',
          html: K => K.app.status() +
            `<i class="lg">${K.icon('list')}</i><b class="tt">함께 장보기</b><p class="sub">한 번에 시작해요</p>` +
            `<div class="bt b1"><span class="lab">${K.icon('user')}<span>간편 로그인</span><em>최근</em></span><i class="sp"></i><span class="dn">${K.icon('checkCircle')}<span>완료됐어요</span></span></div>` +
            `<div class="bt b2 alt"><span class="lab">${K.icon('users')}<span>다른 계정으로 로그인</span></span></div>` +
            '<div class="or b3"><i></i><span>또는</span><i></i></div>' +
            `<div class="bt b3 alt mail"><span class="lab">${K.icon('send')}<span>이메일로 시작</span></span></div>` +
            K.tap(8, 11.3, 'tp')
        }
      },
      {
        id: 'terms', ko: '약관 동의', en: 'Terms agreement', aka: ['이용약관', '개인정보 동의', 'consent'],
        when: '가입 시 법적으로 필요한 동의를 받을 때',
        avoid: '모든 항목을 필수로 묶는 것, 동의를 미리 체크해 두는 것(법적·윤리적 위험)',
        notes: [
          '‘전체 동의’ 하나와 항목별 체크박스를 두고 필수와 선택을 라벨로 구분해요.',
          '약관 전문은 링크로 열어 보게 하고 요약을 함께 보여 줘요. 필수가 모두 체크되어야 ‘동의하고 계속’이 켜져요.',
          '체크박스 터치 영역은 44px 이상. 선택 동의는 거부해도 서비스를 쓸 수 있어야 해요. 구체 요건은 해당 국가의 법률을 확인해요.'
        ],
        vs: { id: 'permission', text: '권한 요청은 알림이나 카메라 같은 기기 기능 접근을 묻고, 약관 동의는 법적 동의를 받아요. 둘은 별개예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2700,
          phases: [['필수 동의', 500, 1800], ['버튼 활성', 1900, 2700], ['전체 동의', 3000, 3500], ['완료 유지', 3500, 5000]],
          alt: '필수 항목 두 개를 차례로 체크하면 동의하고 계속 버튼이 켜지고, 전체 동의를 누르면 선택 항목까지 한 번에 체크되는 시연',
          html: K => K.app.status() + K.app.bar('약관 동의', [], { back: true }) +
            `<div class="all"><i class="cb"><i class="ca">${K.icon('check')}</i></i><b>전체 동의</b></div>` +
            [['필수', '이용약관', 'c1'], ['필수', '개인정보 처리 동의', 'c2'], ['선택', '알림 수신', 'c3']]
              .map(([t, n, c], i) => `<div class="it i${i + 1}"><i class="cb"><i class="${c}">${K.icon('check')}</i></i><em class="${t === '필수' ? 'rq' : 'op'}">${t}</em><span>${n}</span>${K.icon('chevR')}</div>`).join('') +
            '<div class="go"><i></i><span>동의하고 계속</span></div>' +
            K.tap(2.5, 9, 'tp1') + K.tap(2.5, 11.6, 'tp2') + K.tap(3, 5.6, 'tp3')
        }
      },
      {
        id: 'profile-setup', ko: '프로필 설정', en: 'Profile setup', aka: ['이름 입력', '사진 설정', '가입 정보'],
        when: '개인화된 경험에 꼭 필요한 정보가 있을 때',
        avoid: '지금 쓰지 않을 정보를 미리 묻는 것(나중에 입력하도록 미뤄요)',
        notes: [
          '필수는 최소로, 나머지는 ‘나중에 하기’. 한 화면에 한두 가지만 물어요.',
          '사진은 건너뛸 수 있게 하고 기본 아바타를 줘요. 진행 상태를 단계 표시로 보여 줘요.',
          '이전에 입력한 값은 유지하고, 입력 칸 규칙은 입력 주제를 따라요.'
        ],
        vs: { id: 'social-login', text: '간편 로그인은 계정을 연결해 들어오는 단계이고, 프로필 설정은 들어온 뒤 내 정보를 채우는 단계예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3000,
          phases: [['이름 입력', 800, 2300], ['다음 활성', 2300, 3000], ['단계 이동', 3300, 3800]],
          alt: '이름 칸에 우리집을 입력하면 기본 아바타가 이름 첫 글자로 바뀌고 다음 버튼이 켜지며, 다음을 누르면 위쪽 단계 표시의 두 번째 칸이 채워지는 시연',
          html: K => K.app.status() + K.app.bar('프로필 설정', [], { back: true }) +
            '<div class="prg"><i></i><i><b></b></i></div>' +
            `<div class="av"><span class="u">${K.icon('user')}</span><span class="ini">우</span><i class="cam">${K.icon('camera')}</i></div>` +
            '<span class="lb l1">이름</span>' +
            '<div class="fd f1"><span class="phd">이름을 입력해요</span><span class="ch c1">우</span><span class="ch c2">리</span><span class="ch c3">집</span><i class="caret"></i><i class="ring"></i></div>' +
            '<span class="lb l2">한 줄 소개 (선택)</span><span class="later">나중에 하기</span>' +
            '<div class="fd f2"><span class="phd">나중에 써도 돼요</span></div>' +
            '<div class="go"><i></i><span>다음</span></div>' +
            K.tap(8, 11.6, 'tp1') + K.tap(8, 18.4, 'tp2')
        }
      },
      {
        id: 'skeleton', ko: '스켈레톤', en: 'Skeleton', aka: ['뼈대 화면', '로딩 자리표시', 'placeholder'],
        when: '첫 홈이 서버 데이터를 불러오는 동안 홈 구조를 미리 보여 줄 때',
        avoid: '데이터가 거의 즉시 도착하는 화면, 구조가 매번 달라 자리표시를 만들 수 없는 화면',
        notes: [
          '실제 내용과 같은 구조와 크기로 만들어 교체될 때 레이아웃이 튀지 않게 해요.',
          '스플래시에 이어 홈의 틀을 먼저 보이면 연속된 느낌을 줘요.',
          '자세한 규칙은 빈 화면·로딩 주제의 스켈레톤을 봐요.'
        ],
        vs: { topic: 'loading', id: 'skeleton', name: '스켈레톤 화면', text: '로딩 패턴 주제에서 스피너와의 차이를 자세히 비교해요. 첫 화면 흐름에서는 스플래시 다음 홈의 틀을 보여 주는 용도예요.' },
        demo: {
          frame: 'phone', cycle: 4500, still: 1500,
          phases: [['스켈레톤 유지', 0, 2400], ['교체', 2400, 2900], ['내용 표시', 2900, 4000]],
          alt: '홈 화면의 앱 바는 그대로 있고 목록 자리에 회색 막대가 반짝이며 지나가다가, 데이터가 도착하면 실제 장보기 목록으로 바뀌는 시연',
          html: K => K.app.status() + K.app.bar() +
            '<div class="sk">' + [0, 1, 2, 3, 4].map(i => `<div class="s"><i class="c"></i><i class="l" style="width:${[5.2, 3.6, 4.4, 3.2, 4.8][i]}em"></i><i class="q"></i></div>`).join('') + '<i class="sh"></i></div>' +
            K.app.list(0, 5, { cls: 'real' }) + K.app.tabs(0)
        }
      },
      {
        id: 'welcome', ko: '웰컴 화면', en: 'Welcome screen', aka: ['환영 화면', '시작 안내', 'welcome'],
        when: '설정을 마친 뒤 본격적인 사용으로 넘어가기 직전',
        avoid: '환영 문구만 있고 다음 행동이 없는 화면',
        notes: [
          '사용자 이름을 부르는 한 줄, 가치 제안, 첫 행동 버튼 하나로 구성해요.',
          '로그인 전 소개 화면(로그인과 가입 선택)도 웰컴 화면이라 부르니 목적을 구분해요.',
          '완료 연출이 필요하면 완료 표시 주제의 완료 화면과 겹치지 않게 해요.'
        ],
        vs: { id: 'splash', text: '스플래시는 로딩용이라 말을 걸지 않고, 온보딩은 소개용이에요. 웰컴 화면은 이름을 부르고 첫 행동으로 안내해요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2200,
          phases: [['등장', 200, 1700], ['유지', 1700, 3000], ['시작', 3000, 3300], ['퇴장', 4000, 4700]],
          alt: '체크 표시 아이콘, 우리집님 환영 문구, 설명, 첫 목록 만들기 버튼이 차례로 올라오고, 버튼을 누르면 화면이 사라지는 시연',
          html: K => K.app.status() +
            `<i class="ic">${K.icon('checkCircle')}</i><b class="hi">우리집님, 환영해요</b><p class="sb">가족과 함께 첫 목록을 만들어 봐요.</p>` +
            '<div class="cta">첫 목록 만들기</div><span class="lt">나중에 둘러볼게요</span>' +
            K.tap(8, 15.73, 'tp')
        }
      }
    ],
    css: K => [
      E('splash', `
& .sp{position:absolute;z-index:20;inset:0;background:var(--a-brand);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8em;animation-name:frSplBg}
& .sp>*{animation-name:frSplLg}
& .lg{width:4.4em;height:4.4em;border-radius:1.2em;background:#fff;color:var(--a-brand);display:grid;place-items:center}
& .lg .k-i{width:2.2em;height:2.2em}
& .sp b{font-size:1.1em}
@keyframes frSplBg{0%,52%{opacity:1}62%,90%{opacity:0}98%,100%{opacity:1}}
@keyframes frSplLg{0%{opacity:0;transform:scale(.7)}10%,50%{opacity:1;transform:scale(1)}56%{opacity:1;transform:scale(1.06)}62%,100%{opacity:0;transform:scale(1.06)}}`),

      E('onboarding', `
& .skp{position:absolute;z-index:3;right:1.77em;top:2.58em;font-size:.62em;color:var(--a-mut);animation-name:frObLa}
& .vw{position:absolute;left:0;top:1.3em;width:16em;height:14em;overflow:hidden;animation-name:frObVw}
& .trk{display:flex;width:48em;animation-name:frObTrk}
& .pgx{width:16em;padding-top:2.6em;text-align:center}
& .ill{width:6.4em;height:6.4em;margin:0 auto 1.6em;border-radius:50%;background:var(--a-soft);color:var(--a-brand);display:grid;place-items:center}
& .ill .k-i{width:2.8em;height:2.8em}
& .pgx b{display:block;font-size:.92em}
& .pgx p{margin:.5em 0 0;font-size:.64em;color:var(--a-mut)}
& .dots{position:absolute;left:0;right:0;top:16em;display:flex;justify-content:center;gap:.5em}
& .dots span{position:relative;width:.5em;height:.5em;border-radius:50%;background:#d3d3ce}
& .dots i{position:absolute;inset:0;border-radius:50%;background:var(--a-brand);opacity:0}
& .d1{animation-name:frObD1}.t-first-run-onboarding .d2{animation-name:frObD2}.t-first-run-onboarding .d3{animation-name:frObD3}
& .nx{position:absolute;left:1.94em;right:1.94em;bottom:1.94em;height:3.6em;border-radius:1.1em;background:var(--a-brand);color:#fff;font-size:.72em;font-weight:700}
& .nx span{position:absolute;inset:0;display:grid;place-items:center}
& .nx .la{animation-name:frObLa}
& .nx .lb{animation-name:frObLb}
& .tp1{animation-name:frObTap1}
& .tp2{animation-name:frObTap2}
@keyframes frObVw{0%,88%{opacity:1}92%{opacity:0}97%,100%{opacity:1}}
@keyframes frObTrk{0%,22%{transform:translateX(0)}30%,52%{transform:translateX(-16em)}60%,92%{transform:translateX(-32em)}93%,100%{transform:translateX(0)}}
@keyframes frObD1{0%,29%{opacity:1}31%,94%{opacity:0}97%,100%{opacity:1}}
@keyframes frObD2{0%,29%{opacity:0}31%,59%{opacity:1}61%,100%{opacity:0}}
@keyframes frObD3{0%,59%{opacity:0}61%,92%{opacity:1}94%,100%{opacity:0}}
@keyframes frObLa{0%,55%{opacity:1}57%,94%{opacity:0}97%,100%{opacity:1}}
@keyframes frObLb{0%,55%{opacity:0}57%,94%{opacity:1}97%,100%{opacity:0}}
${K.kf.tap('frObTap1', 22)}
${K.kf.tap('frObTap2', 52)}`),

      E('permission', `
& .sc{animation-name:frPmSc}
& .pre{position:absolute;z-index:11;left:1.4em;right:1.4em;top:4.6em;height:10.6em;padding:1.1em;border-radius:.8em;background:#fff;opacity:0;animation-name:frPmPre;box-shadow:0 .8em 2em rgba(10,10,12,.28)}
& .bl{display:grid;place-items:center;width:2.4em;height:2.4em;border-radius:50%;background:var(--a-soft);color:var(--a-brand);margin-bottom:.5em}
& .bl .k-i{width:1.2em;height:1.2em}
& .pre b{display:block;font-size:.82em}
& .pre p{margin:.4em 0 0;font-size:.62em;color:var(--a-mut);line-height:1.45}
& .btns{position:absolute;right:1.1em;bottom:1.1em;display:flex;gap:.4em}
& .btns .k-btn{width:5.45em;padding:0}
& .sys{position:absolute;z-index:12;left:2.5em;right:2.5em;top:6.6em;height:6.6em;border-radius:.9em;background:#f4f4f2;opacity:0;text-align:center;animation-name:frPmSys;box-shadow:0 .8em 2em rgba(10,10,12,.3)}
& .sys b{display:block;padding:1.1em 1em 0;font-size:.7em;line-height:1.45}
& .sys .bt{position:absolute;left:0;right:0;bottom:0;height:2.1em;display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #d6d6d2}
& .sys .bt span{display:grid;place-items:center;font-size:.7em;color:#2d6fd6}
& .sys .bt span:first-child{border-right:1px solid #d6d6d2}
& .sys .bt span:last-child{font-weight:700}
& .tp1{animation-name:frPmTap1}
& .tp2{animation-name:frPmTap2}
@keyframes frPmSc{0%,8%{opacity:0}16%,72%{opacity:1}78%,100%{opacity:0}}
@keyframes frPmPre{0%,9%{opacity:0;transform:scale(.94)}16%,36%{opacity:1;transform:scale(1)}41%,100%{opacity:0;transform:scale(.97)}}
@keyframes frPmSys{0%,40%{opacity:0;transform:scale(1.06)}46%,70%{opacity:1;transform:scale(1)}75%,100%{opacity:0;transform:scale(.97)}}
${K.kf.tap('frPmTap1', 32)}
${K.kf.tap('frPmTap2', 64)}`),

      E('coach-mark', `
& .k-fab{bottom:4em}
& .s1,& .s2{position:absolute;z-index:10;width:3.4em;height:3.4em;border-radius:50%;box-shadow:0 0 0 40em rgba(14,14,16,.66);opacity:0}
& .s1{right:.7em;bottom:2.7em;animation-name:frCmS1}
& .s2{left:6.3em;bottom:.7em;animation-name:frCmS2}
& .b1,& .b2{position:absolute;z-index:12;width:10.6em;padding:.75em .85em .8em;border-radius:.7em;background:#fff;opacity:0}
& .b1{right:1em;bottom:7.1em;animation-name:frCmB1}
& .b2{left:2.7em;bottom:3.6em;animation-name:frCmB2}
& .b1::after,& .b2::after{content:"";position:absolute;bottom:-.3em;width:.6em;height:.6em;background:#fff;transform:rotate(45deg)}
& .b1::after{right:1.05em}
& .b2::after{left:5em}
& em{display:block;font-style:normal;font-size:.52em;color:var(--a-mut);margin-bottom:.3em}
& .b1 b,& .b2 b{display:block;font-size:.7em}
& .b1 p,& .b2 p{margin:.4em 0 .7em;font-size:.58em;color:var(--a-mut);line-height:1.45}
& .row{display:flex;justify-content:space-between;align-items:center}
& .row span{font-size:.62em;color:var(--a-mut)}
& .row .nx{color:var(--a-brand);font-weight:700}
& .tp1{animation-name:frCmTap1}
& .tp2{animation-name:frCmTap2}
@keyframes frCmS1{0%,6%{opacity:0}14%,40%{opacity:1}46%,100%{opacity:0}}
@keyframes frCmS2{0%,44%{opacity:0}50%,84%{opacity:1}92%,100%{opacity:0}}
@keyframes frCmB1{0%,8%{opacity:0;transform:translateY(.4em)}16%,40%{opacity:1;transform:none}46%,100%{opacity:0;transform:none}}
@keyframes frCmB2{0%,46%{opacity:0;transform:translateY(.4em)}52%,82%{opacity:1;transform:none}88%,100%{opacity:0;transform:none}}
${K.kf.tap('frCmTap1', 38)}
${K.kf.tap('frCmTap2', 78)}`),

      E('social-login', `
& .lg{position:absolute;left:6.3em;top:2.6em;width:3.4em;height:3.4em;border-radius:1em;background:var(--a-brand);color:#fff;display:grid;place-items:center}
& .lg .k-i{width:1.7em;height:1.7em}
& .tt{position:absolute;left:0;right:0;top:6.84em;text-align:center;font-size:.95em}
& .sub{position:absolute;left:0;right:0;top:13.4em;margin:0;text-align:center;font-size:.62em;color:var(--a-mut)}
& .bt{position:absolute;left:1.94em;right:1.94em;height:3.6em;border-radius:1.1em;background:var(--a-dark);color:#fff;font-size:.72em;font-weight:700;display:grid;place-items:center;opacity:0}
& .b1{top:13.9em;animation-name:frSlB1}
& .b2{top:17.9em;animation-name:frSlB2}
& .b3.mail{top:24.2em;animation-name:frSlB3}
& .alt{background:#fff;color:var(--a-ink);border:.1em solid #cfcfca}
& .lab{display:flex;align-items:center;gap:.6em;animation-name:frSlLab}
& .lab .k-i{width:1.3em;height:1.3em}
& .lab em{font-style:normal;font-size:.7em;padding:.15em .6em;border-radius:1em;background:#fff;color:var(--a-ink)}
& .sp{position:absolute;left:50%;top:50%;width:1.4em;height:1.4em;margin:-.7em 0 0 -.7em;border-radius:50%;border:.18em solid rgba(255,255,255,.35);border-top-color:#fff;opacity:0;animation-name:frSlSp,frSlSpin;animation-duration:var(--cyc),.8s;animation-timing-function:var(--k-ease),linear}
& .dn{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:.5em;opacity:0;animation-name:frSlDn}
& .dn .k-i{width:1.3em;height:1.3em;color:#7fd6a3}
& .or{position:absolute;left:2.33em;right:2.33em;top:26.5em;display:flex;align-items:center;gap:.7em;font-size:.6em;color:var(--a-mut);opacity:0;animation-name:frSlOr}
& .or i{flex:1;height:1px;background:var(--a-line)}
& .tp{animation-name:frSlTap}
@keyframes frSlLab{0%,48%{opacity:1}52%,88%{opacity:0}92%,100%{opacity:1}}
@keyframes frSlSp{0%,50%{opacity:0}54%,68%{opacity:1}72%,100%{opacity:0}}
@keyframes frSlSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes frSlDn{0%,72%{opacity:0;transform:scale(.8)}76%,88%{opacity:1;transform:scale(1)}92%,100%{opacity:0;transform:scale(1)}}
@keyframes frSlOr{0%,10%{opacity:0}18%,94%{opacity:1}100%{opacity:0}}
${K.kf.fade('frSlB1', [[2, 12, 94, 100]], .8)}
${K.kf.fade('frSlB2', [[6, 16, 94, 100]], .8)}
${K.kf.fade('frSlB3', [[10, 20, 94, 100]], .8)}
${K.kf.tap('frSlTap', 44)}`),

      E('terms', `
& .all{position:absolute;left:1.4em;right:1.4em;top:4.2em;height:2.8em;border-radius:.7em;background:var(--a-soft);display:flex;align-items:center;gap:.7em;padding:0 1em}
& .all b{font-size:.8em}
& .cb{position:relative;display:block;width:1.1em;height:1.1em;border-radius:.3em;border:.09em solid #b5b6b1;flex:none;background:#fff}
& .cb i{position:absolute;inset:-.09em;border-radius:.3em;background:var(--a-brand);color:#fff;display:grid;place-items:center;opacity:0}
& .cb .k-i{width:.75em;height:.75em;stroke-width:3}
& .ca{animation-name:frTmCa}.t-first-run-terms .c1{animation-name:frTmC1}.t-first-run-terms .c2{animation-name:frTmC2}.t-first-run-terms .c3{animation-name:frTmC3}
& .it{position:absolute;left:1.4em;right:1.4em;height:2.6em;display:flex;align-items:center;gap:.6em;padding:0 .5em;border-bottom:1px solid var(--a-line)}
& .i1{top:7.7em}.t-first-run-terms .i2{top:10.3em}.t-first-run-terms .i3{top:12.9em}
& .it span{margin-right:auto;font-size:.7em}
& .it>.k-i{width:.9em;height:.9em;color:var(--a-mut)}
& .it em{font-style:normal;font-size:.58em;font-weight:700}
& .rq{color:var(--a-brand)}
& .op{color:var(--a-mut)}
& .go{position:absolute;left:1.94em;right:1.94em;bottom:1.94em;height:3.9em;border-radius:1.1em;background:#dcdcd8;color:#8d8e8a;display:grid;place-items:center;overflow:hidden;font-size:.72em;font-weight:700}
& .go i{position:absolute;inset:0;background:var(--a-brand);opacity:0;animation-name:frTmGo}
& .go span{position:relative;animation-name:frTmGoT}
& .tp1{animation-name:frTmTap1}.t-first-run-terms .tp2{animation-name:frTmTap2}.t-first-run-terms .tp3{animation-name:frTmTap3}
${win('frTmC1', 12, 90)}
${win('frTmC2', 28, 90)}
${win('frTmCa', 56, 90)}
${win('frTmC3', 58, 90)}
@keyframes frTmGo{0%,30%{opacity:0}34%,90%{opacity:1}95%,100%{opacity:0}}
@keyframes frTmGoT{0%,30%{color:#8d8e8a}34%,90%{color:#fff}95%,100%{color:#8d8e8a}}
${K.kf.tap('frTmTap1', 8)}
${K.kf.tap('frTmTap2', 24)}
${K.kf.tap('frTmTap3', 50)}`),

      E('profile-setup', `
& .prg{position:absolute;left:1.4em;right:1.4em;top:4.0em;display:flex;gap:.4em}
& .prg i{position:relative;flex:1;height:.25em;border-radius:1em;background:#dcdcd8;overflow:hidden}
& .prg i:first-child{background:var(--a-brand)}
& .prg b{position:absolute;inset:0;background:var(--a-brand);transform-origin:left;transform:scaleX(0);animation-name:frPfSeg}
& .av{position:absolute;left:5.8em;top:4.9em;width:4.4em;height:4.4em;border-radius:50%;background:var(--a-soft);color:var(--a-mut);display:grid;place-items:center}
& .av .u,& .av .ini{position:absolute;inset:0;display:grid;place-items:center}
& .av .u .k-i{width:2em;height:2em}
& .av .u{animation-name:frPfU}
& .av .ini{font-size:1.6em;font-weight:700;color:var(--a-brand);background:#fbe6dc;border-radius:50%;opacity:0;animation-name:frPfIni}
& .cam{position:absolute;right:-.2em;bottom:-.1em;width:1.5em;height:1.5em;border-radius:50%;background:var(--a-dark);color:#fff;display:grid;place-items:center;border:.14em solid var(--a-bg)}
& .cam .k-i{width:.75em;height:.75em}
& .lb{position:absolute;left:1.67em;font-size:.6em;font-weight:700;color:var(--a-mut)}
& .l1{top:16.2em}.t-first-run-profile-setup .l2{top:22em}
& .later{position:absolute;right:2.55em;top:24em;font-size:.55em;color:var(--a-mut)}
& .fd{position:absolute;left:1.4em;right:1.4em;height:2.3em;border:.07em solid #cfcfca;border-radius:.5em;display:flex;align-items:center;padding:0 .8em;background:#fff}
& .f1{top:10.5em}
& .f2{top:14em}
& .fd .phd,& .fd .ch{font-size:.74em}
& .fd .phd{position:absolute;left:1.08em}
& .f1 .phd{color:#a4a5a1;animation-name:frPfPh}
& .f1 .ch{position:absolute;opacity:0}
& .f2 .phd{color:#a4a5a1}
& .c1{left:1.08em;animation-name:frPfC1}.t-first-run-profile-setup .c2{left:2.08em;animation-name:frPfC2}.t-first-run-profile-setup .c3{left:3.08em;animation-name:frPfC3}
& .caret{position:absolute;left:.8em;top:50%;width:.07em;height:1.05em;margin-top:-.52em;background:var(--a-brand);opacity:0;animation-name:frPfCaret;animation-timing-function:steps(1,end)}
& .ring{position:absolute;inset:-.07em;border-radius:.5em;border:.12em solid var(--a-brand);opacity:0;animation-name:frPfRing}
& .go{position:absolute;left:1.94em;right:1.94em;bottom:2.27em;height:3.6em;border-radius:1.1em;background:#dcdcd8;color:#8d8e8a;display:grid;place-items:center;overflow:hidden;font-size:.72em;font-weight:700}
& .go i{position:absolute;inset:0;background:var(--a-brand);opacity:0;animation-name:frPfGo}
& .go span{position:relative;animation-name:frPfGoT}
& .tp1{animation-name:frPfTap1}.t-first-run-profile-setup .tp2{animation-name:frPfTap2}
@keyframes frPfSeg{0%,56%{transform:scaleX(0)}62%,92%{transform:scaleX(1)}96%,100%{transform:scaleX(0)}}
@keyframes frPfU{0%,35%{opacity:1}38%,92%{opacity:0}96%,100%{opacity:1}}
@keyframes frPfIni{0%,35%{opacity:0;transform:scale(.7)}39%,92%{opacity:1;transform:scale(1)}96%,100%{opacity:0;transform:scale(.7)}}
@keyframes frPfPh{0%,19%{opacity:1}20%,92%{opacity:0}96%,100%{opacity:1}}
${win('frPfC1', 21, 92)}
${win('frPfC2', 27, 92)}
${win('frPfC3', 33, 92)}
@keyframes frPfCaret{0%,13%{opacity:0;transform:translateX(0)}14%,23%{opacity:1;transform:translateX(0)}24%,29%{opacity:1;transform:translateX(.74em)}30%,35%{opacity:1;transform:translateX(1.48em)}36%,38%{opacity:1;transform:translateX(2.22em)}39%,100%{opacity:0;transform:translateX(2.22em)}}
@keyframes frPfRing{0%,12%{opacity:0}14%,40%{opacity:1}44%,100%{opacity:0}}
@keyframes frPfGo{0%,38%{opacity:0}42%,92%{opacity:1}96%,100%{opacity:0}}
@keyframes frPfGoT{0%,38%{color:#8d8e8a}42%,92%{color:#fff}96%,100%{color:#8d8e8a}}
${K.kf.tap('frPfTap1', 10)}
${K.kf.tap('frPfTap2', 50)}`),

      E('skeleton', `
& .sk{position:absolute;z-index:2;left:0;right:0;top:3.7em;height:11.5em;overflow:hidden;background:var(--a-bg);animation-name:frSkWrap}
& .s{height:2.3em;display:flex;align-items:center;gap:.6em;padding:0 1em;border-bottom:1px solid var(--a-line)}
& .s i{display:block;border-radius:.3em;background:#e4e4e0}
& .s .c{width:1em;height:1em;border-radius:50%}
& .s .l{height:.7em}
& .s .q{width:1.6em;height:.55em;margin-left:auto}
& .sh{position:absolute;top:0;bottom:0;left:0;width:6em;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.7),rgba(255,255,255,0));animation-name:frSkSh;animation-duration:1.4s;animation-timing-function:linear}
& .real{opacity:0;animation-name:frSkReal}
& .k-tb{z-index:5}
@keyframes frSkWrap{0%,54%{opacity:1}60%,92%{opacity:0}98%,100%{opacity:1}}
@keyframes frSkReal{0%,56%{opacity:0;transform:translateY(.3em)}64%,92%{opacity:1;transform:none}98%,100%{opacity:0;transform:none}}
@keyframes frSkSh{from{transform:translateX(-6em)}to{transform:translateX(16em)}}`),

      E('welcome', `
& .ic{position:absolute;left:5.2em;top:4.2em;width:5.6em;height:5.6em;border-radius:50%;background:#fbe6dc;color:var(--a-brand);display:grid;place-items:center;animation-name:frWcIc}
& .ic .k-i{width:2.8em;height:2.8em}
& .hi{position:absolute;left:0;right:0;top:11.8em;text-align:center;font-size:.95em;animation-name:frWcHi}
& .sb{position:absolute;left:3.1em;right:3.1em;top:19.7em;margin:0;text-align:center;font-size:.64em;color:var(--a-mut);line-height:1.5;animation-name:frWcSb}
& .cta{position:absolute;left:1.94em;right:1.94em;bottom:5.8em;height:3.9em;border-radius:1.1em;background:var(--a-brand);color:#fff;display:grid;place-items:center;font-size:.72em;font-weight:700;animation-name:frWcCta}
& .lt{position:absolute;left:0;right:0;bottom:3em;text-align:center;font-size:.6em;color:var(--a-mut);animation-name:frWcLt}
& .tp{animation-name:frWcTap}
${K.kf.fade('frWcIc', [[2, 10, 86, 94]], .8)}
${K.kf.fade('frWcHi', [[10, 18, 86, 94]], .8)}
${K.kf.fade('frWcSb', [[16, 24, 86, 94]], .8)}
${K.kf.fade('frWcCta', [[22, 30, 86, 94]], .8)}
${K.kf.fade('frWcLt', [[28, 36, 86, 94]], .8)}
${K.kf.tap('frWcTap', 62)}`)
    ].join('\n')
  });
})();
