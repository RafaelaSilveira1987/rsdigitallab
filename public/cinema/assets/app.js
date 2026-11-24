/* RS Digital Lab — Cinema V3. Sem bibliotecas adicionais, compatível com React/TanStack e arquivo local. */
(() => {
  "use strict";
  if (typeof window.__rsCinemaCleanup === "function") window.__rsCinemaCleanup();
  const root = document.querySelector(".cinema-page");
  if (!root) return;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = !motionQuery.matches;
  const cleanups = [];
  const on = (target, name, listener, options) => {
    target.addEventListener(name, listener, options);
    cleanups.push(() => target.removeEventListener(name, listener, options));
  };
  const header = root.querySelector(".cx-header");
  const progress = root.querySelector(".cx-progress span");
  const video = root.querySelector(".cx-hero__video");
  const menuButton = root.querySelector(".cx-menu-button");
  const menu = root.querySelector(".cx-menu-mobile");
  let scrollRaf = 0;

  // A classe só é aplicada depois que os observadores existem: conteúdo nunca fica oculto por erro de JS.
  const revealElements = [...root.querySelectorAll(".cx-reveal")];
  let revealObserver;
  if (canAnimate && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("cx-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    revealElements.forEach((el) => revealObserver.observe(el));
    root.classList.add("cx-motion");
    cleanups.push(() => revealObserver.disconnect());
  } else {
    revealElements.forEach((el) => el.classList.add("cx-visible"));
  }

  // Cena de abertura: três linhas com atrasos explícitos, não um título estático.
  const introRaf = requestAnimationFrame(() => root.classList.add("cx-ready"));
  cleanups.push(() => cancelAnimationFrame(introRaf));

  // Vídeo local real, sem depender de links externos ou bibliotecas.
  if (video) {
    video.muted = true;
    video.playsInline = true;
    if (canAnimate) {
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === "function")
        playAttempt.catch(() => {
          // Autoplay pode ser bloqueado; o poster e o movimento CSS continuam visíveis.
          root.classList.add("cx-video-poster");
        });
    } else video.pause();
  }

  // Contagem ligada à entrada do bloco na tela; termina nos valores finais corretos.
  const counters = [...root.querySelectorAll("[data-count]")];
  let counterObserver;
  let counterFrames = [];
  const startCounter = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = "true";
    const n = Number(el.dataset.count || "0");
    const suffix = el.dataset.suffix || "";
    const pad = Number(el.dataset.pad || "2");
    const fmt = (value) => String(value).padStart(pad, "0") + suffix;
    if (!canAnimate) {
      el.textContent = fmt(n);
      return;
    }
    let started = null;
    const step = (t) => {
      if (started === null) started = t;
      const ratio = Math.min((t - started) / 1850, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);
      el.textContent = fmt(Math.round(eased * n));
      if (ratio < 1) counterFrames.push(requestAnimationFrame(step));
      else el.textContent = fmt(n);
    };
    counterFrames.push(requestAnimationFrame(step));
  };
  if ("IntersectionObserver" in window) {
    counterObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }),
      { threshold: 0.2 },
    );
    counters.forEach((el) => counterObserver.observe(el));
    cleanups.push(() => counterObserver.disconnect());
  } else counters.forEach(startCounter);
  cleanups.push(() => counterFrames.forEach(cancelAnimationFrame));

  // Parallax progressivo: cada projeto aproxima e desloca sua foto conforme a rolagem.
  const scenes = [...root.querySelectorAll("[data-scene]")];
  const onScrollNow = () => {
    scrollRaf = 0;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
    if (progress) {
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.setProperty("--cx-progress", String(Math.min(1, window.scrollY / range)));
    }
    if (!canAnimate) return;
    const vh = window.innerHeight;
    scenes.forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const ratio = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      scene.style.setProperty("--scene-shift", `${((ratio - 0.5) * -82).toFixed(2)}px`);
      scene.style.setProperty("--scene-zoom", (1.16 - 0.07 * ratio).toFixed(3));
      scene.classList.toggle("is-focus", rect.top < vh * 0.68 && rect.bottom > vh * 0.38);
    });
  };
  const scheduleScroll = () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(onScrollNow);
  };
  on(window, "scroll", scheduleScroll, { passive: true });
  on(window, "resize", scheduleScroll, { passive: true });
  scheduleScroll();
  cleanups.push(() => cancelAnimationFrame(scrollRaf));

  // Holofote acompanha o cursor; a cor das cenas acompanha a rolagem.
  scenes.forEach((scene) => {
    const move = (e) => {
      if (!canAnimate) return;
      const r = scene.getBoundingClientRect();
      scene.style.setProperty(
        "--spot-x",
        `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`,
      );
      scene.style.setProperty(
        "--spot-y",
        `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`,
      );
    };
    on(scene, "pointermove", move, { passive: true });
  });

  // Menu acessível, com ESC e fechamento após selecionar uma seção.
  if (menuButton && menu) {
    const setMenu = (open) => {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menu.hidden = !open;
    };
    setMenu(false);
    on(menuButton, "click", () => setMenu(menu.hidden));
    menu.querySelectorAll("a").forEach((a) => on(a, "click", () => setMenu(false)));
    on(document, "keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    on(
      window,
      "resize",
      () => {
        if (window.innerWidth > 720) setMenu(false);
      },
      { passive: true },
    );
  }

  const cleanup = () => {
    cleanups.reverse().forEach((fn) => {
      try {
        fn();
      } catch {
        /* cleanup */
      }
    });
    root.classList.remove("cx-motion", "cx-ready");
    if (window.__rsCinemaCleanup === cleanup) delete window.__rsCinemaCleanup;
  };
  window.__rsCinemaCleanup = cleanup;
  on(document, "rs-cinema:destroy", cleanup, { once: true });
  // Útil para conferir funcionamento de animações durante homologação no navegador.
  window.__rsCinemaDiagnostics = () => ({
    videoPlaying: Boolean(video && !video.paused && video.currentTime > 0.2),
    videoTime: Number((video?.currentTime || 0).toFixed(2)),
    scenes: scenes.length,
    revealed: root.querySelectorAll(".cx-reveal.cx-visible").length,
    totalReveal: revealElements.length,
    counters: counters.map((el) => el.textContent),
    reducedMotion: !canAnimate,
  });
})();
