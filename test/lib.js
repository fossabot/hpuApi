const {lib_violation, lib_checkin, lib_login, lib_filter, lib_building, lib_history, lib_cancel, lib_layout, lib_freebook, lib_seat_time} = require('../index');
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
    let ret, token;
    
    ret = await lib_login({body: {username: '学号', password: '统一认证密码'}});
    console.log(ret);

    token = ret.body.token;
    
    ret = await lib_filter({token: ret.body.token});
    console.log(ret.body);

    ret = await lib_building({token: token, body: {building: 1}});
    console.log(ret.body);

    ret = await lib_violation({token: token});
    console.log(ret.body);

    // await ask('座位布局');
    // ret = await lib_layout({token: token, body: {room_id: 1, date: '2021-03-20'}});
    // console.log(ret.body);

    // await ask('预约');
    // ret = await lib_freebook({token: token, body: {start_time: 19, end_time: 19.5, seat_id: 7014, date: '2021-03-20'}});
    // console.log(ret.body);
    
    await ask('座位空闲');
    ret = await lib_seat_time({token: token, body: {id: 7014, date: '2021-03-20'}});
    console.log(ret.body);

    await ask('历史');
    ret = await lib_history({token: token, body: {id: 11}});
    console.log(ret.body);

    await ask('取消');
    ret = await lib_cancel({token: token, body: {id: 2907125}});
    console.log(ret.body);


    process.exit(0);
})();


/*

{
  code: 0,
  startTimes: [
    { id: '930', value: '15:30' },
    { id: '960', value: '16:00' },
    { id: '990', value: '16:30' },
    { id: '1020', value: '17:00' },
    { id: '1050', value: '17:30' },
    { id: '1080', value: '18:00' },
    { id: '1110', value: '18:30' },
    { id: '1140', value: '19:00' },
    { id: '1170', value: '19:30' },
    { id: '1200', value: '20:00' },
    { id: '1230', value: '20:30' },
    { id: '1260', value: '21:00' },
    { id: '1290', value: '21:30' }
  ]
}

{
  code: 0,
  id: 2907125,
  receipt: '0120-125-6',
  onDate: '2021 年 03 月 20 日',
  begin: '19 : 00',
  end: '19 : 30',
  location: '北校区图书馆1层负一楼自习区，座位号189',
  checkedIn: false,
  checkInMsg: '当前没有可用预约'
}

{
  code: 0,
  reservations: [
    {
      id: 2907125,
      date: '2021-3-20',
      begin: '19:00',
      end: '19:30',
      awayBegin: null,
      awayEnd: null,
      loc: '北校区图书馆1层负一楼自习区189号',
      stat: 'RESERVE'
    }
  ]
}

{ code: 0 }



*/