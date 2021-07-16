const verifier = require('../../utils/verifier')
const {edu_request} = require('../request')
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser')
const { NotLoggedInError, YunError } = require('../../utils/error')

// req.token req.body.semester_id?
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'});
    
    let ret;
    try {
        ret = await edu_request({
            method: 'GET',
            uri: '/courseTableForStd.action',
        }, req.token);
    } catch (error) {
        if(error.response && error.response.status===302) throw new NotLoggedInError();
        throw new YunError(error.message);
    }

    let semester_id = /semesterCalendar\({empty:"false",onChange:"",value:"(\d+)"}/.exec(ret.data);
    const re_ids = /bg\.form\.addInput\(form,"ids","(\d+)"\)/g
    let std_ids = re_ids.exec(ret.data);
    let class_ids = re_ids.exec(ret.data);

    if(!semester_id || !std_ids || !class_ids) throw new YunError('未知错误, 可能未登录？');
    semester_id = semester_id[1], std_ids=std_ids[1], class_ids=class_ids[1];

    if(req['body']['semester_id']) semester_id = parseInt(req['body']['semester_id']);
    try {
        ret = await edu_request({
            method: 'GET',
            uri: `/courseTableForStd!exportStdCourseGrade.action?setting.kind=std&ids=${std_ids}`,
            headers: {'Cookie': `semester.id=${semester_id}`}
        }, req.token);
    } catch (error) {
        if(error.response && error.response.status===302) throw new NotLoggedInError();
        throw new YunError(error.message);
    }

    let coursetable = {};
    const $ = cheerio.load(ret.data);
    cheerioTableparser($);

    coursetable['weeks'] = $('#manualArrangeCourseTable thead th').length - 1;
    coursetable['units'] = $('#manualArrangeCourseTable tbody tr').length;
    let temp = $('table').eq(0).find('tr td');
    coursetable['tittle'] = temp.eq(1).text();

    coursetable['student'] = {};
    const stu_info = temp.eq(2).text();
    
    temp = /学号: ?(\d+)/.exec(stu_info);
    if(temp && temp.length>=2) coursetable['student']['no'] = temp[1];
    temp = /学生姓名: ?([\u4e00-\u9fa5]+)/.exec(stu_info);
    if(temp && temp.length>=2) coursetable['student']['name'] = temp[1];
    temp = /所属班级: ?([\w\u4e00-\u9fa5]+)/.exec(stu_info);
    if(temp && temp.length>=2) coursetable['student']['class'] = temp[1];
    temp = /总学分:([\d.]+)/.exec(stu_info);
    if(temp && temp.length>=2) coursetable['student']['score'] = temp[1];

    coursetable['html'] = $.html('#manualArrangeCourseTable');

    coursetable['data'] = [];
    let table = $('#manualArrangeCourseTable');
    table.children('thead').remove();
    table.find('tbody tr >td:first-child').remove();
    table = table.parsetable(true, true, true);

    function splitCourseContent(txt) {
        let ret_arr = [];
        const arr = txt.split('\n').map(t=>{return t.trim().replace(/	/g, ' ').replace(/ +/g, ' ').replace(/^\((.*)\)$/, '$1')});
        
        for (let i = 0; i < arr.length; i+=5) {
            const temp_arr = arr[i+3].split(' ');
        
            let week_info = /(\d+)-?(\d+)?([单双])?/.exec(temp_arr.shift());

            const ret = {
                name: arr[i],
                teacher: arr[i+1],
                position: temp_arr.join(' ')
            };

            if(!week_info) {
                ret_arr.push(ret);
                continue;
            }
            
            let ret_obj;
            if(week_info[2]) {
                ret_obj = {
                    from: parseInt(week_info[1]),
                    to: parseInt(week_info[2])
                }
            } else {
                ret_obj = {
                    from: parseInt(week_info[1]),
                    to: parseInt(week_info[1])
                }
            }
            if(week_info[3]) ret_obj['option'] = week_info[3];
            ret['week_info'] = ret_obj;
            ret_arr.push(ret);
        }

        return ret_arr;
    }

    for (const day of table) {
        let day_course = [];
        let last;
        day.forEach((course, index) => {
            if(last && course===last.content) return;
            if(last && last.content!=='') day_course.push({ content: splitCourseContent(last.content), begin: last.begin, duration: index - last.begin });
            
            last = {
                content: course,
                begin: index
            }
        });
        if(last && last.content!=='') day_course.push({ content: splitCourseContent(last.content), begin: last.begin, duration: coursetable['units'] - last.begin });

        coursetable['data'].push(day_course);
    }
    
    return {
        body: {
            code: 0,
            ...coursetable
        },
    }
}