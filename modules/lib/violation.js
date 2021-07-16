const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 违约信息
// req.token
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/violations',
        params: {token: req['token']}
    }, req['token']);

    return { body: { code: 0, ...ret.data.data }};
}