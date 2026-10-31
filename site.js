// ISPDock website: contact links, mobile menu, plan calculator, typed headline, scroll fill, reveal on scroll.
(function () {
  // Where "Book a demo" goes. Change this one line when the inbox exists.
  var CONTACT = 'mailto:hello@ispdock.com?subject=ISPDock%20demo';

  document.documentElement.classList.add('js');
  document.querySelectorAll('[data-contact]').forEach(function (a) { a.setAttribute('href', CONTACT); });
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  // Light / dark switch: flips whatever is showing now and remembers it; until then the site follows the device
  var themeBtn = document.querySelector('.theme-btn');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var isDark = function () { var t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : systemDark.matches; };
  var syncTheme = function () {
    var dark = isDark();
    if (themeBtn) themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', dark ? '#000000' : '#FFFFFF'); m.removeAttribute('media'); });
  };
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('ispdock-theme', next); } catch (e) {}
      syncTheme();
    });
    if (systemDark.addEventListener) systemDark.addEventListener('change', syncTheme);
    syncTheme();
  }

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    var close = function () { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); };
    toggle.addEventListener('click', function () {
      var open = !links.classList.contains('open');
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Plan calculator: smallest plan that fits, and what it costs per customer.
  var PLANS = [
    { key: 'starter', name: 'Starter', price: 45000, limit: 300 },
    { key: 'growth', name: 'Growth', price: 150000, limit: 2000 },
    { key: 'enterprise', name: 'Enterprise', price: 450000, limit: 5000 },
  ];
  var naira = function (n) { return '₦' + Math.round(n).toLocaleString('en-NG'); };
  var range = document.getElementById('custCount');
  var out = document.getElementById('custOut');
  var text = document.getElementById('calcOut');
  document.querySelectorAll('.plan').forEach(function (p) {
    var f = document.createElement('span');
    f.className = 'fit';
    f.textContent = 'Fits your size';
    p.querySelector('.price').after(f);
  });
  function update() {
    var n = Number(range.value);
    out.textContent = n.toLocaleString('en-NG');
    range.style.setProperty('--fill', ((n - range.min) / (range.max - range.min) * 100) + '%');
    var plan = PLANS.find(function (p) { return n <= p.limit; });
    var ent = PLANS[PLANS.length - 1];
    // Enterprise stays the highlighted plan above its limit too; the outline never falls back to a smaller plan
    var lit = plan || ent;
    document.querySelectorAll('.plan').forEach(function (el) { el.classList.toggle('is-fit', el.dataset.plan === lit.key); });
    document.querySelector('.plans').classList.add('has-fit');
    if (!plan) {
      text.innerHTML = '<b>Enterprise</b>, with a plan made for your size above 5,000 customers. <a data-contact href="' + CONTACT + '">Talk to us</a>.';
      return;
    }
    text.innerHTML = '<b>' + plan.name + '</b> at ' + naira(plan.price) + ' a month: about <b>' + naira(plan.price / n) + ' per customer</b>' +
      (plan.key !== 'enterprise'
        ? '. With the network tools, <b>Enterprise</b> is about <b>' + naira(ent.price / n) + ' per customer</b>.'
        : ', network tools included.');
  }
  if (range && out && text) { range.addEventListener('input', update); update(); }

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Manifesto: wrap words so they can fill in as the paragraph scrolls past.
  var fill = document.querySelector('[data-fill]');
  if (fill && !still) {
    var words = [];
    Array.prototype.slice.call(fill.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span');
        w.className = 'w';
        w.textContent = part;
        words.push(w);
        frag.appendChild(w);
      });
      node.replaceWith(frag);
    });
    var lit = -1, queued = false;
    var paint = function () {
      queued = false;
      var r = fill.getBoundingClientRect(), vh = window.innerHeight;
      // 0 when the top reaches 85% of the screen, 1 when the bottom reaches 55%.
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
      var n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
      if (n === lit) return;
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
      lit = n;
    };
    var onScroll = function () { if (!queued) { queued = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();
  }

  // Hero: type the last word, hold, erase, next. Runs only while the hero is on screen.
  var typed = document.querySelector('.typed');
  if (typed && !still) {
    var list = typed.dataset.words.split('|'), wi = 0, ci = typed.textContent.length, del = true, timer = null, seen = true;
    var current = typed.textContent;
    var tick = function () {
      timer = null;
      if (!seen) return;
      var delay;
      if (del) {
        ci--; typed.textContent = current.slice(0, ci);
        if (ci <= 0) { del = false; current = list[wi]; wi = (wi + 1) % list.length; delay = 260; } else delay = 38;
      } else {
        ci++; typed.textContent = current.slice(0, ci);
        if (ci >= current.length) { del = true; delay = 2000; } else delay = 85;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2200);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        seen = e[0].isIntersecting;
        if (seen && !timer) timer = setTimeout(tick, 600);
      }).observe(typed);
    }
  }

  // Spotlight scenes: fixed 460 x 440 stages scaled to fit their panel. Each tells a short story on a loop while on screen.
  var scenes = document.querySelectorAll('.scene');
  var fitScenes = function () {
    scenes.forEach(function (sc) {
      var box = sc.parentNode, art = box.parentNode, cs = getComputedStyle(art);
      var k = Math.min(1, (art.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / 460);
      box.style.width = 460 * k + 'px';
      box.style.height = 440 * k + 'px';
      sc.style.transform = 'scale(' + k + ')';
    });
  };
  fitScenes();
  window.addEventListener('resize', fitScenes);

  if (window.gsap && !still && 'IntersectionObserver' in window) {
    var G = window.gsap;
    var $ = function (sc, s) { return sc.querySelector(s); };
    var $$ = function (sc, s) { return Array.prototype.slice.call(sc.querySelectorAll(s)); };
    // position of el inside root, ignoring transforms
    var pos = function (el, root) {
      var x = 0, y = 0;
      while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
      return { x: x, y: y };
    };
    // a finger tap: a square ring that lands on el and spreads out
    var tapAt = function (tl, tap, root, el, at) {
      tl.call(function () { var p = pos(el, root); G.set(tap, { x: p.x + el.offsetWidth * 0.66, y: p.y + el.offsetHeight / 2 }); }, null, at)
        .fromTo(tap, { scale: 0.4, opacity: 1 }, { scale: 1.9, opacity: 0, duration: 0.55, ease: 'power2.out' }, '>');
    };
    var count = function (el, from, to, fmt) {
      var o = { v: from };
      return { target: o, vars: { v: to, onUpdate: function () { el.textContent = fmt(Math.round(o.v)); } } };
    };
    var money = function (n) { return '₦' + n.toLocaleString('en-NG'); };
    // run build(i) for i = 0, 1, 2 ... one after another, playing only while the scene is on screen
    var loopScene = function (sc, build) {
      var i = 0, tl = null, on = false;
      var next = function () { tl = build(i++); tl.eventCallback('onComplete', next); if (!on) tl.pause(); };
      next();
      new IntersectionObserver(function (e) { on = e[0].isIntersecting; if (on) tl.play(); else tl.pause(); }, { threshold: 0.3 }).observe(sc);
    };

    // Payments: pick a way to pay, tap Pay, the gateway confirms, the money runs to the account,
    // the oldest bill is stamped paid and the rest lands in the wallet.
    var pay = document.querySelector('[data-scene="pay"]');
    if (pay) {
      var pScreen = $(pay, '.ps-screen'), opts = $$(pay, '.ps-opt'), sel = $(pay, '.ps-sel'), pBtn = $(pay, '.ps-btn');
      var label = $(pay, '.ps-label'), spin = $(pay, '.ps-spin'), done = $(pay, '.ps-done'), check = $(pay, '.ps-check');
      var checkPath = $(pay, '.ps-check path'), via = $(pay, '.ps-via'), pTap = $(pay, '.ps-tap'), ledger = $(pay, '.ps-ledger');
      var stamp = $(pay, '.ps-stamp'), wallet = $(pay, '.ps-wallet'), pToast = $(pay, '.ps-toast'), packet = $(pay, '.ps-packet');
      var wire = $(pay, '.ps-wire-base'), wireLen = wire.getTotalLength();
      var METHODS = ['Bank transfer', 'Card', 'USSD', 'OPay'];
      loopScene(pay, function (i) {
        var m = i % opts.length, o = opts[m];
        G.set(opts, { opacity: 0, y: 14 });
        G.set(sel, { opacity: 0, y: 0, height: opts[0].offsetHeight });
        opts.forEach(function (x) { x.classList.remove('on'); });
        G.set(label, { opacity: 1 }); G.set(spin, { opacity: 0, rotation: 0 });
        G.set(done, { autoAlpha: 0 }); G.set(check, { scale: 0.3 }); G.set(checkPath, { strokeDashoffset: 40 });
        G.set(ledger, { opacity: 0, x: 24 }); G.set(pToast, { autoAlpha: 0, y: -12 }); G.set(packet, { opacity: 0 });
        G.set(stamp, { opacity: 1, scale: 1, rotation: 0 });
        stamp.textContent = 'Due'; stamp.classList.remove('paid'); wallet.textContent = '₦0';
        via.textContent = METHODS[m] + ' · confirmed by the gateway';
        var w = count(wallet, 0, 5000, money), run = { t: 0 };
        var tl = G.timeline({ delay: 0.3 });
        tl.to(opts, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
          .to(ledger, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }, 0.25);
        tapAt(tl, pTap, pScreen, o, '+=0.35');
        tl.to(sel, { opacity: 1, y: o.offsetTop, height: o.offsetHeight, duration: 0.45, ease: 'expo.inOut' }, '<')
          .call(function () { o.classList.add('on'); }, null, '<0.2');
        tapAt(tl, pTap, pScreen, pBtn, '+=0.75');
        tl.to(pBtn, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1 }, '<')
          .to(label, { opacity: 0, duration: 0.15 }, '<')
          .to(spin, { opacity: 1, duration: 0.15 }, '<')
          .to(spin, { rotation: 630, duration: 1.15, ease: 'none' }, '<')
          .to(done, { autoAlpha: 1, duration: 0.25 })
          .to(check, { scale: 1, duration: 0.55, ease: 'back.out(2.4)' }, '<')
          .to(checkPath, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')
          .set(packet, { opacity: 1 }, '+=0.1')
          .to(run, { t: 1, duration: 0.75, ease: 'power1.inOut', onUpdate: function () { var p = wire.getPointAtLength(run.t * wireLen); G.set(packet, { x: p.x, y: p.y }); } })
          .set(packet, { opacity: 0 })
          .call(function () { stamp.textContent = 'Paid'; stamp.classList.add('paid'); })
          .fromTo(stamp, { scale: 2.6, rotation: -16, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.45, ease: 'back.out(3)', immediateRender: false }, '<')
          .to(ledger, { x: 3, duration: 0.05, yoyo: true, repeat: 5 }, '<0.3')
          .to(w.target, Object.assign({ duration: 0.9, ease: 'power2.out' }, w.vars), '<')
          .to(pToast, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '-=0.4')
          .to({}, { duration: 2.4 })
          .to([opts, sel, done, ledger, pToast], { opacity: 0, duration: 0.45 });
        return tl;
      });
    }

    // Portal: usage fills in, the days-left frame shows 12 days, support writes back, the customer taps Renew
    // and the frame runs all the way round.
    var portal = document.querySelector('[data-scene="portal"]');
    if (portal) {
      var tScreen = $(portal, '.pt-screen'), bars = $$(portal, '.pt-bars i'), gb = $(portal, '.pt-gb'), fillPath = $(portal, '.pt-fill');
      var days = $(portal, '.pt-days b'), tBtn = $(portal, '.pt-btn'), tTap = $(portal, '.pt-tap'), chat = $(portal, '.pt-chat');
      var typing = $(portal, '.pt-typing'), dots = $$(portal, '.pt-typing i'), msg = $(portal, '.pt-msg'), tToast = $(portal, '.pt-toast');
      var parts = $$(portal, '.pt-screen > *:not(.pt-tap)');
      loopScene(portal, function () {
        G.set(parts, { opacity: 1 });
        G.set(bars, { scaleY: 0 }); gb.textContent = '0'; days.textContent = '0';
        G.set(fillPath, { strokeDashoffset: 480 });
        G.set([chat, tToast], { autoAlpha: 0, y: 14 });
        typing.style.display = 'flex'; G.set(msg, { opacity: 0, display: 'none' });
        tBtn.textContent = 'Renew';
        var g = count(gb, 0, 184, String), d1 = count(days, 0, 12, String), d2 = count(days, 12, 42, String);
        var tl = G.timeline({ delay: 0.3 });
        tl.from(parts, { y: 12, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' })
          .to(bars, { scaleY: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.8)' }, 0.4)
          .to(g.target, Object.assign({ duration: 1.2, ease: 'power2.out' }, g.vars), '<')
          .to(fillPath, { strokeDashoffset: 480 * (1 - 12 / 30), duration: 1.1, ease: 'power3.out' }, '<')
          .to(d1.target, Object.assign({ duration: 1.1, ease: 'power3.out' }, d1.vars), '<')
          .to(chat, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '+=0.2')
          .to(dots, { y: -4, duration: 0.22, yoyo: true, repeat: 5, stagger: 0.1, ease: 'sine.inOut' })
          .call(function () { typing.style.display = 'none'; })
          .to(msg, { display: 'block', opacity: 1, duration: 0.35 });
        tapAt(tl, tTap, tScreen, tBtn, '+=0.5');
        tl.to(tBtn, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1 }, '<')
          .call(function () { tBtn.textContent = 'Paying by card…'; }, null, '<')
          .call(function () { tBtn.textContent = 'Renewed'; }, null, '+=0.9')
          .to(fillPath, { strokeDashoffset: 0, duration: 1.3, ease: 'expo.inOut' }, '<')
          .to(d2.target, Object.assign({ duration: 1.3, ease: 'expo.inOut' }, d2.vars), '<')
          .to(tToast, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '-=0.6')
          .to({}, { duration: 2.4 })
          .to(parts.concat([chat, tToast]), { opacity: 0, duration: 0.45 });
        return tl;
      });
    }

    // Brand: a colour wipe repaints the dashboard and the email for the next company,
    // then the address types itself as admin., my. and mail.
    var brand = document.querySelector('[data-scene="brand"]');
    if (brand) {
      var BRANDS = [
        { name: 'Nova Fibre', b: '#E4572E', bd: '#8F2F15' },
        { name: 'Kite Net', b: '#1A73E8', bd: '#0B3C8C' },
        { name: 'Bluebird Wireless', b: '#7C3AED', bd: '#4C1D95' },
        { name: 'Ember Link', b: '#0F766E', bd: '#0A3F3A' },
      ];
      var wipe = $(brand, '.br-wipe'), names = $$(brand, '.br-name'), sub = $(brand, '.br-sub'), mail = $(brand, '.br-mail');
      var chart = $$(brand, '.br-chart i'), chips = $$(brand, '.br-chips i'), hero = $(brand, '.br-hero');
      var type = function (tl, word) {
        var erase = { p: 0 }, write = { p: 0 }, from = '';
        tl.to(erase, { p: 1, duration: 0.25, ease: 'none', onStart: function () { from = sub.textContent; },
          onUpdate: function () { sub.textContent = from.slice(0, Math.round(from.length * (1 - erase.p))); } }, '+=0.9')
          .to(write, { p: 1, duration: word.length * 0.07, ease: 'none',
            onUpdate: function () { sub.textContent = word.slice(0, Math.round(word.length * write.p)); } });
      };
      loopScene(brand, function (i) {
        var B = BRANDS[i % BRANDS.length];
        G.set(wipe, { backgroundColor: B.b, clipPath: 'inset(0 100% 0 0)' });
        var tl = G.timeline({ delay: 0.2 });
        tl.to(mail, { opacity: 0, y: 12, duration: 0.3 })
          .to(wipe, { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'expo.inOut' }, 0)
          .call(function () {
            brand.style.setProperty('--b', B.b); brand.style.setProperty('--bd', B.bd);
            names.forEach(function (n) { n.textContent = B.name; });
            chips.forEach(function (c, k) { c.classList.toggle('on', k === i % chips.length); });
            sub.textContent = 'admin.';
          })
          .to(wipe, { clipPath: 'inset(0 0% 0 100%)', duration: 0.55, ease: 'expo.inOut' })
          .fromTo(chart, { scaleY: 0 }, { scaleY: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out', immediateRender: false }, '<0.15')
          .fromTo(hero, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'expo.out', immediateRender: false }, '<')
          .to(mail, { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '<0.2');
        type(tl, 'my.');
        type(tl, 'mail.');
        type(tl, 'admin.');
        tl.to({}, { duration: 0.6 });
        return tl;
      });
    }
  }

  // Network globe: dotted land (Natural Earth, 1.25° rows), lines running out from Lagos, turning on its own and by drag.
  // Plain canvas, no library. Stops while off screen; holds still for reduced motion.
  (function () {
    var canvas = document.querySelector('.globe-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var LAND = '|1e,4|1e,2|1g,3|1h,3|1i,4|1j,5|1l,5|1m,4,5d,2|1p,4,5i,2|1q,5,59,1,5n,2|1r,6,5d,1,5s,1|1s,5,1y,1,5h,1,5w,3|1t,7,62,1|1v,9,5m,2,66,2|1w,a,5n,7|1x,a,5p,1,5r,7|1z,9,29,2,3n,1,5f,2,5u,8|20,d,3o,6,5h,6,5u,b|22,d,3q,8,5k,8,5x,c|22,e,3s,8,5n,p|23,f,3t,a,5p,q|24,g,3u,b,5r,r|26,f,3v,c,5t,s|27,g,3w,d,5w,s|28,g,3y,e,4j,2,5y,t|28,j,3z,f,4k,3,5z,s|29,m,40,g,4m,3,62,q|2a,m,41,g,4n,4,65,p,77,1|2b,m,41,h,4p,3,6a,l|2b,n,42,i,4q,4,6d,i|2b,p,42,l,4r,4,6f,d,6t,4|2a,r,44,l,4t,4,6i,a,6v,3|29,s,45,m,4w,2,6l,2,6o,4,6x,3|29,t,46,m,4y,1,6p,5,6y,2|28,v,47,l,6s,3,6z,1|28,w,48,l,71,1|28,y,48,l,6k,1,76,2,7g,1|28,z,49,l,6i,6,6q,1,72,2,76,2,7f,1|28,z,49,l,6c,5,6v,1,71,7|27,10,49,l,6b,1,71,7,79,2|27,z,49,m,6a,2,6o,2,70,8,7c,1|27,x,48,n,69,3,6j,1,6o,1,6s,1,6v,1,6x,9|27,p,2x,3,48,p,69,3,6g,5,6n,2,71,3|27,s,47,r,68,3,6g,6,6p,1,6x,2|28,n,47,r,67,4,6f,7|29,n,48,s,67,3,6f,8|2a,l,48,t,66,2,69,2,6h,5|2a,l,47,u,64,2,68,2,6i,3|2a,j,3s,7,44,y,63,1,68,2,6k,3|2a,f,3q,1c,5r,1,67,1,6q,1|26,1,29,f,3o,1e,5q,1,65,1,6n,4|24,3,28,1,2a,c,3o,1e,5m,2,5p,1,64,1,6p,1|22,2,2a,8,2j,1,2l,1,3m,1g,5l,3,68,1|21,2,2c,1,3k,1b,50,1,5k,3,62,1,66,4,6m,1|20,3,3j,1c,5j,4,61,9|1x,6,3j,19,4t,4,5h,5,60,8,6h,2|1v,7,3i,18,4s,7,5g,5,5y,9,6g,1|1q,8,3h,17,4r,7,5e,7,5u,2,5x,8,6e,2|1o,a,3h,15,4p,a,5d,7,5t,9,6d,1|1l,6,1v,3,29,3,3g,14,4n,d,5b,9,5r,9,62,2|1k,6,1v,2,25,2,3f,14,4l,d,5a,a,5p,a|1k,6,1w,1,23,1,3d,15,4j,f,56,d,5m,c,60,1|1j,6,1z,3,3d,13,4i,f,55,f,5l,h,66,1|1e,1,1h,7,3c,12,4f,a,4q,3,51,11,63,1|1d,1,1g,8,3b,10,4d,9,4q,1,4u,2,4y,12|1c,1,1f,8,1y,2,3b,y,4b,a,4q,19|1a,2,1d,a,1x,2,3a,x,49,9,4k,1d|1a,1,1c,b,1w,1,38,1,3b,15,4i,1d|18,1,1a,i,1t,3,3a,14,4f,1d|17,p,38,i,3t,4,43,1n,5w,1|16,p,31,1,37,f,3r,1,41,1l,5r,3|15,r,37,b,3z,1k,5s,2|13,t,35,1,37,a,3p,1,3v,1,3x,1i,5k,2,5o,4|11,u,34,1,39,6,3r,1,3t,1,3v,1j,5i,1,5o,3|11,s,30,5,3e,2,3j,2,3n,e,44,15,5a,1,5e,2,5m,1|z,t,2y,6,39,1,3e,1,3h,2,3k,e,41,14,5a,2,5j,1|y,v,2x,5,37,1,3b,1,3e,3,3i,e,3y,16,55,4,5g,1|y,v,2v,6,35,1,38,2,3c,5,3j,3,3p,4,3w,1a|x,v,2s,7,33,3,38,6,3m,3,3s,1a,53,1,58,2|w,w,1t,1,2v,5,31,2,34,8,3i,5,3p,1c,55,2|w,w,1t,2,2t,7,31,9,3c,8,3m,1d,51,1|v,w,1t,1,2q,l,3c,6,3k,1b|u,w,1t,3,2n,25|t,t,1n,2,1s,2,2m,22,4p,1|r,v,1o,1,2h,1,2l,1z,4l,1,4r,1|q,n,1e,b,2g,2,2j,1y,4n,1|p,m,1d,b,2a,2,2d,3,2h,1u,4i,2|m,o,1b,b,28,2,2b,1,2h,1o,47,1,4e,2|l,n,1b,7,26,1,28,1,2f,1,2k,1g,49,3|9,1,k,l,18,1,1a,6,25,1,2b,1,2d,2,2h,1g,44,4|b,1,j,i,18,6,2a,2,2f,1e,40,3|7,4,h,i,16,4,1b,1,24,2,27,2,2c,1c,3s,1,3w,2|5,8,e,k,15,3,1h,1,21,9,2b,1e,3s,1|5,s,13,2,1e,2,1z,4,25,1f,3l,1,3n,3|6,q,z,1,14,1,1c,3,1w,5,22,1m|7,p,x,2,12,2,19,4,1j,2,1u,4,1z,1i|0,1,2,3,v,3,12,5,1b,6,1k,9,1w,1,20,2|3,3,v,3,12,2,1a,g,1w,1,1y,2,28,1|1,4,k,2,o,2,u,1,z,4,19,e,1v,2|5,7,e,4,j,3,n,1,p,1,r,1,u,2,11,7,1l,2,1q,3,1u,3,1y,1,20,2|5,4,h,4,m,2,p,5,y,8,1i,3,1s,1,1v,p|0,e,f,1,j,1,m,1,r,4,14,j,1o,3,1u,1,26,2,2c,7|d,1,f,5,l,3,u,7,1j,1,1n,1,1q,b|c,2,j,1,r,8,1n,4|d,2,g,4,p,8,1c,1,1i,6,1s,3|h,2,l,8,1g,2|b,1,e,1,g,1,j,9,x,2|b,1,d,1,f,1,h,7,t,2,16,1';
    var RAD = Math.PI / 180, STEP = 1.25, LAT0 = -56;
    var vec = function (lat, lon) { var a = lat * RAD, b = lon * RAD; return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; };
    // land dots as unit vectors
    var dots = [];
    LAND.split('|').forEach(function (row, r) {
      if (!row) return;
      var lat = LAT0 + r * STEP, n = Math.max(1, Math.round(360 * Math.cos(lat * RAD) / STEP)), v = row.split(',').map(function (x) { return parseInt(x, 36); });
      for (var k = 0; k < v.length; k += 2) for (var i = v[k]; i < v[k] + v[k + 1]; i++) dots.push(vec(lat, -180 + (i + 0.5) * 360 / n));
    });
    var HOME = { name: 'Lagos', lat: 6.45, lon: 3.39 };
    // kind: site (solid), plan (hollow), up (uplink / cable landing abroad)
    var PLACES = [
      { lat: 7.38, lon: 3.94, kind: 'site' }, { lat: 9.06, lon: 7.49, kind: 'site' }, { lat: 4.82, lon: 7.03, kind: 'site' },
      { lat: 6.44, lon: 7.5, kind: 'site' }, { lat: 6.34, lon: 5.62, kind: 'site' }, { lat: 12.0, lon: 8.52, kind: 'site' },
      { lat: 10.52, lon: 7.44, kind: 'plan' }, { lat: 9.9, lon: 8.86, kind: 'plan' }, { lat: 7.73, lon: 8.52, kind: 'plan' },
      { lat: 5.6, lon: -0.19, kind: 'up' }, { lat: 14.7, lon: -17.47, kind: 'up' }, { lat: 38.72, lon: -9.14, kind: 'up' },
      { lat: 51.5, lon: -0.13, kind: 'up' }, { lat: 43.3, lon: 5.37, kind: 'up' }, { lat: -33.92, lon: 18.42, kind: 'up' },
      { lat: -1.29, lon: 36.82, kind: 'up' }, { lat: 30.04, lon: 31.24, kind: 'up' }
    ];
    var home = vec(HOME.lat, HOME.lon);
    // each line: points along the great circle from Lagos, lifted off the surface in the middle
    var lines = PLACES.map(function (p, i) {
      var b = vec(p.lat, p.lon), dot = home[0] * b[0] + home[1] * b[1] + home[2] * b[2];
      var w = Math.acos(Math.max(-1, Math.min(1, dot))), s = Math.sin(w), pts = [], N = 48, lift = Math.min(0.32, 0.04 + w * 0.22);
      for (var k = 0; k <= N; k++) {
        var t = k / N, f1 = Math.sin((1 - t) * w) / s, f2 = Math.sin(t * w) / s, h = 1 + lift * Math.sin(Math.PI * t);
        pts.push([(home[0] * f1 + b[0] * f2) * h, (home[1] * f1 + b[1] * f2) * h, (home[2] * f1 + b[2] * f2) * h]);
      }
      return { p: p, v: b, pts: pts, phase: (i * 0.137) % 1, speed: 0.22 + 0.5 / (0.6 + w * 3) };
    });

    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lon0 = -4, lat0 = 16, spin = still ? 0 : 5, vel = 0; // degrees, degrees per second
    var size = 0, dpr = 1, R = 0, cx = 0, cy = 0;
    var C = { pop: '#FBBC04', site: '#4C8DF6', line: '142,166,255' };
    var css = getComputedStyle(document.documentElement);
    var tok = function (n, f) { var v = css.getPropertyValue(n).trim(); return v || f; };
    C.pop = tok('--c-yellow', C.pop); C.site = tok('--c-blue', C.site);

    var resize = function () {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1); size = r.width;
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      R = size * 0.4; cx = size / 2; cy = size / 2;
    };
    // rotate a world vector into view space: turn by lon0 around the pole, tilt by lat0
    var sl, cl, st, ct;
    var setRot = function () { sl = Math.sin(-lon0 * RAD); cl = Math.cos(-lon0 * RAD); st = Math.sin(lat0 * RAD); ct = Math.cos(lat0 * RAD); };
    var view = function (v, out) {
      var x = v[0] * cl + v[2] * sl, z = -v[0] * sl + v[2] * cl, y = v[1];
      out[0] = x; out[1] = y * ct - z * st; out[2] = y * st + z * ct; return out;
    };
    var tmp = [0, 0, 0], tmp2 = [0, 0, 0];
    var shown = function (q) { return q[2] > 0 || q[0] * q[0] + q[1] * q[1] > 1.0001; };

    var rings = [{ tilt: 72, turn: -18, r: 1.22, a: 0.16 }, { tilt: 64, turn: 26, r: 1.32, a: 0.1 }];
    var ring = function (g, front, t) {
      ctx.beginPath();
      var started = false, ta = g.tilt * RAD, tb = (g.turn + t * 2) * RAD;
      for (var k = 0; k <= 120; k++) {
        var a = k / 120 * Math.PI * 2, x = Math.cos(a) * g.r, y = Math.sin(a) * g.r * Math.cos(ta), z = Math.sin(a) * g.r * Math.sin(ta);
        var X = x * Math.cos(tb) - y * Math.sin(tb), Y = x * Math.sin(tb) + y * Math.cos(tb);
        var vis = front ? z > 0 : z <= 0;
        if (vis) { if (!started) { ctx.moveTo(cx + X * R, cy - Y * R); started = true; } else ctx.lineTo(cx + X * R, cy - Y * R); } else started = false;
      }
      ctx.strokeStyle = 'rgba(' + C.line + ',' + g.a + ')'; ctx.lineWidth = 1; ctx.stroke();
    };
    var pin = function (q, kind, t) {
      var x = cx + q[0] * R, y = cy - q[1] * R, face = Math.max(0, q[2]);
      if (q[2] <= 0) return;
      var col = kind === 'pop' ? C.pop : C.site, s = kind === 'pop' ? 5 : 3.2;
      ctx.globalAlpha = 0.35 + face * 0.65;
      if (kind === 'plan') { ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.strokeRect(x - s, y - s, s * 2, s * 2); }
      else {
        ctx.shadowColor = col; ctx.shadowBlur = kind === 'pop' ? 18 : 10; ctx.fillStyle = col;
        ctx.fillRect(x - s, y - s, s * 2, s * 2); ctx.shadowBlur = 0;
      }
      if (kind === 'pop' && !still) { // a square ping spreading out from the POP
        var p = (t * 0.5) % 1, d = s + p * 22; ctx.globalAlpha = (1 - p) * face; ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.strokeRect(x - d, y - d, d * 2, d * 2);
      }
      ctx.globalAlpha = 1;
    };

    var draw = function (t) {
      setRot();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      rings.forEach(function (g) { ring(g, false, t); });
      // the sphere itself: a dark disc with a soft rim so the back stays hidden
      var gr = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      gr.addColorStop(0, 'rgba(30,40,70,0.55)'); gr.addColorStop(1, 'rgba(8,11,22,0.9)');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
      ctx.strokeStyle = 'rgba(' + C.line + ',0.28)'; ctx.lineWidth = 1; ctx.stroke();
      // land dots, brighter toward the middle and the light side, batched by brightness
      var buckets = [[], [], [], [], [], []], ds = Math.max(1.1, size / 360);
      for (var i = 0; i < dots.length; i++) {
        var q = view(dots[i], tmp);
        if (q[2] <= 0.02) continue;
        var light = q[2] * 0.75 + (q[1] * 0.25 - q[0] * 0.2) * 0.5;
        var b = Math.max(0, Math.min(5, Math.floor(light * 6)));
        buckets[b].push(cx + q[0] * R, cy - q[1] * R, 0.6 + q[2] * 0.4);
      }
      buckets.forEach(function (list, b) {
        if (!list.length) return;
        ctx.fillStyle = 'rgba(235,240,255,' + (0.14 + b * 0.15) + ')';
        ctx.beginPath();
        for (var k = 0; k < list.length; k += 3) { var w = ds * list[k + 2]; ctx.rect(list[k] - w / 2, list[k + 1] - w / 2, w, w); }
        ctx.fill();
      });
      // lines from Lagos, with a light running out along each
      lines.forEach(function (L) {
        var up = L.p.kind === 'up';
        ctx.beginPath(); var on = false;
        for (var k = 0; k < L.pts.length; k++) {
          var q = view(L.pts[k], tmp);
          if (shown(q)) { var X = cx + q[0] * R, Y = cy - q[1] * R; if (!on) { ctx.moveTo(X, Y); on = true; } else ctx.lineTo(X, Y); } else on = false;
        }
        ctx.strokeStyle = up ? 'rgba(' + C.line + ',0.42)' : 'rgba(' + C.line + ',0.9)'; ctx.lineWidth = up ? 1 : 1.5; ctx.stroke();
        if (still) return;
        // a comet running out from Lagos: a bright head and a fading tail
        var f = (t * L.speed + L.phase) % 1, last = L.pts.length - 1, head = Math.floor(f * last), fade = Math.sin(Math.PI * f), TAIL = up ? 10 : 6;
        ctx.lineCap = 'round';
        for (var j = Math.max(1, head - TAIL); j <= head; j++) {
          var qa = view(L.pts[j - 1], tmp), qb = view(L.pts[j], tmp2);
          if (!shown(qa) || !shown(qb)) continue;
          var k2 = 1 - (head - j) / TAIL;
          ctx.strokeStyle = up ? 'rgba(255,255,255,' + (k2 * fade) + ')' : 'rgba(' + C.line + ',' + (k2 * fade) + ')';
          ctx.lineWidth = 1 + k2 * 2;
          ctx.beginPath(); ctx.moveTo(cx + qa[0] * R, cy - qa[1] * R); ctx.lineTo(cx + qb[0] * R, cy - qb[1] * R); ctx.stroke();
        }
        ctx.lineCap = 'butt';
      });
      lines.forEach(function (L) { if (L.p.kind !== 'up') pin(view(L.v, tmp), L.p.kind, t); else { var q = view(L.v, tmp); if (q[2] > 0) { ctx.globalAlpha = 0.4 + q[2] * 0.6; ctx.fillStyle = '#FFFFFF'; ctx.fillRect(cx + q[0] * R - 2, cy - q[1] * R - 2, 4, 4); ctx.globalAlpha = 1; } } });
      var hq = view(home, tmp);
      pin(hq, 'pop', t);
      if (hq[2] > 0.15) { // the POP's name, like a map label
        ctx.globalAlpha = Math.min(1, (hq[2] - 0.15) * 3);
        ctx.font = '500 ' + Math.max(10, size / 52) + 'px "JetBrains Mono", ui-monospace, monospace';
        var lx = cx + hq[0] * R, ly = cy - hq[1] * R, tx = lx - size * 0.2, ty = ly - size * 0.1;
        ctx.strokeStyle = 'rgba(245,245,247,0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lx - 7, ly - 7); ctx.lineTo(tx + size * 0.05, ty); ctx.lineTo(tx - 4, ty); ctx.stroke();
        ctx.fillStyle = '#F5F5F7'; ctx.textAlign = 'right'; ctx.fillText('LAGOS · POP', tx - 10, ty + 4); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
      }
      rings.forEach(function (g) { ring(g, true, t); });
    };

    // turning: on its own, and by drag (sideways turns, up/down tilts); a flick keeps going and eases back to the slow turn
    var dragging = false, lastX = 0, lastY = 0, lastT = 0, running = false, visible = false, prev = 0, clock = 0;
    canvas.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); vel = 0; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var now = performance.now(), dx = e.clientX - lastX, dy = e.clientY - lastY, k = 180 / (Math.PI * R);
      lon0 -= dx * k; lat0 = Math.max(-35, Math.min(60, lat0 + dy * k));
      vel = -dx * k / Math.max(1, now - lastT) * 1000; lastX = e.clientX; lastY = e.clientY; lastT = now;
      if (!running) draw(clock);
    });
    var up = function () { dragging = false; };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

    var frame = function (now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - prev) / 1000); prev = now; clock += dt;
      if (!dragging) { vel += (spin - vel) * Math.min(1, dt * 1.5); lon0 += vel * dt; }
      draw(clock);
      requestAnimationFrame(frame);
    };
    var start = function () { if (running || still || document.hidden || !visible) return; running = true; prev = performance.now(); requestAnimationFrame(frame); };
    var stop = function () { running = false; };
    resize(); draw(0);
    window.addEventListener('resize', function () { resize(); draw(clock); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); else stop(); }).observe(canvas);
    else { visible = true; start(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  })();

  // Spotlight cards on narrow or short screens: stick each card where its whole height is still on screen
  var stackCards = document.querySelectorAll('.stack .spot');
  var smallStack = window.matchMedia('(max-width: 1100px), (max-height: 759px)');
  var setStick = function () {
    stackCards.forEach(function (card, i) {
      if (!smallStack.matches) { card.style.removeProperty('--stick'); return; }
      var top = Math.min(80 + i * 12, window.innerHeight - card.offsetHeight - 12);
      card.style.setProperty('--stick', top + 'px');
    });
  };
  if (stackCards.length) { setStick(); window.addEventListener('resize', setStick); window.addEventListener('load', setStick); }

  // Live dashboard: today's date, new payments, customers online and traffic keep moving while it is on screen
  var today = document.querySelector('[data-today]');
  if (today) today.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  var device = document.querySelector('.device');
  if (device && !still && 'IntersectionObserver' in window) {
    var naira = function (n) { return '₦' + Math.round(n).toLocaleString('en-NG'); };
    var pays = device.querySelector('[data-pays]');
    var collectedEl = device.querySelector('[data-collected]');
    var onlineEl = device.querySelector('[data-online]');
    var downEl = device.querySelector('[data-down]');
    var upEl = device.querySelector('[data-up]');
    var lines = { down: document.getElementById('trDown'), up: document.getElementById('trUp'), fill: document.getElementById('trFill') };
    var series = {};
    ['down', 'up'].forEach(function (k) {
      series[k] = lines[k] ? lines[k].getAttribute('points').trim().split(/\s+/).map(function (p) { return parseFloat(p.split(',')[1]); }) : [];
    });
    var collected = 18412500, online = 1764, beat = 0;
    var methods = ['Bank transfer', 'Card', 'USSD', 'OPay', 'Monnify', 'Card', 'Bank transfer'];
    var prices = [9000, 12500, 15000, 18000, 22500, 30000, 45000];
    var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    var ages = ['Just now', '1 min ago', '3 min ago', '5 min ago', '8 min ago'];
    var draw = function () {
      var n = series.down.length, pts = function (arr) { return arr.map(function (y, i) { return (i * 300 / (n - 1)).toFixed(1) + ',' + y.toFixed(1); }).join(' '); };
      var d = pts(series.down);
      lines.down.setAttribute('points', d);
      lines.up.setAttribute('points', pts(series.up));
      lines.fill.setAttribute('points', '0,120 ' + d + ' 300,120');
    };
    var walk = function (arr, lo, hi) {
      var last = arr[arr.length - 1], next = Math.min(hi, Math.max(lo, last + (Math.random() - 0.5) * 16));
      arr.shift(); arr.push(next);
      return next;
    };
    var tickLive = function () {
      beat++;
      if (series.down.length) {
        var dy = walk(series.down, 22, 108), uy = walk(series.up, 60, 112);
        draw();
        downEl.textContent = String(Math.round((120 - dy) * 6.2));
        upEl.textContent = String(Math.round((120 - uy) * 3.4));
      }
      if (beat % 2 === 0) {
        online = Math.max(1700, Math.min(1830, online + Math.round((Math.random() - 0.48) * 6)));
        onlineEl.textContent = online.toLocaleString('en-NG');
      }
      if (beat % 3 === 0 && pays) {
        var amount = pick(prices);
        var row = document.createElement('tr');
        row.className = 'new';
        row.innerHTML = '<td>CUS-' + String(1000 + Math.floor(Math.random() * 1400)).padStart(4, '0') + '</td><td>' + pick(methods) + '</td><td>' + naira(amount) + '</td><td>Just now</td>';
        pays.insertBefore(row, pays.firstChild);
        while (pays.children.length > 4) pays.removeChild(pays.lastChild);
        Array.prototype.forEach.call(pays.children, function (tr, i) { if (i) tr.lastChild.textContent = ages[Math.min(i, ages.length - 1)]; });
        collected += amount;
        collectedEl.textContent = naira(collected);
      }
    };
    var liveTimer = null;
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting && !liveTimer) liveTimer = setInterval(tickLive, 1000);
      else if (!e[0].isIntersecting && liveTimer) { clearInterval(liveTimer); liveTimer = null; }
    }, { threshold: 0.2 }).observe(device);
  }

  // GSAP: scroll-driven motion for a few sections. Without GSAP or with reduced motion, the plain reveal below runs.
  if (!still && window.gsap && window.ScrollTrigger) {
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    var unreveal = function (el) { el.classList.remove('reveal'); };

    // Dock: the dashboard stays flat and still. On wide screens, scrolling pins it, shrinks it in place, breaks its parts
    // away into the coloured menu boxes on either side and draws a looping line from the dashboard to each box.
    var dock = document.querySelector('.dock');
    if (dock && device) {
      gsap.matchMedia().add('(min-width: 1101px) and (min-height: 700px)', function () {
        var SCALE = 0.5, GAP = 72, NS = 'http://www.w3.org/2000/svg';
        var svg = dock.querySelector('.dock-lines');
        var boxes = gsap.utils.toArray(dock.querySelectorAll('.dock-box'));
        var TOP = 24;
        // the pieces that leave the dashboard to become the boxes
        var parts = boxes.map(function (b) { return device.querySelector(b.dataset.src); }).filter(Boolean);
        dock.classList.add('is-split');
        // offset of an element inside the dashboard, ignoring transforms
        var rel = function (el) {
          var x = 0, y = 0, n = el;
          while (n && n !== device) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
          return n === device ? { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight } : null;
        };
        var geo = {};
        var layout = function () {
          var W = dock.clientWidth, H = device.offsetHeight, w = device.offsetWidth;
          var x0 = (W - w * SCALE) / 2, y0 = TOP, x1 = x0 + w * SCALE;
          // the dock keeps only the shrunk height; the full-size dashboard overflows into the pin's scroll space at first
          dock.style.height = (H * SCALE + TOP * 2) + 'px';
          var bw = Math.min(260, x0 - GAP);
          var sides = { left: [], right: [] };
          boxes.forEach(function (b) { b.style.width = bw + 'px'; sides[b.dataset.side].push(b); });
          svg.setAttribute('width', W); svg.setAttribute('height', H);
          svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
          svg.textContent = '';
          Object.keys(sides).forEach(function (side) {
            var list = sides[side], gap = 20;
            var total = list.reduce(function (t, b) { return t + b.offsetHeight; }, 0) + gap * (list.length - 1);
            var y = y0 + (H * SCALE - total) / 2;
            list.forEach(function (b, i) {
              var bx = side === 'left' ? x0 - GAP - bw : x1 + GAP, bh = b.offsetHeight, cy = y + bh / 2;
              b.style.left = bx + 'px'; b.style.top = y + 'px';
              // where the part it came from sits once the dashboard has shrunk
              var src = rel(device.querySelector(b.dataset.src)) || { x: w / 2, y: H / 2, w: 40, h: 40 };
              geo[i + side] = { x: x0 + src.x * SCALE - bx, y: y0 + src.y * SCALE - y, sx: (src.w * SCALE) / bw, sy: (src.h * SCALE) / bh };
              b._geo = geo[i + side];
              // elbow line: out of the dashboard's edge, across, then along to the box
              var ex = side === 'left' ? x0 : x1, ey = y0 + (H * SCALE) * (i + 1) / (list.length + 1);
              var tx = side === 'left' ? bx + bw : bx, mx = (ex + tx) / 2;
              var d = 'M' + ex + ' ' + ey + ' H' + mx + ' V' + cy + ' H' + tx;
              var color = getComputedStyle(b).getPropertyValue('--box').trim();
              ['base', 'flow'].forEach(function (cls) {
                var p = document.createElementNS(NS, 'path');
                p.setAttribute('d', d); p.setAttribute('class', cls); p.setAttribute('stroke', color);
                svg.appendChild(p);
              });
              [[ex, ey], [tx, cy]].forEach(function (pt) {
                var r = document.createElementNS(NS, 'rect');
                r.setAttribute('x', pt[0] - 4); r.setAttribute('y', pt[1] - 4); r.setAttribute('width', 8); r.setAttribute('height', 8);
                r.setAttribute('fill', color); r.setAttribute('class', 'end');
                svg.appendChild(r);
              });
              y += bh + gap;
            });
          });
        };
        layout();
        var drift = parts.map(function (p) { var left = p.getBoundingClientRect().left < device.getBoundingClientRect().left + device.offsetWidth / 2; return { x: (left ? -1 : 1) * gsap.utils.random(14, 26), y: gsap.utils.random(-10, 10), r: gsap.utils.random(-2, 2) }; });
        var tl = gsap.timeline({ scrollTrigger: { trigger: dock.parentNode, start: 'top 84px', end: '+=1500', pin: true, scrub: 0.6, invalidateOnRefresh: true,
          onRefreshInit: layout } });
        tl.to(device, { scale: SCALE, y: TOP, transformOrigin: '50% 0%', duration: 1, ease: 'power2.inOut' }, 0)
          .to(parts, { x: function (i) { return drift[i].x; }, y: function (i) { return drift[i].y; }, rotation: function (i) { return drift[i].r; }, opacity: 0.18, duration: 0.8, ease: 'power1.in' }, 0.5)
          .fromTo(boxes, {
            x: function (i, b) { return b._geo.x; }, y: function (i, b) { return b._geo.y; },
            scaleX: function (i, b) { return b._geo.sx; }, scaleY: function (i, b) { return b._geo.sy; },
            transformOrigin: '0 0', opacity: 0
          }, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1, immediateRender: true }, 0.9)
          .fromTo(svg, { clipPath: 'inset(0 50% 0 50%)', opacity: 0 }, { clipPath: 'inset(0 0% 0 0%)', opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.6)
          .to({}, { duration: 0.4 });
        return function () { dock.classList.remove('is-split'); dock.style.height = ''; svg.textContent = ''; boxes.forEach(function (b) { b.style.cssText = ''; }); };
      });
    }

    // Phones: each menu box sinks back and darkens as the next one slides over it
    gsap.matchMedia().add('(max-width: 820px)', function () {
      var list = gsap.utils.toArray('.dock-box');
      list.forEach(function (box, i) {
        var next = list[i + 1];
        if (!next) return;
        gsap.to(box, { scale: 0.93, '--dim': 0.28, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top ' + (80 + (i + 1) * 10) + 'px', scrub: true } });
      });
    });

    // Hero shapes drift at different speeds
    gsap.utils.toArray('.sh').forEach(function (sh, i) {
      var depth = [90, 180, 60, 240, 140][i] || 100;
      gsap.to(sh, { y: -depth, rotation: i % 2 ? 90 : -45, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    gsap.from('.sh', { scale: 0, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.3 });

    // Section headings rise word by word out of a mask
    var splitWords = function (el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          var frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var m = document.createElement('span'); m.className = 'wm';
            var w = document.createElement('span'); w.textContent = part;
            m.appendChild(w); frag.appendChild(m);
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === 1 && node.tagName !== 'BR') splitWords(node);
      });
    };
    gsap.utils.toArray('.head').forEach(function (head) {
      unreveal(head);
      var h2 = head.querySelector('h2');
      if (h2) splitWords(h2);
      var tl = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: 'play none none none' } });
      tl.from(head.querySelectorAll('.label'), { x: -16, opacity: 0, duration: 0.5, ease: 'power2.out' })
        .from(head.querySelectorAll('h2 .wm > span'), { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.04 }, 0.05)
        .from(head.querySelectorAll('.lede'), { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.3);
    });

    // Facts count up to their figure
    gsap.utils.toArray('.facts > div').forEach(function (fact, i) {
      unreveal(fact);
      var strong = fact.querySelector('strong');
      var m = strong && strong.textContent.match(/^(\D*)(\d+)(.*)$/);
      var tl = gsap.timeline({ scrollTrigger: { trigger: fact, start: 'top 90%', toggleActions: 'play none none none' } });
      tl.from(fact, { y: 24, opacity: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.08 });
      if (m && +m[2] > 0) {
        var o = { v: 0 };
        tl.to(o, { v: +m[2], duration: 1.1, ease: 'power3.out', onUpdate: function () { strong.textContent = m[1] + Math.round(o.v) + m[3]; } }, '<');
      }
    });

    // Product rows slide in a few at a time
    var rows = gsap.utils.toArray('.index li');
    rows.forEach(unreveal);
    gsap.set(rows, { opacity: 0, y: 28 });
    // One trigger per row (ScrollTrigger.batch throws inside ScrollTrigger 3.12.5's refresh on this page because of the pinned
    // dashboard). Rows that come into view together still follow each other by a few hundredths of a second.
    rows.forEach(function (row, i) {
      gsap.to(row, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: (i % 3) * 0.07,
        scrollTrigger: { trigger: row, start: 'top 92%', toggleActions: 'play none none none' } });
    });

    // Network section: the angled edge flattens as it scrolls in, the cards follow
    var dark = document.querySelector('.section-dark');
    if (dark) {
      var endClip = getComputedStyle(dark).clipPath;
      gsap.fromTo(dark, { clipPath: 'polygon(0% 20%, 100% 0%, 100% 100%, 0% 100%)' },
        { clipPath: endClip, ease: 'none', scrollTrigger: { trigger: dark, start: 'top bottom', end: 'top 30%', scrub: true } });
      var cards = gsap.utils.toArray('.net-card');
      cards.forEach(unreveal);
      gsap.from(cards, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.net', start: 'top 80%', toggleActions: 'play none none none' } });
    }

    // Moving-over steps: each block wipes in from the left
    var steps = gsap.utils.toArray('.steps li');
    steps.forEach(unreveal);
    gsap.from(steps, { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'expo.inOut', stagger: 0.12, scrollTrigger: { trigger: '.steps', start: 'top 85%', toggleActions: 'play none none none' } });

    // Spotlight cards: copy and picture slide in; on tall desktop screens each card sinks back and darkens as the next one covers it
    var spots = gsap.utils.toArray('.spot');
    spots.forEach(function (spot) {
      var tl = gsap.timeline({ scrollTrigger: { trigger: spot, start: 'top 80%', toggleActions: 'play none none none' } });
      tl.from(spot.querySelector('.spot-copy'), { y: 24, opacity: 0, duration: 0.6, ease: 'power2.out' });
      var art = spot.querySelector('.spot-art');
      if (art) tl.from(art, { x: 48, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.1);
    });
    gsap.matchMedia().add('(max-width: 1100px), (max-height: 759px)', function () {
      spots.forEach(function (spot, i) {
        var next = spots[i + 1];
        if (!next) return;
        gsap.to(spot, { scale: 0.94, '--dim': 0.3, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: function () { return 'top ' + (parseFloat(next.style.getPropertyValue('--stick')) || 80) + 'px'; }, scrub: true, invalidateOnRefresh: true } });
      });
    });
    gsap.matchMedia().add('(min-width: 1101px) and (min-height: 760px)', function () {
      spots.forEach(function (spot, i) {
        var next = spots[i + 1];
        if (!next) return;
        gsap.to(spot, { scale: 0.94, '--dim': 0.3, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top ' + (88 + (i + 1) * 22) + 'px', scrub: true } });
      });
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if (still || !('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
