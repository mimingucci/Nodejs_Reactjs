const User=require('../models/user')
const asyncHandler=require('express-async-handler')
const {generateAccessToken, generateRefreshToken}=require('../middlewares/jwt')
const jwt=require('jsonwebtoken')
const sendMail=require('../ultils/sendMail')
const crypto=require('crypto')

const register=asyncHandler(async(req, res)=>{
    const {firstname, lastname, email, password}=req.body
    console.log(firstname+" "+lastname+" "+email+" "+password)
    if(!firstname || !lastname || !email || !password){
        return res.status(400).json({
            success: false,
            mes: "invalid user",
        })
    }
    const user=await User.findOne({email})
    if(user){
       throw new Error('User has already existed')
    }else{
        const info=await User.create(req.body) 
        return res.status(200).json({
            success: info ? true : false,
            mes: info ? 'Register is successfully' : 'Something went wrong'
        })
    }
})

const login=asyncHandler(async(req, res)=>{
    const {email, password}=req.body
    if(!email || !password){
        return res.status(400).json({
            success: false,
            mes: "invalid user",
        })
    }
    const response =await User.findOne({email})
    if(response && await response.isCorrectPassword(password)){
        const {password, role, ...other}=response.toObject()
        const accessToken=generateAccessToken(response._id, role)
        const refreshToken=generateRefreshToken(response._id)
        await User.findByIdAndUpdate(response._id, {refreshToken}, {new : true})
        res.cookie('refreshToken', refreshToken, {httpOnly : true, maxAge : 14*24*60*60*1000})
        return res.status(200).json({
            success: true,
            accessToken,
            userData: other
        })
    }else{
        throw new Error('Invalid credentials!')
    }
})

const getCurrent=asyncHandler(async(req, res)=>{
    const {id}=req.user
    const user=await User.findById(id).select('-refeshToken -password -role')
    return res.status(200).json({
        success: true,
        re: user ? user : 'User not found'
    })
})

const refreshAccessToken=asyncHandler(async(req, res)=>{
    const cookie= req.cookies
    if(!cookie && !cookie.refreshToken){
        throw new Error('No refresh token in cookie!')
    }
    const rs=await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response =  await User.findOne({_id : rs.id, refreshToken: cookie.refreshToken})
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Invalid Refresh Token'
    })
})

const logout=asyncHandler(async(req, res)=>{
    const cookie=req.cookies
    if(!cookie || !cookie.refreshToken){
        throw new Error('No refresh token in cookie')
    }
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new : true})
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})

const forgotPassword=asyncHandler(async(req, res)=>{
    const {email}=req.query
    if(!email)throw new Error('Missing email in request')
    const user=await User.findOne({email})
    if(!user){
        throw new Error('User not found')
    } 
    const resetToken=user.createPasswordChangedToken()
    await user.save()
    const html=`Please click blow link to reset password, this expires in 15 minutes ago. <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}">Click Here</a>`
    const data={
        email,
        html
    }
    const re=await sendMail(data)
    return res.status(200).json({
       success: true,
       rs
    })
})

const resetPassword=asyncHandler(async(req, res)=>{
    const {token, password}=req.body
    if(!token || !password)throw new Error('Missing field in request')
    const passwordResetToken=crypto.createHash('sha256').update(token).digest('hex')
    const user=await User.findOne({passwordResetToken, passwordResetExpires: {$gt: Date.now()}})
    if(!user)throw new Error('Invalid reset token')
    user.password=password
    user.passwordResetToken=undefined
    user.passwordResetExpires=undefined
    user.passwordChangeAt=Date.now()
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated Password' : 'Something wrong'
    })
})

module.exports={
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
}