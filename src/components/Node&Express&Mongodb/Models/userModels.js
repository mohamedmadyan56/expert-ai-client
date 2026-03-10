const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "please provida a valid email"],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: true,
    validate: {
      // لازم يكون جواها object فيه خاصيتين: validator و message
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
    message: "Password are not the same",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre("save", async function () {
  // لو الباسورد متغيرش، نعدي
  if (!this.isModified("password")) return;

  // تشفير الباسورد
  this.password = await bcrypt.hash(this.password, 12);

  // ضبط وقت تغيير الباسورد
  this.passwordChangedAt = Date.now() - 1000;

  // إزالة passwordConfirm قبل الحفظ
  this.passwordConfirm = undefined;
});

// أخفاء اليوزرز غير النشطين تلقائياً
userSchema.pre(/^find/, function() {
  this.find({ active: { $ne: false } });
});

userSchema.methods.correctPassword = async function (
  canidatePassword,
  userPassword,
) {
  return await bcrypt.compare(canidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeTamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimeTamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; 
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
