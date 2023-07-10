const userRoute=require('./user')
const {notFound, errHandler}=require('../middlewares/errorHandler')

const initRoute=(app)=>{
    app.use('/api/user', userRoute)

    app.use(notFound)
    app.use(errHandler)
}

module.exports=initRoute