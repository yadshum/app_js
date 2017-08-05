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