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
    window.addEventListener('scroll', function() {
      var TIMEOUT = 100;
      var timeoutDisappear;

      doParallax(parallaxActive);
      clearTimeout(timeoutDisappear);
      timeoutDisappear = setTimeout(window.dispatchEvent(new CustomEvent('cloudsdisappear')), TIMEOUT);

    });

    /* не совсем поняла задачу:
    Оптимизируйте обработчик события scroll с помощью таймаута, который срабатывает каждые 100 миллисекунд и испускает кастомное событие «исчезновения блока с облаками» из поля зрения. NB! Смещение для параллакса должно пересчитываться не каждые 100 миллисекунд, а на каждое изменение скролла, оптимизация касается только проверки видимости блока с облаками.

      Добавьте обработчик события, отключающий параллакс, реагирующий на событие «исчезновения блока с облаками» из поля зрения.

      По факту если обработчик события будет только отключать параллакс, то нужно либо событие, которое будет его включать, либо то же самое переключение флага активности эффекта параллакса сделать в другом месте. Тогда не вижу смысла вообще в этом событии. Сделала так, чтобы пр испукании события его обработчик уже переключает флаг. Используются ли так события или все-таки обычно они используются для реакции на какое-то одно остояние? */
    window.addEventListener('cloudsdisappear', function() {
      var elementCloudsPosition = elementClouds.getBoundingClientRect();
      parallaxActive = elementCloudsPosition.bottom <= 0 ? 0 : 1;
    });
  }

  initScroll();

})();
