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