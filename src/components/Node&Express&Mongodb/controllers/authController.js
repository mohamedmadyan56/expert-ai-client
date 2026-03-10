const { promisify } = require("util");
const User = require("./../Models/userModels");
const catchAsync = require("express-async-handler");
const dotenv = require("dotenv");
const AppError = require("./../Utils/appError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require('./../Utils/email')
dotenv.config({ path: "./config.env" });

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {

  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
    
    httpOnly:true
  }
  if(process.env.NODE_ENV==='production')cookieOptions.secure=true;
  res.cookie('jwt',token,cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role:req.body.role
  });
  createSendToken(newUser,201,res)
 
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user,200,res)

  
});

//  Protect Middleware for authorization 
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError("You are not logged in please log in to get access", 401),
    );
  }

  const decoded = await promisify(jwt.verify).call(
    jwt,
    token,
    process.env.JWT_SECRET,
  );
  console.log(decoded);

  const currentUser = await User.findById(decoded.id).select('+active');
  if (!currentUser || currentUser.active === false) {
    return next(
      new AppError("the token belinging to this does no longer exist  ", 401),
    );
  }

  // if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password recently changed. Please log in again", 401),
    );
  }

  req.user = currentUser;

  next();
});



// for authorization 
exports.restrictTo = (...roles)=>{
  return (req,res,next)=>{
      if(!roles.includes(req.user.role)){
        return next(new AppError("you don't have permisstion to perform this action",403))
      }
       next();
  }
  
}


exports.forgetPassword=catchAsync(async(req,res,next)=>{
 const user = await User.findOne({email:req.body.email});
 if(!user){
   return next(new AppError('There is no user with email address',404));

 }
   
 const resetToken = user.createPasswordResetToken();
 await user.save({
   validateBeforeSave:false

 })

 const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

 const message = `forget your password? submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.\n If you didn't forget your password, please ignore this email !`;
 try{
   await sendEmail({
   email:user.email,
   subject:'your password reset token (valid for 10m) ',
   message
 });
 res.status(200).json({
   status:'success',
   message:'token sent to email'
 });
 }catch(err){
   user.passwordResetToken = undefined;      // مسح الـ token
   user.passwordResetExpires = undefined;  // مسح وقت الانتهاء
   await user.save({ validateBeforeSave: false });  
   console.log('EMAIL ERROR 💥:', err);
    return next(new AppError("There was an error sending the email. Try again later.", 500));
 }

})


exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
  .createHash('sha256')
  .update(req.params.token)
  .digest('hex');



const user = await User.findOne({
    passwordResetToken: hashedToken, // ✅ التوكن يروح لحقل التوكن
    passwordResetExpires: { $gt: Date.now() } // ✅ والوقت يروح لحقل الوقت
  });

  if(!user){
    return next(new AppError('token is invalid or has expired',400));

  }
  user.password=req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken=undefined;
  user.passwordResetExpires=undefined;
  await user.save();
    createSendToken(user,200,res)

  
 
});



exports.updatePassword = async (req,res,next)=>{
const user = await User.findById(req.user.id).select('+password');
  if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
    return next(new AppError('your current password is wrong',401));

  }

  user.password=req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;
  await user.save();
   createSendToken(user,200,res)

}



















// but it will be in database we didn't delete the account we just deactive it until his owner reactive the account