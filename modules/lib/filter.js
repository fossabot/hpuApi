const {lib_request} = require('../request');

// 图书馆信息
// req.token
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/free/filters',
    }, req['token']);

    if(ret.data.status!=='success') return { body: { code: -1002, msg: ret.data.message }};
    
    ret.data.data.buildings = ret.data.data.buildings.map(item=>{return {id: item[0], name: item[1]}});
    ret.data.data.rooms = ret.data.data.rooms.map(item=>{return {id: item[0], name: item[1], building_id: item[2], floor: item[3]}});

    return { body: { code: 0, ...ret.data.data }};
}