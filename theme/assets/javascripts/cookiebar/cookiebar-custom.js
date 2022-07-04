var CookieLanguages = [
    "ca",
    "cs",
    "da",
    "de",
    "el",
    "en",
    "es",
    "fr",
    "hu",
    "it",
    "nl",
    "pl",
    "pt",
    "ro",
    "ru",
    "se",
    "sk",
    "sl"
  ],
  cookieLawStates = [
    "AT",
    "BE",
    "BG",
    "CY",
    "CZ",
    "DE",
    "DK",
    "EE",
    "EL",
    "ES",
    "FI",
    "FR",
    "GB",
    "HR",
    "HU",
    "IE",
    "IT",
    "LT",
    "LU",
    "LV",
    "MT",
    "NL",
    "PL",
    "PT"
  ];
function setupCookieBar() {
  var scriptPath = getScriptPath(),
    cookieBar,
    button,
    buttonNo,
    prompt,
    promptBtn,
    promptClose,
    promptContent,
    promptNoConsent,
    startup = !1,
    shutup = !1,
    currentCookieSelection = getCookie();
  if (
    ("CookieDisallowed" == currentCookieSelection &&
      (removeCookies(), setCookie("cookiebar", "CookieDisallowed")),
    void 0 === currentCookieSelection)
  )
    if (1) (startup = !0), initCookieBar();
    else {
      var checkEurope = new XMLHttpRequest();
      checkEurope.open("GET", "https://freegeoip.app/json/", !0),
        (checkEurope.onreadystatechange = function() {
          if (4 === checkEurope.readyState) {
            if ((clearTimeout(xmlHttpTimeout), 200 === checkEurope.status)) {
              var country = JSON.parse(checkEurope.responseText).country_code;
              cookieLawStates.indexOf(country) > -1
                ? (startup = !0)
                : ((shutup = !0),
                  setCookie("cookiebar", "CookieAllowed"),
                  getURLParameter("refreshPage") && window.location.reload());
            } else startup = !0;
            initCookieBar();
          }
        });
      var xmlHttpTimeout = setTimeout(function() {
        console.log("cookieBAR - Timeout for ip geolocation"),
          (checkEurope.onreadystatechange = function() {}),
          checkEurope.abort(),
          (startup = !0),
          initCookieBar();
      }, 1500);
      checkEurope.send();
    }
  function initCookieBar() {
    var accepted;
    document.cookie.length > 0 || window.localStorage.length > 0
      ? void 0 === getCookie()
        ? (startup = !0)
        : (shutup = !0)
      : (startup = !1);
    1 && (startup = !0), !0 === startup && !1 === shutup && startCookieBar();
  }
  function startCookieBar() {
    var userLang = detectLang(),
      theme = "";
    getURLParameter("theme") && (theme = "-" + getURLParameter("theme"));
    var path = scriptPath.replace(/[^\/]*$/, ""),
      minified = scriptPath.indexOf(".min") > -1 ? ".min" : "",
      stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet"),
      stylesheet.setAttribute(
        "href",
        path + "themes/cookiebar" + theme + minified + ".css"
      ),
      document.head.appendChild(stylesheet);
    var request = new XMLHttpRequest();
    request.open("GET", path + "lang/" + userLang + ".html", !0),
      (request.onreadystatechange = function() {
        if (4 === request.readyState && 200 === request.status) {
          var element = document.createElement("div");
          (element.innerHTML = request.responseText),
            document.getElementsByTagName("body")[0].appendChild(element),
            (cookieBar = document.getElementById("cookie-bar")),
            (button = document.getElementById("cookie-bar-button")),
            (buttonNo = document.getElementById("cookie-bar-button-no")),
            (prompt = document.getElementById("cookie-bar-prompt")),
            (promptBtn = document.getElementById("cookie-bar-prompt-button")),
            (promptClose = document.getElementById("cookie-bar-prompt-close")),
            (promptContent = document.getElementById(
              "cookie-bar-prompt-content"
            )),
            (promptNoConsent = document.getElementById(
              "cookie-bar-no-consent"
            )),
            (thirdparty = document.getElementById("cookie-bar-thirdparty")),
            (tracking = document.getElementById("cookie-bar-tracking")),
            (scrolling = document.getElementById("cookie-bar-scrolling")),
            (privacyPage = document.getElementById("cookie-bar-privacy-page")),
            (privacyLink = document.getElementById("cookie-bar-privacy-link")),
            (mainBarPrivacyLink = document.getElementById(
              "cookie-bar-main-privacy-link"
            )),
            getURLParameter("showNoConsent") ||
              ((promptNoConsent.style.display = "none"),
              (buttonNo.style.display = "none")),
            getURLParameter("blocking") &&
              (fadeIn(prompt, 500), (promptClose.style.display = "none")),
            getURLParameter("thirdparty") &&
              (thirdparty.style.display = "block"),
            getURLParameter("tracking") && (tracking.style.display = "block"),
            getURLParameter("hideDetailsBtn") &&
              (promptBtn.style.display = "none"),
            getURLParameter("scrolling") &&
              (scrolling.style.display = "inline-block"),
            getURLParameter("top")
              ? ((cookieBar.style.top = 0), setBodyMargin("top"))
              : ((cookieBar.style.bottom = 0), setBodyMargin("bottom")),
            getURLParameter("privacyPage") &&
              ((privacyLink.href = getPrivacyPageUrl()),
              (privacyPage.style.display = "inline-block")),
            getURLParameter("showPolicyLink") &&
              getURLParameter("privacyPage") &&
              ((mainBarPrivacyLink.href = getPrivacyPageUrl()),
              (mainBarPrivacyLink.style.display = "inline-block")),
            setEventListeners(),
            fadeIn(cookieBar, 250),
            setBodyMargin();
        }
      }),
      request.send();
  }
  function getPrivacyPageUrl() {
    return decodeURIComponent(getURLParameter("privacyPage"));
  }
  function getScriptPath() {
    var scripts = document.getElementsByTagName("script");
    for (i = 0; i < scripts.length; i += 1)
      if (
        scripts[i].hasAttribute("src") &&
        ((path = scripts[i].src), path.indexOf("cookiebar") > -1)
      )
        return path;
  }
  function detectLang() {
    var userLang = "es";
    return (
      !1 === userLang &&
        (userLang = navigator.language || navigator.userLanguage),
      (userLang = userLang.substr(0, 2)),
      CookieLanguages.indexOf(userLang) < 0 && (userLang = "en"),
      userLang
    );
  }
  function getCookie() {
    var cookieValue = document.cookie.match(/(;)?cookiebar=([^;]*);?/);
    return null == cookieValue ? void 0 : decodeURI(cookieValue[2]);
  }
  function setCookie(name, value) {
    var exdays = 30;
    getURLParameter("remember") && (exdays = getURLParameter("remember"));
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + parseInt(exdays));
    var cValue =
      encodeURI(value) +
      (null === exdays ? "" : "; expires=" + exdate.toUTCString() + ";path=/");
    document.cookie = name + "=" + cValue;
  }
  function removeCookies() {
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c
        .replace(/^\ +/, "")
        .replace(/\=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    }),
      localStorage.clear();
  }
  function fadeIn(el, speed) {
    var s = el.style;
    (s.opacity = 0),
      (s.display = "block"),
      (function fade() {
        !((s.opacity -= -0.1) > 0.9) && setTimeout(fade, speed / 10);
      })();
  }
  function fadeOut(el, speed) {
    var s = el.style;
    (s.opacity = 1),
      (function fade() {
        (s.opacity -= 0.1) < 0.1
          ? (s.display = "none")
          : setTimeout(fade, speed / 10);
      })();
  }
  function setBodyMargin(where) {
    setTimeout(function() {
      var height = document.getElementById("cookie-bar").clientHeight,
        bodyEl = document.getElementsByTagName("body")[0],
        bodyStyle = bodyEl.currentStyle || window.getComputedStyle(bodyEl);
      switch (where) {
        case "top":
          bodyEl.style.marginTop =
            parseInt(bodyStyle.marginTop) + height + "px";
          break;
        case "bottom":
          bodyEl.style.marginBottom =
            parseInt(bodyStyle.marginBottom) + height + "px";
      }
    }, 300);
  }
  function clearBodyMargin() {
    var height = document.getElementById("cookie-bar").clientHeight;
    if (getURLParameter("top")) {
      var currentTop = parseInt(
        document.getElementsByTagName("body")[0].style.marginTop
      );
      document.getElementsByTagName("body")[0].style.marginTop =
        currentTop - height + "px";
    } else {
      var currentBottom = parseInt(
        document.getElementsByTagName("body")[0].style.marginBottom
      );
      document.getElementsByTagName("body")[0].style.marginBottom =
        currentBottom - height + "px";
    }
  }
  function getURLParameter(name) {
    var set = scriptPath.split(name + "=");
    return !!set[1] && set[1].split(/[&?]+/)[0];
  }
  function setEventListeners() {
    if (
      (button.addEventListener("click", function() {
        setCookie("cookiebar", "CookieAllowed"),
          clearBodyMargin(),
          fadeOut(prompt, 250),
          fadeOut(cookieBar, 250),
          getURLParameter("refreshPage") && window.location.reload();
      }),
      buttonNo.addEventListener("click", function() {
        var txt = promptNoConsent.textContent.trim(),
          confirm;
        !0 === window.confirm(txt) &&
          (removeCookies(),
          setCookie("cookiebar", "CookieDisallowed"),
          clearBodyMargin(),
          fadeOut(prompt, 250),
          fadeOut(cookieBar, 250));
      }),
      getURLParameter("scrolling"))
    ) {
      var scrollPos = document.body.getBoundingClientRect().top,
        scrolled = !1;
      window.addEventListener("scroll", function() {
        !1 === scrolled &&
          (document.body.getBoundingClientRect().top - scrollPos > 250 ||
            document.body.getBoundingClientRect().top - scrollPos < -250) &&
          (setCookie("cookiebar", "CookieAllowed"),
          clearBodyMargin(),
          fadeOut(prompt, 250),
          fadeOut(cookieBar, 250),
          (scrolled = !0),
          getURLParameter("refreshPage") && window.location.reload());
      });
    }
  }
}
document.addEventListener("DOMContentLoaded", function() {
  setupCookieBar();
});
