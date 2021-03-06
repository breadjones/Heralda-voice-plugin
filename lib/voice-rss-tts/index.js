﻿'use strict';

module.exports = {
    speech: speech
};

function speech(settings) {
    _validate(settings);
    _request(settings);
}

function _validate(settings) {
    if (settings && settings.callback) {
        if (!settings.apiKey) settings.callback('The API key is undefined', null);
        if (!settings.message) settings.callback('The text is undefined', null);
        if (!settings.language) settings.callback('The language is undefined', null);
    }
    else
        throw new Error('The settings are undefined');
}

function _request(settings) {
    var req = _buildRequest(settings);
    var request = require("request");

    request({
        url: ((settings.ssl) ? 'https' : 'http') + '://api.voicerss.org/',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        method: "POST",
        form: req,
        encoding: null
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (settings.callback) {
                if (error)
                    settings.callback(error, null);
                else if (body.indexOf('ERROR') == 0)
                    settings.callback(body, null);
                else
                    settings.callback(null, body);
            }
        }
    });
}

function _buildRequest(settings) {
    return {
        key: settings.apiKey,
        src: settings.message,
        hl: settings.language,
        r: settings.speakingSpeed,
        c: settings.codec,
        f: settings.format,
        ssml: settings.ssml,
        b64: settings.base64
    };
}
