const {tools_daxuexi, tools_movie, tools_redirect} = require('../index');
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
        
    // tools_daxuexi({query: {id:'aqz3ws1xa7'}, body: {size: 50}}).then((data)=>{
    //     console.log(data);
    // })

    let ret = await tools_movie({query: {name:'熊出没'}});
    console.log(ret);

    ret = await tools_redirect({query: {url:'http://adkx.net/259r8'}});
    console.log(ret);

    process.exit(0);
})();