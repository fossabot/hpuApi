const verifier = require('../../utils/verifier');
const {uia_request} = require('../request');
const tough = require('tough-cookie');
const CONFIG = require('../../config');
const { NotLoggedInError, YunError } = require('../../utils/error');

// req.body.token
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    let cookieJar = new tough.CookieJar();
    cookieJar.setCookieSync(`CASTGC=${req.token}`, `${CONFIG.uia.url}/cas`);

    ret = await uia_request({
        method: 'GET',
        uri: '/sso/user',
        withCredentials: true,
        jar: cookieJar,
        maxRedirects: 5
    });
    
    function hasToken() {
        const cookies = cookieJar.getCookiesSync(`${CONFIG.uia.url}/sso`);
        for (const item of cookies) {
            if(item.key==='LOGIN_TOKEN') return true;
        }
        return false;
    }
    
    if(!hasToken()) throw NotLoggedInError('未登录，可能token不正确?');
    ret = await uia_request({
        method: 'GET',
        uri: '/sso/apis/v2/me/profile?showInfo=true',
        withCredentials: true,
        jar: cookieJar
    });

    if(!ret.data.success || ret.data.entities.length < 1) throw new YunError(ret.data['error']);

    return {body: { code: 0, ...ret.data.entities[0] }};;
}