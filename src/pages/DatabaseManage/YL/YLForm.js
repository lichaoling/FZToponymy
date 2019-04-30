import { Component } from 'react';
import st from './YLForm.less';

import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Icon,
  Cascader,
  Select,
  Tooltip,
  Spin,
  notification,
  Radio,
  Tag,
} from 'antd';
import { getDistrictTreeByUID, GetNewGuid } from '../../../services/Common';
import { checkRoadName } from '../../../services/DLQL';
import {
  HouseModify,
  SearchRoads,
  SearchVillages,
  HouseDetails,
} from '../../../services/DataManage';
import { getDistricts } from '../../../utils/utils';
import { warn, error, success } from '../../../utils/notification';
import LocateMap from '../../../common/Components/Maps/LocateMap2.js';
import icons from '../../../common/Components/Maps/icons';
import { getRedIcon, redStyle } from '../../../common/LIcons';
import {
  baseUrl,
  fileBasePath,
  url_UploadPicture,
  url_RemovePicture,
  url_GetPictureUrls,
} from '../../../common/urls.js';
import UploadPicture from '../../../components/UploadPicture/UploadPicture';

const FormItem = Form.Item;
const { touchIcon } = icons;
const { TextArea } = Input;

class YLForm extends Component {
  entity = {};

  state = {
    showLoading: false,
    districtLoading: false,
    districts: [],
    roads: [],
    villages: [],
    disabledRoad: false,
    disabledVillage: false,
    showYLLocateMap: false,
    showMPLocateMap: false,
  };

  // 存储修改后的数据
  mObj = {};

  //data = this.props.data;

  async getDistricts() {
    await getDistrictTreeByUID(d => {
      let districts = getDistricts(d);
      this.setState({ districts: districts });
    });
  }

  getFormData() {
    let { id } = this.props;
    if (id) {
      this.setState({ showLoading: true });
      HouseDetails(
        id,
        d => {
          this.entity = d;
          console.log(d);
          this.setState(
            {
              disabledRoad: !!d.VILLAGEID,
              disabledVillage: !!d.ROADID,
              reload: true,
              showLoading: false,
            },
            e => {
              this.setState({ reload: false });
            }
          );
          if (!d.HOUSEID) {
            GetNewGuid(d => {
              this.entity.HOUSEID = d;
              this.setState(
                {
                  reload: true,
                },
                e => {
                  this.setState({ reload: false });
                }
              );
            });
          }
        },
        e => {
          error(e.message);
          this.setState({ showLoading: false });
        }
      );
    }
  }

  searchRoads(v) {
    SearchRoads({ name: v }, d => {
      this.setState({
        roads: (d || []).map(r => {
          return {
            NAME: r.NAME,
            ID: r.ID,
          };
        }),
      });
    });
  }

  searchVillages(v) {
    SearchVillages({ name: v }, d => {
      this.setState({
        villages: (d || []).map(r => {
          return {
            NAME: r.NAME,
            ID: r.ID,
          };
        }),
      });
    });
  }

  getRoads() {
    let { roads } = this.state;
    let { entity } = this;
    roads = roads || [];
    roads = entity.ROADID ? roads.concat({ ID: entity.ROADID, NAME: entity.ROADNAME }) : roads;
    return roads.map(d => (
      <Select.Option key={d.ID} value={d.ID}>
        {d.NAME}
      </Select.Option>
    ));
  }

  getVillages() {
    let { villages } = this.state;
    let { entity } = this;
    villages = villages || [];
    villages = entity.VILLAGEID
      ? villages.concat({ ID: entity.VILLAGEID, NAME: entity.VILLAGENAME })
      : villages;
    return villages.map(d => (
      <Select.Option key={d.ID} value={d.ID}>
        {d.NAME}
      </Select.Option>
    ));
  }

