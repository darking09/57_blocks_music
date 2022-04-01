// Dependecies
import { Request, Response } from "express";
import sanitize from "mongo-sanitize";
import * as utils from '../utils';
import User, {IUser} from "../models/user";


export const index = (req: Request, res: Response): Response => {
  const user: IUser = <IUser>req.user;
  return res.json({msg: 'index', user});
};

export const create = async(req: Request, res: Response): Promise<Response> => {
  const user: IUser = <IUser>req.user;
  return res.json({msg: 'create', user});
};

export const read = async(req: Request, res: Response): Promise<Response> => {
  const user: IUser = <IUser>req.user;
  return res.json({msg: 'read', user});
};

export const update = async(req: Request, res: Response): Promise<Response> => {
  const user: IUser = <IUser>req.user;
  return res.json({msg: 'update', user});
};

export const destroy = async(req: Request, res: Response): Promise<Response> => {
  const user: IUser = <IUser>req.user;
  return res.json({msg: 'delete', user});
};
