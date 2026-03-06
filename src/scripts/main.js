/* Lightweight interactions: mobile menu, smooth scroll, reveal on scroll, hero snapshot */

(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("hidden") === false;
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking links
    mobileMenu.querySelectorAll("a[href^='#']").forEach((a) => {
      a.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll with focus management
  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Focus after scroll (accessibility)
      setTimeout(() => {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }, 450);
    });
  });

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // Hero snapshot data (demo)
  const data = {
    jan: { income: 2450, expenses: 1820, saved: 630, bars: [18, 32, 46, 70, 56, 44] },
    feb: { income: 2680, expenses: 1995, saved: 685, bars: [22, 36, 52, 62, 60, 48] },
    mar: { income: 2310, expenses: 1715, saved: 595, bars: [16, 28, 40, 58, 52, 42] },
  };

  const tabs = Array.from(document.querySelectorAll(".month-tab"));
  const numEls = {
    income: document.querySelector("[data-num='income']"),
    expenses: document.querySelector("[data-num='expenses']"),
    saved: document.querySelector("[data-num='saved']"),
  };
  const bars = Array.from(document.querySelectorAll(".mini-bar"));

  function formatUSD(n) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  }

  function animateNumber(el, from, to, duration = 450) {
    if (!el) return;
    const start = performance.now();
    const diff = to - from;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + diff * eased);
      el.textContent = formatUSD(value);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function setBars(values) {
    if (!bars.length) return;
    const max = Math.max(...values, 1);
    bars.forEach((bar, i) => {
      const v = values[i] ?? 10;
      const h = Math.round((v / max) * 100); // %
      bar.style.height = `${Math.max(18, h)}px`;
      bar.classList.toggle("is-strong", i >= values.length - 2);
    });
  }

  function setMonth(monthKey) {
    const d = data[monthKey];
    if (!d) return;

    // aria state
    tabs.forEach((t) => {
      const active = t.dataset.month === monthKey;
      t.setAttribute("aria-selected", String(active));
    });

    // Animate numbers from current displayed value
    const currentIncome = parseInt((numEls.income?.textContent || "0").replace(/[^\d]/g, ""), 10) || 0;
    const currentExpenses = parseInt((numEls.expenses?.textContent || "0").replace(/[^\d]/g, ""), 10) || 0;
    const currentSaved = parseInt((numEls.saved?.textContent || "0").replace(/[^\d]/g, ""), 10) || 0;

    animateNumber(numEls.income, currentIncome, d.income);
    animateNumber(numEls.expenses, currentExpenses, d.expenses);
    animateNumber(numEls.saved, currentSaved, d.saved);

    setBars(d.bars);
  }

  // Init
  if (tabs.length) {
    tabs.forEach((t) => t.addEventListener("click", () => setMonth(t.dataset.month)));
    setMonth("jan");
  }

  // Contact form handling
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");

  if (contactForm && contactSuccess) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic validation (browser does most of it with 'required')
      const email = document.getElementById("email")?.value;
      const message = document.getElementById("message")?.value;
      const type = document.getElementById("type")?.value;

      if (!email || !message || !type) return;

      // Simulate submission
      const btn = contactForm.querySelector("button[type='submit']");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending...";
      }

      // Show success after a short delay
      setTimeout(() => {
        contactForm.style.display = "none";
        contactSuccess.classList.add("is-visible");
      }, 800);
    });
  }
})();

