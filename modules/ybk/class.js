const {ybk_request} = require('../request');

// req.token
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await ybk_request({
        uri: '/cc/list_joined'
    }, req['token']);

    if(ret.data.result_code!==0) return { body: { code: -1001, msg: ret.data.result_msg }};
    return { body: { code: 0, ...ret.data}}
}
