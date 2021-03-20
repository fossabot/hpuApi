const {lib_request} = require('../request');

// 座位布局
// date: 2021-03-20
// req.token req.body.room_id req.body.date
module.exports = async function(req) {
    if(!req || !req['token'] || !req['body'] || !req['body']['room_id'] || !req['body']['date']) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await lib_request({
        method: 'GET',
        uri: `/rest/v2/room/layoutByDate/${req['body']['room_id']}/${req['body']['date']}`,
    }, req['token']);

    if(ret.data.status==='success') return { body: { code: 0, ...ret.data.data }}
    return { body: { code: -1002, msg: ret.data.message }}
}
