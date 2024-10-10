const unAuthenticated = require("../errors/unauthenticated");
const jwt  = require("jsonwebtoken")
const authMiddleware = async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new unAuthenticated("No Token Provided"))
    }

    try {
        const data =  jwt.verify(token,process.env.JWT_SECRET)
        
        if(!data){
            return next(new unAuthenticated("Please Enter The Correct Credintials"))
        }

        req.info = data
        next()
        
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            return next (new unAuthenticated("Your Token Has Expired "))
        }
        next(error)
    }
    

}
module.exports = authMiddleware