// Dependencies
import {model, Schema, Document} from 'mongoose';
import bcrypt from 'bcrypt';

// User interface
export interface IUser extends Document {
  email: string;
  password: string;
  comparePassword: (p:string) => Promise<boolean>
}

// User Schema
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// Encrypt method for user's password
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;

  next();
});

// Decrypt method for user's password
userSchema.methods.comparePassword = async function(password:string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<IUser>('user', userSchema);
