import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
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
} from 'antd';
import st from './DLQLForm.less';
import {
  baseUrl,
  url_GetDistrictTree,
  url_CheckRoadName,
  url_SearchRoadByID,
  url_RoadAndBridgeApplicant,
  url_GetNewGuid,
  url_RoadApprove,
} from '../../../common/urls.js';
import { getDistricts } from '../../../utils/utils.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import { Post } from '../../../utils/request.js';
import LocateMap from '../Maps/LocateMap2.js';
import { getDivIcons } from '../Maps/icons';

const FormItem = Form.Item;
const { TextArea } = Input;
const { mp } = getDivIcons();
const RadioGroup = Radio.Group;

class DLQLForm extends Component {
  state = {
    districts: [],
    entity: { BZTIME: moment() },
    showLocateMap: false,
    showLoading: false,
    showCheckIcon: 'empty',
    reload: false,
    approveState: null,
    result: null,
    suggestion: null,
  };

  // 存储修改后的数据
  mObj = {};

  showLocateMap() {
    this.setState({ showLocateMap: true });
  }

  closeLocateMap() {
    this.setState({ showLocateMap: false });
  }

  showLoading() {
    this.setState({ showLoading: true });
  }

  hideLoading() {
    this.setState({ showLoading: false });
  }

  // 获取行政区数据
  async getDistricts() {
    this.showLoading();
    let rt = await Post(url_GetDistrictTree);
    rtHandle(rt, d => {
      let districts = getDistricts(d);
      this.setState({ districts: districts });
    });
    this.hideLoading();
  }

  async getFormData(id) {
    if (!id) {
      id = this.props.id;
    }
    // 获取道路桥梁的申请数据
    if (id) {
      this.showLoading();
      let rt = await Post(url_SearchRoadByID, { id: id });
      rtHandle(rt, d => {
        debugger;
        let data = d.Data;
        let dIDs = data.DistrictIDs;
        data.Districts = dIDs.split('.');
        data.BZTIME = data.BZTIME ? moment(data.BZTIME) : null;
        data.JCSJ = data.JCSJ ? moment(data.JCSJ) : null;
        this.setState({ reload: true }, e => {
          this.setState({ entity: data, approveState: d.State, reload: false });
        });
        this.hideLoading();
      });
    } else {
      this.showLoading();
      // 获取一个新的guid
      let rt = await Post(url_GetNewGuid);
      rtHandle(rt, d => {
        // let { entity } = this.state;
        let entity = {
          ID: d,
        };
        this.setState({ entity: entity });
        this.hideLoading();
      });
    }
  }

  validate(errs, bName) {
    errs = errs || [];
    let { entity } = this.state;
    let saveObj = {
      ID: entity.ID,
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
      ...entity,
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
    // 如果验证的不是标准名称
    if (!bName) {
      // // 起点（东/南）起
      // if (!validateObj.STARTDIRECTION) {
      //   errs.push('请填写起点（东/南）起');
      // }

      // // 原规划名称
      // if (!validateObj.PLANNAME) {
      //   errs.push('请填写原规划名称');
      // }

      // //止点（西/北）至
      // if (!validateObj.ENDDIRECTION) {
      //   errs.push('请填写止点（西/北）至');
      // }

      // //长度
      // if (!validateObj.LENGTH) {
      //   errs.push('请填写长度');
      // }

      // //宽度
      // if (!validateObj.WIDTH) {
      //   errs.push('请填写宽度');
      // }

      // //建成时间
      // if (!validateObj.JCSJ) {
      //   errs.push('请填写建成时间');
      // }

      // //性质
      // if (!validateObj.NATURE) {
      //   errs.push('请填写性质');
      // }

      // //门牌号范围
      // if (!validateObj.MPNUMRANGE) {
      //   errs.push('请填写门牌号范围');
      // }

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

      //如果是审批
      if (this.props.isApproval && this.state.approveState != 'complete') {
        if (!this.state.result) errs.push('请选择审批结果');
        if (!this.state.suggestion || this.state.suggestion === '') errs.push('请填写审批意见');
      }
    }

    return { errs, saveObj, validateObj };
  }

  async checkName() {
    let { errs, saveObj, validateObj, showCheckIcon } = this.validate([], true);
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
      let { ID, DISTRICTID, NAME } = validateObj;
      await Post(
        url_CheckRoadName,
        {
          ID,
          DISTRICTID,
          NAME,
        },
        e => {
          if (e.length === 0) {
            notification.success({ description: '“命名”有效、可用！', message: '成功' });
            this.setState({ showCheckIcon: 'yes' });
          } else {
            notification.error({
              description: e.map(t => <span>{t}</span>),
              message: '失败',
            });
            this.setState({ showCheckIcon: 'no' });
          }
        }
      );
    }
  }

