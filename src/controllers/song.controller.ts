// Dependecies
import { Request, Response } from "express";
import sanitize from "mongo-sanitize";
import * as utils from '../utils';
import User from "../models/user";
import {IUser, ISong} from "../models/types";

export const PUBLIC_USER = 'user@public.com';

export const index = async (req: Request, res: Response): Promise<Response> => {
  const user: IUser = <IUser>req.user;
  return res.status(200).json({msg: 'index', songs: [{}]});
};

export const create = async(req: Request, res: Response): Promise<Response> => {
  let user: IUser;
  let type: string;

  if (req.body.isPrivate) {
    const userAuth : IUser = <IUser>req.user;
    user = <IUser>await User.findOne({ email: userAuth.email });
    type = 'private';
  } else {
    user = <IUser> await User.findOne({ email: PUBLIC_USER });
    type = 'public';
  }

  const newSong : ISong = <ISong>{
    title: sanitize(req.body.title),
    duration: sanitize(req.body.duration),
    album: sanitize(req.body.album),
    author: sanitize(req.body.author)
  };

  if (await user.isUniqueSong(newSong)) {
    User.updateOne({_id: user._id}, {$push: {songs: newSong}});

    return res.status(200).json({msg: utils.meesages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', type), song: newSong});
  }

  return res.status(422).json({msg: utils.meesages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', type).replace('SONG_NAME', req.body.title)});
};

export const update = async(req: Request, res: Response): Promise<Response> => {
  const user: IUser = <IUser>req.user;
  return res.json({msg: 'update', user});
};

// TODO: these methods might be implemented for future developments
export const read = async(req: Request, res: Response): Promise<Response> => {
  return res.json({ });
};

export const destroy = async(req: Request, res: Response): Promise<Response> => {
  return res.json({});
};
