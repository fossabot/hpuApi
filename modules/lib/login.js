const {lib_request} = require('../request');

// req.body.username req.body.password
module.exports = async function(req) {
    if(!req || !req['body'] || !req['body']['username'] || !req['body']['password']) return { body: { code: -1003, msg: '参数不完整' }};


    ret = await lib_request({
        method: 'GET',
        uri: '/rest/auth',
        params: {username: req['body']['username'], password: req['body']['password']},
    });

    if(ret.data.status==='success') return { body: { code: 0, token: ret.data.data.token }}
    return { body: { code: -1002, msg: ret.data.message }}
}