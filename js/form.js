"use strict";
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
  formReviewFieldsName.isVisible = 0;
  formReviewFieldsText.isVisible = 0;

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
    }
    else
    {
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

  var calculateDateExpire = function () {
    var dateCurrent = new Date();
    var dateBirthday = new Date(dateCurrent.getFullYear(), 8, 25);
    var dateBirthdayDelta = dateCurrent - dateBirthday;
    if (+dateBirthdayDelta<0) {
      dateBirthdayDelta = 31536000000 + dateBirthdayDelta;
    }
    var dateExpire = new Date(+dateCurrent + +dateBirthdayDelta);
    return dateExpire;
  };

  formElement.onsubmit = function(evt) {
    evt.preventDefault();
    for (var i = 0; i < formReviewMark.length; i++) {
      // Достаточно ли будет проверки на наличие свойства с учетом того, что атрибут булевый или нужно еще проверять на значение свойства равное true?
      if (formReviewMark[i].checked) {
        docCookies.removeItem('review-mark');
        docCookies.setItem('review-mark',formReviewMark[i].value, calculateDateExpire());
      }
    }
    docCookies.removeItem('review-name');
    docCookies.setItem('review-name', formReviewName.value, calculateDateExpire());
    if (formReviewFieldsName.isVisible && formReviewFieldsText.isVisible)   {
      formElement.submit();
    }
    else
    {
      alert('Не все поля формы заполнены');
    }
  };

})();
