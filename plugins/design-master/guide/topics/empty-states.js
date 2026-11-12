/* Topic: 빈 화면 (empty-states). Reference: plugins/design-master/references/empty-loading.md (section A)
   Every selector starts with .t-empty-states-<element>. Keyframe prefix: es. */
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
  const ids = ['first-use', 'no-results', 'no-filter-results', 'offline', 'permission', 'all-done', 'emptied', 'error', 'locked'];
  const each = (sel, body) => ids.map(i => `.t-empty-states-${i} ${sel}`).join(',') + `{${body}}`;
  // shared empty-state block: icon, one reason line, one action. tap=true puts a tap ring inside the button.
  const emp = (iconHtml, title, desc, btn, o = {}) =>
    `<div class="em${o.cls ? ' ' + o.cls : ''}"><span class="ei">${iconHtml}</span><b class="et">${title}</b><span class="ed">${desc}</span>` +
    `<span class="eb">${o.btnHtml || `<span>${btn}</span>`}${o.tap === false ? '' : '<i class="k-tap tpb"></i>'}</span>${o.extra || ''}</div>`;

  UIGuide.registerTopic({
    id: 'empty-states',
    intro: '보여 줄 내용이 없는 9가지 상황이에요. 이유가 다르면 문구와 행동도 달라야 해서, 모두 한 ‘빈 화면’으로 뭉치지 않습니다. 이유 한 줄과 다음 행동 하나가 기본이에요.',
    elements: [
      {
        id: 'first-use', ko: '첫 사용', en: 'First use', aka: ['처음', '빈 목록', 'zero data'],
        when: '가입 직후, 첫 프로젝트를 만들기 전처럼 데이터가 하나도 없는 처음의 화면',
        avoid: '빈 표를 그대로 보여 주는 것, 예시 데이터를 진짜 데이터처럼 섞는 것',
        notes: [
          '이 화면이 무엇을 위한 곳인지 한 문장, 첫 행동 버튼 하나(‘첫 항목 추가’)를 둬요.',
          '샘플을 채울 때는 샘플임을 표시하고 지우기 쉽게 해요.',
          '일러스트는 선택이에요. 작게 두고 설명을 가리지 않아요.'
        ],
        vs: { id: 'all-done', text: '모두 완료는 과거에 있던 것을 다 끝내서 비었고, 첫 사용은 한 번도 데이터가 없었던 상태예요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 1500,
          phases: [['빈 화면', 0, 3000], ['첫 항목', 3200, 4500]],
          alt: '앱을 처음 열어 목록이 비어 있고 아직 담은 게 없어요라는 설명과 첫 항목 추가 버튼만 보이다가, 버튼을 누르면 첫 항목 우유가 목록에 나타나는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more']) +
            '<div class="one">' + K.app.row(0) + '</div>' +
            emp(K.icon('list'), '아직 담은 게 없어요', '장 볼 것을 하나씩 추가해 보세요', '첫 항목 추가')
        }
      },
      {
        id: 'no-results', ko: '검색 결과 없음', en: 'No search results', aka: ['검색 0건', 'no results'],
        when: '검색한 뒤 결과가 0건일 때',
        avoid: '검색창을 없애거나 막다른 길로 두는 것, 입력한 검색어를 보여 주지 않는 것',
        notes: [
          '입력한 검색어를 문구에 보여 줘요. 오타 확인, 더 짧은 검색어, 추천 같은 다음 길을 제시해요.',
          '검색창은 그대로 둬서 바로 고쳐 검색할 수 있게 해요.',
          '행동 버튼은 하나만 둬요(‘전체 목록 보기’).'
        ],
        vs: { id: 'no-filter-results', text: '필터 결과 없음은 검색어가 아니라 걸어 둔 조건이 문제라서 필터를 풀어 주는 행동이 나와요.' },
        demo: {
          frame: 'phone', cycle: 5500, still: 3000,
          phases: [['입력', 450, 800], ['검색 결과 없음', 1760, 4950]],
          alt: '검색창에 두부김치를 입력하면 목록이 사라지고 검색창은 그대로 남은 채 두부김치 결과가 없어요라는 문구와 전체 목록 보기 버튼이 나타나는 시연',
          html: K => K.app.status() +
            `<div class="sbar"><span class="sf">${K.icon('search')}<span class="q"><i class="p">항목 검색</i><i class="v">두부김치</i></span></span></div>` +
            K.app.list(0, 5, { cls: 'rows' }) +
            emp(K.icon('search'), '‘두부김치’ 결과가 없어요', '철자를 확인하거나 더 짧게 검색해 보세요', '전체 목록 보기', { tap: false }) + K.tap(8, 2.5, 'tp')
        }
      },
      {
        id: 'no-filter-results', ko: '필터 결과 없음', en: 'No filter results', aka: ['필터 0건', 'empty filter'],
        when: '필터를 걸어 결과가 0건일 때',
        avoid: '적용된 필터를 보여 주지 않아 왜 비었는지 모르게 하는 것',
        notes: [
          '적용된 필터를 화면에 보여 주고 ‘필터 초기화’ 버튼을 바로 둬요.',
          '원인이 되는 필터를 하나씩 해제할 수 있게 하면 더 좋아요.',
          '필터를 푸는 즉시 목록이 돌아와야 해요.'
        ],
        vs: { id: 'no-results', text: '검색 결과 없음은 입력한 검색어가 문제이고, 필터 결과 없음은 걸어 둔 조건의 조합이 문제예요.' },
        demo: {
          frame: 'phone', cycle: 5500, still: 2500,
          phases: [['필터 적용', 440, 880], ['결과 없음', 1540, 3410], ['초기화', 3080, 3700]],
          alt: '필터 아이콘으로 유제품과 1,000원 이하 조건을 걸자 목록이 사라지고 걸린 조건 칩이 위에 보이는 채 필터 초기화 버튼이 나타나며, 버튼을 누르면 칩이 사라지고 목록이 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['filter', 'more']) +
            `<div class="fbar"><span class="all">전체 항목 4개</span><span class="chips"><i>유제품 ${K.icon('x')}</i><i>1,000원 이하 ${K.icon('x')}</i></span></div>` +
            K.app.list(0, 4, { cls: 'rows' }) +
            emp(K.icon('filter'), '조건에 맞는 항목이 없어요', '적용한 필터를 바꾸거나 초기화해 보세요', '필터 초기화') + K.tap(12.7, 2.5, 'tp')
        }
      },
      {
        id: 'offline', ko: '오프라인', en: 'Offline', aka: ['연결 없음', '네트워크 끊김', 'no connection'],
        when: '네트워크가 없어 내용을 불러올 수 없을 때(연결 끊김을 감지했을 때)',
        avoid: '이전에 받은 내용이 있는데 전체 화면을 가리는 것(내용은 보여 주고 배너로 알려요)',
        notes: [
          '받아 둔 내용이 있으면 가리지 말고 보여 주고 위쪽 배너로 알려요. 없을 때만 전체 빈 화면을 써요.',
          '‘다시 시도’ 버튼을 두고, 연결이 돌아오면 자동으로 다시 불러와요.',
          '저장 대기 중인 작업이 있으면 함께 알려요.'
        ],
        vs: { id: 'error', text: '오류 화면은 서버나 코드 쪽 문제이고, 오프라인은 사용자 쪽 연결 문제라서 연결이 돌아오면 저절로 풀려요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 1800,
          phases: [['연결 없음', 0, 2400], ['연결 복구', 2520, 3120], ['다시 불러옴', 3480, 5400]],
          alt: '인터넷 끊김 아이콘과 연결되면 자동으로 다시 불러와요 문구가 보이다가, 연결이 돌아오자 아이콘이 연결됨으로 바뀌고 저절로 목록이 나타나는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more']) + K.app.list(0, 5, { cls: 'rows' }) +
            emp(`<i class="w0">${K.icon('wifiOff')}</i><i class="w1">${K.icon('wifi')}</i>`, '인터넷에 연결되지 않았어요',
              '<span class="d0">연결되면 자동으로 다시 불러와요. 저장 대기 1건</span><span class="d1">연결됐어요. 다시 불러오고 있어요</span>', '다시 시도', { tap: false })
        }
      },
      {
        id: 'permission', ko: '권한 필요', en: 'Permission needed', aka: ['권한 거부', '카메라 권한', 'permission denied'],
        when: '카메라, 위치, 알림 같은 시스템 권한이 없어 기능을 쓸 수 없을 때',
        avoid: '왜 필요한지 말하지 않고 바로 시스템 요청을 띄우는 것, 권한 없이 쓸 수 있는 대안을 숨기는 것',
        notes: [
          '왜 필요한지 한 문장과 ‘권한 허용’ 버튼을 둬요. 시스템 요청이 가능하면 요청하고, 이미 영구 거부면 설정 앱으로 안내해요.',
          '권한 없이 쓸 수 있는 대안(‘직접 입력할게요’)이 있으면 같이 보여 줘요.',
          '요청 전 사전 설명은 앱 첫 화면의 권한 요청과 같은 방식이에요.'
        ],
        vs: { id: 'locked', text: '잠김은 기기 권한이 아니라 로그인, 구독 같은 자격이나 결제 조건 때문에 볼 수 없는 상태예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 600,
          phases: [['설명', 0, 1000], ['시스템 요청', 1200, 2400], ['카메라 켜짐', 2880, 5400]],
          alt: '카메라 권한이 필요해요 설명과 권한 허용 버튼, 직접 입력 대안이 보이다가, 버튼을 누르면 시스템 허용 창이 뜨고 허용을 누르면 바코드 스캔 화면이 열려 빨간 선이 위아래로 훑는 시연',
          html: K => K.app.status() + K.app.bar('바코드 스캔', [], { back: true }) +
            emp(K.icon('camera'), '카메라 권한이 필요해요', '바코드를 읽으려면 카메라를 써야 해요', '권한 허용', { extra: '<span class="alt">직접 입력할게요</span>' }) +
            '<div class="vf"><i class="cn c1"></i><i class="cn c2"></i><i class="cn c3"></i><i class="cn c4"></i><i class="sl"></i></div><div class="vl">바코드를 사각형 안에 맞춰 주세요</div>' +
            K.scrim('sc') + '<div class="sd"><b>카메라를 사용할까요?</b><span>바코드를 읽는 데만 써요</span><div class="sdb"><i>허용 안 함</i><i class="al">허용</i></div></div>' + K.tap(10.9, 12.9, 'tp2')
        }
      },
      {
        id: 'all-done', ko: '모두 완료', en: 'All caught up', aka: ['다 했어요', 'inbox zero', '할 일 끝'],
        when: '알림을 다 읽었거나 할 일을 모두 끝내 목록이 비어 있는 긍정적인 상태',
        avoid: '과한 축하 연출을 반복 방문마다 보여 주는 것(피로해요)',
        notes: [
          '짧게 칭찬하고 끝내요. 다음에 할 만한 것을 한 가지 제안해도 좋아요.',
          '완료 연출은 크게 하지 않아요. 큰 연출은 완료 표시에서 다뤄요.',
          '원인이 사용자의 행동이라서 문구 분위기가 첫 사용과 달라야 해요.'
        ],
        vs: { id: 'first-use', text: '첫 사용은 시작하기 전의 빈 상태이고, 모두 완료는 끝낸 뒤의 빈 상태라 문구가 칭찬이에요.' },
        demo: {
          frame: 'phone', cycle: 5500, still: 3000,
          phases: [['체크', 440, 660], ['정리', 1540, 1870], ['빈 화면', 1980, 4950]],
          alt: '남은 마지막 항목 대파를 체크하자 세 줄이 모두 사라지고, 모두 담았어요라는 짧은 칭찬과 다음 장보기 목록 만들기 제안이 나타나는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more']) + K.app.list(0, 3, { cls: 'rows', checked: [0, 1] }) +
            emp(K.icon('checkCircle'), '모두 담았어요', '오늘은 더 살 게 없어요. 다음 장보기 목록을 미리 만들어 둘까요?', '다음 목록 만들기') + K.tap(1.5, 9.45, 'tp')
        }
      },
      {
        id: 'emptied', ko: '삭제 직후', en: 'Emptied', aka: ['모두 삭제', '방금 비움', 'cleared'],
        when: '사용자가 마지막 항목을 지워 목록이 방금 비게 된 순간',
        avoid: '사라진 순간 레이아웃이 갑자기 바뀌는 것, 첫 사용과 같은 문구를 쓰는 것',
        notes: [
          '레이아웃이 갑자기 튀지 않게 부드럽게 전환해요.',
          '되돌리기를 스낵바로 제공해요. 문구는 ‘모두 지웠어요’처럼 상황에 맞춰요.',
          '되돌리면 지운 항목이 제자리로 돌아와야 해요.'
        ],
        vs: { id: 'first-use', text: '첫 사용은 한 번도 데이터가 없었던 화면이고, 삭제 직후는 방금까지 있었던 것을 지운 화면이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2760,
          phases: [['삭제', 360, 1020], ['빈 화면', 1320, 3720], ['되돌림', 3480, 4200]],
          alt: '마지막 남은 두부를 밀어서 지우자 항목이 사라지고 모두 지웠어요 문구가 부드럽게 나타나며 아래에 되돌리기 스낵바가 뜨고, 되돌리기를 누르자 두부가 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more']) +
            `<div class="k-ls"><div class="del">${K.icon('trash')}</div>${K.app.row(2)}</div>` +
            emp(K.icon('trash'), '모두 지웠어요', '새 항목을 추가하거나 되돌릴 수 있어요', '항목 추가', { tap: false }) +
            '<div class="snk"><span>두부를 삭제했어요</span><b>되돌리기</b></div>' +
            K.finger(12, 4.85, 'fg') + K.tap(12.9, 19.23, 'tp')
        }
      },
      {
        id: 'error', ko: '오류 화면', en: 'Error state', aka: ['서버 오류', '문제가 생겼어요', 'something went wrong'],
        when: '요청 실패나 예기치 않은 예외로 내용을 보여 줄 수 없을 때',
        avoid: '사용자 탓으로 쓰는 문구, 기술 용어 그대로의 메시지',
        notes: [
          '무슨 일이 일어났는지 쉬운 말과 재시도 버튼, 계속 안 되면 문의 방법을 둬요.',
          '기술 메시지는 접어 두거나 복사할 수 있게 둬요.',
          '부분 실패는 화면 전체가 아니라 해당 영역만 오류로 바꿔요.'
        ],
        vs: { id: 'offline', text: '오프라인은 사용자 쪽 연결 문제라 자동으로 풀리고, 오류 화면은 서버 쪽 문제라 다시 시도를 눌러야 해요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 1680,
          phases: [['오류', 0, 2400], ['재시도', 2400, 3360], ['다시 불러옴', 3600, 5520]],
          alt: '문제가 생겼어요 문구와 오류 코드, 다시 시도 버튼이 보이다가, 버튼을 누르면 불러오는 중으로 바뀌고 잠시 뒤 목록이 나타나는 시연',
          html: K => K.app.status() + K.app.bar('이번 주 장보기', ['share', 'more']) + K.app.list(0, 5, { cls: 'rows' }) +
            emp(K.icon('alert'), '문제가 생겼어요', '잠시 후 다시 시도해 주세요. 계속되면 문의해 주세요', '', {
              btnHtml: '<span class="b0">다시 시도</span><span class="b1"><i class="mini"></i>불러오는 중</span>',
              extra: `<span class="code">오류 코드 503 ${K.icon('copy')}</span>`
            })
        }
      },
      {
        id: 'locked', ko: '잠김', en: 'Locked content', aka: ['로그인 필요', '멤버 전용', '유료 기능'],
        when: '로그인, 구독, 승급 같은 조건 없이는 볼 수 없는 내용이 있을 때',
        avoid: '내용을 숨기기만 하는 것(기능이 있다는 것조차 모르게 돼요)',
        notes: [
          '무엇이 잠겼는지 보이게 해요(흐린 미리보기). 풀리는 조건과 행동을 분명히 적어요.',
          '행동 버튼은 ‘로그인’, ‘업그레이드’처럼 하나로 둬요.',
          '조건을 채우면 바로 내용이 열려야 해요.'
        ],
        vs: { id: 'permission', text: '권한 필요는 카메라, 위치 같은 기기 권한이 없는 상태이고, 잠김은 자격이나 결제 조건이 안 맞는 상태예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2580,
          phases: [['잠김', 1080, 3720], ['풀림', 3360, 4320]],
          alt: '가족 탭을 누르자 목록이 흐려지고 위에 자물쇠와 로그인하면 볼 수 있어요 카드가 나타나며, 로그인 버튼을 누르면 흐림이 걷히고 목록이 선명하게 열리는 시연',
          html: K => K.app.status() + K.app.bar('장보기', ['more']) + K.app.list(0, 5, { cls: 'rows' }) + K.app.tabs(0) +
            `<div class="lk"><span class="ei">${K.icon('lock')}</span><b class="et">로그인하면 볼 수 있어요</b><span class="ed">가족 3명과 목록을 함께 보고 고칠 수 있어요</span><span class="eb"><span>로그인</span><i class="k-tap tpb"></i></span></div>` +
            K.tap(8, 19.9, 'tp')
        }
      }
    ],
    css: K => `
/* shared empty block */
${each('.em', 'position:absolute;z-index:4;left:0;right:0;top:5.6em;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 1.4em;opacity:0')}
${each('.ei', 'position:relative;width:4em;height:4em;border-radius:50%;background:var(--a-soft);display:grid;place-items:center;color:var(--a-mut)')}
${each('.ei .k-i', 'width:1.7em;height:1.7em')}
${each('.et', 'margin-top:.9em;font-size:.86em;line-height:1.3')}
${each('.ed', 'margin-top:.5em;font-size:.64em;line-height:1.5;color:var(--a-mut);max-width:20em')}
${each('.eb', 'position:relative;margin-top:1.2em;height:2.4em;padding:0 1.3em;border-radius:.75em;background:var(--a-brand);color:#fff;display:grid;place-items:center')}
${each('.eb>span', 'font-size:.72em;font-weight:700')}
${each('.eb .k-tap', 'left:50%;top:50%;margin:-.7em 0 0 -.7em;width:1.4em;height:1.4em')}
${each('.mini', 'display:block;width:1em;height:1em;border-radius:50%;border:.16em solid rgba(255,255,255,.4);border-top-color:#fff;animation-name:esSpin;animation-duration:.8s;animation-timing-function:linear')}
@keyframes esSpin{to{transform:rotate(360deg)}}

/* first use */
.t-empty-states-first-use .em{animation-name:esFuEm}
.t-empty-states-first-use .one{position:absolute;left:0;right:0;top:3.7em;opacity:0;animation-name:esFuRow}
.t-empty-states-first-use .tpb{animation-name:esFuTap}
${vis('esFuEm', [[0, 62], [96, 100]])}
@keyframes esFuRow{0%,64%{opacity:0;transform:translateY(.8em)}68%,92%{opacity:1;transform:none}96%,100%{opacity:0;transform:none}}
${K.kf.tap('esFuTap', 56)}

/* no results */
.t-empty-states-no-results .sbar{position:absolute;z-index:3;left:0;right:0;top:1.3em;height:2.4em;background:var(--a-bg);border-bottom:1px solid var(--a-line)}
.t-empty-states-no-results .sf{position:absolute;left:1em;right:1em;top:.4em;height:1.6em;border-radius:1em;background:var(--a-soft);display:flex;align-items:center;gap:.45em;padding:0 .8em}
.t-empty-states-no-results .sf .k-i{width:.95em;height:.95em;color:var(--a-mut)}
.t-empty-states-no-results .q{position:relative;flex:1;height:1em}
.t-empty-states-no-results .q i{position:absolute;left:0;top:0;font-style:normal;font-size:.7em;line-height:1.45;white-space:nowrap}
.t-empty-states-no-results .p{color:var(--a-mut);animation-name:esNrP}
.t-empty-states-no-results .v{opacity:0;animation-name:esNrV}
.t-empty-states-no-results .rows{position:absolute;left:0;right:0;top:3.7em;animation-name:esNrRows}
.t-empty-states-no-results .em{animation-name:esNrEm}
.t-empty-states-no-results .tp{animation-name:esNrTap}
${vis('esNrP', [[0, 12], [94, 100]])}${vis('esNrV', [[14, 92]])}${vis('esNrRows', [[0, 24], [94, 100]])}${vis('esNrEm', [[32, 90]])}
${K.kf.tap('esNrTap', 8)}

/* no filter results */
.t-empty-states-no-filter-results .fbar{position:absolute;z-index:3;left:0;right:0;top:3.7em;height:2.3em;background:var(--a-bg);border-bottom:1px solid var(--a-line)}
.t-empty-states-no-filter-results .all{position:absolute;left:1.2em;top:0;height:2.3em;display:flex;align-items:center;font-size:.62em;color:var(--a-mut);opacity:0;animation-name:esNfAll}
.t-empty-states-no-filter-results .chips{position:absolute;left:1em;top:0;height:2.3em;display:flex;align-items:center;gap:.45em;opacity:0;animation-name:esNfChips}
.t-empty-states-no-filter-results .chips i{display:inline-flex;align-items:center;gap:.3em;height:1.6em;padding:0 .6em 0 .75em;border-radius:.8em;background:var(--a-dark);color:#fff;font-style:normal;font-size:.62em;font-weight:700}
.t-empty-states-no-filter-results .chips .k-i{width:.95em;height:.95em;stroke-width:3}
.t-empty-states-no-filter-results .rows{position:absolute;left:0;right:0;top:6em;animation-name:esNfRows}
.t-empty-states-no-filter-results .em{top:7.6em;animation-name:esNfEm}
.t-empty-states-no-filter-results .tp{animation-name:esNfTap1}
.t-empty-states-no-filter-results .tpb{animation-name:esNfTap2}
${vis('esNfAll', [[0, 16], [64, 100]])}${vis('esNfChips', [[16, 62]])}${vis('esNfRows', [[0, 22], [68, 100]])}${vis('esNfEm', [[28, 62]])}
${K.kf.tap('esNfTap1', 8)}
${K.kf.tap('esNfTap2', 56)}

/* offline */
.t-empty-states-offline .rows{position:absolute;left:0;right:0;top:3.7em;opacity:0;animation-name:esOfRows}
.t-empty-states-offline .em{animation-name:esOfEm}
.t-empty-states-offline .ei i{position:absolute;inset:0;display:grid;place-items:center}
.t-empty-states-offline .w0{animation-name:esOfW0}
.t-empty-states-offline .w1{color:var(--a-ok);opacity:0;animation-name:esOfW1}
.t-empty-states-offline .ed{position:relative;width:20em;height:3.2em}
.t-empty-states-offline .ed span{position:absolute;left:0;right:0;top:0}
.t-empty-states-offline .d1{opacity:0;animation-name:esOfD1}
.t-empty-states-offline .d0{animation-name:esOfD0}
${vis('esOfRows', [[58, 90]])}${vis('esOfEm', [[0, 52], [96, 100]])}${vis('esOfW0', [[0, 40], [96, 100]])}${vis('esOfW1', [[42, 52]])}${vis('esOfD0', [[0, 40], [96, 100]])}${vis('esOfD1', [[42, 52]])}

/* permission */
.t-empty-states-permission .em{top:5.8em;animation-name:esPmEm}
.t-empty-states-permission .alt{margin-top:1em;font-size:.64em;color:var(--a-mut);text-decoration:underline}
.t-empty-states-permission .tpb{animation-name:esPmTap1}
.t-empty-states-permission .sc{animation-name:esPmSc}
.t-empty-states-permission .sd{position:absolute;z-index:12;left:2.2em;right:2.2em;top:8em;height:6em;padding-top:1.1em;border-radius:.9em;background:#fff;text-align:center;opacity:0;animation-name:esPmSd}
.t-empty-states-permission .sd b{display:block;font-size:.78em}
.t-empty-states-permission .sd span{display:block;margin-top:.4em;font-size:.6em;color:var(--a-mut)}
.t-empty-states-permission .sdb{position:absolute;left:0;right:0;bottom:0;height:2.2em;display:flex;border-top:1px solid var(--a-line)}
.t-empty-states-permission .sdb i{flex:1;display:grid;place-items:center;font-style:normal;font-size:.7em;color:var(--a-mut)}
.t-empty-states-permission .sdb .al{border-left:1px solid var(--a-line);color:var(--a-brand);font-weight:700}
.t-empty-states-permission .tp2{animation-name:esPmTap2}
.t-empty-states-permission .vf{position:absolute;z-index:3;left:1.2em;right:1.2em;top:5.2em;height:11.2em;border-radius:.8em;background:#26282b;overflow:hidden;opacity:0;animation-name:esPmVf}
.t-empty-states-permission .cn{position:absolute;width:1.6em;height:1.6em;border:.2em solid #fff;opacity:.9}
.t-empty-states-permission .c1{left:1.6em;top:1.6em;border-right:0;border-bottom:0;border-radius:.5em 0 0 0}
.t-empty-states-permission .c2{right:1.6em;top:1.6em;border-left:0;border-bottom:0;border-radius:0 .5em 0 0}
.t-empty-states-permission .c3{left:1.6em;bottom:1.6em;border-right:0;border-top:0;border-radius:0 0 0 .5em}
.t-empty-states-permission .c4{right:1.6em;bottom:1.6em;border-left:0;border-top:0;border-radius:0 0 .5em 0}
.t-empty-states-permission .sl{position:absolute;left:2.2em;right:2.2em;top:2em;height:.16em;background:var(--a-brand);animation-name:esPmScan;animation-duration:1.6s;animation-timing-function:ease-in-out}
.t-empty-states-permission .vl{position:absolute;left:0;right:0;top:17.4em;text-align:center;font-size:.62em;color:var(--a-mut);opacity:0;animation-name:esPmVl}
${vis('esPmEm', [[0, 42], [97, 100]])}${vis('esPmVf', [[48, 90]])}${vis('esPmVl', [[48, 90]])}${vis('esPmSd', [[20, 40]])}
@keyframes esPmSc{0%,18%{opacity:0}22%,38%{opacity:1}42%,100%{opacity:0}}
@keyframes esPmScan{0%,100%{transform:translateY(0)}50%{transform:translateY(7em)}}
${K.kf.tap('esPmTap1', 16)}
${K.kf.tap('esPmTap2', 36)}

/* all done */
.t-empty-states-all-done .rows{position:absolute;left:0;right:0;top:3.7em;animation-name:esAdRows}
.t-empty-states-all-done .k-r3 .k-ck{animation-name:esAdCk}
.t-empty-states-all-done .em{animation-name:esAdEm}
.t-empty-states-all-done .ei{color:var(--a-ok);background:#dcf1e3;animation-name:esAdPop}
.t-empty-states-all-done .tpb{animation-name:esAdTap1}
.t-empty-states-all-done .tp{animation-name:esAdTap}
${vis('esAdRows', [[0, 28], [96, 100]])}${vis('esAdEm', [[36, 90]])}
@keyframes esAdCk{0%,9%{opacity:0;transform:scale(.4)}12%,90%{opacity:1;transform:scale(1)}93%,100%{opacity:0;transform:scale(1)}}
@keyframes esAdPop{0%,35%{transform:scale(.6)}42%{transform:scale(1.14)}48%,100%{transform:scale(1)}}
${K.kf.tap('esAdTap', 8)}

/* emptied */
.t-empty-states-emptied .del{position:absolute;z-index:0;left:0;right:0;top:0;height:2.3em;background:var(--a-err);color:#fff;display:flex;align-items:center;justify-content:flex-end;padding-right:1.1em;opacity:0;animation-name:esEmDel}
.t-empty-states-emptied .k-r3{animation-name:esEmRow}
.t-empty-states-emptied .em{animation-name:esEmEm}
.t-empty-states-emptied .snk{position:absolute;z-index:12;left:.7em;right:.7em;bottom:.8em;height:2.6em;display:flex;align-items:center;justify-content:space-between;padding:0 .9em;border-radius:.45em;background:var(--a-dark);color:#f3f3f1;transform:translateY(3.6em);animation-name:esEmSnk;box-shadow:0 .4em 1em rgba(20,20,22,.2)}
.t-empty-states-emptied .snk span{font-size:.68em}
.t-empty-states-emptied .snk b{font-size:.68em;color:#ffb48f}
.t-empty-states-emptied .fg{animation-name:esEmDrag}
.t-empty-states-emptied .tp{animation-name:esEmTap}
${vis('esEmEm', [[22, 62]])}
@keyframes esEmDel{0%,7%{opacity:0}9%,17%{opacity:1}22%,100%{opacity:0}}
@keyframes esEmRow{0%,8%{transform:translateX(0);opacity:1}17%,64%{transform:translateX(-105%);opacity:0}72%,100%{transform:translateX(0);opacity:1}}
@keyframes esEmSnk{0%,18%{transform:translateY(3.6em)}24%,62%{transform:translateY(0)}68%,100%{transform:translateY(3.6em)}}
${K.kf.drag('esEmDrag', 6, 15, -7, 0)}
${K.kf.tap('esEmTap', 58)}

/* error */
.t-empty-states-error .rows{position:absolute;left:0;right:0;top:3.7em;opacity:0;animation-name:esErRows}
.t-empty-states-error .em{animation-name:esErEm}
.t-empty-states-error .ei{background:#fbe3e1;color:var(--a-err)}
.t-empty-states-error .eb>span{grid-area:1/1;display:flex;align-items:center;gap:.5em}
.t-empty-states-error .b0{animation-name:esErB0}
.t-empty-states-error .b1{opacity:0;animation-name:esErB1}
.t-empty-states-error .code{display:flex;align-items:center;gap:.3em;margin-top:1.2em;font-size:.58em;color:var(--a-mut)}
.t-empty-states-error .code .k-i{width:1.1em;height:1.1em}
.t-empty-states-error .tpb{animation-name:esErTap}
${vis('esErRows', [[60, 92]])}${vis('esErEm', [[0, 56], [97, 100]])}${vis('esErB0', [[0, 42], [96, 100]])}${vis('esErB1', [[44, 56]])}
${K.kf.tap('esErTap', 40)}

/* locked */
.t-empty-states-locked .rows{animation-name:esLkRows}
.t-empty-states-locked .lk{position:absolute;z-index:6;left:1.6em;right:1.6em;top:6.2em;padding:1.1em 1em 1.2em;display:flex;flex-direction:column;align-items:center;text-align:center;border-radius:.8em;background:#fff;box-shadow:0 .8em 2em rgba(10,10,12,.2);opacity:0;animation-name:esLkCard}
.t-empty-states-locked .lk .ei{width:3.2em;height:3.2em}
.t-empty-states-locked .lk .ei .k-i{width:1.4em;height:1.4em}
.t-empty-states-locked .k-tab-0{animation-name:esLkT0}
.t-empty-states-locked .k-tab-1{animation-name:esLkT1}
.t-empty-states-locked .tp{animation-name:esLkTap1}
.t-empty-states-locked .tpb{animation-name:esLkTap2}
@keyframes esLkRows{0%,12%{filter:none;opacity:1}18%,62%{filter:blur(.3em);opacity:.55}68%,100%{filter:none;opacity:1}}
@keyframes esLkCard{0%,16%{opacity:0;transform:translateY(.5em)}22%,62%{opacity:1;transform:none}68%,100%{opacity:0;transform:none}}
@keyframes esLkT0{0%,9%{color:var(--a-ink)}12%,92%{color:var(--a-mut)}97%,100%{color:var(--a-ink)}}
@keyframes esLkT1{0%,9%{color:var(--a-mut)}12%,92%{color:var(--a-ink)}97%,100%{color:var(--a-mut)}}
${K.kf.tap('esLkTap1', 8)}
${K.kf.tap('esLkTap2', 56)}
`
  });
})();
