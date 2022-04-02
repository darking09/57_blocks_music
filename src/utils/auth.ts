//Dependecies
import { Request } from "express";
import config from "../config/config";
import {IUser} from "../models/types";
import User from "../models/user";
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

const chooseUserByTipe = async (req: Request, publicUser: string): Promise<IUserByType> => {
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
    user = <IUser>await User.findOne({ email: userAuth.email });
    type = 'private';
  } else {
    user = <IUser> await User.findOne({ email: publicUser });
    type = 'public';
  }

  return {
    user,
    type
  };
};

export default {
  createToken,
  chooseUserByTipe
};
