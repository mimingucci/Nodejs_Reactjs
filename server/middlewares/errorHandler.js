const notFound=(req, res, next)=>{
   const error=new Error(`Link ${req.originalUrl} not found!`)
   res.status(404)
   next(error)
}

const errHandler=(error, req, res, next)=>{
   const statusCode=(req.statusCode===200 || req.statusCode===null) ? 500 : req.statusCode
   return res.status(statusCode).json({
    success: false,
    mes: error?.message
   })
}

module.exports={
    notFound, 
    errHandler
}