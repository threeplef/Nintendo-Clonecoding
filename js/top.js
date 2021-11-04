$(function() {

/* sns
	/*----------------------------------------------------------*/
  var shareUrl = encodeURIComponent('https://www.nintendo.co.kr/software/switch/acbaa/index.html');
  var shareTitle = encodeURIComponent('Nintendo Switch『모여봐요 동물의 숲』의 공식 사이트입니다.');
	$('.c-sns__twitter a').attr('href', 'http://twitter.com/share?url=' + shareUrl + '&text=' + shareTitle);
	$('.c-sns__facebook a').attr('href', 'http://www.facebook.com/share.php?u=' + shareUrl);
	$('.c-sns__twitter a, .c-sns__facebook a').on('click', function(e) {
		e.preventDefault();
		popupWindow($(this).attr('href'));
	});

  function popupWindow(url) {
    window.open(url, '', 'width=650,height=550,menubar=no,toolbar=no,scrollbars=yes');
  }

});

$(function() {
  $(window).on('load', function() {
    $('.p-top-visual').addClass('is-show');
    $('.p-top-slowlife__inner a img').scrollClass();
    $('.p-top-guid__inner').scrollClass();
    $('.p-top-tanuki-kaihatsu').scrollClass();
  });
});
