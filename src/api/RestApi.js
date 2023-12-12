import {Get, Post} from './axios.config';

export const GetAllNotice = (status, page) =>
  Get({endPoint: `noticeSeller/list/seller/all/${status}?page=${page}`});
