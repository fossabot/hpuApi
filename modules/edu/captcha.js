const {edu_request} = require('../request')
const CONFIG = require('../../config')

// req.token?
module.exports = async function(req) {
    if(!req) req={};

    let ret;
    try {
        ret = await edu_request({
            method: 'GET',
            uri: '/loginExt.action'
        }, req.token);
    } catch (error) {
        if(error.response && error.response.status===302) return { body: { code: -2000, msg: '您已经登录' }};
        return { body: { code: -1002, msg: error.message }}
    }

    const aesKey = (/encrypt\(username,'([0-9a-z]*)'\)/).exec(ret.data);
    const shaKey = (/CryptoJS\.SHA1\('([0-9a-z\-]*)'/).exec(ret.data);
    let token = /JSESSIONID=([0-9a-zA-Z]*);/.exec(ret.headers['set-cookie']);

    if((!token && !req.token) || !shaKey || !aesKey) return { body: { code: -1002, msg: '未知错误, 可能服务器满载, 请稍候再试' }};
    
    if(!token) token = [0, req.token];
    ret = await edu_request({
        method: 'GET',
        uri: '/captcha/image.action',
        headers: {'Referer': `${CONFIG.edu.url}/loginExt.action`},
        responseType: 'arraybuffer',
        params: {
            'd': new Date().getTime()
        }
    }, token[1]);
    
    return {
        body: {
            code: 0,
            img: ret.data.toString('base64'),
            token: token[1],
            key: `${aesKey[1]}|${shaKey[1]}`
        }
    }
}