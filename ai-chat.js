(function () {
  'use strict';

  /* ── Language ─────────────────────────────────────── */
  var LANG = 'ja';

  /* ── Campaign (キャンペーン情報: null=なし, 文字列で内容を入力) ── */
  var CAMPAIGN = null;
  // 例: var CAMPAIGN = '入会金無料キャンペーン実施中！（2026年8月末まで）';

  /* ── Message History (言語切替時の再描画用) ─────────── */
  var MSG_HISTORY = [];

  /* ── Scroll-triggered body selector ─────────────── */
  var _scrollUnlock = null; // pending scroll listener cleanup

  function addBodySelectorOnScroll() {
    if (_scrollUnlock) { _scrollUnlock(); _scrollUnlock = null; }
    var triggered = false;
    // Wait one frame for DOM to settle after card append, then set up scroll detection
    var tid = setTimeout(function() {
      var baseTop = msgBody.scrollTop;
      var needsScroll = msgBody.scrollHeight > msgBody.clientHeight + 80;
      if (!needsScroll) {
        // All content already visible — show after brief pause so user can see the card
        var tid2 = setTimeout(function() {
          if (triggered) return;
          triggered = true;
          _scrollUnlock = null;
          addBot('他にも気になる部位はありますか？', 'Curious about other muscle groups?');
          addBodySelector();
        }, 2500);
        _scrollUnlock = function() { clearTimeout(tid2); };
        return;
      }
      function onScroll() {
        if (triggered) return;
        var st = msgBody.scrollTop;
        // Require user to have scrolled ≥40px from machine card top AND be near the bottom
        if (st >= baseTop + 40 && st + msgBody.clientHeight >= msgBody.scrollHeight - 80) {
          triggered = true;
          msgBody.removeEventListener('scroll', onScroll);
          _scrollUnlock = null;
          addBot('他にも気になる部位はありますか？', 'Curious about other muscle groups?');
          addBodySelector();
        }
      }
      msgBody.addEventListener('scroll', onScroll);
      _scrollUnlock = function() { msgBody.removeEventListener('scroll', onScroll); };
    }, 200);
    _scrollUnlock = function() { clearTimeout(tid); };
  }

  /* ── Machine Data ─────────────────────────────────── */
  var MACHINES = [
    {
      id: 'lat',
      name: { ja: 'ラットプルダウン', en: 'Lat Pulldown' },
      code: 'MATRIX G7-S33',
      img: 'images/machine-lat.jpg',
      parts: ['back'],
      color: '#2563EB',
      muscles: { ja: ['背中', '広背筋', '姿勢改善'], en: ['Back', 'Lats', 'Posture'] },
      desc: {
        ja: '背中の広背筋をメインに鍛えるマシンです。縦方向の引きで背中を広くし、姿勢改善・逆三角形の体型づくりに効果的です。',
        en: 'Targets the latissimus dorsi with a vertical pulling motion. Great for building a wider back and improving posture.'
      },
      steps: {
        ja: ['① 重りを選択する', '② シートの高さを膝がパッドに収まるよう調節', '③ ももパッドを下ろしてしっかり固定', '④ バーを肩幅より少し広めに握る', '⑤ 息を吐きながらゆっくりバーを鎖骨まで引き下ろす', '⑥ 息を吸いながらゆっくり元の位置に戻す'],
        en: ['① Select weight', '② Adjust seat height so knees fit under pad', '③ Lower thigh pad to secure legs', '④ Grip bar slightly wider than shoulder-width', '⑤ Exhale and slowly pull bar down to collarbone', '⑥ Inhale and slowly return to start']
      },
      point: {
        ja: '肩甲骨を寄せるイメージで行いましょう！背中が丸くならないよう注意。反動を使わずゆっくり動かすと効果UP！',
        en: 'Squeeze your shoulder blades together! Keep your back straight — slow and controlled reps are most effective.'
      }
    },
    {
      id: 'row',
      name: { ja: 'シーテッドロウ', en: 'Seated Row' },
      code: 'MATRIX G7-S34',
      img: 'images/machine-row.jpg',
      parts: ['back'],
      color: '#4338CA',
      muscles: { ja: ['背中', '広背筋', '僧帽筋'], en: ['Back', 'Lats', 'Trapezius'] },
      desc: {
        ja: '横方向の引きで広背筋・僧帽筋をバランスよく鍛えます。ラットプルダウンとセットで使うと背中全体を効率よく鍛えられます。',
        en: 'Horizontal pull targeting both lats and trapezius. Pair with Lat Pulldown for complete back development.'
      },
      steps: {
        ja: ['① 重りを選択する', '② シートに座り足をフットプレートに乗せる', '③ グリップを両手で握り背筋を伸ばす', '④ 息を吐きながら肘を後ろに引き、肩甲骨を寄せる', '⑤ 背中の筋肉が収縮したことを感じたら一瞬止める', '⑥ 息を吸いながらゆっくり元の位置に戻す'],
        en: ['① Select weight', '② Sit and place feet on footplates', '③ Grip handles and straighten back', '④ Exhale and pull elbows back, squeeze shoulder blades', '⑤ Hold briefly at full contraction', '⑥ Inhale and slowly return to start']
      },
      point: {
        ja: '背筋をまっすぐ伸ばした状態をキープ！上体を後ろに倒す反動は使わず、背中の力だけで引きましょう。',
        en: 'Keep your back straight throughout! Avoid leaning back — use only your back muscles to pull.'
      }
    },
    {
      id: 'leg',
      name: { ja: 'レッグプレス', en: 'Leg Press' },
      code: 'MATRIX G7-S70',
      img: 'images/machine-leg.jpg',
      parts: ['legs'],
      color: '#16A34A',
      muscles: { ja: ['太もも', '大腿四頭筋', 'ハムストリングス', 'お尻'], en: ['Thighs', 'Quadriceps', 'Hamstrings', 'Glutes'] },
      desc: {
        ja: '脚全体（太もも前後・臀部）を効果的に鍛えます。美脚・ヒップアップ・下半身強化に人気の定番マシンです。',
        en: 'Targets all major leg muscles — quads, hamstrings and glutes. Popular for toning legs and lifting glutes.'
      },
      steps: {
        ja: ['① 重りを選択する', '② シートに座り背もたれに背中をしっかりつける', '③ 足をプラットフォームに肩幅程度に置く', '④ 息を吐きながら足で押し出す（膝が完全に伸びきらない範囲で）', '⑤ 息を吸いながらゆっくりプラットフォームを引き戻す', '⑥ お尻が浮かないよう注意しながら繰り返す'],
        en: ['① Select weight', '② Sit with back firmly against backrest', '③ Place feet shoulder-width on platform', '④ Exhale and press (do not fully lock knees)', '⑤ Inhale and slowly lower platform back', '⑥ Repeat without letting hips lift off seat']
      },
      point: {
        ja: '腰が浮かないよう背中をシートにしっかり押しつけて！膝を完全に伸ばしきると関節を痛める原因になるので注意。',
        en: 'Keep your back firmly against the seat — no hip lifting! Avoid fully locking knees to protect your joints.'
      }
    },
    {
      id: 'crunch',
      name: { ja: 'アブドミナルクランチ', en: 'Abdominal Crunch' },
      code: 'MATRIX G7-S51',
      img: 'images/machine-crunch.jpg',
      parts: ['abs'],
      color: '#EA580C',
      muscles: { ja: ['腹筋', '腹直筋', 'お腹引き締め'], en: ['Abs', 'Rectus Abdominis', 'Core Toning'] },
      desc: {
        ja: '腹直筋（シックスパック部分）に集中してアプローチできるマシンです。身長に合わせてシート位置を調節するのがポイントです。',
        en: 'Isolates the rectus abdominis for targeted ab toning. Adjust seat height to your build for best results.'
      },
      steps: {
        ja: ['① 重りを選択する', '② 身長に合わせてシート位置を調節', '　〜150cm → シート1番', '　〜160cm → シート1〜2番', '　〜170cm → シート3〜4番', '　〜180cm → シート5〜6番', '　181cm〜 → シート7番', '③ パッドに肘を置き、グリップをしっかり握る', '④ 息を吐きながらゆっくり上体を前に倒す', '⑤ 息を吸いながらゆっくり元の位置に戻す'],
        en: ['① Select weight', '② Adjust seat by your height:', '　≤150cm → Seat 1', '　≤160cm → Seat 1-2', '　≤170cm → Seat 3-4', '　≤180cm → Seat 5-6', '　181cm+ → Seat 7', '③ Place elbows on pad and grip handles firmly', '④ Exhale and slowly crunch forward', '⑤ Inhale and slowly return to start']
      },
      point: {
        ja: 'お腹に力を入れながら行いましょう！背中がパッドから完全に離れないようにするのがポイントです。',
        en: 'Engage your core throughout! Keep your back in contact with the pad — do not arch away from it.'
      }
    },
    {
      id: 'torso',
      name: { ja: 'ロータリートルソー', en: 'Rotary Torso' },
      code: 'MATRIX G7-S55',
      img: 'images/machine-torso.jpg',
      parts: ['abs', 'core'],
      color: '#DC2626',
      muscles: { ja: ['腹斜筋', '体幹', 'くびれ'], en: ['Obliques', 'Core', 'Waist Definition'] },
      desc: {
        ja: 'お腹の横側（腹斜筋）と体幹を鍛えくびれを作るマシンです。左右両方行うことが必須です。',
        en: 'Targets obliques and core to define your waist. Always train both sides for balanced results.'
      },
      steps: {
        ja: ['① 重りを選択する', '② スタート位置を調節する（狭い:1 〜 広い:4）', '③ シートに膝を立てて乗る', '④ バーを両手でしっかり握る', '⑤ 息を吐きながら上半身を正面に向かってひねる', '⑥ 息を吸いながらゆっくり元の位置に戻す', '⑦ 同じ回数を反対側でも行う'],
        en: ['① Select weight', '② Set rotation start position (narrow:1 ~ wide:4)', '③ Kneel on seat facing the bar', '④ Grip bar firmly with both hands', '⑤ Exhale and rotate torso toward front', '⑥ Inhale and slowly return to start', '⑦ Repeat equal reps on the other side']
      },
      point: {
        ja: '必ず左右両方行ってください！上半身をまっすぐ保ち、腹斜筋の収縮を意識しましょう。',
        en: 'Always train both sides equally! Keep your torso upright and focus on feeling the obliques contract.'
      }
    }
  ];

  /* ── Cardio Data ──────────────────────────────────── */
  var CARDIO = {
    ja: {
      name: '有酸素系マシン',
      img: 'images/AFB8CF80-B162-4B85-A15E-71255DA88C89.jpg',
      desc: 'トレッドミル・エアロバイク・クロストレーナーなど複数台を完備。脂肪燃焼・心肺機能向上に効果的です。',
      list: [
        { name: 'トレッドミル',      icon: '🏃', note: '全身の脂肪燃焼・ウォーキングからランニングまで対応' },
        { name: 'エアロバイク',      icon: '🚴', note: '下半身を中心に鍛える・膝への負担が少ない' },
        { name: 'クロストレーナー', icon: '⛷️', note: '全身・体幹を鍛える・関節への衝撃が少ない' }
      ],
      tip: '脂肪燃焼には20分以上の継続が効果的！筋トレ後に有酸素を行うと、さらに燃焼効率がUPします。'
    },
    en: {
      name: 'Cardio Machines',
      img: 'images/AFB8CF80-B162-4B85-A15E-71255DA88C89.jpg',
      desc: 'Multiple cardio machines available including treadmills, exercise bikes and cross trainers.',
      list: [
        { name: 'Treadmill',      icon: '🏃', note: 'Full body fat burning — walking to running' },
        { name: 'Exercise Bike', icon: '🚴', note: 'Lower body focus — easy on the knees' },
        { name: 'Cross Trainer', icon: '⛷️', note: 'Full body & core — low joint impact' }
      ],
      tip: 'For best fat burning results, aim for 20+ continuous minutes! Doing cardio after weight training maximizes calorie burn.'
    }
  };

  /* ── Body Parts ───────────────────────────────────── */
  var PARTS = {
    ja: [
      { key: 'back',   label: '🔵 背中・肩',   desc: '広背筋・僧帽筋',         color: '#2563EB' },
      { key: 'legs',   label: '🟢 脚・お尻',   desc: '大腿四頭筋・臀部',       color: '#16A34A' },
      { key: 'abs',    label: '🟠 腹筋・体幹', desc: '腹直筋・腹斜筋',         color: '#EA580C' },
      { key: 'cardio', label: '🟡 有酸素',     desc: 'トレッドミル・バイク',    color: '#D97706' },
      { key: 'all',    label: '🟣 全マシン',   desc: '全5種類をまとめて見る',   color: '#7C3AED' }
    ],
    en: [
      { key: 'back',   label: '🔵 Back & Shoulders', desc: 'Lats & Trapezius',    color: '#2563EB' },
      { key: 'legs',   label: '🟢 Legs & Glutes',    desc: 'Quads & Hamstrings',  color: '#16A34A' },
      { key: 'abs',    label: '🟠 Abs & Core',        desc: 'Rectus & Obliques',   color: '#EA580C' },
      { key: 'cardio', label: '🟡 Cardio',             desc: 'Treadmill & Bike',    color: '#D97706' },
      { key: 'all',    label: '🟣 All Machines',       desc: 'See all 5 types',     color: '#7C3AED' }
    ]
  };

  /* ── Q&A Database ─────────────────────────────────── */
  var DB = [
    /* ---------- Machine / Equipment ---------- */
    {
      cat: 'machine',
      keys_ja: ['機材', 'マシン', 'どんな', 'どのような', '設備', '器具', '何が', '何種類', '筋トレ 機材', '筋トレマシン'],
      keys_en: ['equipment', 'machine', 'machines', 'what machines', 'gym equipment', 'facilities'],
      a_ja: 'MATRIXブランドの筋トレマシン<b>5種類</b>と有酸素系マシンを完備しています！<br>どの部位を鍛えたいですか？',
      a_en: 'We have <b>5 MATRIX-brand</b> weight machines plus multiple cardio machines!<br>Which body part would you like to train?',
      showBodySelector: true
    },
    {
      cat: 'machine',
      keys_ja: ['有酸素', 'ランニング', 'トレッドミル', 'エアロバイク', 'バイク', 'クロストレーナー', '走る', '有酸素マシン'],
      keys_en: ['cardio', 'treadmill', 'bike', 'cross trainer', 'running', 'aerobic', 'exercise bike'],
      a_ja: '有酸素系マシンを複数台完備しています。詳しくはこちら👇',
      a_en: 'We have multiple cardio machines available. Details below 👇',
      showCardio: true
    },
    {
      cat: 'machine',
      keys_ja: ['ラットプルダウン', 'lat', 'pulldown', 'ラット', '広背筋 マシン', 'lat pulldown'],
      keys_en: ['lat pulldown', 'lat pull', 'pulldown machine', 'lats machine'],
      a_ja: '', a_en: '', showMachine: 'lat'
    },
    {
      cat: 'machine',
      keys_ja: ['シーテッドロウ', 'seated row', 'ロウイング', 'ロウマシン', '僧帽筋 マシン'],
      keys_en: ['seated row', 'rowing machine', 'row machine', 'cable row'],
      a_ja: '', a_en: '', showMachine: 'row'
    },
    {
      cat: 'machine',
      keys_ja: ['レッグプレス', 'leg press', 'レッグ', '大腿 マシン', '脚 プレス'],
      keys_en: ['leg press', 'leg machine', 'leg press machine'],
      a_ja: '', a_en: '', showMachine: 'leg'
    },
    {
      cat: 'machine',
      keys_ja: ['アブドミナルクランチ', '腹筋マシン', 'クランチ', 'アブ', '腹直筋 マシン', 'アブドミナル'],
      keys_en: ['abdominal crunch', 'crunch machine', 'ab machine', 'abs machine'],
      a_ja: '', a_en: '', showMachine: 'crunch'
    },
    {
      cat: 'machine',
      keys_ja: ['ロータリートルソー', 'rotary torso', '腹斜筋 マシン', 'くびれ マシン', '体幹 マシン'],
      keys_en: ['rotary torso', 'torso machine', 'oblique machine', 'waist machine'],
      a_ja: '', a_en: '', showMachine: 'torso'
    },
    {
      cat: 'machine',
      keys_ja: ['背中 鍛える', '背中 おすすめ', '背中 マシン', '広背筋 鍛え', '背筋 マシン', '背中 どのマシン'],
      keys_en: ['back training', 'back muscles', 'train back', 'back exercise', 'which machine back'],
      a_ja: '背中を鍛えるなら<b>ラットプルダウン</b>と<b>シーテッドロウ</b>がおすすめです！',
      a_en: 'For back training, the <b>Lat Pulldown</b> and <b>Seated Row</b> are perfect!',
      showMachines: ['lat', 'row']
    },
    {
      cat: 'machine',
      keys_ja: ['腹筋 鍛える', 'お腹 引き締め', 'シックスパック', '割れ', '腹 マシン', '腹筋 おすすめ'],
      keys_en: ['abs training', 'stomach', 'core training', 'six pack', 'belly training', 'abs machine'],
      a_ja: '腹筋・体幹を鍛えるなら<b>アブドミナルクランチ</b>と<b>ロータリートルソー</b>がおすすめです！',
      a_en: 'For abs and core training, try the <b>Abdominal Crunch</b> and <b>Rotary Torso</b>!',
      showMachines: ['crunch', 'torso']
    },
    {
      cat: 'machine',
      keys_ja: ['脚 鍛える', '太もも 細く', '下半身 マシン', 'ヒップアップ', 'お尻 鍛える', '脚 おすすめ'],
      keys_en: ['leg training', 'thigh', 'glutes training', 'hip lift', 'lower body machine'],
      a_ja: '脚・お尻を鍛えるなら<b>レッグプレス</b>がおすすめです！',
      a_en: 'For leg and glute training, the <b>Leg Press</b> is ideal!',
      showMachines: ['leg']
    },
    {
      cat: 'machine',
      keys_ja: ['くびれ', 'ウエスト', '腹斜筋', 'わき腹', '体幹 鍛え'],
      keys_en: ['waist', 'obliques', 'core strength', 'waistline', 'side abs'],
      a_ja: 'くびれ・体幹を鍛えるなら<b>ロータリートルソー</b>がおすすめです！',
      a_en: 'For waist definition and core strength, the <b>Rotary Torso</b> is perfect!',
      showMachines: ['torso']
    },
    {
      cat: 'machine',
      keys_ja: ['ダイエット', '痩せる', '脂肪 燃焼', 'カロリー', '体重 落とす', '体重 減らす'],
      keys_en: ['diet', 'weight loss', 'fat burning', 'lose weight', 'calories'],
      a_ja: 'ダイエットには有酸素マシン（トレッドミルなど）で脂肪燃焼＋筋トレで基礎代謝アップの組み合わせが最も効果的です！',
      a_en: 'For weight loss, combining cardio for fat burning with weight training to boost metabolism is most effective!',
      showCardio: true
    },
    {
      cat: 'machine',
      keys_ja: ['マシン 使い方', 'マシン 説明', 'マシン 教えて', '使い方 説明'],
      keys_en: ['how to use', 'machine instructions', 'how to operate'],
      a_ja: '各マシンの使い方はこちらからご確認いただけます。どの部位を鍛えたいですか？',
      a_en: 'Check out how to use each machine below. Which body part would you like to train?',
      showBodySelector: true
    },

    /* ---------- Pricing ---------- */
    {
      cat: 'pricing',
      q_ja: '月額はいくらですか？', q_en: 'What is the monthly fee?',
      keys_ja: ['月額', '月会費', '月いくら', '月 料金', '月 費用', '値段', '会費'],
      keys_en: ['price', 'fee', 'monthly', 'cost', 'how much', 'monthly fee', 'membership fee'],
      a_ja: 'レギュラー会員は<b>月額3,980円（税抜）</b>、税込で<b>4,378円/月</b>です。<br>シャワーオプション付きは +1,100円（税込）です。',
      a_en: 'Regular membership is <b>¥3,980/month (excl. tax)</b>, or <b>¥4,378/month (incl. tax)</b>.<br>+¥1,100 (incl. tax) for shower access.'
    },
    {
      cat: 'pricing',
      q_ja: '入会金はいくらですか？', q_en: 'Is there a registration fee?',
      keys_ja: ['入会金', '初期費用', '登録費', '入会 費用', '入会 いくら', '最初 費用', 'はじめ 費用'],
      keys_en: ['registration fee', 'signup fee', 'joining fee', 'enrollment fee', 'initial fee', 'first payment'],
      a_ja: '入会に必要な<b>初期費用</b>は以下の合計になります：<br>① 入会金：<b>11,000円（税込）</b>（初回のみ）<br>② 入会月の<b>日割り料金</b><br>③ <b>翌月分の月額料金</b>（¥4,378）<br><br>例）7月15日入会の場合：入会金11,000円 + 日割り約2,335円 + 翌月分4,378円',
      a_en: 'Initial costs at sign-up:<br>① Registration fee: <b>¥11,000 (tax incl.)</b> (one-time only)<br>② Pro-rated fee for first month<br>③ <b>Next month\'s fee</b> (¥4,378)'
    },
    {
      cat: 'pricing',
      q_ja: '月の途中で入会した場合は？', q_en: 'Can I join mid-month?',
      keys_ja: ['日割り', '月途中', '途中入会', '月の途中', '途中から', '途中 日割り'],
      keys_en: ['prorated', 'mid-month', 'join mid month', 'partial month', 'prorate'],
      a_ja: '月の途中でご入会の場合は、入会月の月額を<b>日割り計算</b>でご請求します。<br>例）6月15日入会 → 残り16日分 × (4,378円 ÷ 30日) ≈ 約2,335円',
      a_en: 'If you join mid-month, the first month\'s fee is <b>pro-rated by day</b>.<br>Ex) Join June 15 → 16 remaining days × (¥4,378 ÷ 30) ≈ ¥2,335'
    },
    {
      cat: 'pricing',
      q_ja: 'シャワーオプションはいくらですか？', q_en: 'How much is the shower option?',
      keys_ja: ['シャワー', 'シャワーオプション', 'シャワー 料金', 'シャワー 使えます', 'シャワー いくら'],
      keys_en: ['shower', 'shower option', 'shower fee', 'shower add-on'],
      a_ja: 'シャワーはオプションで<b>+1,100円（税込）/月</b>です。<br>シャワールーム完備でトレーニング後もさっぱりできます。',
      a_en: 'Shower access is an optional add-on for <b>+¥1,100/month (incl. tax)</b>.<br>We have shower rooms available after your workout.'
    },
    {
      cat: 'pricing',
      q_ja: '解約はいつでもできますか？', q_en: 'Can I cancel anytime?',
      keys_ja: ['解約', '退会', 'やめる', '縛り', '違約金', '退会 方法', '解約 方法'],
      keys_en: ['cancel', 'quit', 'leave', 'contract term', 'cancellation', 'no contract'],
      a_ja: '最低利用期間の縛りは<b>ありません</b>。いつでも退会いただけます（ただし、キャンペーン入会時は除く）。<br>なお、当ジムは<b>前払い制</b>のため、退会月の月末までご利用いただけます。',
      a_en: 'There is <b>no minimum contract period</b>. You can cancel anytime (campaign sign-ups may have different terms).<br>As we use a <b>prepaid billing system</b>, you can continue using the gym until the end of the month you cancel.'
    },
    {
      cat: 'pricing',
      q_ja: '月の途中で解約した場合は？', q_en: 'What if I cancel mid-month?',
      keys_ja: ['途中 解約', '月途中 退会', '前払い', '退会月', '月末 まで', '解約 日割り', '解約 返金'],
      keys_en: ['cancel mid-month', 'prepaid', 'refund cancel', 'cancel before end', 'partial month cancel'],
      a_ja: '当ジムは<b>前払い制</b>を採用しております。月の途中で退会された場合も、<b>退会月の月末まで</b>ご利用いただけます。<br>日割りでの返金はございませんのでご了承ください。',
      a_en: 'We use a <b>prepaid billing system</b>. Even if you cancel mid-month, you can continue using the gym <b>until the end of that month</b>.<br>Please note that partial-month refunds are not available.'
    },
    {
      cat: 'pricing',
      q_ja: '無料見学・体験はできますか？', q_en: 'Is a free tour available?',
      keys_ja: ['見学', '無料見学', '体験', '見学 申込', '見学 予約', '無料 体験', '見学 いつ'],
      keys_en: ['tour', 'free trial', 'free tour', 'visit', 'tryout', 'free visit'],
      a_ja: 'はい！<b>無料で館内見学・マシン体験</b>が可能です。<br>LINEまたはお問い合わせフォームからご予約ください😊',
      a_en: 'Yes! <b>Free gym tours and machine trials</b> are available.<br>Please book via LINE or our inquiry form 😊'
    },
    {
      cat: 'pricing',
      q_ja: '入会の方法を教えてください', q_en: 'How do I sign up?',
      keys_ja: ['入会 方法', 'どうやって入会', 'オンライン 入会', '入会 手続き', '申し込み', '会員 なる'],
      keys_en: ['how to join', 'sign up', 'register', 'how to sign up', 'membership application'],
      a_ja: 'ご入会は2つの方法があります：<br>① 店舗窓口でのご入会<br>② hacomonoからオンラインでご入会<br>詳しくはお問い合わせください！',
      a_en: 'Two ways to join:<br>① At our front desk in person<br>② Online via the hacomono system<br>Contact us for details!'
    },
    {
      cat: 'pricing',
      keys_ja: ['支払い 方法', 'クレジット', 'クレカ', '決済', '支払い'],
      keys_en: ['payment', 'credit card', 'payment method', 'how to pay'],
      a_ja: 'お支払い方法はクレジットカード・口座振替に対応しています。詳しくは店舗までお問い合わせください。',
      a_en: 'We accept credit card and bank transfer payments. Contact us for more details.'
    },

    /* ---------- Facility ---------- */
    {
      cat: 'facility',
      q_ja: '場所はどこですか？', q_en: 'Where is the gym located?',
      keys_ja: ['場所', '住所', 'どこ', 'アクセス', '所在地', '行き方', '住所 教えて'],
      keys_en: ['location', 'address', 'where', 'access', 'directions', 'how to get there'],
      a_ja: '📍 <b>香川県さぬき市長尾名37-7</b>にあります。<br>詳しいアクセスはHPのアクセスページをご確認ください。',
      a_en: '📍 Located at <b>37-7 Nagao-na, Sanuki City, Kagawa Prefecture</b>.<br>See the Access section on our website for directions.'
    },
    {
      cat: 'facility',
      q_ja: '営業時間・休館日は？', q_en: 'What are the hours?',
      keys_ja: ['営業時間', '何時', '24時間', '365日', '休館日', '年末年始', '営業 何時'],
      keys_en: ['hours', 'opening hours', '24 hours', 'open', 'closed', 'holidays', 'opening time'],
      a_ja: '<b>24時間365日営業</b>しています！<br>年末年始・祝日も通常通りご利用いただけます。',
      a_en: 'Open <b>24 hours, 365 days a year</b>!<br>Including holidays and New Year — no closures.'
    },
    {
      cat: 'facility',
      q_ja: '駐車場はありますか？', q_en: 'Is there parking?',
      keys_ja: ['駐車場', '車', '駐車', '駐車場 無料', '車 止める'],
      keys_en: ['parking', 'car', 'park', 'free parking', 'parking lot'],
      a_ja: 'はい、<b>無料駐車場</b>をご用意しています。お気軽にお車でお越しください。',
      a_en: 'Yes, we have a <b>free parking lot</b>. Feel free to come by car!'
    },
    {
      cat: 'facility',
      q_ja: '女性一人でも安心ですか？', q_en: 'Is it safe for women?',
      keys_ja: ['安全', 'セキュリティ', '防犯', '女性', '一人', '深夜 安全', 'セキュリティ 安心'],
      keys_en: ['safety', 'security', 'safe', 'women', 'female', 'alone', 'night'],
      a_ja: '会員証による<b>入退室管理</b>と<b>防犯カメラ</b>を設置しています。<br>女性お一人でも深夜・早朝でも安心してご利用いただけます。',
      a_en: 'We have <b>keycard entry control</b> and <b>security cameras</b> throughout.<br>Safe for women at any hour of the day or night.'
    },
    {
      cat: 'facility',
      q_ja: '何を持参すればいいですか？', q_en: 'What should I bring?',
      keys_ja: ['タオル', 'シューズ', '持参', 'ウェア', '持ち物', '何 持って行く', '準備'],
      keys_en: ['towel', 'shoes', 'what to bring', 'gear', 'clothes', 'what do I need'],
      a_ja: '【持ち物の目安】<br>・タオル（ご持参ください）<br>・室内専用シューズ（レンタルあり）<br>・動きやすい服装（ロッカーあり）',
      a_en: '【What to bring】<br>・Towel (please bring your own)<br>・Indoor gym shoes (rentals available)<br>・Comfortable workout clothes (lockers available)'
    },
    {
      cat: 'facility',
      keys_ja: ['電話', '連絡先', 'TEL', '電話番号', '問い合わせ 電話'],
      keys_en: ['phone', 'contact', 'telephone', 'call', 'phone number'],
      a_ja: '📞 <b>0120-368-098</b><br>お気軽にお電話ください！',
      a_en: '📞 <b>0120-368-098</b><br>Feel free to give us a call!'
    },
    {
      cat: 'facility',
      keys_ja: ['ロッカー', '荷物', '貴重品', '更衣室'],
      keys_en: ['locker', 'storage', 'changing room', 'locker room', 'valuables'],
      a_ja: 'ロッカー・更衣室を完備しています。貴重品管理は各自でお願いします。',
      a_en: 'Lockers and changing rooms are available. Please manage your own valuables.'
    },
    {
      cat: 'facility',
      keys_ja: ['混む', '空いてる', '混雑', '人 多い', '混んでいる時間'],
      keys_en: ['crowded', 'busy', 'peak hours', 'how busy', 'when quiet'],
      a_ja: '24時間営業のため、夜間（22時〜深夜）や早朝は比較的空いております。',
      a_en: 'Since we\'re open 24/7, late nights (10pm~) and early mornings tend to be quieter.'
    },

    /* ---------- Training ---------- */
    {
      cat: 'training',
      q_ja: '初心者でも大丈夫ですか？', q_en: 'Is it OK for beginners?',
      keys_ja: ['初心者', 'はじめて', '初めて', 'ビギナー', '経験 ない', '初めてジム', '運動 苦手'],
      keys_en: ['beginner', 'first time', 'new', 'starter', 'never worked out', 'no experience'],
      a_ja: 'もちろん大丈夫です！<br>各マシンの横には<b>使い方の説明書きとQRコード</b>を掲示しており、スマートフォンでいつでも使い方を確認できます。<br>初めてでも安心してご利用いただけます😊',
      a_en: 'Absolutely! <b>Usage guides and QR codes</b> are posted beside each machine so you can check how to use them anytime with your smartphone.<br>First-timers are very welcome 😊'
    },
    {
      cat: 'training',
      q_ja: '週に何回通うのがいいですか？', q_en: 'How often should I go?',
      keys_ja: ['週 何回', '頻度', '通う 頻度', '何回 来ればいい', '週 何日'],
      keys_en: ['how often', 'frequency', 'how many times', 'per week', 'days per week'],
      a_ja: 'ライフスタイルに合わせてご来店いただければ大丈夫です！<br>お仕事帰りに<b>毎日10分だけ</b>という方も、<b>週に1回1時間</b>じっくり取り組む方もいます。<br>無理のないペースで長く続けることが何より大切です😊',
      a_en: 'Come at whatever pace fits your lifestyle!<br>Some members stop in for <b>10 minutes every day after work</b>, while others come for <b>1 hour once a week</b>.<br>The key is finding a sustainable pace you can keep up long-term 😊'
    },
    {
      cat: 'training',
      q_ja: '1回何分くらいトレーニングすればいいですか？', q_en: 'How long should I work out?',
      keys_ja: ['何分', 'トレーニング時間', 'どのくらい', '時間 どれくらい', '1回 何分'],
      keys_en: ['how long', 'duration', 'minutes', 'workout time', 'how many minutes'],
      a_ja: '初めての方は<b>30〜45分</b>、慣れてきたら<b>45〜60分</b>が目安です。<br>長くやりすぎるより、継続することが大切です！',
      a_en: 'Beginners: aim for <b>30-45 minutes</b>. As you progress, <b>45-60 minutes</b> is ideal.<br>Consistency matters more than duration!'
    },
    {
      cat: 'training',
      q_ja: '効果はいつごろ出ますか？', q_en: 'When will I see results?',
      keys_ja: ['効果', 'いつ', '結果', '変化', '効果 出る', 'いつ 変わる', '体 変わる'],
      keys_en: ['results', 'when', 'change', 'effect', 'progress', 'when will I see'],
      a_ja: '継続的に取り組むことで、早ければ<b>1〜2ヶ月で変化を実感</b>する方が多いです。<br>まずは<b>3ヶ月継続</b>を目標にしましょう！',
      a_en: 'With consistent training, many people notice changes within <b>1-2 months</b>.<br>Set a goal of <b>3 months</b> to see significant results!'
    },
    {
      cat: 'training',
      keys_ja: ['筋肉 痛', '筋肉痛', '次の日 痛い', '筋肉痛 ならない'],
      keys_en: ['muscle soreness', 'sore muscles', 'muscle pain', 'soreness'],
      a_ja: '筋肉痛は筋肉が成長しているサインです！<br>痛みが強い場合は1〜2日休んで回復させましょう。軽い有酸素運動で血行を良くするのも効果的です。',
      a_en: 'Muscle soreness means your muscles are growing! If severe, rest 1-2 days. Light cardio can help speed recovery.'
    },
    {
      cat: 'training',
      keys_ja: ['食事', '栄養', 'プロテイン', 'タンパク質', '食べる'],
      keys_en: ['diet', 'nutrition', 'protein', 'food', 'what to eat'],
      a_ja: 'トレーニング効果を高めるために、<b>タンパク質を意識した食事</b>がおすすめです。<br>トレーニング後30分以内にタンパク質を摂ると効果的です。',
      a_en: 'For best results, focus on a <b>protein-rich diet</b>.<br>Consuming protein within 30 minutes after your workout is especially effective.'
    },

    /* ---------- Training Effects & Techniques (追加30問) ---------- */
    {
      cat: 'training',
      keys_ja: ['ラットプルダウン 効果', 'ラット 効果', '広背筋 効果', '逆三角形 体', '背中 広がる'],
      keys_en: ['lat pulldown effect', 'lat pulldown benefit', 'lats benefit', 'wide back'],
      a_ja: '<b>ラットプルダウン</b>を継続すると、<b>広背筋・僧帽筋・上腕二頭筋</b>が鍛えられます。<br>背中が広がって<b>逆三角形のシルエット</b>が作られ、猫背の改善にも効果的です。',
      a_en: 'The <b>Lat Pulldown</b> targets your <b>lats, trapezius, and biceps</b>.<br>It widens your back into a <b>V-taper</b> and helps correct rounded posture.'
    },
    {
      cat: 'training',
      keys_ja: ['シーテッドロウ 効果', 'ロウ 効果', '背中 引き締め', '菱形筋', '巻き肩 改善'],
      keys_en: ['seated row effect', 'rowing benefit', 'back rowing result', 'rhomboid'],
      a_ja: '<b>シーテッドロウ</b>は<b>広背筋・菱形筋・僧帽筋中部</b>を鍛えます。<br>巻き肩や猫背の改善に特に効果的で、背中の引き締めにもおすすめです。',
      a_en: '<b>Seated Row</b> works your <b>lats, rhomboids, and mid-trapezius</b>.<br>It is especially effective at correcting rounded shoulders and hunched posture.'
    },
    {
      cat: 'training',
      keys_ja: ['レッグプレス 効果', 'レッグ 効果', '大腿四頭筋 鍛える', 'お尻 鍛える 効果', '脚 引き締め 効果'],
      keys_en: ['leg press effect', 'leg press benefit', 'leg press result', 'quad training'],
      a_ja: '<b>レッグプレス</b>は<b>大腿四頭筋・ハムストリング・臀筋（お尻）</b>を同時に鍛えます。<br>脚全体の引き締めやヒップアップに効果的で、日常生活の動作も楽になります。',
      a_en: '<b>Leg Press</b> trains your <b>quads, hamstrings, and glutes</b> all at once.<br>Great for toning legs and lifting the glutes, while also making everyday movements easier.'
    },
    {
      cat: 'training',
      keys_ja: ['アブドミナルクランチ 効果', 'クランチ 効果', '腹直筋 効果', '腹筋 引き締め 効果', '腹筋マシン 効果'],
      keys_en: ['crunch effect', 'ab crunch benefit', 'abdominal crunch result', 'abs machine benefit'],
      a_ja: '<b>アブドミナルクランチ</b>は<b>腹直筋（お腹正面の筋肉）</b>を集中して鍛えます。<br>正しいフォームで行うことでシックスパックに近づき、体幹の安定にもつながります。',
      a_en: '<b>Abdominal Crunch</b> isolates your <b>rectus abdominis</b> (front abs).<br>Done correctly, it develops six-pack definition and improves core stability.'
    },
    {
      cat: 'training',
      keys_ja: ['ロータリートルソー 効果', 'トルソー 効果', '腹斜筋 効果', 'くびれ 効果', 'わき腹 引き締め 効果'],
      keys_en: ['rotary torso effect', 'torso machine benefit', 'oblique training result', 'waist training effect'],
      a_ja: '<b>ロータリートルソー</b>は<b>腹斜筋（わき腹の筋肉）</b>を重点的に鍛えます。<br>ウエストのくびれ形成や体幹の安定性アップに効果的です。左右バランスよく行いましょう。',
      a_en: '<b>Rotary Torso</b> targets your <b>obliques</b> (side abs).<br>Effective for creating a slimmer waistline and building core stability. Always train both sides equally.'
    },
    {
      cat: 'training',
      keys_ja: ['呼吸 筋トレ', '呼吸法', '息 吸う タイミング', '吸う 吐く トレーニング', '呼吸 やり方'],
      keys_en: ['breathing workout', 'how to breathe exercise', 'inhale exhale training', 'breathing technique gym'],
      a_ja: '筋トレ中の基本的な呼吸法は、<b>力を入れるとき（収縮時）に息を吐き</b>、<b>戻すときに吸う</b>です。<br>息を止めると血圧が上がりやすいので、呼吸を止めずに行いましょう。',
      a_en: 'The basic rule: <b>exhale when exerting force</b> (the hard phase), <b>inhale on the return</b>.<br>Never hold your breath — it raises blood pressure. Keep breathing throughout the movement.'
    },
    {
      cat: 'training',
      keys_ja: ['何セット', 'セット数', 'セット 何回', '1日 何セット', 'セット どのくらい'],
      keys_en: ['how many sets', 'number of sets', 'sets per exercise', 'sets per workout'],
      a_ja: '初心者の方は<b>1種目あたり2〜3セット</b>から始めるのがおすすめです。<br>慣れてきたら<b>3〜4セット</b>に増やしましょう。セット間の休憩は<b>60〜90秒</b>が目安です。',
      a_en: 'For beginners, start with <b>2-3 sets per exercise</b>.<br>As you progress, increase to <b>3-4 sets</b>. Rest <b>60-90 seconds</b> between sets.'
    },
    {
      cat: 'training',
      keys_ja: ['何回', 'レップ数', '回数', '1セット 何回', '何回 やれば'],
      keys_en: ['how many reps', 'reps per set', 'repetitions', 'number of reps'],
      a_ja: '目的によって異なります。<br>・<b>筋力アップ</b>：4〜6回（重め）<br>・<b>バランスよく鍛える</b>：8〜12回（中程度）<br>・<b>引き締め・持久力</b>：15〜20回（軽め）<br>初心者は<b>10〜15回</b>を目安にしましょう。',
      a_en: 'It depends on your goal:<br>・<b>Strength</b>: 4-6 reps (heavy)<br>・<b>Balanced training</b>: 8-12 reps (moderate)<br>・<b>Toning/endurance</b>: 15-20 reps (light)<br>Beginners: aim for <b>10-15 reps</b>.'
    },
    {
      cat: 'training',
      keys_ja: ['重さ 設定', '重量 どのくらい', '重さ どれくらい', '重量 目安', '負荷 設定'],
      keys_en: ['weight setting', 'how much weight', 'weight selection', 'load setting'],
      a_ja: '目安は<b>10〜12回ギリギリできる重さ</b>から始めましょう。<br>最後の2〜3回がきつく感じる重さがちょうど良いです。軽すぎると効果が出にくく、重すぎるとフォームが崩れ怪我の原因になります。',
      a_en: 'Start with a weight where <b>the last 2-3 reps of 10-12 feel challenging</b>.<br>Too light = less effect. Too heavy = poor form and injury risk.'
    },
    {
      cat: 'training',
      keys_ja: ['ウォーミングアップ', '準備運動', 'ストレッチ 前', '筋トレ 前 何する', '運動 前 準備'],
      keys_en: ['warm up', 'pre workout stretch', 'before training', 'warm-up routine'],
      a_ja: 'トレーニング前は<b>5〜10分の軽い有酸素運動</b>（ウォーキングや自転車など）で体を温めてから、<b>動的ストレッチ</b>を行うのがおすすめです。<br>冷えた筋肉を動かすと怪我のリスクが高まります。',
      a_en: 'Before training, do <b>5-10 minutes of light cardio</b> (walking, cycling) to warm up, then <b>dynamic stretching</b>.<br>Moving cold muscles increases injury risk.'
    },
    {
      cat: 'training',
      keys_ja: ['クールダウン', 'ストレッチ 後', '筋トレ 後 何する', '運動 後 ストレッチ', '終わった後'],
      keys_en: ['cool down', 'post workout stretch', 'after training', 'stretching after workout'],
      a_ja: 'トレーニング後は<b>静的ストレッチ</b>でゆっくり筋肉を伸ばしましょう。<br>1ヶ所20〜30秒キープが目安です。血流が促進されて疲労回復が早まり、翌日の筋肉痛を和らげる効果もあります。',
      a_en: 'After training, do <b>static stretching</b> — hold each stretch for 20-30 seconds.<br>This improves blood flow, speeds recovery, and reduces next-day soreness.'
    },
    {
      cat: 'training',
      keys_ja: ['水分補給', '水 飲む', 'トレーニング中 水', '水 どのくらい飲む', '飲み物'],
      keys_en: ['hydration', 'drinking water workout', 'water during exercise', 'how much water'],
      a_ja: 'トレーニング中は<b>こまめな水分補給</b>が大切です。<br>のどが渇く前に<b>150〜200ml</b>を目安に飲みましょう。当ジムには<b>ウォーターサーバー</b>を完備していますのでご利用ください。',
      a_en: 'Stay hydrated throughout your workout — drink <b>150-200ml</b> regularly, before you feel thirsty.<br>Our gym has a <b>free water server</b> available for members.'
    },
    {
      cat: 'training',
      keys_ja: ['姿勢 改善', '姿勢 良くなる', '猫背 治す', '猫背 改善', '姿勢 筋トレ'],
      keys_en: ['posture improvement', 'fix posture', 'fix hunchback', 'posture training', 'improve posture'],
      a_ja: '姿勢改善には<b>ラットプルダウン</b>と<b>シーテッドロウ</b>が特に効果的です。<br>背面の筋肉（広背筋・菱形筋）を鍛えることで肩が引き戻され、自然と背筋が伸びるようになります。',
      a_en: 'For posture improvement, <b>Lat Pulldown</b> and <b>Seated Row</b> are most effective.<br>Strengthening the back muscles (lats, rhomboids) pulls the shoulders back for a naturally upright posture.'
    },
    {
      cat: 'training',
      keys_ja: ['肩こり 改善', '肩こり 筋トレ', '肩こり 解消', '肩 こり マシン', '肩甲骨 ほぐす'],
      keys_en: ['shoulder stiffness', 'shoulder tension relief', 'stiff shoulders exercise', 'shoulder pain training'],
      a_ja: '肩こりの改善には<b>シーテッドロウ</b>がおすすめです。<br>肩甲骨まわりの筋肉（菱形筋・僧帽筋）を動かすことで血行が促進されます。有酸素マシンで体全体の血流を上げるのも効果的です。',
      a_en: '<b>Seated Row</b> is recommended for shoulder stiffness.<br>Moving the muscles around your shoulder blades improves circulation. Light cardio also helps boost overall blood flow.'
    },
    {
      cat: 'training',
      keys_ja: ['腰痛 筋トレ', '腰痛 大丈夫', '腰 痛い', '腰痛 対策', '腰 鍛える'],
      keys_en: ['lower back pain exercise', 'back pain training', 'bad back workout', 'lumbar training'],
      a_ja: '軽度の腰痛がある場合は、痛みが強い日は無理せず休みましょう。<br>腰痛予防・改善には<b>体幹強化（ロータリートルソー・クランチ）</b>と<b>レッグプレス</b>で脚の筋力をつけることが効果的です。<br>痛みが続く場合は医師にご相談ください。',
      a_en: 'If you have mild lower back pain, rest on bad days. For prevention and recovery, strengthen your core (<b>Rotary Torso, Crunch</b>) and legs (<b>Leg Press</b>).<br>Consult a doctor if pain persists.'
    },
    {
      cat: 'training',
      keys_ja: ['膝 悪い', '膝 痛い', '膝 負担', '膝 筋トレ', '膝 マシン'],
      keys_en: ['knee pain exercise', 'bad knees workout', 'knee friendly', 'knee training'],
      a_ja: '膝に不安がある場合は<b>シーテッドロウ</b>や<b>ラットプルダウン</b>など上半身マシンを中心にしましょう。<br><b>レッグプレス</b>は膝への負担が比較的少なく、太ももの筋力をつけることで膝を守る効果もあります。無理せず軽い重さから始めてください。',
      a_en: 'With knee concerns, focus on upper-body machines like <b>Seated Row</b> and <b>Lat Pulldown</b>.<br><b>Leg Press</b> has relatively low knee stress and strengthening your quads can actually protect the knee. Start light.'
    },
    {
      cat: 'training',
      keys_ja: ['基礎代謝 上げる', '代謝 アップ', '基礎代謝 筋トレ', '太りにくい 体', '代謝 良くなる'],
      keys_en: ['boost metabolism', 'increase metabolism', 'metabolic rate training', 'burn more calories'],
      a_ja: '<b>筋肉量を増やすと基礎代謝が上がり</b>、安静時のカロリー消費量が増えます。<br>レッグプレスなど大きな筋肉群（脚・臀部）を鍛えると代謝アップ効果が高いです。筋トレ後は数時間代謝が高まる「アフターバーン効果」もあります。',
      a_en: '<b>More muscle mass = higher metabolism</b>, meaning you burn more calories even at rest.<br>Training large muscle groups like legs and glutes (Leg Press) gives the biggest metabolic boost. Post-workout "afterburn" also keeps metabolism elevated for hours.'
    },
    {
      cat: 'training',
      keys_ja: ['体脂肪率 下げる', '脂肪 減らす', '体脂肪 落とす', '体脂肪率 改善', '体脂肪 筋トレ'],
      keys_en: ['reduce body fat', 'lower body fat percentage', 'fat loss training', 'body fat reduction'],
      a_ja: '体脂肪率を下げるには<b>筋トレ＋有酸素運動の組み合わせ</b>が最も効果的です。<br>筋トレで基礎代謝を上げ、有酸素マシン（トレッドミルなど）で脂肪を燃焼させるとダブルの効果が得られます。食事管理も合わせて行いましょう。',
      a_en: 'The most effective approach: <b>weight training + cardio combined</b>.<br>Weights raise your metabolism; cardio (treadmill etc.) burns fat directly. Pair it with mindful eating for best results.'
    },
    {
      cat: 'training',
      keys_ja: ['有酸素 筋トレ 順番', '筋トレ 先 有酸素 後', '有酸素 先 筋トレ 後', 'どちらが先'],
      keys_en: ['cardio before weights', 'weights before cardio', 'cardio vs weights order', 'which first'],
      a_ja: '<b>ダイエット・脂肪燃焼</b>が目的なら「<b>筋トレ → 有酸素</b>」の順がおすすめです。<br>筋トレでグリコーゲンを消費してから有酸素を行うと、脂肪が燃えやすくなります。逆に体力向上が目的なら有酸素から始めても構いません。',
      a_en: 'For <b>fat loss</b>: do <b>weights first, then cardio</b>.<br>Lifting depletes glycogen, making cardio more effective at burning fat afterward. For general fitness, either order works.'
    },
    {
      cat: 'training',
      keys_ja: ['有酸素 時間 どのくらい', '有酸素運動 何分', 'トレッドミル 時間', '有酸素 効果 時間'],
      keys_en: ['cardio duration', 'how long cardio', 'treadmill time', 'cardio minutes'],
      a_ja: '脂肪燃焼を目的とした有酸素運動は<b>20〜40分</b>が目安です。<br>開始後<b>約20分</b>から脂肪が燃えやすくなると言われています。無理なく続けられる強度（少し息が上がる程度）で行いましょう。',
      a_en: 'For fat burning, aim for <b>20-40 minutes of cardio</b>.<br>Fat burning kicks in more efficiently after around <b>20 minutes</b>. Keep the intensity moderate — slightly breathless but still able to talk.'
    },
    {
      cat: 'training',
      keys_ja: ['休養日 いつ', '休む日 必要', '毎日 筋トレ', '筋トレ 休み 必要', '回復 日'],
      keys_en: ['rest day', 'how often to rest', 'recovery day', 'should I rest', 'rest between workouts'],
      a_ja: '筋肉は<b>休んでいる間に成長</b>します。同じ部位を鍛えた後は<b>48〜72時間の休養</b>を設けるのが理想的です。<br>毎日来館する場合は、当日は別の部位を鍛えるなど部位を分けると効果的です。',
      a_en: 'Muscles <b>grow during rest</b>, not during training. Allow <b>48-72 hours</b> before targeting the same muscle group again.<br>If you visit daily, split muscle groups so each area gets adequate recovery time.'
    },
    {
      cat: 'training',
      keys_ja: ['同じ部位 毎日', '毎日 腹筋', '毎日 同じ マシン', '同じ 筋肉 毎日'],
      keys_en: ['same muscle every day', 'train abs daily', 'daily same muscle', 'workout same area'],
      a_ja: '同じ筋肉を<b>毎日鍛えるのはおすすめしません</b>。筋肉が修復・成長する時間が必要です。<br>腹筋は回復が比較的早いため週3〜4回なら問題ありませんが、大きな筋肉群（脚・背中）は少なくとも1日おきにしましょう。',
      a_en: '<b>Training the same muscle daily is not recommended</b> — muscles need time to repair and grow.<br>Abs recover faster and can be trained 3-4 times a week, but larger groups (legs, back) need at least a day of rest between sessions.'
    },
    {
      cat: 'training',
      keys_ja: ['筋肉 つける コツ', '筋肉 増やす 方法', '筋肉量 アップ', 'マッスル アップ'],
      keys_en: ['build muscle', 'muscle building tips', 'gain muscle', 'how to get bigger'],
      a_ja: '筋肉をつけるには<b>①適切な負荷のトレーニング ②十分な休養 ③タンパク質を含む食事</b>の3つが重要です。<br>重さを少しずつ増やす「<b>漸進性過負荷の原則</b>」を意識すると効果的です。',
      a_en: 'Building muscle requires <b>① proper training load ② adequate rest ③ protein-rich diet</b>.<br>Gradually increasing weight over time (progressive overload) is key to continued progress.'
    },
    {
      cat: 'training',
      keys_ja: ['体 引き締める', '引き締め', 'トーニング', '体 締める 筋トレ', 'しなやか な 体'],
      keys_en: ['toning', 'body toning', 'tone up', 'lean body', 'slim and tone'],
      a_ja: '体を引き締めるには<b>軽めの重さで回数多め（15〜20回）</b>のトレーニングと有酸素運動の組み合わせが効果的です。<br>当ジムの5種類のマシンは初心者でも引き締め目的に十分対応できます。',
      a_en: 'For toning, use <b>lighter weights with higher reps (15-20)</b> combined with cardio.<br>All 5 machines at our gym are well-suited for toning goals, even for beginners.'
    },
    {
      cat: 'training',
      keys_ja: ['女性 筋トレ', '女性 マシン', '女性 おすすめ', 'レディース', '女性 向け'],
      keys_en: ['women training', 'female workout', 'women gym', 'ladies training', 'women machines'],
      a_ja: '女性の方に人気なのは、<b>ロータリートルソー（くびれ・腹斜筋）</b>・<b>アブドミナルクランチ（腹筋）</b>・<b>レッグプレス（ヒップアップ・美脚）</b>です。<br>筋肉ムキムキになる心配はなく、むしろしなやかな体づくりに最適です。',
      a_en: 'Popular machines for women: <b>Rotary Torso</b> (waist/obliques), <b>Abdominal Crunch</b> (abs), <b>Leg Press</b> (glutes & legs).<br>No need to worry about getting bulky — these machines are ideal for achieving a lean, toned physique.'
    },
    {
      cat: 'training',
      keys_ja: ['高齢者 筋トレ', 'シニア', '年配 筋トレ', '60代 70代 筋トレ', 'お年寄り 筋トレ'],
      keys_en: ['senior training', 'elderly workout', 'older adults gym', 'senior fitness'],
      a_ja: 'シニアの方にも安全にご利用いただけます。<b>レッグプレス</b>で脚力を維持することは転倒予防に効果的です。<br>軽い負荷から始め、ご自身のペースで無理なく続けていただけます。マシン横の説明書きでいつでも確認できます。',
      a_en: 'Seniors can use our gym safely. <b>Leg Press</b> maintains leg strength, which is effective for fall prevention.<br>Start light and work at your own pace. Usage guides are posted beside every machine.'
    },
    {
      cat: 'training',
      keys_ja: ['ストレス 解消', 'ストレス 発散', '気分転換', 'リフレッシュ', '精神的 効果'],
      keys_en: ['stress relief', 'mental health exercise', 'mood boost workout', 'stress exercise'],
      a_ja: '運動は<b>エンドルフィン（幸福ホルモン）</b>を分泌し、ストレス解消・気分向上に効果的です。<br>特に有酸素マシン（トレッドミルなど）は短時間でもリフレッシュ効果が高く、仕事帰りの気分転換におすすめです。',
      a_en: 'Exercise releases <b>endorphins</b> that relieve stress and boost mood.<br>Cardio machines like the treadmill are especially effective for a quick mental refresh — perfect for unwinding after work.'
    },
    {
      cat: 'training',
      keys_ja: ['血行 改善', '血流 良くなる', '冷え性 改善', '血行 筋トレ', '血流 アップ'],
      keys_en: ['blood circulation', 'improve circulation', 'cold hands feet exercise', 'circulation training'],
      a_ja: '筋トレや有酸素運動を行うことで<b>血行が促進</b>され、全身に酸素・栄養が行き渡りやすくなります。<br>冷え性の改善や疲労回復にも効果的です。特に<b>レッグプレス</b>で下半身の血流を上げると全身循環が改善されます。',
      a_en: 'Exercise <b>boosts circulation</b>, delivering more oxygen and nutrients throughout your body.<br>Effective for cold extremities and recovery. <b>Leg Press</b> is particularly good for improving lower-body circulation and overall flow.'
    },
    {
      cat: 'training',
      keys_ja: ['睡眠 改善', '睡眠 質 上がる', '眠れる', '不眠 改善', '睡眠 運動'],
      keys_en: ['sleep improvement', 'better sleep exercise', 'insomnia workout', 'sleep quality training'],
      a_ja: '適度な運動は<b>睡眠の質を高める</b>ことが研究で示されています。<br>トレーニング後は体温が徐々に下がり、自然と眠りに入りやすくなります。ただし就寝直前の激しい運動は逆効果になる場合があるため、<b>就寝2〜3時間前</b>までにトレーニングを終えるのが理想です。',
      a_en: 'Regular exercise is proven to <b>improve sleep quality</b>.<br>Post-workout body temperature drop naturally eases you into sleep. However, intense exercise right before bed can be counterproductive — ideally finish training <b>2-3 hours before bedtime</b>.'
    },
    {
      cat: 'training',
      keys_ja: ['マシン 注意点', '安全 使い方', '怪我 しない', '安全 筋トレ', 'マシン 気をつける'],
      keys_en: ['machine safety', 'safe training', 'avoid injury', 'gym safety tips', 'machine precautions'],
      a_ja: '安全にお使いいただくためのポイントです。<br>①急に重い重量にしない<br>②フォームを崩してまでやらない<br>③体の異変を感じたら即中止<br>④マシン横のQRコードで正しい使い方を確認<br>ご不明な点はフリーダイヤル<b>0120-368-098</b>までお問い合わせください。',
      a_en: 'Key safety points:<br>① Don\'t jump to heavy weights too soon<br>② Never sacrifice form to lift more<br>③ Stop immediately if something feels wrong<br>④ Check QR codes by each machine for correct usage<br>Questions? Call us at <b>0120-368-098</b>.'
    },

    /* ---------- お悩み診断（30〜40代女性向け） ---------- */
    {
      cat: 'concern',
      keys_ja: ['お腹まわりや後ろ姿', 'シルエットが気になる', 'お腹まわり', '後ろ姿', 'ぽっこり', 'たるみ', 'ボディライン'],
      keys_en: ['belly and backside', 'silhouette', 'body shape concern', 'sagging'],
      a_ja: '年齢とともに気になりますよね…でも大丈夫！<b>お尻とお腹は裏切りません</b>。<br>まずは当ジム自慢の『<b>MATRIXの筋トレマシン</b>』で軽い負荷から始めてみませんか？特に<b>ラットプルダウン（背中）</b>や<b>レッグプレス（足・お尻）</b>がおすすめ。<br>後ろ姿が引き締まると、いつものジーンズが驚くほど綺麗に穿けるようになりますよ！<br>まずは<b>週1回、15分</b>から始めてみましょう♪',
      a_en: 'It happens to all of us with age — but don\'t worry! <b>Your glutes and abs never betray you.</b><br>Start light on our <b>MATRIX machines</b> — especially the <b>Lat Pulldown</b> (back) and <b>Leg Press</b> (legs & glutes).<br>Once your backside firms up, your favorite jeans will fit beautifully again!<br>Start with just <b>15 minutes, once a week</b> ♪'
    },
    {
      cat: 'concern',
      keys_ja: ['イライラ・ストレス', 'サクッと発散', 'イライラ', 'ストレスを発散', 'ストレス発散', 'モヤモヤ'],
      keys_en: ['stress relief quick', 'frustration', 'blow off steam', 'work stress family'],
      a_ja: '毎日本当にお疲れ様です！イライラは体に溜め込まず、<b>ジムで汗と一緒に流しちゃいましょう</b>。<br>おすすめは『<b>トレッドミル（ランニングマシン）</b>』で好きな音楽を聴きながら、ちょっと早歩きやランニングをすること。<br><b>20分</b>もすれば脳内から幸せホルモンが出て、モヤモヤがすっきり吹き飛びますよ。<br>スマイル24は24時間いつでも逃げ込める<b>あなたの秘密基地</b>です！',
      a_en: 'You work so hard every day! Don\'t bottle up that stress — <b>sweat it out at the gym</b>.<br>Try the <b>treadmill</b> with your favorite music: a brisk walk or light jog.<br>In just <b>20 minutes</b>, happy hormones kick in and the frustration melts away.<br>Smile24 is your <b>24-hour secret hideout</b>, always open when you need it!'
    },
    {
      cat: 'concern',
      keys_ja: ['肩こりや腰痛', '冷え性をなんとかして', '体を軽くしたい', '肩こり', '腰痛', '冷え性', 'バキバキ'],
      keys_en: ['stiff shoulders back pain', 'cold sensitivity', 'feel lighter', 'body stiffness'],
      a_ja: 'デスクワークや毎日の家事で体はバキバキですよね。ガチガチの体を放置すると代謝も落ちてしまいます。<br>まずはトレーニング前の『<b>広々としたストレッチエリア</b>』でしっかり体を伸ばすことから始めましょう。<br>その後、<b>軽い有酸素運動</b>で血行を良くするだけで、肩や腰が驚くほど軽くなります。<br>無料の<b>ウォーターサーバー</b>でお水をしっかり飲みながら、デトックスしていきましょう！',
      a_en: 'Desk work and daily chores leave your body stiff as a board — and stiffness slows your metabolism.<br>Start by stretching in our <b>spacious stretch area</b> before training.<br>Then some <b>light cardio</b> to boost circulation — your shoulders and back will feel amazingly lighter.<br>Stay hydrated at our <b>free water server</b> and detox as you go!'
    },
    {
      cat: 'concern',
      keys_ja: ['何年もしてない超初心者', 'マシンの使い方も不安', '超初心者', '運動なんて何年も', '何年もしてない'],
      keys_en: ['total beginner years', 'nervous about machines', 'havent exercised in years'],
      a_ja: '<b>大歓迎です！</b>スマイル24に通う多くの方が、実は同じ不安を持ってスタートしています。<br>館内のマシンには全て<b>丁寧な使い方の説明</b>がありますし、この<b>AIアシスタント</b>や<b>公式LINE</b>でもいつでも確認できます。<br>まずは室内用シューズを持って、<b>無料見学・体験</b>から始めてみませんか？<br>最初は『マシンのシートに座ってみるだけ』でも大きな一歩です！',
      a_en: '<b>You are so welcome!</b> Most of our members started with the exact same worries.<br>Every machine has <b>clear instructions</b> posted, and you can always ask this <b>AI assistant</b> or our <b>official LINE</b>.<br>Why not start with a <b>free tour & trial</b>? Just bring indoor shoes.<br>Even "just sitting on a machine" is a big first step!'
    },
    {
      cat: 'concern',
      keys_ja: ['まとまった時間が取れない', '20〜30分しかいられない', '意味ある', 'スキマ時間', '時間がない', '短い時間でも'],
      keys_en: ['only 20-30 minutes', 'short workout worth it', 'no time', 'busy schedule gym'],
      a_ja: '<b>めちゃくちゃ意味あります！</b>むしろ30代・40代の忙しい女性には、<b>20〜30分の『サクッとジム』</b>が一番続きます。<br>仕事帰りや買い物のついでに<b>15分だけランニングマシンを歩く</b>、それだけで年間を通せば大きな健康・ダイエット効果になります。<br>24時間いつでも開いているので、あなたの生活リズムを崩さずに<b>スキマ時間を有効活用</b>できますよ！',
      a_en: '<b>Absolutely worth it!</b> For busy women in their 30s-40s, a <b>quick 20-30 minute session</b> is actually the most sustainable.<br>Just <b>15 minutes of walking</b> on the treadmill after work or errands adds up to major health benefits over a year.<br>Open 24 hours, so you can use those <b>pockets of spare time</b> without disrupting your routine!'
    }
  ];

  /* ── Category Suggestions ──────────────────────────── */
  var CAT_SUGG = {
    concern: {
      ja: [
        '最近、お腹まわりや後ろ姿（お尻）のシルエットが気になる…',
        '仕事や家事、育児のイライラ・ストレスをサクッと発散したい！',
        'ひどい肩こりや腰痛、冷え性をなんとかして体を軽くしたい',
        '運動なんて何年もしてない超初心者。マシンの使い方も不安…',
        'まとまった時間が取れない。1回20〜30分しかいられないけど意味ある？'
      ],
      en: [
        'My belly and backside silhouette bother me lately…',
        'I want quick stress relief from work, chores and parenting!',
        'Stiff shoulders, back pain and cold sensitivity — I want to feel lighter',
        'Total beginner, haven\'t exercised in years. Nervous about machines…',
        'I only have 20-30 minutes per visit. Is that even worth it?'
      ]
    },
    pricing: {
      ja: ['月額はいくらですか？', '入会金はいくらですか？', '月の途中で入会した場合は？', '解約はいつでもできますか？', '無料見学・体験はできますか？'],
      en: ['What is the monthly fee?', 'Is there a registration fee?', 'Can I join mid-month?', 'Can I cancel anytime?', 'Is a free tour available?']
    },
    facility: {
      ja: ['場所はどこですか？', '営業時間・休館日は？', '駐車場はありますか？', '女性一人でも安心ですか？', '何を持参すればいいですか？'],
      en: ['Where is the gym located?', 'What are the hours?', 'Is there parking?', 'Is it safe for women?', 'What should I bring?']
    },
    training: {
      ja: ['初心者でも大丈夫ですか？', '週に何回通うのがいいですか？', '1回何分くらいトレーニングすればいいですか？', '効果はいつごろ出ますか？'],
      en: ['Is it OK for beginners?', 'How often should I go?', 'How long should I work out?', 'When will I see results?']
    }
  };

  /* ── DOM ──────────────────────────────────────────── */
  var toggleBtn = document.getElementById('aiChatBtn');
  var panel     = document.getElementById('aiChatPanel');
  var msgBody   = document.getElementById('aiChatBody');
  var inputEl   = document.getElementById('aiChatInput');
  var sendBtn   = document.getElementById('aiChatSend');
  var closeBtn  = document.getElementById('aiChatClose');
  var catBtns   = document.querySelectorAll('.ai-chat__cat-btn');
  var langBtn   = document.getElementById('aiChatLangBtn');
  var hdName    = document.getElementById('aiChatHdName');
  var hdSub     = document.getElementById('aiChatHdSub');

  if (!toggleBtn || !panel) return;

  /* ── Open / Close ─────────────────────────────────── */
  var isOpen = false;

  toggleBtn.addEventListener('click', function () { openPanel(true); });
  closeBtn.addEventListener('click',  function () { openPanel(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) openPanel(false);
  });

  function openPanel(state) {
    isOpen = state;
    panel.classList.toggle('is-open', state);
    toggleBtn.setAttribute('aria-expanded', String(state));
    panel.setAttribute('aria-hidden', String(!state));
    if (state && !msgBody.children.length) {
      welcome();
      setTimeout(function () { if (inputEl) inputEl.focus(); }, 320);
    }
  }

  /* ── Language Toggle ──────────────────────────────── */
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      LANG = LANG === 'ja' ? 'en' : 'ja';
      langBtn.textContent = LANG === 'ja' ? 'EN' : '日';
      langBtn.title = LANG === 'ja' ? 'Switch to English' : '日本語に切り替え';
      syncUILang();
      reRenderHistory();
    });
  }

  function syncUILang() {
    if (hdName) hdName.textContent = LANG === 'ja' ? 'スマイル24 AIアシスタント' : 'Smile24 AI Assistant';
    if (hdSub)  hdSub.textContent  = LANG === 'ja' ? 'ご質問にお答えします'      : 'How can I help you?';
    var labels = {
      concern:  { ja: '💭 お悩み診断',    en: '💭 Concerns' },
      machine:  { ja: '🤖 機材・マシン', en: '🤖 Equipment' },
      pricing:  { ja: '💰 料金・入会',    en: '💰 Pricing' },
      facility: { ja: '🏠 施設・利用',    en: '🏠 Facility' },
      training: { ja: '💪 トレーニング',  en: '💪 Training' }
    };
    catBtns.forEach(function (b) {
      var m = labels[b.dataset.cat];
      if (m) b.textContent = m[LANG];
    });
    if (inputEl) inputEl.placeholder = LANG === 'ja' ? '質問を入力してください...' : 'Ask a question...';
  }

  /* ── Welcome ──────────────────────────────────────── */
  function welcome() {
    addBot(
      'こんにちは！<b>スマイル24 AIアシスタント</b>です🤖<br>「<b>💭 お悩み診断</b>」では、あなたのお悩みにぴったりのジムの過ごし方をご提案します♪<br>ご質問はカテゴリから選ぶか、気になることを入力してください。',
      'Hello! I\'m the <b>Smile24 AI Assistant</b> 🤖<br>Try <b>💭 Concerns</b> for a personalized suggestion, or pick a category / type your question below.'
    );
    addSuggs(
      ['運動なんて何年もしてない超初心者。マシンの使い方も不安…', 'どのような機材がありますか？', '月額はいくらですか？', '無料見学はできますか？'],
      ['Total beginner, haven\'t exercised in years. Nervous about machines…', 'What machines do you have?', 'What is the monthly fee?', 'Is a free tour available?']
    );
  }

  /* ── Category Buttons ─────────────────────────────── */
  catBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      catBtns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var cat = b.dataset.cat;
      addUser(b.textContent.trim());

      if (cat === 'machine') {
        delayedRespond(function () {
          addBot('<b>どの部位を鍛えたいですか？</b>以下から選んでください。', '<b>Which body part would you like to train?</b> Choose below.');
          addBodySelector();
        });
      } else if (cat === 'concern') {
        delayedRespond(function () {
          addBot(
            '毎日おつかれさまです😊 <b>あてはまるお悩み</b>を選んでください。<br>あなたにぴったりのジムの過ごし方をご提案します♪',
            'You\'re doing great every day 😊 <b>Pick the concern that fits you</b> — I\'ll suggest the perfect way to spend your gym time ♪'
          );
          addSuggs(CAT_SUGG.concern.ja, CAT_SUGG.concern.en);
        });
      } else {
        var JA_CAT = {pricing:'料金・入会', facility:'施設・利用', training:'トレーニング'};
        var EN_CAT = {pricing:'Pricing', facility:'Facility', training:'Training'};
        delayedRespond(function () {
          addBot(
            (JA_CAT[cat] || cat) + 'のよくあるご質問です。気になる項目を選んでください！',
            'Common questions about ' + (EN_CAT[cat] || cat) + '. Tap one to learn more!'
          );
          addSuggs(CAT_SUGG[cat]['ja'], CAT_SUGG[cat]['en']);
        });
      }
    });
  });

  /* ── Body Part Selector ───────────────────────────── */
  function addBodySelector() {
    MSG_HISTORY.push({t:'bodysel'});
    _renderBodySelector();
  }
  function _renderBodySelector() {
    var wrap = mkDiv('body-selector');
    var parts = PARTS[LANG];
    parts.forEach(function (p) {
      var b = document.createElement('button');
      b.className = 'body-part-btn';
      b.style.setProperty('--bpb-color', p.color);
      b.innerHTML = '<span class="bpb-label">' + esc(p.label) + '</span><span class="bpb-desc">' + esc(p.desc) + '</span>';
      b.addEventListener('click', function () {
        wrap.remove();
        addUser(p.label);
        delayedRespond(function () { handlePart(p.key); });
      });
      wrap.appendChild(b);
    });
    msgBody.appendChild(wrap);
    scroll();
  }

  function handlePart(key) {
    var pj = PARTS.ja.filter(function(p){ return p.key === key; })[0];
    var pe = PARTS.en.filter(function(p){ return p.key === key; })[0];
    if (key === 'cardio') {
      addBot('<b>有酸素系マシン</b>のご案内です。', '<b>Cardio Machines</b> — here\'s what we have.');
      addCardioCard();
      addBodySelectorOnScroll();
    } else if (key === 'all') {
      addBot('全<b>5種類</b>のマシンをご紹介します！', 'Here are all <b>5 machines</b>!');
      MACHINES.forEach(function (m) { addMachineCard(m); });
    } else {
      var machines = MACHINES.filter(function (m) { return m.parts.indexOf(key) >= 0; });
      if (machines.length) {
        addBot(
          (pj ? '<b>' + esc(pj.label.replace(/^[🔵🟢🟠🟡🟣]\s*/,'')) + '</b>' : '') + 'に効果的なマシンをご紹介します！',
          'Machines that target <b>' + (pe ? pe.label.replace(/^[🔵🟢🟠🟡🟣]\s*/,'') : key) + '</b>:'
        );
        machines.forEach(function (m) { addMachineCard(m); });
        addBodySelectorOnScroll();
      }
    }
  }

  /* ── Machine Card ─────────────────────────────────── */
  function addMachineCard(m) {
    MSG_HISTORY.push({t:'machine', m:m});
    _renderMachineCard(m);
  }
  function _renderMachineCard(m) {
    var card = mkDiv('machine-card');
    var muscleHtml = m.muscles[LANG].map(function (ms) {
      return '<span class="mc-muscle" style="background:' + m.color + '22;color:' + m.color + '">' + esc(ms) + '</span>';
    }).join('');
    var stepsHtml = m.steps[LANG].map(function (s) {
      return '<div class="mc-step">' + esc(s) + '</div>';
    }).join('');
    var grad = 'linear-gradient(to top, ' + m.color + 'f0 0%, ' + m.color + '80 55%, transparent 100%)';
    card.innerHTML =
      '<div class="mc-img-wrap">' +
        '<img src="' + m.img + '" alt="' + esc(m.name[LANG]) + '" class="mc-img" loading="lazy">' +
        '<div class="mc-img-overlay" style="background:' + grad + '">' +
          '<span class="mc-machine-name">' + esc(m.name[LANG]) + '</span>' +
          '<span class="mc-code">' + m.code + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="mc-body">' +
        '<div class="mc-muscles">' + muscleHtml + '</div>' +
        '<p class="mc-desc">' + m.desc[LANG] + '</p>' +
        '<div class="mc-step-list">' + stepsHtml + '</div>' +
        '<div class="mc-point">💡 ' + esc(m.point[LANG]) + '</div>' +
      '</div>';
    msgBody.appendChild(card);
    msgBody.scrollTop = card.offsetTop - 8;
  }

  /* ── Cardio Card ──────────────────────────────────── */
  function addCardioCard() {
    MSG_HISTORY.push({t:'cardio'});
    _renderCardioCard();
  }
  function _renderCardioCard() {
    var d = CARDIO[LANG];
    var card = mkDiv('cardio-card');
    var listHtml = d.list.map(function (item) {
      return '<div class="cc-item"><span class="cc-icon">' + item.icon + '</span>' +
        '<div><b>' + esc(item.name) + '</b><span class="cc-note">' + esc(item.note) + '</span></div></div>';
    }).join('');
    card.innerHTML =
      '<div class="cc-img-wrap mc-img-wrap">' +
        '<img src="' + d.img + '" alt="' + esc(d.name) + '" class="mc-img" loading="lazy">' +
        '<div class="cc-img-overlay">' +
          '<span>' + esc(d.name) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="mc-body">' +
        '<p class="mc-desc">' + esc(d.desc) + '</p>' +
        '<div class="cc-list">' + listHtml + '</div>' +
        '<div class="mc-point">💡 ' + esc(d.tip) + '</div>' +
      '</div>';
    msgBody.appendChild(card);
    msgBody.scrollTop = card.offsetTop - 8;
  }

  /* ── Send ─────────────────────────────────────────── */
  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  function handleSend() {
    var val = inputEl.value.trim();
    if (!val) return;
    inputEl.value = '';
    addUser(val);
    delayedRespond(function () { respond(val); });
  }

  /* ── 2-second Typing Indicator ───────────────────── */
  var typingEl = null;

  function delayedRespond(callback) {
    typingEl = mkDiv('ai-msg ai-msg--bot');
    typingEl.innerHTML =
      '<div class="ai-msg__icon" aria-hidden="true">🤖</div>' +
      '<div class="ai-msg__bubble ai-typing-bubble"><span></span><span></span><span></span></div>';
    msgBody.appendChild(typingEl);
    scroll();
    setTimeout(function () {
      if (typingEl && typingEl.parentNode) {
        typingEl.parentNode.removeChild(typingEl);
        typingEl = null;
      }
      callback();
    }, 2000);
  }

  /* ── Respond ──────────────────────────────────────── */
  function respond(query) {
    var hit = matchDB(query);
    if (!hit) {
      addBot(
        '申し訳ございません、ご質問の内容が確認できませんでした。<br>📞 <b>0120-368-098</b> またはお問い合わせフォームからお気軽にご連絡ください！',
        'Sorry, I couldn\'t find an answer to that.<br>Please contact us at 📞 <b>0120-368-098</b> or via our inquiry form!'
      );
      return;
    }

    if (hit.showMachine) {
      var sm = null;
      for (var k = 0; k < MACHINES.length; k++) { if (MACHINES[k].id === hit.showMachine) { sm = MACHINES[k]; break; } }
      if (sm) {
        addBot('<b>' + sm.name.ja + '</b>についてご説明します。', 'Here\'s the <b>' + sm.name.en + '</b> guide:');
        addMachineCard(sm);
        setTimeout(function() {
          addBot('他にも気になる部位はありますか？', 'Curious about other muscle groups?');
          addBodySelector();
        }, 400);
      }
    } else if (hit.showMachines) {
      if (hit.a_ja || hit.a_en) addBot(hit.a_ja, hit.a_en);
      hit.showMachines.forEach(function (id) {
        for (var k = 0; k < MACHINES.length; k++) { if (MACHINES[k].id === id) { addMachineCard(MACHINES[k]); break; } }
      });
      addBodySelectorOnScroll();
    } else if (hit.showBodySelector) {
      addBot(hit.a_ja, hit.a_en);
      addBodySelector();
    } else if (hit.showCardio) {
      if (hit.a_ja || hit.a_en) addBot(hit.a_ja, hit.a_en);
      addCardioCard();
    } else {
      addBot(hit.a_ja, hit.a_en);
    }

    /* キャンペーン情報を料金カテゴリに自動付加 */
    if (hit.cat === 'pricing' && CAMPAIGN) {
      MSG_HISTORY.push({t:'campaign'});
      _renderBot(LANG === 'ja'
        ? '🎉 <b>現在のキャンペーン情報：</b><br>' + CAMPAIGN
        : '🎉 <b>Current Campaign:</b><br>' + CAMPAIGN);
    }

    /* show up to 3 related questions */
    var related = [];
    for (var i = 0; i < DB.length; i++) {
      var d = DB[i];
      if (d.cat === hit.cat && d !== hit && (d.q_ja || d.q_en) && !d.showMachine) {
        related.push(d);
        if (related.length >= 3) break;
      }
    }
    if (related.length) {
      addSuggs(
        related.map(function(r){ return r.q_ja || ''; }).filter(Boolean),
        related.map(function(r){ return r.q_en || ''; }).filter(Boolean)
      );
    }
  }

  /* ── Match ────────────────────────────────────────── */
  function matchDB(query) {
    var q = query.toLowerCase().replace(/[\s　]+/g, ' ').trim();
    var best = 0, found = null;
    for (var i = 0; i < DB.length; i++) {
      var item = DB[i];
      var score = 0;
      var kws = (item.keys_ja || []).concat(item.keys_en || []);
      for (var j = 0; j < kws.length; j++) {
        if (q.indexOf(kws[j].toLowerCase()) >= 0) score += kws[j].length;
      }
      if (score > best) { best = score; found = item; }
    }
    return best >= 2 ? found : null;
  }

  /* ── UI Helpers ───────────────────────────────────── */
  /* ── User / Bot / Suggs ─────────────────────────────── */
  function addUser(text) {
    MSG_HISTORY.push({t:'user', text:text});
    _renderUser(text);
  }
  function _renderUser(text) {
    var el = mkDiv('ai-msg ai-msg--user');
    el.innerHTML = '<div class="ai-msg__bubble">' + esc(text) + '</div>';
    msgBody.appendChild(el); scroll();
  }

  function addBot(ja, en) {
    var en2 = (en !== undefined) ? en : ja;
    MSG_HISTORY.push({t:'bot', ja:ja, en:en2});
    _renderBot(LANG === 'ja' ? ja : en2);
  }
  function _renderBot(html) {
    var el = mkDiv('ai-msg ai-msg--bot');
    el.innerHTML = '<div class="ai-msg__icon" aria-hidden="true">🤖</div><div class="ai-msg__bubble">' + html + '</div>';
    msgBody.appendChild(el); scroll();
  }

  function addSuggs(ja_qs, en_qs) {
    var en2 = en_qs || ja_qs;
    MSG_HISTORY.push({t:'sugg', ja:ja_qs, en:en2});
    _renderSuggs(LANG === 'ja' ? ja_qs : en2);
  }
  function _renderSuggs(qs) {
    var wrap = mkDiv('ai-suggest');
    qs.forEach(function (q) {
      if (!q) return;
      var b = document.createElement('button');
      b.className = 'ai-suggest__btn';
      b.textContent = q;
      b.addEventListener('click', function () {
        wrap.remove();
        addUser(q);
        delayedRespond(function () { respond(q); });
      });
      wrap.appendChild(b);
    });
    if (wrap.children.length) { msgBody.appendChild(wrap); scroll(); }
  }

  /* ── Re-render history on language switch ───────────── */
  function reRenderHistory() {
    if (_scrollUnlock) { _scrollUnlock(); _scrollUnlock = null; }
    msgBody.innerHTML = '';
    MSG_HISTORY.forEach(function(entry) {
      if      (entry.t === 'user')    { _renderUser(entry.text); }
      else if (entry.t === 'bot')     { _renderBot(LANG === 'ja' ? entry.ja : entry.en); }
      else if (entry.t === 'machine') { _renderMachineCard(entry.m); }
      else if (entry.t === 'cardio')  { _renderCardioCard(); }
      else if (entry.t === 'bodysel') { _renderBodySelector(); }
      else if (entry.t === 'sugg')    { _renderSuggs(LANG === 'ja' ? entry.ja : entry.en); }
      else if (entry.t === 'campaign' && CAMPAIGN) {
        _renderBot(LANG === 'ja'
          ? '🎉 <b>現在のキャンペーン情報：</b><br>' + CAMPAIGN
          : '🎉 <b>Current Campaign:</b><br>' + CAMPAIGN);
      }
    });
    scroll();
  }

  function mkDiv(cls)  { var el = document.createElement('div'); el.className = cls; return el; }
  function scroll()    { msgBody.scrollTop = msgBody.scrollHeight; }
  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
