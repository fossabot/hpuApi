const {lib_request} = require('../request');

// 获取预约
// req.token
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/user/reservations',
    }, req['token']);

    
    if(ret.data.status==='success') {
        if(!ret.data.data) return { body: { code: -1004, msg: '你还没有任何预约' }};
        else return { body: { code: 0, ...ret.data.data }};
    }

    return { body: { code: -1002, msg: ret.data.message }};
}
