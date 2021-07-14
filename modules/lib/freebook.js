const {lib_request} = require('../request');
const qs = require('qs');

// 预约座位
// req.token req.body.start_time, req.body.end_time, req.body.seat_id, req.body.date
module.exports = async function(req) {
    if(!req || !req['token'] || !req['body'] || !req['body']['start_time'] || !req['body']['end_time'] || !req['body']['seat_id'] || !req['body']['date']) return { body: { code: -1003, msg: '参数不完整' }};

    // time单位:分钟
    if(req['body']['start_time']<=24) req['body']['start_time']*=60;
    if(req['body']['end_time']<=24) req['body']['end_time']*=60;

    ret = await lib_request({
        method: 'POST',
        uri: '/rest/v2/freeBook',
        data: qs.stringify({
            'token': req['token'],
            'startTime': req['body']['start_time'],
            'endTime': req['body']['end_time'],
            'seat': req['body']['seat_id'],
            'date': req['body']['date']
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, req['token']);

    if(ret.data.status==='success') return { body: { code: 0, ...ret.data.data }}
    return { body: { code: -1002, msg: ret.data.message }}
}