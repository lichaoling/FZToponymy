import { Component } from 'react';
import st from './POIForm.less';
import { Button, Form, Col, Row, Input, Cascader, Modal, Spin } from 'antd';
import { getInput, getDatePicker, getSelect, getCascader } from '../../../utils/formUtils';
import {
  GetDistrictTree,
  SearchMPByRoad,
  SearchMPByVillage,
  SearchHouseByMP,
  SearchLZByHouse,
  GetNewGuid,
  SearchRoadsByDistrictID,
  SearchVillagesByDistrictID,
} from '../../../services/Common';
import { getDistricts2 } from '../../../utils/utils';
import { SearchRoads, POIModify, POIDetails } from '../../../services/DataManage';
import { warn, error, success } from '../../../utils/notification';
import LocateMap from '../../../common/Components/Maps/LocateMap2.js';
import UploadPicture from '../../../components/UploadPicture/UploadPicture';
import { getRedIcon } from '../../../common/LIcons';
import {
  baseUrl,
  fileBasePath,
  url_UploadPicture,
  url_RemovePicture,
  url_GetPictureUrls,
} from '../../../common/urls.js';

let FormItem = Form.Item;

class POIForm extends Component {
  state = {
    districts: [],
    roads: [],
    villages: [],
    mps: [],
    houses: [],
    lzs: [],
    reload: false,
    fullAddress: '',
    showLocateMap: false,
    showLoading: false,
    disabledRoad: false,
    disabledVillage: false,
    districtLoading: false,
    roadLoading: false,
    villageLoading: false,
    mpLoading: false,
    lzLoading: false,
    houseName: null,
  };

  entity = {};

  mObj = {};

  async getFormData(id) {
    if (!id) id = this.props.id;
    if (id) {
      this.setState({ showLoading: true });
      await POIDetails(id, d => {
        this.entity = d;
        this.setState(
          {
            disabledVillage: !!d.ROADID,
            disabledRoad: !!d.VILLAGEID,
            reload: true,
            fullAddress: d.ADDRESS,
            houseName: d.HOUSENAME,
          },
          e => {
            this.setState({ reload: false });
          }
        );
      });
      this.setState({ showLoading: false });
    } else {
      // 获取新id
      await GetNewGuid(d => {
        this.entity = {
          ID: d,
          CREATETIME: moment(),
        };
        this.mObj = { CREATETIME: moment().format('YYYY-MM-DD') };
        this.setState({ reload: true }, e => {
          this.setState({ reload: false });
        });
      });
    }
  }

  async getDistricts() {
    this.setState({ districtLoading: true });
    await GetDistrictTree(d => {
      let districts = getDistricts2(d);
      this.setState({ districts: districts });
    });
    this.setState({ districtLoading: false });
  }

  async searchVillages(districtId) {
    this.setState({ villageLoading: true });
    await SearchVillagesByDistrictID(districtId, d => {
      this.setState({
        villages: (d || []).map(r => {
          return {
            name: r.VILLAGENAME,
            id: r.VILLAGEID,
          };
        }),
      });
    });
    this.setState({ villageLoading: false });
  }

  async searchRoads(districtId) {
    this.setState({ roadLoading: true });
    await SearchRoadsByDistrictID(districtId, d => {
      this.setState({
        roads: (d || []).map(r => {
          return {
            name: r.ROADNAME,
            id: r.ROADID,
          };
        }),
      });
    });
    this.setState({ roadLoading: false });
  }

  async searchMPByRoad(roadid) {
    this.setState({ mpLoading: true });
    await SearchMPByRoad(roadid, d => {
      this.setState({
        mps: (d || []).map(r => {
          return {
            id: r.ID,
            name: r.MPNUM,
            houseName: r.NAME,
            houseId: r.HOUSEID,
          };
        }),
      });
    });
    this.setState({ mpLoading: false });
  }

  async searchMPByVillage(villageId) {
    this.setState({ mpLoading: true });
    await SearchMPByVillage(villageId, d => {
      this.setState({
        mps: (d || []).map(r => {
          return {
            id: r.ID,
            name: r.MPNUM,
            houseName: r.NAME,
            houseId: r.HOUSEID,
          };
        }),
      });
    });
    this.setState({ mpLoading: false });
  }

  async searchLZ(houseid) {
    await SearchLZByHouse(houseid, d => {
      this.setState({
        lzs: (d || []).map(r => {
          return {
            id: r.ID,
            name: r.LZNUM,
          };
        }),
      });
    });
  }

