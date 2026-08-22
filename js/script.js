/* =========================================================
   AYUR RETREAT — shared behaviour
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- header on scroll ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      document.body.classList.remove("nav-open");
    }));
  }

  /* ---------- nav mega-dropdowns (What is Ayurveda? / Think To Do?) ---------- */
  const navDropdowns = document.querySelectorAll(".nav-dropdown");
  if (navDropdowns.length) {
    navDropdowns.forEach(dd => {
      const dToggle = dd.querySelector(".dropdown-toggle");
      dToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = dd.getAttribute("data-open") === "true";
        navDropdowns.forEach(other => {
          if (other !== dd) {
            other.setAttribute("data-open", "false");
            other.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
          }
        });
        dd.setAttribute("data-open", open ? "false" : "true");
        dToggle.setAttribute("aria-expanded", open ? "false" : "true");
      });
    });
    document.addEventListener("click", (e) => {
      navDropdowns.forEach(dd => {
        if (!dd.contains(e.target)) {
          dd.setAttribute("data-open", "false");
          dd.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
        }
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        navDropdowns.forEach(dd => {
          dd.setAttribute("data-open", "false");
          dd.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger, .leaf-divider");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -60px 0px" });
  revealEls.forEach(el => io.observe(el));

  /* ---------- language switcher ---------- */
  const langSwitch = document.querySelector(".lang-switch");
  if (langSwitch && typeof AYUR_I18N !== "undefined") {
    const btn = langSwitch.querySelector(".lang-toggle-btn");
    const menu = langSwitch.querySelector(".lang-menu");
    const currentLabel = langSwitch.querySelector(".lang-current");

    const applyLang = (lang) => {
      const dict = AYUR_I18N[lang] || AYUR_I18N.en;
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.innerHTML = dict[key];
      });
      currentLabel.textContent = lang.toUpperCase();
      menu.querySelectorAll("button").forEach(b => {
        b.setAttribute("aria-current", b.dataset.lang === lang ? "true" : "false");
      });
      document.documentElement.setAttribute("lang", lang);
      localStorage.setItem("ayur-lang", lang);
    };

    btn.addEventListener("click", () => {
      const open = langSwitch.getAttribute("data-open") === "true";
      langSwitch.setAttribute("data-open", open ? "false" : "true");
    });
    document.addEventListener("click", (e) => {
      if (!langSwitch.contains(e.target)) langSwitch.setAttribute("data-open", "false");
    });
    menu.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => {
        applyLang(b.dataset.lang);
        langSwitch.setAttribute("data-open", "false");
      });
    });

    applyLang(localStorage.getItem("ayur-lang") || "de");
  }

  /* ---------- gallery lightbox (gallery.html only) ---------- */
  const galleryItems = document.querySelectorAll("[data-lightbox]");
  const lightbox = document.querySelector(".lightbox");
  if (galleryItems.length && lightbox) {
    const lbImg = lightbox.querySelector("img");
    const lbCaption = lightbox.querySelector(".lightbox-caption");
    galleryItems.forEach(item => {
      item.addEventListener("click", () => {
        lbImg.src = item.querySelector("img").src;
        lbCaption.textContent = item.dataset.caption || "";
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { lightbox.classList.remove("open"); document.body.style.overflow = ""; }
    });
  }

  /* ---------- gallery filter (gallery.html only) ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryTiles = document.querySelectorAll(".gallery-tile");
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.filter;
        galleryTiles.forEach(tile => {
          const show = cat === "all" || tile.dataset.cat === cat;
          tile.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- contact form (contact.html only) — demo only, no backend wired yet ---------- */
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = document.querySelector("#form-note");
      note.textContent = "Thank you — this is a UI preview, so no message was actually sent yet.";
      note.classList.add("show");
      contactForm.reset();
    });
  }
});
/* ---------- drifting leaf particles ---------- */
(() => {
  const field = document.getElementById("leafField");
  if (!field) return;
  const leafSvg = (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6 6 3 13 5 20c7 2 15 0 18-7C16 10 12 2 12 2Z"
            fill="#B98B2A" fill-opacity="0.35" stroke="#5C7A63" stroke-opacity="0.5" stroke-width="0.8"/>
    </svg>`;
  const count = window.innerWidth < 760 ? 6 : 12;
  for (let i = 0; i < count; i++) {
    const size = 14 + Math.random() * 18;
    const el = document.createElement("div");
    el.innerHTML = leafSvg(size);
    const leaf = el.firstElementChild;
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.animationDuration = `${10 + Math.random() * 10}s`;
    leaf.style.animationDelay = `${Math.random() * -20}s`;
    field.appendChild(leaf);
  }
})();