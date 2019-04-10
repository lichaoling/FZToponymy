import { Post } from '../utils/request';

let baseUrl = 'api';

/*
DataManage/RoadSearch(int pageNum, int pageSize, string districtID, string roadName, DateTime? start, DateTime? end, int state = 1)   state=1 在用  0 删除  2 禁用
*/
export async function RoadSearch(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/RoadSearch`, parms, sf, ef);
  return rt;
}

/*
DataManage/RoadDisableOrDel(string id, int state)    state同上描述   返回false时，前台提示：还有门牌或小区关联该道路，请先禁用或删除关联的门牌或小区再进行此操作。若返回true，这说明操作成功
*/
export async function RoadDisable(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/RoadDisableOrDel`, parms, sf, ef);
  return rt;
}

/*
DataManage/RoadDisableOrDel(string id, int state)    state同上描述   返回false时，前台提示：还有门牌或小区关联该道路，请先禁用或删除关联的门牌或小区再进行此操作。若返回true，这说明操作成功
*/
export async function RoadDel(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/RoadDisableOrDel`, parms, sf, ef);
  return rt;
}

export async function roadModify(params, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/RoadModify`, params, sf, ef);
  return rt;
}



export async function HouseSearch(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/HouseSearch`, parms, sf, ef);
  return rt;
}
export async function HouseDetails(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/HouseDetails`, parms, sf, ef);
  return rt;
}
export async function HouseDisableOrDel(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/HouseDisableOrDel`, parms, sf, ef);
  return rt;
}
export async function HouseModify(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/HouseModify`, parms, sf, ef);
  return rt;
}

export async function SearchRoads(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/Common/SearchRoads`, parms, sf, ef);
  return rt;
}
export async function SearchVillages(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/Common/SearchVillages`, parms, sf, ef);
  return rt;
}