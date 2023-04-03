jQuery(function ($) {

  var html = $('html');
  var viewport = $(window);

  /* ==========================================================================
     Menu
     ========================================================================== */

  function menu() {
    html.toggleClass('menu-active');
  };

  $('#menu').on({
    'click': function () {
      menu();
    }
  });

  $('.nav-menu').on({
    'click': function () {
      menu();
    }
  });

  $('.nav-close').on({
    'click': function () {
      menu();
    }
  });

  viewport.on({
    'resize': function () {
      html.removeClass('menu-active');
    },
    'orientationchange': function () {
      html.removeClass('menu-active');
    }
  });

  /* ==========================================================================
     Parallax cover
     ========================================================================== */

  var cover = $('.cover');
  var coverPosition = 0;

  function prlx() {
    if (cover.length >= 1) {
      var windowPosition = viewport.scrollTop();
      (windowPosition > 0) ? coverPosition = Math.floor(windowPosition * 0.25) : coverPosition = 0;
      cover.css({
        '-webkit-transform': 'translate3d(0, ' + coverPosition + 'px, 0)',
        'transform': 'translate3d(0, ' + coverPosition + 'px, 0)'
      });
      (viewport.scrollTop() < cover.height()) ? html.addClass('cover-active') : html.removeClass('cover-active');
    }
  }
  prlx();

  viewport.on({
    'scroll': function () {
      prlx();
    },
    'resize': function () {
      prlx();
    },
    'orientationchange': function () {
      prlx();
    }
  });

  /* ==========================================================================
     Gallery
     ========================================================================== */

  function gallery() {
    'use strict';
    var images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
      var container = image.closest('.kg-gallery-image');
      var width = image.attributes.width.value;
      var height = image.attributes.height.value;
      var ratio = width / height;
      container.style.flex = ratio + ' 1 0%';
    });
  }
  gallery();


  /* ==========================================================================
     Theme
     ========================================================================== */

  function theme() {
    'use strict';
    var toggle = $('.js-theme');
    var toggleText = toggle.find('.theme-text');

    function system() {
      html.removeClass(['theme-dark', 'theme-light']);
      localStorage.removeItem('attila_theme');
      toggleText.text(toggle.attr('data-system'));
    }

    function dark() {
      html.removeClass('theme-light').addClass('theme-dark');
      localStorage.setItem('attila_theme', 'dark');
      toggleText.text(toggle.attr('data-dark'));
    }

    function light() {
      html.removeClass('theme-dark').addClass('theme-light');
      localStorage.setItem('attila_theme', 'light');
      toggleText.text(toggle.attr('data-light'));
    }

    switch (localStorage.getItem('attila_theme')) {
      case 'dark':
        dark();
        break;
      case 'light':
        light();
        break;
      default:
        system();
        break;
    }

    toggle.on('click', function (e) {
      e.preventDefault();

      if (!html.hasClass('theme-dark') && !html.hasClass('theme-light')) {
        dark();
      } else if (html.hasClass('theme-dark')) {
        light();
      } else {
        system();
      }
    });
  }
  theme();

  // Get all the pictures on the page
  const images = document.querySelectorAll('figure img');

  // Add event handlers to each image
  images.forEach(image => {
    // If the image is a link - prohibit its proximity
    if (image.parentElement.tagName === 'A') {
      image.style.cursor = 'inherit'
      return
    }
    image.addEventListener('click', () => {
      // A container that will stretch to the entire screen and have our picture in the middle
      const container = document.createElement('div');
      container.className = 'darkening-background';

      // Picture in the middle
      const img = image.cloneNode(true);
      img.style.animation = 'fade-in-img 0.5s forwards'

      // Text manual
      const p = document.createElement('p');
      p.style.overflow = 'visible'
      p.innerHTML = 'Клавиша ESC для выхода или клик по пустому месту.<br>Колёсико мыши для управления масштабом.'

      // Disable all scrolling on the site
      const style = document.createElement('style');
      style.innerHTML = '* { overflow: hidden; }';
      document.head.appendChild(style);
      
      // Connecting all the elements to the site
      container.append(p)
      container.append(img)
      document.body.prepend(container);

      // After playing the animations - erase them, because they interfere with the script
      setTimeout(() => {
        container.style.animation = ''
        img.style.animation = ''
      }, 500)

      let isMouseClick = false;
      let startX;
      let startY;
      let offsetX = 0;
      let offsetY = 0;
      let zoom = 1.2;

      /* Moving picture function */
      function mouseMoveHandler(event) {
        if (isMouseClick) {
          const x = event.clientX - startX;
          const y = event.clientY - startY;
          img.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
          offsetX = x;
          offsetY = y;
        }
      };

      /* When you click on the picture, it should enlarge slightly and go into motion mode. */
      function clickHandler(event) {
        startX = event.clientX - offsetX;
        startY = event.clientY - offsetY;
        
        // Reduce the picture if you click a second time
        if (isMouseClick) {
          zoom -= 0.20
          img.style.cursor = 'zoom-in';
        } else {
          zoom += 0.20
          img.style.cursor = 'zoom-out';
        }
        const x = event.clientX - startX;
        const y = event.clientY - startY;
        img.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
        isMouseClick = !isMouseClick;

        event.stopPropagation()
      };

      function mouseWheelHandler(event) {
        // Get the current value of the vertical scrolling window
        const scrollTop = event.deltaY || event.detail || event.wheelDelta;

        if (scrollTop < 0) {
          zoom += 0.20
        } else {
          // Avoid negative zoom.
          if ((zoom - 0.25) <= 0) return
          zoom -= 0.20
        }

        img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
      }

      function escKeypressHandler (event) {
        if (event.keyCode === 27 || event.key === "Escape") {
          clearEvents(event)
        }
      }

      img.addEventListener('click', clickHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('wheel', mouseWheelHandler);
      container.addEventListener('click', clearEvents);
      document.addEventListener("keydown", escKeypressHandler);

      function clearEvents () {
        container.removeEventListener('click', clearEvents);
        container.removeEventListener('keydown', escKeypressHandler);
        
        img.removeEventListener('click', clickHandler)
        img.removeEventListener('mousemove', mouseMoveHandler)
        img.removeEventListener('wheel', mouseWheelHandler)
        
        // Move the picture to the center of the screen (smoothly)
        img.style.transition = '0.1s'
        img.style.transform = `translate(0px, 0px) scale(1)`;
        
        // After moving the picture to the center of the screen - play the closing animation
        setTimeout(() => {
          delete img.style.transfrom
          container.style.animation = 'fade-out 0.2s forwards'
          p.style.animation = 'fade-out-p 0.2s forwards'
          img.style.animation = `fade-out-img 0.2s forwards`
        }, 100);
        
        // Removing elements from the site
        setTimeout(() => {
          img.remove()
          style.remove()
          container.remove()
        }, 600)
      }
    });
  });
});
