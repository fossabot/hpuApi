const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 座位布局
// eg.date: 2021-03-20
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'}, {t:'body', v:'room_id', c:'num'}, {t:'body', v:'date'});

    ret = await lib_request({
        method: 'GET',
        uri: `/rest/v2/room/layoutByDate/${req['body']['room_id']}/${req['body']['date']}`,
    }, req['token']);
    
    let temp = {};
    temp['rows'] = [];
    for (let i = 0; i < ret.data.data.rows; i++) {
        let row = [];
        for (let j = 0; j < ret.data.data.cols; j++) {
            row.push(ret.data.data.layout[i*1000+j])
        }
        temp['rows'].push(row);
    }
    ret.data.data.layout = temp;

    return { body: { code: 0, ...ret.data.data }}
}
