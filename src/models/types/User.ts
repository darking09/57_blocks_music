// Dependencies
import {Document} from 'mongoose';

import {ISong} from './index';

// User interface
interface IUser extends Document {
  email: string;
  password: string;
  isPublic?: boolean;
  songs?: Array<ISong>;
  comparePassword: (p:string) => Promise<boolean>;
  isUniqueSong: (s:ISong) => Promise<boolean>;
}

export default IUser;
