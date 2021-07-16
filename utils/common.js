const g = require('./global_cache');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const express = require('express');
const { YunError } = require('./error');

async function preload() {
    // 加载模型缓存
    const tf = require('@tensorflow/tfjs-node');
    let relative = "tf-model/edu-captcha/model.json";
    console.log('init model, path:', relative);
    if(!fs.existsSync(relative)) relative = path.join('/opt', relative); // 云函数分层
    const handler = tf.io.fileSystem(relative);
    g.tf_edu_model = await tf.loadGraphModel(handler);
}

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

function initExpress(app) {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(process.cwd(), '/public')));

    travel(path.join(process.cwd(), 'modules'), function (pathname) {
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
        if(typeof res.status == 'function') res.status(404);
        else if(typeof res.setStatusCode == 'function') res.setStatusCode(404);
        res.send({ code: 404, msg: '404 not found' })
    });

    app.use(function (err, req, res, next) {
        console.log('These errors happened during processing: ', err);
        
        if(err instanceof YunError) {
            let temp = { code: err.code, msg: err.message };
            if(err.data) temp.data = err.data;
            res.send(temp);
            return;
        }

        if(typeof res.status == 'function') res.status(500);
        else if(typeof res.setStatusCode == 'function') res.setStatusCode(500);
        
        res.send({ code: 500, msg: '500 internal server error' })
    });
}

module.exports = {preload, initExpress}