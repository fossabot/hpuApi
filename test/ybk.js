const {ybk_login, ybk_checkin} = require('../index');
const {ybk_request} = require('../modules/request');
const fs = require('fs');
const readline = require('readline');
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

function ask(questionText) {
  return new Promise(resolve => {
    readlineInterface.question(questionText, (input) => resolve(input) );
  });
}

(async function(){
    let token = 'uid=***REMOVED***&secretID=ugmwMnFW1QikQgdH&secret=***REMOVED***&lastTime=1614932051';
    let token = {
        uid: '***REMOVED***',
        secretID: 'Pbm0Ers6rECe08O5',
        secret: '***REMOVED***',
        lastTime: 1601863383
    }

    let ret = await ybk_login({body: {username: '***REMOVED***', password: '***REMOVED***'}});
    console.log(ret);

    ret = await ybk_checkin({body: {classid: '***REMOVED***'}, token: token});
    console.log(ret);

    // let ret;
    // // 701000
    // for (let code = 709723; code <= 710000 ; code++) {
    //     ret = await ybk_request({
    //         uri: '/cc/detail',
    //         data: {invitation_code: code}
    //     }, token);
    //     ret.data['icode'] = code;
    //     fs.appendFileSync('./classes.json', JSON.stringify(ret.data)+'\r\n');
    //     console.log('done:', code, ret.data.result_code);
    //     await sleep(1500*Math.random());
    // }

    process.exit(0);
})();
