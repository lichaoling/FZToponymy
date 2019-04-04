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
export async function RoadDisable(id, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/RoadDisableOrDel`, { id: id, state: 2 }, sf, ef);
  return rt;
}

/*
DataManage/RoadDisableOrDel(string id, int state)    state同上描述   返回false时，前台提示：还有门牌或小区关联该道路，请先禁用或删除关联的门牌或小区再进行此操作。若返回true，这说明操作成功
*/
export async function RoadDel(id, sf, ef) {
  let rt = await Post(`${baseUrl}/DataManage/RoadDisableOrDel`, { id: id, state: 0 }, sf, ef);
  return rt;
}
