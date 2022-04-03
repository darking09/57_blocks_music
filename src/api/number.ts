// Dependecies
import { Router } from "express";
import passport from "passport";
import { index } from "../controllers/randomNumber.controller";

const router = Router();
const jwtOpts = {session: false};

router.get('/:number', passport.authenticate('jwt', jwtOpts), index);

module.exports = router;
