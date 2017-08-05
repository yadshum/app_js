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