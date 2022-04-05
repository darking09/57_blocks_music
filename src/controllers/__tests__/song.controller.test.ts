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
        user,
        query: {
          page: 1
        },
        params: {
          type: 'private'
        },
        protocol: 'http',
        hostname: 'test.com',
        baseUrl: '/list'
      };

      const url = `http://test.com/list/private?page=2`
      await addManySongsToAUser(mongoPrivateUser, 10);

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(5);
      expect(json.mock.lastCall[0].listType).toEqual('private');
      expect(json.mock.lastCall[0].pagination.next_page).toEqual(2);
      expect(json.mock.lastCall[0].pagination.next_url).toEqual(url);
    })

    it('Should return a songs list with the public songs number', async () => {
      mockRequest = {
        user,
        query: {
          page: 1
        },
        params: {
          type: 'public'
        },
        protocol: 'http',
        hostname: 'test.com',
        baseUrl: '/list'
      }

      const url = `http://test.com/list/public?page=2`
      await addManySongsToAUser(mongoPublicUser, 10);

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(5);
      expect(json.mock.lastCall[0].listType).toEqual('public');
      expect(json.mock.lastCall[0].pagination.next_page).toEqual(2);
      expect(json.mock.lastCall[0].pagination.next_url).toEqual(url);
    })

    it('Should return empty pagination object because it is the last page', async () => {
      mockRequest = {
        user,
        query: {
          page: 2
        },
        params: {
          type: 'public'
        },
        protocol: 'http',
        hostname: 'test.com',
        baseUrl: '/list'
      }

      await addManySongsToAUser(mongoPublicUser, 10);

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(5);
      expect(json.mock.lastCall[0].pagination.next_page).toEqual(undefined);
      expect(json.mock.lastCall[0].pagination.next_url).toEqual(undefined);
    })

    it('Should return an empty list because there isn\'t more items', async () => {
      mockRequest = {
        user,
        query: {
          page: 2
        },
        params: {
          type: 'public'
        },
        protocol: 'http',
        hostname: 'test.com',
        baseUrl: '/list'
      }

      await addManySongsToAUser(mongoPublicUser, 5);

      await songController.index(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].songs.length).toEqual(0);
      expect(json.mock.lastCall[0].pagination.next_page).toEqual(undefined);
      expect(json.mock.lastCall[0].pagination.next_url).toEqual(undefined);
    })
  })

  describe('Create user\'s song', () => {
    it('Should register a new song for the user\'s music private catalog', async () => {
      mockRequest = {
        user,
        body: {
          isPrivate: true,
          title: 'Sweet Child O\' Mine',
          album: 'Appetite for Destruction',
          duration: '5:56',
          author: 'Guns N\' Roses'
        },
        params: {

        }
      }

      await songController.create(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;
      const userAfterInsert: types.IUser = <types.IUser> await User.findOne({email: mongoPrivateUser.email});

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', 'private'));
      expect(userAfterInsert.songs?.length).toEqual(1);
    })

    it('Should register a new song for the music public catalog', async () => {
      mockRequest = {
        user,
        body: {
          isPrivate: false,
          title: 'Sweet Child O\' Mine',
          album: 'Appetite for Destruction',
          duration: '5:56',
          author: 'Guns N\' Roses'
        },
        params: {

        }
      }

      await songController.create(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;
      const userAfterInsert: types.IUser = <types.IUser> await User.findOne({email: mongoPublicUser.email});

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);
      expect(json.mock.lastCall[0].msg).toEqual(utils.messages.MSG_SONG_REGISTER_SUCCEED.replace('$TYPE', 'public'));
      expect(userAfterInsert.songs?.length).toEqual(1);
    })

    it('Shouldn\'t register a new song for the user\'s music catalog if this was registered previously', async () => {
      const song: types.ISong = <types.ISong>{
        title: 'Sweet Child O\' Mine',
        album: 'Appetite for Destruction',
        duration: '5:56',
        author: 'Guns N\' Roses'
      };

      await addSong(mongoPrivateUser, song);

      mockRequest = {
        user: mongoPrivateUser,
        body: {
          ...song,
          isPrivate: true
        },
        params: {

        }
      }

      await songController.create(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;
      const userAfterInsert: types.IUser = <types.IUser> await User.findOne({email: mongoPrivateUser.email});

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(422);
      const msg = utils.messages.MSG_SONG_REGISTER_DUPLICATED.replace('$TYPE', 'private').replace('$SONG_NAME', song.title);

      expect(json.mock.lastCall[0].msg).toEqual(msg);
      expect(userAfterInsert.songs?.length).toEqual(1);
    })

    it('Shouldn\'t register a new song for the music public catalog if this was registered previously', async () => {
      const song: types.ISong = <types.ISong>{
        title: 'Sweet Child O\' Mine',
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
        },
        params: {

        }
      }

      await songController.create(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json
      const userAfterInsert: types.IUser = <types.IUser> await User.findOne({email: mongoPublicUser.email});

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(422);
      const msg = utils.messages.MSG_SONG_REGISTER_DUPLICATED.replace('$TYPE', 'public').replace('$SONG_NAME', song.title);

      expect(json.mock.lastCall[0].msg).toEqual(msg);
      expect(userAfterInsert.songs?.length).toEqual(1);
    })
  })

  describe('Update user\'s song', () => {
    it('Should update a new song for the user\'s music private catalog', async () => {
      const song: types.ISong = <types.ISong>{
        title: 'Sweet Child O\' Mine',
        album: 'Appetite for Destruction',
        duration: '5:56',
        author: 'Guns N\' Roses'
      };

      await addSong(mongoPrivateUser, song);

      let userAfterInsert: types.IUser = <types.IUser> await User.findOne({email: mongoPrivateUser.email});
      let savedSong :any = userAfterInsert?.songs;

      mockRequest = {
        user: mongoPrivateUser,
        body: {
          _id: savedSong[0]._id.toString(),
          title: 'Sweet Child O\' Mine 1',
          album: 'Appetite for Destruction 1',
          duration: '5:58',
          author: 'Guns N\' Roses 1',
        },
        params: {

        }
      }

      await songController.update(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json;
      const req : Request = mockRequest as Request;
      userAfterInsert = <types.IUser> await User.findOne({email: mongoPrivateUser.email});
      savedSong = userAfterInsert?.songs;

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(200);

      const msg = utils.messages.MSG_SONG_UPDATE_SUCCEED.replace('$SONG_NAME', req.body.title);
      expect(json.mock.lastCall[0].msg).toEqual(msg);
      expect({
        _id: savedSong[0]._id.toString(),
        title: savedSong[0].title,
        album: savedSong[0].album,
        duration: savedSong[0].duration,
        author: savedSong[0].author,
      }).toEqual(req.body);
    })

    it('Shouldn\'t update a song because the _id wasn\'t sent on the request', async () => {
      mockRequest = {
        user: mongoPrivateUser,
        body: {
          title: 'Sweet Child O\' Mine 1',
          album: 'Appetite for Destruction 1',
          duration: '5:58',
          author: 'Guns N\' Roses 1',
        },
        params: {

        }
      }

      await songController.update(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(404);
      const msg = utils.messages.MSG_SONG_UPDATE_MISSED_ID;
      expect(json.mock.lastCall[0].msg).toEqual(msg);
    })

    it('Shouldn\'t update a song because the _id isn\'t equal to any song registered', async () => {
      mockRequest = {
        user: mongoPrivateUser,
        body: {
          _id: "1",
          title: 'Sweet Child O\' Mine 1',
          album: 'Appetite for Destruction 1',
          duration: '5:58',
          author: 'Guns N\' Roses 1',
        },
        params: {

        }
      }

      await songController.update(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(404);
      const msg = utils.messages.MSG_SONG_UPDATE_MISSED_SONG;
      expect(json.mock.lastCall[0].msg).toEqual(msg);
    })

    it('Shouldn\'t update a song because the _id only was sent on the request', async () => {
      const song: types.ISong = <types.ISong>{
        title: 'Sweet Child O\' Mine',
        album: 'Appetite for Destruction',
        duration: '5:56',
        author: 'Guns N\' Roses'
      };

      await addSong(mongoPrivateUser, song);

      let userAfterInsert: types.IUser = <types.IUser> await User.findOne({email: mongoPrivateUser.email});
      let savedSong :any = userAfterInsert?.songs;

      mockRequest = {
        user: mongoPrivateUser,
        body: {
          _id: savedSong[0]._id.toString()
        },
        params: {

        }
      }

      await songController.update(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(422);
      const msg = utils.messages.MSG_SONG_UPDATE_MISSED_ALL_PARAMETERS;
      expect(json.mock.lastCall[0].msg).toEqual(msg);
    })

    it('Shouldn\'t update a song if this belongs to another user', async () => {
      const song: types.ISong = <types.ISong>{
        title: 'Sweet Child O\' Mine',
        album: 'Appetite for Destruction',
        duration: '5:56',
        author: 'Guns N\' Roses'
      };

      await addSong(mongoPublicUser, song);

      let userAfterInsert: types.IUser = <types.IUser> await User.findOne({email: mongoPublicUser.email});
      let savedSong :any = userAfterInsert?.songs;

      mockRequest = {
        user: mongoPrivateUser,
        body: {
          _id: savedSong[0]._id.toString(),
          title: 'Sweet Child O\' Mine 1',
          album: 'Appetite for Destruction 1',
          duration: '5:58',
          author: 'Guns N\' Roses 1',
        },
        params: {

        }
      }

      await songController.update(mockRequest as Request, mockResponse as Response);
      const status : any = mockResponse.status;
      const json : any = mockResponse.json

      expect(status).toBeCalledTimes(1);
      expect(status.mock.lastCall[0]).toEqual(404);

      const msg = utils.messages.MSG_SONG_UPDATE_MISSED_SONG;
      expect(json.mock.lastCall[0].msg).toEqual(msg);
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

const addManySongsToAUser = async (user: types.IUser, songsNumber: number) => {
  const songs = makeManySongs(songsNumber);

  const promiseSongs = songs.map((song) => addSong(user, song));

  Promise.all(promiseSongs);
}

const makeManySongs = (songsNumber: number) : Array<types.ISong>=> {
  const songs = []
  for(let i = 0; i < songsNumber; i++) {
    const baseSong:  types.ISong = {
      title: `title ${i}`,
      album: `album ${i}`,
      duration: `duration ${i}`,
      author: `author ${i}`
    };

    songs.push(baseSong);
  }

  return songs;
}
