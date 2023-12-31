const router=require('express').Router()
const ctrl=require('../controllers/user')
const {verifyAccessToken} =require('../middlewares/verifyToken')

router.post('/register', ctrl.register)
router.post('/login', ctrl.login)
router.get('/current', verifyAccessToken, ctrl.getCurrent)
router.post('/refreshtoken', ctrl.refreshAccessToken)
router.get('/logout', ctrl.logout)
router.get('/forgotpassword', ctrl.forgotPassword)
router.get('/resetpassword', ctrl.resetPassword)
module.exports=router
