import { Post } from '../utils/request';

let baseUrl = 'api';

export async function getDistrictTreeByUID(sf, ef) {
  let rt = await Post(`${baseUrl}/District/GetDistrictTreeByUID`, null, sf, ef);
  return rt;
}

export async function GetDistrictTree(sf, ef) {
  let rt = await Post(`${baseUrl}/District/GetDistrictTree`, null, sf, ef);
  return rt;
}
