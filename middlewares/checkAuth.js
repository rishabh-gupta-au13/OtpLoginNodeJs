const User=require("../models/user.model")

const {AUTH_TOKEN_MISSING_ERR,
    AUTH_HEADER_MISSING_ERR,
    JWT_DECODE_ERR,
    USER_NOT_FOUND_ERR}=require("../error")
const {verifyJwtToken}=require("../utils/token.util")
module.exports=async(req,res,next)=>{
    try{
        // check for auth header from client
        const header=req.headers.authorization
        console.log(header,"this is the header")
        if(!header){
            next({status:403,message:AUTH_HEADER_MISSING_ERR})
            return
        }
        // verify auth token
        const token=header
        console.log(token ,"this is the token")
        if(!token){
            next({status:403,message:AUTH_TOKEN_MISSING_ERR})
        }
        const userId=verifyJwtToken(token,next)

        if(!userId){
            next({status:403,message:JWT_DECODE_ERR})
        }
        const user=await User.findById(userId)

        if(!user){
            next({status:404,message:USER_NOT_FOUND_ERR})
        }
        res.locals.user=user

        next()
    }catch(err){
        next(err)
    }
}
