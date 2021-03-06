const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your e-mail'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid e-mail'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: {
      // This only works on CREATE and SAVE methods, not on UPDATE by default
      validator: function (passwordConfirmEl) {
        return passwordConfirmEl === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // If password is not modified, the function exits
  if (!this.isModified('password')) return next();

  // Hashing the password
  this.password = await bcrypt.hash(this.password, 12);

  // Deleting password confirmation, only the hashed value is stored
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimestamp; // TRUE means user changed its password
  }

  return false; // FALSE means user did NOT change its password
};

const User = mongoose.model('User', userSchema);

module.exports = User;
