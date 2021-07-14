const g = require('./utils/global_cache');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

module.exports = async function() {
    // 加载模型缓存
    let relative = "tf-model/edu-captcha/model.json";
    console.log('init model, path:', relative);
    if(!fs.existsSync(relative)) relative = path.join('/opt', relative); // 云函数分层
    const handler = tf.io.fileSystem(relative);
    g.tf_edu_model = await tf.loadGraphModel(handler);
}