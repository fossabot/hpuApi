const {uia_request} = require('../request');
const qs = require('qs');
const tough = require('tough-cookie');
const uia_captcha = require('./captcha');
const CONFIG = require('../../config')

// req.body.username req.body.password req.body.captcha_token? req.body.captcha?
module.exports = async function(req) {
    if(!req || !req['body'] || !req['body']['username'] || !req['body']['password']) return { body: { code: -1003, msg: '参数不完整' }};

    let token, captcha;
    if(!req.body.captcha_token || !req.body.captcha) {
        const ret = await uia_captcha();
        if(ret.body.code) return ret;

        token = ret.body.token;
        captcha = ret.body.captcha;
        console.log('autoLogining with captcha:', captcha, 'token:', token);
    } else {
        token = req.body.captcha_token;
        captcha = req.body.captcha;
    }

    let cookieJar = new tough.CookieJar();
    let ret = await uia_request({
        method: 'GET',
        uri: '/cas/login',
        jar: cookieJar
    });

    const lt = /name="lt".*value="(.*)"/.exec(ret.data), execution = /name="execution".*value="(.*)"/.exec(ret.data);
    if(!lt || !execution) return {body: { code: -1002, msg: '未知错误' }};

    const post_data = {
        'username': req['body']['username'],
        'password': req['body']['password'],
        'captcha': captcha,
        '_eventId': 'submit',
        'lt': lt[1],
        'source': 'cas',
        'execution': execution[1],
        'token': token
    };

    ret = await uia_request({
        method: 'POST',
        uri: '/cas/login',
        data: qs.stringify(post_data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true,
        jar: cookieJar,
    });
    
    token = /CASTGC=(TGT-[A-Za-z0-9\.\-]+)/.exec(ret.headers['set-cookie']);
    if(token) return {body: { code: 0, token: token[1] }};

    const errmsg = /errormes.*value="(.*)"/.exec(ret.data);
    if(errmsg) return {body: { code: -1002, msg: errmsg[1] }};
    return {body: { code: -1002, msg: '未知错误，登录失败' }};
}