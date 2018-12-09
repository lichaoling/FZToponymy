import { Post } from '../utils/request';

let baseUrl = 'api';

export async function searchHouses(params, sf, ef) {
  let rt = await Post(`${baseUrl}/House/SearchHouses`, params, sf, ef);
  return rt;
}
export async function searchWorkFlowLines(params, sf, ef) {
  let rt = await Post(`${baseUrl}/House/SearchWorkFlowLines`, params, sf, ef);
  return rt;
}
