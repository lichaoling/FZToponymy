import { baseUrl } from '../common/urls';
import { Post } from '../utils/request';

export async function SearchAllAddress(params, sf, ef) {
  let rt = await Post(`${baseUrl}/ServiceManage/SearchAllAddress`, params, sf, ef);
  return rt;
}
export async function SearchTopAddress(params, sf, ef) {
  let rt = await Post(`${baseUrl}/ServiceManage/SearchTopAddress`, params, sf, ef);
  return rt;
}

export async function SearchDetails(params, sf, ef) {
  let rt = await Post(`${baseUrl}/ServiceManage/SearchDetails`, params, sf, ef);
  return rt;
}