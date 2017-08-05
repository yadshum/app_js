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

