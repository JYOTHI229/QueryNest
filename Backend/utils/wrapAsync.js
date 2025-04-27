export const wrapAsync = (func)=>{
    return function(){
        func(req,res,next).catch((err)=>{next(err)});
    }

}