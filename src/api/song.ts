// Dependecies
import { Router } from "express";
import passport from "passport";
import { index, create, update } from "../controllers/song.controller";

const router = Router();
const jwtOpts = {session: false};

router.get('/:type', passport.authenticate('jwt', jwtOpts), index);
router.post('/', passport.authenticate('jwt', jwtOpts), create);
router.put('/', passport.authenticate('jwt', jwtOpts), update);

module.exports = router;
