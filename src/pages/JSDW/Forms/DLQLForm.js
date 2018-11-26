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
} from 'antd';
import st from './DLQLForm.less';
import {
  baseUrl,
  url_GetDistrictTree,
  url_CheckRoadName,
  url_SearchRoadByID,
  url_RoadAndBridgeApplicant,
} from '../../../common/urls.js';
import { getDistricts } from '../../../utils/utils.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import { Post } from '../../../utils/request.js';

const FormItem = Form.Item;
const { TextArea } = Input;

class DLQLForm extends Component {
  state = {
    districts: [],
    entity: { BZTIME: moment() },
    showLocateMap: false,
    showLoading: false,
    showCheckIcon: 'empty',
    isSaved: true,
  };

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
        d.BZTIME = d.BZTIME ? moment(d.BZTIME) : null;
        d.JCSJ = d.JCSJ ? moment(d.JCSJ) : null;
        this.setState({ entity: d });
        this.hideLoading();
      });
    }
    //  else {
    //   let d = { BZTIME: moment() };
    //   this.setState({ entity: d });
    // }
  }

  validate(errs, bName) {
    errs = errs || [];
    let { entity } = this.state;
    let saveObj = {
      ...entity,
    };
    if (saveObj.Districts) {
      let ds = saveObj.Districts;
      saveObj.DISTRICTID = ds[ds.length - 1];
      delete saveObj.Districts;
    }
    if (saveObj.BZTIME) {
      saveObj.BZTIME = saveObj.BZTIME.toISOString();
    }
    if (saveObj.JCSJ) {
      saveObj.JCSJ = saveObj.JCSJ.toISOString();
    }

    let validateObj = {
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
      debugger;
      // 起点（东/南）起
      if (!validateObj.STARTDIRECTION) {
        errs.push('请填写起点（东/南）起');
      }

      // 原规划名称
      if (!validateObj.PLANNAME) {
        errs.push('请填写原规划名称');
      }

      //止点（西/北）至
      if (!validateObj.ENDDIRECTION) {
        errs.push('请填写止点（西/北）至');
      }

      //长度
      if (!validateObj.LENGTH) {
        errs.push('请填写长度');
      }

      //宽度
      if (!validateObj.WIDTH) {
        errs.push('请填写宽度');
      }

      //建成时间
      if (!validateObj.JCSJ) {
        errs.push('请填写建成时间');
      }

      //性质
      if (!validateObj.NATURE) {
        errs.push('请填写性质');
      }

      //门牌号范围
      if (!validateObj.MPNUMRANGE) {
        errs.push('请填写门牌号范围');
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
      let { DISTRICTID, NAME } = validateObj;
      await Post(
        url_CheckRoadName,
        {
          DISTRICTID,
          NAME,
        },
        e => {
          debugger;
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
          this.save(saveObj);
        }
      }.bind(this)
    );
  };

  async save(obj) {
    await Post(url_RoadAndBridgeApplicant, { road: obj }, e => {
      debugger;
      notification.success({ description: '保存成功！', message: '成功' });
      if (this.props.onSaveSuccess) {
        this.props.onSaveSuccess();
      }
      this.setState({ showCheckIcon: 'empty', isSaved: true, entity: { BZTIME: moment() } });
      this.getFormData();
    });
  }

  onCancel() {
    if (!this.state.isSaved) {
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
    let { districts, entity, showLocateMap, showLoading, showCheckIcon } = this.state;
    const { getFieldDecorator } = this.props.form;
    console.log(showLoading);
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
            <h1>道路、桥梁名称核准、命名（更名）申请单</h1>
          </div>
          <div className={st.ct_form}>
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
                          value={entity.Districts == null ? null : entity.Districts}
                          expandTrigger="hover"
                          options={districts}
                          placeholder="所在（跨）行政区"
                          onChange={(a, b) => {
                            let { entity } = this.state;
                            entity.Districts = a;
                            this.setState({ entity: entity, isSaved: false });
                          }}
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
                        {getFieldDecorator('NAME', {
                          initialValue: entity.NAME,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.NAME = e.target.value;
                              this.setState({
                                entity: entity,
                                showCheckIcon: 'empty',
                                isSaved: false,
                              });
                            }}
                            placeholder="标准名称"
                          />
                        )}
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
                        label={
                          <span>
                            <span className={st.ired}>*</span>原规划名称
                          </span>
                        }
                      >
                        {getFieldDecorator('PLANNAME', {
                          initialValue: entity.PLANNAME,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.PLANNAME = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="原规划名称"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>起点（东/南）起
                          </span>
                        }
                      >
                        {getFieldDecorator('STARTDIRECTION', {
                          initialValue: entity.STARTDIRECTION,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.STARTDIRECTION = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="起点（东/南）起"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>止点（西/北至）
                          </span>
                        }
                      >
                        {getFieldDecorator('ENDDIRECTION', {
                          initialValue: entity.ENDDIRECTION,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.ENDDIRECTION = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="止点（西/北至）"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="走向">
                        {getFieldDecorator('ZX', {
                          initialValue: entity.ZX,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.ZX = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="走向"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>长度（米）
                          </span>
                        }
                      >
                        {getFieldDecorator('LENGTH', {
                          initialValue: entity.LENGTH,
                        })(
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.LENGTH = e;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>宽度（米）
                          </span>
                        }
                      >
                        {getFieldDecorator('WIDTH', {
                          initialValue: entity.WIDTH,
                        })(
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.WIDTH = e;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>建成时间
                          </span>
                        }
                      >
                        {getFieldDecorator('JCSJ', {
                          initialValue: entity.JCSJ,
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.JCSJ = e;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="路面结构">
                        {getFieldDecorator('LMJG', {
                          initialValue: entity.LMJG,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.LMJG = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="路面结构"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>性质
                          </span>
                        }
                      >
                        {getFieldDecorator('NATURE', {
                          initialValue: entity.NATURE,
                        })(
                          <Select
                            allowClear
                            onChange={e => {
                              let { entity } = this.state;
                              entity.NATURE = e;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="性质"
                          >
                            {['快速路', '主干道', '次干道', '大桥', '内河桥梁'].map(d => (
                              <Select.Option key={d} value={d}>
                                {d}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>门牌号范围
                          </span>
                        }
                      >
                        {getFieldDecorator('MPNUMRANGE', {
                          initialValue: entity.MPNUMRANGE,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.MPNUMRANGE = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="门牌号范围"
                          />
                        )}
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
                        {getFieldDecorator('BZTIME', {
                          initialValue: entity.BZTIME,
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.BZTIME = e;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                          />
                        )}
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
                        label={
                          <span>
                            <span className={st.ired}>*</span>名称含义或理由
                          </span>
                        }
                      >
                        {getFieldDecorator('MCHY', {
                          initialValue: entity.MCHY,
                        })(
                          <TextArea
                            onChange={e => {
                              let { entity } = this.state;
                              entity.MCHY = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="名称含义或理由"
                            autosize={{ minRows: 2 }}
                          />
                        )}
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
                        {getFieldDecorator('LXR', {
                          initialValue: entity.LXR,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.LXR = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="联系人"
                          />
                        )}
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
                        {getFieldDecorator('LXDH', {
                          initialValue: entity.LXDH,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.LXDH = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="联系电话"
                          />
                        )}
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
                        {getFieldDecorator('SBDW', {
                          initialValue: entity.SBDW,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.SBDW = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="申报单位"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      <FormItem
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>备注
                          </span>
                        }
                      >
                        {getFieldDecorator('BZ', {
                          initialValue: entity.BZ,
                        })(
                          <TextArea
                            onChange={e => {
                              let { entity } = this.state;
                              entity.BZ = e.target.value;
                              this.setState({ entity: entity, isSaved: false });
                            }}
                            placeholder="备注"
                            autosize={{ minRows: 2 }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </div>
            </Form>
          </div>
          <div className={st.ct_footer}>
            <div style={{ float: 'right' }}>
              <Button onClick={this.onSaveClick.bind(this)} type="primary">
                保存
              </Button>
              &emsp;
              <Button type="default" onClick={this.onCancel.bind(this)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
DLQLForm = Form.create()(DLQLForm);
export default DLQLForm;
