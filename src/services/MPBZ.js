import { Post } from '../utils/request';

let baseUrl = 'api';

export async function searchHousesBZToLocate(params, sf, ef) {
  let rt = await Post(`${baseUrl}/HouseBZ/SearchHousesBZToLocate`, params, sf, ef);
  return rt;
}

export async function houseBZLocate(params, sf, ef) {
  let rt = await Post(`${baseUrl}/HouseBZ/HouseBZLocate`, params, sf, ef);
  return rt;
}