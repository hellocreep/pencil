(function() {
$(function() {
  pencil = new Pencil();
  window.pencil = pencil;

  $('.js-pencil-play').on('click', function() {
    pencil.play();
  });
});
})(jQuery);