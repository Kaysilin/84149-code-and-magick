'use strict';

define([
  'game'
], function(Game) {

  var elementClouds = document.querySelector('.header-clouds');
  var parallaxActive = 1;

  /**
   * Пересчитывает положение облаков в зависимости от оффсета окна
   * @param {number} isActive
   */
  function doParallax() {
    if (parallaxActive) {
      elementClouds.style.backgroundPosition = (window.pageYOffset * 0.8) + 'px 50%';
    }
  }

  /**
   * Инициализация обработчиков скролла, и событий которые они испускают.
   */
  function initScroll() {
    var timeoutDisappear;

    window.addEventListener('scroll', function() {
      var TIMEOUT = 100;

      doParallax();
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

    /**
     * Проверка видимости блока с облаками:
     * если виден - параллакс включен
     * если не виден - праллакс выключен
     */
    function doCloudDisappear() {
      var elementCloudsPosition = elementClouds.getBoundingClientRect();
      if (elementCloudsPosition.bottom <= 0) {
        window.dispatchEvent(new CustomEvent('cloudsdisappear'));
      } else {
        window.dispatchEvent(new CustomEvent('cloudsappear'));
      }
    }

    /**
     * Проверка видимости блока с игрой:
     * если виден - игра активна
     * если не виден - игра на паузу
     */
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
  doParallax();

  var game = new Game(document.querySelector('.demo'));
  game.initializeLevelAndStart();
  game.setGameStatus(Game.Verdict.INTRO);
});
