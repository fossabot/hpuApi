const {lib_request} = require('../request');

// 用户信息
// req.token
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/user',
    }, req['token']);

    if(ret.data.status==='success') return { body: { code: 0, ...ret.data.data }}
    return { body: { code: -1002, msg: ret.data.message }}
}

/*
{
  id: 44507,
  enabled: true,
  name: '***REMOVED***',
  username: '312003***REMOVED***',
  username2: null,
  status: 'NORMAL',
  lastLogin: '2020-10-10T09:25:46.000',
  checkedIn: false,
  reservationStatus: null,
  lastIn: null,
  lastOut: null,
  lastInBuildingId: null,
  lastInBuildingName: null,
  violationCount: 0
}
*/