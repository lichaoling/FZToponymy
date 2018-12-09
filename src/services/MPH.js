import { Post } from '../utils/request';

let baseUrl = 'api';

export async function searchHousesBZToProve(params, sf, ef) {
  let rt = await Post(`${baseUrl}/HouseBZ/SearchHousesBZToProve`, params, sf, ef);
  return rt;
}

export async function searchWorkFlowLines(params, sf, ef) {
  let rt = await Post(`${baseUrl}/HouseBZ/SearchWorkFlowLines`, params, sf, ef);
  return rt;
}
