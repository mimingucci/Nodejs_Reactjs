const router=require('express').Router()
const ctrl=require('../controllers/user')

router.post('/register', ctrl.register)
module.exports=router
