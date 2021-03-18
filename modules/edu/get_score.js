const {edu_request} = require('../request');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');

// req.token req.body.semester_id 
module.exports = async function(req) {
    if(!req || !req['token'] || !req['body'] || !req['body']['semester_id']) return { body: { code: -1003, msg: '参数不完整' }};
    let ret;

    try {
        ret = await edu_request({
            method: 'GET',
            uri: '/teach/grade/course/person.action',
        }, req.token);
    } catch (error) {
        if(error.response && error.response.status===302) return { body: { code: -1001, msg: '你没有登录或登录态已过期' }};
        return { body: { code: -1002, msg: error.message }}
    }

    ret = await edu_request({
        method: 'GET',
        uri: `/teach/grade/course/person!search.action?semesterId=${req.body.semester_id}&projectType=&_=${new Date().getTime()}`,
        headers: {'Cookie': `semester.id=${req.body.semester_id}`}
    }, req.token);

    const $ = cheerio.load(ret.data);
    $('.grid thead').remove();
    
    if($('div[align="center"]').length) {
        return {
            body: {
                code: -1002,
                msg: $('div[align="center"]').text().replace(/	/g, ' ').replace(/ +/g, ' ').trim()
            },
        }
    }

    let sum_grade_point = 0;
    let sum_score = 0;
    const exams = [];
    $('.grid tr').each(function(){
        const tds = $(this).find('td');
        const exam = {
            semester: tds.eq(0).text().trim(),
            course_code: tds.eq(1).text().trim(),
            course_id: tds.eq(2).text().trim(),
            name: tds.eq(3).text().trim(),
            category: tds.eq(4).text().trim(),
            attr: tds.eq(5).text().trim(),
            credit: tds.eq(6).text().trim(),
            final_judge_score: tds.eq(7).text().trim(),
            final_score: tds.eq(8).text().trim(),
            grade_point: tds.eq(9).text().trim(),
        }
        sum_grade_point += parseFloat(exam.grade_point);
        sum_score += parseInt(exam.final_score);
        exams.push(exam);
        // console.log($(this).text().replace(/	/g, ' ').replace(/ +/g, ' ').replace(/\n/g, '').trim());
    });

    return {
        body: {
            code: 0,
            exams: exams,
            sum_grade_point: sum_grade_point.toFixed(1),
            avr_grade_point: (sum_grade_point/exams.length).toFixed(2),
            sum_score: sum_score,
        },
    }
}