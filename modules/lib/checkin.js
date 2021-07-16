const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 签到
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/checkIn',
    }, req['token']);

    return { body: { code: 0, ...ret.data.data }};
}