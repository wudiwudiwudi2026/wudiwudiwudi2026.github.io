document.addEventListener('DOMContentLoaded', () => {
  const autoplayVideos = Array.from(document.querySelectorAll('video[data-autoplay]'));
  const startVideo = (video) => {
    if (video.closest('[hidden]')) return;
    if (video.preload === 'none') {
      video.preload = 'metadata';
      video.load();
    }
    video.play().catch(() => {});
  };

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target: video }) => {
        if (isIntersecting) startVideo(video);
        else video.pause();
      });
    }, { rootMargin: '320px 0px', threshold: 0.01 });
    autoplayVideos.forEach((video) => videoObserver.observe(video));
  } else {
    autoplayVideos.forEach(startVideo);
  }

  const navLinks = Array.from(document.querySelectorAll('.section-nav a[href^="#"]'));
  const navTargets = navLinks
    .map((link) => ({ link, target: document.querySelector(link.getAttribute('href')) }))
    .filter(({ target }) => target);

  const updateSectionNav = () => {
    const marker = window.scrollY + window.innerHeight * 0.28;
    let current = navTargets[0];
    navTargets.forEach((item) => {
      const targetTop = item.target.getBoundingClientRect().top + window.scrollY;
      if (targetTop <= marker) current = item;
    });
    navTargets.forEach(({ link }) => {
      const active = link === current?.link;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  let navFrame = 0;
  window.addEventListener('scroll', () => {
    if (navFrame) return;
    navFrame = requestAnimationFrame(() => {
      navFrame = 0;
      updateSectionNav();
    });
  }, { passive: true });
  updateSectionNav();
});
