const {edu_request} = require('../request')
const CONFIG = require('../../config')
const cv = require('opencv4nodejs-prebuilt')
const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const path = require('path')
const { AlreadyLoggedInError, YunError } = require('../../utils/error')

const captcha_len = 4;
const char_set = '0123456789';

async function recoCaptcha(img) {
    // if(!img) img = (await require('axios').get('http://192.168.136.1/captcha.php', {responseType: 'arraybuffer'})).data;
    
    let model;
    const g = require('../../utils/global_cache');
    if(g && g.tf_edu_model) model = g.tf_edu_model;
    else {
        console.warn('Unable to use cached model!');
        let relative = "tf-model/edu-captcha/model.json";
        console.log('Model path:', relative, ', img:', img);
        if(!fs.existsSync(relative)) relative = path.join('/opt', relative); // 云函数分层
        const handler = tf.io.fileSystem(relative);
        model = await tf.loadGraphModel(handler);
        if(g) g.tf_edu_model = model;
    }

    const mat = cv.imdecode(img, cv.IMREAD_COLOR).cvtColor(cv.COLOR_BGR2GRAY);

    const tensor_img = tf.tensor(new Uint8Array(mat.getData()), [1, 90*35], 'float32').div(255);
    const chars = model.predict([tensor_img, tf.scalar(1, 'float32')]).reshape([-1, captcha_len, char_set.length]);
    return tf.argMax(chars, 2).dataSync().join('');
}

// req.token?
module.exports = async function(req) {

    let ret;
    try {
        ret = await edu_request({
            method: 'GET',
            uri: '/loginExt.action'
        }, req.token);
    } catch (error) {
        if(error.response && error.response.status===302) throw new AlreadyLoggedInError();
        throw new YunError(error.message);
    }

    const aesKey = (/encrypt\(username,'([0-9a-z]*)'\)/).exec(ret.data);
    const shaKey = (/CryptoJS\.SHA1\('([0-9a-z\-]*)'/).exec(ret.data);
    let token = /JSESSIONID=([0-9a-zA-Z]*);/.exec(ret.headers['set-cookie']);

    if((!token && !req.token) || !shaKey || !aesKey) throw new YunError('未知错误, 可能服务器满载, 请稍候再试');
    
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
    
    let resp = {
        body: {
            code: 0,
            img: ret.data.toString('base64'),
            token: token[1],
            key: `${aesKey[1]}|${shaKey[1]}`
        }
    };

    if(req.query && req.query.r == 'true') resp.body.captcha = await recoCaptcha(ret.data);
    return resp;
}