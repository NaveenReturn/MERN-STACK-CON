const catchAsyncError = require('../middlewares/catchAsyncError')
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt')
const sendEmail = require("../utils/email");
const crypto = require('crypto');

//Register User- api/v1/register
exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const {name,email,password} = req.body

    let avatar;
      if(req.file){
           avatar = `${process.env.BACKEND_URL}/upload/user/${req.file.originalname}`
      }
  const user =  await User.create({
        name,
        email,
        password,
        avatar                           
    });
    // const token = user.getJwtToken();

    sendToken(user,201,res)
})


//Login User - api/v1/login
exports.loginUser = catchAsyncError(async (req,res,next)=>{
   const {email,password} = req.body

   if(!email || !password){
       return next(new ErrorHandler('please enter email & password',400))
   }

   //finding the user database
  const user = await User.findOne({email}).select('+password');

  if(!user){
    return next(new ErrorHandler('Invalid email or password',401))
  }

  if(! await user.isValidPassword(password)){
      return next(new ErrorHandler('Invalid email or password',401)) 
  }

  sendToken(user,201,res)

})

//logOut User - api/v1/logout
exports.logoutUser = (req,res,next)=>{
      
    res.cookie('token',null,{
      expires:new Date(Date.now()),
      httpOnly:true
    })
    .status(200)
    .json({
      success:true,
      message:'Loggedout'
    })
}

//forgetpassword - /api/v1//password/forgot
exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
  const user = await User.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorHandler('user not found with this email',404))
  }
  const resetToken = user.getResetToken();
  await user.save({validateBeforeSave:false})

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset url is as follows \n\n
  ${resetUrl} \n\n if you have not requested this email then ignore it.`

   try{

     sendEmail({
         email:user.email,
         subject:"DEEPACART Password Recovery",
         message
     })

     res.status(200).json({
         success:true,
         message:`Email send to ${user.email}`
     })

   }catch(error){
     user.resetPasswordToken = undefined;
     user.resetPasswordTokenExpire = undefined;
     await user.save({validateBeforeSave:false})
     return next(new ErrorHandler(error.message))
   }
})

//Reset Password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req,res,next) =>{

 const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire:{
      $gt : Date.now()
    }
  
  })

  if(!user){
    return next(new ErrorHandler('password reset token is invalid or expired'))
  }

  if(req.body.password !== req.body.confirmPassword){
     return next(new ErrorHandler('password does not match'))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({validateBeforeSave:false})

  sendToken(user,201,res)

})

//Get User Profile - /api/v1/myprofile
exports.getuserProfile = catchAsyncError(async (req,res,next)=>{
   const user  = await User.findById(req.user.id)
   res.status(200).json({
     success:true,
     user
   })
})

//Change Password - 
exports.changePassword = catchAsyncError(async (req,res,next)=>{
   const user = await User.findById(req.user.id).select('+password');

   //change old password
   if(!await user.isValidPassword(req.body.oldPassword)){
      return next(new ErrorHandler('Old password is incorrect',401))
   }

   //assingning now password

   user.password = req.body.password;
   await user.save();
   res.status(200).json({
    success:true,
  })
})

//Update Profile
exports.updateProfile = catchAsyncError(async (req,res,next)=>{
      const newUserDate = {
         name:req.body.name,
         email:req.body.email
      }

    const user =  await User.findByIdAndUpdate(req.user.id, newUserDate,{
        new: true,
        runValidators:true,

      })

    res.status(200).json({
       success:true,
       user
    })      
})

//Admin: Get All Users - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req,res,next)=>{
    
   const users =  await User.find();
   res.status(200).json({
      success:true,
      users
   })

})

//Admin: Get Specific User - /api/v1/admin/user
exports.getUser = catchAsyncError(async (req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
     return next(new ErrorHandler(`User not found wirh reques not id ${req.params.id} `))
  }
  res.status(200).json({
    success:true,
    user
 })

});

//Admin: Update User - /api/v1/admin/user
exports.updateUser = catchAsyncError(async (req,res,next)=>{
  const newUserDate = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
 }

const user =  await User.findByIdAndUpdate(req.params.id, newUserDate,{
   new: true,
   runValidators:true,

 })

res.status(200).json({
  success:true,
  user
})      
 
})

//Admin: Delete User - /api/v1/admin/users
exports.deleteUser = catchAsyncError(async (req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`User not found wirh reques not id ${req.params.id} `))
 }
   await user.deleteOne();
   res.status(200).json({
     success:true
   })
})