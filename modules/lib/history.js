const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 预约历史
// req.token req.body.page? req.body.count?
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});
    
    // 兼容老版本语法
    let page = req.body.page;
    let count = req.body.count;
    
    if(!page) page=1;
    if(!count) count=10;

    ret = await lib_request({
        method: 'GET',
        uri: `/rest/v2/history/${page}/${count}`,
    }, req['token']);

    return { body: { code: 0, ...ret.data.data }};
}
