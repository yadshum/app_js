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

