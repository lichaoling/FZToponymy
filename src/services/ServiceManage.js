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

/*
public ActionResult SearchDetails2(string type, string id)
*/
export async function SearchDetails2(params, sf, ef) {
  let rt = await Post(`${baseUrl}/ServiceManage/SearchDetails2`, params, sf, ef);
  return rt;
}
/*
public ActionResult SearchHSDetails(string lzid)
*/
export async function SearchHSDetails(params, sf, ef) {
  let rt = await Post(`${baseUrl}/ServiceManage/SearchHSDetails`, params, sf, ef);
  return rt;
}