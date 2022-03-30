import { Router } from "express";
import passport from "passport";
import {IUser} from "../models/user";

const router = Router();

// Example private route
router.get('/music', passport.authenticate('jwt', {session: false}), (req, res) => {
  const user: IUser = <IUser>req.user;

  res.send(`Rock & Roll ${user.email}`);
});

export default router;
