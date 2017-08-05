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
