const { NotYetBeginError, YunError, RepeatError } = require('../../utils/error');
const verifier = require('../../utils/verifier');
const {ybk_request} = require('../request');

// req.token req.body.classid
module.exports = async function(req) {
    verifier(req, {t:'header', v:'token'}, {t:'body', v:'classid'});

    ret = await ybk_request({
        uri: '/checkin/current_open',
        data: {'clazz_course_id': req['body']['classid']}
    }, req['token']);

    if(ret.data.result_code===1001) throw new NotYetBeginError(ret.data.result_msg);
    if(ret.data.result_code!==0) throw new YunError(ret.data.result_msg);

    let check_info = {id: ret.data.data.id, checkin_type: ret.data.data.checkin_type, open_time: ret.data.data.open_time};
    if(ret.data.data.points && ret.data.data.points!='') check_info['points'] = ret.data.data.points;
    if(ret.data.data.deadline_time) check_info['deadline_time'] = ret.data.data.deadline_time;

    // {
    //     body: {
    //       code: 0,
    //       id: '1360****',
    //       checkin_type: 'SIMPLE',
    //       points: '',
    //       data: {
    //         id: '1360****',
    //         checkin_type: 'SIMPLE',
    //         points: '',
    //         open_time: '2021-04-14 16:37:36',
    //         deadline_time: null,
    //         checkin_flag: 'N',
    //         checkin_time: null
    //       },
    //       result_code: 0,
    //       result_msg: 'OK'
    //     }
    //   }

    if(ret.data.data.checkin_flag == 'Y') throw new RepeatError('你已经签过到了', check_info);

    try {
        if(ret.data.data.checkin_type == 'CLOCKIN') {
            ret = await ybk_request({
                uri: '/cc_clockin/clockin',
                data: {cc_id: req['body']['classid']}
            }, req['token']);
        } else {
            ret = await ybk_request({
                url: 'https://checkin.mosoteach.cn:19528/checkin',
                data: {checkin_id: ret.data.id, report_pos_flag: 'Y', lat: '', lng: ''}
            }, req['token']);
        }
    } catch (err) {
        throw new YunError(err.message);
    }

    if(ret.data.result_code!==0) throw new YunError(ret.data.result_msg);
    return { body: { code: 0, ...check_info}}
}
