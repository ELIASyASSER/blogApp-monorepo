const customError = require("./customErrors")
class BadRequest extends customError {
    constructor(msg) {
        super(msg)
        this.statusCode = 400
    }
}
module.exports = BadRequest
