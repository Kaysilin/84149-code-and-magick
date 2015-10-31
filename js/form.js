/* global docCookies: true */

'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var formElement = document.forms['review-form'];
  var formReviewMark = document.querySelector('.review-form');
  var formReviewName = document.querySelector('#review-name');
  var formReviewText = document.querySelector('#review-text');
  var formReviewFields = document.querySelector('.review-fields');
  var formReviewFieldsName = document.querySelector('.review-fields-name');
  var formReviewFieldsText = document.querySelector('.review-fields-text');

  /**
   * Обработчик клика по кнопке открытия формы
   * @param {MouseEvent} evt
   */
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
    setCookiesValue();
  };

  /**
   * Обработчик клика по кнопке закрытия формы
   * @param {MouseEvent} evt
   */
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  /**
   * Проверка подсказок лейблов для полей формы
   * на наличие класса, отвечающего за скрытие
   * @param {Element} elem
   * @returns {boolean}
   */
  var isInvisible = function(elem) {
      return elem.classList.contains('invisible');
  };

  /**
   * Валидация данных, введенных в поля формы
   * @param {Object} formReviewInput
   * @param {Object} formReviewInputLabel
   */
  var validateForm = function(formReviewInput, formReviewInputLabel) {
    if (formReviewInput.value) {
      formReviewInputLabel.classList.add('invisible');
      if (isInvisible(formReviewFieldsName) && isInvisible(formReviewFieldsText)) {
        formReviewFields.classList.add('invisible');
      }
    } else {
      formReviewInputLabel.classList.remove('invisible');
      formReviewFields.classList.remove('invisible');
    }
  };

  /**
   * Обработчик ввода данных в поле имя
   * @param {Event} evt
   */
  formReviewName.oninput = function(evt) {
    evt.preventDefault();
    validateForm(formReviewName, formReviewFieldsName);
  };

  /**
   * Обработчик ввода данных в поле отзыв
   * @param {Event} evt
   */
  formReviewText.oninput = function(evt) {
    evt.preventDefault();
    validateForm(formReviewText, formReviewFieldsText);
  };

  /**
   * Расчет срока жизни данных о отзыве в куки
   * @returns {Date}
   */
  var calculateDateExpire = function() {
    var dateCurrent = new Date();
    var dateBirthday = new Date(dateCurrent.getFullYear(), 8, 25);
    var dateBirthdayDelta = dateCurrent - dateBirthday;
    if (+dateBirthdayDelta < 0) {
      dateBirthdayDelta = 31536000000 + dateBirthdayDelta;
    }
    return new Date(+dateCurrent + +dateBirthdayDelta);
  };

  /**
   * Обработчик отправки формы
   * @param {Event} evt
   */
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

    if (isInvisible(formReviewFieldsName) && isInvisible(formReviewFieldsText)) {
      formElement.submit();
    }
  };

  /**
   * Сохранение даннх об отзыве в куки
   */
  var setCookiesValue = function() {
    var cookieNameValue = docCookies.getItem('review-name');
    if (cookieNameValue) {
      formReviewName.value = cookieNameValue;
      validateForm(formReviewName, formReviewFieldsName);
    }
    formReviewMark['review-mark'].value = docCookies.getItem('review-mark');
    console.log(docCookies.getItem('review-mark'));
  };

  /**
   * Обработчик загрузки body
   */
  document.body.onload = function() {
    setCookiesValue();
  };

})();
