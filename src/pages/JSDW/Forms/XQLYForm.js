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
import {
  baseUrl,
  url_GetDistrictTree,
  url_CheckHouseName,
  url_SearchHouseByID,
  url_HouseApplicant,
} from '../../../common/urls.js';
import { getDistricts } from '../../../utils/utils.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import { Post } from '../../../utils/request.js';
import st from './XQLYForm.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Search = Input.Search;

class XQLYForm extends Component {
  state = {
    districts: [],
    entity: { BZTIME: moment() },
    showLocateMap: false,
    showLoading: false,
    showCheckIcon: 'empty',
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
    this.showLoading();
    if (!id) {
      id = this.props.id;
    }
    // 获取小区楼宇的申请数据
    if (id) {
      let rt = await Post(url_SearchHouseByID, { id: id });
      rtHandle(rt, d => {
        d.BZTIME = d.BZTIME ? moment(d.BZTIME) : null;
        this.setState({ entity: d });
        this.hideLoading();
      });
    }
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
      // 功能
      if (!validateObj.GN) {
        errs.push('请填写功能');
      }

      // 建筑面积
      if (!validateObj.JZMJ) {
        errs.push('请填写建筑面积');
      }

      //占地面积
      if (!validateObj.ZDMJ) {
        errs.push('请填写占地面积');
      }

      //绿化率
      if (!validateObj.LHL) {
        errs.push('请填写绿化率');
      }

      //楼栋数
      if (!validateObj.LZNUM) {
        errs.push('请填写楼栋数');
      }

      //建成时间
      if (!validateObj.JCSJ) {
        errs.push('请填写建成时间');
      }

      //始建时间
      if (!validateObj.SJSJ) {
        errs.push('请填写始建时间');
      }

      //宣传名
      if (!validateObj.XCMC) {
        errs.push('请填写宣传名');
      }

      //登记名
      if (!validateObj.DJMC) {
        errs.push('请填写登记名');
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
        url_CheckHouseName,
        {
          DISTRICTID,
          NAME,
        },
        e => {
          if (e.length == 0) {
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
    console.log(dom);
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
    await Post(url_HouseApplicant, { road: obj }, e => {
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
    return (
      <div className={st.XQLYForm}>
        <Spin
          className={showLoading ? 'active' : ''}
          spinning={showLoading}
          size="large"
          tip="数据加载中..."
        />
        <div className={st.content} style={showLoading ? { filter: 'blur(2px)' } : null}>
          <div className={st.ct_header}>
            <h1>住宅小区、楼宇名称命名（更名）申报表</h1>
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
                            <span className={st.ired}>*</span>所在行政区
                          </span>
                        }
                      >
                        <Cascader
                          value={entity.Districts ? entity.Districts : null}
                          expandTrigger="hover"
                          options={districts}
                          placeholder="所在行政区"
                          onChange={(a, b) => {
                            let { entity } = this.state;
                            entity.Districts = a;
                            this.setState({ entity: entity });
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
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
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
                            <span className={st.ired}>*</span>宣传名称
                          </span>
                        }
                      >
                        {getFieldDecorator('XCMC', {
                          initialValue: entity.XCMC,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
                            }}
                            placeholder="宣传名称"
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
                            <span className={st.ired}>*</span>登记名称
                          </span>
                        }
                      >
                        {getFieldDecorator('DJMC', {
                          initialValue: entity.DJMC,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
                            }}
                            placeholder="登记名称"
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
                            <span className={st.ired}>*</span>功能
                          </span>
                        }
                      >
                        {getFieldDecorator('GN', {
                          initialValue: entity.GN,
                        })(
                          <Input
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
                            }}
                            placeholder="功能"
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
                            <span className={st.ired}>*</span>建筑面积
                          </span>
                        }
                      >
                        {getFieldDecorator('JZMJ', {
                          initialValue: entity.JZMJ,
                        })(
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e;
                              this.setState({ entity: entity });
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
                            <span className={st.ired}>*</span>占地面积
                          </span>
                        }
                      >
                        {getFieldDecorator('ZDMJ', {
                          initialValue: entity.ZDMJ,
                        })(
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e;
                              this.setState({ entity: entity });
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
                            <span className={st.ired}>*</span>楼栋数
                          </span>
                        }
                      >
                        {getFieldDecorator('LZNUM', {
                          initialValue: entity.LZNUM,
                        })(
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e;
                              this.setState({ entity: entity });
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
                            <span className={st.ired}>*</span>绿化率
                          </span>
                        }
                      >
                        {getFieldDecorator('LHL', {
                          initialValue: entity.LHL,
                        })(
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e;
                              this.setState({ entity: entity });
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
                            <span className={st.ired}>*</span>始建时间
                          </span>
                        }
                      >
                        {getFieldDecorator('SJSJ', {
                          initialValue: entity.SJSJ,
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e;
                              this.setState({ entity: entity });
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
                              entity.Districts = e;
                              this.setState({ entity: entity });
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
                            <span className={st.ired}>*</span>命名时间
                          </span>
                        }
                      >
                        {getFieldDecorator('BZTIME', {
                          initialValue: entity.BZTime,
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e;
                              this.setState({ entity: entity });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={16}>
                      <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>名称来历及含义
                          </span>
                        }
                      >
                        {getFieldDecorator('MCHY', {
                          initialValue: entity.MCHY,
                        })(
                          <TextArea
                            onChange={e => {
                              let { entity } = this.state;
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
                            }}
                            placeholder="名称来历及含义"
                            autosize={{ minRows: 2 }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={22}>
                      <FormItem
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 21 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>所属道路
                          </span>
                        }
                      >
                        {
                          <div className={st.road}>
                            <div className={st.roadSelect}>
                              <div className={st.search}>
                                <Search placeholder="道路名称" onSearch={value => {}} />
                              </div>
                              <div className={st.content}>
                                <span>
                                  AAAAA路{' '}
                                  <Tooltip placement="right" title="添加">
                                    <Icon type="plus" />
                                  </Tooltip>
                                </span>
                                <span>
                                  BBBB路{' '}
                                  <Tooltip placement="right" title="添加">
                                    <Icon type="plus" />
                                  </Tooltip>
                                </span>
                              </div>
                            </div>
                            <div className={st.roadConetnt} />
                          </div>
                        }
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
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
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
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
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
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
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
                              entity.Districts = e.target.value;
                              this.setState({ entity: entity });
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
XQLYForm = Form.create()(XQLYForm);
export default XQLYForm;
