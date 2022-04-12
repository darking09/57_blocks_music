// Module Dependecies
import * as utils from '../../utils';
import {Request, Response, sanitize} from '../userModule';
import * as userRepository from "../../repositories/userRepository";

// Function to log in to a user with the email and password
export const signIn = async (req: Request, res: Response) => {
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
        msg: utils.messages.MSG_PASSWORD_FORMAT
      });
    }

    const checkedUser = await userRepository.getOneByParameter(req.body);

    if (checkedUser) {
      const isMatch = await checkedUser.comparePassword(sanitize(req.body.password));

      if (isMatch) {
        return res.status(200).json({
          token: utils.auth.createToken(checkedUser)
        });
      }
    }

    return res.status(400).json({
      msg: utils.messages.MSG_USER_NOT_FOUND
    });
  } catch (err) {
    return res.status(500).json({
      msg: utils.messages.MSG_SERVER_ERROR_500
    });
  }
};
