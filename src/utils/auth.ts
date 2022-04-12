//Dependecies
import * as userRepository from '../repositories/userRepository';
import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import {IUser} from "../models/types";
import * as utils from '../utils';
import jwt from "jsonwebtoken";

interface IUserByType {
  user: IUser;
  type: string;
}

// Function to create the JWT token according to the user data
const createToken = (user: IUser) => {
  return jwt.sign(
    {id: user._id, email: user.email},
    config.jwtSecret, {
      expiresIn: 1200//20 minutes in seconds
    }
  );
};

const chooseUserByType = async (req: Request, publicUser: string): Promise<IUserByType> => {
  let user: IUser;
  let type: string;
  let isPrivate: boolean;

  if (req.params.type) {
    isPrivate = req.params.type === 'private';
  } else {
    isPrivate = req.body.isPrivate;
  }

  if (isPrivate) {
    const userAuth : IUser = <IUser>req.user;
    user = <IUser>await userRepository.getOneByParameter(userAuth);
    type = 'private';
  } else {
    user = <IUser> await userRepository.getOneByParameter({ email: publicUser });
    type = 'public';
  }

  return {
    user,
    type
  };
};

const validateParameters = (req: Request, res: Response, next: NextFunction ) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      msg: utils.messages.MSG_EMPTY_REQUEST
    });
  }

  if (!utils.regularExpressions.validateEmail(req.body.email)) {
    return res.status(400).json({
      msg: utils.messages.MSG_EMAIL_FORMAT
    });
  }

  if (!utils.regularExpressions.validatePassword(req.body.password)) {
    return res.status(400).json({
      msg: utils.messages.MSG_PASSWORD_FORMAT
    });
  }

  next();
};


export default {
  createToken,
  chooseUserByType,
  validateParameters
};