  getCheckIcon() {
    let { showCheckIcon } = this.state;
    let dom = null;
    if (showCheckIcon === 'yes') dom = <span className="iconfont icon-iconcorrect" />;
    else if (showCheckIcon === 'no') dom = <span className="iconfont icon-cuowu" />;
    return dom;
  }

  closeEditForm() {}

  onSaveClick = e => {
    e.preventDefault();
    this.props.form.validateFields(
      async function(err, values) {
        let errors = [];
        // form 的验证错误
        if (err) {
          for (let i in err) {
            let j = err[i];
            if (j.errors) {
              errors = errors.concat(j.errors.map(item => item.message));
            }
          }
        }

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
          this.props.isApproval ? this.approve(saveObj) : this.save(saveObj);
        }
      }.bind(this)
    );
  };
  async approve(obj) {
    let { result, suggestion } = this.state;
    await Post(url_RoadApprove, { mObj: JSON.stringify(obj), result, suggestion }, e => {
      notification.success({ description: '审批成功！', message: '成功' });
      this.mObj = {};
      this.setState({ showCheckIcon: 'empty'});
      if (this.props.onSaveSuccess) {
        this.props.onSaveSuccess();
      }
    });
  }

  async save(obj) {
    await Post(url_RoadAndBridgeApplicant, { mObj: JSON.stringify(obj) }, e => {
      notification.success({ description: '保存成功！', message: '成功' });
      this.mObj = {};
      if (this.props.onSaveSuccess) {
        this.props.onSaveSuccess();
      }
      this.setState({ showCheckIcon: 'empty' });
      this.getFormData(this.state.entity.ID);
    });
  }
  isSaved() {
    let saved = true;
    for (let i in this.mObj) {
      saved = false;
      break;
    }
    return saved;
  }

  onCancel() {
    if (!this.isSaved()) {
      Modal.confirm({
        title: '提醒',
        content: '是否放弃所做的修改？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.props.onCancel && this.props.onCancel();
        },
        onCancel() {},
      });
    } else {
      this.props.onCancel && this.props.onCancel();
    }
  }

  onAdd() {
    this.mObj = {};
    this.getFormData();
    this.setState({ reload: true }, e => {
      this.setState({ reload: false });
    });
  }

  onEmpty() {
    if (!this.isSaved()) {
      Modal.confirm({
        title: '提醒',
        content: '是否放弃所做的修改？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.props.onCancel && this.props.onCancel();
        },
        onCancel() {},
      });
    } else {
      this.props.onCancel && this.props.onCancel();
    }
  }

  componentDidMount() {
    this.getDistricts();
    this.getFormData();
  }
  render() {
    let {
      districts,
      entity,
      showLocateMap,
      showLoading,
      showCheckIcon,
      reload,
      approveState,
      result,
      suggestion,
    } = this.state;
    let shapeOptions = {
      stroke: true,
      color: 'red',
      weight: 6,
      opacity: 1,
      fill: false,
      clickable: true,
    };
    console.log(entity)
    return (
      <div className={st.DLQLForm}>
        <Spin
          className={showLoading ? 'active' : ''}
          spinning={showLoading}
          size="large"
          tip="数据加载中..."
        />

        <div className={st.content} style={showLoading ? { filter: 'blur(2px)' } : null}>
          <div className={st.ct_header}>
            <h1>{this.props.title}</h1>
          </div>
          <div className={st.ct_form}>
            <div>
              {reload ? null : (
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
                                <span className={st.ired}>*</span>所在（跨）行政区
                              </span>
                            }
                          >
                            <Cascader
                              defaultValue={entity.Districts ? entity.Districts : undefined}
                              expandTrigger="hover"
                              changeOnSelect
                              options={districts}
                              placeholder="所在（跨）行政区"
                              onChange={(a, b) => {
                                this.mObj.districts = a;
                                this.setState({ showCheckIcon: 'empty' });
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                            />
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
                            <Input
                              defaultValue={entity.NAME ? entity.NAME : undefined}
                              onChange={e => {
                                // let { entity } = this.state;
                                this.mObj.NAME = e.target.value;
                                this.setState({
                                  // entity: entity,
                                  showCheckIcon: 'empty',
                                  // isSaved: false,
                                });
                              }}
                              placeholder="标准名称"
                            />
                          </FormItem>
                        </Col>
                        <Col span={1}>
                          <FormItem>
                            {this.getCheckIcon()}
                            <Button
                              onClick={this.checkName.bind(this)}
                              style={{ marginLeft: '20px', display: 'flex' }}
                              type="primary"
                            >
                              命名检查
                            </Button>
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="原规划名称"
                          >
                            <Input
                              defaultValue={entity.PLANNAME ? entity.PLANNAME : undefined}
                              onChange={e => {
                                this.mObj.PLANNAME = e.target.value;
                              }}
                              placeholder="原规划名称"
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="起点（东/南）起"
                          >
                            <Input
                              defaultValue={
                                entity.STARTDIRECTION ? entity.STARTDIRECTION : undefined
                              }
                              onChange={e => {
                                this.mObj.STARTDIRECTION = e.target.value;
                              }}
                              placeholder="起点（东/南）起"
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="止点（西/北）至"
                          >
                            <Input
                              defaultValue={entity.ENDDIRECTION ? entity.ENDDIRECTION : undefined}
                              onChange={e => {
                                this.mObj.ENDDIRECTION = e.target.value;
                              }}
                              placeholder="止点（西/北）至"
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="走向">
                            <Input
                              defaultValue={entity.ZX ? entity.ZX : undefined}
                              onChange={e => {
                                this.mObj.ZX = e.target.value;
                              }}
                              placeholder="走向"
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="长度（米）"
                          >
                            <InputNumber
                              defaultValue={entity.LENGTH ? entity.LENGTH : undefined}
                              style={{ width: '100%' }}
                              placeholder="长度（米）"
                              onChange={e => {
                                this.mObj.LENGTH = e;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="宽度（米）"
                          >
                            <InputNumber
                              defaultValue={entity.WIDTH ? entity.WIDTH : undefined}
                              style={{ width: '100%' }}
                              placeholder="宽度（米）"
                              onChange={e => {
                                this.mObj.WIDTH = e;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="建成时间"
                          >
                            <DatePicker
                              defaultValue={entity.JCSJ ? entity.JCSJ : undefined}
                              style={{ width: '100%' }}
                              onChange={e => {
                                this.mObj.JCSJ = e;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="路面结构"
                          >
                            <Input
                              defaultValue={entity.LMJG ? entity.LMJG : undefined}
                              onChange={e => {
                                this.mObj.LMJG = e.target.value;
                              }}
                              placeholder="路面结构"
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="性质">
                            <Select
                              defaultValue={entity.NATURE ? entity.NATURE : undefined}
                              allowClear
                              onChange={e => {
                                this.mObj.NATURE = e;
                              }}
                              placeholder="性质"
                              disabled={approveState === 'notFirst' ? true : false}
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
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="门牌号范围"
                          >
                            <Input
                              defaultValue={entity.MPNUMRANGE ? entity.MPNUMRANGE : undefined}
                              onChange={e => {
                                this.mObj.MPNUMRANGE = e.target.value;
                              }}
                              placeholder="门牌号范围"
                              disabled={approveState === 'notFirst' ? true : false}
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
                              defaultValue={entity.BZTIME ? entity.BZTIME : undefined}
                              style={{ width: '100%' }}
                              onChange={e => {
                                this.mObj.BZTIME = e;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={2}>
                          <FormItem>
                            <Tooltip placement="right" title="定位">
                              <Button
                                style={{ marginLeft: '20px' }}
                                type="primary"
                                shape="circle"
                                icon="environment"
                                size="small"
                                onClick={this.showLocateMap.bind(this)}
                                disabled={approveState === 'notFirst' ? true : false}
                              />
                            </Tooltip>
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={16}>
                          <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 19 }}
                            label="名称含义或理由"
                          >
                            <TextArea
                              defaultValue={entity.MCHY ? entity.MCHY : undefined}
                              onChange={e => {
                                this.mObj.MCHY = e.target.value;
                              }}
                              placeholder="名称含义或理由"
                              autosize={{ minRows: 2 }}
                              disabled={approveState === 'notFirst' ? true : false}
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
                              defaultValue={entity.LXR ? entity.LXR : undefined}
                              onChange={e => {
                                this.mObj.LXR = e.target.value;
                              }}
                              placeholder="联系人"
                              disabled={approveState === 'notFirst' ? true : false}
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
                              defaultValue={entity.LXDH ? entity.LXDH : undefined}
                              onChange={e => {
                                this.mObj.LXDH = e.target.value;
                              }}
                              placeholder="联系电话"
                              disabled={approveState === 'notFirst' ? true : false}
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
                              defaultValue={entity.SBDW ? entity.SBDW : undefined}
                              onChange={e => {
                                this.mObj.SBDW = e.target.value;
                              }}
                              placeholder="申报单位"
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={16}>
                          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="备注">
                            <TextArea
                              defaultValue={entity.BZ ? entity.BZ : undefined}
                              onChange={e => {
                                this.mObj.BZ = e.target.value;
                              }}
                              placeholder="备注"
                              autosize={{ minRows: 2 }}
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {this.props.isApproval && approveState !== 'complete' ? (
                    <div className={st.group}>
                      <div className={st.grouptitle}>
                        审批信息<span>说明：“ * ”号标识的为必填项</span>
                      </div>
                      <div className={st.groupcontent}>
                        {entity.ROLLBACKSSUGGESTION ? (
                          <Row>
                            <Col span={16}>
                              <FormItem
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                label="审批退回意见"
                              >
                                <TextArea
                                  initalValue={entity.ROLLBACKSSUGGESTION}
                                  placeholder="审批退回意见"
                                  autosize={{ minRows: 2 }}
                                  disabled
                                />
                              </FormItem>
                            </Col>
                          </Row>
                        ) : null}
                        <Row>
                          <Col span={8}>
                            <FormItem
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 16 }}
                              label={<span>审批结果</span>}
                            >
                              <RadioGroup
                                onChange={e => {
                                  this.setState({ result: e.target.value });
                                }}
                              >
                                <Radio value="同意">同意</Radio>
                                <Radio value="不同意">不同意</Radio>
                              </RadioGroup>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={16}>
                            <FormItem
                              labelCol={{ span: 4 }}
                              wrapperCol={{ span: 20 }}
                              label="审批意见"
                            >
                              <TextArea
                                initalValue={entity.SPYJ ? entity.SPYJ : undefined}
                                onChange={e => {
                                  this.setState({ suggestion: e.target.value });
                                }}
                                placeholder="审批意见"
                                autosize={{ minRows: 2 }}
                              />
                            </FormItem>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  ) : null}
                </Form>
              )}
            </div>
          </div>
          <div className={st.ct_footer}>
            <div style={{ float: 'right' }}>
              <Button onClick={this.onSaveClick.bind(this)} type="primary">
                保存
              </Button>
              &emsp;
              {this.props.isApproval ? (
                <Button type="default" onClick={this.onCancel.bind(this)}>
                  取消
                </Button>
              ) : null}
              &emsp;
              {!this.props.isApproval ? (
                <Button type="default" onClick={this.onAdd.bind(this)}>
                  追加
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <Modal
          wrapClassName={st.locatemap}
          visible={showLocateMap}
          destroyOnClose={true}
          onCancel={this.closeLocateMap.bind(this)}
          title="定位"
          footer={null}
        >
          <LocateMap
            onMapReady={lm => {
              // let { Lat, Lng } = this.state.entity;
              // if (Lat && Lng) {
              //   lm.mpLayer = L.marker([Lat, Lng], { icon: mp }).addTo(lm.map);
              //   lm.map.setView([Lat, Lng], 16);
              // }
              let { GEOM_WKT } = this.state.entity;
              if (GEOM_WKT) {
                let geometry = Terraformer.WKT.parse(GEOM_WKT);
                lm.mpLayer = L.geoJSON(geometry, {
                  style: function(feature) {
                    return shapeOptions;
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
              let { entity } = this.state;
              entity.Lat = null;
              entity.Lng = null;
              this.mObj.Lng = entity.Lng;
              this.mObj.Lat = entity.Lat;
            }}
            beforeBtns={[
              {
                id: 'locate',
                name: '道路、桥梁定位',
                icon: 'icon-dingwei',
                onClick: (dom, i, lm) => {
                  if (!lm.locatePen) {
                    // lm.locatePen = new L.Draw.Marker(lm.map, { icon: mp });
                    // lm.locatePen.on(L.Draw.Event.CREATED, e => {
                    //   lm.mpLayer && lm.mpLayer.remove();
                    //   var { layer } = e;
                    //   lm.mpLayer = layer;
                    //   layer.addTo(lm.map);
                    // });
                    lm.locatePen = new L.Draw.Polyline(lm.map, {
                      shapeOptions: shapeOptions,
                      icon: new L.DivIcon({
                        iconSize: new L.Point(8, 8),
                        className: 'leaflet-div-icon leaflet-editing-icon',
                      }),
                      touchIcon: new L.DivIcon({
                        iconSize: new L.Point(10, 10),
                        className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon',
                      }),
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
                  let geometry = lm.mpLayer.toGeoJSON().geometry;
                  entity.GEOM_WKT = Terraformer.WKT.convert(geometry);
                  this.mObj.GEOM_WKT = entity.GEOM_WKT;
                  // let { lat, lng } = lm.mpLayer.getLatLng();
                  // let { entity } = this.state;

                  // entity.Lng = lng.toFixed(8) - 0;
                  // entity.Lat = lat.toFixed(8) - 0;

                  // this.mObj.Lng = entity.Lng;
                  // this.mObj.Lat = entity.Lat;

                  this.setState({
                    entity: entity,
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
DLQLForm = Form.create()(DLQLForm);
export default DLQLForm;
