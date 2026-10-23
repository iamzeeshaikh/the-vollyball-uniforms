// Checkout page: order lines from localStorage (+ ?add=&qty= from the order box), live
// totals, and a POST to /api/order/. The server re-prices every line.
(function () {
  var C = window.TVU_CHECKOUT, KEY = 'tvu-cart', LOADED = Date.now();
  var form = document.getElementById('tvu-co-form');
  if (!form || !C) return;
  var linesEl = form.querySelector('[data-lines]'), grandEl = form.querySelector('[data-grand]');
  var errEl = form.querySelector('[data-err]'), btn = form.querySelector('[data-place]');
  var money = function (n) { return '$' + n.toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var clamp = function (slug, n) { var p = C.catalog[slug]; return Math.min(C.max, Math.max(p.m, Math.floor(Number(n) || p.m))); };

  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (x) {}
  var q = new URLSearchParams(location.search), add = q.get('add');
  if (add && C.catalog[add]) {
    var n = clamp(add, q.get('qty'));
    var hit = cart.filter(function (l) { return l.slug === add; })[0];
    if (hit) hit.qty = n; else cart.push({ slug: add, qty: n });
    history.replaceState(null, '', '/checkout/');
  }
  cart = cart.filter(function (l) { return C.catalog[l.slug]; }).map(function (l) { return { slug: l.slug, qty: clamp(l.slug, l.qty) }; });
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (x) {} };
  save();

  function render() {
    if (!cart.length) {
      linesEl.innerHTML = '<p class="py-2">Your order is empty. <a class="text-electric-600 underline" href="/volleyball-jerseys/">Choose uniforms</a></p>';
      grandEl.textContent = money(0); btn.disabled = true; return;
    }
    var total = 0;
    linesEl.innerHTML = cart.map(function (l, i) {
      var p = C.catalog[l.slug], sum = l.qty * p.p; total += sum;
      return '<div class="py-3 flex gap-3 justify-between items-start"><div><a class="font-semibold text-navy-950 underline" href="/' + esc(l.slug) + '/">' + esc(p.t) + '</a>' +
        '<div class="mt-1 text-gray-500">' + money(p.p) + ' per ' + esc(p.u) + '</div>' +
        '<label class="mt-2 flex items-center gap-2 text-gray-600">Qty <input type="number" min="' + p.m + '" max="' + C.max + '" value="' + l.qty + '" data-i="' + i + '" class="w-20 rounded-md border border-gray-300 px-2 py-1.5"></label>' +
        '<button type="button" data-rm="' + i + '" class="mt-1 text-xs text-red-700 underline">Remove</button></div>' +
        '<div class="font-semibold whitespace-nowrap">' + money(sum) + '</div></div>';
    }).join('');
    grandEl.textContent = money(total); btn.disabled = false;
  }
  linesEl.addEventListener('change', function (e) { var i = e.target.getAttribute('data-i'); if (i !== null) { cart[+i].qty = clamp(cart[+i].slug, e.target.value); save(); render(); } });
  linesEl.addEventListener('click', function (e) { var i = e.target.getAttribute('data-rm'); if (i !== null) { cart.splice(+i, 1); save(); render(); } });
  form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) { e.target.removeAttribute('aria-invalid'); e.target.style.borderColor = ''; } });
  render();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errEl.textContent = '';
    var bad = [].filter.call(form.querySelectorAll('[required]'), function (el) {
      var ok = el.value.trim() && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      if (!ok) { el.setAttribute('aria-invalid', 'true'); el.style.borderColor = '#b91c1c'; }
      return !ok;
    });
    if (bad.length) { errEl.textContent = 'Please fill in the highlighted fields.'; bad[0].focus(); return; }
    var file = form.artwork.files[0];
    if (file && file.size > 4 * 1024 * 1024) { errEl.textContent = 'The file is over 4 MB. Email it to us after ordering instead.'; return; }
    var data = new FormData(form);
    data.append('items', JSON.stringify(cart));
    data.append('ts', String(LOADED));
    btn.disabled = true; btn.textContent = 'Placing order…';
    var value = cart.reduce(function (s, l) { return s + l.qty * C.catalog[l.slug].p; }, 0);
    if (window.gtag) window.gtag('event', 'begin_checkout', { currency: 'USD', value: value });
    fetch('/api/order/', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Server error' }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || 'Could not place the order');
        if (window.gtag) window.gtag('event', 'purchase', { transaction_id: res.ref, currency: 'USD', value: res.total });
        try { localStorage.removeItem(KEY); } catch (x) {}
        location.href = '/order-confirmed/?ref=' + encodeURIComponent(res.ref);
      })
      .catch(function (err) {
        errEl.textContent = err.message + '. Please try again, or call +1 213-449-3746.';
        btn.disabled = false; btn.textContent = 'Place order';
      });
  });
})();
