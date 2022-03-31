// Dependecies
import db from '../test/databaseUnitTest';
import User, {IUser} from '../models/user';

beforeAll(async () => await db.startConnection());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('user', () => {
  it('first', async () => {
    expect(async () => await User.create(userComplete));
  });
});


const userComplete = {
  email: 'f@f.com',
  password: 'password'
};
