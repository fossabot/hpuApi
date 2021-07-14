const {lib_request} = require('../request');

// 座位可选时间
// req.token req.body.date req.body.id req.body.start? 
module.exports = async function(req) {
    if(!req || !req['token'] || !req['body'] || !req['body']['date'] || !req['body']['id']) return { body: { code: -1003, msg: '参数不完整' }};

    if(req['body']['start']) {
        ret = await lib_request({
            method: 'GET',
            uri: `/rest/v2/endTimesForSeat/${req['body']['id']}/${req['body']['date']}/${req['body']['start']}`,
        }, req['token']);
    } else {
        ret = await lib_request({
            method: 'GET',
            uri: `/rest/v2/startTimesForSeat/${req['body']['id']}/${req['body']['date']}`,
        }, req['token']);    
    }

    if(ret.data.status==='success') return { body: { code: 0, ...ret.data.data }}
    return { body: { code: -1002, msg: ret.data.message }}
}