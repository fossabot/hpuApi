const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 图书馆信息
// req.token
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/free/filters',
    }, req['token']);
    
    ret.data.data.buildings = ret.data.data.buildings.map(item=>{return {id: item[0], name: item[1]}});
    ret.data.data.rooms = ret.data.data.rooms.map(item=>{return {id: item[0], name: item[1], building_id: item[2], floor: item[3]}});

    return { body: { code: 0, ...ret.data.data }};
}