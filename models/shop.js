import { Schema, model } from "mongoose";
import pkg from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { hash, compare } = pkg;

const shopSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your shop name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your shop email address"],
    unique: true, // Ensure email is unique
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String, // Changed to String to accommodate various phone number formats
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

// Hash password before saving
shopSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await hash(this.password, 10);
});

// JWT Token Generation
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Password Comparison
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

export default model("Shop", shopSchema);
