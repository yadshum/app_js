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

