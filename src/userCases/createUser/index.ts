// Module Dependecies
import {Request, Response} from '../userModule';
import * as utils from '../../utils';
import * as userRepository from "../../repositories/userRepository";

// Function to register a user with the password and email
export const signUp = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        msg: utils.messages.MSG_EMPTY_REQUEST
      });
    }

    if (!utils.regularExpressions.validateEmail(req.body.email)) {
      return res.status(400).json({
        msg: utils.messages.MSG_EMAIL_FORMAT
      });
    }

    if (!utils.regularExpressions.validatePassword(req.body.password)) {
      return res.status(400).json({
        msg:utils.messages.MSG_PASSWORD_FORMAT
      });
    }

    const checkedUser = await userRepository.getOneByParameter(req.body);

    if (checkedUser) {
      return res.status(400).json({
        msg: utils.messages.MSG_EMAIL_REGISTERED.replace('$EMAIL', req.body.email || '')
      });
    }

    const newUser = await userRepository.save(req.body);

    return res.status(201).json({
      token: utils.auth.createToken(newUser)
    });
  } catch(err) {
    return res.status(500).json({
      msg: utils.messages.MSG_SERVER_ERROR_500
    });
  }
};
