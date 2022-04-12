// Dependecies
import * as utils from '../../../utils';
import * as userRepository from "../../../repositories/userRepository";
import db from '../../../databaseUnitTest';
import { Request, Response } from 'express';
import {signIn} from '../index';

beforeAll(async () => await db.startConnection());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());


describe('User Controller', () => {
  let mockRequest = {};
  let mockResponse: Partial<Response> = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  })

  describe('Sign in a user', () => {
    it('Should sign in a user', async () => {
      const body = {
        email: 'f.f@f.com',
        password: 'Password!p'
      };

      await userRepository.save(body);

      mockRequest = {
        body
      };
      await signIn(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
    })

    it('Shouldn\'t sign in a user because it sent an email doesn\'t valid', async () => {
      const body = {
        email: 'f@fcom',
        password: 'Password!p'
      };

      await userRepository.save(body);

      mockRequest = {
        body
      };
      await signIn(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(400);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_EMAIL_FORMAT);
    })

    it('Shouldn\'t sign in a user because it wasn\'t registered previously', async () => {
      mockRequest = {
        body: {
          email: 'f@f.com',
          password: 'Password!p'
        }
      };
      await signIn(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(400);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_USER_NOT_FOUND);
    })

    it('Shouldn\'t sign in a user because it sent a wrong password', async () => {
      const body = {
        email: 'f@f.com',
        password: 'Password!p'
      };

      await userRepository.save(body);

      mockRequest = {
        body: {
          email: 'f@f.com',
          password: 'Password!k'
        }
      };
      await signIn(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(400);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_USER_NOT_FOUND);
    })

    it('Shouldn\'t sign in a user because its password doesn\'t fulfill the requirement', async () => {
      const body = {
        email: 'f@f.com',
        password: 'passwordSp'
      };

      await userRepository.save(body);

      mockRequest = {
        body
      };
      await signIn(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(400);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_PASSWORD_FORMAT);
    })
  })
});
