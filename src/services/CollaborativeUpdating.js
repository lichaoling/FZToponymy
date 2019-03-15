import { baseUrl } from '../common/urls';
import { Post } from '../utils/request';

/*
CoorplateUpdate/ImportDataSearch(int pageNum, int pageSize, string districtID, string houseName, DateTime start, DateTime end)  
*/
export async function ImportDataSearch(params, sf, ef) {
  let rt = await Post(`${baseUrl}/CoorplateUpdate/ImportDataSearch`, params, sf, ef);
  return rt;
}

/*
CoorplateUpdate/BuildingSearch(string houseID)
*/
export async function BuildingSearch(params, sf, ef) {
  let rt = await Post(`${baseUrl}/CoorplateUpdate/BuildingSearch`, params, sf, ef);
  return rt;
}

/*
ServiceManage/SearchHSDetails(string lzid)
*/
export async function SearchHSDetails(params, sf, ef) {
    let rt = await Post(`${baseUrl}/ServiceManage/SearchHSDetails`, params, sf, ef);
    return rt;
}