import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wingmann');
  
  // Create an interviewer
  const autoPassword = Math.random().toString(36).slice(-8);
  console.log('Plaintext password:', autoPassword);
  
  const interviewer = await User.create({
    name: 'Test Int',
    email: 'testint' + Date.now() + '@example.com',
    password: autoPassword,
    role: 'interviewer'
  });
  
  console.log('Created Interviewer ID:', interviewer._id);
  console.log('Hashed Password stored:', interviewer.password);
  
  const isMatch = await interviewer.matchPassword(autoPassword);
  console.log('Does matchPassword return true on freshly generated object?', isMatch);
  
  // Refetch
  const refetched = await User.findById(interviewer._id);
  const isMatchRefetch = await refetched.matchPassword(autoPassword);
  console.log('Does matchPassword return true on refetched object?', isMatchRefetch);
  
  await mongoose.disconnect();
}

run();
