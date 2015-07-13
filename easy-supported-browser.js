(function (supportedBrowser) {
	var options = {};
	
	supportedBrowser.configure = function (configurationOptions) {
		options.browsers = configurationOptions.browsers || {};
		options.browsers.win = extend(configurationOptions.browsers.win || {}, configurationOptions.globalBrowsersInfo);
		options.browsers.mac = extend(configurationOptions.browsers.mac || {}, configurationOptions.globalBrowsersInfo);
		options.browsers.linux = extend(configurationOptions.browsers.linux || {}, configurationOptions.globalBrowsersInfo);
		options.browsers.android = extend(configurationOptions.browsers.android || {}, configurationOptions.globalBrowsersInfo);
		options.browsers.ios = extend(configurationOptions.browsers.ios || {}, configurationOptions.globalBrowsersInfo);
		options.browsers.winphone = extend(configurationOptions.browsers.winphone || {}, configurationOptions.globalBrowsersInfo);
		options.browsers.blackberry = extend(configurationOptions.browsers.blackberry || {}, configurationOptions.globalBrowsersInfo);

		options.mainAppContainerId = configurationOptions.mainAppContainerId;

		return supportedBrowser;
	}

	supportedBrowser.init = function () {
		if (!isBrowserSupported()) {
			hideMainApp();
			renderNotSupportedView();
		}

		return supportedBrowser;
	}

	function extend(targetBrowsers, globalBrowsers) {
		var result = targetBrowsers;

		for (var browser in targetBrowsers) {
			if (!globalBrowsers[browser]) {
				continue;
			}

			targetBrowsers[browser].image = targetBrowsers[browser].image || globalBrowsers[browser].image || null;
			targetBrowsers[browser].title = targetBrowsers[browser].title || globalBrowsers[browser].title || null;
			targetBrowsers[browser].link = targetBrowsers[browser].link || globalBrowsers[browser].link || null;
			targetBrowsers[browser].version = targetBrowsers[browser].version || globalBrowsers[browser].version || null;
		}

		return result;
	}

	function isBrowserSupported() {
		var browserInfo = detectBrowser();

		if (!browserInfo.name || !browserInfo.version || !browserInfo.platform) {
			return false;
		}

		var browser = options.browsers[browserInfo.platform][browserInfo.name];
		return browser && (!browser.version || browser.version <= browserInfo.version);
	}

	function hideMainApp() {
		var mainAppContainer = getById(options.mainAppContainerId),
			htmlContainer = document.getElementsByTagName("html")[0],
			bodyContainer = document.getElementsByTagName("body")[0];
		
		supportedBrowser.originalPageStyles = {
			mainContainerDisplay: mainAppContainer.style.display,
			htmlContainerHeight: htmlContainer.style.height,
			bodyContainerHeight: bodyContainer.style.height
		};
		
		mainAppContainer.style.display = 'none';
		htmlContainer.style.height = '100%';
		bodyContainer.style.height = '100%';
	}

	function showMainApp() {
		getById(options.mainAppContainerId).style.display = supportedBrowser.originalPageStyles.mainContainerDisplay;
		document.getElementsByTagName("html")[0].style.height = supportedBrowser.originalPageStyles.htmlContainerHeight;
		document.getElementsByTagName("body")[0].style.height = supportedBrowser.originalPageStyles.bodyContainerHeight;
	}

	function detectBrowser() {
		var ua = navigator.userAgent,
            matches = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [],
            browserName = matches[1],
            version = matches[2],
            temp;
            
		// detect platform
		var platform = (/(ipad)/i.exec(ua) ||
			/(ipod)/i.exec(ua) ||
			/(iphone)/i.exec(ua) ||
			/(android)/i.exec(ua) ||
			/(windows phone)/i.exec(ua) ||
			/(win)/i.exec(ua) ||
			/(mac)/i.exec(ua) ||
			/(linux)/i.exec(ua) ||
			/(blackberry)/i.exec(ua) ||
			[])[0];
			
        if (/(ipad|ipod|iphone)/i.exec(platform)) {
            platform = 'ios';
        } else if (/(windows phone)/i.exec(platform)) {
            platform = 'winphone';
        }

        if (!matches[2]) {
			browserName = navigator.appName;
			version = navigator.appVersion;
		}
		if ((temp = ua.match(/version\/(\d+)/i)) != null) {
			version = temp[1];
		}
        
        // hacks
        if (/trident/i.test(browserName)) {
            temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
            browserName = 'msie';
            version = temp[1] || '';
		} else if (/(chrome)/i.exec(browserName)) {
            temp = ua.match(/\bOPR\/(\d+)/);
            if (temp != null) {
                browserName = 'opera';
                version = temp[1] || '';
            }
		} else if (/(android)/i.exec(platform) && /(safari)/i.exec(browserName)) {
			browserName = 'native';
		}

		return {
            name: browserName.toLowerCase(),
            version: version,
            platform: (platform || '').toLowerCase()
		};
	}

	function renderNotSupportedView() {
		var notSupportedViewHtml =
			'<table class="bg-table" border="0" cellpadding="0" cellspacing="0">\
	            <tr>\
	                <td class="top-bg">&nbsp;</td>\
	            </tr>\
	            <tr>\
	                <td>\
	                    <div class="toothed-bg">&nbsp;</div>\
	                </td>\
	            </tr>\
	            <tr>\
	                <td class="bottom-bg">&nbsp;</td>\
	            </tr>\
	        </table>\
	        <table class="markup-table" border="0" cellpadding="0" cellspacing="0">\
	            <tr>\
	                <td colspan="3" class="eg-logo-wrapper">\
	                    <div class="eg-logo">&nbsp;</div>\
	                </td>\
	            </tr>\
	            <tr>\
	                <td>&nbsp;</td>\
	                <td class="content-cell">\
	                    <div class="content">\
	                        <h1 class="page-caption">We can’t guarantee that easygenerator will work perfectly on your current browser</h1>\
	                        <a href="" id="skip-not-supported-page" class="try-anyway-link">I still want to continue</a>\
	                        <p class="page-caption-description">We recommend that you upgrade your browser or use a fully supported browser. Click one of this icons below to install or upgrade.</p>\
	                        <table class="supported-browsers-group" border="0" cellpadding="0" cellspacing="0">\
	                            <tr>\
	                                <td>&nbsp;</td>\
									{0}\
	                                <td>&nbsp;</td>\
	                            </tr>\
	                        </table>\
	                    </div>\
	                </td>\
	                <td>&nbsp;</td>\
	            </tr>\
	            <tr>\
	                <td>\
	                    <div class="bottom-aligner">&nbsp;</div>\
	                </td>\
	                <td>&nbsp;</td>\
	                <td>&nbsp;</td>\
	            </tr>\
	        </table>';

		var browserInfo = detectBrowser(),
			supportedBrowsers = options.browsers[browserInfo.platform];

		var supportedBrowsersListHtml = '';
		for (var browserName in supportedBrowsers) {
			var browser = supportedBrowsers[browserName];

			if (browser.link) {
				supportedBrowsersListHtml += 
					'<td class="supported-browser-item">\
			            <a href="' + browser.link + '" class="supported-browser-container with-link" target="_blank">\
			                <img class="browser-image" src="' + browser.image + '" alt="">\
			                <p class="browser-title-wrapper">\
			                    <span class="browser-title">' + browser.title + '</span>\
			                </p>\
			            </a>\
			        </td>'
			} else {
				supportedBrowsersListHtml += 
					'<td class="supported-browser-item">\
			            <div class="supported-browser-container">\
			                <img class="browser-image" src="' + browser.image + '" alt="">\
			                <p class="browser-title-wrapper">\
			                    <span class="browser-title">' + browser.title + '</span>\
			                </p>\
			            </div>\
			        </td>'
			}
		}

		notSupportedViewHtml = notSupportedViewHtml.replace('{0}', supportedBrowsersListHtml);

		var notSupportedView = document.createElement('div');
		notSupportedView.innerHTML = notSupportedViewHtml;
		notSupportedView.id = 'not-supported-page';

		var body = document.getElementsByTagName('body')[0];
		body.appendChild(notSupportedView);

		getById('skip-not-supported-page').onclick = function () {
			notSupportedView.style.display = 'none';
			showMainApp();
		}

		return notSupportedView;
	}

	function getById(id) {
		return document.getElementById(id);
	}

})(window.supportedBrowser = window.supportedBrowser || {});