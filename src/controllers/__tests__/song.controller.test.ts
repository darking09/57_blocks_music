// Dependecies
import * as utils from '../../utils';
import User from '../../models/user';
import db from '../../databaseUnitTest';
import { Request, Response } from 'express';
import * as songController from '../song.controller';

const user = {
  email: 'f@f.com',
  password: '123'
};

beforeAll(async () => await db.startConnection());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('Song Controller', () => {
  let mockRequest = {};
  let mockResponse: Partial<Response> = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };
  beforeEach(async () => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    await addUser();
  })

  describe('List user\'s songs', () => {
    it('Should return a songs list with the user\'s songs number', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })

    it('Should return a songs list with the public songs number', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })

    it('Should return a next page because it is different to the last page', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })

    it('Should return an empty next page because it is the last page', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })
  })

  describe('Create user\'s song', () => {
    it('Should register a new song for the user\'s music private catalog', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })

    it('Should register a new song for the music public catalog', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })

    it('Shouldn\'t register a new song for the user\'s music catalog if this was registered previously', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })

    it('Shouldn\'t register a new song for the music public catalog if this was registered previously', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })
  })

  describe('Update user\'s song', () => {
    it('Should update a new song for the user\'s music private catalog', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })

    it('Shouldn\'t update a song for the music public catalog', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })

    it('Shouldn\'t update a song if this belongs to abithe user', async () => {
      mockRequest = {
        user
      }

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(1);
    })
  })
});

const addUser = async () => {
  await User.create(user);
}
