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
