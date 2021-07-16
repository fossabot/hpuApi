const { YunError } = require('../../utils/error');
const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');
const uia_login = require('../uia/login');

// 本函数返回的token即jsessionid
// req.body.username req.body.password req.captcha_token? req.body.captcha?
module.exports = async function(req) {
    verifier(req, {t:'body', v:'username'}, {t:'body', v:'password'});

    req.body['service'] = 'http://seatlib.hpu.edu.cn/cas';
    let ret = await uia_login(req);
    if(ret.body.code) return ret;

    try {
        ret = await lib_request({
            method: 'GET',
            uri: '/cas',
            params: { ticket: ret.body.ticket }
        });
    } catch (error) {
        if(error.response && error.response.status===302) {
            const token = /JSESSIONID=([A-Z0-9]+)/.exec(error.response.headers['set-cookie']);
            return { body: { code: 0, token: token[1] }};
        }
        throw new YunError(error.message);
    }

    throw new YunError('未知错误');
}