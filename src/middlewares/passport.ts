// Dependencies
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import User from '../models/user';
import config from "../config/config";

// Strategy options to define how it gets user information
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

// Strategy to get the user information through token
export default new Strategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (err) {
    console.log(err);
  }
});
