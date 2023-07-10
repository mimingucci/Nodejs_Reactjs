const { default : mongoose, trusted} = require('mongoose')
mongoose.set('strictQuery', false)
const dbConnect=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI)
        if(conn.connection.readyState===1){
            console.log("Connected")
        }else{
            console.log("Fail")
        }
    } catch (error) {
        console.log("DB Connection Fail")
        console.log(process.env.MONGODB_URI)
        // throw new Error(error)
    }
}

module.exports=dbConnect