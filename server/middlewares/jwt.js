const jwt=require('jsonwebtoken')

const generateAccessToken=(uid, role)=>{
   return jwt.sign({id : uid, role}, process.env.JWT_SECRET, {expiresIn: '7days'})
}

const generateRefreshToken=(uid)=>{
    return jwt.sign({id : uid}, process.env.JWT_SECRET, {expiresIn: '14days'})
 }

module.exports={
    generateAccessToken,
    generateRefreshToken
}