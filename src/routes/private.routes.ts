import { Router } from "express";
import passport from "passport";
import { index, create, read, update, destroy } from "../controllers/song.controller";

const router = Router();

// Example private route
router.get('/music', passport.authenticate('jwt', {session: false}), index);
router.post('/music', passport.authenticate('jwt', {session: false}), create);
router.get('/music/:song_id', passport.authenticate('jwt', {session: false}), read);
router.put('/music', passport.authenticate('jwt', {session: false}), update);
router.delete('/music/:song_id', passport.authenticate('jwt', {session: false}), destroy);

export default router;
