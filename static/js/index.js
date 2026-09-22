document.addEventListener('DOMContentLoaded', () => {
  const bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    const playHero = () => {
      bgVideo.play().catch(() => {});
    };
    playHero();
    bgVideo.addEventListener('loadeddata', playHero);
    bgVideo.addEventListener('canplay', playHero);
  }

  document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    const target = document.querySelector('.page-content');
    if (!target) return;
    const top = Math.ceil(target.getBoundingClientRect().top + window.scrollY + 15);
    window.scrollTo({ top, behavior: 'smooth' });
  });

  const initCarousel = (carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    if (!slides.length || !prevBtn || !nextBtn) return;

    let activeIndex = slides.findIndex((slide) => slide.classList.contains('active'));
    if (activeIndex < 0) activeIndex = 0;

    const caption = carousel.querySelector('.carousel-caption');
    const captionTask = caption?.querySelector('.carousel-task');
    const captionHand = caption?.querySelector('.carousel-hand');

    const pauseInactive = () => {
      slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        if (!video) return;
        if (index === activeIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    };

    const updateSlides = () => {
      const count = slides.length;

      slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');

        let diff = index - activeIndex;
        if (diff > count / 2) diff -= count;
        if (diff < -count / 2) diff += count;

        if (diff === 0) slide.classList.add('active');
        else if (diff === -1) slide.classList.add('prev');
        else if (diff === 1) slide.classList.add('next');
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });

      const activeSlide = slides[activeIndex];
      if (captionTask) captionTask.textContent = activeSlide.dataset.task || '';
      if (captionHand) captionHand.textContent = activeSlide.dataset.hand || '';
      pauseInactive();
    };

    const goTo = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      updateSlides();
    };

    prevBtn.addEventListener('click', () => goTo(activeIndex - 1));
    nextBtn.addEventListener('click', () => goTo(activeIndex + 1));

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goTo(index));
    });

    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        if (index !== activeIndex) goTo(index);
      });
    });

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (event.key === 'ArrowRight') goTo(activeIndex + 1);
    });

    let touchStartX = 0;
    carousel.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
      const diff = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 40) {
        goTo(activeIndex + (diff < 0 ? 1 : -1));
      }
    }, { passive: true });

    updateSlides();
  };

  document.querySelectorAll('.video-carousel').forEach(initCarousel);
});
