const MOBILE_BREAKPOINT = 980;

function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  const setFaqState = (item, isActive) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) {
      return;
    }

    item.classList.toggle("active", isActive);
    question.setAttribute("aria-expanded", String(isActive));
    answer.setAttribute("aria-hidden", String(!isActive));
    answer.style.maxHeight = isActive ? `${answer.scrollHeight}px` : "0px";
  };

  faqItems.forEach((item, index) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) {
      return;
    }

    const answerId = `faq-answer-${index + 1}`;
    question.setAttribute("aria-controls", answerId);
    answer.id = answerId;

    setFaqState(item, item.classList.contains("active"));

    question.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        setFaqState(otherItem, false);
      });

      if (shouldOpen) {
        setFaqState(item, true);
      }
    });
  });

  window.addEventListener("resize", () => {
    faqItems.forEach((item) => {
      if (item.classList.contains("active")) {
        setFaqState(item, true);
      }
    });
  });
}

function initNewsletterPlaceholder() {
  const newsletterForm = document.querySelector(".newsletter");
  const status = document.querySelector("[data-newsletter-status]");

  if (!newsletterForm) {
    return;
  }

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (status) {
      status.textContent = "Terima kasih. Form ini masih placeholder dan siap disambungkan ke sistem newsletter nanti.";
    }

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.value = "";
    }
  });
}

function initHeroImageFallback() {
  const heroImage = document.querySelector(".hero-product-main[data-src]");
  const heroFallback = document.querySelector(".hero-product-fallback");

  if (!heroImage || !heroFallback) {
    return;
  }

  const assetPath = heroImage.dataset.src ? heroImage.dataset.src.trim() : "";
  if (!assetPath) {
    return;
  }

  const preloadImage = new Image();

  preloadImage.addEventListener("load", () => {
    heroImage.src = assetPath;
    heroImage.classList.add("is-ready");
    heroFallback.classList.add("is-hidden");
  });

  preloadImage.addEventListener("error", () => {
    heroImage.removeAttribute("src");
    heroImage.classList.remove("is-ready");
    heroFallback.classList.remove("is-hidden");
  });

  preloadImage.src = assetPath;
}

function initMobileNavigation() {
  const navbar = document.querySelector(".navbar");
  const menuButton = document.querySelector(".mobile-menu-btn");
  const navLinks = document.getElementById("primary-navigation");
  const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  if (!navbar || !menuButton || !navLinks) {
    return;
  }

  const closeMenu = () => {
    navbar.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Buka menu navigasi");
    menuButton.textContent = "Menu";
    document.body.classList.remove("nav-open");
  };

  const openMenu = () => {
    navbar.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Tutup menu navigasi");
    menuButton.textContent = "Tutup";
    document.body.classList.add("nav-open");
  };

  const syncMenuMode = () => {
    if (mobileQuery.matches) {
      navbar.setAttribute("data-mobile-nav-ready", "true");
      closeMenu();
      return;
    }

    navbar.removeAttribute("data-mobile-nav-ready");
    closeMenu();
  };

  menuButton.addEventListener("click", () => {
    if (!mobileQuery.matches) {
      return;
    }

    const isOpen = navbar.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileQuery.matches) {
        closeMenu();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!mobileQuery.matches || !navbar.classList.contains("is-open")) {
      return;
    }

    if (!navbar.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", syncMenuMode);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(syncMenuMode);
  }

  syncMenuMode();
}

function initAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !window.gsap) {
    return;
  }

  if (window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  const heroTimeline = window.gsap.timeline({
    defaults: { duration: 0.8, ease: "power3.out" }
  });

  heroTimeline
    .from(".navbar", { y: -24, opacity: 0 })
    .from(".hero h1", { y: 34, opacity: 0 }, "-=0.45")
    .from(".hero-copy", { y: 22, opacity: 0 }, "-=0.42")
    .from(".cta-row .btn", { y: 18, opacity: 0, stagger: 0.08 }, "-=0.38")
    .from(".hero-badges .mini-badge", { y: 14, opacity: 0, stagger: 0.07 }, "-=0.34")
    .from(".hero-product-frame", { y: 30, scale: 0.96, opacity: 0 }, "-=0.64");

  window.gsap.to(".hero-product-main, .fallback-pack", {
    y: -10,
    duration: 3.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  if (!window.ScrollTrigger) {
    return;
  }

  window.gsap.utils.toArray(".benefit-card, .ingredient-card, .audience-card, .faq-item").forEach((element) => {
    window.gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
        toggleActions: "play none none reverse"
      },
      y: 30,
      opacity: 0,
      duration: 0.72,
      ease: "power3.out"
    });
  });

  window.gsap.from(".taste-visual", {
    scrollTrigger: {
      trigger: ".taste-visual",
      start: "top 82%",
      toggleActions: "play none none reverse"
    },
    x: -42,
    opacity: 0,
    duration: 0.86,
    ease: "power3.out"
  });

  window.gsap.from(".cta-panel", {
    scrollTrigger: {
      trigger: ".cta-panel",
      start: "top 84%",
      toggleActions: "play none none reverse"
    },
    scale: 0.96,
    opacity: 0,
    duration: 0.82,
    ease: "power3.out"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFaqAccordion();
  initNewsletterPlaceholder();
  initHeroImageFallback();
  initMobileNavigation();
  initAnimations();
});
