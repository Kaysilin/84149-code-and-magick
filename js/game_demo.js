'use strict';

define([
  'game'
], function(Game) {

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
      timeoutDisappear = setTimeout(function() {
        doCloudDisappear();
        doGamePause();
      }, TIMEOUT);
    });

    window.addEventListener('cloudsdisappear', function() {
      parallaxActive = 0;
    });

    window.addEventListener('cloudsappear', function() {
      parallaxActive = 1;
    });

    window.addEventListener('gamepause', function() {
      game.setGameStatus(Game.Verdict.PAUSE);
    });

    window.addEventListener('gamecontinue', function() {
      game.setGameStatus(Game.Verdict.CONTINUE);
    });

    function doCloudDisappear() {
      var elementCloudsPosition = elementClouds.getBoundingClientRect();
      if (elementCloudsPosition.bottom <= 0) {
        window.dispatchEvent(new CustomEvent('cloudsdisappear'));
      } else {
        window.dispatchEvent(new CustomEvent('cloudsappear'));
      }
    }

    function doGamePause() {
      var elementGamePosition = document.querySelector('.demo canvas').getBoundingClientRect();
      if (elementGamePosition.bottom <= 0) {
        window.dispatchEvent(new CustomEvent('gamepause'));
      } else {
        window.dispatchEvent(new CustomEvent('gamecontinue'));
      }
    }
  }

  initScroll();

  var game = new Game(document.querySelector('.demo'));
  game.initializeLevelAndStart();
  game.setGameStatus(Game.Verdict.INTRO);
});
