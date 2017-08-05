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
