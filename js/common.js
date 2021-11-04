var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 通常再生のYouTube設定
var ytplays = document.querySelectorAll('[data-ytid]');
var ytData = [];
for (var i = 0; i < ytplays.length; i++) {
  ytData[i] = {
    id: ytplays[i].dataset.ytid,
    area: ytplays[i].id
  }
}
// 自動再生のYouTube設定
var ytAutoplays = document.querySelectorAll('[data-ytautoplay]');
var ytAutoData = [];
for (var i = 0; i < ytAutoplays.length; i++) {
  ytAutoData[i] = {
    id: ytAutoplays[i].dataset.ytautoplay,
    area: ytAutoplays[i].id
  }
}
var ytPlayer = [];
var ytPlaying, ytStop, ytPlay;
var ytAutoPlayer = [];
var ytReadyFlag = false;
// YouTubeの埋め込み
function onYouTubeIframeAPIReady() {
  ytReadyFlag = true;
  // 通常再生のYouTube埋め込み
  for (var i = 0; i < ytData.length; i++) {
    ytPlayer[i] = new YT.Player(ytData[i]['area'], {
      videoId: ytData[i]['id'],
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onStateChange': ytPlayonStateChange
      }
    });
  }

  // 自動再生のYouTube埋め込み
  if(!isTablet_wiiu) {
    for (var i = 0; i < ytAutoData.length; i++) {
      ytAutoPlayer[i] = new YT.Player(ytAutoData[i]['area'], {
        videoId: ytAutoData[i]['id'],
        playerVars: {
          rel: 0,
          controls: 0,
          showinfo: 0,
          autoplay: 1,
          loop: 1,
          playlist: ytAutoData[i]['id']
        },
        events: {
          'onReady': ytAutoPlayReady
        }
      });
    }
  }
}
// 通常再生のYouTubeのステータス変更時
function ytPlayonStateChange(event) {
  for(var i = 0; i < ytData.length; i++) {
    var thisState = ytPlayer[i].getPlayerState();
    if( thisState == 1 && ytPlaying == undefined) {
      ytPlaying = i;
    } else if(thisState == 1 && ytPlaying != i) {
      ytStop = ytPlaying;
      ytPlay = i;
    } else {
    }
  }
  if(ytStop != undefined) {
    ytPlayer[ytStop].pauseVideo();
    ytStop = undefined;
  }
  if(ytPlay != undefined) {
    ytPlaying = ytPlay;
    ytPlay = undefined;
  }
}
// 自動再生のYouTube準備完了時
function ytAutoPlayReady(event) {
  event.target.mute();
}

/******************************
	class
 ******************************/
$(function() {
	if(isTablet) {
		$('body').addClass('is-tablet');
	}
	if(isiPad) {
		$('body').addClass('is-ipad');
	}
	if(isAndroidTablet) {
		$('body').addClass('is-android');
	}
	if(isIE) {
		$('body').addClass('is-ie');
	}
	if(isEdge) {
		$('body').addClass('is-edge');
	}
	if(isChrome) {
		$('body').addClass('is-chrome');
	}
	if(isFirefox) {
		$('body').addClass('is-firefox');
	}
	if(isSafari) {
		$('body').addClass('is-safari');
	}
});


var s = 0;
var replaceWidth = 760; // 画像を切り替えるウィンドウサイズ。
var isPC = true;
var timer = false;
var windowWidth = parseInt($(window).width());
var windowHeight = $(window).height();
var documentHeight = $(document).height();
var bodyHeight = $('.l-main').height();
var scrTop = 0;
var carouselSliders = [];
var my_sliderThumb_main = [];
var my_sliderThumb_thumb = [];

