const express = require('express');
const {preload, initExpress} = require('./utils/common');
const CONFIG = require('./config');

let app = new express.Router();

exports.initializer = function (context, callback) {
    initExpress(app);
    
    if(CONFIG.preload) preload().then(()=>{callback(null, '');});
    else callback(null, '');
};

exports.handler = function (request, response, context) {
    // 兼容Express请求类型
    request.query = request.queries;
    let ori_send = response.send;

    response.send = function (body) {
        switch (typeof body) {
            case 'object':
                this.setHeader('Content-Type', 'application/json; charset=utf-8');
                body = JSON.stringify(body);
                break;

            default:
                break;
        }
        ori_send.call(this, Buffer.from(body, 'utf-8'));
    }
    const getHeader = function (k) {
        let new_obj = {};
        for (const key of Object.keys(this.headers))
            new_obj[key.toLocaleLowerCase()] = this.headers[key];

        return new_obj[k.toLocaleLowerCase()];
    };
    response.getHeader = (k) => { getHeader.call(response, k) };

    app.handle(request, response);
};