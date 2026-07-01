(function () {
  'use strict';

  /* ── Language ─────────────────────────────────────── */
  var LANG = 'ja';

  /* ── Campaign (キャンペーン情報: null=なし, 文字列で内容を入力) ── */
  var CAMPAIGN = null;
  // 例: var CAMPAIGN = '入会金無料キャンペーン実施中！（2026年8月末まで）';

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
      keys_ja: ['月額', '月会費', 'いくら', '料金', '費用', '値段', '月いくら', '会費'],
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
      a_ja: '最低利用期間の縛りは<b>ありません</b>。いつでもお気軽に退会いただけます。',
      a_en: 'There is <b>no minimum contract period</b>. You can cancel anytime with no penalty.'
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
      a_ja: 'もちろん大丈夫です！<br>ご入会時にスタッフが<b>全マシンの使い方を丁寧にご説明</b>します。<br>何でもお気軽にスタッフへお声がけください😊',
      a_en: 'Absolutely! When you join, our staff will give you a <b>full machine orientation</b>.<br>Feel free to ask staff any questions at any time 😊'
    },
    {
      cat: 'training',
      q_ja: '週に何回通うのがいいですか？', q_en: 'How often should I go?',
      keys_ja: ['週 何回', '頻度', '通う 頻度', '何回 来ればいい', '週 何日'],
      keys_en: ['how often', 'frequency', 'how many times', 'per week', 'days per week'],
      a_ja: '初めての方は<b>週2〜3回</b>からのスタートがおすすめです。<br>慣れてきたら週3〜4回を目標にしましょう！',
      a_en: 'For beginners, starting with <b>2-3 times per week</b> is ideal.<br>As you progress, aim for 3-4 times per week!'
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
    }
  ];

  /* ── Category Suggestions ──────────────────────────── */
  var CAT_SUGG = {
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
    });
  }

  function syncUILang() {
    if (hdName) hdName.textContent = LANG === 'ja' ? 'スマイル24 AIアシスタント' : 'Smile24 AI Assistant';
    if (hdSub)  hdSub.textContent  = LANG === 'ja' ? 'ご質問にお答えします'      : 'How can I help you?';
    var labels = {
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
    if (LANG === 'ja') {
      addBot('こんにちは！<b>スマイル24 AIアシスタント</b>です🤖<br>ご質問をどうぞ！カテゴリから選ぶか、気になることを入力してください。');
      addSuggs(['どのような機材がありますか？', '月額はいくらですか？', '月の途中で入会した場合は？', '無料見学はできますか？']);
    } else {
      addBot('Hello! I\'m the <b>Smile24 AI Assistant</b> 🤖<br>Ask me anything! Pick a category or type your question below.');
      addSuggs(['What machines do you have?', 'What is the monthly fee?', 'Can I join mid-month?', 'Is a free tour available?']);
    }
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
          addBot(LANG === 'ja' ? '<b>どの部位を鍛えたいですか？</b>以下から選んでください。' : '<b>Which body part would you like to train?</b> Choose below.');
          addBodySelector();
        });
      } else {
        delayedRespond(function () {
          var catLabel = b.textContent.trim();
          addBot(LANG === 'ja'
            ? catLabel + 'のよくあるご質問です。気になる項目を選んでください！'
            : 'Common questions about ' + catLabel + '. Tap one to learn more!');
          addSuggs(CAT_SUGG[cat][LANG]);
        });
      }
    });
  });

  /* ── Body Part Selector ───────────────────────────── */
  function addBodySelector() {
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
        delayedRespond(function () { handlePart(p.key, p.label); });
      });
      wrap.appendChild(b);
    });
    msgBody.appendChild(wrap);
    scroll();
  }

  function handlePart(key, label) {
    if (key === 'cardio') {
      addBot(LANG === 'ja' ? '<b>有酸素系マシン</b>のご案内です。' : '<b>Cardio Machines</b> — here\'s what we have.');
      addCardioCard();
    } else if (key === 'all') {
      addBot(LANG === 'ja' ? '全<b>5種類</b>のマシンをご紹介します！' : 'Here are all <b>5 machines</b>!');
      MACHINES.forEach(function (m) { addMachineCard(m); });
    } else {
      var machines = MACHINES.filter(function (m) { return m.parts.indexOf(key) >= 0; });
      if (machines.length) {
        addBot(LANG === 'ja'
          ? '<b>' + label + '</b>に効果的なマシンをご紹介します！'
          : 'Machines that target <b>' + label + '</b>:');
        machines.forEach(function (m) { addMachineCard(m); });
      }
    }
  }

  /* ── Machine Card ─────────────────────────────────── */
  function addMachineCard(m) {
    var card = mkDiv('machine-card');
    var muscleHtml = m.muscles[LANG].map(function (ms) {
      return '<span class="mc-muscle" style="background:' + m.color + '22;color:' + m.color + '">' + esc(ms) + '</span>';
    }).join('');
    var stepsHtml = m.steps[LANG].map(function (s) {
      return '<div class="mc-step">' + esc(s) + '</div>';
    }).join('');
    card.innerHTML =
      '<div class="mc-img-wrap">' +
        '<img src="' + m.img + '" alt="' + esc(m.name[LANG]) + '" class="mc-img" loading="lazy">' +
        '<div class="mc-img-overlay" style="background:' + m.color + 'dd">' +
          '<span class="mc-machine-name">' + esc(m.name[LANG]) + '</span>' +
          '<span class="mc-code">' + m.code + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="mc-body">' +
        '<div class="mc-muscles">' + muscleHtml + '</div>' +
        '<p class="mc-desc">' + m.desc[LANG] + '</p>' +
        '<div class="mc-point">💡 ' + esc(m.point[LANG]) + '</div>' +
      '</div>';
    msgBody.appendChild(card);
    scroll();
  }

  /* ── Cardio Card ──────────────────────────────────── */
  function addCardioCard() {
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
    scroll();
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
      addBot(LANG === 'ja'
        ? '申し訳ございません、ご質問の内容が確認できませんでした。<br>📞 <b>0120-368-098</b> またはLINEからお気軽にお問い合わせください！'
        : 'Sorry, I couldn\'t find an answer to that.<br>Please contact us at 📞 <b>0120-368-098</b> or via LINE!');
      return;
    }

    if (hit.showMachine) {
      var sm = null;
      for (var k = 0; k < MACHINES.length; k++) { if (MACHINES[k].id === hit.showMachine) { sm = MACHINES[k]; break; } }
      if (sm) {
        addBot(LANG === 'ja' ? '<b>' + sm.name.ja + '</b>についてご説明します。' : 'Here\'s the <b>' + sm.name.en + '</b> guide:');
        addMachineCard(sm);
      }
    } else if (hit.showMachines) {
      if (hit.a_ja || hit.a_en) addBot(LANG === 'ja' ? hit.a_ja : hit.a_en);
      hit.showMachines.forEach(function (id) {
        for (var k = 0; k < MACHINES.length; k++) { if (MACHINES[k].id === id) { addMachineCard(MACHINES[k]); break; } }
      });
    } else if (hit.showBodySelector) {
      addBot(LANG === 'ja' ? hit.a_ja : hit.a_en);
      addBodySelector();
    } else if (hit.showCardio) {
      if (hit.a_ja || hit.a_en) addBot(LANG === 'ja' ? hit.a_ja : hit.a_en);
      addCardioCard();
    } else {
      addBot(LANG === 'ja' ? hit.a_ja : hit.a_en);
    }

    /* キャンペーン情報を料金カテゴリに自動付加 */
    if (hit.cat === 'pricing' && CAMPAIGN) {
      addBot(LANG === 'ja'
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
      addSuggs(related.map(function (r) { return LANG === 'ja' ? (r.q_ja || '') : (r.q_en || ''); }).filter(Boolean));
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
  function addUser(text) {
    var el = mkDiv('ai-msg ai-msg--user');
    el.innerHTML = '<div class="ai-msg__bubble">' + esc(text) + '</div>';
    msgBody.appendChild(el); scroll();
  }

  function addBot(html) {
    var el = mkDiv('ai-msg ai-msg--bot');
    el.innerHTML = '<div class="ai-msg__icon" aria-hidden="true">🤖</div><div class="ai-msg__bubble">' + html + '</div>';
    msgBody.appendChild(el); scroll();
  }

  function addSuggs(qs) {
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
