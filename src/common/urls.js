let baseUrl = 'api';
let fileBasePath = `${baseUrl}/Files`;

let //**************** *行政区划*******************
  url_GetDistrictTree = `${baseUrl}/District/GetDistrictTree`, //获取所有行政区划
  url_GetDistrictTreeByUID = `${baseUrl}/District/GetDistrictTreeByUID`, //根据用户数据权限获取行政区划，UserIn=false表示没权限
  //**************** *道路桥梁*******************
  url_CheckRoadName = `${baseUrl}/Road/CheckRoadName`, //检查道路、桥梁命名检查(string DISTRICTID, string NAME)
  url_RoadAndBridgeApplicant = `${baseUrl}/Road/RoadAndBridgeApplicant`, //道路、桥梁命名申请(string mObj, string workFlowID = "1")
  url_SearchRoadByID = `${baseUrl}/Road/SearchRoadByID`, //查询一条道路、桥梁数据进行审批(string id) 
  //返回结果：{Data，State}  如果State=first说明是审批的第一个节点，则可以修改全部内容;如果State=notFirst说明是审批的中间节点，只可以修改名称;如果State=complete则已经审批完，不需要显示审批的那几个控件

  url_SearchRoads = `${baseUrl}/Road/SearchRoads`, //查询已审批或者待审批的道路、桥梁数据(int pageNum, int pageSize, string districtID, int approvalState, DateTime? start, DateTime? end
  url_RoadApprove = `${baseUrl}/Road/RoadApprove`, //道路、桥梁审批(string mObj, string result, string suggestion, string workFlowID = "1")
  //**************** *小区楼宇*******************
  url_HouseAndBuildingApplicant = `${baseUrl}/House/HouseAndBuildingApplicant`, //小区楼宇命名申请(string DISTRICTID, string NAME)
  url_CheckHouseName = `${baseUrl}/House/CheckHouseName`, //小区楼宇命名检查(string mObj, string workFlowID = "2")
  url_SearchHouseByID = `${baseUrl}/House/SearchHouseByID`, //查询一条小区楼宇(string id)
  
  url_SearchHouses = `${baseUrl}/House/SearchHouses`, //查询已审批或者待审批的小区楼宇数据(int pageNum, int pageSize, string districtID, int approvalState, DateTime? start, DateTime? end)
  url_HouseApprove = `${baseUrl}/House/HouseApprove`, //小区楼宇审批(string mObj, string result, string suggestion, string workFlowID = "2")
  url_SearchRoadNames=`${baseUrl}/House/SearchRoadNames`,//查询正式道路名称(int pageNum, int pageSize, string name)
  //**************** *住宅门牌编制申请*******************
  url_GetHousesByDistFromMP = `${baseUrl}/HouseBZ/GetHousesByDistFromMP`, //从门牌表中根据行政区划获取小区名称(string districtID)
  url_SearchHouseBZByID = `${baseUrl}/HouseBZ/SearchHouseBZByID`, //查询一条住宅门牌编制申请数据进行审批(string id)
  url_HouseAndBuildingBZ = `${baseUrl}/HouseBZ/HouseAndBuildingBZ`, //住宅门牌号申请(string mObj, string workFlowID = "3")
  
  url_SearchHousesBZToProve = `${baseUrl}/HouseBZ/SearchHousesBZToProve`, //查询已审批或者待审批的住宅门牌号数据(int pageNum, int pageSize, string districtID, int approvalState, DateTime? start, DateTime? end)
  url_HouseBZApprove = `${baseUrl}/HouseBZ/HouseBZApprove`, //住宅门牌编制审批(string mObj, string result, string suggestion, string workFlowID = "3")
  url_UploadPicture = `${baseUrl}/File/UploadFile`, //上传图片(string ID, string fileType, string docType)
  url_RemovePicture = `${baseUrl}/File/RemoveFile`, //删除图片(string ID, string fileType)
  url_GetPictureUrls = `${baseUrl}/File/GetFileUrls`, //获取图片的Url(string ID, string fileType, string docType)
  url_GetNewGuid = `${baseUrl}/Common/GetNewGuid`, //获取一个新的GUID
  //**************** *住宅门牌编制*******************
  
  url_SearchHousesBZToLocate = `${baseUrl}/HouseBZ/SearchHousesBZToLocate`, //查询已编制或未编制的住宅门牌编制数据(int pageNum, int pageSize, string districtID, int locateState)
  url_HouseBZLocate = `${baseUrl}/HouseBZ/HouseBZLocate`, //编制门牌(string mObj)
  //**************** *用户登录*******************
  url_Login = `${baseUrl}/Login/Login`;

export {
  baseUrl,
  fileBasePath,
  url_GetDistrictTree,
  url_GetDistrictTreeByUID,

  url_CheckRoadName,
  url_RoadAndBridgeApplicant,
  url_SearchRoadByID,
  url_SearchRoads,
  url_RoadApprove,

  url_HouseAndBuildingApplicant,
  url_CheckHouseName,
  url_SearchHouseByID,
  url_SearchHouses,
  url_HouseApprove,
  url_SearchRoadNames,

  url_GetHousesByDistFromMP,
  url_SearchHouseBZByID,
  url_HouseAndBuildingBZ,
  url_SearchHousesBZToProve,
  url_HouseBZApprove,
  url_UploadPicture,
  url_RemovePicture,
  url_GetPictureUrls,
  url_GetNewGuid,

  url_Login,
  
};
