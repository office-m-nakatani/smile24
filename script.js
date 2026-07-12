/**
 * script.js — スマイル24
 * 24時間フィットネスジム ホームページ
 */

'use strict';

/* ========================================
   ギャラリーデータ（lightbox用）
   画像を差し替える場合はここも合わせて更新してください
   ======================================== */
const GALLERY_IMAGES = [
  {
    src: 'images/hero.jpg',
    alt: 'スマイル24 館内全景 — MATRIXマシン・トレッドミルが揃う広々とした清潔な空間',
    caption: '館内全景'
  },
  {
    src: 'images/gym-01.jpg',
    alt: 'スマイル24 マシンエリア — MATRIXマシン・エアロバイク・トレッドミル完備',
    caption: 'マシンエリア'
  },
  {
    src: 'images/gym-03.jpg',
    alt: 'スマイル24 有酸素マシンエリア — トレッドミル・カーブドトレッドミル複数台',
    caption: '有酸素マシンエリア'
  },
  {
    src: 'images/gym-04.jpg',
    alt: 'スマイル24 フリーウェイトエリア — ベンチ・ダンベル各種・ゴムマット完備',
    caption: 'フリーウェイトエリア'
  },
  {
    src: 'images/gym-02.jpg',
    alt: 'スマイル24 ダンベル各種 — 1.5kgの軽量から重量まで幅広く揃っています',
    caption: 'ダンベル・フリーウェイト'
  },
  {
    src: 'images/gym-05.jpg',
    alt: 'スマイル24 ストレッチエリア — 広々としたストレッチマットで運動後のクールダウンも快適',
    caption: 'ストレッチエリア'
  }
];


/* ========================================
   ユーティリティ
   ======================================== */

/** 要素を取得（見つからなければ null） */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];


/* ========================================
   ヘッダー — スクロール時に背景を表示
   ======================================== */
function initHeader() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初回実行
}


/* ========================================
   ハンバーガーメニュー
   ======================================== */
function initHamburger() {
  const btn     = $('#hamburger');
  const nav     = $('#nav');
  const overlay = $('#navOverlay');
  if (!btn || !nav || !overlay) return;

  const open = () => {
    btn.classList.add('is-open');
    nav.classList.add('is-open');
    overlay.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'メニューを閉じる');
    document.body.style.overflow = 'hidden'; // スクロール禁止
  };

  const close = () => {
    btn.classList.remove('is-open');
    nav.classList.remove('is-open');
    overlay.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    btn.classList.contains('is-open') ? close() : open();
  });

  // オーバーレイクリックで閉じる
  overlay.addEventListener('click', close);

  // ナビリンククリックで閉じる
  $$('.header__nav-link', nav).forEach(link => {
    link.addEventListener('click', close);
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}


/* ========================================
   スムーズスクロール
   ======================================== */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}


/* ========================================
   スクロールフェードイン (IntersectionObserver)
   ======================================== */
function initScrollReveal() {
  const elements = $$('.fade-in-up');
  if (!elements.length) return;

  // IntersectionObserver 非対応ブラウザのフォールバック
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}


/* ========================================
   ギャラリー ライトボックス
   ======================================== */
function initLightbox() {
  const lightbox      = $('#lightbox');
  const lightboxImg   = $('#lightboxImg');
  const lightboxCap   = $('#lightboxCaption');
  const closeBtn      = $('#lightboxClose');
  const prevBtn       = $('#lightboxPrev');
  const nextBtn       = $('#lightboxNext');
  const backdrop      = $('.lightbox__backdrop', lightbox);
  if (!lightbox || !lightboxImg) return;

  let currentIndex = 0;

  // ライトボックスを開く
  const openAt = (index) => {
    currentIndex = ((index % GALLERY_IMAGES.length) + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    const data = GALLERY_IMAGES[currentIndex];

    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    if (lightboxCap) lightboxCap.textContent = data.caption;

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  // ライトボックスを閉じる
  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  // ギャラリーアイテムにクリックイベント
  $$('[data-gallery-index]').forEach(item => {
    const onClick = () => {
      const index = parseInt(item.dataset.galleryIndex, 10);
      openAt(index);
    };

    item.addEventListener('click', onClick);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    });
  });

  // 閉じるボタン
  closeBtn?.addEventListener('click', closeLightbox);

  // バックドロップクリックで閉じる
  backdrop?.addEventListener('click', closeLightbox);

  // 前後ナビ
  prevBtn?.addEventListener('click', () => openAt(currentIndex - 1));
  nextBtn?.addEventListener('click', () => openAt(currentIndex + 1));

  // キーボード操作
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  openAt(currentIndex - 1);
    if (e.key === 'ArrowRight') openAt(currentIndex + 1);
  });

  // スワイプ対応（タッチデバイス）
  let touchStartX = 0;

  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff < 0 ? openAt(currentIndex + 1) : openAt(currentIndex - 1);
    }
  }, { passive: true });
}


