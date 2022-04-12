import User from "../models/user";
import {IUser} from '../models/types';
import {sanitize} from '../userCases/userModule';

export const getOneByParameter = async ({email}:{ email : string}) : Promise<IUser | null> => await User.findOne({
  email: sanitize(email)
}).select('password');

export const save = async ({email, password} : {email: string, password: string}) : Promise<IUser> => await new User({
  email: sanitize(email),
  password: sanitize(password)
}).save();
