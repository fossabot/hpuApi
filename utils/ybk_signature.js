const crypto = require('crypto-js');
const qs = require('qs');

module.exports = function(token, req) {
    if(typeof token == 'string') token = qs.parse(token);

    let date = new Date().toUTCString()+'+00:00';
    req['headers']['Date'] = date;

    let str = '', data_obj = req['data'];

    if(req['core_api']) {
        req['headers']['X-client-app-id'] = 'MTANDROID';
        req['headers']['X-client-version'] = '5.3.2';
        req['headers']['X-client-dpr'] = '2.0';

        req['headers']['X-access-id'] = token.secretID;
        req['headers']['Content-Type'] = 'application/json';
        let data_str = [];
        
        if(data_obj) {
            for (const key of Object.keys(data_obj))
                data_str.push(`${key}=${data_obj[key]}`);

            data_str = data_str.sort();

            if(!req['url'].endsWith('/checkin')) {
                str += '|';
                if(req['url'].endsWith('/login') || req['url'].endsWith('/login_s')) str += data_str.join('|')
                else str += crypto.MD5(data_str.join('|')).toString().toUpperCase();
            }

            req['data'] = data_str.join('&');
            // req['headers']['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        str = `${req['method']}|${req['uri']}|${token.uid}|${date}|${data_str.join('|')}|`
    } else {
        req['headers']['X-app-id'] = 'MTANDROID';
        req['headers']['X-app-version'] = '5.3.2';
        req['headers']['X-dpr'] = '2.0';

        str = req['url'];
        // 登录后的请求
        if(token && token.uid && token.secretID && token.secret && token.lastTime) {
            req['headers']['X-mssvc-access-id'] = token.secretID;
            req['headers']['X-mssvc-sec-ts'] = token.lastTime;

            str += '|' + token.uid;
        }

        str += '|' + date;

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

        if(!token) token = {secret: '526EBA802E6FCF44661DE4393A82ABDA'};
    }

    console.log('Signing:', str, token.secret, req['data']);
    return crypto.HmacSHA1(str, token.secret);
}