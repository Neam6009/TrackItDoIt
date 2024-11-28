const rateLimit = require("express-rate-limit")

const loginLimiter = rateLimit({
    windowMs:60*1000,
    max:10,
    message:{
        message:"Too many login attempts, try again after a minute"
    },
    handler:(req,res,next,options)=>{
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders:true,
    legacyHeaders: false
})

module.exports = loginLimiter
