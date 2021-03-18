const CryptoJS = require('./sha1');
const AesJS = require('crypto-js');

function aes_encrypt(content, key){
    var sKey = AesJS.enc.Utf8.parse(key);
    var sContent = AesJS.enc.Utf8.parse(content);
    var encrypted = AesJS.AES.encrypt(sContent, sKey, {mode:AesJS.mode.ECB,padding: AesJS.pad.Pkcs7});
    return encrypted.toString();
}

function sha_encrypt(content, key) {
    return CryptoJS.SHA1(key + content).toString();
}

module.exports = {aes_encrypt, sha_encrypt}