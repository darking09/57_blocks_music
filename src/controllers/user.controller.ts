// Dependecies
import { Request, Response } from "express";
import User, {IUser} from "../models/user";
import sanitize from 'mongo-sanitize';
import jwt from 'jsonwebtoken';
import config from "../config/config";

// Function to create the JWT token according to the user data
function createToken (user: IUser) {
  return jwt.sign({id: user._id, email: user.email}, config.jwtSecret, {
    expiresIn: 86400
  });
}

// Function to register a user with the password and email
export const signUp = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({msg: 'Please. Send you information to register'});
  }

  const sanitizedUser = {
    email: <string> sanitize(req.body.email),
    password: <string> sanitize(req.body.password)
  };

  const checkedUser = await User.findOne({email: sanitizedUser.email});

  if (checkedUser) {
    return res.status(400).json({msg: 'The user already exists'});
  }

  const newUser = new User(sanitizedUser);
  await newUser.save();

  return res.status(201).json(newUser);
};

// Function to log in to a user with the email and password
export const signIn = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({msg: 'Please. Send you information to register'});
  }

  const sanitizedUser = {
    email: <string> sanitize(req.body.email),
    password : <string> sanitize(req.body.password)
  };

  const checkedUser = await User.findOne({email: sanitizedUser.email});

  if (checkedUser) {
    const isMatch = await checkedUser.comparePassword(sanitizedUser.password);

    if (isMatch) {
      return res.status(200).json({token: createToken(checkedUser)});
    }
  }

  return res.status(400).json({msg: 'The user does not exists'});
};
