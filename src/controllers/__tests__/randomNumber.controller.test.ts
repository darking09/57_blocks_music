// Dependecies
import * as utils from '../../utils';
import { Request, Response } from 'express';
import * as randomNumber from '../randomNumber.controller';

describe('Random Number Controller', () => {
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
  })

  it('Should receive a number and return it', async () => {
    mockRequest = {
      params: {
        number: '100'
      }
    };

    randomNumber.index(mockRequest as Request, mockResponse as Response);
    const status : any = mockResponse.status;
    const json : any = mockResponse.json

    expect(status).toBeCalledTimes(1);
    expect(status.mock.lastCall[0]).toEqual(200);

    expect(json.mock.lastCall[0].number).toEqual(100);
  });

  it('Receives something different to a number and returns 0', async () => {
    mockRequest = {
      params: {
        number: 'something'
      }
    };

    randomNumber.index(mockRequest as Request, mockResponse as Response);
    const status : any = mockResponse.status;
    const json : any = mockResponse.json

    expect(status).toBeCalledTimes(1);
    expect(status.mock.lastCall[0]).toEqual(200);

    expect(json.mock.lastCall[0].number).toEqual(0);
  });
});
