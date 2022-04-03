// Dependecies
import { Request, Response } from "express";
import sanitize from "mongo-sanitize";
import * as utils from '../utils';

export const index = (req: Request, res: Response) : Response => {
  try {

    const num : number = utils.number.parseStringToInt(sanitize(req.params.number), 0);

    return res.status(200).json({number: num});
  } catch(err) {
    return res.status(500).json({
      msg: utils.messages.MSG_SERVER_ERROR_500
    });
  }
};
