// dom load event handler
document.addEventListener("DOMContentLoaded", function (event) {
  console.log("dom loaded");

  var DOM = document;
  var weatherUrl = "https://api.wunderground.com/api/adb4818b109b517d/conditions/q/";

  // find element by id
  var findId = function (id) {
    return DOM.getElementById(id);
  };

  var weatherHtml = findId("weather-data");
  var weatherBox = findId("weather-box");

  // weather object
  var weather = {};

  // set position and get weather data
  var setPosition = function (pos) {
    weatherUrl += pos.coords.latitude + "," + pos.coords.longitude + ".json";
    fetchData(weatherUrl);
  };

  // get weather data
  var fetchData = function (url) {
    $_AJAX.get(url, function (response) {
      setWeather(response);
    });
  };

  // set weather icon.
  var setWeatherIcon = function (icon, alt) {
    weather.icon = "<img src='" + icon + "' alt='" + alt + "'>";
  };

  // set weather from the weather api
  var setWeather = function (data) {
    curr = data.current_observation;
    weather.country = curr.display_location.country;
    weather.city = curr.display_location.city;
    weather.conditions = curr.weather;
    weather.temp = curr.temp_c;
    weather.icon_src = curr.icon_url;
    setWeatherIcon(curr.icon_url, weather.conditions);

    renderHtml();
  };

  // render HTML
  var renderHtml = function () {
    var html = weatherHtml.outerHTML;

    html = replaceText("location", html, weather.city + ", " + weather.country);
    html = replaceText("temp", html, convertTemp(weather.temp));
    html = replaceText("icon", html, weather.icon);
    html = replaceText("conditions", html, weather.conditions);

    weatherBox.innerHTML = html;

    findId("main").style.backgroundImage = "url(" + weather.icon_src + ")";

    findId("temp-c").addEventListener("click", tempToC);
    findId("temp-f").addEventListener("click", tempToF);
  };

  // replace text in html with supplied text.
  var replaceText = function (hook, html, text) {
    var toReplace = "{{" + hook + "}}";
    return html.replace(new RegExp(toReplace, "g"), text);
  };

  // convert temperature
  var convertTemp = function (temp, format) {
    switch (format) {
      case "F":
        return Math.ceil(temp * 1.8 + 32);
      default:
        return Math.ceil(temp);
    }
  };

  // set temp to C in the view
  var tempToC = function () {
    findId("temp").innerHTML = convertTemp(weather.temp);
    findId("temp-f").setAttribute("class", "");
    this.setAttribute("class", "active");
  };

  // set temp to F in the view.
  var tempToF = function () {
    findId("temp").innerHTML = convertTemp(weather.temp, "F");
    findId("temp-c").setAttribute("class", "");
    this.setAttribute("class", "active");
  };

  // self exec. Get coordinates. do some magical stuff.
  (function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      console.log("Location error");
    }
  })();

});
