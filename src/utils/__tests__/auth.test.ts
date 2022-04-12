import auth from '../auth';
import {IUser} from "../../models/types";

describe('Auth', () => {
  describe('Create token', () => {
    it('Should get a user and it returns a type string', () => {
      expect(typeof auth.createToken({_id:1, email: 'user@user.com'} as IUser)).toEqual('string');
    });
  });
});
