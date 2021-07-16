const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 座位可选时间
// req.token req.body.date req.body.id req.body.start? 
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'}, {t:'body', v:'date'}, {t:'body', v:'id', c:'num'});

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

    return { body: { code: 0, ...ret.data.data }}
}