const {ybk_request} = require('../request');

// req.token
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await ybk_request({
        method: 'GET',
        uri: '/users/my-profile',
        core_api: true
    }, req['token']);

    if(!ret.data.status) return { body: { code: -1001, msg: ret.data.result_msg }};
    return { body: { code: 0, ...ret.data.user}}
}
