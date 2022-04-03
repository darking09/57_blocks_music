/* eslint-disable @typescript-eslint/no-var-requires */
// Dependecies
import fs from 'fs';
import path from 'path';
import * as express from "express";
import pluralize from "pluralize";

const API_PATH = path.join(__dirname, '../api');

const test = (app: express.Application) => {
  fs.readdirSync(API_PATH).forEach((api) => {
    const plural = pluralize(api.replace('.ts', '').replace('.js', ''));

    if (plural.indexOf('.') === -1 && plural !== '__tests__') {
      app.use(`/api/${plural}`, require(`${API_PATH}/${api}`));
    }
  });
};

export default test;
