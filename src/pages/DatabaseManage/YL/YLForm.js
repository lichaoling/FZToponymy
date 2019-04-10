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
import { getDistrictTreeByUID } from '../../../services/Common';
import { checkRoadName } from '../../../services/DLQL';
import { HouseModify, SearchRoads, SearchVillages } from '../../../services/DataManage';
import { getDistricts } from '../../../utils/utils';
import { warn, error } from '../../../utils/notification';
import LocateMap from '../../../common/Components/Maps/LocateMap2.js';
import icons from '../../../common/Components/Maps/icons';

const FormItem = Form.Item;
const { touchIcon } = icons;
const { TextArea } = Input;

class YLForm extends Component {
  state = {
    showLoading: false,
    districtLoading: false,
    districts: [],
    showCheckIcon: 'empty',
    nameCheckMessage: null,
    showLocateMap: false,
    data: this.props.data,
    roadData: [],
    villageData: [],
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

  async roadSearch(e) {
    await SearchRoads({ name: e }, d => {
      this.setState({ roadData: d });
    });
  }
  async villageSearch(e) {
    await SearchVillages({ name: e }, d => {
      this.setState({ villageData: d });
    });
  }

  async checkName() {
    if (this.state.data.DISTRICTID && this.state.data.NAME) {
      let { ID, DISTRICTID, NAME } = this.state.data;
      await checkRoadName({ ID, DISTRICTID, NAME }, e => {
        if (e.length === 0) {
          this.setState({
            nameCheckMessage: '“命名”有效、可用！',
            showCheckIcon: 'yes',
          });
        } else {
          this.setState({
            nameCheckMessage: e.map(t => <span>{t}</span>),
            showCheckIcon: 'no',
          });
        }
      });
    } else {
      this.setState({
        nameCheckMessage: null,
        showCheckIcon: 'empty',
      });
    }
  }
  validate(errs) {
    errs = errs || [];
    let { data } = this.state;
    let saveObj = {
      ID: data.ID,
      ...this.mObj,
    };
    if (saveObj.districts) {
      let ds = saveObj.districts;
      saveObj.DISTRICTID = ds[ds.length - 1];
      delete saveObj.districts;
    }
    if (saveObj.BZTIME) {
      saveObj.BZTIME = saveObj.BZTIME.toISOString();
    }
    if (saveObj.JCSJ) {
      saveObj.JCSJ = saveObj.JCSJ.toISOString();
    }
    let validateObj = {
      ...data,
      ...saveObj,
    };
    // 行政区必填
    if (!validateObj.DISTRICTID) {
      errs.push('请选择行政区');
    }
    // 标准名称
    if (!validateObj.NAME) {
      errs.push('请填写标准名称');
    }
    //命名时间
    if (!validateObj.BZTIME) {
      errs.push('请填写命名时间');
    }

    //联系人
    if (!validateObj.LXR) {
      errs.push('请填写联系人');
    }

    //联系电话
    if (!validateObj.LXDH) {
      errs.push('请填写联系电话');
    }

    //申报单位
    if (!validateObj.SBDW) {
      errs.push('请填写申报单位');
    }
    return { errs, saveObj, validateObj };
  }
  save() {
    this.props.form.validateFields(
      async function(err, values) {
        let errors = [];
        if (err) {
          for (let i in err) {
            let j = err[i];
            if (j.errors) {
              errors = errors.concat(j.errors.map(item => item.message));
            }
          }
        }
        this.checkName();
        let msg = this.state.showCheckIcon == 'no' ? '命名检查未通过！' : null;
        if (msg) errors = errors.concat(msg);
        let { errs, saveObj } = this.validate(errors);
        if (errs.length) {
          Modal.error({
            title: '错误',
            okText: '知道了',
            content: errs.map((e, i) => (
              <div>
                {i + 1}、{e}；
              </div>
            )),
          });
        } else {
          await roadModify({ dataJson: JSON.stringify(saveObj) }, e => {
            if (e == null) {
              notification.success({ description: '保存成功！', message: '成功' });
              this.mObj = {};
              if (this.props.onSaveSuccess) {
                this.props.onSaveSuccess();
              }
            }
          });
        }
      }.bind(this)
    );
  }

  showLocateMap() {
    this.setState({ showLocateMap: true });
  }

  closeLocateMap() {
    this.setState({ showLocateMap: false });
  }

  getCheckIcon() {
    let { showCheckIcon } = this.state;
    let dom = null;
    if (showCheckIcon === 'yes') dom = <span className="iconfont icon-iconcorrect" />;
    else if (showCheckIcon === 'no') dom = <span className="iconfont icon-cuowu" />;
    return dom;
  }

  componentDidMount() {
    if (this.state.data.ROADNAME) this.roadSearch(this.state.data.ROADNAME);
    if (this.state.data.VILLAGENAME) this.villageSearch(this.state.data.VILLAGENAME);
    this.getDistricts();
    this.props.addRef && this.props.addRef(this);
  }
  render() {
    let {
      showLoading,
      districts,
      districtLoading,
      showCheckIcon,
      nameCheckMessage,
      showLocateMap,
      data,
      roadData,
      villageData,
    } = this.state;
    return (
      <div className={st.YLForm}>
        <Spin
          className={showLoading ? 'active' : ''}
          spinning={showLoading}
          size="large"
          tip="数据加载中..."
        />
        <div className={st.content} style={showLoading ? { filter: 'blur(2px)' } : null}>
          <Form>
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
                      <Spin wrapperClassName="ct-inline-loading-100" spinning={districtLoading}>
                        <Cascader
                          defaultValue={data.FULLDISTRICTID.split('.')}
                          expandTrigger="hover"
                          changeOnSelect
                          options={districts}
                          placeholder="所在（跨）行政区"
                          onChange={(a, b) => {
                            this.mObj.districts = a;
                            this.setState({ showCheckIcon: 'empty', nameCheckMessage: null });
                            this.checkName();
                          }}
                        />
                      </Spin>
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
                        showSearch
                        defaultValue={data.ROADNAME}
                        placeholder="所属道路"
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={e => this.roadSearch(e)}
                        onChange={e => this.roadSearch(e)}
                        notFoundContent={null}
                      >
                        {roadData.map(d => (
                          <Option key={d.ID}>{d.NAME}</Option>
                        ))}
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
                        showSearch
                        defaultValue={data.VILLAGENAME}
                        placeholder="所属自然村"
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={e => this.villageSearch(e)}
                        onChange={e => this.villageSearch(e)}
                        notFoundContent={null}
                      >
                        {villageData.map(d => (
                          <Option key={d.ID}>{d.NAME}</Option>
                        ))}
                      </Select>
                    </FormItem>
                  </Col>
                 
                </Row>
              </div>
            </div>
          </Form>
        </div>
        <Modal
          bodyStyle={{ padding: 0 }}
          width="90%"
          style={{ top: 10 }}
          wrapClassName={st.locatemap}
          visible={showLocateMap}
          destroyOnClose={true}
          onCancel={this.closeLocateMap.bind(this)}
          title="定位"
          footer={null}
        >
          <LocateMap
            onMapReady={lm => {
              let { GEOM_WKT } = data;
              if (GEOM_WKT) {
                let geometry = Terraformer.WKT.parse(GEOM_WKT);
                lm.mpLayer = L.geoJSON(geometry, {
                  style: function(feature) {
                    return {
                      stroke: true,
                      color: 'red',
                      weight: 4,
                      opacity: 0.5,
                      fill: false,
                      clickable: true,
                    };
                  },
                }).addTo(lm.map);
                let coordinates = geometry.coordinates.map(e => {
                  return e.reverse();
                });
                lm.map.fitBounds(coordinates);
              }
            }}
            onMapClear={lm => {
              lm.mpLayer && lm.mpLayer.remove();
              lm.mpLayer = null;
            }}
            beforeBtns={[
              {
                id: 'locate',
                name: '道路、桥梁定位',
                icon: 'icon-dingwei',
                onClick: (dom, i, lm) => {
                  if (!lm.locatePen) {
                    lm.locatePen = new L.Draw.Polyline(lm.map, {
                      shapeOptions: {
                        stroke: true,
                        color: 'red',
                        weight: 4,
                        opacity: 0.5,
                        fill: false,
                        clickable: true,
                      },
                      icon: touchIcon,
                    });
                    lm.locatePen.on(L.Draw.Event.CREATED, e => {
                      lm.mpLayer && lm.mpLayer.remove();
                      var { layer } = e;
                      lm.mpLayer = layer;
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
                  let geometry = lm.mpLayer ? lm.mpLayer.toGeoJSON().geometry : null;
                  data.GEOM_WKT = geometry ? Terraformer.WKT.convert(geometry) : null;
                  this.mObj.GEOM_WKT = data.GEOM_WKT;
                  this.setState({
                    data,
                  });
                  this.closeLocateMap();
                },
              },
            ]}
          />
        </Modal>
      </div>
    );
  }
}
YLForm = Form.create()(YLForm);
export default YLForm;
