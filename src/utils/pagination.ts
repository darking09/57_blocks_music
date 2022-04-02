// Dependecies
import { Request } from "express";

//Utils
import * as utils from './index';

const PAGE_SIZE = 5;

const getStartAndEndPagination = (req: Request, maxArraySize: number) => {
  const page: number = utils.number.parseStringToInt(req.query.page, 1);

  let startPagination = (page - 1) * PAGE_SIZE;

  if (maxArraySize < startPagination) {
    startPagination = startPagination + PAGE_SIZE;
  }

  const endPagination = startPagination + PAGE_SIZE;

  return {
    startPagination,
    endPagination
  };
};

const paginationData = (start: number, end: number, req: Request, maxArraySize: number) => {
  const next_page = end / PAGE_SIZE + 1;
  let pagination = {};

  if ((start + PAGE_SIZE) < maxArraySize) {
    pagination = {
      next_page,
      next_url: `${req.protocol}://${req.hostname}${req.baseUrl}/${req.params['type']}?page=${next_page}`
    };
  }

  return pagination;
};

export default {
  getStartAndEndPagination,
  paginationData,
  PAGE_SIZE
};
