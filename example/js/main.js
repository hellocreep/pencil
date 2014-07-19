(function() {
$(function() {
  var $win = $(window);

  $('#canvas').attr({
    width: $win.width(),
    height: $win.height()
  });

  pencil = new Pencil('canvas');
  window.pencil = pencil;

  $('.js-set').on('click', function() {
    pencil.set($(this).data('pencil'));
  });

  $('.js-pencil-play').on('click', function() {
    pencil.play();
  });


});
})(jQuery);