/* ========================================
   FAQ アコーディオン
   ======================================== */
function initFaq() {
  $$('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';
      const answer   = btn.nextElementSibling;

      // 全アイテムを閉じる（1つだけ開く場合は有効、複数同時OKにするなら削除）
      // $$('.faq-item__q').forEach(other => {
      //   other.setAttribute('aria-expanded', 'false');
      //   other.nextElementSibling?.classList.remove('is-open');
      // });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer?.classList.toggle('is-open', !isOpen);
    });
  });
}


/* ========================================
   ページトップボタン
   ======================================== */
function initPageTop() {
  const btn = $('#pageTop');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ========================================
   フォームバリデーション
   ======================================== */
function initContactForm() {
  const form       = $('#contactForm');
  const submitBtn  = $('#submitBtn');
  const successMsg = $('#formSuccess');
  if (!form) return;

  // バリデーションルール
  const validators = {
    name: (val) => {
      if (!val.trim()) return 'お名前を入力してください';
      if (val.trim().length < 2) return 'お名前は2文字以上で入力してください';
      return '';
    },
    email: (val) => {
      if (!val.trim()) return 'メールアドレスを入力してください';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return '正しいメールアドレスを入力してください';
      return '';
    },
    message: (val) => {
      if (!val.trim()) return 'お問い合わせ内容を入力してください';
      return '';
    },
    privacy: (_, checked) => {
      if (!checked) return 'プライバシーポリシーへの同意が必要です';
      return '';
    }
  };

  // エラー表示/非表示
  const showError = (fieldId, message) => {
    const errorEl = document.getElementById(fieldId + 'Error');
    const input   = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    if (input) {
      input.classList.toggle('is-error', !!message);
    }
    return !!message;
  };

  // 単一フィールドのバリデーション
  const validateField = (fieldId) => {
    const input    = document.getElementById(fieldId);
    if (!input || !validators[fieldId]) return false;
    const value    = input.type === 'checkbox' ? input.value : input.value;
    const checked  = input.type === 'checkbox' ? input.checked : null;
    const errorMsg = validators[fieldId](value, checked);
    return showError(fieldId, errorMsg);
  };

  // リアルタイムバリデーション（フォーカスアウト時）
  ['name', 'email', 'message'].forEach(id => {
    const input = document.getElementById(id);
    input?.addEventListener('blur', () => validateField(id));
    input?.addEventListener('input', () => {
      if (input.classList.contains('is-error')) validateField(id);
    });
  });

  document.getElementById('privacy')?.addEventListener('change', () => validateField('privacy'));

  // 送信処理 (Formspree → ideabank.company@gmail.com)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const hasErrors = [
      validateField('name'),
      validateField('email'),
      validateField('message'),
      validateField('privacy')
    ].some(Boolean);

    if (hasErrors) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';
    }

    // AJAX 送信を試み、失敗時は通常 POST にフォールバック
    let ajaxOk = false;
    try {
      const formData = new FormData(form);
      const payload = {
        name:     formData.get('name')    || '',
        email:    formData.get('email')   || '',
        phone:    formData.get('phone')   || '未記入',
        message:  formData.get('message') || '',
        _subject: 'スマイル24 HPからのお問い合わせ',
        _captcha: 'false'
      };

      const res = await fetch('https://formsubmit.co/ajax/ideabank.company@gmail.com', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const result = await res.json();
      if (res.ok && result.success === 'true') {
        ajaxOk = true;
        form.style.display = 'none';
        if (successMsg) successMsg.hidden = false;
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', { event_category: 'Contact', event_label: 'inquiry_form' });
        }
      }
    } catch (_) {
      ajaxOk = false;
    }

    // AJAX が失敗した場合は通常フォーム POST（file:// や初回アクティベート時に有効）
    if (!ajaxOk) {
      form.action = 'https://formsubmit.co/ideabank.company@gmail.com';
      form.method = 'POST';
      // 初回アクティベート後は不要になる _next を設定（任意）
      const nextInput = document.createElement('input');
      nextInput.type  = 'hidden';
      nextInput.name  = '_captcha';
      nextInput.value = 'false';
      form.appendChild(nextInput);
      form.submit();
    }
  });
}


/* ========================================
   ヒーロースライドショー
   ======================================== */
