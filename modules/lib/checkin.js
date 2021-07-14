const {lib_request} = require('../request');

// 签到
// req.token
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/checkIn',
    }, req['token']);

    if(ret.data.status==='success') return { body: { code: 0, ...ret.data.data }}
    return { body: { code: -1002, msg: ret.data.message }}
}