(function() {
$(function() {
  var $win = $(window);

  $('#canvas').attr({
    width: $win.width(),
    height: $win.height() - $('#header').height() - $('#footer').height()
  });

  $('#wrap').height($win.height())

  pencil = new Pencil('canvas');
  window.pencil = pencil;

  $('.js-set').on('click', function() {
    pencil.set($(this).data('pencil'));
  });

  $('.js-pencil-play').on('click', function() {
    pencil.play();
    $('.js-toggle-box').trigger('click');
  });

  $('.js-toggle-box').on('click', function() {
    var $this = $(this);
    var anime;
    var top = $('.pencilbox').height();
    if($this.hasClass('down')) {
      anime = {top: 0};
    } else {
      anime = {top: -top}
    }
    $(this).parent().animate(anime, 300, function() {
      $this.toggleClass('down');
    });
  });


});
})(jQuery);