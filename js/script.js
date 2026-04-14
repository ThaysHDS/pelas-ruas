document.addEventListener('DOMContentLoaded', function () {
  const MOBILE_BREAKPOINT = 768;
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const header = document.querySelector('header.navbar');
  const btnMobile = document.getElementById('toggle-dark');
  const btnDesktop = document.getElementById('toggle-dark-desktop');
  const btnHamburguer = document.getElementById('menu-toggle');
  const logoImg = document.getElementById('logo-img');
  let sortableInstance = null;

  function updateLogo() {
    if (!logoImg) return;
    logoImg.src = document.body.classList.contains('dark-mode')
      ? 'img/logo_f5f5f5.svg'
      : 'img/logo.svg';
  }

  initDarkMode();

  function initializeSortable() {
    const gallery = document.getElementById('interactive-gallery');
    if (gallery && !isMobile && !sortableInstance) {
      sortableInstance = new Sortable(gallery, {
        animation: 200,
        draggable: '.col-6, .col-12',
        ghostClass: 'sortable-ghost',
      });
    }
  }

  initializeSortable();

  window.addEventListener('resize', function () {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      document.querySelectorAll('.col-6, .col-12').forEach((item) => {
        item.classList.remove('sortable-ghost');
      });
    } else {
      initializeSortable();
    }
  });

  const scrollBtn = document.querySelector('.scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (scrollBtn)
      scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  AOS.init();

  if (window.innerWidth >= MOBILE_BREAKPOINT) {
    VanillaTilt.init(document.querySelectorAll('.tilt-cell'), {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
    });
  }

  if (isMobile && window.DeviceOrientationEvent) {
    const handleOrientation = (event) => {
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;

      document.querySelectorAll('.tilt-cell').forEach((el) => {
        const tiltX = gamma / 2;
        const tiltY = beta / 4;
        el.style.transform = `rotateY(${tiltX}deg) rotateX(${-tiltY}deg)`;
      });
    };

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            console.warn('Permissão negada para giroscópio.');
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  Fancybox.bind('[data-fancybox]', {
    dragToClose: true,
    groupAll: true,
    animated: true,
    showClass: 'fancybox-zoomIn',
    hideClass: 'fancybox-zoomOut',
  });

  if (isMobile) {
    const slides = document.querySelectorAll('.fade-slide');
    let current = 0;

    function show(i) {
      slides.forEach((s, idx) => {
        s.style.opacity = idx === i ? '1' : '0';
        s.style.zIndex = idx === i ? '1' : '0';
      });
    }

    if (slides.length > 0) {
      show(current);
      setInterval(() => {
        current = (current + 1) % slides.length;
        show(current);
      }, 4000);
    }
  }

  const btnVerMais = document.getElementById('verMaisBtn');
  if (btnVerMais) {
    btnVerMais.addEventListener('click', () => {
      const hiddenItems = document.querySelectorAll(
        '#interactive-gallery .gallery-item.d-none',
      );

      hiddenItems.forEach((item, index) => {
        item.classList.remove('d-none');
        if (isMobile) {
          setTimeout(() => {
            item.classList.add('show');
          }, 100 * index);
        }
      });

      btnVerMais.style.display = 'none';
    });
  }

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]',
  );

  tooltipTriggerList.forEach((el) => {
    const tooltip = new bootstrap.Tooltip(el, {
      placement: 'right',
      fallbackPlacements: ['top', 'left'],
      boundary: 'viewport',
      trigger: 'manual',
    });

    el.addEventListener('mouseenter', () => {
      tooltip.show();
      setTimeout(() => {
        tooltip.hide();
      }, 2000);
    });

    el.addEventListener('mouseleave', () => {
      tooltip.hide();
    });
  });

  document.querySelectorAll('.photo-reveal').forEach((container) => {
    const img = container.querySelector('.reveal-image');

    container.addEventListener('mouseenter', () => {
      if (!img.classList.contains('show')) {
        img.classList.add('show');
      }
    });
  });

  function initDarkMode() {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentMode = localStorage.getItem('theme');

    const isDark = currentMode === 'dark' || (!currentMode && prefersDark);
    document.body.classList.toggle('dark-mode', isDark);
    header.classList.toggle('navbar-dark', isDark);
    header.classList.toggle('navbar-light', !isDark);

    [btnMobile, btnDesktop].forEach((btn) => {
      if (!btn) return;

      btn.addEventListener('click', () => {
        toggleDarkMode();

        const newMode = document.body.classList.contains('dark-mode')
          ? 'dark'
          : 'light';

        localStorage.setItem('theme', newMode);
      });
    });

    updateLogo();
  }

  function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode', isDark);
    header.classList.toggle('navbar-dark', isDark);
    header.classList.toggle('navbar-light', !isDark);

    [btnMobile, btnDesktop, btnHamburguer].forEach((btn) => {
      if (!btn) return;
      btn.classList.toggle('btn-outline-light', isDark);
      btn.classList.toggle('btn-outline-dark', !isDark);
    });

    updateLogo();
  }
});
