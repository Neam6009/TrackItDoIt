const User = require('../models/user_model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are require"})
    }

    const foundUser = await User.findOne({email}).exec()

    if(!foundUser){
        return res.status(401).json({message:"Unauthorized"})
    }

    const isPassword = await bcrypt.compare(password,foundUser.password)

    if(!isPassword) return res.status(401).json({message:"Wrong credentials"})

    const accessToken = jwt.sign({
        "UserData":{
            "email":foundUser.email
        }
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:'1d'}
    )

    const refreshToken = jwt.sign(
        {"email" : foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'5d'}
       
    )

    res.cookie('jwt',refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'None',
        maxAge:7*24*60*60*1000
    })

    res.json({accessToken})
}

const refresh = (req,res)=>{
    const cookies = req.cookie

    if(!cookies?.jwt) return res.status(401).json({message:"unauthorized"})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async(err, decoded) => {
            if(err) return res.status(403).json({message:'Forbidden'})

            const foundUser = await User.findOne({email:decoded.email})

            if(!foundUser) return res.status(401).json({message:"unauthorized"})
            
            const accessToken = jwt.sign(
                {
                    "UserData":{
                    "email":foundUser.email
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'1d'}
            )

            res.json({accessToken})
        
        }

    )

}

const logout = (req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt)  return res.sendStatus(204)
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
    res.json({message: 'Cookie cleared'})

}

module.exports ={
    login,
    refresh,
    logout,
}