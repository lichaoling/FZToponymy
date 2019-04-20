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

export async function GetNewGuid(sf, ef) {
  let rt = await Post(`${baseUrl}/Common/GetNewGuid`, null, sf, ef);
  return rt;
}

/**
 * 根据道路id获取门牌数据：Common/SearchMPByRoad(string )
 */
export async function SearchMPByRoad(id, sf, ef) {
  let rt = await Post(`${baseUrl}/Common/SearchMPByRoad`, { roadID: id }, sf, ef);
  return rt;
}

/**
 * 根据自然村id获取门牌数据：Common/SearchMPByVillage(string villageID)
 */
export async function SearchMPByVillage(id, sf, ef) {
  let rt = await Post(`${baseUrl}/Common/SearchMPByVillage`, { villageID: id }, sf, ef);
  return rt;
}

/**
 * 根据门牌id获取小区数据：Common/SearchHouseByMP(string mpID)
 */
export async function SearchHouseByMP(id, sf, ef) {
  let rt = await Post(`${baseUrl}/Common/SearchHouseByMP`, { mpid: id }, sf, ef);
  return rt;
}

/**
 * 根据小区id获取楼幢数据：Common/SearchLZByHouse(string houseID)
 */
export async function SearchLZByHouse(id, sf, ef) {
  let rt = await Post(`${baseUrl}/Common/SearchLZByHouse`, { houseID: id }, sf, ef);
  return rt;
}
