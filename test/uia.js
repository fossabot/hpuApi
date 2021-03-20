const {uia_login, uia_captcha} = require('../index');
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

    ret = await uia_login({body: {username: '学号', password: '统一认证密码', service: 'http://seatlib.hpu.edu.cn/cas', captcha_token: ret.body.token, captcha: captcha}});
    console.log(ret);

    await ask('任意键关闭');
    process.exit(0);
})();


