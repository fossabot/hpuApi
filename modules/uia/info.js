const {uia_request} = require('../request');
const tough = require('tough-cookie');
const CONFIG = require('../../config')

// req.body.token
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

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
    
    if(!hasToken()) return {body: { code: -1001, msg: '未登录，可能token不正确?' }};
    ret = await uia_request({
        method: 'GET',
        uri: '/sso/apis/v2/me/profile?showInfo=true',
        withCredentials: true,
        jar: cookieJar
    });

    if(!ret.data.success || ret.data.entities.length < 1) return {body: { code: -1002, msg: ret.data['error'] }};

    return {body: { code: 0, ...ret.data.entities[0] }};;
}