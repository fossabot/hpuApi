const {lib_request} = require('../request');
const uia_login = require('../uia/login');

// 本函数返回的token即jsessionid
// req.body.username req.body.password req.captcha_token? req.body.captcha?
module.exports = async function(req) {
    if(!req || !req['body'] || !req['body']['username'] || !req['body']['password']) return { body: { code: -1003, msg: '参数不完整' }};

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
        return { body: { code: -1002, msg: error.message }}
    }

    return { body: { code: -1002, msg: '未知错误' }}
}