const verifier = require('../../utils/verifier');
const {lib_request} = require('../request');

// 用户信息
// req.token
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    ret = await lib_request({
        method: 'GET',
        uri: '/rest/v2/user',
    }, req['token']);

    return { body: { code: 0, ...ret.data.data }}
}

/*
{
  id: 44507,
  enabled: true,
  name: '***REMOVED***',
  username: '***REMOVED***',
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