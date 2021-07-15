const express = require('express');
const {initExpress} = require('./utils/common');
const app = express();

initExpress(app);

const port = process.env.PORT || 9000
app.set('port', port);
app.listen(port, ()=>{console.log('Listening on ' + port);});

app.binaryTypes = ['*/*'];
module.exports = app
