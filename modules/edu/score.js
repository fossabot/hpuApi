const verifier = require('../../utils/verifier')
const {edu_request} = require('../request')
const cheerio = require('cheerio')
const { NotLoggedInError, YunError } = require('../../utils/error')

// req.token req.body.semester_id 
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'}, {t:'body', v:'semester_id', c:'num'});

    let ret;
    try {
        ret = await edu_request({
            method: 'GET',
            uri: '/teach/grade/course/person.action',
        }, req.token);
    } catch (error) {
        if(error.response && error.response.status===302) throw new NotLoggedInError();
        throw new YunError(error.message);
    }

    ret = await edu_request({
        method: 'GET',
        uri: `/teach/grade/course/person!search.action?semesterId=${req.body.semester_id}&projectType=&_=${new Date().getTime()}`,
        headers: {'Cookie': `semester.id=${req.body.semester_id}`}
    }, req.token);

    const $ = cheerio.load(ret.data);
    $('.grid thead').remove();
    
    if($('div[align="center"]').length) throw new YunError($('div[align="center"]').text().replace(/	/g, ' ').replace(/ +/g, ' ').trim());

    let sum_grade_point = 0;
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
        exams.push(exam);
        // console.log($(this).text().replace(/	/g, ' ').replace(/ +/g, ' ').replace(/\n/g, '').trim());
    });

    return {
        body: {
            code: 0,
            exams: exams,
            sum_grade_point: sum_grade_point.toFixed(1),
            avr_grade_point: (sum_grade_point/exams.length).toFixed(2),
        },
    }
}