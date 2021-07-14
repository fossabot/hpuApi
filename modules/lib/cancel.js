const {lib_request} = require('../request');

// 取消预约 id:预约id
// req.token req.body.id
module.exports = async function(req) {
    if(!req || !req['token'] || !req['body'] || !req['body']['id']) return { body: { code: -1003, msg: '参数不完整' }};

    try {
        ret = await lib_request({
            method: 'GET',
            uri: `/rest/v2/cancel/${req['body']['id']}`,
        }, req['token']);
    
        if(ret.data.status==='success') return { body: { code: 0 }}
    } catch (error) {
        return { body: { code: -1002, msg: error.message }}
    }

    return { body: { code: -1002, msg: ret.data.message }}
}
