// Dependecies
import * as utils from '../../utils';
import User from '../../models/user';
import db from '../../databaseUnitTest';
import { Request, Response } from 'express';
import * as songController from '../song.controller';

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

  describe('List user\'s songs', () => {
    it('test', () => {
      expect(2).toEqual(2);
    })
  })

  describe('Create user\'s song', () => {
    it('test', () => {
      expect(2).toEqual(2);
    })
  })

  describe('Read user\'s song', () => {
    it('test', () => {
      expect(2).toEqual(2);
    })
  })

  describe('Update user\'s song', () => {
    it('test', () => {
      expect(2).toEqual(2);
    })
  })

  describe('Delete user\'s song', () => {
    it('test', () => {
      expect(2).toEqual(2);
    })
  })
});
