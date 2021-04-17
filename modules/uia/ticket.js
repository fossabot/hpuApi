const {uia_request} = require('../request');
const tough = require('tough-cookie');
const CONFIG = require('../../config')

// serviceEg: 'http://seatlib.hpu.edu.cn/cas' 'https://webvpn.hpu.edu.cn/Cas/login.html'
// req.token req.body.service
module.exports = async function(req) {
    if(!req || !req['token'] || !req['body'] || !req['body']['service']) return { body: { code: -1003, msg: '参数不完整' }};

    let now_url;
    let cookieJar = new tough.CookieJar();
    cookieJar.setCookieSync(`CASTGC=${req.token}`, `${CONFIG.uia.url}/cas`);
    while (true) {
        try {
            let config;
            if(!now_url) config = {
                method: 'GET',
                uri: '/cas/login',
                params: {service: req['body']['service']},
                withCredentials: true,
                jar: cookieJar,
            };
            else config = {
                method: 'GET',
                url: now_url,
                withCredentials: true,
                jar: cookieJar,
            }
            ret = await uia_request(config);
        } catch (err) {
            if(err.response && err.response.status===302 && err.response.headers.location) {
                now_url = err.response.headers.location;
                console.log('302: ', now_url);

                if(now_url.indexOf(CONFIG.uia.url)!=-1) continue;

                const ticket = /ticket=(ST-[A-Za-z0-9\.\-]+)/.exec(now_url);
                if(ticket) return {body: { code: 0, ticket: ticket[1] }};
                continue;
            }
            console.log(err);
            return {body: { code: -1002, msg: err.message }};
        }
        break;
    }
    const errmsg = /errormes.*value="(.*)"/.exec(ret.data);
    if(errmsg && errmsg[1]==='') return {body: { code: -1001, msg: '未登录' }};
    if(errmsg) return {body: { code: -1002, msg: errmsg[1] }};
    return {body: { code: -1002, msg: '暂不支持此服务登录' }};
}