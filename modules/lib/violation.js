const {lib_request} = require('../request');

// 违约信息
// req.token
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/violations',
        params: {token: req['token']}
    }, req['token']);

    if(ret.data.status) {
        if(ret.data.data.length===0) return { body: { code: -1004, msg: '你没有任何违约' }};
        else return { body: { code: 0, ...ret.data.data }};
    }

    return { body: { code: -1002, msg: ret.data.message }};
}