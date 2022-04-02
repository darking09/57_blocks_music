// Dependecies
import * as utils from '../../utils';
import User from '../../models/user';
import db from '../../databaseUnitTest';
import { Request, Response } from 'express';
import * as types from '../../models/types';
import * as songController from '../song.controller';

const publicUser = {
  email: songController.PUBLIC_USER,
  password: '123',
  isPublic: true
}

const user = {
  email: 'f@f.com',
  password: '123'
};

let mongoPublicUser : types.IUser;
let mongoPrivateUser : types.IUser;

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
        user,
        body: {
          isPrivate: true,
          title: 'Sweet Child O\' MINE',
          album: 'Appetite for Destruction',
          duration: '5:56',
          author: 'Guns N\' Roses'
        }
      }

      await songController.create(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].msg).toEqual(utils.meesages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', 'private'));
    })

    it('Should register a new song for the music public catalog', async () => {
      mockRequest = {
        user,
        body: {
          isPrivate: false,
          title: 'Sweet Child O\' MINE',
          album: 'Appetite for Destruction',
          duration: '5:56',
          author: 'Guns N\' Roses'
        }
      }

      await songController.create(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].msg).toEqual(utils.meesages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', 'public'));
    })

    it('Shouldn\'t register a new song for the user\'s music catalog if this was registered previously', async () => {
      const song: types.ISong = <types.ISong>{
        title: 'Sweet Child O\' MINE',
        album: 'Appetite for Destruction',
        duration: '5:56',
        author: 'Guns N\' Roses'
      };

      await addSong(mongoPrivateUser, song);

      mockRequest = {
        user,
        body: {
          ...song,
          isPrivate: true
        }
      }

      await songController.create(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(422);
      const msg = utils.meesages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', 'private').replace('SONG_NAME', song.title);

      expect(json.mock.lastCall[0].msg).toEqual(msg);
    })

    it('Shouldn\'t register a new song for the music public catalog if this was registered previously', async () => {
      const song: types.ISong = <types.ISong>{
        title: 'Sweet Child O\' MINE',
        album: 'Appetite for Destruction',
        duration: '5:56',
        author: 'Guns N\' Roses'
      };

      await addSong(mongoPublicUser, song);

      mockRequest = {
        user,
        body: {
          ...song,
          isPrivate: false
        }
      }

      await songController.create(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(422);
      const msg = utils.meesages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', 'public').replace('SONG_NAME', song.title);

      expect(json.mock.lastCall[0].msg).toEqual(msg);
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
  mongoPrivateUser = await User.create(user);
  mongoPublicUser = await User.create(publicUser);
}

const addSong = async (user: types.IUser, song: types.ISong) => {
  await User.updateOne({_id: user._id}, {$push: {songs: song}});
}