function initHeroSlideshow() {
  const slides = $$('.hero__slide');
  const dots   = $$('.hero__dot');
  if (slides.length < 2) return;

  let current = 0;
  let timer;

  const goTo = (index) => {
    slides[current].classList.remove('is-active');
    dots[current]?.classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current]?.classList.add('is-active');
  };

  const next = () => goTo(current + 1);

  const start = () => { timer = setInterval(next, 4800); };
  const stop  = () => clearInterval(timer);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stop(); goTo(i); start(); });
  });

  start();
}
/* ========================================
   今日は何の日？（実在の記念日×ジム流ユーモア）
   記念日はいずれも一般に知られた実在のもの（語呂合わせ・制定団体ベース）
   ======================================== */
function initDayToast() {

  /* 日付固有の記念日（'月/日' キー） */
  const KINENBI = {
    /* 1月 */
    '1/1':  { title: '元日', text: '「一年の計は元旦にあり」。今年こそ運動すると誓ったそこのあなた、決意が温かいうちにジムへ。元日に動けば、三日坊主すら怖くありません。' },
    '1/7':  { title: '七草の日', text: '七草がゆで胃を休める日。お正月にがんばった胃腸をいたわりつつ、なまった体はジムで再起動しましょう。おかゆだけでは筋肉は目覚めません。' },
    '1/11': { title: '鏡開き', text: 'お餅は優秀なエネルギー源。つまり「食べたら動く」が正解です。お汁粉のおかわりの分は、トレッドミルが引き受けます。' },
    '1/17': { title: 'おむすびの日', text: '炭水化物は筋トレの大切な相棒です。「トレーニング後のおむすびは世界一おいしい」という説があるので、ぜひ検証しにきてください。' },
    '1/22': { title: 'カレーの日', text: 'スパイスで代謝アップ、ジムでさらに代謝アップ。カレーと筋トレは実は名コンビです。大盛りにした方は、有酸素20分追加でチャラです。' },
    '1/31': { title: '愛菜の日', text: 'あい(1)さい(31)で、野菜をたっぷり食べる日。ビタミンは筋肉づくりの縁の下の力持ちです。サラダのあとは、メインディッシュ（筋トレ）もどうぞ。' },

    /* 2月 */
    '2/9':  { title: '肉の日', text: 'に(2)く(9)で肉の日。タンパク質は筋肉の材料です。「焼肉はトレーニングの一環」と胸を張るために、先にジムで筋トレを済ませておきましょう。' },
    '2/11': { title: '建国記念の日', text: '国づくりも体づくりも、土台が命。祝日の今日こそ、基礎代謝という名の土台をコツコツ築くチャンスです。' },
    '2/14': { title: 'バレンタインデー', text: 'チョコは幸せ、カロリーは現実。でも大丈夫、チョコひと粒ぶんはマシン10分でチャラです。愛と筋肉は裏切りません。' },
    '2/22': { title: '猫の日', text: 'にゃん・にゃん・にゃん。猫は1日16時間寝ても許されますが、人間には筋トレがあります。まずは猫のように伸びをして、ストレッチエリアから始めましょう。' },
    '2/23': { title: '富士山の日', text: 'いつか登りたいあの頂も、まずは足腰から。レッグプレスで「いつでも登れる脚」を仕込んでおくと、御来光はもっと美しく見えます。' },

    /* 3月 */
    '3/3':  { title: 'ひな祭り', text: 'ひなあられに菱餅にちらし寿司。おいしい行事は、動く口実でもあります。菱形のシルエットにならないよう、今日もマシンがお待ちしています。' },
    '3/7':  { title: 'サウナの日', text: 'サ(3)ウナ(7)の日。「ととのう」前に「きたえる」のが通の楽しみ方だとか。運動後のシャワーと水分補給で、すっきり整えてお帰りください。' },
    '3/9':  { title: 'ありがとうの日', text: 'サンキュー(39)の日。毎日がんばってくれている自分の体に感謝を。お礼は、ストレッチと軽い運動でしっかり伝わります。' },
    '3/13': { title: 'サンドイッチデー', text: '1が3を挟む並びが由来。チキンと卵を挟めば、サンドイッチは立派な筋トレ飯です。仕上げのひと運動は、ジムで挟みましょう。' },
    '3/14': { title: 'ホワイトデー', text: 'お返しのクッキーもマシュマロも、笑顔で受け取って笑顔で消費。甘さは正義、運動も正義です。' },
    '3/27': { title: 'さくらの日', text: '3×9（さくら）=27が由来。お花見の場所取りは意外と体力勝負です。今のうちに脚力を鍛えて、ベストポジションへ最短ダッシュを。' },

    /* 4月 */
    '4/1':  { title: 'エイプリルフール', text: '「昨日10km走った」と言っても許される日。でも本当に走れば、ウソが実績に変わります。今日は正直者になりにきませんか。' },
    '4/18': { title: 'よい歯の日', text: 'よ(4)い(1)歯(8)の日。よく噛むことはダイエットの基本です。よく噛み、よく動き、よく眠る。シンプルなことがいちばん効きます。' },
    '4/22': { title: 'アースデー', text: '地球にやさしく、自分の体にもやさしく。徒歩や自転車でジムに来れば、エコとウォームアップの一石二鳥です。' },
    '4/29': { title: '昭和の日', text: '昭和の根性トレーニングはもう卒業。令和は科学的に、無理なく、マイペースが正解です。24時間、お好きな時間にどうぞ。' },

    /* 5月 */
    '5/4':  { title: 'みどりの日', text: '新緑がまぶしい季節は、体を動かすのに最高です。連休でのんびりモードになった体も、まだ十分間に合います。' },
    '5/5':  { title: 'こどもの日', text: '子どもの頃の無限だった体力、大人でも取り戻せます。柏餅を食べたら、こいのぼりに負けない元気でジムへ。' },
    '5/9':  { title: 'アイスクリームの日', text: 'アイスは心の栄養、運動は体の栄養。両方そろえばバランス満点です。カロリーの帳尻は、マシンにおまかせください。' },
    '5/29': { title: 'こんにゃくの日', text: 'こ(5)んに(2)ゃく(9)の日。低カロリーの強い味方に敬意を。ただし筋肉づくりには、タンパク質もお忘れなく。' },
    '5/30': { title: 'ごみゼロの日', text: 'ご(5)み(30)ゼロの日。部屋のごみも心のモヤモヤも、ためこまないのがいちばん。汗と一緒にすっきり流しましょう。' },

    /* 6月 */
    '6/4':  { title: '虫歯予防デー', text: '歯も筋肉も、日々のケアの積み重ね。「磨く」習慣がある人は「鍛える」習慣も作れます。歯磨きとセットでジム習慣、始めませんか。' },
    '6/6':  { title: '楽器の日', text: '芸事は6歳の6月6日に始めると上達する、と言われます。筋トレは何歳の何月何日に始めても上達します。つまり、今日が始めどきです。' },
    '6/10': { title: '時の記念日', text: '「時間がない」は大人の合言葉。でもスマイル24は24時間営業なので、時間は「ない」のではなく「いつでもある」が正解です。' },
    '6/16': { title: '和菓子の日', text: '和菓子は洋菓子より脂質控えめな優等生。お茶と一服したら、その糖分をエネルギーに変えにきてください。' },
    '6/21': { title: '夏至のころ', text: '一年でいちばん昼が長い、つまり「今日はまだ時間がある」と一年でいちばん言える日。日が沈む前でも後でも、ジムは開いています。' },

    /* 7月 */
    '7/2':  { title: 'うどんの日', text: '香川県生麺事業協同組合が制定した、さぬきの魂の日。半夏生にうどんを食べる風習が由来です。2玉いった方は、トレッドミルで讃岐の誇りを燃やしましょう。' },
    '7/3':  { title: 'ソフトクリームの日', text: '1951年の今日、日本で初めてソフトクリームが販売されたそう。巻きのカーブが美しいあのフォルム。あなたの二の腕も、引き締めれば負けていません。' },
    '7/4':  { title: '梨の日', text: 'な(7)し(4)の日。みずみずしい梨は水分補給の天才です。「梨のつぶて」にならないよう、ジムからのお誘いにはぜひお返事を。' },
    '7/6':  { title: 'サラダ記念日', text: '歌人・俵万智さんの短歌で有名になった記念日。何気ない日を特別にするのは、ちょっとした行動です。今日をあなたの「ジム記念日」にしませんか。' },
    '7/7':  { title: '七夕', text: '織姫と彦星は年に1度しか会えませんが、あなたとジムは年365日会えます。短冊の「痩せたい」は、書くだけでは叶いません。' },
    '7/8':  { title: 'チキン南蛮の日', text: 'なん(7)ばん(8)で、宮崎県延岡市発祥のチキン南蛮の日。タンパク質豊富な鶏肉に、魅惑のタルタルソース。衣にも感謝していただきましょう。食べたカロリーはスマイル24で消費！' },
    '7/10': { title: '納豆の日', text: 'なっ(7)とう(10)の日。納豆は植物性タンパク質の王様です。ねばねばパワーで、今日のトレーニングも粘り強くいきましょう。' },
    '7/11': { title: 'ラーメンの日', text: '7がレンゲ、11がお箸に見えることが由来。スープまで完食した方は、その満足感を胸に有酸素マシンで一汗どうぞ。替え玉した方は、二汗で。' },
    '7/13': { title: 'ナイスの日', text: 'ナ(7)イ(1)ス(3)の日。今日は自分に「ナイス！」と言ってあげる日です。ジムに行こうと思っただけでも、十分ナイスです。' },
    '7/20': { title: 'ハンバーガーの日', text: '1971年の今日、日本にハンバーガー店の1号店が誕生。パティは牛肉、つまりタンパク質です。ポテトのことは、マシンの上で考えましょう。' },
    '7/22': { title: 'ナッツの日', text: 'ナ(7)ッツ(22)の日。ナッツは筋トレ民の頼れる間食です。ひとつかみで止める意志力も、また筋トレのうちです。' },
    '7/25': { title: 'かき氷の日', text: '頭がキーンとしても食べる。その挑戦心は、すでにアスリートです。火照った体のクールダウンと水分補給もお忘れなく。' },

    /* 8月 */
    '8/1':  { title: '水の日', text: '人の体の約6割は水分。つまり、あなたの過半数は水です。ウォーターサーバー完備のスマイル24で、多数派を大切にしましょう。' },
    '8/6':  { title: 'ハムの日', text: 'ハ(8)ム(6)の日。ハムはタンパク質、つまり筋肉の友です。ついでにハムストリングス（太もも裏）も鍛えて、名実ともにハムの日にしましょう。' },
    '8/7':  { title: 'バナナの日', text: 'バ(8)ナナ(7)の日。運動前のバナナは、プロも認める定番エネルギーです。1本チャージして、さあマシンへ。' },
    '8/8':  { title: '笑いの日', text: 'ハ(8)ハ(8)で笑いの日。実は、笑うと腹筋を使います。とはいえ笑いだけで割れるほど腹筋は甘くないので、続きはアブドミナルクランチで。' },
    '8/11': { title: '山の日', text: '登る予定がなくても、登れる脚を作っておくのは自由です。「いつでも登れる自分」は、最高の装備です。' },
    '8/29': { title: '焼き肉の日', text: 'や(8)きに(2)く(9)の日。焼き肉は筋トレ後のご褒美に最適です。順番が大事。まず鍛える、それから焼く。今日のカルビは正義です。' },
    '8/31': { title: '野菜の日', text: 'や(8)さ(3)い(1)の日。筋肉ばかり注目されがちですが、ビタミンなしでは筋肉も育ちません。今夜は野菜も全部盛りで。' },

    /* 9月 */
    '9/1':  { title: '防災の日', text: 'いざという時、最後に頼れるのは自分の体力です。防災グッズの点検と一緒に、体力の点検もどうぞ。階段を駆け上がれる脚は、何よりの備えです。' },
    '9/9':  { title: '救急の日', text: 'ケガなく安全に、が運動の大前提。マシン横の使い方ガイドとQRコードを確認して、無理なくマイペースに。それがいちばん強いです。' },
    '9/23': { title: '秋分の日のころ', text: '暑さ寒さも彼岸まで。ここから「スポーツの秋」と「食欲の秋」が本気を出してきます。先手を打つなら、運動からがおすすめです。' },
    '9/29': { title: '招き猫の日', text: 'く(9)る福(29)で招き猫の日。招き猫は片手で福を招きますが、あなたは両手でダンベルを。福も筋肉も、招いた者勝ちです。' },

    /* 10月 */
    '10/1':  { title: 'コーヒーの日', text: '国際コーヒーの日。運動前の一杯は集中力アップに役立つとも言われます。カフェインを味方に、今日はシャキッと一段強めで。' },
    '10/2':  { title: '豆腐の日', text: 'とう(10)ふ(2)の日。高タンパク低カロリーの優等生「畑の肉」をいただいたら、本物の筋肉を育てにジムへどうぞ。' },
    '10/10': { title: '銭湯の日', text: 'せん(1000)とう(10)で銭湯の日。運動後のお風呂は最高のご褒美です。先にジムで汗をかいておけば、湯船の気持ちよさは二乗になります。' },
    '10/13': { title: 'サツマイモの日', text: '焼き芋は、天才的においしい炭水化物。食物繊維も豊富なので罪悪感は控えめでOKです。エネルギーに変えるのは、あなたの脚です。' },
    '10/31': { title: 'ハロウィン', text: 'お菓子をもらう側を卒業しても、食べる量が減らないのはなぜでしょう。今年は仮装より、変身（ボディメイク）はいかがですか。' },

    /* 11月 */
    '11/1':  { title: '犬の日', text: 'ワン・ワン・ワンで犬の日。犬の散歩は立派な有酸素運動です。犬がいない方もご安心ください。トレッドミルが、いつでもあなたを散歩に連れて行きます。' },
    '11/7':  { title: '鍋の日', text: 'いい(11)な(7)べで鍋の日。野菜もタンパク質も一度に摂れる鍋は、実は最強のトレーニング飯です。締めの雑炊の分だけ、少し長めに歩きましょう。' },
    '11/11': { title: 'ポッキー＆プリッツの日', text: '1が4本並ぶ日。「細く長く」は継続の理想形です。お菓子と同じくらい細く長く、トレーニングも続けていきましょう。' },
    '11/22': { title: 'いい夫婦の日', text: '大切な人と長く笑って過ごすために、健康はいちばんの贈り物です。おふたりでも、おひとりでも、今日も少しだけ体を動かしましょう。' },
    '11/26': { title: 'いい風呂の日', text: 'いい(11)ふろ(26)の日。運動→お風呂→睡眠は、幸福の黄金リレーです。第一走者のトレーニングをお忘れなく。' },
    '11/29': { title: 'いい肉の日', text: 'いい(11)にく(29)の日。一年でもっとも堂々と肉が食べられる日です。筋トレ後30分はタンパク質のゴールデンタイム。つまり、ジム帰りの焼き肉は科学です。' },

    /* 12月 */
    '12/3':  { title: 'みかんの日', text: 'こたつとみかんは、日本の冬の完成形。ただし完成してしまうと春に困ります。ビタミンを補給したら、こたつを出る勇気を。' },
    '12/12': { title: '漢字の日', text: '今年のあなたの一年は、どんな漢字でしたか。来年の候補に「筋」「健」「動」を仕込むなら、今日から始めるのが近道です。' },
    '12/24': { title: 'クリスマスイブ', text: 'チキンとケーキが待つ聖なる夜。先に動いておけば、夜のごちそうはぜんぶ「補給」になります。メリートレーニング！' },
    '12/25': { title: 'クリスマス', text: 'サンタは一晩で世界中を回る、超持久系アスリート。彼に負けないよう、私たちも有酸素運動で体力づくりを。' },
    '12/31': { title: '大晦日', text: '年越しそばの前に、運動納めはいかがですか。除夜の鐘は108回、スクワット108回…は多いので、まずは10回から。' },
  };

  /* 毎月の記念日（該当日に固有の記念日がない場合に適用） */
  const MONTHLY = {
    22: { title: 'ショートケーキの日', text: 'カレンダーで22日の真上はいつも15日。「15（いちご）が上に乗っている」のが由来です。ケーキのあとのことは、マシンと私にお任せください。' },
    29: { title: '肉の日', text: 'に(2)く(9)で毎月29日は肉の日。タンパク質チャージのチャンスです。筋トレとセットにすれば、お肉はご褒美ではなく「戦略」になります。' },
  };

  /* 記念日がない日のユーモアパターン（日付で固定表示） */
  const FALLBACK = [
    { title: '現実逃避したい日', text: '家事も仕事も放り出して、ランニングマシンへGO。走っている間は、肩書きも役割も全部おやすみ。ただのアスリートです。' },
    { title: '夕飯の手抜きを企む日', text: '罪悪感は有酸素運動で燃やし尽くしましょう。「今日はジムで忙しかった」と言えば、だいたいのことは解決します。' },
    { title: '自分へのご褒美をフライングした日', text: 'ケーキを食べたのは未来への投資です。さあ、スクワットで貯筋を回収しに行きましょう！' },
    { title: '重力に逆らいたくなった日', text: 'お肌も体型も、重力と戦う毎日。ジムのマシンはあなたの味方です。今日だけは地球の引力に打ち勝ちましょう。' },
    { title: '低気圧に負けそうな日', text: 'だるい時こそストレッチエリアへ。5分寝転がって体を伸ばすだけで「今日ジム行ったし！」という圧倒的自己肯定感が手に入ります。' },
    { title: '衣替えで絶望した日', text: '去年の服がきつい？大丈夫、スマイル24は24時間いつでもリベンジを待っています。今から始めれば次シーズンは勝ち組です。' },
    { title: 'アイスの誘惑に秒で負けた日', text: '食べたなら、動けば実質カロリーゼロ（当社比）。おいしくエネルギー補給できたので、今日のトレーニングは絶好調のはずです。' },
    { title: '推しの尊さに震える日', text: '推し活には体力と遠征費が必要です。月3,980円で動ける体を作って、次のライブに向けて今日もスクワット！' },
    { title: '階段よりエスカレーターを即決した日', text: '己の弱さに気づけた素晴らしい日です。その悔しさをバネに、有酸素マシンへどうぞ。' },
    { title: '何でもない日', text: '思い立ったが吉日。今日ジムに行くと、プロテインがいつもより3倍おいしく感じられる特別な日です。' },
  ];


  /* その日のネタ10連発：1つ目は日付固有ネタ、残り9つはその日の記念日にちなんだバリエーション。
     日付シードで選ぶため「今日のネタ」は1日固定、日が変わると入れ替わる（365日×10ネタ） */
  const JOKE_TMPL = [
    (t) => `「${t}」と聞いて心が動いたなら、次は体を動かす番です。スマイル24は本日も24時間、逃げも隠れもしません。`,
    (t) => `今日が「${t}」だと知っているあなたは、もう雑学王です。あとは筋肉さえあれば無敵。ジムでお待ちしています。`,
    (t) => `カレンダーは「${t}」と言っていますが、あなたの体は「そろそろ動きたい」と言っています。多数決でジム行きが可決されました。`,
    (t) => `「${t}」を口実にごちそうを楽しむ予定の方、大正解です。食べた分をジムで帳消しにするのが、大人のたしなみです。`,
    (t) => `記念日は年に1回ですが、ジムのチャンスは年に365回。「${t}」の今日を、運動を始めた記念日にしませんか。`,
    (t) => `「${t}」の今日、ゴロゴロした人と15分だけ動いた人。1年後に笑うのはどちらでしょう。答え合わせはジムで。`,
    (t) => `本日は「${t}」。それはさておき、スクワットは今日も裏切りません。それだけお伝えしたくて出てきました。`,
    (t) => `「${t}」、おめでとうございます（誰にともなく）。おめでたい日は代謝も上がる気がします（個人の感想です）。さあ、ジムへ。`,
    (t) => `今日は「${t}」。明日を「心地よい筋肉痛の日」にできるかどうかは、今日のあなたに懸かっています。`,
    (t) => `「${t}」という豆知識は3秒で忘れてもOK。でも「今日ちょっと動いた」という事実は、体が一生覚えています。`,
    (t) => `「${t}」の今日を特別にする裏ワザ：トレッドミルの上で「今日は${t}かぁ」とつぶやく。以上です。効果は抜群です。`,
    (t) => `実質無料の豆知識：今日は「${t}」。実質無料の爽快感：運動後のストレッチ。どちらも本日提供中です。`,
    (t) => `「${t}」。いい響きです。ところで当ジムのウォーターサーバーの水も、いい喉ごしです。飲むついでに、少し動きませんか。`,
    (t) => `「${t}」の今日も地球は回っています。あなたもマシンの上で、ちょっとだけ回転数を上げてみませんか。`,
  ];

  const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);

  const entry = KINENBI[`${m}/${d}`] || MONTHLY[d] || FALLBACK[dayOfYear % FALLBACK.length];

  /* 日付シード付き乱数（同じ日は同じ並び） */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(now.getFullYear() * 366 + dayOfYear);
  const idxs = JOKE_TMPL.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  const JOKES = [entry.text].concat(idxs.slice(0, 9).map((i) => JOKE_TMPL[i](entry.title)));

  /* --- ページ内セクション --- */
  const titleEl    = $('#todayTitle');
  const textEl     = $('#todayText');
  const shuffleBtn = $('#todayShuffle');

  let jokeIdx = 0;
  function renderJoke() {
    if (!titleEl || !textEl) return;
    titleEl.textContent = `今日は「${entry.title}」`;
    textEl.textContent  = JOKES[jokeIdx];
    if (shuffleBtn) shuffleBtn.textContent = `🔀 次のネタへ（${jokeIdx + 1}/${JOKES.length}）`;
  }
  renderJoke();

  shuffleBtn?.addEventListener('click', () => {
    jokeIdx = (jokeIdx + 1) % JOKES.length;
    renderJoke();
  });

  /* --- トースト（訪問時のお知らせ） --- */
  const toast    = $('#dayToast');
  const closeBtn = $('#toastClose');
  if (!toast) return;

  $('#toastDate').textContent  = `${m}月${d}日（${DAYS[now.getDay()]}曜日）`;
  $('#toastKinen').textContent = `✨ 今日は「${entry.title}」です`;
  $('#toastMsg').textContent   = JOKES[0];

  setTimeout(() => toast.classList.add('is-visible'), 1000);
  setTimeout(() => toast.classList.remove('is-visible'), 10000);

  closeBtn?.addEventListener('click', () => toast.classList.remove('is-visible'));
}

