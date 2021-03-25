const axios = require('axios');

module.exports = async function() {
    ret = await axios.get({
        method: 'GET',
        url: `http://h5.cyol.com/special/daxuexi/${req['body']['id']}/m.html`,
    });

    return {headers: ret.headers, body: ret.data}; 
}