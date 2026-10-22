/* ============================================================
   MAIL MINKS - Interactive Scripts
   Aeline 3D Arc Carousel, Accordions, Smooth Scroll & Navigation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Header Scroll Effect (Transparent over Blue Sky, Frosted White on Scroll) ----
  const header = document.getElementById('header');
  const updateHeaderState = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();


  // ---- Mobile Menu Toggle ----
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
      if (nav.classList.contains('active')) {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = '#ffffff';
        nav.style.padding = '24px';
        nav.style.borderRadius = '16px';
        nav.style.boxShadow = '0 12px 30px rgba(16, 12, 41, 0.12)';
        nav.style.border = '1px solid rgba(20, 104, 97, 0.1)';
      } else {
        nav.style.display = '';
      }
    });

    const links = nav.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        nav.style.display = '';
      });
    });
  }


  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || !href) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });


  // ============================================================
  // AUTHENTIC AELINE 3D MOVING GLOBE CYLINDER CAROUSEL ENGINE
  // ============================================================
  const cylinder = document.getElementById('carouselCylinder');
  const carouselWrap = document.querySelector('.hero-carousel-wrap');
  const cardItems = Array.from(document.querySelectorAll('.carousel-card-item'));

  if (cylinder && cardItems.length > 0) {
    const totalCards = cardItems.length; // 14
    let currentRotationY = -51.43;
    let isDragging = false;
    let startX = 0;
    let startRotation = 0;
    let autoRotateSpeed = 0.06; // Framer exact: 100s for full 360deg orbit (0.06deg/frame at 60fps)
    let isHovered = false;
    let isTransitioning = false;

    // Responsive 3D Radius calculation (optimized for wide 225px cards)
    const getRadius = () => {
      if (window.innerWidth <= 600) return 290;
      if (window.innerWidth <= 900) return 390;
      if (window.innerWidth <= 1200) return 460;
      return 535; // Desktop radius ~535px (diameter ~1070px)
    };

    // Position each card symmetrically along the cylinder circumference
    const layoutCards = () => {
      const angleStep = 360 / totalCards;
      const radius = getRadius();

      cardItems.forEach((card, i) => {
        const angle = i * angleStep;
        // rotate around Y axis by angle, push out along Z axis by radius
        card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      });

      if (!isTransitioning) {
        cylinder.style.transform = `translate(-50%, -50%) rotateX(-9deg) rotateY(${currentRotationY}deg)`;
      }
    };

    layoutCards();
    window.addEventListener('resize', layoutCards);

    // 60FPS Continuous Animation Loop
    function animate() {
      if (!isDragging && !isTransitioning) {
        const speed = isHovered ? autoRotateSpeed * 0.35 : autoRotateSpeed;
        currentRotationY = (currentRotationY + speed) % 360;
        cylinder.style.transform = `translate(-50%, -50%) rotateX(-9deg) rotateY(${currentRotationY}deg)`;
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Mouse & Touch Drag Controls
    if (carouselWrap) {
      carouselWrap.addEventListener('mouseenter', () => { isHovered = true; });
      carouselWrap.addEventListener('mouseleave', () => { isHovered = false; });

      // Mouse drag
      carouselWrap.addEventListener('mousedown', (e) => {
        if (isTransitioning) return;
        isDragging = true;
        startX = e.clientX;
        startRotation = currentRotationY;
        carouselWrap.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging || isTransitioning) return;
        const deltaX = e.clientX - startX;
        currentRotationY = (startRotation + deltaX * 0.22 + 360) % 360;
        cylinder.style.transform = `translate(-50%, -50%) rotateX(-9deg) rotateY(${currentRotationY}deg)`;
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          carouselWrap.style.cursor = 'grab';
        }
      });

      // Touch drag
      carouselWrap.addEventListener('touchstart', (e) => {
        if (isTransitioning) return;
        isDragging = true;
        startX = e.touches[0].clientX;
        startRotation = currentRotationY;
      }, { passive: true });

      carouselWrap.addEventListener('touchmove', (e) => {
        if (!isDragging || isTransitioning) return;
        const deltaX = e.touches[0].clientX - startX;
        currentRotationY = (startRotation + deltaX * 0.28 + 360) % 360;
        cylinder.style.transform = `translate(-50%, -50%) rotateX(-9deg) rotateY(${currentRotationY}deg)`;
      }, { passive: true });

      carouselWrap.addEventListener('touchend', () => {
        isDragging = false;
      });
    }

    // Clicking any card brings it directly front-and-center (angle 0deg)
    cardItems.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (isDragging) return;
        const angleStep = 360 / totalCards;
        const targetAngle = -(i * angleStep);
        
        // Find shortest angular path
        let targetNorm = (targetAngle % 360 + 360) % 360;
        let currentNorm = (currentRotationY % 360 + 360) % 360;
        let diff = targetNorm - currentNorm;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        currentRotationY = currentRotationY + diff;
        isTransitioning = true;
        cylinder.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        cylinder.style.transform = `translate(-50%, -50%) perspective(3000px) rotateX(-9deg) rotateY(${currentRotationY}deg)`;

        setTimeout(() => {
          cylinder.style.transition = '';
          isTransitioning = false;
        }, 700);
      });
    });
  }


  // ============================================================
  // FAQ Accordion Interaction
  // ============================================================
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const headerBtn = item.querySelector('.accordion-header');
    const arrow = item.querySelector('.accordion-arrow');

    if (headerBtn) {
      headerBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        accordionItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.accordion-header');
          const otherArrow = otherItem.querySelector('.accordion-arrow');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherArrow) otherArrow.textContent = '+';
        });

        if (!isActive) {
          item.classList.add('active');
          headerBtn.setAttribute('aria-expanded', 'true');
          if (arrow) arrow.textContent = '−';
        } else {
          item.classList.remove('active');
          headerBtn.setAttribute('aria-expanded', 'false');
          if (arrow) arrow.textContent = '+';
        }
      });
    }
  });


  // ============================================================
  // TESTIMONIALS SPLIT SHOWCASE SLIDER ENGINE
  // Slow autoplay + manual navigation via left/right arrows + swipe
  // ============================================================
  const stage = document.getElementById('testimonialCardStage');
  const slides = Array.from(document.querySelectorAll('.testimonial-card-slide'));
  const prevBtn = document.getElementById('testimonialPrevBtn');
  const nextBtn = document.getElementById('testimonialNextBtn');

  if (stage && slides.length > 0) {
    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayTimer = null;
    const AUTOPLAY_INTERVAL = 5500; // 5.5 seconds - comfortable, relaxed reading pace

    function goToSlide(targetIndex, direction = 'next') {
      if (isAnimating) return;
      if (targetIndex === currentIndex) return;

      isAnimating = true;

      // Wrap around
      let newIndex = (targetIndex + slides.length) % slides.length;
      const currentSlide = slides[currentIndex];
      const nextSlide = slides[newIndex];

      // Reset exiting/entering classes
      slides.forEach(s => {
        s.classList.remove('exit-left', 'exit-right', 'enter-left', 'enter-right');
      });

      if (direction === 'next') {
        currentSlide.classList.add('exit-left');
        nextSlide.classList.add('enter-right');
      } else {
        currentSlide.classList.add('exit-right');
        nextSlide.classList.add('enter-left');
      }

      // Force layout reflow so the enter class is applied before animating to active
      void nextSlide.offsetWidth;

      // Animate current out and next in
      currentSlide.classList.remove('active');
      nextSlide.classList.add('active');
      nextSlide.classList.remove('enter-left', 'enter-right');

      currentIndex = newIndex;

      setTimeout(() => {
        slides.forEach((s, idx) => {
          if (idx !== currentIndex) {
            s.classList.remove('active', 'exit-left', 'exit-right', 'enter-left', 'enter-right');
          }
        });
        isAnimating = false;
      }, 700);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1, 'next');
      }, AUTOPLAY_INTERVAL);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // Navigation button events
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1, 'prev');
        resetAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1, 'next');
        resetAutoPlay();
      });
    }

    // Hover pause on stage and controls
    stage.addEventListener('mouseenter', stopAutoPlay);
    stage.addEventListener('mouseleave', startAutoPlay);
    if (prevBtn) {
      prevBtn.addEventListener('mouseenter', stopAutoPlay);
      prevBtn.addEventListener('mouseleave', startAutoPlay);
    }
    if (nextBtn) {
      nextBtn.addEventListener('mouseenter', stopAutoPlay);
      nextBtn.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          goToSlide(currentIndex + 1, 'next');
        } else {
          goToSlide(currentIndex - 1, 'prev');
        }
      }
      startAutoPlay();
    }, { passive: true });

    // Keyboard navigation (Arrow keys when section is in view)
    document.addEventListener('keydown', (e) => {
      const testimonialsSection = document.getElementById('testimonials');
      if (!testimonialsSection) return;
      const rect = testimonialsSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1, 'next');
        resetAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1, 'prev');
        resetAutoPlay();
      }
    });

    // Pause autoplay when window/tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });

    // Start slow autoplay
    startAutoPlay();
  }

  // ============================================================
  // SECTION 7: AELINE EXPANDABLE BENTO CARDS ENGINE (3 Top, 3 Bottom)
  // ============================================================
  const aelineTrays = document.querySelectorAll('.aeline-services-tray');
  if (aelineTrays.length > 0) {
    aelineTrays.forEach(tray => {
      const cards = tray.querySelectorAll('.aeline-service-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          cards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
        card.addEventListener('click', () => {
          cards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
      });
    });
  }

});

