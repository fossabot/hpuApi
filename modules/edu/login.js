const verifier = require('../../utils/verifier')
const {edu_request} = require('../request')
const qs = require('qs')
const {aes_encrypt, sha_encrypt} = require('../../utils/encrypt')
const { InvalidInputError, YunError } = require('../../utils/error')

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

module.exports = async function(req) {
    verifier(req, {t:'body', v:'username'}, {t:'body', v:'password'}, {t:'body', v:'captcha'});

    let ret = await edu_request({
        method: 'POST',
        uri: '/loginExt!getCodeFlag.action',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data: qs.stringify({'captcha_response': parseInt(req.body.captcha)})
    }, req['token']);

    if(ret.data.flag !== true) throw new InvalidInputError('验证码错误！');

    const keys = req['key'].split('|');
    if(keys.length < 2) throw new InvalidInputError('请提供正确的 req.key');
    

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
    if(!ret_msg || ret_msg.length<2) throw new YunError('未知错误！');
    throw new YunError(ret_msg[1]);
}