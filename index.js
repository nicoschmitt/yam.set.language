require('dotenv').config({silent: true});

const Promise = require("bluebird");
let request = require('request');

let clientid = process.env.YAMMER_CLIENT_ID;
let useremail = process.env.USER_EMAIL;

request = request.defaults({
    auth: {
        bearer: process.env.YAMMER_ACCESS_TOKEN
    },
    json: true
});

Promise.promisifyAll(request);

request.getAsync(`https://www.yammer.com/api/v1/users/by_email.json?email=${useremail}`)
.then(response => {
    let user = response.body[0];
    return user.id;
}).then(id => {
    return request.getAsync(`https://www.yammer.com/api/v1/oauth/tokens.json?consumer_key=${clientid}&user_id=${id}`);
}).then(response => {
    let auth = response.body[0];
    return auth.token;
}).then(token => {
    let changeLang = {
        locale_type: 'standard',
        locale: 'fr-FR',
        language_action: 'switch_language',
        access_token: token
    };
    return request.postAsync({
        url: 'https://www.yammer.com/api/v1/language', 
        form: changeLang,
        auth: {
            bearer: token
        }
    });
}).then(() => {
    console.log("done.");
});