/* ========================================
   スタッフブログ（過去3記事 + 週次自動追加）
   ======================================== */
function initStaffBlog() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;

  // 直近の月曜日を取得
  function getMonday(date, weeksAgo) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1) - (weeksAgo * 7);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function fmtDate(d) {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  const now = new Date();

  // 固定掲載済み3記事（さぬき市・香川の季節ネタ、約200字、くすっと笑えるトーン）
  const POSTED = [
    {
      date: getMonday(now, 0),
      title: '蒸し暑い6月後半、涼しい館内でトレーニングを',
      img: 'images/gym-03.jpg',
      tag: '🌂 梅雨の終盤',
      content: 'さぬき市の6月後半、梅雨の蒸し暑さが本格化してきましたね。外に出るだけでじっとり汗ばむ日が続いています。そんな時期こそ、エアコンの効いた快適なスマイル24へ！汗をかくなら「良い汗」をかきましょう。うどんをしっかり食べた後の運動は格別です。水分補給もしっかりと。梅雨明けが近づいてきました、今のうちに体を慣らしておきましょう。'
    },
    {
      date: getMonday(now, 1),
      title: '雨の日こそジムへ！梅雨シーズンの狙い目',
      img: 'images/gym-01.jpg',
      tag: '☔ 梅雨のジム通信',
      content: '6月中旬のさぬき市、梅雨まっただ中です。外での運動が億劫になりますよね。でも実は雨の日こそジムが狙い目！来館者が少なくマシンが空いていることが多いんです。スマイル24は24時間営業なので、朝の涼しい時間帯や夜に雨が落ち着いてから来るのも◎。梅雨の季節を、こっそり体力強化の期間にしてしまいましょう。'
    },
    {
      date: getMonday(now, 2),
      title: '友達と一緒に通うと、なぜか頑張れる不思議',
      img: 'images/gym-04.jpg',
      tag: '🤝 仲間と通おう',
      content: '「一人だとサボりそう…」という方、ぜひ友達を誘って来てください。人がいると不思議と頑張れますよね。さぬき市でジム仲間を作るなら、スマイル24がおすすめです。一緒にトレーニングして、終わったらうどんを食べに行く。それが香川スタイルの健康的な週末の過ごし方です（うどんは外せない）。会員登録はスマホから完結します！'
    }
  ];

  // 今週以降の自動ローテーション用追加記事プール
  const WEEKLY_POOL = [
    { title: '早起きは三文の徳、ジムは一石二鳥', img: 'images/gym-05.jpg', tag: '🌅 朝活のすすめ',
      content: '24時間ジムの本領は早朝にあります。朝6時前のスマイル24、マシンは空いていて頭もスッキリ。「朝活」という響き、少し大人っぽくてかっこよくないですか？さぬき市の朝の澄んだ空気を吸いながらジムへ向かうと、それだけで一日が違います。早起きが苦手な方も、まず一回だけ試してみてください。ハマります（責任は取れませんが）。' },
    { title: 'うどん県民のための運動学入門', img: 'images/gym-02.jpg', tag: '🍜 うどん×健康',
      content: 'ここは香川県さぬき市。讃岐うどんは文化であり、生きがいであり、週に何杯食べるか数えてはいけないものです。でもご安心ください。食べた分だけ動けば、理論上は太りません（ざっくりとした計算）。釜玉大一杯のカロリーは約400kcal。スマイル24でトレッドミルを40分走ればほぼ相殺。さあ、今日もうどんのために走りましょう！' },
    { title: 'スポーツの秋、運動習慣を育てるベストシーズン', img: 'images/gym-03.jpg', tag: '🍁 秋のジム通信',
      content: '秋のさぬき市は運動するのに最高の季節です。夏の暑さが引いて「やっと動ける！」という気持ちになりますよね。スマイル24のトレッドミルで走りながら、窓の外の秋空を感じる。それだけで気持ちが豊かになります。「食欲の秋」に対抗できるのは「運動の秋」だけ。今すぐ始めた人が、年末に笑います（体型的な意味で）。' },
    { title: '年末に向けて体をリセット！今から準備しよう', img: 'images/gym-01.jpg', tag: '🎄 年末カウントダウン',
      content: '年末が近づいてきましたね。忘年会、クリスマス、帰省…美味しいものを食べる機会がどんどん増えます。でも大丈夫。今から運動習慣をつけておけば、年末の食べすぎも怖くありません。スマイル24は24時間365日営業なので、忙しい師走でも早朝や深夜に来られます。「今年こそ！」を今年叶えましょう。残り時間は十分あります。' }
  ];

  // 今週番号を計算して追加記事を選択（POSTED 3枚の次から）
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));

  // 表示する記事 = 固定3記事
  const allPosts = POSTED.map((p, i) => ({ ...p, label: i === 0 ? '最新記事' : null }));

  allPosts.forEach(post => {
    const card = document.createElement('div');
    // is-visible を最初から付けてアニメーション待ちをバイパス
    card.className = 'blog-card fade-in-up is-visible';
    card.innerHTML = `
      <div class="blog-card__img-wrap">
        <img src="${post.img}" alt="" class="blog-card__img" loading="lazy">
        <span class="blog-card__tag">${post.tag}</span>
        ${post.label ? `<span class="blog-card__new">${post.label}</span>` : ''}
      </div>
      <div class="blog-card__body">
        <div class="blog-card__date">${fmtDate(post.date)}</div>
        <h3 class="blog-card__title">${post.title}</h3>
        <p class="blog-card__content">${post.content}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}


/* ========================================
   初期化
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHamburger();
  initSmoothScroll();
  initScrollReveal();
  initLightbox();
  initHeroSlideshow();
  initDayToast();
  initFaq();
  initPageTop();
  initContactForm();
  initStaffBlog();
});
