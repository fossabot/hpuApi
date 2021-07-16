const verifier = require('../../utils/verifier');
const {uia_request} = require('../request');
const tough = require('tough-cookie');
const CONFIG = require('../../config');
const { NotLoggedInError, YunError } = require('../../utils/error');

// serviceEg: 'http://seatlib.hpu.edu.cn/cas' 'https://webvpn.hpu.edu.cn/Cas/login.html'
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'}, {t:'body', v:'service'});

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
            throw new YunError(err.message);
        }
        break;
    }
    const errmsg = /errormes.*value="(.*)"/.exec(ret.data);
    if(errmsg && errmsg[1]==='') throw new NotLoggedInError();
    if(errmsg) throw new YunError(errmsg[1]);
    throw new YunError('暂不支持此服务登录');
}