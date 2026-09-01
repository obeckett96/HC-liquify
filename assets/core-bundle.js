document.addEventListener('DOMContentLoaded', function () {

  // ── Measure real header height and set CSS custom property ──
  function setHeaderOffset() {
    var nav = document.querySelector('.w-nav, header, [role="banner"]');
    if (nav) {
      var h = nav.getBoundingClientRect().height;
      if (h > 0) {
        document.documentElement.style.setProperty('--cb-header-h', h + 'px');
      }
    }
  }
  setHeaderOffset();
  // Re-measure on resize (mobile nav open/close can change height)
  window.addEventListener('resize', setHeaderOffset, { passive: true });

  // ── Price data — read from Liquid-rendered data attributes (cents as integers) ──
  var priceRow    = document.querySelector('.cb-price-row');
  var priceFull   = priceRow ? parseInt(priceRow.getAttribute('data-price-full'), 10) : 0;
  var priceSub    = priceRow ? parseInt(priceRow.getAttribute('data-price-sub'),  10) : 0;

  var elPriceMain   = document.getElementById('cb-price-main');
  var elSubToggle   = document.getElementById('cb-sub-toggle-price');
  var elOneToggle   = document.getElementById('cb-one-toggle-price');
  var elStickyPrice = document.getElementById('cb-sticky-price');

  function formatPrice(cents) {
    var amount = (cents / 100).toFixed(2);
    amount = amount.replace(/\.00$/, '');
    return 'NZD$' + amount;
  }

  function updatePrices(isSubscribe) {
    var activePrice = isSubscribe ? priceSub : priceFull;
    var formatted   = formatPrice(activePrice);
    if (elPriceMain)   elPriceMain.textContent   = formatted;
    if (elStickyPrice) elStickyPrice.textContent  = formatted;
    if (elSubToggle)   elSubToggle.textContent    = formatPrice(priceSub);
    if (elOneToggle)   elOneToggle.textContent    = formatPrice(priceFull);
  }

  // ── Gallery ──
  var mainImg = document.getElementById('cb-main-image');
  var thumbs  = document.querySelectorAll('.cb-gallery__thumb');
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      if (mainImg) {
        mainImg.classList.add('fading');
        setTimeout(function () {
          mainImg.src = thumb.getAttribute('data-full') || thumb.src;
          mainImg.alt = thumb.alt || '';
          mainImg.classList.remove('fading');
        }, 180);
      }
    });
  });

  // ── Subscribe / One-Time toggle ──
  var subOption   = document.getElementById('cb-subscribe');
  var oneOption   = document.getElementById('cb-onetime');
  var radioSub    = document.getElementById('cb-radio-sub');
  var radioOne    = document.getElementById('cb-radio-one');
  var sellingPlan = document.getElementById('cb-selling-plan-input');

  if (subOption && oneOption) {
    subOption.addEventListener('click', function () {
      subOption.classList.add('active');
      oneOption.classList.remove('active');
      if (radioSub) radioSub.classList.add('active');
      if (radioOne) radioOne.classList.remove('active');
      if (sellingPlan) {
        sellingPlan.disabled = false;
        sellingPlan.value = sellingPlan.getAttribute('data-selling-plan-id') || '';
      }
      updatePrices(true);
    });

    oneOption.addEventListener('click', function () {
      oneOption.classList.add('active');
      subOption.classList.remove('active');
      if (radioOne) radioOne.classList.add('active');
      if (radioSub) radioSub.classList.remove('active');
      if (sellingPlan) { sellingPlan.disabled = true; sellingPlan.value = ''; }
      updatePrices(false);
    });
  }

  // ── Quantity ──
  var qtyInput = document.getElementById('cb-qty-input');
  var qtyMinus = document.getElementById('cb-qty-minus');
  var qtyPlus  = document.getElementById('cb-qty-plus');
  if (qtyInput && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', function () {
      var v = parseInt(qtyInput.value, 10);
      if (v > 1) qtyInput.value = v - 1;
    });
    qtyPlus.addEventListener('click', function () {
      qtyInput.value = parseInt(qtyInput.value, 10) + 1;
    });
  }

  // ── Sticky bar ──
  var sticky    = document.getElementById('cb-sticky');
  var stickyBtn = document.getElementById('cb-sticky-btn');
  var atcBtn    = document.getElementById('cb-atc-btn');
  var hero      = document.querySelector('.cb-hero-section');

  if (sticky && hero) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          sticky.classList.add('visible');
          sticky.setAttribute('aria-hidden', 'false');
        } else {
          sticky.classList.remove('visible');
          sticky.setAttribute('aria-hidden', 'true');
        }
      });
    }, { threshold: 0.1 });
    observer.observe(hero);
  }

  if (stickyBtn && atcBtn) {
    stickyBtn.addEventListener('click', function () {
      atcBtn.click();
    });
  }

});
