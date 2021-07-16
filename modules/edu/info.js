const verifier = require('../../utils/verifier')
const {edu_request} = require('../request')
const cheerio = require('cheerio')
const { NotLoggedInError, YunError } = require('../../utils/error')

// req.token req.body.type?
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});

    try {
        await edu_request({
            method: 'GET',
            uri: '/homeExt.action',
        }, req.token);
    } catch (error) {
        if(error.response && error.response.status===302) throw new NotLoggedInError();
        throw new YunError(error.message);
    }

    let ret = await edu_request({
        method: 'GET',
        uri: '/homeExt!main.action',
    }, req.token);

    const $ = cheerio.load(ret.data);

    let semester_reg = /(\d\d\d\d)-(\d\d\d\d) +第 *(\d+) *学期.*第 *([-\d]+) *教学/.exec($('.calendar-box .title').text());
    let semester_now_id = /viewSemesterInfo\((\d+)\);/.exec(ret.data);

    if(!semester_now_id || !semester_reg || !semester_reg[1] || !semester_reg[2] || !semester_reg[3] || !semester_reg[4]) throw new YunError('未知错误, 服务器返回异常');
    semester_now_id = parseInt(semester_now_id[1]);

    let semesters = [];
    let semester_start, week;
    if(semester_reg[4]!='--') {
        const week = parseInt(semester_reg[4]);
    
        let now = new Date(), now_day = now.getDay(), now_ts = new Date(now.getFullYear(),now.getMonth(), now.getDate(), 0, 0, 0).getTime()/1000;
        semester_start = now_ts;
        if(now_day===0) now_day=7;
        semester_start-=(now_day-1)*86400;
        semester_start-=(week-1)*604800;
        
        if(semester_reg[3]==='1') {
            semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 第一学期`, id: semester_now_id});
        } else {
            semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 第一学期`, id: semester_now_id - 1});
            if(!req.body || req.body.type !== 'score')
                semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 第二学期`, id: semester_now_id});
        }
    } else {
        if(semester_reg[3]==='1') { // 暑假
            semesters.push({name: `${parseInt(semester_reg[1])-1}-${parseInt(semester_reg[2])-1} 第一学期`, id: semester_now_id - 2});
            semesters.push({name: `${parseInt(semester_reg[1])-1}-${parseInt(semester_reg[2])-1} 第二学期`, id: semester_now_id - 1});
            if(!req.body || req.body.type !== 'score')
                semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 新学期`, id: semester_now_id});
        } else { // 寒假
            semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 第一学期`, id: semester_now_id - 1});
            if(!req.body || req.body.type !== 'score')
                semesters.push({name: `${semester_reg[1]}-${semester_reg[2]} 第二学期`, id: semester_now_id});
        }
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
}