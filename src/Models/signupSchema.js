// import mongoose from 'mongoose';
const mongoose = require('mongoose')
// const { Schema } = mongoose.Schema;

const signupSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
   }, // String is shorthand for {type: String}
  last_name:  {
    type: String,
    required: true
    },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  pw:  {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('UserSignup', signupSchema)

// module.export = User