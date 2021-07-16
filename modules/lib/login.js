const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// req.body.username req.body.password
module.exports = async function(req) {
    verifier(req, {t:'body', v:'username'}, {t:'body', v:'password'});


    ret = await lib_request({
        method: 'GET',
        uri: '/rest/auth',
        params: {username: req['body']['username'], password: req['body']['password']},
    });

    return { body: { code: 0, token: ret.data.data.token }};
}