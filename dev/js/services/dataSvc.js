'use strict';
module.exports = class DataSvc {
    static getWeatherData(urlRequest) {
        return fetch(urlRequest).then((response) => {
                const res = response.json();
        return res;
    });
    }
};