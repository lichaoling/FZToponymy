import { baseUrl } from '../common/urls';
import { Post } from '../utils/request';

export async function SearchFromLucene(params, sf, ef) {
  let rt = await Post(`${baseUrl}/ServiceManage/SearchFromLucene`, params, sf, ef);
  return rt;
}

export async function SearchDetails(params, sf, ef) {
  let rt = await Post(`${baseUrl}/ServiceManage/SearchDetails`, params, sf, ef);
  return rt;
}