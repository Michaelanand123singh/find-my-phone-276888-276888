document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = mobileMenu?.querySelectorAll('a'); // Get all links inside the menu
  let firstFocusableElement;
  let lastFocusableElement;

  if (mobileMenu) {
    firstFocusableElement = menuLinks ? menuLinks[0] : mobileMenuBtn;
    lastFocusableElement = menuLinks ? menuLinks[menuLinks.length - 1] : mobileMenuBtn;
  }

  const toggleMenu = () => {
    if (!mobileMenu || !mobileMenuBtn) return;
    const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !expanded);
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    if (!expanded) {
      firstFocusableElement?.focus(); // Focus the first element in the menu
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (mobileMenu?.classList.contains('active')) {
      if (e.key === 'Escape') {
        toggleMenu();
        mobileMenuBtn?.focus(); // Return focus to the menu button
      }

      // Trap Focus
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement?.focus();
          }
        }
      }
    }
  });


  // Smooth Scroll & Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopBtn = document.querySelector('.back-to-top');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === "#") {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust offset as needed
          behavior: 'smooth'
        });

        if (mobileMenu?.classList.contains('active')) {
          toggleMenu(); // Close mobile menu after click on anchor link
        }
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (document.documentElement.scrollTop > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Testimonial Slider
  const testimonialSlider = document.querySelector('.testimonial-slider');
  const slides = testimonialSlider?.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  let currentIndex = 0;
  let intervalId;

  const showSlide = (index) => {
    if (!slides || slides.length === 0) return;

    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
      if (i === index) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      }
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  };

  const startSlider = () => {
    intervalId = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
  };

  const stopSlider = () => {
    clearInterval(intervalId);
  };

  if (slides && slides.length > 0) {
    showSlide(currentIndex); // Initial slide
    startSlider();

    testimonialSlider?.addEventListener('mouseenter', stopSlider);
    testimonialSlider?.addEventListener('mouseleave', startSlider);

    prevBtn?.addEventListener('click', () => {
      stopSlider();
      prevSlide();
      startSlider();
    });

    nextBtn?.addEventListener('click', () => {
      stopSlider();
      nextSlide();
      startSlider();
    });
  }


  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle the current item
      button.setAttribute('aria-expanded', !isExpanded);

      if (isExpanded) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });


  // Email Capture Validation
  const emailForm = document.querySelector('#email-capture-form');

  emailForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.querySelector('#email');
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    console.log('Email submitted:', email);

    // Optional: Clear the input after submission
    emailInput.value = '';
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA click logging stub
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const utmParams = getUtmParams(); // Implement getUtmParams() to extract UTM parameters
      console.log('CTA Clicked', {
        buttonText: button.textContent.trim(),
        utm: utmParams
      });
    });
  });


  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    return {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent
    };
  }

});