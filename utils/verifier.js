const { PropertyRequiredError, BadRequestError } = require('./error')

function verify_type(obj, c) {
    const c_map = {'num':'number', 'str':'string'};
    if(obj && obj.c && c_map[c] && (typeof obj != c_map[c])) return false;
    return true;
}


module.exports = function(req, ...needles) {
    if(!req) throw new BadRequestError('req cannot be null');
    for (const item of needles) {
        if((item.t === 'header' && !req[item.v] && verify_type(req[item.v], item.c))
            || (item.t === 'query' && !req.query[item.v] && verify_type(req.query[item.v], item.c))
            || (item.t === 'body' && !req.body[item.v]) && verify_type(req.body[item.v], item.c))
            throw new PropertyRequiredError(`${item.t}.${item.v}`);
    }
}