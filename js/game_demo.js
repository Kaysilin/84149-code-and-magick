'use strict';

(function() {

  var elementClouds = document.querySelector('.header-clouds');
  var parallaxActive = 1;

  function doParallax(isActive) {
    if (isActive) {
      elementClouds.style.backgroundPosition = (window.pageYOffset * 0.8) + 'px 50%';
    }
  }

  function initScroll() {
    var timeoutDisappear;

    window.addEventListener('scroll', function() {
      var TIMEOUT = 100;

      doParallax(parallaxActive);
      clearTimeout(timeoutDisappear);
      timeoutDisappear = setTimeout(doCloudDisappear, TIMEOUT);

    });

    window.addEventListener('cloudsdisappear', function() {
      parallaxActive = 0;
    });

    window.addEventListener('cloudsappear', function() {
      parallaxActive = 1;
    });

    function doCloudDisappear() {
      var elementCloudsPosition = elementClouds.getBoundingClientRect();
      if (elementCloudsPosition.bottom <= 0) {
        window.dispatchEvent(new CustomEvent('cloudsdisappear'));
      } else {
        window.dispatchEvent(new CustomEvent('cloudsappear'));
      }
    }
  }

  initScroll();

})();
