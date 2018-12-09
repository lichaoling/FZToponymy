import {Post} from '../utils/request';

let baseUrl = 'api';

export async function getDistrictTreeByUID(sf, ef) {
  let rt = await Post(`${baseUrl}/District/GetDistrictTreeByUID`, null, sf, ef);
  return rt;
}
