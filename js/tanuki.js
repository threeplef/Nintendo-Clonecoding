$(function() {
  $(document).on('click', '[data-modalslide]', function(e) {
    var sliderNo = $(this).data('modalslider');
    var slideNo = $(this).data('modalslide');
    for (var i = 0; i < $('.js-carousel').length; i++) {
      if($('.js-carousel').eq(i).attr('data-modalslider') == sliderNo) {
        carouselSliders[i].trigger('to.owl.carousel', [slideNo, 0]);
      }
    }
  });
});