// Dependecies
import db from '../../databaseUnitTest';
import User, {IUser} from '../user';

beforeAll(async () => await db.startConnection());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('User Model', () => {
  it('Should save a user', async () => {
    expect(async () => await User.create(userComplete));
  });

  it('Should find out a user', async () => {
    await User.create(userComplete);
    const users : Array<IUser> = await User.find({email: userComplete.email});
    expect(users.length).toEqual(1);
  });

  it('Should check the user\'s password after this was saved as true if I compare it with the same password', async () => {
    await User.create(userComplete);
    const user : IUser | null = await User.findOne({email: userComplete.email}).select('password');
    const checkedPassword = await user!.comparePassword(userComplete.password);
    expect(checkedPassword).toEqual(true);
  });

  it('Should check the user\'s password after this was saved as false if I compare it with another password', async () => {
    await User.create(userComplete);
    const user : IUser | null = await User.findOne({email: userComplete.email}).select('password');
    const checkedPassword = await user!.comparePassword('otherPassword');

    expect(checkedPassword).toEqual(false);
  });

  it('Should update the user\'s password', async () => {
    const newPassword : string = 'newPassword';

    const user = new User(userComplete);
    await user.save();

    user.password = newPassword;
    await user.save();

    const checkedPassword = await user.comparePassword(newPassword);
    expect(checkedPassword).toEqual(true);
  });

});


const userComplete = {
  email: 'f@f.com',
  password: 'password'
};
