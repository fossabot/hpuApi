const verifier = require('../../utils/verifier');
const {ybk_request} = require('../request');
const qs = require('qs');
const { YunError } = require('../../utils/error');

// req.body.username req.body.password
module.exports = async function(req) {
    verifier(req, {t:'body', v:'username'}, {t:'body', v:'password'});

    ret = await ybk_request({
        uri: '/passport/login',
        data: {'account_name': req['body']['username'], 'app_id': 'MTANDROID', 'app_version_name': '5.3.2',
        'app_version_number': '129',
        'device_type': 'ANDROID', 'dpr': '2.0',
        'system_version': '10.0.0', 'user_pwd': req['body']['password']},
    });

    if(ret.data.result_code!==0) throw new YunError(ret.data.result_msg);

    return { body: { code: 0, ...ret.data, token: qs.stringify({uid: ret.data.user.user_id, secretID: ret.data.user.access_id, secret: ret.data.user.access_secret, lastTime: ret.data.user.last_sec_update_ts_s}) }}
}