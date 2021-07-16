const { NotLoggedInError } = require('../../utils/error');
const verifier = require('../../utils/verifier');
const {ybk_request} = require('../request');

module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    ret = await ybk_request({
        uri: '/cc/list_joined'
    }, req['token']);

    if(ret.data.result_code!==0) throw new NotLoggedInError(ret.data.result_msg);
    return { body: { code: 0, ...ret.data}}
}
