const {lib_request} = require('../request');

// req.token req.body.building
module.exports = async function(req) {
    if(!req || !req['token'] || !req['body'] || !req['body']['building'] ) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await lib_request({
        method: 'GET',
        uri: `/rest/v2/room/stats2/${req['body']['building']}`,
    }, req['token']);

    if(ret.data.status==='success') {
        if(ret.data.data.length===0) return { body: { code: -1004, msg: '没有任何数据' }};
        else return { body: { code: 0, buildings: ret.data.data }};
    }

    return { body: { code: -1002, msg: ret.data.message }};
}