/* ============================================================
   DTF·LAB — Frontend etkileşim
   - Gang sheet fiyat hesaplayıcı (metretül / m² bazlı)
   - Tema geçişi, mobil menü, SSS akordeon, form demo, scroll reveal
   Not: Fiyatlar örnektir; gerçek entegrasyonda backend'den gelmelidir.
   ============================================================ */
(function () {
  "use strict";

  var PRICE_PER_M2 = 650; // ₺/m² örnek taban fiyat
  var state = { w: 60, l: 100, q: 1 };

  var fmt = function (n) { return "₺" + Math.round(n).toLocaleString("tr-TR"); };
  var fmt2 = function (n) {
    return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  function discountFor(area) {
    if (area >= 5) return { rate: 0.15, txt: "%15 toplu indirim" };
    if (area >= 2) return { rate: 0.10, txt: "%10 toplu indirim" };
    return { rate: 0, txt: "" };
  }

  function calc() {
    var areaOne = (state.w / 100) * (state.l / 100);      // m² tek sayfa
    var totalArea = areaOne * state.q;
    var disc = discountFor(totalArea);
    var unit = Math.max(areaOne * PRICE_PER_M2, PRICE_PER_M2 * 0.3); // min 0.3 m²
    var subtotal = unit * state.q;
    var total = subtotal * (1 - disc.rate);
    return { areaOne: areaOne, totalArea: totalArea, unit: unit, total: total, disc: disc };
  }

  function q(id) { return document.getElementById(id); }

  function render() {
    var r = calc();
    q("wVal").textContent = state.w + " cm";
    q("lVal").textContent = state.l + " cm";
    q("qVal").textContent = state.q + " sayfa";
    q("sDim").textContent = state.w + " × " + state.l + " cm";
    q("sArea").textContent = fmt2(r.totalArea) + " m²";
    q("sUnit").textContent = fmt(r.unit);
    q("sQty").textContent = state.q;
    q("sTotal").textContent = fmt(r.total);
    q("heroPrice").textContent = fmt(r.total);

    var d = q("sDisc");
    if (r.disc.rate > 0) { d.style.display = "inline-flex"; q("sDiscTxt").textContent = r.disc.txt; }
    else { d.style.display = "none"; }

    var ruler = document.querySelector("#heroSheet .ruler");
    if (ruler) ruler.textContent = state.w + " × " + state.l + " cm";
    fillSheet(Math.min(24, Math.max(6, Math.round(r.totalArea * 20))));
  }

  // ---- hero gang sheet tiles ----
  var TILE_CLASSES = ["t-m", "t-c", "t-y", "t-k"];
  var TILE_LABELS = ["LOGO", "A+", "★", "24", "TR", "GO", "B", "07", "M", "x2"];
  function fillSheet(n) {
    var sheet = q("heroSheet");
    if (!sheet) return;
    Array.prototype.slice.call(sheet.querySelectorAll(".tile")).forEach(function (t) { t.remove(); });
    var spanPatterns = [[1, 1], [2, 1], [1, 2], [2, 2], [3, 1]];
    for (var i = 0; i < n; i++) {
      var el = document.createElement("div");
      el.className = "tile " + TILE_CLASSES[i % TILE_CLASSES.length];
      var sp = spanPatterns[i % spanPatterns.length];
      el.style.gridColumn = "span " + sp[0];
      el.style.gridRow = "span " + sp[1];
      el.style.animationDelay = (i * 0.03) + "s";
      el.textContent = TILE_LABELS[i % TILE_LABELS.length];
      sheet.appendChild(el);
    }
  }

  // ---- width options ----
  Array.prototype.forEach.call(document.querySelectorAll("#widthOpts .opt"), function (o) {
    o.addEventListener("click", function () {
      document.querySelectorAll("#widthOpts .opt").forEach(function (x) { x.classList.remove("active"); });
      o.classList.add("active");
      state.w = parseInt(o.dataset.w, 10);
      render();
    });
  });

  // ---- length presets + range sync ----
  var lenRange = q("lenRange");
  function setLenActive() {
    document.querySelectorAll("#lenPresets .opt").forEach(function (x) {
      x.classList.toggle("active", parseInt(x.dataset.l, 10) === state.l);
    });
  }
  lenRange.addEventListener("input", function () {
    state.l = parseInt(lenRange.value, 10);
    setLenActive();
    render();
  });
  Array.prototype.forEach.call(document.querySelectorAll("#lenPresets .opt"), function (o) {
    o.addEventListener("click", function () {
      state.l = parseInt(o.dataset.l, 10);
      lenRange.value = state.l;
      setLenActive();
      render();
    });
  });

  // ---- quantity stepper ----
  var qi = q("qInput");
  function setQty(v) { state.q = Math.max(1, Math.min(999, v || 1)); qi.value = state.q; render(); }
  q("qMinus").addEventListener("click", function () { setQty(state.q - 1); });
  q("qPlus").addEventListener("click", function () { setQty(state.q + 1); });
  qi.addEventListener("input", function () { var v = parseInt(qi.value.replace(/\D/g, ""), 10); if (!isNaN(v)) setQty(v); });
  qi.addEventListener("blur", function () { setQty(parseInt(qi.value, 10) || 1); });

  // ---- theme toggle ----
  q("themeBtn").addEventListener("click", function () {
    var root = document.documentElement;
    var cur = root.getAttribute("data-theme");
    var isDark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", isDark ? "light" : "dark");
  });

  // ---- mobile menu ----
  q("menuBtn").addEventListener("click", function () {
    var links = document.querySelector(".nav-links");
    var open = links.style.display === "flex";
    links.style.display = open ? "" : "flex";
    if (!open) {
      links.style.position = "absolute"; links.style.top = "68px"; links.style.left = "0"; links.style.right = "0";
      links.style.flexDirection = "column"; links.style.background = "var(--surface)";
      links.style.padding = "16px 24px"; links.style.borderBottom = "1px solid var(--line)"; links.style.gap = "14px";
    }
  });

  // ---- FAQ accordion ----
  Array.prototype.forEach.call(document.querySelectorAll(".qa button"), function (btn) {
    btn.addEventListener("click", function () {
      var qa = btn.parentElement;
      var ans = qa.querySelector(".ans");
      var isOpen = qa.classList.contains("open");
      document.querySelectorAll(".qa").forEach(function (x) {
        x.classList.remove("open"); x.querySelector(".ans").style.maxHeight = null;
      });
      if (!isOpen) { qa.classList.add("open"); ans.style.maxHeight = ans.scrollHeight + "px"; }
    });
  });

  // ---- uploader label ----
  var fileInput = q("ffile");
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length) {
      q("uploadLabel").textContent = "✓ " + fileInput.files[0].name;
      q("uploadLabel").style.color = "var(--ink)";
    }
  });

  // ---- form submit (front-end demo) ----
  q("quoteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = q("formMsg");
    var name = q("fname").value.trim(), phone = q("fphone").value.trim();
    if (!name || !phone) {
      msg.className = "form-msg show"; msg.style.background = "var(--ink-soft)"; msg.style.color = "var(--ink)";
      msg.textContent = "Lütfen ad/firma ve telefon alanlarını doldur.";
      return;
    }
    msg.className = "form-msg show";
    msg.style.background = "color-mix(in srgb, var(--ok) 14%, transparent)"; msg.style.color = "var(--ok)";
    msg.textContent = "Teşekkürler " + name + "! Talebin alındı (demo). Ekibimiz kısa sürede dönecek.";
    q("quoteForm").reset();
    q("uploadLabel").textContent = "⬆ Dosyanı buraya sürükle ya da seç (PNG / PDF / SVG)";
  });

  // ---- scroll reveal ----
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // init
  setLenActive();
  render();
})();
