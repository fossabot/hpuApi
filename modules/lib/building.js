const { YunError } = require('../../utils/error');
const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'}, {t:'body', v:'building', c:'num'});

    ret = await lib_request({
        method: 'GET',
        uri: `/rest/v2/room/stats2/${req['body']['building']}`,
    }, req['token']);

    return { body: { code: 0, buildings: ret.data.data }};
}