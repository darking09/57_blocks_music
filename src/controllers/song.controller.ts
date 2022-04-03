// Dependecies
import { Request, Response } from "express";
import sanitize from "mongo-sanitize";
import * as utils from '../utils';
import User from "../models/user";
import {IUser, ISong} from "../models/types";

export const PUBLIC_USER = 'user@public.com';

export const index = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {user, type} = await utils.auth.chooseUserByTipe(req, PUBLIC_USER);

    const maxSizeSongList = await User.aggregate([
      {
        $match:{
          _id: user._id
        },
      },
      {
        $project: {
          _id: 0,
          total_songs: {$size: ["$songs"]}
        }
      }
    ]);


    const { endPagination, startPagination } = utils.pagination.getStartAndEndPagination(req, maxSizeSongList[0].total_songs);

    const filtredSongs = await User.find({
      _id: user._id
    }, {
      _id: 0,
      email: 0,
      isPublic: 0,
      songs: {
        $slice: [startPagination, endPagination]
      }
    });

    const pagination = utils.pagination.paginationData(startPagination, endPagination, req, maxSizeSongList[0].total_songs);

    return res.status(200).json({
      listType: type,
      songs: filtredSongs[0].songs,
      pagination
    });
  } catch(err) {
    return res.status(500).json({
      msg: utils.messages.MSG_SERVER_ERROR_500
    });
  }
};

export const create = async(req: Request, res: Response): Promise<Response> => {
  try{
    const {user, type} = await utils.auth.chooseUserByTipe(req, PUBLIC_USER);

    const newSong : ISong = <ISong>{
      title: sanitize(req.body.title),
      duration: sanitize(req.body.duration),
      album: sanitize(req.body.album),
      author: sanitize(req.body.author)
    };

    if (await user.isUniqueSong(newSong)) {
      await User.updateOne({
        _id: user._id
      }, {
        $push: {
          songs: newSong
        }
      });

      return res.status(200).json({
        msg: utils.messages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', type),
        song: newSong
      });
    }

    return res.status(422).json({
      msg: utils.messages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', type).replace('SONG_NAME', req.body.title)
    });
  } catch(err) {
    return res.status(500).json({msg: 'err'});
  }
};

export const update = async(req: Request, res: Response): Promise<Response> => {
  const user : IUser = <IUser> req.user;

  try{
    if (!req.body._id) {
      return res.status(404).json({
        msg: utils.messages.MSG_SONG_UPDATE_MISSED_ID
      });
    }

    const song: any = await User.findOne({
      _id: user._id
    }, {
      _id: 0,
      songs: {
        $elemMatch: {
          _id: req.body._id
        }
      }
    }).catch(() => {return;});

    const songBeforeToUpdate : any = song?.songs[0] as any;

    if (!songBeforeToUpdate) {
      return res.status(404).json({
        msg: utils.messages.MSG_SONG_UPDATE_MISSED_SONG
      });
    }

    let songToUpdate: ISong = <ISong>{
      title: sanitize(req.body.title),
      duration: sanitize(req.body.duration),
      album: sanitize(req.body.album),
      author: sanitize(req.body.author)
    };

    if (Object.values(songToUpdate).filter(p => p).length === 0) {
      return res.status(422).json({
        msg: utils.messages.MSG_SONG_UPDATE_MISSED_ALL_PARAMETERS
      });
    }

    songToUpdate = {
      title: songToUpdate.title || songBeforeToUpdate.title,
      duration: songToUpdate.duration || songBeforeToUpdate.duration,
      album: songToUpdate.album || songBeforeToUpdate.album,
      author: songToUpdate.author || songBeforeToUpdate.author
    };

    await User.updateOne({
      _id: user._id,
      "songs._id": songBeforeToUpdate._id
    }, {
      $set: {
        "songs.$.title": songToUpdate.title,
        "songs.$.duration": songToUpdate.duration,
        "songs.$.album": songToUpdate.album,
        "songs.$.author": songToUpdate.author,
      }
    });

    return res.status(200).json({
      msg: utils.messages.MSG_SONG_UPDATE_SUCCEED.replace('$SONG_NAME', songToUpdate.title),
      song: {
        _id: songBeforeToUpdate._id,
        ...songToUpdate
      }
    });
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      msg: utils.messages.MSG_SERVER_ERROR_500
    });
  }
};

// TODO: these methods might be implemented for future developments
export const read = async(req: Request, res: Response): Promise<Response> => {
  return res.json({ });
};

export const destroy = async(req: Request, res: Response): Promise<Response> => {
  return res.json({});
};
