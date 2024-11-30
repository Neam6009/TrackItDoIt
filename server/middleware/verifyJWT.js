const jwt = require("jsonwebtoken")
const User = require("../models/user_model")

const verifyJWT = (req, res, next) => { 
    const cookie = req.headers.cookie;
    if(!cookie){
        return res.status(401).json({ message: "unauthorized" })
    }
    const ck = cookie.split("=")[1]

    ck.slice(2);
    jwt.verify(
        ck,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err){
                console.log(err)
                return res.status(403).json({ message: "forbidden" })
            } 
            req.user = await User.findOne({ email: decoded.email })
            next();
        }
    )
}

module.exports = verifyJWT