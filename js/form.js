/* global docCookies: true */

'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var formElement = document.forms['review-form'];
  var formReviewMark = document.querySelectorAll('.review-form-group-mark input');
  var formReviewName = document.querySelector('#review-name');
  var formReviewText = document.querySelector('#review-text');
  var formReviewFields = document.querySelector('.review-fields');
  var formReviewFieldsName = document.querySelector('.review-fields-name');
  var formReviewFieldsText = document.querySelector('.review-fields-text');
  // Добавила по одному дополнительному свойству в объекты, хранящие инпуты формы. Изначально до введения отдельной функции на валидацию формы были просто новые переменные-флаги, отвечающие за состояние, но потом при вынесении функционала в функцию, пришлось воспольщоваться именно дополнительными свойствами объектом. Можно ли так делать или могут быть какие-то побочные эффекты и лучше делать по-другому?
  formReviewFieldsName.isVisible = 0;
  formReviewFieldsText.isVisible = 0;

  // Изначально в файле в начале были объявлены переменные, уже дальше шел код. В итоге так у меня тоже основная масса переменных объявляется в начале, это правильно с точки зрения структуры и доступности кода?

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  var validateForm = function(formReviewInput, formReviewInputLabel) {
    if (formReviewInput.value) {
      formReviewInputLabel.classList.add('invisible');
      formReviewInputLabel.isVisible = 1;
      if (formReviewFieldsName.isVisible && formReviewFieldsText.isVisible) {
        formReviewFields.classList.add('invisible');
      }
    } else {
      formReviewInputLabel.classList.remove('invisible');
      formReviewInputLabel.isVisible = 0;
      formReviewFields.classList.remove('invisible');
    }
  };

  formReviewName.oninput = function(evt) {
    evt.preventDefault();
    validateForm(formReviewName, formReviewFieldsName);
  };

  formReviewText.oninput = function(evt) {
    evt.preventDefault();
    validateForm(formReviewText, formReviewFieldsText);
  };

  var calculateDateExpire = function() {
    var dateCurrent = new Date();
    var dateBirthday = new Date(dateCurrent.getFullYear(), 8, 25);
    var dateBirthdayDelta = dateCurrent - dateBirthday;
    if (+dateBirthdayDelta < 0) {
      dateBirthdayDelta = 31536000000 + dateBirthdayDelta;
    }
    return new Date(+dateCurrent + +dateBirthdayDelta);
  };

  formElement.onsubmit = function(evt) {
    evt.preventDefault();
    for (var i = 0; i < formReviewMark.length; i++) {
      if (formReviewMark[i].checked) {
        docCookies.removeItem('review-mark');
        docCookies.setItem('review-mark', formReviewMark[i].value, calculateDateExpire());
      }
    }
    docCookies.removeItem('review-name');
    docCookies.setItem('review-name', formReviewName.value, calculateDateExpire());

    if (formReviewFieldsName.isVisible && formReviewFieldsText.isVisible) {
      formElement.submit();
    } else {
      //alert('Не все поля формы заполнены');
    }
  };

  var setCookiesValue = function() {

    var cookieNameValue = docCookies.getItem('review-name');
    if (cookieNameValue) {
      formReviewName.value = cookieNameValue;
      validateForm(formReviewName, formReviewFieldsName);
    }

    var cookieMarkValue = docCookies.getItem('review-mark');
    if (cookieMarkValue) {
      for (var i = 0; i < formReviewMark.length; i++) {
        formReviewMark[i].removeAttribute('checked');
        if (cookieMarkValue === formReviewMark[i].value) {
          formReviewMark[i].setAttribute('checked', 'true');
        }
      }
    }
  };

  document.body.onload = function() {
    setCookiesValue();
  };

})();
