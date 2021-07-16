const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 取消预约 id:预约id
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'}, {t:'body', v:'id', c:'num'});

    ret = await lib_request({
        method: 'GET',
        uri: `/rest/v2/cancel/${req['body']['id']}`,
    }, req['token']);

    return { body: { code: 0 }}
}
