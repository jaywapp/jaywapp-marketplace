/* Topic: 공유 (sharing). Reference: plugins/design-master/references/ratings-share.md (section B)
   Every selector starts with .t-sharing-<element>. Keyframe names start with "sh".
   Positioned boxes never set their own font-size, so em offsets are screen em.
   Share icons are generic shapes from the kit (K.icon share / shareAndroid / forward / send / repost / qr), no brand marks. */
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
  const rise = (name, a, b, c, d, dy) => kfs(name, [[[0, a], `opacity:0;transform:translateY(${dy}em)`], [b, 'opacity:1;transform:none'], [c, 'opacity:1;transform:none'], [[d, 100], `opacity:0;transform:translateY(${dy}em)`]]);

  const T = id => `.t-sharing-${id}`;
  const osTag = label => `<span class="os">${label}</span>`;

  /* shared bits: OS pill, bottom sheet items, preview row */
  const common = id => `
${T(id)} .os{position:absolute;z-index:6;left:50%;top:.27em;transform:translateX(-50%);padding:.25em .8em;border-radius:2em;background:var(--a-dark);color:#fff;font-size:.55em;font-weight:700;white-space:nowrap}
${T(id)} .th{flex:none;width:2.2em;height:2.2em;border-radius:.5em;background:#e9d7b5}
${T(id)} .pv b{display:block;font-size:.76em}
${T(id)} .pv em{display:block;font-style:normal;font-size:.58em;color:var(--a-mut)}
${T(id)} .it{display:flex;flex-direction:column;align-items:center;gap:.25em}
${T(id)} .it .ic{display:grid;place-items:center;width:2.3em;height:2.3em;border-radius:50%}
${T(id)} .it .ic .k-i{width:1.1em;height:1.1em}
${T(id)} .it em{font-style:normal;font-size:.52em;white-space:nowrap}
${T(id)} .c1{background:#e3efe3}${T(id)} .c2{background:#f6ebc9}${T(id)} .c3{background:#e0e8f6}${T(id)} .c4{background:#f1e0ea}
`;
  const item = (K, [g, l, c]) => `<span class="it"><i class="ic c${c}">${K.icon(g)}</i><em>${l}</em></span>`;
  const APPS = [['send', '메시지', 1], ['note', '메모', 2], ['users', '가족', 3], ['image', '저장', 4]];
  const GRID = [['send', '메시지', 1], ['note', '메모', 2], ['users', '가족', 3], ['image', '저장', 4], ['copy', '링크 복사', 1], ['forward', '전달', 2], ['bookmark', '즐겨찾기', 3], ['wifi', '근처 공유', 4]];

  /* QR drawn from a fixed pseudo-random pattern, not a real code */
  function qrSvg() {
    const N = 21, Q = 4;
    let seed = 7;
    const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return (seed >>> 16) & 1; };
    const finder = (x, y) => { for (const [ox, oy] of [[0, 0], [N - 7, 0], [0, N - 7]]) { const lx = x - ox, ly = y - oy; if (lx >= 0 && lx < 7 && ly >= 0 && ly < 7) return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4) ? 1 : 0; } return null; };
    const zone = (x, y) => [[0, 0], [N - 8, 0], [0, N - 8]].some(([ox, oy]) => x >= ox && x < ox + 8 && y >= oy && y < oy + 8);
    let d = '';
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const fd = finder(x, y);
      const on = fd !== null ? fd === 1 : (zone(x, y) ? false : rnd() === 1);
      if (on) d += `M${x + Q} ${y + Q}h1v1h-1z`;
    }
    const S = N + Q * 2;
    return `<svg viewBox="0 0 ${S} ${S}" aria-hidden="true"><rect width="${S}" height="${S}" fill="#fff"/><path d="${d}" fill="#1d1e20"/></svg>`;
  }

  UIGuide.registerTopic({
    id: 'sharing',
    intro: '내용을 다른 곳으로 보내는 요소예요. 플랫폼마다 아이콘이 다르니 사용자가 익숙한 모양을 따르고, 아이콘만 쓸 때는 aria-label="공유"를 붙여요.',
    elements: [
      {
        id: 'ios-share', ko: 'iOS 공유', en: 'Share on iOS', aka: ['아이폰 공유', '공유 아이콘', 'share icon', '상자 화살표'],
        when: 'iOS 앱과 iOS Safari에서 공유할 때',
        avoid: '안드로이드 사용자에게 iOS 아이콘만 보여 주는 것(기기에 맞추거나 ‘공유’ 문구를 함께 써요)',
        notes: [
          '상자에서 위로 나가는 화살표 모양 아이콘을 쓰고, 터치 영역은 44px예요.',
          '네이티브 공유 시트를 호출하면 앱 목록과 복사 같은 동작이 자동으로 제공돼요.',
          '공유할 제목, 설명, 링크, 이미지를 미리 준비해 둬요. 웹은 navigator.share를 우선 쓰고 미지원이면 링크 복사로 대체해요.'
        ],
        vs: { id: 'android-share', text: '안드로이드 공유는 점 세 개가 선으로 이어진 다른 아이콘이에요. 하는 일은 같고 모양만 플랫폼을 따라요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['아이콘 누름', 450, 900], ['공유 시트', 1300, 3700], ['복사 확인', 3000, 3900], ['닫힘', 3700, 4200]],
          alt: '앱 바에서 상자에 위쪽 화살표가 있는 iOS 공유 아이콘을 누르면 아래에서 공유 시트가 올라와 앱 목록과 링크 복사가 보이고, 링크 복사를 누르면 복사했어요로 바뀐 뒤 시트가 내려가는 시연',
          html: K => K.app.screen({ icons: ['share', 'more'] }) + osTag('iOS') + K.scrim('sc') +
            `<div class="sh"><div class="pv"><i class="th"></i><div><b>이번 주 장보기</b><em>jangbom.example</em></div><span class="cl">${K.icon('x')}</span></div>` +
            `<div class="ap">${APPS.map(a => item(K, a)).join('')}</div>` +
            `<div class="ac"><div class="a1"><span class="t0">링크 복사</span><span class="t1">${K.icon('check')}복사했어요</span><span class="ico">${K.icon('copy')}</span></div><div class="a2"><span>즐겨찾기 추가</span><span class="ico">${K.icon('bookmark')}</span></div></div></div>` +
            K.tap(12.7, 2.5, 'tp1') + K.tap(8, 17.66, 'tp2')
        }
      },
      {
        id: 'android-share', ko: '안드로이드 공유', en: 'Share on Android', aka: ['안드로이드 공유 아이콘', '점 세 개 공유', 'material share'],
        when: '안드로이드 앱이나 머티리얼 디자인을 따르는 화면에서 공유할 때',
        avoid: '웹에서 플랫폼을 구분하지 않고 한 가지 아이콘만 쓰는 것(기기에 맞추거나 중립적인 ‘공유’ 문구와 함께 써요)',
        notes: [
          '점 세 개가 선으로 연결된 모양의 아이콘을 쓰고, 안드로이드의 공유 인텐트(시스템 공유 시트)를 호출해요.',
          '웹에서 두 아이콘 중 하나를 골라야 하면 기기 플랫폼을 감지해 맞춰요.',
          '아이콘만 쓸 때는 aria-label="공유"를 붙이고 터치 영역은 44px 이상으로 해요.'
        ],
        vs: { id: 'ios-share', text: 'iOS 공유는 상자에서 위로 나가는 화살표 아이콘이에요. 안드로이드는 이어진 점 세 개이고 시트도 격자로 보여요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['아이콘 누름', 450, 900], ['공유 시트', 1300, 3500], ['앱 선택', 2650, 3100], ['닫힘', 3500, 3900]],
          alt: '앱 바에서 점 세 개가 선으로 이어진 안드로이드 공유 아이콘을 누르면 아래에서 격자 모양 공유 시트가 올라오고, 가족 앱을 누르면 선택 표시가 생긴 뒤 시트가 내려가는 시연',
          html: K => K.app.screen({ icons: ['shareAndroid', 'more'] }) + osTag('안드로이드') + K.scrim('sc') +
            `<div class="sh"><i class="grab"></i><div class="hd"><b>공유</b></div><div class="pv"><i class="th"></i><div><b>이번 주 장보기</b><em>jangbom.example</em></div></div>` +
            `<div class="gd">${GRID.map(a => item(K, a)).join('')}</div></div>` + K.tap(12.7, 2.5, 'tp1') + K.tap(9.875, 15.1, 'tp2')
        }
      },
      {
        id: 'forward', ko: '전달', en: 'Forward', aka: ['메시지 전달', '포워드', 'forward message'],
        when: '메신저와 메일에서 받은 내용을 다른 대화로 그대로 넘길 때',
        avoid: '새 내용을 쓰는 상황(보내기), 원 작성자의 개인정보 노출을 고려하지 않는 전달',
        notes: [
          '전달된 메시지에는 ‘전달됨’ 표시를 붙여요.',
          '수신자 선택 화면과 최종 전송 전에 미리보기와 확인을 둬요.',
          '원 작성자의 개인정보 노출을 고려해 제한 옵션을 둬요.'
        ],
        vs: { id: 'send', text: '보내기는 내가 새로 쓴 내용을 보내고, 전달은 받은 내용을 다른 사람에게 그대로 넘겨요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 4400,
          phases: [['전달 누름', 450, 800], ['대화 고르기', 1000, 3200], ['전달됨', 3800, 5500]],
          alt: '받은 말풍선 옆의 전달 화살표를 누르면 전달할 대화 목록이 올라오고, 아빠를 고르면 시트가 내려가며 같은 내용이 ‘아빠에게 전달됨’ 표시와 함께 보낸 말풍선으로 나타나는 시연',
          html: K => K.app.status() + K.app.bar('가족 채팅', ['more'], { back: true }) +
            '<div class="rb"><span>두부 2모랑 대파 부탁해요</span></div>' + `<span class="fb">${K.icon('forward')}</span>` + K.scrim('sc') +
            '<div class="sh"><div class="ti"><b>전달할 대화</b></div>' +
            ['엄마', '아빠', '장보기 방'].map((n, i) => `<div class="ct ct${i + 1}"><i class="av">${K.icon('user')}</i><span>${n}</span></div>`).join('') + '</div>' +
            `<div class="fw"><span class="fl">${K.icon('forward')}아빠에게 전달됨</span></div><div class="sb"><span>두부 2모랑 대파 부탁해요</span></div>` +
            K.tap(13.7, 6.13, 'tp1') + K.tap(6, 18.03, 'tp2')
        }
      },
      {
        id: 'send', ko: '보내기', en: 'Send', aka: ['전송', '종이비행기', 'send button'],
        when: '메시지, 메일, 폼처럼 작성한 내용을 상대에게 전송할 때',
        avoid: '내용이 비어 있는데 활성화해 두는 것, 전송 상태를 알리지 않는 것',
        notes: [
          '내용이 비어 있으면 비활성으로 두고, 전송 중, 전송됨, 실패 상태를 표시해요.',
          '실수를 막도록 되돌리기(메일의 전송 취소)를 둬요.',
          '아이콘만 쓸 때는 aria-label="보내기"를 붙여요.'
        ],
        vs: { id: 'forward', text: '전달은 받은 내용을 그대로 넘기는 일이고, 보내기는 작성한 새 내용을 전송하는 일이에요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 5400,
          phases: [['작성', 700, 1700], ['보내기 누름', 4400, 4900], ['전송 중', 4900, 5300], ['보냈어요', 5300, 5800]],
          alt: '입력 칸이 비어 있을 때 회색이던 종이비행기 버튼이 글을 쓰면 주황색으로 바뀌고, 누르면 비행기가 날아가며 말풍선이 생기고 ‘보내는 중’에서 ‘보냈어요’로 바뀌는 시연',
          html: K => K.app.status() + K.app.bar('가족 채팅', ['more'], { back: true }) +
            '<div class="rb"><span>오늘 저녁 장은 누가 볼까?</span></div>' +
            '<div class="cf"><span class="tx pt">메시지 입력</span><span class="tx ty">두부 2모 사 와요</span></div>' +
            `<span class="snd sd">${K.icon('send')}</span><span class="snd sa">${K.icon('send')}</span><span class="fly">${K.icon('send')}</span>` +
            '<div class="sb"><span>두부 2모 사 와요</span></div>' +
            `<div class="sw"><span class="s1">보내는 중</span><span class="s2">${K.icon('check')}보냈어요</span></div>` + K.tap(13.85, 19.08, 'tp')
        }
      },
      {
        id: 'copy-link', ko: '링크 복사', en: 'Copy link', aka: ['주소 복사', 'copy url', '클립보드'],
        when: '어떤 플랫폼으로 공유할지 모를 때의 기본 대안',
        avoid: '복사 결과를 알리지 않는 것, 공유 링크에 개인 토큰이 들어가는 것',
        notes: [
          '누르면 즉시 ‘링크를 복사했어요’ 토스트나 버튼 상태 변경으로 확인해요.',
          'Clipboard API는 HTTPS와 사용자 제스처에서만 동작해요.',
          '실패하면 선택된 입력 칸을 보여 수동으로 복사하게 해요.'
        ],
        vs: { id: 'qr', text: 'QR 공유는 화면을 보여 줘서 카메라로 넘기고, 링크 복사는 주소를 클립보드에 담아 어디든 붙여 넣게 해요.' },
        demo: {
          frame: 'phone', cycle: 5000, still: 2200,
          phases: [['누름', 800, 1100], ['복사됨 표시', 1100, 4000], ['원래대로', 4000, 4400]],
          alt: '링크 복사 버튼을 누르면 복사 아이콘이 체크로 바뀌고 버튼이 초록색 ‘복사했어요’가 되며 아래에 ‘링크를 복사했어요’ 토스트가 떴다가 원래 버튼으로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('목록 공유', [], { back: true }) +
            '<div class="hd"><b>링크로 공유하기</b><p>받는 사람은 앱 없이도 목록을 볼 수 있어요</p></div>' +
            `<div class="lf">${K.icon('link')}<span>jangbom.example/l/8f3k</span></div>` +
            `<div class="cb"><div class="b0">${K.icon('copy')}<span>링크 복사</span></div><div class="b1">${K.icon('check')}<span>복사했어요</span></div></div>` +
            '<div class="toast"><span>링크를 복사했어요</span></div>' + K.tap(8, 13.15, 'tp')
        }
      },
      {
        id: 'repost', ko: '리포스트', en: 'Repost', aka: ['리트윗', '다시 올리기', 'reshare', '인용'],
        when: '소셜 서비스에서 다른 사람의 게시물을 내 피드에 올려 공개로 퍼뜨릴 때',
        avoid: '특정 사람에게만 보내는 상황(전달), 이미 리포스트했는지 보여 주지 않는 구성',
        notes: [
          '단순 리포스트와 의견을 더한 인용을 나눠 고르게 해요.',
          '이미 리포스트했는지 상태(색이나 아이콘 채움)와 취소 방법을 보여요.',
          '횟수를 함께 표시해요.'
        ],
        vs: { id: 'forward', text: '전달은 특정 사람에게 개인적으로 넘기고, 리포스트는 내 팔로워에게 공개로 퍼뜨려요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2700,
          phases: [['메뉴 열기', 600, 1100], ['리포스트', 1700, 2600], ['취소', 3600, 4200]],
          alt: '게시물 아래의 리포스트 아이콘을 누르면 리포스트와 인용하기 메뉴가 열리고, 리포스트를 고르면 아이콘이 초록색이 되며 숫자가 12에서 13으로 늘고, 아이콘을 다시 누르면 원래대로 돌아오는 시연',
          html: K => K.app.status() + K.app.bar('소식', [], { back: true }) +
            `<div class="pt"><i class="av">${K.icon('users')}</i><div class="who"><b>가족장보기</b><em>방금</em></div><div class="tx">대파는 송송 썰어서 냉동하면 오래 쓸 수 있어요</div></div>` +
            `<div class="ar"><span class="ai ai1">${K.icon('heart')}<span>24</span></span><span class="ai ai2">${K.icon('repost')}<span class="cn"><span class="n12">12</span><span class="n13">13</span></span></span><span class="ai ai3">${K.icon('bookmark')}</span></div>` +
            `<div class="mn"><div class="mi m1">${K.icon('repost')}<span>리포스트</span></div><div class="mi">${K.icon('edit')}<span>인용하기</span></div></div>` +
            K.tap(6.6, 11.1, 'tp1') + K.tap(9, 13.17, 'tp2') + K.tap(6.6, 11.1, 'tp3')
        }
      },
      {
        id: 'qr', ko: 'QR 공유', en: 'QR code', aka: ['QR 코드', '큐알', 'scan', '코드 보여 주기'],
        when: '대면 공유, 프린트물, PC에서 모바일로 옮기는 것처럼 화면 사이를 넘길 때',
        avoid: '조명이 어둡거나 화면이 작아 읽기 어려운 곳, 링크 만료를 알리지 않는 구성',
        notes: [
          'QR 크기는 화면에서 최소 약 160~200px, 충분한 여백(quiet zone, 4모듈)을 둬요.',
          '밝기를 올리고 흰 배경에 어두운 코드로 대비를 높여요.',
          '링크 만료나 갱신 시간이 있으면 알리고, 이미지 저장 버튼과 링크 복사를 함께 둬요.'
        ],
        vs: { id: 'nearby', text: '근처 공유는 무선으로 기기에 바로 보내고, QR 공유는 코드를 보여 주면 상대가 카메라로 읽어요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3100,
          phases: [['QR 열기', 450, 1200], ['카메라가 읽는 중', 2400, 3800], ['열림', 3960, 5000], ['닫힘', 5000, 5400]],
          alt: '앱 바의 QR 아이콘을 누르면 흰 여백이 있는 QR 코드 카드가 나타나고, 상대 카메라 표시 틀과 스캔 선이 코드를 위에서 아래로 훑은 뒤 ‘링크가 열렸어요’가 뜨는 시연',
          html: K => K.app.screen({ icons: ['qr', 'more'] }) + K.scrim('sc') +
            `<div class="cd"><div class="ct"><b>목록 QR</b></div><div class="qr">${qrSvg()}</div>` +
            `<div class="bt"><span>${K.icon('image')}이미지 저장</span><span>${K.icon('copy')}링크 복사</span></div></div>` +
            '<div class="vf"><i class="q1"></i><i class="q2"></i><i class="q3"></i><i class="q4"></i><b class="sl"></b></div>' +
            '<div class="pl pl1"><span>상대방 카메라로 읽어요</span></div>' + `<div class="pl pl2"><span>${K.icon('checkCircle')}링크가 열렸어요</span></div>` + K.tap(12.7, 2.5, 'tp')
        }
      },
      {
        id: 'nearby', ko: '근처 공유', en: 'Nearby share', aka: ['주변 기기', '무선 전송', 'airdrop', 'quick share', '파일 전송'],
        when: '사진이나 파일을 옆 사람의 기기로 무선으로 바로 보낼 때',
        avoid: '권한 요청이나 검색 상태를 알리지 않고 직접 구현하는 것(보통은 OS 공유 시트로 충분해요)',
        notes: [
          '대부분 OS 기능이니 앱은 공유 시트를 열면 돼요.',
          '직접 구현하면 주변 기기 검색 중, 발견됨, 전송 중, 완료 상태를 보여요.',
          '근처 기기를 찾으려면 권한 요청이 필요해요.'
        ],
        vs: { id: 'qr', text: 'QR 공유는 코드를 화면에 띄워 상대가 읽게 하고, 근처 공유는 가까운 기기를 찾아 무선으로 바로 보내요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 3500,
          phases: [['검색 중', 0, 2640], ['보내는 중', 2760, 4080], ['완료', 4320, 5520]],
          alt: '내 기기에서 물결이 퍼지며 엄마 폰, 아빠 폰, 거실 태블릿이 차례로 발견되고, 엄마 폰을 누르면 둘레의 진행 링이 차오르며 다른 기기는 흐려지고 체크와 함께 보냈어요가 뜨는 시연',
          html: K => K.app.screen() + K.scrim('sc') +
            '<div class="sh"><div class="hd"><b>근처 공유</b><div class="sts"><span class="s1">근처 기기를 찾는 중...</span><span class="s2">엄마 폰으로 보내는 중...</span>' + `<span class="s3">${K.icon('check')}엄마 폰에 보냈어요</span></div></div>` +
            '<i class="rp rp1"></i><i class="rp rp2"></i>' + `<span class="me">${K.icon('wifi')}</span><div class="lab" style="left:5.5em;top:10.4em"><span>내 기기</span></div>` +
            ['엄마 폰', '아빠 폰', '거실 태블릿'].map((n, i) => `<div class="dv dv${i + 1}"><i>${K.icon('user')}</i><span>${n}</span></div>`).join('') +
            '<svg class="pg" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/></svg>' + `<span class="ck">${K.icon('check')}</span></div>` + K.tap(3.2, 9.8, 'tp')
        }
      },
      {
        id: 'share-sheet', ko: '공유 시트', en: 'Share sheet', aka: ['공유 메뉴', 'share menu', '공유 대상 목록', 'action sheet'],
        when: '공유할 앱과 방법(메시지, 복사, 저장 등)이 여러 개일 때 아래에서 올라오는 시트로 보여 줄 때',
        avoid: '시스템 공유 시트로 충분한 경우(직접 만들지 않아도 돼요), 공유 방법이 하나뿐인 경우',
        notes: [
          '시스템 공유 시트를 우선 쓰고, 직접 만들면 상단에 미리보기(제목과 이미지)를 보여요.',
          '자주 쓰는 앱을 한 줄로 두고 ‘링크 복사’를 꼭 포함해요.',
          '바텀시트 규칙을 따라요. 손잡이와 닫기 방법을 두고 스크림을 깔아요.'
        ],
        vs: { topic: 'feedback', id: 'bottom-sheet', name: '바텀시트', text: '바텀시트는 모든 선택지에 쓰는 일반 시트이고, 공유 시트는 공유 대상 앱과 링크 복사로 채운 전용 시트예요.' },
        demo: {
          frame: 'phone', cycle: 6000, still: 2400,
          phases: [['시트 열기', 600, 1500], ['시트 유지', 1500, 3300], ['복사 확인', 2850, 3500], ['닫힘', 3500, 4100]],
          alt: '앱 바의 공유 아이콘을 누르면 아래에서 미리보기, 자주 쓰는 앱 한 줄, 링크 복사 버튼이 든 공유 시트가 올라오고, 링크 복사를 누르면 복사했어요로 바뀐 뒤 시트가 내려가는 시연',
          html: K => K.app.screen({ icons: ['share', 'more'] }) + K.scrim('sc') +
            `<div class="sh"><i class="grab"></i><div class="pv"><i class="th"></i><div><b>이번 주 장보기</b><em>jangbom.example</em></div></div><div class="lw"><span>자주 쓰는 앱</span></div>` +
            `<div class="ap">${[['send', '메시지', 1], ['note', '메모', 2], ['users', '가족', 3], ['image', '저장', 4], ['forward', '전달', 1], ['bookmark', '즐겨찾기', 2]].map(a => item(K, a)).join('')}</div>` +
            `<div class="cb"><div class="b0">${K.icon('copy')}<span>링크 복사</span></div><div class="b1">${K.icon('check')}<span>복사했어요</span></div></div></div>` +
            K.tap(12.7, 2.5, 'tp1') + K.tap(8, 19.78, 'tp2')
        }
      }
    ],
    css: K => {
      const out = [];
      let t;
      const sheetFrames = (name, a, b, c, d, y) => kfs(name, [[[0, a], `transform:translateY(${y})`], [b, 'transform:none'], [c, 'transform:none'], [[d, 100], `transform:translateY(${y})`]]);
      const scrim = (name, a, b, c, d) => kfs(name, [[[0, a], 'opacity:0'], [b, 'opacity:1'], [c, 'opacity:1'], [[d, 100], 'opacity:0']]);
      const flash = (name, a, b, c, d, on, off) => kfs(name, [[[0, a], off], [b, on], [c, on], [[d, 100], off]]);

      /* ios-share */
      t = T('ios-share');
      out.push(common('ios-share'));
      out.push(`
${t} .k-ib-share::before{content:"";position:absolute;inset:0;border-radius:50%;background:#e9e8e4;opacity:0;animation-name:shIosHov}
${t} .sc{animation-name:shIosSc}
${t} .sh{position:absolute;z-index:11;left:.5em;right:.5em;bottom:.5em;height:12.4em;border-radius:1.1em;background:#f2f2f0;transform:translateY(110%);animation-name:shIosSh}
${t} .pv{position:absolute;left:.9em;right:.9em;top:.9em;display:flex;align-items:center;gap:.7em}
${t} .cl{margin-left:auto;display:grid;place-items:center;width:1.6em;height:1.6em;border-radius:50%;background:#dcdcd8}
${t} .cl .k-i{width:.8em;height:.8em}
${t} .ap{position:absolute;left:.6em;right:.6em;top:3.8em;height:4.2em;border-radius:.8em;background:#fff;display:flex;justify-content:space-around;align-items:center}
${t} .ac{position:absolute;left:.6em;right:.6em;top:8.3em;height:3.7em;border-radius:.8em;background:#fff;overflow:hidden}
${t} .a1,${t} .a2{position:absolute;left:0;right:0;height:1.85em}
${t} .a1{top:0;border-bottom:1px solid var(--a-line);animation-name:shIosRow}${t} .a2{top:1.85em}
${t} .a1 .t0,${t} .a1 .t1,${t} .a2>span:first-child{position:absolute;left:.9em;top:0;height:100%;display:flex;align-items:center;font-size:.7em}
${t} .a1 .t1{gap:.3em;color:var(--a-ok);font-weight:700;opacity:0;animation-name:shIosT1}
${t} .a1 .t1 .k-i{width:1em;height:1em}
${t} .a1 .t0{animation-name:shIosT0}
${t} .ico{position:absolute;right:.9em;top:50%;margin-top:-.55em;width:1.1em;height:1.1em;color:var(--a-mut)}
${t} .ico .k-i{display:block;width:100%;height:100%}
${t} .tp1{animation-name:shIosTp1}${t} .tp2{animation-name:shIosTp2}
${vis('shIosHov', [[8, 18]])}
${scrim('shIosSc', 12, 20, 62, 70)}
${sheetFrames('shIosSh', 12, 22, 62, 70, '110%')}
${flash('shIosRow', 45, 48, 58, 62, 'background:#ececea', 'background:#fff')}
${vis('shIosT0', [[0, 49], [93, 100]])}
${vis('shIosT1', [[51, 66]])}
${K.kf.tap('shIosTp1', 10)}
${K.kf.tap('shIosTp2', 48)}
`);

      /* android-share */
      t = T('android-share');
      out.push(common('android-share'));
      out.push(`
${t} .k-ib-shareAndroid::before{content:"";position:absolute;inset:0;border-radius:50%;background:#e9e8e4;opacity:0;animation-name:shAnHov}
${t} .sc{animation-name:shAnSc}
${t} .sh{position:absolute;z-index:11;left:0;right:0;bottom:0;height:11.6em;border-radius:1.2em 1.2em 0 0;background:#fff;transform:translateY(100%);animation-name:shAnSh;box-shadow:0 -.4em 1.4em rgba(10,10,12,.16)}
${t} .grab{position:absolute;left:50%;top:.6em;width:2.2em;height:.25em;margin-left:-1.1em;border-radius:1em;background:#cfcfcb}
${t} .hd{position:absolute;left:1em;top:1.2em}
${t} .hd b{font-size:.82em}
${t} .pv{position:absolute;left:1em;right:1em;top:2.5em;display:flex;align-items:center;gap:.6em}
${t} .pv .th{width:1.3em;height:1.3em;border-radius:.3em}
${t} .pv>div{display:flex;align-items:baseline;gap:.6em}
${t} .gd{position:absolute;left:.5em;right:.5em;top:4.4em;display:grid;grid-template-columns:repeat(4,1fr);row-gap:.2em}
${t} .gd .it:nth-child(3) .ic{animation-name:shAnPick}
${t} .tp1{animation-name:shAnTp1}${t} .tp2{animation-name:shAnTp2}
${vis('shAnHov', [[8, 18]])}
${scrim('shAnSc', 12, 20, 56, 64)}
${sheetFrames('shAnSh', 12, 22, 56, 64, '100%')}
${kfs('shAnPick', [[[0, 45], 'box-shadow:0 0 0 0 rgba(194,71,25,0)'], [49, 'box-shadow:0 0 0 .22em rgba(194,71,25,.4)'], [58, 'box-shadow:0 0 0 .22em rgba(194,71,25,.4)'], [[62, 100], 'box-shadow:0 0 0 0 rgba(194,71,25,0)']])}
${K.kf.tap('shAnTp1', 10)}
${K.kf.tap('shAnTp2', 48)}
`);

      /* forward */
      t = T('forward');
      out.push(common('forward'));
      out.push(`
${t} .rb{position:absolute;left:1em;top:5em;padding:.65em .9em;border-radius:.3em 1.1em 1.1em 1.1em;background:var(--a-soft)}
${t} .rb span{font-size:.74em;white-space:nowrap}
${t} .fb{position:absolute;left:12.8em;top:5.23em;width:1.8em;height:1.8em;border-radius:50%;background:var(--a-soft);display:grid;place-items:center}
${t} .fb .k-i{width:1em;height:1em}
${t} .sc{animation-name:shFwSc}
${t} .sh{position:absolute;z-index:11;left:0;right:0;bottom:0;height:9.6em;border-radius:1em 1em 0 0;background:#fff;transform:translateY(100%);animation-name:shFwSh;box-shadow:0 -.4em 1.4em rgba(10,10,12,.16)}
${t} .ti{position:absolute;left:1.2em;top:1.1em}
${t} .ti b{font-size:.78em}
${t} .ct{position:absolute;left:0;right:0;height:2.2em;display:flex;align-items:center;gap:.7em;padding:0 1.2em}
${t} .ct1{top:3em}${t} .ct2{top:5.2em;animation-name:shFwRow}${t} .ct3{top:7.4em}
${t} .av{display:grid;place-items:center;width:1.5em;height:1.5em;border-radius:50%;background:#f6d9ca;color:#8a3410}
${t} .av .k-i{width:.8em;height:.8em}
${t} .ct span{font-size:.74em}
${t} .fw{position:absolute;right:1em;top:8.5em}
${t} .fl{display:flex;align-items:center;gap:.3em;font-size:.6em;color:var(--a-mut);opacity:0;animation-name:shFwFl}
${t} .fl .k-i{width:1em;height:1em}
${t} .sb{position:absolute;right:1em;top:9.6em;padding:.65em .9em;border-radius:1.1em 1.1em .3em 1.1em;background:#f6d9ca;color:#5b2308;opacity:0;animation-name:shFwSb}
${t} .sb span{font-size:.74em;white-space:nowrap}
${t} .tp1{animation-name:shFwTp1}${t} .tp2{animation-name:shFwTp2}
${scrim('shFwSc', 12, 20, 52, 60)}
${sheetFrames('shFwSh', 12, 22, 52, 60, '100%')}
${flash('shFwRow', 41, 44, 52, 56, 'background:var(--a-soft)', 'background:#fff')}
${rise('shFwFl', 62, 67, 90, 94, 0.6)}
${rise('shFwSb', 62, 67, 90, 94, 0.6)}
${K.kf.tap('shFwTp1', 10)}
${K.kf.tap('shFwTp2', 42)}
`);

      /* send */
      t = T('send');
      out.push(common('send'));
      out.push(`
${t} .rb{position:absolute;left:1em;top:5em;padding:.65em .9em;border-radius:.3em 1.1em 1.1em 1.1em;background:var(--a-soft)}
${t} .rb span{font-size:.74em;white-space:nowrap}
${t} .cf{position:absolute;left:1em;right:3.9em;bottom:1.1em;height:2.3em;border:.07em solid #cfcfca;border-radius:1.15em;background:#fff}
${t} .cf .tx{position:absolute;left:.9em;top:0;height:100%;display:flex;align-items:center;font-size:.72em;white-space:nowrap}
${t} .pt{color:#9a9b96;animation-name:shSdPt}${t} .ty{animation-name:shSdTy}
${t} .snd{position:absolute;right:1em;bottom:1.1em;width:2.3em;height:2.3em;border-radius:50%;display:grid;place-items:center;opacity:0}
${t} .snd .k-i{width:1.1em;height:1.1em}
${t} .sd{background:var(--a-soft);color:#9a9b96;animation-name:shSdSd}${t} .sa{background:var(--a-brand);color:#fff;animation-name:shSdSa}
${t} .fly{position:absolute;z-index:15;left:13.3em;top:18.53em;width:1.1em;height:1.1em;color:var(--a-brand);opacity:0;animation-name:shSdFly}
${t} .fly .k-i{display:block;width:100%;height:100%}
${t} .sb{position:absolute;right:1em;top:8.2em;padding:.65em .9em;border-radius:1.1em 1.1em .3em 1.1em;background:#f6d9ca;color:#5b2308;opacity:0;animation-name:shSdSb}
${t} .sb span{font-size:.74em;white-space:nowrap}
${t} .sw{position:absolute;right:1em;top:10.9em;width:8em;height:1.2em}
${t} .sw span{position:absolute;right:0;top:0;display:flex;align-items:center;gap:.3em;font-size:.6em;color:var(--a-mut);white-space:nowrap;opacity:0}
${t} .sw .s1{animation-name:shSdS1}${t} .sw .s2{animation-name:shSdS2}
${t} .sw .k-i{width:1em;height:1em;color:var(--a-ok)}
${t} .tp{animation-name:shSdTp}
${vis('shSdPt', [[0, 10], [79, 100]])}
${(() => { // typewriter reveal for the draft text
        const a = 12, b = 28, hide = 77;
        return kfs('shSdTy', [[[0, a - 0.1], 'opacity:0;clip-path:inset(0 100% 0 0)'], [a, 'opacity:1;clip-path:inset(0 100% 0 0);animation-timing-function:steps(9,end)'], [[b, hide], 'opacity:1;clip-path:inset(0 0 0 0)'], [hide + 0.1, 'opacity:0;clip-path:inset(0 0 0 0)'], [[hide + 1.1, 100], 'opacity:0;clip-path:inset(0 100% 0 0)']]);
      })()}
${vis('shSdSd', [[0, 10], [79, 100]])}${vis('shSdSa', [[11, 78]])}
${kfs('shSdFly', [[[0, 75], 'opacity:0;transform:none'], [76, 'opacity:1;transform:none'], [86, 'opacity:0;transform:translate(.8em,-6em) scale(.8)'], [100, 'opacity:0;transform:none']])}
${rise('shSdSb', 80, 84, 95, 97, 0.6)}
${vis('shSdS1', [[81, 88]])}${vis('shSdS2', [[89, 95]])}
${K.kf.tap('shSdTp', 75)}
`);

      /* copy-link */
      t = T('copy-link');
      out.push(common('copy-link'));
      out.push(`
${t} .hd{position:absolute;left:1.2em;right:1.2em;top:5.4em}
${t} .hd b{display:block;font-size:.84em}
${t} .hd p{margin:.4em 0 0;font-size:.62em;color:var(--a-mut)}
${t} .lf{position:absolute;left:1.2em;right:1.2em;top:8.8em;height:2.4em;display:flex;align-items:center;gap:.5em;padding:0 .9em;border:.07em solid #cfcfca;border-radius:.6em;background:#fff;color:var(--a-mut)}
${t} .lf .k-i{width:1em;height:1em}
${t} .lf span{font-size:.66em}
${t} .cb{position:absolute;left:1.2em;right:1.2em;top:11.7em;height:2.9em}
${t} .b0,${t} .b1{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:.4em;border-radius:.76em;color:#fff;font-weight:700}
${t} .b0 span,${t} .b1 span{font-size:.72em}
${t} .b0 .k-i,${t} .b1 .k-i{width:1.1em;height:1.1em}
${t} .b0{background:var(--a-brand);animation-name:shClB0}
${t} .b1{background:var(--a-ok);opacity:0;animation-name:shClB1}
${t} .toast{position:absolute;z-index:12;left:50%;bottom:1.5em;padding:.6em 1em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;white-space:nowrap;opacity:0;animation-name:shClToast;box-shadow:0 .4em 1em rgba(20,20,22,.18)}
${t} .toast span{font-size:.7em}
${t} .tp{animation-name:shClTp}
${vis('shClB0', [[0, 21], [88, 100]])}
${vis('shClB1', [[22, 82]])}
${kfs('shClToast', [[[0, 22], 'opacity:0;transform:translate(-50%,.8em)'], [26, 'opacity:1;transform:translate(-50%,0)'], [70, 'opacity:1;transform:translate(-50%,0)'], [[76, 100], 'opacity:0;transform:translate(-50%,.4em)']])}
${K.kf.tap('shClTp', 20)}
`);

      /* repost */
      t = T('repost');
      out.push(common('repost'));
      out.push(`
${t} .pt{position:absolute;left:1em;right:1em;top:4.8em;height:5em}
${t} .av{position:absolute;left:0;top:0;display:grid;place-items:center;width:2em;height:2em;border-radius:50%;background:#f6d9ca;color:#8a3410}
${t} .av .k-i{width:1em;height:1em}
${t} .who{position:absolute;left:2.7em;top:.1em}
${t} .who b{display:block;font-size:.74em}
${t} .who em{display:block;font-size:.56em;color:var(--a-mut);font-style:normal}
${t} .pt .tx{position:absolute;left:0;right:0;top:3.2em;font-size:.74em;line-height:1.45}
${t} .ar{position:absolute;left:1em;right:1em;top:10.2em;height:1.8em;border-top:1px solid var(--a-line)}
${t} .ai{position:absolute;top:0;height:100%;display:flex;align-items:center;gap:.4em;color:var(--a-mut)}
${t} .ai .k-i{width:1.2em;height:1.2em}
${t} .ai>span{font-size:.7em}
${t} .ai1{left:.5em}${t} .ai2{left:5em;animation-name:shRpCol}${t} .ai3{left:10em}
${t} .cn{position:relative;display:block;width:1.6em;height:1em}
${t} .cn span{position:absolute;left:0;top:0;font-size:1em}
${t} .n12{animation-name:shRpN12}${t} .n13{opacity:0;animation-name:shRpN13}
${t} .mn{position:absolute;z-index:10;left:5em;top:12.1em;width:8.4em;border-radius:.7em;background:#fff;box-shadow:0 .5em 1.4em rgba(20,20,22,.2);opacity:0;transform-origin:top left;animation-name:shRpMn;overflow:hidden}
${t} .mi{display:flex;align-items:center;gap:.5em;height:2em;padding:0 .9em}
${t} .mi .k-i{width:1.05em;height:1.05em}
${t} .mi span{font-size:.7em;font-weight:700}
${t} .m1{animation-name:shRpM1}
${t} .tp1{animation-name:shRpT1}${t} .tp2{animation-name:shRpT2}${t} .tp3{animation-name:shRpT3}
${kfs('shRpCol', [[[0, 38], 'color:var(--a-mut)'], [41, 'color:var(--a-ok)'], [66, 'color:var(--a-ok)'], [[69, 100], 'color:var(--a-mut)']])}
${vis('shRpN12', [[0, 39], [70, 100]])}${vis('shRpN13', [[41, 67]])}
${kfs('shRpMn', [[[0, 13], 'opacity:0;transform:scale(.92)'], [18, 'opacity:1;transform:none'], [44, 'opacity:1;transform:none'], [[48, 100], 'opacity:0;transform:scale(.96)']])}
${flash('shRpM1', 34, 36, 42, 46, 'background:var(--a-soft)', 'background:#fff')}
${K.kf.tap('shRpT1', 12)}
${K.kf.tap('shRpT2', 36)}
${K.kf.tap('shRpT3', 64)}
`);

      /* qr */
      t = T('qr');
      out.push(common('qr'));
      out.push(`
${t} .k-ib-qr::before{content:"";position:absolute;inset:0;border-radius:50%;background:#e9e8e4;opacity:0;animation-name:shQrHov}
${t} .sc{animation-name:shQrSc}
${t} .cd{position:absolute;z-index:11;left:1.5em;right:1.5em;top:3.6em;height:15.3em;border-radius:1em;background:#fff;box-shadow:0 .6em 1.6em rgba(10,10,12,.2);opacity:0;animation-name:shQrCd}
${t} .ct{position:absolute;left:0;right:0;top:.9em;text-align:center}
${t} .ct b{font-size:.74em}
${t} .qr{position:absolute;left:2em;top:2.5em;width:9em;height:9em}
${t} .qr svg{display:block;width:100%;height:100%}
${t} .bt{position:absolute;left:.7em;right:.7em;top:12.4em;display:flex;gap:.5em}
${t} .bt span{flex:1;display:flex;align-items:center;justify-content:center;gap:.35em;height:2em;border-radius:.6em;background:var(--a-soft);font-size:.62em;font-weight:700}
${t} .bt .k-i{width:1.1em;height:1.1em}
${t} .vf{position:absolute;z-index:14;left:3.2em;top:5.8em;width:9.6em;height:9.6em;opacity:0;animation-name:shQrVf}
${t} .vf i{position:absolute;width:1.3em;height:1.3em;border:.18em solid var(--a-brand)}
${t} .vf .q1{left:0;top:0;border-right:0;border-bottom:0;border-top-left-radius:.4em}
${t} .vf .q2{right:0;top:0;border-left:0;border-bottom:0;border-top-right-radius:.4em}
${t} .vf .q3{left:0;bottom:0;border-right:0;border-top:0;border-bottom-left-radius:.4em}
${t} .vf .q4{right:0;bottom:0;border-left:0;border-top:0;border-bottom-right-radius:.4em}
${t} .sl{position:absolute;left:.3em;right:.3em;top:.2em;height:.18em;background:var(--a-brand);animation-name:shQrSl}
${t} .pl{position:absolute;z-index:15;left:0;right:0;top:19.5em;display:flex;justify-content:center;opacity:0}
${t} .pl span{display:flex;align-items:center;gap:.35em;padding:.45em 1em;border-radius:2em;background:var(--a-dark);color:#f4f4f2;font-size:.6em;font-weight:700;white-space:nowrap}
${t} .pl2 span{background:#dcf1e3;color:#124a2c}
${t} .pl .k-i{width:1.2em;height:1.2em}
${t} .pl1{animation-name:shQrP1}${t} .pl2{animation-name:shQrP2}
${t} .tp{animation-name:shQrTp}
${vis('shQrHov', [[6, 16]])}
${scrim('shQrSc', 10, 18, 84, 90)}
${kfs('shQrCd', [[[0, 12], 'opacity:0;transform:translateY(1em) scale(.96)'], [20, 'opacity:1;transform:none'], [84, 'opacity:1;transform:none'], [[90, 100], 'opacity:0;transform:translateY(1em) scale(.96)']])}
${vis('shQrVf', [[34, 72]])}
${kfs('shQrSl', [[[0, 39], 'opacity:0;transform:translateY(0)'], [40, 'opacity:1;transform:translateY(0)'], [62, 'opacity:1;transform:translateY(9.2em)'], [63, 'opacity:0;transform:translateY(9.2em)'], [100, 'opacity:0;transform:translateY(0)']])}
${vis('shQrP1', [[34, 63]])}${vis('shQrP2', [[66, 84]])}
${K.kf.tap('shQrTp', 8)}
`);

      /* nearby */
      t = T('nearby');
      out.push(common('nearby'));
      out.push(`
${t} .sc{opacity:1}
${t} .sh{position:absolute;z-index:11;left:0;right:0;top:4.6em;bottom:0;border-radius:1.1em 1.1em 0 0;background:#fff;overflow:hidden}
${t} .hd{position:absolute;left:0;right:0;top:1em;text-align:center}
${t} .hd b{font-size:.82em}
${t} .sts{position:relative;height:1.4em;margin-top:.5em}
${t} .sts span{position:absolute;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:.3em;font-size:.66em;color:var(--a-mut);opacity:0}
${t} .sts .k-i{width:1.1em;height:1.1em;color:var(--a-ok)}
${t} .sts .s1{animation-name:shNbS1}${t} .sts .s2{animation-name:shNbS2}${t} .sts .s3{color:var(--a-ok);font-weight:700;animation-name:shNbS3}
${t} .rp{position:absolute;left:1.9em;top:7.1em;width:3em;height:3em;margin-left:4.6em;border-radius:50%;border:.1em solid var(--a-brand);opacity:0}
${t} .rp1{animation-name:shNbR1}${t} .rp2{animation-name:shNbR2}
${t} .me{position:absolute;left:6.5em;top:7.1em;display:grid;place-items:center;width:3em;height:3em;border-radius:50%;background:var(--a-brand);color:#fff}
${t} .me .k-i{width:1.4em;height:1.4em}
${t} .lab{position:absolute;width:5em;text-align:center}
${t} .lab span{font-size:.56em;color:var(--a-mut)}
${t} .dv{position:absolute;width:5em;display:flex;flex-direction:column;align-items:center;gap:.3em;opacity:0}
${t} .dv i{display:grid;place-items:center;width:2.4em;height:2.4em;border-radius:50%;background:var(--a-soft)}
${t} .dv .k-i{width:1.2em;height:1.2em}
${t} .dv span{font-size:.56em}
${t} .dv1{left:.7em;top:4em;animation-name:shNbD1}${t} .dv2{left:10.3em;top:4em;animation-name:shNbD2}${t} .dv3{left:5.5em;top:12.4em;animation-name:shNbD3}
${t} .pg{position:absolute;left:1.6em;top:3.6em;width:3.2em;height:3.2em;transform:rotate(-90deg);overflow:visible}
${t} .pg circle{fill:none;stroke:var(--a-brand);stroke-width:3;stroke-linecap:round;stroke-dasharray:107;stroke-dashoffset:107;opacity:0;animation-name:shNbPg}
${t} .ck{position:absolute;left:3.7em;top:5.2em;display:grid;place-items:center;width:1.1em;height:1.1em;border-radius:50%;background:var(--a-ok);color:#fff;opacity:0;animation-name:shNbCk}
${t} .ck .k-i{width:.7em;height:.7em;stroke-width:3}
${t} .tp{animation-name:shNbTp}
${vis('shNbS1', [[0, 44], [93, 100]])}${vis('shNbS2', [[46, 70]])}${vis('shNbS3', [[72, 92]])}
${kfs('shNbR1', [[[0, 3], 'opacity:0;transform:scale(.6)'], [4, 'opacity:.55;transform:scale(.6)'], [26, 'opacity:0;transform:scale(4)'], [100, 'opacity:0;transform:scale(4)']])}
${kfs('shNbR2', [[[0, 13], 'opacity:0;transform:scale(.6)'], [14, 'opacity:.55;transform:scale(.6)'], [36, 'opacity:0;transform:scale(4)'], [100, 'opacity:0;transform:scale(4)']])}
${kfs('shNbD1', [[[0, 21], 'opacity:0;transform:scale(.6)'], [25, 'opacity:1;transform:scale(1)'], [90, 'opacity:1;transform:scale(1)'], [[96, 100], 'opacity:0;transform:scale(.6)']])}
${kfs('shNbD2', [[[0, 27], 'opacity:0;transform:scale(.6)'], [31, 'opacity:1;transform:scale(1)'], [45, 'opacity:1;transform:scale(1)'], [48, 'opacity:.35;transform:scale(1)'], [90, 'opacity:.35;transform:scale(1)'], [[96, 100], 'opacity:0;transform:scale(.6)']])}
${kfs('shNbD3', [[[0, 33], 'opacity:0;transform:scale(.6)'], [37, 'opacity:1;transform:scale(1)'], [45, 'opacity:1;transform:scale(1)'], [48, 'opacity:.35;transform:scale(1)'], [90, 'opacity:.35;transform:scale(1)'], [[96, 100], 'opacity:0;transform:scale(.6)']])}
${kfs('shNbPg', [[[0, 45], 'opacity:0;stroke-dashoffset:107'], [46, 'opacity:1;stroke-dashoffset:107'], [68, 'opacity:1;stroke-dashoffset:0'], [70, 'opacity:0;stroke-dashoffset:0'], [100, 'opacity:0;stroke-dashoffset:107']])}
${vis('shNbCk', [[70, 90]])}
${K.kf.tap('shNbTp', 44)}
`);

      /* share-sheet */
      t = T('share-sheet');
      out.push(common('share-sheet'));
      out.push(`
${t} .sc{animation-name:shSsSc}
${t} .sh{position:absolute;z-index:11;left:0;right:0;bottom:0;height:12.6em;border-radius:1em 1em 0 0;background:#fff;transform:translateY(100%);animation-name:shSsSh;box-shadow:0 -.4em 1.4em rgba(10,10,12,.16)}
${t} .grab{position:absolute;left:50%;top:.6em;width:2.2em;height:.25em;margin-left:-1.1em;border-radius:1em;background:#cfcfcb}
${t} .pv{position:absolute;left:1em;right:1em;top:1.5em;display:flex;align-items:center;gap:.7em}
${t} .lw{position:absolute;left:1em;top:4.6em}
${t} .lw span{font-size:.58em;font-weight:700;color:var(--a-mut)}
${t} .ap{position:absolute;left:0;right:0;top:6em;height:3.8em;display:flex;padding-left:1em;overflow:hidden}
${t} .ap .it{flex:none;width:3.4em}
${t} .cb{position:absolute;left:1em;right:1em;top:9.9em;height:2.3em}
${t} .b0,${t} .b1{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:.4em;border-radius:.7em;font-weight:700}
${t} .b0 span,${t} .b1 span{font-size:.72em}
${t} .b0 .k-i,${t} .b1 .k-i{width:1.05em;height:1.05em}
${t} .b0{background:var(--a-soft);color:var(--a-ink);animation-name:shSsB0}
${t} .b1{background:#dcf1e3;color:#124a2c;opacity:0;animation-name:shSsB1}
${t} .tp1{animation-name:shSsTp1}${t} .tp2{animation-name:shSsTp2}
${scrim('shSsSc', 10, 20, 58, 66)}
${sheetFrames('shSsSh', 10, 24, 58, 66, '100%')}
${vis('shSsB0', [[0, 47], [93, 100]])}${vis('shSsB1', [[49, 62]])}
${K.kf.tap('shSsTp1', 8)}
${K.kf.tap('shSsTp2', 46)}
`);

      return out.join('\n');
    }
  });
})();
