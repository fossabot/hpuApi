const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

let app = new express.Router();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

function travel(dir, callback) {
    fs.readdirSync(dir).forEach((file) => {
        var pathname = path.join(dir, file)
        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback)
        } else {
            callback(pathname)
        }
    })
}

travel(path.join(__dirname, 'modules'), function (pathname) {
    let ret = /modules[\\/]([a-z]*)[\\/]([a-z_]*)\.js$/.exec(pathname);
    if (!ret || ret.length !== 3) return;
    console.log('Loaded:', ret[1], ret[2]);
    app.use(`/${ret[1]}/${ret[2]}`, async (req, res, next) => {
        console.log('┌→', req.body);
        let result;

        try {
            result = await require(pathname)({ query: req.query, body: req.body, ...req.headers });
        } catch (error) {
            next(error);
            return;
        }
        if (result['headers']) {
            for (const header of Object.keys(result['headers'])) {
                res.setHeader(header, result['headers'][header]);
            }
        }

        res.send(result.body);
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.setStatusCode(404);
    res.send({code: 404, msg: '404 not found'})
});

app.use(function(err, req, res, next) {
    console.log('These errors happened during processing: ', err);
    res.setStatusCode(500);
    res.send({code: 500, msg: '500 internal server error'})
});

module.exports.handler = function (request, response, context) {
    // 兼容Express请求类型
    request.query = request.queries;
    let ori_send = response.send;

    response.send = function(body) {
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
    const getHeader = function(k) {
        let new_obj = {};
        for (const key of Object.keys(this.headers))
            new_obj[key.toLocaleLowerCase()] = this.headers[key];
        
        return new_obj[k.toLocaleLowerCase()];
    };
    response.getHeader = (k)=>{getHeader.call(response, k)};

    app.handle(request, response);
};

// let request = {
//     path: '/edu/captcha',
//     url: '/edu/captcha',
//     queries: {},
//     clientIP: '',
//     method: 'GET',
//     body: '{"a":1}',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// };

// let response = {
//     headers: {},
//     code: 0,
//     setStatusCode(code) {
//         this.code = code;
//         console.log('set code', code);
//     },
//     send(body) {
//         console.log('header', this.headers);
//         console.log('send', Buffer.from(body).toString());
//     },
//     setHeader(k, v) {
//         this.headers[k] = v;
//     },
//     deleteHeader(k) {
//         delete this.headers[k];
//     },
// };
// module.exports.handler(request, response, {});