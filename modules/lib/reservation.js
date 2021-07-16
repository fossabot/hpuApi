const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 获取预约
// req.token
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/user/reservations',
    }, req['token']);

    
    return { body: { code: 0, reservations: ret.data.data }};
}
