const fs = require('fs');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
const app = express();
const env = app.get('env');

env==='development' && app.use(logger('dev'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'/public')));

function travel(dir,callback){
  fs.readdirSync(dir).forEach((file)=>{
      var pathname=path.join(dir,file)
      if(fs.statSync(pathname).isDirectory()){
          travel(pathname,callback)
      }else{
          callback(pathname)
      }
  })
}

travel(path.join(__dirname, 'modules'), function(pathname){
  let ret = /modules[\\/]([a-z]*)[\\/]([a-z_]*)\.js$/.exec(pathname);
  if(!ret || ret.length!==3) return;
  console.log('Loaded:',ret[1], ret[2]);
  app.use(`/${ret[1]}/${ret[2]}`, async (req, res, next)=>{
    console.log('┌→', req.body);
    let result;

    try {
      result = await require(pathname)({body: req.body, ...req.headers});
    } catch (error) {
      next(error);
      return;
    }
    if(result['headers']) {
      for (const header of Object.keys(result['headers'])) {
        res.setHeader(header, result['headers'][header]);
      }
    }

    res.send(result.body);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, '404 not found'));
});

// error handler
app.use(function(err, req, res) {
  const ret_err = env==='development' ? err : err.message;

  // render the error page
  res.status(err.stat || 500);
  res.send({code: -1002, msg: ret_err});
});

const port = process.env.PORT || 3330
app.set('port', port);
app.listen(port, ()=>{console.log('Listening on ' + port);});

app.binaryTypes = ['*/*'];
module.exports = app
