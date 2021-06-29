const axios = require('axios');

// req.query.url || req.body.url
module.exports = async function(req) {
    if(!req || !((req.query && req.query.url) || (req.body && req.body.url))) return { body: { code: -1003, msg: '参数不完整' }};

    let url = (req.query && req.query.url)? req.query.url: req.body.url;

    if(!url.startsWith('http')) return { body: {code: -1002, msg: '非法的地址'} };
    try {
        ret = await axios({
            url,
            maxRedirects: 0,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 9; PDBM00 Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36 MMWEBID/8882 MicroMessenger/8.0.1.1841(0x2800015B) Process/tools WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64'
            }
        });
        throw new Error('不支持的地址解析');
    } catch (error) {
        if(!error.response) return { body: {code: -1002, msg: error.message} };
        return { body: {code: 0, url: error.response.headers.location} };
    }
}