  getFullAddress() {
    let obj = {
      ...this.entity,
      ...this.mObj,
    };
    let ept = '';
    let fullAddress = '';
    let { houseName } = this.state;

    fullAddress = `${obj.DISTRICTNAME || ept}${obj.ROADNAME || ept}${obj.VILLAGENAME ||
      ept}${obj.MPNUM || ept}${houseName || ept}${obj.LZNUM || ept}${obj.CELL || ept}${obj.ROOM ||
      ept}`;

    this.mObj.ADDRESS = fullAddress;
    this.setState({ fullAddress: fullAddress });
  }

  save() {
    let obj = {
      ...this.mObj,
      ID: this.entity.ID,
    };

    let vObj = {
      ...this.entity,
      ...this.mObj,
    };

    if (!vObj.NAME) {
      error('名称不能为空');
      return;
    }

    if (!vObj.DISTRICTID) {
      error('所属行政区不能为空');
      return;
    }

    if (!vObj.ROADID && !vObj.VILLAGEID) {
      error('所属道路、所属自然村不能同时为空');
      return;
    }

    if (!vObj.MPID) {
      error('所属门牌不能为空');
      return;
    }

    POIModify(obj, d => {
      success('保存成功');
      this.mObj = {};
      this.getFormData(this.entity.ID);
      this.props.onSaveSuccess && this.props.onSaveSuccess();
    });
  }

  componentDidMount() {
    this.searchRoads = _.debounce(this.searchRoads, 1000);
    this.getFullAddress = _.debounce(this.getFullAddress, 1000);
    this.getDistricts();
    this.getFormData();
  }

