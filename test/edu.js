const {edu_captcha, edu_login, edu_info, edu_score} = require('../index');
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
  let token = 'AB739CA734D8EEA9CF9AF00F4872047A';

  while (true) {
    let ret = await edu_captcha({token: token});
    if(ret.body.code==-2000) {
      console.log('已登录');
      break;
    }
    console.log(ret);
    if(ret.body.code!=0) {
        await sleep(1000);
        continue;
    }
    fs.writeFileSync('./temp.jpg', Buffer.from(ret.body.img, 'base64'));

    token = ret.body.token;
    let captcha = await ask("请输入验证码: ");
    
    ret = await edu_login({token: token, key: ret.body.key, body: {captcha: captcha, username: '学号', password: '教务密码'}});
    console.log(ret);
    if(ret.body.code!=0) continue;
    
    break;
  }

  console.log('token', token);
  ret = await edu_info({token: token});
  console.log(ret);
  if(ret.body.code!=0) process.exit(0);

  ret = await edu_score({token: token, body: { semester_id: 62 }});
  console.log(ret);
  if(ret.body.code!=0) process.exit(0);

  process.exit(0);
})();


