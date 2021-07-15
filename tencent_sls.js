const express = require('express');
const { preload, initExpress } = require('./utils/common');
const CONFIG = require('./config');

let app = new express.Router();
initExpress(app);

exports.handler = (event, context, callback) => {
    // 兼容Express请求类型
    let request = {};
    request.query = event.queryStringParameters;
    request.headers = event.headers;
    request.method = event.httpMethod;
    request.url = event.path;

    let response = {
        code: 200,
        headers: {},
        setHeader(k, v) {
            this.headers[k] = v;
        },
        deleteHeader(k) {
            delete this.headers[k];
        },
        setStatusCode: function (code) {
            this.code = code;
        },
        send: function (body) {
            switch (typeof body) {
                case 'object':
                    this.setHeader('Content-Type', 'application/json; charset=utf-8');
                    body = JSON.stringify(body);
                    break;

                default:
                    break;
            }
            callback(null, {
                "isBase64Encoded": false,
                "statusCode": this.code,
                "headers": this.headers,
                "body": body
            });
        }
    };

    const getHeader = function (k) {
        let new_obj = {};
        for (const key of Object.keys(this.headers))
            new_obj[key.toLocaleLowerCase()] = this.headers[key];

        return new_obj[k.toLocaleLowerCase()];
    };
    response.getHeader = (k) => { getHeader.call(response, k) };

    if(request.getHeader('content-type').startsWith('application/json'))
        request.body = JSON.parse(event.body);
    else request.body = event.body;

    app.handle(request, response);
}