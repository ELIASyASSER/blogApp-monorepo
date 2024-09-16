const customError = require("./customErrors")
class notFound extends customError {
    constructor(msg) {
        super(msg)
        this.statusCode = 404
    }
}
module.exports = notFound