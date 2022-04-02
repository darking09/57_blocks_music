// Dependecies
import { Request, Response } from "express";
import sanitize from "mongo-sanitize";
import * as utils from '../utils';
import User, {IUser} from "../models/user";


export const index = async (req: Request, res: Response): Promise<Response> => {
  const user: IUser = <IUser>req.user;
  return res.status(200).json({msg: 'index', songs: [{}]});
};

export const create = async(req: Request, res: Response): Promise<Response> => {
  const user: IUser = <IUser>req.user;
  return res.json({msg: 'create', user});
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
