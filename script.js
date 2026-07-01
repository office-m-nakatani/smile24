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
   今日のメッセージ トースト
   ======================================== */
function initDayToast() {
  const toast    = $('#dayToast');
  const closeBtn = $('#toastClose');
  if (!toast) return;

  const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
  const KINENBI = {
    '1/1':  '元日',           '1/7':  '七草の日',        '1/11': '塩の日',
    '1/17': '防災とボランティアの日', '1/20': '大寒',       '1/31': '愛菜の日',
    '2/3':  '節分',           '2/14': 'バレンタインデー', '2/20': '旅の日',
    '3/3':  'ひな祭り',       '3/7':  '花粉症記念日',    '3/8':  '国際女性デー',
    '3/20': '春分の日',       '3/21': '春分の日',
    '4/1':  '新年度スタートの日', '4/7': '世界保健デー',   '4/22': 'アースデー',
    '4/23': '地ビールの日',   '4/28': '腸内フローラの日',
    '5/1':  'メーデー',       '5/4':  'みどりの日',      '5/8':  '世界赤十字デー',
    '5/10': 'ウォーキングの日', '5/12': '看護の日',       '5/15': '水分補給の日',
    '5/31': '世界禁煙デー',
    '6/1':  '水泳の日',       '6/4':  '虫歯予防デー',    '6/5':  '世界環境デー',
    '6/10': '時の記念日',     '6/14': '世界献血者デー',  '6/21': '夏至',
    '6/26': '腸活の日',
    '7/1':  '健康増進の日',   '7/7':  '七夕',            '7/11': '世界人口デー',
    '7/22': 'スポーツの日',   '7/24': 'テレビの日',      '7/28': '世界肝炎デー',
    '8/1':  '水の日',         '8/8':  '笑いの日',        '8/10': '健康ハートの日',
    '8/11': '山の日',         '8/25': 'サマーフィットネスデー',
    '9/1':  '防災の日',       '9/9':  '健康長寿の日',    '9/10': '世界自殺予防デー',
    '9/23': '秋分の日',       '9/24': '秋分の日',        '9/29': '世界心臓デー',
    '10/1': '国際高齢者デー', '10/8': 'ウオーキングの日', '10/10':'体育の日',
    '10/11':'体幹の日',       '10/16': '世界食料デー',   '10/22': '漢方の日',
    '11/1': 'ジムの日',       '11/8': '良い歯の日',      '11/10': '断酒の日',
    '11/12': '皮膚の日',      '11/26': 'いい風呂の日',
    '12/1': '世界エイズデー', '12/3':  'みかんの日',     '12/22': '冬至',
  };
  const YOUBI_THEME = [
    '全力リカバリーデー',  // 日
    '週はじめ筋トレデー',  // 月
    '有酸素運動デー',      // 火
    '体幹強化デー',        // 水
    '下半身トレーニングデー', // 木
    'ラストスパートデー',  // 金
    '全身トレーニングデー', // 土
  ];

  const MSGS = [
    'たった5分の運動が、明日の元気をつくります。',
    '今日も来てくれてありがとう。体は正直に応えてくれます。',
    '昨日より少しだけ頑張った自分を褒めてあげましょう。',
    '習慣にすれば、運動はもっと楽しくなります。',
    '水分補給も忘れずに。体を大切にしましょう。',
    '今日の汗が、来週の笑顔になります。',
    '自分のペースで、マイペースで。それがスマイル24スタイル。',
    '深呼吸して、さあはじめましょう！',
  ];

  const now   = new Date();
  const m     = now.getMonth() + 1;
  const d     = now.getDate();
  const day   = DAYS[now.getDay()];
  const key   = `${m}/${d}`;
  const kinen = KINENBI[key] || YOUBI_THEME[now.getDay()];
  const msg   = MSGS[(m * d) % MSGS.length];

  $('#toastDate').textContent = `${m}月${d}日（${day}曜日）`;
  $('#toastKinen').textContent = `✨ 今日は「${kinen}」です`;
  $('#toastMsg').textContent  = msg;

  setTimeout(() => toast.classList.add('is-visible'), 1000);
  setTimeout(() => toast.classList.remove('is-visible'), 7000);

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
