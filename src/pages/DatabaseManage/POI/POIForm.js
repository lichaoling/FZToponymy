import { Component } from 'react';
import st from './POIForm.less';
import { Button, Form, Col, Row, Input, Cascader, Modal, Spin } from 'antd';
import { getInput, getDatePicker, getSelect, getCascader } from '../../../utils/formUtils';
import {
  GetDistrictTree,
  SearchMPByRoad,
  SearchHouseByMP,
  SearchLZByHouse,
  GetNewGuid,
} from '../../../services/Common';
import { getDistricts2 } from '../../../utils/utils';
import { SearchRoads, POIModify, POIDetails } from '../../../services/DataManage';
import { warn, error, success } from '../../../utils/notification';
import LocateMap from '../../../common/Components/Maps/LocateMap2.js';
import { getRedIcon } from '../../../common/LIcons';

let FormItem = Form.Item;

class POIForm extends Component {
  state = {
    districts: [],
    roads: [],
    mps: [],
    houses: [],
    lzs: [],
    reload: false,
    fullAddress: '',
    showLocateMap: false,
    showLoading: false,
  };

  entity = {};

  mObj = {};

  async getFormData(id) {
    if (!id) id = this.props.id;
    if (id) {
      this.setState({ showLoading: true });
      await POIDetails(id, d => {
        this.entity = d;
        this.setState({ reload: true, fullAddress: this.entity.ADDRESS }, e => {
          this.setState({ reload: false });
        });
      });
      this.setState({ showLoading: false });
    } else {
      // 获取新id
      GetNewGuid(d => {
        this.entity = {
          ID: d,
        };
      });
    }
  }

  getDistricts() {
    GetDistrictTree(d => {
      let districts = getDistricts2(d);
      this.setState({ districts: districts });
    });
  }

  searchRoads(v) {
    SearchRoads({ name: v }, d => {
      this.setState({
        roads: (d || []).map(r => {
          return {
            name: r.NAME,
            id: r.ID,
          };
        }),
      });
    });
  }

  searchMP(roadid) {
    SearchMPByRoad(roadid, d => {
      this.setState({
        mps: (d || []).map(r => {
          return {
            id: r.ID,
            name: r.MPNUM,
          };
        }),
      });
    });
  }

  searchHouse(mpid) {
    SearchHouseByMP(mpid, d => {
      this.setState({
        houses: (d || []).map(r => {
          return {
            id: r.ID,
            name: r.NAME,
          };
        }),
      });
    });
  }

  searchLZ(houseid) {
    SearchLZByHouse(houseid, d => {
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
    let fullAddress = `${obj.DISTRICTNAME || ept}${obj.ROADNAME || ept}${obj.MPNUM ||
      ept}${obj.HOUSENAME || ept}${obj.LZNAME || ept}${obj.CELL || ept}${obj.ROOM || ept}`;
    this.mObj.ADDRESS = fullAddress;
    this.setState({ fullAddress: fullAddress });
  }

  save() {
    let obj = {
      ...this.mObj,
      ID: this.entity.ID,
    };

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
      mps,
      houses,
      lzs,
      fullAddress,
      showLocateMap,
      showLoading,
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
                      <FormItem label="名称" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getInput(this, 'NAME', '名称')}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="类型" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getSelect(this, 'LX', null, '类型', [
                          { id: '1', name: '门牌' },
                          { id: '2', name: '楼幢' },
                        ])}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="登记时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getDatePicker(this, 'CREATETIME', '登记时间')}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem label="所属行政区" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getCascader(this, 'DISTRICTID', '所属行政区', districts, (v, o) => {
                          this.mObj.DISTRICTNAME = o.map(i => i.label).join('');
                          this.mObj.DISTRICTID = v && v.length && v[v.length - 1];
                          this.getFullAddress();
                        })}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="所属道路" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getSelect(
                          this,
                          'ROADID',
                          'ROADNAME',
                          '所属道路',
                          roads,
                          e => {
                            this.searchRoads(e);
                          },
                          (v, o) => {
                            this.searchMP(v);
                            this.getFullAddress();
                          },
                          true
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="所属门牌" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getSelect(
                          this,
                          'MPID',
                          'MPNUM',
                          '所属门牌',
                          mps,
                          null,
                          e => {
                            this.searchHouse(e);
                            this.getFullAddress();
                          },
                          false
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem label="所属小区" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getSelect(
                          this,
                          'HOUSEID',
                          'HOUSENAME',
                          '所属小区',
                          houses,
                          null,
                          e => {
                            this.searchLZ();
                            this.getFullAddress();
                          },
                          false
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="所属楼栋" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getSelect(
                          this,
                          'LZID',
                          'LZNAME',
                          '所属楼栋',
                          lzs,
                          null,
                          (v, o) => {
                            this.getFullAddress();
                          },
                          false
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
                  </Row>
                  <Row>
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
                    <Col span={16}>
                      <FormItem label="完整地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <Input value={fullAddress} disabled />
                      </FormItem>
                    </Col>
                    <Button
                      style={{ position: 'absolute', right: ' -40px' }}
                      icon="environment"
                      shape="circle"
                      type="primary"
                      onClick={e => {
                        this.setState({ showLocateMap: true });
                      }}
                    />
                  </Row>
                </div>
              </div>
            </div>
          )}
          <div className={st.fmgrp}>
            <div className={st.fmgrphd}>图片</div>
            <div className={st.fmgrpctt}>fmgrpctt</div>
          </div>
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
