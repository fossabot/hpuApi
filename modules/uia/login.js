const verifier = require('../../utils/verifier');
const {uia_request} = require('../request');
const qs = require('qs');
const tough = require('tough-cookie');
const uia_captcha = require('./captcha');
const { YunError } = require('../../utils/error');

// req.body.username req.body.password req.body.captcha_token? req.body.captcha?
module.exports = async function(req) {
    verifier(req, {t:'body', v:'username'}, {t:'body', v:'password'});

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
    if(!lt || !execution) throw new YunError();

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
    if(errmsg) throw new YunError(errmsg[1]);
    throw new YunError('未知错误，登录失败');
}