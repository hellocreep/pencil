(function() {
$(function() {
  var $win = $(window);

  $('#canvas').attr({
    width: $win.width(),
    height: $win.height()
  });

  pencil = new Pencil();
  window.pencil = pencil;



  $('.js-pencil-play').on('click', function() {
    pencil.play();
  });
});
})(jQuery);