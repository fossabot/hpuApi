const fs = require('fs');
const path = require('path');

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

let obj = {}
travel(path.join(__dirname, 'modules'), function(pathname){
    let ret = /modules\\([a-z]*)\\([a-z_]*)\.js$/.exec(pathname);
    if(!ret || ret.length!==3) return;
    console.log('Loaded:',ret[1], ret[2]);
    obj[`${ret[1]}_${ret[2]}`] = require(pathname);
});

module.exports = obj
