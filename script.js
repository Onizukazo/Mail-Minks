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

    // Responsive 3D Radius calculation (scaled up 10% more for enhanced visibility)
    const getRadius = () => {
      if (window.innerWidth <= 600) return 275;
      if (window.innerWidth <= 900) return 375;
      if (window.innerWidth <= 1200) return 440;
      return 512; // Desktop radius ~512px (diameter ~1024px)
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
  // TESTIMONIALS HORIZONTAL SCROLL CAROUSEL ENGINE
  // ============================================================
  const testimonialsViewport = document.getElementById('testimonialsScrollViewport');
  const testimonialsTrack = document.getElementById('testimonialsScrollTrack');
  const prevBtn = document.getElementById('testimonialPrevBtn');
  const nextBtn = document.getElementById('testimonialNextBtn');
  const segmentBars = document.querySelectorAll('.segment-bar');
  const scrollItems = document.querySelectorAll('.testimonial-scroll-item');

  if (testimonialsViewport && scrollItems.length > 0) {
    const getStepWidth = () => {
      const firstItem = scrollItems[0];
      const gap = 28;
      return firstItem ? firstItem.offsetWidth + gap : 500;
    };

    const updateActiveIndicator = () => {
      const scrollLeft = testimonialsViewport.scrollLeft;
      const step = getStepWidth();
      let activeIndex = Math.round(scrollLeft / step);
      if (activeIndex < 0) activeIndex = 0;
      if (activeIndex >= scrollItems.length) activeIndex = scrollItems.length - 1;

      segmentBars.forEach((bar, idx) => {
        bar.classList.toggle('active', idx === activeIndex);
      });

      const maxScroll = testimonialsViewport.scrollWidth - testimonialsViewport.clientWidth;
      if (prevBtn) {
        prevBtn.disabled = scrollLeft <= 8;
        prevBtn.classList.toggle('disabled', scrollLeft <= 8);
      }
      if (nextBtn) {
        nextBtn.disabled = scrollLeft >= maxScroll - 8;
        nextBtn.classList.toggle('disabled', scrollLeft >= maxScroll - 8);
      }
    };

    testimonialsViewport.addEventListener('scroll', () => {
      requestAnimationFrame(updateActiveIndicator);
    }, { passive: true });

    updateActiveIndicator();
    window.addEventListener('resize', updateActiveIndicator);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const step = getStepWidth();
        testimonialsViewport.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const step = getStepWidth();
        testimonialsViewport.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    segmentBars.forEach((bar, idx) => {
      bar.addEventListener('click', () => {
        const item = scrollItems[idx];
        if (item && testimonialsTrack) {
          const trackPadding = parseInt(window.getComputedStyle(testimonialsTrack).paddingLeft) || 0;
          const targetLeft = item.offsetLeft - trackPadding;
          testimonialsViewport.scrollTo({ left: targetLeft, behavior: 'smooth' });
        }
      });
    });

    // Mouse drag to scroll
    let isMouseDown = false;
    let startX = 0;
    let scrollStart = 0;

    testimonialsViewport.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      testimonialsViewport.classList.add('is-dragging');
      startX = e.pageX - testimonialsViewport.offsetLeft;
      scrollStart = testimonialsViewport.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const x = e.pageX - testimonialsViewport.offsetLeft;
      const walk = (x - startX) * 1.35;
      testimonialsViewport.scrollLeft = scrollStart - walk;
    });

    const stopDrag = () => {
      if (isMouseDown) {
        isMouseDown = false;
        testimonialsViewport.classList.remove('is-dragging');
      }
    };

    window.addEventListener('mouseup', stopDrag);
    testimonialsViewport.addEventListener('mouseleave', stopDrag);
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

