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

    // Responsive 3D Radius calculation (optimized for 168px middle ground cards)
    const getRadius = () => {
      if (window.innerWidth <= 600) return 250;
      if (window.innerWidth <= 900) return 325;
      if (window.innerWidth <= 1200) return 380;
      return 435; // Desktop radius ~435px
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

  // ============================================================
  // SECTION 8: WELLCOPY STYLE EMAIL PORTFOLIO DRAGGABLE SHOWCASE
  // ============================================================
  const emailSection = document.getElementById('emailersSection');
  const emailLightbox = document.getElementById('emailLightbox');
  const emailLightboxImg = document.getElementById('emailLightboxImg');
  const emailLightboxClose = document.querySelector('.email-lightbox-close');
  const emailLightboxBackdrop = document.querySelector('.email-lightbox-backdrop');

  if (emailSection) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    emailSection.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
      isDown = true;
      hasMoved = false;
      emailSection.classList.add('dragging');
      startX = e.pageX - emailSection.offsetLeft;
      scrollLeft = emailSection.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - emailSection.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 4) {
        hasMoved = true;
        e.preventDefault();
      }
      emailSection.scrollLeft = scrollLeft - walk;
    });

    const endDrag = () => {
      if (isDown) {
        isDown = false;
        emailSection.classList.remove('dragging');
      }
    };

    window.addEventListener('mouseup', endDrag);
    emailSection.addEventListener('dragstart', (e) => e.preventDefault());

    // Touch support for mobile / tablets
    emailSection.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - emailSection.offsetLeft;
      scrollLeft = emailSection.scrollLeft;
      hasMoved = false;
    }, { passive: true });

    emailSection.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - emailSection.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 4) hasMoved = true;
      emailSection.scrollLeft = scrollLeft - walk;
    }, { passive: true });

    // Click on email card to open full-resolution lightbox (only if not dragged)
    const cards = emailSection.querySelectorAll('.phone-inside');
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (hasMoved) return; // Ignore if user was dragging
        const img = card.querySelector('.email--ui');
        if (img && emailLightbox && emailLightboxImg) {
          emailLightboxImg.src = img.src;
          emailLightboxImg.alt = img.alt || 'Full Email Preview';
          emailLightbox.classList.add('active');
          emailLightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close lightbox helpers
    const closeLightbox = () => {
      if (!emailLightbox) return;
      emailLightbox.classList.remove('active');
      emailLightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (emailLightboxClose) emailLightboxClose.addEventListener('click', closeLightbox);
    if (emailLightboxBackdrop) emailLightboxBackdrop.addEventListener('click', closeLightbox);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && emailLightbox && emailLightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ============================================================
  // Abatable-Style Pinning Transition & Radial Arc Cards Interaction
  // ============================================================
  const initAbatableTiltCards = () => {
    const wrap = document.querySelector('.tilt-cards_wrap');
    if (!wrap || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const pinHeight = wrap.querySelector('.tilt-cards_pin-height');
      const contain = wrap.querySelector('.tilt-cards_contain');
      const content = wrap.querySelector('.tilt-cards_content-contain');
      const circlesWrap = wrap.querySelector('.tilt-cards_circles');
      const circles = wrap.querySelectorAll('.tilt-cards_circle');
      const cards = wrap.querySelectorAll('.tilt-cards_card');
      const cta = wrap.querySelector('.tilt-cards_pinned-cta');

      if (!pinHeight || !circles.length) return;

      const totalScroll = pinHeight.clientHeight - window.innerHeight;

      // 1. Viewport Pinning (Section stays pinned while cards orbit into view)
      ScrollTrigger.create({
        trigger: pinHeight,
        start: 'top top',
        end: 'bottom bottom',
        pin: contain,
        scrub: 1,
        anticipatePin: 1
      });

      // 2. Section Header Fade & Parallax Exit as cards arrive
      gsap.to(content, {
        opacity: 0,
        y: -60,
        scale: 0.94,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: pinHeight,
          start: 'top top',
          end: `+=${totalScroll * 0.28}`,
          scrub: 1
        }
      });

      // 3. Circles Container subtle vertical elevation
      gsap.fromTo(circlesWrap, {
        y: '8%'
      }, {
        y: '-5%',
        ease: 'none',
        scrollTrigger: {
          trigger: pinHeight,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });

      // Initialize cards and circles starting positions
      gsap.set(cards, {
        xPercent: -50,
        y: '65vh'
      });
      gsap.set(circles, {
        rotation: 0
      });

      // 4. Cards Radial Arc & Fanning Out (Abatable Wheel Formula with Holding Showcase)
      const spreadAngle = 11.2; // Radial degrees fan-out per card on 250vw wheel (~26vw horizontal step)
      const count = circles.length;
      const halfRange = ((count - 1) * spreadAngle) / 2;
      const fanScroll = totalScroll * 0.62; // Complete fan-out by 62% of pin track so cards hold in view
      const distPerCard = fanScroll / count;

      circles.forEach((circle, index) => {
        const targetRot = -halfRange + (index * spreadAngle);
        const card = circle.querySelector('.tilt-cards_card');

        // Circle rotates into position along the radial orbit
        gsap.to(circle, {
          rotation: targetRot,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: pinHeight,
            start: `top top-=${distPerCard * index * 0.75}`,
            end: `+=${distPerCard * 1.25}`,
            scrub: 1
          }
        });

        // Card rises into position and aligns with radial arc
        gsap.to(card, {
          y: '-50%',
          rotation: targetRot,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: pinHeight,
            start: `top top-=${distPerCard * index * 0.75}`,
            end: `+=${distPerCard * 1.25}`,
            scrub: 1
          }
        });
      });

      // 5. Bottom Pinned CTA fades in as the cards finish fanning
      if (cta) {
        gsap.to(cta, {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: pinHeight,
            start: `top top-=${totalScroll * 0.55}`,
            end: `+=${totalScroll * 0.25}`,
            scrub: 1
          }
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === pinHeight) st.kill();
        });
        circles.forEach(c => {
          gsap.set(c, { clearProps: 'all' });
          const card = c.querySelector('.tilt-cards_card');
          if (card) {
            gsap.set(card, { clearProps: 'all' });
          }
        });
      };
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });
  };

  initAbatableTiltCards();

});


