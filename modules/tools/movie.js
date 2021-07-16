const verifier = require('../../utils/verifier');
const axios = require('axios');
const crypto = require('crypto-js');
const { YunError } = require('../../utils/error');

module.exports = async function(req) {
    verifier(req, {t:'query', v:'name'});

    let ret;

    const md5 = (str)=> { return crypto.MD5(str).toString(); }

    let date = new Date();
    let offset = 6e4 * date.getTimezoneOffset();
    date = new Date(date.getTime() + offset + 36e5 * 8);
    temp = date.getDate() + 9 + 9 ^ 10;
    temp = md5(String(temp))
    temp = temp.substring(0, 10);
    temp = md5(temp);
    let uri = "/api/v/?z=".concat(temp, "&jx=").concat(encodeURI(req['query']['name']));
    uri += "&s1ig=".concat(date.getDay() + 11397);
    console.log(uri);
    const path = `https://z1.m1907.cn${uri}`;

    try {
        ret = await axios.get(path, headers={
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; PDBM00 Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36 MMWEBID/8882 MicroMessenger/8.0.1.1841(0x2800015B) Process/tools WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64'
        });
    } catch (error) {
        throw new YunError(error.message);
    }
    if(ret.status!=200) throw new YunError(`Request failed with code: ${ret.status}`);

    if(!ret.data.data) ret.data['data'] = [];
    return { body: {code: 0, movies: ret.data.data} };
}