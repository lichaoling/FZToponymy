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
import { baseUrl, url_GetDistrictTree } from '../../../common/urls.js';
import { getDistricts } from '../../../utils/utils.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import { Post } from '../../../utils/request.js';
import st from './XQLY.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Search = Input.Search;

class XQLY extends Component {
  state = {
    districts: [],
    entity: { BZTime: moment() },
    newForm: true,
  };
  showLocateMap() {
    this.setState({ showLocateMap: true });
  }
  closeLocateMap() {
    this.setState({ showLocateMap: false });
  }
  // 获取行政区数据
  async getDistricts() {
    let rt = await Post(url_GetDistrictTree);
    rtHandle(rt, d => {
      let districts = getDistricts(d);
      this.setState({ districts: districts });
    });
  }

  closeEditForm() {}
  onSaveClick() {}
  onCancel() {}
  componentDidMount() {
    this.getDistricts();
  }
  render() {
    let { districts, entity, newForm } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={st.XQLY}>
        <div className={st.content}>
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
                          value={null} /*entity.Districts*/
                          expandTrigger="hover"
                          options={districts}
                          placeholder="所在行政区"
                          onChange={(a, b) => {
                            // let { entity } = this.state;
                            // entity.Districts = a;
                            // this.getCommunities(a);
                            // this.setState({ entity: entity });
                            // this.combineStandard();
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
                          initialValue: null, //entity.PropertyOwner,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.PropertyOwner = e.target.value;
                            }}
                            placeholder="标准名称"
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
                            <span className={st.ired}>*</span>宣传名称
                          </span>
                        }
                      >
                        {getFieldDecorator('XCMC', {
                          initialValue: null, //entity.PropertyOwner,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.PropertyOwner = e.target.value;
                            }}
                            placeholder="宣传名称"
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
                            <span className={st.ired}>*</span>登记名称
                          </span>
                        }
                      >
                        {getFieldDecorator('DJMC', {
                          initialValue: null, //entity.PropertyOwner,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.PropertyOwner = e.target.value;
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
                          initialValue: null, //entity.PropertyOwner,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.PropertyOwner = e.target.value;
                            }}
                            placeholder="功能"
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
                            <span className={st.ired}>*</span>建筑面积
                          </span>
                        }
                      >
                        {getFieldDecorator('JZMJ', {
                          initialValue: null, //entity.IDNumber,
                        })(<InputNumber style={{ width: '100%' }} onChange={e => {}} />)}
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
                            <span className={st.ired}>*</span>占地面积
                          </span>
                        }
                      >
                        {getFieldDecorator('ZDMJ', {
                          initialValue: null, //entity.IDNumber,
                        })(<InputNumber style={{ width: '100%' }} onChange={e => {}} />)}
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
                          initialValue: null, //entity.IDNumber,
                        })(<InputNumber style={{ width: '100%' }} onChange={e => {}} />)}
                      </FormItem>
                    </Col>
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
                          initialValue: null, // entity.BZTime,
                        })(<InputNumber style={{ width: '100%' }} onChange={e => {}} />)}
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
                            <span className={st.ired}>*</span>始建时间
                          </span>
                        }
                      >
                        {getFieldDecorator('SJSJ', {
                          initialValue: null, //entity.HSNumber,
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={e => {
                              // this.mObj.BZTime = e;
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
                          initialValue: null, //entity.MPNumber,
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={e => {
                              // this.mObj.BZTime = e;
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
                            <span className={st.ired}>*</span>命名时间
                          </span>
                        }
                      >
                        {getFieldDecorator('BZTIME', {
                          initialValue: null, // entity.BZTime,
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={e => {
                              // this.mObj.BZTime = e;
                            }}
                          />
                        )}
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
                            <span className={st.ired}>*</span>名称来历及含义
                          </span>
                        }
                      >
                        {getFieldDecorator('MCHY', {
                          initialValue: null, //entity.HSNumber,
                        })(
                          <TextArea
                            onChange={e => {
                              // this.mObj.HSNumber = e.target.value;
                              // this.combineStandard();
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
                          initialValue: null, //entity.Applicant,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.Applicant = e.target.value;
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
                          initialValue: null, //entity.ApplicantPhone,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.ApplicantPhone = e.target.value;
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
                          initialValue: null, //entity.ApplicantPhone,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.ApplicantPhone = e.target.value;
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
                          initialValue: null, //entity.HSNumber,
                        })(
                          <TextArea
                            onChange={e => {
                              // this.mObj.HSNumber = e.target.value;
                              // this.combineStandard();
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
XQLY = Form.create()(XQLY);
export default XQLY;
