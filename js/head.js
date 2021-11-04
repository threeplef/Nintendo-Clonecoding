// userAgent
var ua = navigator.userAgent.toLowerCase();
var ver = navigator.appVersion.toLowerCase();

// IE
var isMSIE = (ua.indexOf('msie') > -1) && (ua.indexOf('opera') == -1);
var isIE6 = isMSIE && (ver.indexOf('msie 6.') > -1);
var isIE7 = isMSIE && (ver.indexOf('msie 7.') > -1);
var isIE8 = isMSIE && (ver.indexOf('msie 8.') > -1);
var isIE9 = isMSIE && (ver.indexOf('msie 9.') > -1);
var isIE10 = isMSIE && (ver.indexOf('msie 10.') > -1);
var isIE11 = (ua.indexOf('trident/7') > -1);
var isIE = isMSIE || isIE11;
var isEdge = (ua.indexOf('edge') > -1);

// other browser
var isChrome = (ua.indexOf('chrome') > -1) && (ua.indexOf('edge') == -1);
var isFirefox = (ua.indexOf('firefox') > -1);
var isSafari = (ua.indexOf('safari') > -1) && (ua.indexOf('chrome') == -1);
var isOpera = (ua.indexOf('opera') > -1);

// game browser
var isWiiU = (ua.indexOf('wiiu') > -1);
var isWii = (ua.indexOf('wii') > -1) && !isWiiU;
var isDS = (ua.indexOf('nintendo ds') > -1);
var isNew3DS = (ua.indexOf('new nintendo 3ds') > -1);
var is3DS = (ua.indexOf('nintendo 3ds') > -1 && !isNew3DS);

// smartPhone
var isiPhone = (ua.indexOf('iphone') > -1) && (ua.indexOf('ipad') == -1) && !isNew3DS;
var isiPad = (ua.indexOf('ipad') > -1);
var isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
var isAndroidTablet = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') == -1);

var isTablet = (isiPad || isAndroidTablet);
var isSP = (isiPhone || isAndroid);
var isTablet_wiiu = (isTablet || isWiiU);
var isSP_new3DS = (isSP || isNew3DS);
var isSP_3DS = (isSP || is3DS || isNew3DS);

// root
var judgment = 'ag3ja';
var rootUrl = location.protocol + '//' + location.host;
var rootPathArr = location.pathname.split('/');
if(rootPathArr[0] == '') {
	rootPathArr.shift();
}
for (var i = 0; i < rootPathArr.length ; i++) {
	rootUrl += '/' + rootPathArr[i];
	if(rootPathArr[i] == judgment) {
		rootUrl += '/';
		break;
	}
}

/* ゲーム機のリダイレクト対応
 --------------------------------------------------*/
var isGameBrowser = ( isWiiU || isWii || isDS || isNew3DS || is3DS );
var redirectURL = rootUrl + 'ntdevice/index.html';
if( isGameBrowser ) { location.href = redirectURL; };