$(function(){
/* リサイズ スクロール
/*----------------------------------------------------------*/
  $(window).on('resize', function() {
    if (timer !== false) {
      clearTimeout(timer);
    }

    timer = setTimeout(function() {
      windowWidth = parseInt($(window).width());
      windowHeight = $(window).height();
      documentHeight = $(document).height();
      bodyHeight = $('.l-main').height();
      deviceCheck();
      imageSwitch();
      // preheaderFix();
      prefooterFix();
      // floatmenu();
    }, 200 );
  });

  $(window).on('scroll', function(){
    scrTop = $(window).scrollTop();
  });


/* deviceCheck
/*----------------------------------------------------------*/
  function deviceCheck() {
    if($('#deviceCheck').css('position')=='static'){
      isPC = false;
    }else if($('#deviceCheck').css('position')=='relative'){
      isPC = true;
    }
  }
  deviceCheck();

/* pagetop
/*----------------------------------------------------------*/
  $('.js-pagetop').on('click', function(){
    $('body,html').animate({scrollTop:0}, 500, 'swing');
    return false;
  });

/* アンカー
/*----------------------------------------------------------*/
  $('a[href^=#]:not(.scroll-no)').click(function(){
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    if ($('.js-headerFix').length) {
      if ($('.js-headerFix').hasClass('is-fixed')) {
        position = target.offset().top - $('.js-headerFix').height();
      }
    }
    $("html, body").animate({scrollTop:position}, 500, "swing");
    return false;
  });

/* マウスオーバー
/*----------------------------------------------------------*/
  if(!isTablet_wiiu) {
    var hoverImgPaths = [];
    for (var i = 0; i < $('img[src *= "_off."]').length; i++) {
      hoverImgPaths[i] = $('img[src *= "_off."]').eq(i).attr('src').replace('_off.', '_on.');
    }
    imgPreload(hoverImgPaths);

    $(document).on('mouseenter', 'img[src *= "_off."]', function() {
      if (isPC) {
      	$(this).attr('src', this.src.replace('_off.', '_on.'));
      }

    });
    $(document).on('mouseleave', 'img[src *= "_on."]', function() {
      if (isPC) {
        if(!$(this).hasClass('is-current')) {
          $(this).attr('src', this.src.replace('_on.', '_off.'));
        }
      }
    });
  }


/* レスポンシブイメージ data-image-set
/*----------------------------------------------------------*/
  // 置換の対象とするclass属性。
  var $elem = $('.js-image-switch');
  // 置換の対象とするsrc属性の末尾の文字列。
  var sp = '__sp';
  var pc = '__pc';

  function imageSwitch() {
    // ウィンドウサイズを取得する。
    // var windowWidth = parseInt($(window).width());

    // ページ内にあるすべての`.js-image-switch`に適応される。
    $elem.each(function() {
      var $this = $(this);
      if (isPC) {
        $this.attr('src', $this.attr('src').replace(sp, pc));
      } else {
        $this.attr('src', $this.attr('src').replace(pc, sp));
      }
    });
  }
  imageSwitch();


/* クロスフェード
/*----------------------------------------------------------*/
  if($('.js-crossfade').length){
    $('.js-crossfade').each(function(){
      var $this = $(this);
      var fade;
      function fadeGallery(){
        $this.find('li:first-child').hide().appendTo($this).fadeIn();
      }
      fade = setInterval(function(){
        fadeGallery();
      },4000);
    });
  }

/* フッター固定
/*----------------------------------------------------------*/
  function prefooterFix() {
    if($('.js-footerFix').length) {
      $('.js-footerFix').removeClass('is-fixed').css('bottom', '0');
      $('.l-main').css('padding-bottom', '0');
      if (isPC && !isTablet_wiiu) {
          var footerImgPaths = [];
          for (var i = 0; i < $('.js-footerFix img').length; i++) {
            footerImgPaths[i] = $('.js-footerFix img').eq(i).attr('src');
          }
          preloadFixed(footerImgPaths,'footerFix');
      }
    }
  }
  prefooterFix();

  function footerFix() {
    $footerFix = $('.js-footerFix');
    var $main = $('.l-main');
    var footerHeight = $footerFix.height();
    var footerBottomHeight = $('.c-footer-bottom').outerHeight(true);

    $(window).on('scroll', function(){
      $main.css('padding-bottom', footerHeight + 'px');

      //if ((documentHeight - (windowHeight + scrTop)) < footerHeight) {
			if(scrTop + windowHeight + 50 >= $(document).height()) {
        $footerFix.addClass('is-bottom');
      } else {
        $footerFix.removeClass('is-bottom');
      }

      if (scrTop > 300) {
        $footerFix.addClass('is-fixed').css('bottom', '-' + footerBottomHeight + 'px');
      } else {
        $footerFix.removeClass('is-fixed').css('bottom', '0');
      }
    });
  }

/* preloadFixed
/*----------------------------------------------------------*/
  function preloadFixed(imgPaths, func) {
    var counter = 0;
    for (var i = 0; i < imgPaths.length; i++) {
      var preloadImage = $('<img>');
      preloadImage.load(function() {
        counter++;
        if (imgPaths.length <= counter) {
          if (func == 'headerFix') {
            headerFix();
          } else if (func == 'footerFix') {
            footerFix();
          }
        }
      });
      preloadImage.attr('src', imgPaths[i]);
    }
  }

/* カルーセル js-carousel
/*----------------------------------------------------------*/
  if($('.js-carousel').length){
    $('.js-carousel').each(function(index){
      var $this = $(this);
      var $carousel = $this.find('.c-carousel__list');

      carousel_settings = {
        loop: true,
        stagePadding: 0,
        nav: true,
        autoplay:false,
        autoplaySpeed: false,
        autoplayHoverPause:true,
        responsiveClass:false,
        responsive:{
          0:{
              items: 1,
              margin: 5,
          },
          760:{
              items: 1,
              margin: 10,
          }
        },
        slideBy: 2
      };

      //アイテム数
      carousel_data = $this.find('[data-carousel-num]').attr('data-carousel-num');
      if (carousel_data != undefined) {
        if (carousel_data > 1) {
          carousel_settings.responsive = {0:{items:2,margin:5}, 760:{items:parseInt(carousel_data),margin:10}};
        }
      }

      //余白あり
      if ($this.hasClass('c-carousel--padding')) {
        var padding_settings = {
          responsive:{
            0: {
              stagePadding: 23,
            },
            760: {
              stagePadding: 53,
            }
          }
        };
        $.extend(true, carousel_settings, padding_settings);
      }


      //ループ再生
      var carousel_loop = $this.find('[data-carousel-loop]').attr('data-carousel-loop');
      if (carousel_loop != undefined) {
        if (carousel_loop == 'true') {
          carousel_settings.loop = true;
        } else if(carousel_loop == 'false') {
          carousel_settings.loop = false;
        }
      }


      //自動再生
      var carousel_autoplay = $this.find('[data-carousel-autoplay]').attr('data-carousel-autoplay');
      if (carousel_autoplay != undefined) {
        if (carousel_autoplay == 'true') {
          carousel_settings.autoplay = true;
          carousel_settings.autoplaySpeed = 1000;
          carousel_settings.autoplayHoverPause = true;
          carousel_settings.loop = true;
        }
      }


      //スライダーの高さ自動調整
      var carousel_autoheight = $this.find('[data-carousel-autoheight]').attr('data-carousel-autoheight');
      if (carousel_autoheight != undefined) {
        if (carousel_autoheight == 'true') {
          carousel_settings.autoHeight = true;
        } else if(carousel_autoheight == 'false') {
          carousel_settings.autoHeight = false;
        }
      }
      carouselSliders[index] = $carousel.owlCarousel(carousel_settings);
      carouselSliders[index].on('changed.owl.carousel', function(event) {
        this_movie = $(this).find('.owl-item.active').find('[data-ytid]');
        if(this_movie.length > 0) {
          this_movieid = this_movie.data('ytid');
          for (var i = 0; i < ytPlayer.length; i++) {
            if(this_movieid == ytPlayer[i].getIframe().dataset.ytid) {
              ytPlayer[i].pauseVideo();
            }
          }
        }
      });
    });
  }


/* 動画（複数掲載）
/*----------------------------------------------------------*/
  if($('.js-top-movie-multi').length){
      topMovieMulti_settings = {
        loop: false,
        nav: true,
        autoplay:false,
        responsiveClass:false,
        responsive:{
          0:{
              items: 2,
              margin: 10,
          },
          760:{
              items: 4,
              margin: 10,
          }
        }
      };

    $('.js-top-movie-multi').each(function(index){
      var $this = $(this);
      var $topMovieMulti = $this.find('.c-top-movie-multi__list');

      var this_topMovieMulti = $topMovieMulti.owlCarousel(topMovieMulti_settings);
      this_topMovieMulti.on('changed.owl.carousel', function(event) {
        this_movie = $(this).find('.owl-item.active').find('[data-ytid]');
        if(this_movie.length > 0) {
          this_movieid = this_movie.data('ytid');
          for (var i = 0; i < ytPlayer.length; i++) {
            if(this_movieid == ytPlayer[i].getIframe().dataset.ytid) {
              ytPlayer[i].pauseVideo();
            }
          }
        }
      });
    });
  }



/* サムネイル付スライドショー
/*----------------------------------------------------------*/
  //spカルーセル
  // function func_this_slidercarousel_thumb() {
  if($('.js-slider').length){
    $sliderThumb = $('.js-slider');

    var setting_sliderThumb_main = {
      // pagerCustom: this_slidercarousel_thumb,
      infiniteLoop: false,
      mode: 'horizontal',
      controls:true,
      hideControlOnEnd: true,
      touchEnabled: false,
    };
    // var setting_sliderThumb_main = slidermain();


    $sliderThumb.each(function(index){
      var $this = $(this);
      var this_sliderThumb_thumb = $this.find('.c-slider__thumb-list');
      var this_sliderThumb_main = $this.find('.c-slider__main-list');

      setting_sliderThumb_main.pagerCustom = this_sliderThumb_thumb;

      //メインスライド
      my_sliderThumb_main[index] = this_sliderThumb_main.bxSlider(setting_sliderThumb_main);

    });


    // $(window).on('resize', function() {
    //   windowWidth = parseInt($(window).width());

    //   $.each(my_sliderThumb_main, function(i, slidermain) {
    //     slidermain.reloadSlider(setting_sliderThumb_main);
    //   });
    // });
  }




/* カルーセル付スライドショー
/*----------------------------------------------------------*/
  if($('.js-slider-carousel').length){
    var this_slidercarousel = [];
    $slidercarousel = $('.js-slider-carousel');

    var setting_slidercarousel = setting();

    function setting() {
      var a = {
        pager:false,
        infiniteLoop: false,
        hideControlOnEnd: true,
        touchEnabled: false,
        minSlides: 2,
        maxSlides: 2,
        moveSlides: 1,
        slideWidth: 100,
        slideMargin: 0,
      };
      if (isPC) {
        a.minSlides = 4;
        a.maxSlides = 4;
      } else {
        a.minSlides = 2;
        a.maxSlides = 2;
      }
      return a;
    }

    $slidercarousel.each(function(index){
      var $this = $(this);
      var this_slidercarousel_thumb = $this.find('.c-slider-carousel__thumb-list');
      var this_slidercarousel_main = $this.find('.c-slider-carousel__main-list');
      var slidercarousel_thumb_width = $this.find('.c-slider-carousel__thumb').width();

      if (isPC) {
        setting_slidercarousel.slideWidth = slidercarousel_thumb_width / 4;
      } else {
        setting_slidercarousel.slideWidth = slidercarousel_thumb_width / 2;
      }
      // if(windowWidth >= replaceWidth) {
      //   //pc
      //   setting_slidercarousel.slideWidth = slidercarousel_thumb_width / 4;
      // } else {
      //   //sp
      //   setting_slidercarousel.slideWidth = slidercarousel_thumb_width / 2;
      // }

      //メインスライド
      this_slidercarousel_main.bxSlider({
        pagerCustom: this_slidercarousel_thumb,
        infiniteLoop: false,
        mode: 'fade',
        controls:false,
        touchEnabled: false,
        onSlideBefore: function($slideElement, oldIndex, newIndex){
          this_movie = $(this).find('.c-slider-carousel__item:visible').find('[data-ytid]');
          if(this_movie.length > 0) {
            this_movieid = this_movie.data('ytid');
            for (var i = 0; i < ytPlayer.length; i++) {
              if(this_movieid == ytPlayer[i].getIframe().dataset.ytid) {
                ytPlayer[i].pauseVideo();
              }
            }
          }
        },
      });

      //サムネイル
      this_slidercarousel[index] = this_slidercarousel_thumb.bxSlider(setting_slidercarousel);

    });

    $(window).on('resize', function() {
      deviceCheck();
      setting_slidercarousel = setting();
      // windowWidth = parseInt($(window).width());
      $.each(this_slidercarousel, function(i, slidercarousel) {
        thumb_width = slidercarousel.width();
        if (isPC) {
          setting_slidercarousel.slideWidth = thumb_width / 4;
        } else {
          setting_slidercarousel.slideWidth = thumb_width / 2;
        }
        // if(windowWidth >= replaceWidth) {
        //   //pc
        //   setting_slidercarousel.slideWidth = thumb_width / 4;
        // } else {
        //   //sp
        //   setting_slidercarousel.slideWidth = thumb_width / 2;
        // }
        slidercarousel.reloadSlider(setting_slidercarousel);
      });
    });
  }




/* 横幅100％・自動スライド
/*----------------------------------------------------------*/
  if($('.js-infinite-slide').length){
    $('.js-infinite-slide').infiniteslide({
      speed: 200,
      pauseonhover: false,
      responsive: true,
      clone:20
    });
  }



/* モーダル
/*----------------------------------------------------------*/
  var modal_index = 0;
  $('[data-modallink]').on('click', function(e) {
    e.preventDefault();
    // ヘッダーと被る場合の対応
    if($(window).scrollTop() < $('#ncommon-ghdr-header').height()) {
      $(window).scrollTop(60);
    }
    var modalTarget = $(this).data('modallink');
    $('[data-modalbody = ' + modalTarget + ']').addClass('is-show');
    $('body').addClass('is-hidden');
    modalPosition();
    //カルーセルからモーダルを開く
    if ($(this).parents('.js-carousel').length > 0 || $(this).parents('.js-top-movie-multi').length > 0) {
      modal_index = $(this).parents('.owl-item').index();
      if ($('[data-modalbody = ' + modalTarget + ']').find('.js-carousel')) {
        $('[data-modalbody = ' + modalTarget + ']').find('.c-carousel__list').trigger('to.owl.carousel', parseInt(modal_index));
      }
    }
  });

  $('[data-modalchange]').on('click', function(e) {
    e.preventDefault();
    modalClose_ytcheck();
    var modalTarget = $(this).data('modalchange');
    $('[data-modalbody].is-show').removeClass('is-show');
    $('[data-modalbody = ' + modalTarget + ']').addClass('is-show');
    modalPosition();
  });

  $(document).on('click touchend', function(e) {
    if($(e.target).is('.js-modalcontents')) {
      modalClose_ytcheck();
      modalClose();
    }
  });
  $('.js-modalclose').on('click', function() {
    modalClose_ytcheck();
    modalClose();
  });
  $(window).on('resize', function() {
    modalPosition();
  });
  function modalPosition() {
    var $currentModalBody = $('[data-modalbody].is-show .l-modal__body');
    var winHeight = $(window).height();
    var modalHeight = $currentModalBody.outerHeight();
    if(winHeight > modalHeight) {
      $currentModalBody.css({
        position: 'relative',
        top: (winHeight - modalHeight) / 2
      });
    } else {
      $currentModalBody.removeAttr('style');
    }
  }
  function modalClose() {
    $('[data-modalbody]').removeClass('is-show');
    $('body').removeClass('is-hidden');
  }
  function modalClose_ytcheck() {
    var $modalYt = $('[data-modalbody].is-show .l-modal__body').find('[data-ytid]:visible');
    if ($modalYt.parents('.js-carousel').length > 0) {
      $modalYt = $modalYt.parents('.js-carousel').find('.owl-item.active').find('[data-ytid]');
    }
    if($modalYt.length > 0) {
      var modalYtId = $modalYt.data('ytid');
      for (var i = 0; i < ytPlayer.length; i++) {
        if(modalYtId == ytPlayer[i].getIframe().dataset.ytid) {
          ytPlayer[i].pauseVideo();
        }
      }
    }
  }

  function imgPreload(imgPaths) {
    for (var i = 0; i < imgPaths.length; i++) {
      $('<img>').attr('src', imgPaths[i]);
    }
  }

/* ローディング
/*----------------------------------------------------------*/
  $(window).on('load', function() {
    $('.l-loading').addClass('is-hide');
  });

/*
/*----------------------------------------------------------*/

});

(function($) {
	$.fn.scrollClass = function(options) {
		var elements = this;
		var defaults = {
			ratio: 0.7,
			class: 'is-animation',
			callback: ''
		};
		var setting = $.extend(defaults, options);
		if(!elements.length) {
			return;
		}
		var scrollClassCallback = setting.callback;
		$(window).on('load scroll', function() {
			add_class_in_scrolling();
		});
		function add_class_in_scrolling() {
			var winScroll = $(window).scrollTop();
			var winHeight = $(window).height();
			var scrollPos = winScroll + (winHeight * setting.ratio);
			if((scrollPos > elements.offset().top || winScroll + winHeight > $(document).height() - 10) && !elements.hasClass(setting.class)) {
				elements.addClass(setting.class);
				if(setting.callback !== '') {
					scrollClassCallback();
				}
			}
		}
	}
})(jQuery);

// minからmaxまでの乱整数を返す関数
function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}