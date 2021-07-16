const { NotLoggedInError } = require('../../utils/error');
const verifier = require('../../utils/verifier');
const {ybk_request} = require('../request');

module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    ret = await ybk_request({
        method: 'GET',
        uri: '/users/my-profile',
        core_api: true
    }, req['token']);

    if(!ret.data.status) throw new NotLoggedInError(ret.data.result_msg);
    return { body: { code: 0, ...ret.data.user}}
}
