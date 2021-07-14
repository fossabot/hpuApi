const axios = require('axios');

// req.query.id req.body.size
module.exports = async function(req) {
    if(!req) return { body: { code: -1003, msg: '参数不完整' }};

    let ret;
    if(req['body'] && req.body['size']) {
        
        try {
            ret = await axios.get(`http://hnqndaxuexi.dahejs.cn/stw/news/list?&pageNumber=1&pageSize=${req.body['size']}`);
        } catch (error) {
            return { body: {code: -1002, msg: error.message} };
        }

        if(ret.data.result!=200) return { body: {code: -1002, msg: msg } };

        let lists = [];
        for (const item of ret.data.obj.news.list) {
            let obj = {};
            
            if(item.newsType.code!='GROUP_CLASS') continue;
            obj['img'] = item.focusImg;
            obj['date'] = item.pubDate;
            obj['link'] = item.link;
            obj['name'] = item.title;
            
            const id = /daxuexi\/([a-z0-9]+)\/m\.html/.exec(item.link);
            if(!id || id[1].startsWith('daxuexi')) continue;
            obj['id'] = id[1];
            lists.push(obj);
        }
        console.log(lists);
        return { body: {code: 0, list: lists} };

    }


    if(!req['query'] || !req['query']['id']) return { body: { code: -1003, msg: '参数不完整' }};
    const path = `https://h5.cyol.com/special/daxuexi/${req['query']['id']}/`;

    try {
        ret = await axios.get(path+'m.html', headers={
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; PDBM00 Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36 MMWEBID/8882 MicroMessenger/8.0.1.1841(0x2800015B) Process/tools WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64'
        });
    } catch (error) {
        return { body: {code: -1002, msg: error.message} };
    }
    if(ret.status!=200) return { body: {code: -1002, msg: `Request failed with code: ${ret.status}`} };
    // 注入JS拦截资源加载，使相对路径资源转换为绝对路径
    const temp = `<base href="${path}"><script src="https://tools.hyun.tech/js/proxy_inject.js?t=${Date.now()}"></script>` + ret.data;
    return {headers: ret.headers, body: temp}; 
}