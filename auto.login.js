require('dotenv').config({silent: true});

const request = require('request');
const nightmare = require('nightmare');
const qs = require('querystring');
const Promise = require('bluebird');

Promise.promisifyAll(request);

var clientId = process.env.YAMMER_CLIENT_ID;
let clientSecret = process.env.YAMMER_CLIENT_SECRET;
var redirect = process.env.YAMMER_REDIRECT;

var authurl = `https://www.yammer.com/dialog/oauth?client_id=${clientId}&redirect_uri=${redirect}`;

let browser = nightmare({
    show: true,
    waitTimeout: 10*60*1000, // 10 min
    // openDevTools: {
    //     mode: 'detach'
    // },
})

browser
    .goto('https://www.yammer.com/office365')
    .wait(3 * 1000)
    .wait(function() {
        return window.location.hostname == 'www.yammer.com';
    })
    .then(() => {
        return browser
                    .goto(authurl)
                    .wait(function(waitFor) {
                        return window.location.href.startsWith(waitFor);
                    }, process.env.YAMMER_REDIRECT)
                    .evaluate(function() {
                        return window.location.search;
                    })
                    .end()

    })
    .then(result => {
        let authcode = qs.parse(result.substring(1)).code;
        var authUrl = `https://www.yammer.com/oauth2/access_token.json?client_id=${clientId}&client_secret=${clientSecret}&code=${authcode}`;

        return request.getAsync(authUrl, { json: true });
    }).then(result => {
        console.log(result.body.access_token.token);
    })
