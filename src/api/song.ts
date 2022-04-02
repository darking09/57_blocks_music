// Dependecies
import { Router } from "express";
import passport from "passport";
import { index, create, read, update, destroy } from "../controllers/song.controller";

const router = Router();
const jwtOpts = {session: false};

router.get('/', passport.authenticate('jwt', jwtOpts), index);
router.post('/', passport.authenticate('jwt', jwtOpts), create);
router.get('/:song_id', passport.authenticate('jwt', jwtOpts), read);
router.put('/', passport.authenticate('jwt', jwtOpts), update);
router.delete('/:song_id', passport.authenticate('jwt', jwtOpts), destroy);

module.exports = router;
