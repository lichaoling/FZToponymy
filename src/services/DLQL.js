import { Post } from '../utils/request';

let baseUrl = 'api';

export async function searchRoads(params, sf, ef) {
  let rt = await Post(`${baseUrl}/Road/SearchRoads`, params, sf, ef);
  return rt;
}

export async function searchWorkFlowLines(params, sf, ef) {
  let rt = await Post(`${baseUrl}/Road/SearchWorkFlowLines`, params, sf, ef);
  return rt;
}

export async function checkRoadName(params, sf, ef) {
  let rt = await Post(`${baseUrl}/Road/CheckRoadName`, params, sf, ef);
  return rt;
}