  save() {
    let saveObj = {
      ...this.entity,
      ...this.mObj,
    };

    let { FULLDISTRICTID, VILLAGEID, ROADID } = saveObj;

    if (!FULLDISTRICTID) {
      error('请选择行政区划');
      return;
    }
    if (!VILLAGEID && !ROADID) {
      error('所属道路、所属自然村不能同时为空');
      return;
    }

    HouseModify(saveObj, e => {
      success('保存成功');
      this.mObj = {};
      this.getFormData();
    });
  }

  componentDidMount() {
    this.searchRoads = _.debounce(this.searchRoads, 1000);
    this.searchVillages = _.debounce(this.searchVillages, 1000);
    this.getDistricts();
    this.getFormData();
  }

  render() {
    let {
      showLoading,
      districts,
      districtLoading,
      showYLLocateMap,
      showMPLocateMap,
      roads,
      reload,
      disabledRoad,
      disabledVillage,
    } = this.state;
    let { entity } = this;
    return (
      <div className={st.YLForm}>
        {showLoading ? (
          <Spin className={st.loading} spinning={showLoading} size="large" tip="数据加载中..." />
        ) : null}
        {reload ? null : (
          <div className={st.content} style={showLoading ? { filter: 'blur(2px)' } : null}>
            <div className={st.group}>
              <div className={st.grouptitle}>
                门牌信息<span>说明：“ * ”号标识的为必填项</span>
              </div>
              <div className={st.groupcontent}>
                <Row>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={
                        <span>
                          <span className={st.ired}>*</span>所在行政区
                        </span>
                      }
                    >
                      <Cascader
                        defaultValue={
                          entity.FULLDISTRICTID ? entity.FULLDISTRICTID.split('.') : undefined
                        }
                        expandTrigger="hover"
                        changeOnSelect
                        options={districts}
                        placeholder="所在（跨）行政区"
                        onChange={(a, b) => {
                          this.mObj.FULLDISTRICTID = a && a.join('.');
                        }}
                        style={{ width: '100%' }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={
                        <span>
                          <span className={st.ired}>*</span>所属道路
                        </span>
                      }
                    >
                      <Select
                        disabled={disabledRoad}
                        showSearch
                        allowClear
                        defaultValue={entity.ROADID || undefined}
                        placeholder="所属道路"
                        filterOption={(inputValue, option) => {
                          return !!(
                            option.props.children && option.props.children.indexOf(inputValue) != -1
                          );
                        }}
                        onSearch={v => {
                          this.searchRoads(v);
                        }}
                        onChange={(v, o) => {
                          this.mObj.ROADID = v;
                          this.mObj.ROADNAME = o && o.props.children;
                          this.setState({ disabledRoad: false, disabledVillage: !!v });
                        }}
                        style={{ width: '100%' }}
                      >
                        {this.getRoads()}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={
                        <span>
                          <span className={st.ired}>*</span>所属自然村
                        </span>
                      }
                    >
                      <Select
                        disabled={disabledVillage}
                        showSearch
                        allowClear
                        defaultValue={entity.VILLAGEID || undefined}
                        placeholder="所属自然村"
                        filterOption={(inputValue, option) => {
                          return !!(
                            option.props.children && option.props.children.indexOf(inputValue) != -1
                          );
                        }}
                        onSearch={v => {
                          this.searchVillages(v);
                        }}
                        onChange={(v, o) => {
                          this.mObj.VILLAGEID = v;
                          this.mObj.VILLAGENAME = o && o.props.children;
                          this.setState({ disabledRoad: !!v, disabledVillage: false });
                        }}
                        style={{ width: '100%' }}
                      >
                        {this.getVillages()}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>门牌规格</span>}
                    >
                      <Input
                        placeholder="门牌规格"
                        defaultValue={entity.MPSIZE}
                        onChange={e => {
                          this.mObj.MPSIZE = e.target.value;
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>门牌号</span>}
                    >
                      <Input
                        placeholder="门牌号"
                        addonAfter="号"
                        defaultValue={entity.MPNUM_NO}
                        onChange={e => {
                          this.mObj.MPNUM_NO = e.target.value;
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <Button
                      onClick={e => {
                        this.setState({ showMPLocateMap: true });
                      }}
                      style={{ margin: '8px 0 0 30px' }}
                      type="primary"
                      shape="circle"
                      icon="environment"
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <div className={st.group}>
              <div className={st.grouptitle}>院落信息</div>
              <div className={st.groupcontent}>
                <Row>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>标准名称</span>}
                    >
                      <Input
                        placeholder="标准名称"
                        defaultValue={entity.HOUSENAME || undefined}
                        onChange={e => {
                          this.mObj.HOUSENAME = e.target.value;
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>宣传名称</span>}
                    >
                      <Input
                        placeholder="宣传名称"
                        defaultValue={entity.HOUSEXCMC || undefined}
                        onChange={e => {
                          this.mObj.HOUSEXCMC = e.target.value;
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>登记名称</span>}
                    >
                      <Input
                        placeholder="登记名称"
                        defaultValue={entity.HOUSEDJMC || undefined}
                        onChange={e => {
                          this.mObj.HOUSEDJMC = e.target.value;
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>功能</span>}
                    >
                      <Input
                        placeholder="功能"
                        defaultValue={entity.HOUSEGN || undefined}
                        onChange={e => {
                          this.mObj.HOUSEGN = e.target.value;
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>小区类型</span>}
                    >
                      <Select
                        labelInValue
                        style={{ width: '100%' }}
                        defaultValue={entity.HOUSEXQLX || undefined}
                        placeholder="小区类型"
                        onChange={e => {
                          this.mObj.HOUSEXQLX = e.label;
                          this.mObj.HOUSEDZBM = e.key;
                        }}
                      >
                        {/* <Select.Option key="31" value={{ id: '31', name: '小区' }}>
                          小区
                        </Select.Option>
                        <Select.Option key="32" value={{ id: '32', name: '大厦院落' }}>
                          大厦院落
                        </Select.Option>
                        <Select.Option key="33" value={{ id: '33', name: '单位院落' }}>
                          单位院落
                        </Select.Option>
                        <Select.Option key="34" value={{ id: '34', name: '工矿企业' }}>
                          工矿企业
                        </Select.Option>
                        <Select.Option key="35" value={{ id: '35', name: '文体娱乐' }}>
                          文体娱乐
                        </Select.Option>
                        <Select.Option key="36" value={{ id: '36', name: '宗教场所' }}>
                          宗教场所
                        </Select.Option>
                        <Select.Option key="37" value={{ id: '37', name: '其它' }}>
                          其它
                        </Select.Option> */}
                        <Select.Option key="31" name="小区">
                          小区
                        </Select.Option>
                        <Select.Option key="32" name="大厦院落">
                          大厦院落
                        </Select.Option>
                        <Select.Option key="33" name="单位院落">
                          单位院落
                        </Select.Option>
                        <Select.Option key="34" name="工矿企业">
                          工矿企业
                        </Select.Option>
                        <Select.Option key="35" name="文体娱乐">
                          文体娱乐
                        </Select.Option>
                        <Select.Option key="36" name="宗教场所">
                          宗教场所
                        </Select.Option>
                        <Select.Option key="37" name="其它">
                          其它
                        </Select.Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <Button
                      onClick={e => {
                        this.setState({ showYLLocateMap: true });
                      }}
                      style={{ margin: '8px 0 0 30px' }}
                      type="primary"
                      shape="circle"
                      icon="environment"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>建筑面积</span>}
                    >
                      <Input
                        placeholder="建筑面积"
                        defaultValue={entity.HOUSEJZMJ || undefined}
                        type="number"
                        onChange={e => {
                          this.mObj.HOSUEJZMJ = e.target.value;
                        }}
                        addonAfter="m²"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>占地面积</span>}
                    >
                      <Input
                        placeholder="占地面积"
                        type="number"
                        defaultValue={entity.HOUSEZDMJ || undefined}
                        onChange={e => {
                          this.mObj.HOUSEZDMJ = e.target.value;
                        }}
                        addonAfter="m²"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>绿化率</span>}
                    >
                      <Input
                        placeholder="绿化率"
                        type="number"
                        defaultValue={entity.HOUSELHL || undefined}
                        onChange={e => {
                          this.mObj.HOUSELHL = e.target.value;
                        }}
                        addonAfter="%"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>始建时间</span>}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="始建时间"
                        defaultValue={entity.HOUSESJSJ ? moment(entity.HOUSESJSJ) : undefined}
                        onChange={e => {
                          this.mObj.HOUSESJSJ = e && e.format('YYYY-MM-DD');
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={<span>建成时间</span>}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="建成时间"
                        defaultValue={entity.HOSUEJCSJ ? moment(entity.HOSUEJCSJ) : undefined}
                        onChange={e => {
                          this.mObj.HOSUEJCSJ = e && e.format('YYYY-MM-DD');
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <FormItem
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      label={<span>名称来历及含义</span>}
                    >
                      <Input.TextArea
                        style={{ height: 80 }}
                        placeholder="名称来历及含义"
                        defaultValue={entity.HOSUEMCHY || undefined}
                        onChange={e => {
                          this.mObj.HOSUEMCHY = e.target.value;
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <FormItem
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      label={<span>院落照片</span>}
                    >
                      <UploadPicture
                        fileList={this.entity.Pics}
                        id={this.entity.HOUSEID}
                        fileBasePath={baseUrl}
                        data={{ DOCTYPE: null, FileType: '小区（楼宇）照片' }}
                        uploadAction={url_UploadPicture}
                        removeAction={url_RemovePicture}
                        getAction={url_GetPictureUrls}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        )}
        <div className={st.footer} style={showLoading ? { filter: 'blur(2px)' } : null}>
          <Button type="primary" onClick={this.save.bind(this)}>
            保存
          </Button>
          &emsp;
          <Button onClick={e => this.props.onCancel && this.props.onCancel()}>取消</Button>
        </div>
        <Modal
          bodyStyle={{ padding: 0 }}
          style={{ top: 10 }}
          wrapClassName={st.locatemap}
          visible={showYLLocateMap}
          destroyOnClose={true}
          onCancel={e => {
            this.setState({ showYLLocateMap: false });
          }}
          title="院落位置"
          footer={null}
        >
          <LocateMap
            onMapReady={lm => {
              let { HOUSEWKT, HOUSEWKT2 } = this.entity;
              if (HOUSEWKT || HOUSEWKT2) {
                if (HOUSEWKT)
                  L.geoJSON(Terraformer.WKT.parse(HOUSEWKT), {
                    onEachFeature: function(f, l) {
                      l.setIcon(getRedIcon(''));
                      lm.housePLayer = l;
                      lm.map.setView(l._latlng, 16);
                    },
                  }).addTo(lm.map);
                if (HOUSEWKT2)
                  L.geoJSON(Terraformer.WKT.parse(HOUSEWKT2), {
                    onEachFeature: function(f, l) {
                      l.setStyle({
                        stroke: true,
                        color: 'red',
                        weight: 4,
                        opacity: 0.5,
                        fill: true,
                        clickable: true,
                      });
                      lm.houseGLayer = l;
                    },
                  }).addTo(lm.map);
              } else {
                warn('院落尚未定位');
              }
            }}
            afterBtns={[
              {
                id: 'locatepoint',
                name: '院落定位（点）',
                icon: 'icon-dingwei',
                onClick: (dom, i, lm) => {
                  if (!lm.locatePenP) {
                    lm.locatePenP = new L.Draw.Marker(lm.map, {
                      icon: getRedIcon(''),
                    });
                    lm.locatePenP.on(L.Draw.Event.CREATED, e => {
                      lm.housePLayer && lm.housePLayer.remove();
                      var { layer } = e;
                      lm.housePLayer = layer;
                      layer.addTo(lm.map);
                    });
                  }
                  lm.disableMSTools();
                  if (lm.locatePenP._enabled) {
                    lm.locatePenP.disable();
                  } else {
                    lm.locatePenP.enable();
                  }
                },
              },
              {
                id: 'locatepolygon',
                name: '院落定位（面）',
                icon: 'icon-dingwei',
                onClick: (dom, i, lm) => {
                  if (!lm.locatePen) {
                    lm.locatePen = new L.Draw.Polygon(lm.map, {
                      shapeOptions: {
                        stroke: true,
                        color: 'red',
                        weight: 4,
                        opacity: 0.5,
                        fill: true,
                        clickable: true,
                      },
                      icon: touchIcon,
                    });
                    lm.locatePen.on(L.Draw.Event.CREATED, e => {
                      lm.houseGLayer && lm.houseGLayer.remove();
                      var { layer } = e;
                      lm.houseGLayer = layer;
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
                  let geo1 = lm.housePLayer ? lm.housePLayer.toGeoJSON().geometry : null;
                  this.entity.HOUSEWKT = geo1 ? Terraformer.WKT.convert(geo1) : null;
                  let geo2 = lm.houseGLayer ? lm.houseGLayer.toGeoJSON().geometry : null;
                  this.entity.HOUSEWKT2 = geo2 ? Terraformer.WKT.convert(geo2) : null;
                  this.setState({ showYLLocateMap: false });
                },
              },
            ]}
            onMapClear={lm => {
              lm.housePLayer && lm.housePLayer.remove();
              lm.housePLayer = null;
              lm.houseGLayer && lm.houseGLayer.remove();
              lm.houseGLayer = null;
            }}
          />
        </Modal>
        <Modal
          bodyStyle={{ padding: 0 }}
          style={{ top: 10 }}
          wrapClassName={st.locatemap}
          visible={showMPLocateMap}
          destroyOnClose={true}
          onCancel={e => {
            this.setState({ showMPLocateMap: false });
          }}
          title="门牌位置"
          footer={null}
        >
          <LocateMap
            onMapReady={lm => {
              let { MPWKT } = this.entity;
              if (MPWKT) {
                L.geoJSON(Terraformer.WKT.parse(MPWKT), {
                  onEachFeature: function(f, l) {
                    l.setIcon(getRedIcon(''));
                    lm.mpLayer = l;
                    lm.map.setView(l._latlng, 16);
                  },
                }).addTo(lm.map);
              } else {
                warn('门牌尚未定位');
              }
            }}
            afterBtns={[
              {
                id: 'locatepoint',
                name: '门牌定位',
                icon: 'icon-dingwei',
                onClick: (dom, i, lm) => {
                  if (!lm.locatePenP) {
                    lm.locatePenP = new L.Draw.Marker(lm.map, {
                      icon: getRedIcon(''),
                    });
                    lm.locatePenP.on(L.Draw.Event.CREATED, e => {
                      lm.mpLayer && lm.mpLayer.remove();
                      var { layer } = e;
                      lm.mpLayer = layer;
                      layer.addTo(lm.map);
                    });
                  }
                  lm.disableMSTools();
                  if (lm.locatePenP._enabled) {
                    lm.locatePenP.disable();
                  } else {
                    lm.locatePenP.enable();
                  }
                },
              },
              {
                id: 'savelocation',
                name: '保存定位',
                icon: 'icon-save',
                onClick: (dom, item, lm) => {
                  let geo1 = lm.mpLayer ? lm.mpLayer.toGeoJSON().geometry : null;
                  this.entity.MPWKT = geo1 ? Terraformer.WKT.convert(geo1) : null;
                  this.setState({ showMPLocateMap: false });
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
YLForm = Form.create()(YLForm);
export default YLForm;
