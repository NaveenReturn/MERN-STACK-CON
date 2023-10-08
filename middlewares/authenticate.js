const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/userModel')
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
//  const sendEmail = require("../utils/email");

exports.isAuthenticatedUser = catchAsyncError(async (req,res,next)=>{
    const{token} = req.cookies;
    
    if(!token){
        return next(new ErrorHandler('Login First to handle this resoursce'),401)                           
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next();
})

exports.authorizeRoles = (...roles)=>{
     return (req,res,next)=>{
          if(!roles.includes(req.user.role)){
               return next(new ErrorHandler(`Role ${req.user.role} is not allowed`,401))                    
          } 
          next()                        
     }                              
}

// exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
//    const user = await User.findOne({email:req.body.email});

//    if(!user){
//      return next(new ErrorHandler('user not found with this email',404))
//    }
//    const resetToken = user.getResetToken();
//    await user.save({validateBeforeSave:false})

//    //Create reset url
//    const resetUrl = `${req.protocal}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

//    const message = `your password reset url is as follows \n\n
//    ${resetUrl} \n\n if you have not requested this email then ignore it.`

//     try{

//       sendEmail({
//           email:user.email,
//           subject:"DEEPACART Password Recovery",
//           message
//       })

//       res.status(200).json({
//           success:true,
//           message:`Email send to ${user.email}`
//       })

//     }catch(error){
//       user.resetPasswordToken = undefined;
//       user.resetPasswordTokenExpire = undefined;
//       await user.save({validateBeforeSave:false})
//       return next(new ErrorHandler(error.message))
//     }
// })