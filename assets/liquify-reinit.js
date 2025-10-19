document.addEventListener('liquify:after-render', function(e){
  // re-init Webflow IX2 (safe)
  try {
    if (window.Webflow && Webflow.require) {
      var ix = Webflow.require('ix2');
      if (ix && typeof ix.init === 'function') {
        try { if (typeof ix.destroy === 'function') ix.destroy(); } catch(e){}
        ix.init();
      } else if (window.Webflow && typeof Webflow.ready === 'function') {
        Webflow.ready();
      }
    }
  } catch(err){ console.warn('Webflow reinit failed', err); }

  // re-init Swiper if you expose a global initSwipers
  try { if (typeof window.initSwipers === 'function') window.initSwipers(e.target || document); } catch(err){ console.warn('Swiper reinit failed', err); }
});