const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const CONFIG = require('../config')
const generateSig = require('../utils/ybk_signature')

axiosCookieJarSupport(axios);

function edu_request(axios_setting, session_id) {
    if('uri' in axios_setting) {
        axios_setting['url'] = CONFIG.edu.url + axios_setting['uri'];
        delete axios_setting['uri'];
    }
    if(axios_setting.headers == undefined) axios_setting['headers'] = {};
    Object.assign(axios_setting.headers, CONFIG.edu.headers);

    const auth_cookie = `JSESSIONID=${session_id}; GSESSIONID=${session_id}; SVRNAME=xk1`;
    if(axios_setting.headers['Cookie'] != undefined && session_id) axios_setting.headers['Cookie'] += '; ' + auth_cookie;
    else if(session_id) axios_setting.headers['Cookie'] = auth_cookie;

    for (const header of Object.keys(axios_setting['headers'])) {
        axios_setting['headers'][header] = axios_setting['headers'][header].replace(/\$host\$/g, CONFIG.edu.url);
    }

    return axios({
        // proxy: {
        //     host: '127.0.0.1',
        //     port: 8080
        // },
        maxRedirects: 0,
        timeout: 3000,
        ...axios_setting
    });
}

function uia_request(axios_setting) {
    if('uri' in axios_setting) {
        axios_setting['url'] = CONFIG.uia.url + axios_setting['uri'];
        delete axios_setting['uri'];
    }
    if(axios_setting.headers == undefined) axios_setting['headers'] = {};
    Object.assign(axios_setting.headers, CONFIG.uia.headers);

    if(!axios_setting['maxRedirects']) axios_setting['maxRedirects'] = 0;
    
    return axios({
        ...axios_setting
    });
}

function lib_request(axios_setting, token) {
    if('uri' in axios_setting) {
        axios_setting['url'] = CONFIG.lib.url + axios_setting['uri'];
        delete axios_setting['uri'];
    }
    if(axios_setting.headers == undefined) axios_setting['headers'] = {};
    Object.assign(axios_setting.headers, CONFIG.lib.headers);

    if(token) axios_setting['headers']['token'] = token;
    
    return axios({
        maxRedirects: 0,
        ...axios_setting
    });
}

// token = {
//     uid: '********-****-****-****-************',
//     secretID: 'ugmwM***********',
//     secret: 'gB5N-Qz1********',
//     lastTime: 1614******
// }

function ybk_request(axios_setting, token) {
    if('uri' in axios_setting) axios_setting['url'] = (axios_setting['core_api']? CONFIG.ybk.core_url : CONFIG.ybk.url) + axios_setting['uri'];
    if(axios_setting.headers == undefined) axios_setting['headers'] = {};
    if(axios_setting.method == undefined) axios_setting['method'] = 'POST';
    Object.assign(axios_setting.headers, CONFIG.ybk.headers);
    
    if(axios_setting['core_api']) axios_setting['headers']['X-signature'] = generateSig(token, axios_setting, true);
    else axios_setting['headers']['X-mssvc-signature'] = generateSig(token, axios_setting);

    delete axios_setting['uri'];
    delete axios_setting['core_api'];
    console.log(axios_setting);
    return axios({
        maxRedirects: 0,
        ...axios_setting
    });
}

module.exports = { edu_request, uia_request, lib_request, ybk_request }