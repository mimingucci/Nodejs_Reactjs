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
    const info=await User.create(req.body)
    return res.status(200).json({
        success: info ? true:  false,
        info
    })
})
module.exports={
    register
}