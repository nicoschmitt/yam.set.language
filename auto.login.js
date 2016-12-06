require('dotenv').config({silent: true});
const request = require('request');
const nightmare = require('nightmare');

var url = 'https://www.yammer.com/api/v1/language';

let options = {
    locale_type: 'standard',
    locale: 'fr-FR',
    language_action: 'switch_language',
    access_token: '107-Fplhw59Z59SPPZ4hJK0Wg'
};

var clientid = process.env.YAMMER_CLIENT_ID;
var redirect = process.env.YAMMER_REDIRECT;

var authurl = `https://www.yammer.com/dialog/oauth?client_id=${clientid}&redirect_uri=${redirect}`;

let browser = nightmare({
    show: true,
    waitTimeout: 10*60*1000, // 10 min
    openDevTools: {
        mode: 'detach'
    },
})

browser
    .goto('https://www.yammer.com/office365')
    .wait(3 * 1000)
    .wait(function() {
        return window.location.hostname == 'www.yammer.com';
    })
    .then(() => {
        console.log("Auth ok.");
        return browser
                    .goto(authurl)
                    .wait(function() {
                        console.log(window.location);
                        return false;
                    })    

    })
    .then(result => {
        console.log(result)
    });
