import $ from 'jquery';

// Replace span-wrapper by span-element
export function swipeElement() {
  $('.span-wrapper').each(function (index) {
    const relatedEl = $('.span-element').eq(index);
    relatedEl.appendTo($(this));
  });
}

// Hide CMS if empty
export function hideEmpty() {
  $('.w-dyn-empty').each(function () {
    $(this).parent().hide();
  });
}
