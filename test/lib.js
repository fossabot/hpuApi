const {lib_captcha, lib_login} = require('../index');
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
    let ret, token='F96AFE46E0E9C6AB9707642099EE85EB';
    
    // ret = await lib_login({body: {username: '312003***REMOVED***', password: '***REMOVED***'}});
    // console.log(ret);
    // token = ret.body.token
    
    
    console.log(ret);

    process.exit(0);
})();


