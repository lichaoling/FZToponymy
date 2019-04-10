import { Component } from 'react';
import st from './DLForm.less';

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
import { roadModify } from '../../../services/DataManage';
import { getDistricts } from '../../../utils/utils';
import { warn, error } from '../../../utils/notification';
import LocateMap from '../../../common/Components/Maps/LocateMap2.js';
import icons from '../../../common/Components/Maps/icons';

const FormItem = Form.Item;
const { touchIcon } = icons;
const { TextArea } = Input;

class DLForm extends Component {
  state = {
    showLoading: false,
    districtLoading: false,
    districts: [],
    showCheckIcon: 'empty',
    nameCheckMessage: null,
    showLocateMap: false,
    data: this.props.data,
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
    } = this.state;
    return (
      <div className={st.DLForm}>
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
                基本信息<span>说明：“ * ”号标识的为必填项</span>
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
                          <span className={st.ired}>*</span>标准名称
                        </span>
                      }
                    >
                      <input
                        class="ant-input"
                        type="text"
                        defaultValue={data.NAME}
                        onChange={e => {
                          this.mObj.NAME = e.target.value;
                          data.NAME = e.target.value;
                          this.setState({ data });
                        }}
                        onBlur={e => {
                          this.checkName();
                        }}
                        placeholder="标准名称"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      {this.getCheckIcon()}
                      <div style={{ color: showCheckIcon === 'no' ? 'red' : 'green' }}>
                        {nameCheckMessage}
                      </div>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="原规划名称">
                      <Input
                        defaultValue={data.PLANNAME}
                        onChange={e => {
                          this.mObj.PLANNAME = e.target.value;
                        }}
                        placeholder="原规划名称"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="起点">
                      <Input
                        defaultValue={data.STARTDIRECTION}
                        onChange={e => {
                          this.mObj.STARTDIRECTION = e.target.value;
                        }}
                        placeholder="起点（东/南）起"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="止点">
                      <Input
                        defaultValue={data.ENDDIRECTION}
                        onChange={e => {
                          this.mObj.ENDDIRECTION = e.target.value;
                        }}
                        placeholder="止点（西/北）至"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="走向">
                      <Input
                        defaultValue={data.ZX}
                        onChange={e => {
                          this.mObj.ZX = e.target.value;
                        }}
                        placeholder="走向"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="长度（米）">
                      <InputNumber
                        defaultValue={data.LENGTH}
                        style={{ width: '100%' }}
                        placeholder="长度（米）"
                        onChange={e => {
                          this.mObj.LENGTH = e;
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="宽度（米）">
                      <InputNumber
                        defaultValue={data.WIDTH}
                        style={{ width: '100%' }}
                        placeholder="宽度（米）"
                        onChange={e => {
                          this.mObj.WIDTH = e;
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="建成时间">
                      <DatePicker
                        defaultValue={data.JCSJ ? moment(data.JCSJ) : undefined}
                        style={{ width: '100%' }}
                        onChange={e => {
                          this.mObj.JCSJ = e;
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="路面结构">
                      <Input
                        defaultValue={data.LMJG}
                        onChange={e => {
                          this.mObj.LMJG = e.target.value;
                        }}
                        placeholder="路面结构"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="性质">
                      <Select
                        defaultValue={data.NATURE}
                        allowClear
                        onChange={e => {
                          this.mObj.NATURE = e;
                        }}
                        placeholder="性质"
                      >
                        {['快速路', '主干道', '次干道', '大桥', '内河桥梁'].map(d => (
                          <Select.Option key={d} value={d}>
                            {d}
                          </Select.Option>
                        ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="门牌号范围">
                      <Input
                        defaultValue={data.MPNUMRANGE}
                        onChange={e => {
                          this.mObj.MPNUMRANGE = e.target.value;
                        }}
                        placeholder="门牌号范围"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={
                        <span>
                          <span className={st.ired}>*</span>命名时间
                        </span>
                      }
                    >
                      <DatePicker
                        defaultValue={moment(data.BZTIME)}
                        style={{ width: '100%' }}
                        onChange={e => {
                          this.mObj.BZTIME = e;
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label={'空间定位'}>
                      <Input
                        value={data.GEOM_WKT ? `已定位` : '未定位'}
                        style={{ width: '100%' }}
                        disabled={true}
                        placeholder="空间定位"
                      />
                    </FormItem>
                  </Col>
                  <Col span={1}>
                    <FormItem>
                      <Tooltip placement="right" title="定位">
                        <Button
                          style={{ marginLeft: '20px' }}
                          type="primary"
                          shape="circle"
                          icon="environment"
                          size="small"
                          onClick={this.showLocateMap.bind(this)}
                        />
                      </Tooltip>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="道路类别">
                      <Select
                        defaultValue={
                          [data.DLLB, data.DZFLBM] ? [data.DLLB, data.DZFLBM] : undefined
                        }
                        allowClear
                        onChange={e => {
                          this.mObj.DLLB = e[0];
                          this.mObj.DZFLBM = e[1];
                        }}
                        placeholder="道路类别"
                      >
                        <Select.Option key="31" value={['街', '11']}>
                          街
                        </Select.Option>
                        <Select.Option key="32" value={['路', '12']}>
                          路
                        </Select.Option>
                        <Select.Option key="33" value={['巷', '13']}>
                          巷
                        </Select.Option>
                        <Select.Option key="34" value={['弄', '14']}>
                          弄
                        </Select.Option>
                        <Select.Option key="15" value={['其它', '15']}>
                          其它
                        </Select.Option>
                        <Select.Option key="16" value={['桥梁', '16']}>
                          桥梁
                        </Select.Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={16}>
                    <FormItem
                      labelCol={{ span: 5 }}
                      wrapperCol={{ span: 19 }}
                      label="名称含义或理由"
                    >
                      <TextArea
                        defaultValue={data.MCHY}
                        onChange={e => {
                          this.mObj.MCHY = e.target.value;
                        }}
                        placeholder="名称含义或理由"
                        autosize={{ minRows: 2 }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
            <div className={st.group}>
              <div className={st.grouptitle}>
                申办人信息<span>说明：“ * ”号标识的为必填项</span>
              </div>
              <div className={st.groupcontent}>
                <Row>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={
                        <span>
                          <span className={st.ired}>*</span>联系人
                        </span>
                      }
                    >
                      <Input
                        defaultValue={data.LXR}
                        onChange={e => {
                          this.mObj.LXR = e.target.value;
                        }}
                        placeholder="联系人"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={
                        <span>
                          <span className={st.ired}>*</span>联系电话
                        </span>
                      }
                    >
                      <Input
                        defaultValue={data.LXDH}
                        onChange={e => {
                          this.mObj.LXDH = e.target.value;
                        }}
                        placeholder="联系电话"
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={
                        <span>
                          <span className={st.ired}>*</span>申报单位
                        </span>
                      }
                    >
                      <Input
                        defaultValue={data.SBDW}
                        onChange={e => {
                          this.mObj.SBDW = e.target.value;
                        }}
                        placeholder="申报单位"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="备注">
                      <TextArea
                        defaultValue={data.BZ}
                        onChange={e => {
                          this.mObj.BZ = e.target.value;
                        }}
                        placeholder="备注"
                        autosize={{ minRows: 2 }}
                      />
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
DLForm = Form.create()(DLForm);
export default DLForm;
