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
export async function HouseDetails(id, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/HouseDetails`, { mpid: id }, sf, ef);
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

/**
 * 兴趣点查询：DataManage/POISearch(int pageNum, int pageSize, string districtID, string name, string lx, DateTime? start, DateTime? end)
 */
export async function POISearch(parms, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/POISearch`, parms, sf, ef);
  return rt;
}
/**
 * 禁用POI DataManage/POIDisableOrDel(string id, int state)
 */
export async function LockPOI(id, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/POIDisableOrDel`, { id: id, state: 2 }, sf, ef);
  return rt;
}

export async function UnLockPOI(id, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/POIDisableOrDel`, { id: id, state: 1 }, sf, ef);
  return rt;
}

/**
 * 删除POI DataManage/POIDisableOrDel(string id, int state)
 */
export async function DelPOI(id, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/POIDisableOrDel`, { id: id, state: 0 }, sf, ef);
  return rt;
}

/**
 * 获取POI详情 DataManage/POIDetails(string id)
 */
export async function POIDetails(id, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/POIDetails`, { id: id }, sf, ef);
  return rt;
}

/**
 * 新增或修改POI DataManage/POIModify(string dataJson)
 */
export async function POIModify(obj, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/POIModify`, { dataJson: JSON.stringify(obj) }, sf, ef);
  return rt;
}

