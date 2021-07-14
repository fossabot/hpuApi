const {edu_request} = require('../request');
const qs = require('qs');
const {aes_encrypt, sha_encrypt} = require('../../utils/encrypt');

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

// req.token req.body.username req.body.password req.body.captcha
module.exports = async function(req) {
    if(!req || !req['token'] || !req['body'] || !req['body']['username'] || !req['body']['password'] || !req['body']['captcha']) return { body: { code: -1003, msg: '参数不完整' }};

    let ret = await edu_request({
        method: 'POST',
        uri: '/loginExt!getCodeFlag.action',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data: qs.stringify({'captcha_response': parseInt(req.body.captcha)})
    }, req['token']);

    if(ret.data.flag !== true) {
        return {
            body: {
              code: -2001,
              msg: '验证码错误！'
            }
        };
    }

    const keys = req['key'].split('|');
    if(keys.length < 2) return { body: { code: -1003, msg: '请提供正确的 req.key' }};
    

    console.log('Logining...', keys[0], keys[1], aes_encrypt(req.body.username, keys[0]), sha_encrypt(req.body.password, keys[1]));

    await sleep(1000);

    try {
        ret = await edu_request({
            method: 'POST',
            uri: `/loginExt.action`,
            data: qs.stringify({
                username: aes_encrypt(req.body.username, keys[0]),
                password: sha_encrypt(req.body.password, keys[1]),
                captcha_response: req.body.captcha,
                session_locale: 'zh_CN'
            })
        }, req['token']);
    } catch (error) {
        if(error.response.status===302) return {body: { code: 0 }};
    }
    let ret_msg = (/ui-icon ui-icon-alert.*\n *<span>(.*)<\/span>/).exec(ret.data);
    if(!ret_msg || ret_msg.length<2) return {body: { code: -1002, msg: '未知错误' }};
    return {body: { code: -1002, msg: ret_msg[1] }};
}