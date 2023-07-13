const User=require('../models/user')
const asyncHandler=require('express-async-handler')
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
        return res.status(200).json({
            success: true,
            userData: other
        })
    }else{
        throw new Error('Invalid credentials!')
    }
})
module.exports={
    register,
    login,
}