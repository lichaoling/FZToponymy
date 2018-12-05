let baseUrl = 'api';
let fileBasePath = `${baseUrl}/Files`;

let url_GetDistrictTree = `${baseUrl}/District/GetDistrictTree`,
  url_GetDistrictTreeByUID = `${baseUrl}/District/GetDistrictTreeByUID`,

  url_CheckRoadName = `${baseUrl}/Road/CheckRoadName`,
  url_RoadAndBridgeApplicant = `${baseUrl}/Road/RoadAndBridgeApplicant`,
  url_SearchRoadByID = `${baseUrl}/Road/SearchRoadByID`,

  url_HouseAndBuildingApplicant = `${baseUrl}/House/HouseAndBuildingApplicant`,
  url_CheckHouseName = `${baseUrl}/House/CheckHouseName`,
  url_SearchHouseByID = `${baseUrl}/House/SearchHouseByID`,
  url_GetHousesByDistFromMP = `${baseUrl}/HouseBZ/GetHousesByDistFromMP`,

  url_SearchHouseBZByID = `${baseUrl}/HouseBZ/SearchHouseBZByID`,
  url_HouseAndBuildingBZ = `${baseUrl}/HouseBZ/HouseAndBuildingBZ`,
  url_UploadPicture = `${baseUrl}/File/UploadFile`,
  url_RemovePicture = `${baseUrl}/File/RemoveFile`,
  url_GetPictureUrls = `${baseUrl}/File/GetFileUrls`,

  url_GetNewGuid = `${baseUrl}/Common/GetNewGuid`,
  url_Login = `${baseUrl}/Login/Login`;

export {
  baseUrl,
  fileBasePath,
  url_GetDistrictTree,
  url_CheckRoadName,
  url_RoadAndBridgeApplicant,
  url_HouseAndBuildingApplicant,
  url_CheckHouseName,
  url_SearchHouseByID,
  url_GetHousesByDistFromMP,
  url_HouseAndBuildingBZ,
  url_UploadPicture,
  url_RemovePicture,
  url_GetPictureUrls,
  url_GetNewGuid,
  url_Login,
  url_GetDistrictTreeByUID,
};
