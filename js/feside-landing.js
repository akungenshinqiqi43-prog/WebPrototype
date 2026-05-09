function initTopicTabs() {
  return;
}

function initFaqCarousel() {
  const faqTrack = document.querySelector("[data-faq-track]");
  const prevFaq = document.querySelector("[data-faq-prev]");
  const nextFaq = document.querySelector("[data-faq-next]");

  if (!faqTrack || !prevFaq || !nextFaq) {
    return;
  }

  let faqIndex = 0;

  const getFaqStep = () => {
    const card = faqTrack.querySelector(".faq-card");
    const gap = parseFloat(getComputedStyle(faqTrack).gap) || 0;
    return card ? card.getBoundingClientRect().width + gap : 0;
  };

  const getMaxFaqIndex = () => {
    const total = faqTrack.querySelectorAll(".faq-card").length;
    return window.innerWidth <= 1020 ? total - 1 : Math.max(0, total - 2);
  };

  const updateFaq = () => {
    faqIndex = Math.max(0, Math.min(faqIndex, getMaxFaqIndex()));
    faqTrack.style.transform = `translateX(${-faqIndex * getFaqStep()}px)`;
  };

  prevFaq.addEventListener("click", () => {
    faqIndex -= 1;
    updateFaq();
  });

  nextFaq.addEventListener("click", () => {
    faqIndex += 1;
    updateFaq();
  });

  window.addEventListener("resize", updateFaq);
  updateFaq();
}

function initNewsletterPlaceholder() {
  const newsletter = document.querySelector(".newsletter");

  if (!newsletter) {
    return;
  }

  newsletter.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Terima kasih. Form ini masih placeholder dan bisa disambungkan nanti.");
  });
}

function initImageFallbacks() {
  document.querySelectorAll(".js-fallback-image").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("is-hidden");

      const fallback = image.nextElementSibling;
      if (fallback) {
        fallback.classList.add("is-visible");
      }
    });
  });

  document.querySelectorAll(".js-hide-on-error").forEach((image) => {
    image.addEventListener("error", () => {
      const fallbackSrc = image.dataset.fallbackSrc;

      if (fallbackSrc && image.src.indexOf(fallbackSrc) === -1) {
        image.src = fallbackSrc;
        return;
      }

      image.style.display = "none";
    });
  });
}

function initMobileNavigation() {
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelector(".nav-links");
  const menuButton = document.querySelector(".menu-btn");

  if (!nav || !navLinks || !menuButton) {
    return;
  }

  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Buka menu");
    menuButton.textContent = "Menu";
  };

  const openMenu = () => {
    nav.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Tutup menu");
    menuButton.textContent = "Tutup";
  };

  menuButton.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function initBenefitSwap() {
  const stacks = document.querySelectorAll(".benefit-swap-stack");

  if (!stacks.length) {
    return;
  }

  const closeAll = () => {
    stacks.forEach((stack) => {
      stack.classList.remove("is-active");
      stack.setAttribute("aria-pressed", "false");
    });
  };

  stacks.forEach((stack) => {
    stack.addEventListener("click", (event) => {
      event.stopPropagation();
      const nextState = !stack.classList.contains("is-active");
      closeAll();

      if (nextState) {
        stack.classList.add("is-active");
        stack.setAttribute("aria-pressed", "true");
        return;
      }

      stack.blur();
    });

    stack.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        stack.click();
      }

      if (event.key === "Escape") {
        closeAll();
      }
    });
  });

  document.addEventListener("click", closeAll);
}

function initAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !window.gsap) {
    return;
  }

  if (window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  const heroTl = window.gsap.timeline({ defaults: { ease: "power3.out", duration: 0.75 } });
  heroTl
    .from(".topbar", { y: -70, opacity: 0 })
    .from(".hero h1", { y: 42, opacity: 0 }, "-=0.35")
    .from(".hero-sub", { y: 28, opacity: 0 }, "-=0.42")
    .from(".hero-actions .btn", { y: 18, opacity: 0, stagger: 0.09 }, "-=0.38")
    .from(".hero-asset", { x: 44, y: 24, rotate: 0, opacity: 0, scale: 0.94, stagger: 0.1 }, "-=0.62");

  window.gsap.to(".hero-asset-pack", {
    y: -14,
    rotate: 0.5,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  window.gsap.to(".hero-asset-guava", {
    y: 12,
    rotate: 2,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  window.gsap.to(".hero-asset-oat", {
    y: -10,
    rotate: -3,
    duration: 4.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  if (!window.ScrollTrigger) {
    return;
  }

  window.gsap.utils.toArray(".benefit-swap-stack, .ingredient-card, .faq-card").forEach((element) => {
    window.gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
        toggleActions: "play none none reverse"
      },
      y: 35,
      opacity: 0,
      duration: 0.68,
      ease: "power3.out"
    });
  });

  window.gsap.from(".iron-content h2", {
    scrollTrigger: {
      trigger: ".iron-story",
      start: "top 70%",
      toggleActions: "play none none reverse"
    },
    y: 48,
    opacity: 0,
    duration: 0.85,
    ease: "power3.out"
  });

  window.gsap.from(".product-card", {
    scrollTrigger: {
      trigger: ".product-card",
      start: "top 82%",
      toggleActions: "play none none reverse"
    },
    y: 45,
    scale: 0.97,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });

  const feedbackSection = document.querySelector(".feedback-section");

  if (feedbackSection) {
    const feedbackTl = window.gsap.timeline({
      scrollTrigger: {
        trigger: feedbackSection,
        start: "top 72%",
        toggleActions: "play none none reverse"
      },
      defaults: {
        duration: 0.78,
        ease: "power3.out"
      }
    });

    feedbackTl
      .from(".feedback-copy h2", { y: 46, opacity: 0 })
      .from(".feedback-copy p", { y: 24, opacity: 0 }, "-=0.48")
      .from(".feedback-copy .btn", { y: 18, opacity: 0, scale: 0.96 }, "-=0.42")
      .from(".feedback-visual", { x: 58, opacity: 0, scale: 0.975 }, "-=0.7");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTopicTabs();
  initFaqCarousel();
  initNewsletterPlaceholder();
  initImageFallbacks();
  initMobileNavigation();
  initBenefitSwap();
  initAnimations();
});
