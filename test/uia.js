const {uia_login, uia_captcha, uia_info, uia_ticket} = require('../index');
const fs = require('fs');
const readline = require('readline');
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(questionText) {
  return new Promise(resolve => {
    readlineInterface.question(questionText, (input) => resolve(input) );
  });
}

(async function(){
    let ret = await uia_captcha();
    console.log(ret.body);
    fs.writeFileSync('./temp.jpg', Buffer.from(ret.body.img, 'base64'));
    let captcha = await ask("请输入验证码: ");

    ret = await uia_login({body: {username: '312003***REMOVED***', password: '***REMOVED***', captcha_token: ret.body.token, captcha: captcha}});
    console.log(ret);

    await ask('GET TICKET');
    ret = await uia_ticket({token: ret.body['token'], body: {service: 'http://seatlib.hpu.edu.cn/cas'}});
    console.log(ret);
    
    await ask('GET INFO');
    ret = await uia_info({token: ret.body['token']});
    console.log(ret);

    await ask('任意键关闭');
    process.exit(0);
})();

