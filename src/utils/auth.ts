//Dependecies
import config from "../config/config";
import {IUser} from "../models/user";
import jwt from "jsonwebtoken";

// Function to create the JWT token according to the user data
const createToken = (user: IUser) => {
  return jwt.sign(
    {id: user._id, email: user.email},
    config.jwtSecret, {
      expiresIn: 1200//20 minutes in seconds
    }
  );
};

export default {
  createToken
};
