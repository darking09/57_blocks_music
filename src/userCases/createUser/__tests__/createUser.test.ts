// Dependecies
import * as utils from '../../../utils';
import * as userRepository from "../../../repositories/userRepository";
import db from '../../../databaseUnitTest';
import { Request, Response } from 'express';
import {signUp} from '../index';


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

  describe('Sign up a user', () => {
    it('Should sign up a user', async () => {
      mockRequest = {
        body: {
          email: 'f@f.com',
          password: 'Password@p'
        }
      };
      await signUp(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(201);
    })

    it('Shouldn\'t sign up a user because it sent an email doesn\'t valid', async () => {
      mockRequest = {
        body: {
          email: 'f@fcom',
          password: 'Password@p'
        }
      };
      await signUp(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(400);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_EMAIL_FORMAT);
    })

    it('Shouldn\'t sign up a user because the email and password weren\'t sent', async () => {
      mockRequest = {
        body: {
        }
      };
      await signUp(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(400);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_EMPTY_REQUEST);
    })

    it('Shouldn\'t sign up a user because it already was registered', async () => {
      const body = {
        email: 'f@f.com',
        password: 'Password@p'
      };

      await userRepository.save(body);

      mockRequest = {
        body
      };
      await signUp(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(400);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_EMAIL_REGISTERED.replace('$EMAIL', body.email));
    })

    it('Shouldn\'t sign up a user because its password doesn\'t fulfill the requirement', async () => {
      const body = {
        email: 'f@f.com',
        password: 'password@p'
      };

      await userRepository.save(body);

      mockRequest = {
        body
      };
      await signUp(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(400);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_PASSWORD_FORMAT);
    })
  });
});
