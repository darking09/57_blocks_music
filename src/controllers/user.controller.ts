// Dependecies
import { Request, Response } from "express";
import sanitize from "mongo-sanitize";
import * as utils from '../utils';
import User from "../models/user";


// Function to register a user with the password and email
export const signUp = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({msg: utils.meesages.MSG_EMPTY_REQUEST});
  }

  if (!utils.regularExpressions.validateEmail(req.body.email)) {
    return res.status(400).json({msg: utils.meesages.MSG_EMAIL_FORMAT});
  }

  if (!utils.regularExpressions.validatePassword(req.body.password)) {
    return res.status(400).json({msg:utils.meesages.MSG_PASSWORD_FORMAT});
  }

  const sanitizedUser = {
    email: <string> sanitize(req.body.email),
    password: <string> sanitize(req.body.password)
  };

  const checkedUser = await User.findOne({email: sanitizedUser.email});

  if (checkedUser) {
    return res.status(400).json({msg: utils.meesages.MSG_EMAIL_REGISTERED.replace('$EMAIL', req.body.email)});
  }

  const newUser = new User(sanitizedUser);
  await newUser.save();

  return res.status(201).json({token: utils.auth.createToken(newUser)});
};

// Function to log in to a user with the email and password
export const signIn = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({msg: utils.meesages.MSG_EMPTY_REQUEST});
  }

  if (!utils.regularExpressions.validateEmail(req.body.email)) {
    return res.status(400).json({msg: utils.meesages.MSG_EMAIL_FORMAT});
  }

  if (!utils.regularExpressions.validatePassword(req.body.password)) {
    return res.status(400).json({msg: utils.meesages.MSG_PASSWORD_FORMAT});
  }

  const sanitizedUser = {
    email: <string> sanitize(req.body.email),
    password : <string> sanitize(req.body.password)
  };

  const checkedUser = await User.findOne({email: sanitizedUser.email}).select('password');

  if (checkedUser) {
    const isMatch = await checkedUser.comparePassword(sanitizedUser.password);

    if (isMatch) {
      return res.status(200).json({token: utils.auth.createToken(checkedUser)});
    }
  }

  return res.status(400).json({msg: utils.meesages.MSG_USER_NOT_FOUND});
};
