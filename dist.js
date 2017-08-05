(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Builder = require('./../utils/builder');
var MapCtrl = require('./../controllers/mapCtrl');

module.exports = class cityView {
    static requestCityWeather(data) {
        const {
            name: cityName,
            sys: {country, sunrise, sunset},
            coord: {lat, lon},
            weather: [item],
            wind: {speed},
            main: {humidity, pressure, temp},
        } = data;

        const contentBlock = document.getElementsByClassName('container')[0];
        contentBlock.innerHTML = '';

        const templateHTML = Builder.html`
      <a href="#" class="page-reload">Reload</a>
      <h3>City of ${cityName}, ${country}
      <br>${temp} &deg;C
      <br>${item.main}</h3>
      <div id="map-canvas" class="city-view"></div>
        
      <table class="table table-striped table-bordered table-condensed">
        <tbody>
        <tr>
          <td>Wind Speed</td>
          <td>${speed} m/s</td>
        </tr>
        <tr>
          <td>${item.main}</td>
          <td>${item.description}</td>
        </tr>
        <tr>
          <td>Pressure<br></td>
          <td>${pressure} hpa</td>
        </tr>
        <tr>
          <td>Humidity</td>
          <td>${humidity} %</td>
        </tr>
        <tr>
          <td>Sunrise</td>
          <td id="sunrise">${new Date(sunrise * 1000).toLocaleTimeString()}</td>
        </tr>
        <tr>
          <td>Sunset</td>
          <td id="sunset">${new Date(sunset * 1000).toLocaleTimeString()}</td>
        </tr>
        <tr>
          <td>Geo coords</td>
          <td id="coord">
            <a href="#">[ ${lat}, ${lon} ]</a>
          </td>
        </tr>
        </tbody>
      </table>`;
        contentBlock.innerHTML = templateHTML;

        console.log(data);

        MapCtrl.drawMap(data);
    }
};

},{"./../controllers/mapCtrl":4,"./../utils/builder":9}],2:[function(require,module,exports){
'use strict';
var Builder = require('./../utils/builder');
var Router = require('./../utils/router');

module.exports = class tableView {
    static buildNearByViewHTML(data) {
        const contentBlock = document.getElementsByClassName('container')[0];
        const listContainer = document.createElement('ul');
        listContainer.className = 'response-list';
        contentBlock.innerHTML = '';

        data.list.forEach((city) => {
            const { name: cityName, coord: { lon, lat }, weather: [item] } = city;
        const iconURL = `http://openweathermap.org/img/w/${item.icon}.png`;

        const templateCityHTML = Builder.html`
          <li class="cite-item" data-city="${cityName}">
            <p>City: ${cityName}</p>
            <figure>
                <img src="${iconURL}">
                <figcaption>${item.description}</figcaption>
            </figure>
            <p>Geo coords: [ ${lat}, ${lon} ]</p>
          </li>`;
        listContainer.innerHTML += templateCityHTML;
    });

        contentBlock.appendChild(listContainer);

        listContainer.addEventListener('click', (e) => {
            const target = {
                name: e.target.closest('li').getAttribute('data-city'),
            };
        Router.nav('/#city', target.name);
    }, false);
    }
};


},{"./../utils/builder":9,"./../utils/router":10}],3:[function(require,module,exports){
'use strict';
const Constants = exports.Constants = Object.freeze({
    ConfigURL: {
        API_KEY: '335bb1b45deafd9ab8e062c10f9923a3',
        //API_KEY: 'ed47b729a27dad26e89285d4b2bc2c51',
    },
    GoogleConfigURL: {
        API_KEY: 'AIzaSyDXd55IiGPpQX1J-xd1r7_njwrKPDz1-sg',
        //API_KEY: '445101e6e02d63bb67152a6274056d9b',
    },
});

//exports.default = Constants;
module.exports = Constants;
},{}],4:[function(require,module,exports){
'use strict';
var MapSvc = require('./../services/mapSvc');

module.exports = class MapCtrl {
    static drawMap(data) {
        const mapOptions = {
            zoom: 12,
            center: { lat: data ? data.coord.lat : 50, lng: data ? data.coord.lon : -50 },
        };
        const weatherMarker = data.weather ? `http://openweathermap.org/img/w/${data.weather[0].icon}.png` : false;
        const googleMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        if (weatherMarker) {
            const currentWeatherMarker = new google.maps.Marker({
                position: mapOptions.center,
                map: googleMap,
                icon: weatherMarker,
            });
        }
        return googleMap;
    }

    static mapInitialisation(data, location) {
        const geoJSON = {
            type: 'FeatureCollection',
            features: [],
        };
        const map = MapCtrl.drawMap(location);

        // Add the markers to the map
        function drawIcons() {
            map.data.addGeoJson(geoJSON);
        }

        // For each result that comes back, convert the data to geoJSON
        function jsonToGeoJson(weatherItem) {
            const jsonData = MapSvc.jsonToGeoJson(weatherItem);

            // Set the custom marker icon
            map.data.setStyle((jsonData) => {
                const icon = {
                    icon: {
                        url: jsonData.getProperty('icon'),
                        anchor: new google.maps.Point(25, 25),
                    },
                };
            return icon;
        });

            return jsonData;
        }

        for (let i = 0; i < data.list.length; i++) {
            geoJSON.features.push(jsonToGeoJson(data.list[i]));
        }
        drawIcons(geoJSON);

        const infowindow = new google.maps.InfoWindow();

        // Sets up and populates the info window with details
        map.data.addListener('click', (event) => {
            infowindow.setContent(
            `<div class="popover"><img src="${event.feature.getProperty('icon')}">
          <br /><strong>${event.feature.getProperty('city')}</strong>
          <br />${event.feature.getProperty('temperature')}&deg;C
          <br />${event.feature.getProperty('weather')}</div>`
        );
        infowindow.setOptions({
            position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
            pixelOffset: {
                width: 0,
                height: -15,
            },
        });
        infowindow.open(map);
    });
    }
};

},{"./../services/mapSvc":8}],5:[function(require,module,exports){
'use strict';
//var styles = require('./../styles/main.less');
var Router = require('./utils/router');

window.onclick = (e) => {
    if (e.target.tagName === 'a') {
        e.stopPropagation();
        const attr = e.target.getAttribute('href');
        Router.nav(attr);
    } else {
        e.stopPropagation();
        console.log('Not click');
    }
};

function locationHashChanged() {
    Router.nav(location.hash === '' ? '/#' : location.hash);
}

window.onhashchange = locationHashChanged;

/* ************************** */
/* ***** Initialisation ***** */
/* ************************** */
Router.init();
Router.nav('/#');
},{"./utils/router":10}],6:[function(require,module,exports){
'use strict';
module.exports = class DataSvc {
    static getWeatherData(urlRequest) {
        return fetch(urlRequest).then((response) => {
                const res = response.json();
        return res;
    });
    }
};
},{}],7:[function(require,module,exports){
'use strict';
var DataSvc = require('./dataSvc');
var Utils = require('./../utils/utils');

module.exports = class geolocationSvc {

    static checkGeo(cb, cityName) {
        const successNavigation = function success(position) {
            let geoOtpions = {};
            if (!cityName) {
                geoOtpions = {
                    coord: {
                        lon: position.coords.longitude,
                        lat: position.coords.latitude,
                    },
                    cnt: 10,
                };
            } else {
                geoOtpions = {
                    name: cityName,
                };
            }

            DataSvc.getWeatherData(Utils.generateURL(geoOtpions)).then((data) => {
                cb(data, geoOtpions);
        }).catch((err) => {
                console.error(`[getWeatherData] error, reason: ${err}`);
        });
        };

        const errorNavigation = function error() {
            // contentBlock.innerHTML = '<p>Unable to retrieve your location</p>';
        };

        const locationFind = function init() {
            if (!navigator.geolocation) {
                // contentBlock.innerHTML = '<p>Geolocation is not supported by your browser</p>';
                return;
            }
            navigator.geolocation.getCurrentPosition(successNavigation, errorNavigation);
        };

        /* ************************** */
        /* **** Init geolocation **** */
        /* ************************** */
        locationFind();
    }
};


},{"./../utils/utils":11,"./dataSvc":6}],8:[function(require,module,exports){
'use strict';
module.exports = class MapSvc {

    static jsonToGeoJson(weatherItem) {
        const feature = {
            type: 'Feature',
            properties: {
                city: weatherItem.name,
                weather: weatherItem.weather[0].main,
                temperature: weatherItem.main.temp,
                min: weatherItem.main.temp_min,
                max: weatherItem.main.temp_max,
                humidity: weatherItem.main.humidity,
                pressure: weatherItem.main.pressure,
                windSpeed: weatherItem.wind.speed,
                windDegrees: weatherItem.wind.deg,
                windGust: weatherItem.wind.gust,
                icon: `http://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png`,
                coordinates: [weatherItem.coord.lon, weatherItem.coord.lat],
            },
            geometry: {
                type: 'Point',
                coordinates: [weatherItem.coord.lon, weatherItem.coord.lat],
            },
        };

        return feature;
    }

};

},{}],9:[function(require,module,exports){
'use strict';
var Utils = require('./utils');

//extends Utils

module.exports = class Builder {
    static html(pieces, ...rest) {
        let result = pieces[0];
        const substitutions = rest;
        for (let i = 0; i < substitutions.length; ++i) {
            result += Utils.escape(substitutions[i]) + pieces[i + 1];
        }
        return result;
    }
};
},{"./utils":11}],10:[function(require,module,exports){
'use strict';
var MapCtrl = require('./../controllers/mapCtrl');
var TableView = require('./../components/tableView');
var CityView = require('./../components/cityView');
var GeovocationSnc = require('./../services/geolocationSvc');

const routes = {
    '/#': 'indexView',
    '/#city': 'cityView',
    '/#map': 'mapView',
};

const _routes = [];

module.exports = class Router {
    static init() {
        Object.keys(routes).forEach((route) => {
            if ({}.hasOwnProperty.call(routes, route)) {
                const methodName = routes[route];
                _routes.push({
                    pattern: new RegExp(`${route}+$`),
                    callback: Router[methodName],
                });
            }
        });
    }

    static nav(path, arg) {
        document.location.href = arg ? `${document.location.origin}${path}/${arg}` : `${document.location.origin}${path}`;
        const cityName = arg;

        _routes.some((route) => {
            const args = path.match(route.pattern);
            if (args) {
                return route.callback.call(this, cityName);
            }
            return false;
        });
    }

    static indexView() {
        GeovocationSnc.checkGeo(TableView.buildNearByViewHTML);
        console.log('INDEX');
    }

    static cityView(cityName) {
        GeovocationSnc.checkGeo(CityView.requestCityWeather, cityName);
        console.log('CITY');
    }

    static mapView() {
        const contentBlock = document.getElementsByClassName('container')[0];
        contentBlock.innerHTML = '';

        const mapViewContainer = document.createElement('div');
        mapViewContainer.id = 'map-canvas';
        mapViewContainer.className = 'map-view';
        contentBlock.appendChild(mapViewContainer);


        GeovocationSnc.checkGeo(MapCtrl.mapInitialisation);
        console.log('MAP');
    }
};


},{"./../components/cityView":1,"./../components/tableView":2,"./../controllers/mapCtrl":4,"./../services/geolocationSvc":7}],11:[function(require,module,exports){
'use strict';
var Constants = require('../config/config');

const reEscape = /[&<>'"]/g;
const reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
const oEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
};
const oUnescape = {
    '&amp;': '&',
    '&#38;': '&',
    '&lt;': '<',
    '&#60;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&apos;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&#34;': '"',
};
const replace = String.prototype.replace;

module.exports = class Utils {
    static escape(s) {
        return replace.call(s, reEscape, m => oEscape[m]);
    }

    static unescape(s) {
        return replace.call(s, reUnescape, m => oUnescape[m]);
    }

    static generateURL(data) {
        if (data.name) {
            const { name: city } = data;
            return `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Constants.ConfigURL.API_KEY}&units=metric`;
        }

        const { coord: { lon, lat }, cnt: numberOfCities } = data;
        return `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}cnt=${numberOfCities}&appid=${Constants.ConfigURL.API_KEY}`;
    }
};
},{"../config/config":3}]},{},[5])
