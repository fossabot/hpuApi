const {lib_request} = require('../request');

// 预约历史
// req.token req.body.page? req.body.count?
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};
    if(!req['body']) req['body'] = {}
    
    // 兼容老版本语法
    let page = req.body.page;
    let count = req.body.count;
    
    if(!page) page=1;
    if(!count) count=10;

    ret = await lib_request({
        method: 'GET',
        uri: `/rest/v2/history/${page}/${count}`,
    }, req['token']);

    if(ret.data.status==='success') {
        if(ret.data.data.reservations.length===0) return { body: { code: -1004, msg: '你还没有任何历史' }};
        else return { body: { code: 0, ...ret.data.data }};
    }

    return { body: { code: -1002, msg: ret.data.message }};
}
