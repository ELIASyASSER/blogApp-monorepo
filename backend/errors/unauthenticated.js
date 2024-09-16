const customError = require("./customErrors")
class unAuthenticated extends customError {
    constructor(msg) {
        super(msg)
        this.statusCode = 401
    }
}
module.exports = unAuthenticated
