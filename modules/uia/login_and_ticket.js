const verifier = require('../../utils/verifier');
const {uia_request} = require('../request');
const qs = require('qs');
const tough = require('tough-cookie');
const uia_captcha = require('./captcha');
const CONFIG = require('../../config');
const { YunError } = require('../../utils/error');

// serviceEg: 'http://seatlib.hpu.edu.cn/cas' 'https://webvpn.hpu.edu.cn/Cas/login.html'
// req.body.username req.body.password req.body.service req.body.captcha_token? req.body.captcha?
module.exports = async function(req) {
    verifier(req, {t:'body', v:'username'}, {t:'body', v:'password'}, {t:'body', v:'service'});

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
        params: {service: req['body']['service']},
        jar: cookieJar
    });

    const lt = /name="lt".*value="(.*)"/.exec(ret.data), execution = /name="execution".*value="(.*)"/.exec(ret.data);
    if(!lt || !execution) throw new YunError('未知错误');

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

    let now_url;
    while (true) {
        try {
            let config;
            if(!now_url) config = {
                method: 'POST',
                uri: '/cas/login',
                data: qs.stringify(post_data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true,
                jar: cookieJar,
            };
            else config = {
                method: 'GET',
                url: now_url,
                withCredentials: true,
                jar: cookieJar,
            }
            ret = await uia_request(config);
        } catch (err) {
            if(err.response && err.response.status===302 && err.response.headers.location) {
                now_url = err.response.headers.location;
                console.log('302: ', now_url);

                if(now_url.indexOf(CONFIG.uia.url)!=-1) continue;

                const ticket = /ticket=(ST-[A-Za-z0-9\.\-]+)/.exec(now_url);
                if(ticket) return {body: { code: 0, ticket: ticket[1] }};
                continue;
            }
            console.log(err);
            throw new YunError(err.message);
        }
        break;
    }
    const errmsg = /errormes.*value="(.*)"/.exec(ret.data);
    if(errmsg) throw new YunError(errmsg[1]);
    throw new YunError('暂不支持此服务登录');
}