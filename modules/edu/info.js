const {edu_request} = require('../request');
const cheerio = require('cheerio');

// req.token req.body.type?
module.exports = async function(req) {
    if(!req || !req['token']) return { body: { code: -1003, msg: '参数不完整' }};

    try {
        await edu_request({
            method: 'GET',
            uri: '/homeExt.action',
        }, req.token);
    } catch (error) {
        if(error.response && error.response.status===302) return { body: { code: -1001, msg: '你没有登录或登录态已过期' }};
        return { body: { code: -1002, msg: error.message }}
    }

    let ret = await edu_request({
        method: 'GET',
        uri: '/homeExt!main.action',
    }, req.token);

    const $ = cheerio.load(ret.data);
    
    let semester_reg = /(\d\d\d\d)-(\d\d\d\d) +第 *(\d+) *学期.*第 *(\d+) *教学/.exec($('.calendar-box .title').text());
    let semester_now_id = /viewSemesterInfo\((\d+)\);/.exec(ret.data);

    if(!semester_now_id || !semester_reg || !semester_reg[1] || !semester_reg[2] || !semester_reg[3] || !semester_reg[4]) return { body: { code: -1002, msg: '未知错误, 服务器返回异常' }};
    semester_now_id = parseInt(semester_now_id[1]);
    const week = parseInt(semester_reg[4]);
    
    let now = new Date(), now_day = now.getDay(), now_ts = new Date(now.getFullYear(),now.getMonth(), now.getDate(), 0, 0, 0).getTime()/1000;
    let semester_start = now_ts;
    if(now_day===0) now_day=7;
    semester_start-=(now_day-1)*86400;
    semester_start-=(week-1)*604800;
    
    let semesters = [];
    if(semester_reg[3]===1) {
        semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 第一学期`, id: semester_now_id});
    } else {
        semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 第一学期`, id: semester_now_id - 1});
        if(!req.body || req.body.type !== 'score')
            semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 第二学期`, id: semester_now_id});
    }

    return {
        body: {
            code: 0,
            name: $('#personal-info .text h3 span').text(),
            semester_now: {
                id: semester_now_id,
                from_year: parseInt(semester_reg[1]),
                to_year: parseInt(semester_reg[2]),
                num: parseInt(semester_reg[3]),
                start: semester_start
            },
            week_now: week,
            semesters: semesters
        },
    }

    // let semester_now = /2020-2021 第 2 学期&nbsp;&nbsp;第 <strong>2</strong> 教学周"/.exec(ret.data);
    // let semester_id = /viewSemesterInfo\((\d+)\);/.exec(ret.data);
    // const re_ids = /bg\.form\.addInput\(form,"ids","(\d+)"\)/g
    // let std_ids = re_ids.exec(ret.data);
    // let class_ids = re_ids.exec(ret.data);

    // if(!tag_id || !semester_id || !std_ids || !class_ids || semester_id.length<2 || tag_id.length<2 || class_ids.length<2 || std_ids.length<2) return { body: { code: -1002, msg: '未知错误, 可能未登录？' }}

    // semester_id = semester_id[1], std_ids=std_ids[1], class_ids=class_ids[1], tag_id=tag_id[1];
    
    // ret = await edu_request({
    //     method: 'POST',
    //     uri: '/dataQuery.action',
    //     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    //     data: qs.stringify({'tagId':tag_id,'dataType':'semesterCalendar','value':semester_id,'empty':false})
    // }, req.token);
    // let ret_obj = {};
    // eval('ret_obj='+ret.data);

    // let ret_arr = [];
    // const keys = Object.keys(ret_obj['semesters']);
    // keys.forEach(key=>{ret_arr.push(ret_obj['semesters'][key]);})

    // return {
    //     body: {
    //         code: 0,
    //         stu_id: parseInt(std_ids),
    //         class_id: parseInt(class_ids),
    //         semester_id: parseInt(semester_id),
    //         semesters: ret_arr.reverse()
    //     },
    // }
}