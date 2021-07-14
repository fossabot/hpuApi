const uia_captcha = require('../uia/captcha')

module.exports = async function(req) {
    return uia_captcha(req);
}