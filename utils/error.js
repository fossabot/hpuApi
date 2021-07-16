class YunError extends Error {
    constructor(message, data) {
        super(message);
        this.code = -1002;
        this.name = "UnknownError";
        this.data = data;
    }
}

class BadRequestError extends YunError {
    constructor(message) {
        super(message);
        this.code = -1003;
        this.name = "BadRequestError";
    }
}

class PropertyRequiredError extends BadRequestError {
    constructor(property) {
        super("No property: " + property);
        this.name = "PropertyRequiredError";
        this.property = property;
    }
}

class AlreadyLoggedInError extends YunError {
    constructor(message, data) {
        super(message?message:"您已经登录", data);
        this.code = -2000;
        this.name = "AlreadyLoggedInError";
        this.property = property;
    }
}

class NotLoggedInError extends YunError {
    constructor(message) {
        super(message?message:"你没有登录或登录态已过期");
        this.code = -1001;
        this.name = "NotLoggedInError";
        this.property = property;
    }
}

class InvalidInputError extends YunError {
    constructor(message) {
        super(message);
        this.code = -2001;
        this.name = "InvalidInputError";
        this.property = property;
    }
}

class NotYetBeginError extends YunError {
    constructor(message, data) {
        super(message?message:'事件还未开始', data);
        this.code = -1006;
        this.name = "NotYetBeginError";
        this.property = property;
    }
}

class RepeatError extends YunError {
    constructor(message, data) {
        super(message?message:'禁止重复操作', data);
        this.code = -1005;
        this.name = "RepeatError";
        this.property = property;
    }
}



module.exports = {YunError, BadRequestError, PropertyRequiredError, AlreadyLoggedInError, NotLoggedInError, InvalidInputError, NotYetBeginError, RepeatError}