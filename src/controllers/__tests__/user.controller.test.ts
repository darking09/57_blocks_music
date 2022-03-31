// Dependecies
import * as utils from '../../utils';
import User from '../../models/user';
import db from '../../databaseUnitTest';
import * as userController from '../user.controller';
import { Request, Response } from 'express';

beforeAll(async () => await db.startConnection());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());


describe('User Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  })

  describe('Sign up a user', () => {
    it('Should sign up a user', async () => {
      mockRequest = {
        body: {
          email: 'f@f.com',
          password: 'Password@p'
        }
      };
      await userController.signUp(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(201);
    })

    it('Shouldn\'t sign up a user because it sent an email doesn\'t valid', async () => {
      mockRequest = {
        body: {
          email: 'f@fcom',
          password: 'Password@p'
        }
      };
      await userController.signUp(mockRequest, mockResponse);

      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(400);
      expect(mockResponse.json.mock.calls[0][0].msg).toEqual(utils.meesages.MSG_EMAIL_FORMAT);
    })

    it('Shouldn\'t sign up a user because the email and password weren\'t sent', async () => {
      mockRequest = {
        body: {
        }
      };
      await userController.signUp(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(400);
      expect(mockResponse.json.mock.calls[0][0].msg).toEqual(utils.meesages.MSG_EMPTY_REQUEST);
    })

    it('Shouldn\'t sign up a user because it already was registered', async () => {
      const body = {
        email: 'f@f.com',
        password: 'Password@p'
      };

      await User.create(body);

      mockRequest = {
        body
      };
      await userController.signUp(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(400);
      expect(mockResponse.json.mock.calls[0][0].msg).toEqual(utils.meesages.MSG_EMAIL_REGISTERED.replace('$EMAIL', body.email));
    })

    it('Shouldn\'t sign up a user because its password doesn\'t fulfill the requirement', async () => {
      const body = {
        email: 'f@f.com',
        password: 'password@p'
      };

      await User.create(body);

      mockRequest = {
        body
      };
      await userController.signUp(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(400);
      expect(mockResponse.json.mock.calls[0][0].msg).toEqual(utils.meesages.MSG_PASSWORD_FORMAT);
    })
  });

  describe('Sign in a user', () => {
    it('Should sign in a user', async () => {
      const body = {
        email: 'f.f@f.com',
        password: 'Password!p'
      };

      await User.create(body);

      mockRequest = {
        body
      };
      await userController.signIn(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(200);
    })

    it('Shouldn\'t sign in a user because it sent an email doesn\'t valid', async () => {
      const body = {
        email: 'f@fcom',
        password: 'Password!p'
      };

      await User.create(body);

      mockRequest = {
        body
      };
      await userController.signUp(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(400);
      expect(mockResponse.json.mock.calls[0][0].msg).toEqual(utils.meesages.MSG_EMAIL_FORMAT);
    })

    it('Shouldn\'t sign in a user because it wasn\'t registered previously', async () => {
      mockRequest = {
        body: {
          email: 'f@f.com',
          password: 'Password!p'
        }
      };
      await userController.signIn(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(400);
      expect(mockResponse.json.mock.calls[0][0].msg).toEqual(utils.meesages.MSG_USER_NOT_FOUND);
    })

    it('Shouldn\'t sign in a user because it sent a wrong password', async () => {
      const body = {
        email: 'f@f.com',
        password: 'Password!p'
      };

      await User.create(body);

      mockRequest = {
        body: {
          email: 'f@f.com',
          password: 'Password!k'
        }
      };
      await userController.signIn(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(400);
      expect(mockResponse.json.mock.calls[0][0].msg).toEqual(utils.meesages.MSG_USER_NOT_FOUND);
    })

    it('Shouldn\'t sign in a user because its password doesn\'t fulfill the requirement', async () => {
      const body = {
        email: 'f@f.com',
        password: 'passwordSp'
      };

      await User.create(body);

      mockRequest = {
        body
      };
      await userController.signIn(mockRequest, mockResponse);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toEqual(400);
      expect(mockResponse.json.mock.calls[0][0].msg).toEqual(utils.meesages.MSG_PASSWORD_FORMAT);
    })
  })
});