  render() {
    let {
      reload,
      districts,
      roads,
      villages,
      mps,
      houses,
      lzs,
      fullAddress,
      showLocateMap,
      showLoading,
      disabledRoad,
      disabledVillage,
      districtLoading,
      roadLoading,
      villageLoading,
      mpLoading,
      lzLoading,
      houseName,
    } = this.state;

    return (
      <div className={st.fm}>
        {showLoading ? <Spin spinning tip="数据加载中..." wrapperClassName="ct-loading" /> : null}
        <div className={st.fmctt}>
          {reload ? null : (
            <div>
              <div className={st.fmgrp}>
                <div className={st.fmgrphd}>基本信息</div>
                <div className={st.fmgrpctt}>
                  <Row>
                    <Col span={8}>
                      <FormItem
                        label={
                          <span>
                            <span className={st.ired}>*</span>名称
                          </span>
                        }
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {getInput(this, 'NAME', '名称')}
                      </FormItem>
                    </Col>

                    <Col span={8}>
                      <FormItem
                        label={
                          <span>
                            <span className={st.ired}>*</span>所属行政区
                          </span>
                        }
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {districtLoading ? <Spin /> : null}
                        {getCascader(this, 'DISTRICTID', '所属行政区', districts, (v, o) => {
                          this.mObj.DISTRICTNAME = o.map(i => i.label).join('');
                          let districtId = v && v.length && v[v.length - 1];
                          this.mObj.DISTRICTID = districtId;

                          districtId && this.searchRoads(districtId);
                          districtId && this.searchVillages(districtId);

                          this.getFullAddress();
                        })}
                      </FormItem>
                    </Col>
                    
                  </Row>
                  <Row>
                  <Col span={8}>
                      <FormItem
                        label={
                          <span>
                            <span className={st.ired}>*</span>所属道路
                          </span>
                        }
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {roadLoading ? <Spin /> : null}
                        {getSelect(
                          this,
                          'ROADID',
                          'ROADNAME',
                          '所属道路',
                          roads,
                          e => {
                            // this.searchRoads(e);
                          },
                          (v, o) => {
                            v && this.searchMPByRoad(v);
                            this.getFullAddress();
                            this.setState({ disabledRoad: false, disabledVillage: !!v });
                          },
                          true,
                          disabledRoad
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        label={
                          <span>
                            <span className={st.ired}>*</span>所属自然村
                          </span>
                        }
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {villageLoading ? <Spin /> : null}
                        {getSelect(
                          this,
                          'VILLAGEID',
                          'VILLAGENAME',
                          '所属自然村',
                          villages,
                          e => {
                            // this.searchRoads(e);
                          },
                          (v, o) => {
                            v && this.searchMPByVillage(v);
                            this.getFullAddress();
                            this.setState({ disabledRoad: !!v, disabledVillage: false });
                          },
                          true,
                          disabledVillage
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        label={
                          <span>
                            <span className={st.ired}>*</span>所属门牌
                          </span>
                        }
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {mpLoading ? <Spin /> : null}
                        {getSelect(
                          this,
                          'MPID',
                          'MPNUM',
                          '所属门牌',
                          mps,
                          null,
                          (v, o) => {
                            if (v) {
                              let mp = mps.find(m => m.id == v);
                              let houseId = mp ? mp.houseId : undefined;
                              let houseName = mp ? mp.houseName : undefined;
                              if (houseId) this.searchLZ(houseId);
                              this.setState({ houseName: houseName }, e => {
                                this.getFullAddress();
                              });
                            } else {
                              this.getFullAddress();
                            }
                          },
                          true
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem
                        label={
                          <span>
                            <span className={st.ired}>*</span>所属楼栋
                          </span>
                        }
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {lzLoading ? <Spin /> : null}
                        {getSelect(
                          this,
                          'LZID',
                          'LZNUM',
                          '所属楼栋',
                          lzs,
                          null,
                          (v, o) => {
                            this.getFullAddress();
                          },
                          true
                        )}
                      </FormItem>
                    </Col>

                    <Col span={8}>
                      <FormItem
                        label="梯位（层）号"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        {getInput(
                          this,
                          'CELL',
                          '梯位（层）号',
                          null,
                          null,
                          this.getFullAddress.bind(this)
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="户室号" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getInput(
                          this,
                          'ROOM',
                          '户室号',
                          null,
                          null,
                          this.getFullAddress.bind(this)
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      <FormItem label="完整地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <Input value={fullAddress} disabled />
                      </FormItem>
                    </Col>
                    <Button
                      style={{ position: 'absolute', right: '320px' }}
                      icon="environment"
                      shape="circle"
                      type="primary"
                      onClick={e => {
                        this.setState({ showLocateMap: true });
                      }}
                    />
                  </Row>
                  <Row>
                    <Col span={16}>
                      <FormItem label="备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        {getInput(this, 'REMARK', '备注')}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className={st.fmgrp}>
                <div className={st.fmgrphd}>图片</div>
                <div style={{ padding: '20px' }} className={st.fmgrpctt}>
                  <UploadPicture
                    fileList={this.entity.Pics}
                    id={this.entity.ID}
                    fileBasePath={baseUrl}
                    data={{ DOCTYPE: null, FileType: '兴趣点照片' }}
                    uploadAction={url_UploadPicture}
                    removeAction={url_RemovePicture}
                    getAction={url_GetPictureUrls}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={st.fmft}>
          <Button type="primary" icon="save" onClick={e => this.save()}>
            保存
          </Button>
          <Button icon="rollback">取消</Button>
        </div>
        <Modal
          bodyStyle={{ padding: 0 }}
          style={{ top: 10 }}
          wrapClassName={'fullmodal'}
          visible={showLocateMap}
          destroyOnClose={true}
          onCancel={e => {
            this.setState({ showLocateMap: false });
          }}
          title="兴趣点位置"
          footer={null}
        >
          <LocateMap
            onMapReady={lm => {
              let { WKT } = this.entity;
              if (WKT) {
                L.geoJSON(Terraformer.WKT.parse(WKT), {
                  onEachFeature: function(f, l) {
                    l.setIcon(getRedIcon(''));
                    lm.layer = l;
                    lm.map.setView(l._latlng, 16);
                  },
                }).addTo(lm.map);
              } else {
                warn('兴趣点尚未定位');
              }
            }}
            afterBtns={[
              {
                id: 'locatepoint',
                name: '兴趣点定位',
                icon: 'icon-dingwei',
                onClick: (dom, i, lm) => {
                  if (!lm.locatePen) {
                    lm.locatePen = new L.Draw.Marker(lm.map, {
                      icon: getRedIcon(''),
                    });
                    lm.locatePen.on(L.Draw.Event.CREATED, e => {
                      lm.layer && lm.layer.remove();
                      var { layer } = e;
                      lm.layer = layer;
                      layer.addTo(lm.map);
                    });
                  }
                  lm.disableMSTools();
                  if (lm.locatePen._enabled) {
                    lm.locatePen.disable();
                  } else {
                    lm.locatePen.enable();
                  }
                },
              },
              {
                id: 'savelocation',
                name: '保存定位',
                icon: 'icon-save',
                onClick: (dom, item, lm) => {
                  let geo = lm.layer ? lm.layer.toGeoJSON().geometry : null;
                  let geoJSON = geo ? Terraformer.WKT.convert(geo) : null;
                  this.entity.WKT = geoJSON;
                  this.mObj.WKT = geoJSON;
                  this.setState({ showLocateMap: false });
                },
              },
            ]}
            onMapClear={lm => {
              lm.mpLayer && lm.mpLayer.remove();
              lm.mpLayer = null;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default POIForm;
