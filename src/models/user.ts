// Dependencies
import mongoose, {model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';

// User interface
import {IUser, ISong} from './types';

// User Schema
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  songs: [
    {
      title: {
        type: String,
        required: true
      },
      duration: {
        type: String,
        required: true
      },
      album: {
        type: String,
        required: true
      },
      author: {
        type: String,
        required: true
      }
    }
  ]
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

userSchema.methods.isUniqueSong = async function(song:ISong): Promise<boolean> {
  return !await model('user').findOne({
    songs:
    {
      $elemMatch:
      {
        title:
        {
          $eq: song.title
        },
        album:
        {
          $eq: song.album
        },
        author:
        {
          $eq: song.author
        },
      }
    }
  });
};

export default model<IUser>('user', userSchema);
