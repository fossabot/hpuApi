const crypto = require('crypto-js');
const qs = require('qs');

module.exports = function(token, req) {
    let str = req['url'];

    if(typeof token == 'string') token = qs.parse(token);
    // 登录后的请求
    if(token && token.uid && token.secretID && token.secret && token.lastTime) {
        req['headers']['X-mssvc-access-id'] = token.secretID;
        req['headers']['X-mssvc-sec-ts'] = token.lastTime;

        str += '|' + token.uid;
    }

    let date = new Date().toUTCString()+'+00:00';
    req['headers']['Date'] = date;
    str += '|' + date;

    let data_obj = req['data'];

    if(typeof req['data'] == 'string') data_obj = qs.parse(req['data']);

    if(data_obj) {
        let data_str = [];
        for (const key of Object.keys(data_obj))
            data_str.push(`${key}=${data_obj[key]}`);

        data_str = data_str.sort();

        if(!req['url'].endsWith('/checkin')) {
            str += '|';
            if(req['url'].endsWith('/login') || req['url'].endsWith('/login_s')) str += data_str.join('|')
            else str += crypto.MD5(data_str.join('|')).toString().toUpperCase();
        }

        req['data'] = data_str.join('&');
        req['headers']['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    console.log('Signing:', str, req['data']);

    if(!token) token = {secret: '526EBA802E6FCF44661DE4393A82ABDA'};
    return crypto.HmacSHA1(str, token.secret);
}