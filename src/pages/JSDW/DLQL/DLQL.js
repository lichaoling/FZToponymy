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
import st from './DLQL.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class DLQL extends Component {
  closeEditForm() {}
  onSaveClick() {}
  onCancel() {}
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={st.DLQL}>
        <div className={st.content}>
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
                          value={null} /*entity.Districts*/
                          expandTrigger="hover"
                          // options={districts}
                          placeholder="所在（跨）行政区"
                          onChange={(a, b) => {
                            // this.mObj.districts = b;
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
                            placeholder="拟定标准名称"
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
                            <span className={st.ired}>*</span>原规划名称
                          </span>
                        }
                      >
                        {getFieldDecorator('PLANNAME', {
                          initialValue: null, //entity.PropertyOwner,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.PropertyOwner = e.target.value;
                            }}
                            placeholder="原规划名称"
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
                            <span className={st.ired}>*</span>起点（东/南）起
                          </span>
                        }
                      >
                        {getFieldDecorator('STARTDIRECTION', {
                          initialValue: null, //entity.PropertyOwner,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.PropertyOwner = e.target.value;
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
                          initialValue: null, //entity.PropertyOwner,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.PropertyOwner = e.target.value;
                            }}
                            placeholder="止点（西/北至）"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="走向">
                        {getFieldDecorator('ZX', {
                          initialValue: null, //entity.IDNumber,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.IDNumber = e.target.value;
                            }}
                            placeholder="走向"
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
                            <span className={st.ired}>*</span>长度（米）
                          </span>
                        }
                      >
                        {getFieldDecorator('LENGTH', {
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
                            <span className={st.ired}>*</span>宽度（米）
                          </span>
                        }
                      >
                        {getFieldDecorator('WIDTH', {
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
                            <span className={st.ired}>*</span>建成时间
                          </span>
                        }
                      >
                        {getFieldDecorator('JCSJ', {
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
                    <Col span={8}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>路面结构
                          </span>
                        }
                      >
                        {getFieldDecorator('LMJG', {
                          initialValue: null, //entity.HSNumber,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.HSNumber = e.target.value;
                              // this.combineStandard();
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
                          initialValue: null, //entity.MPNumber,
                        })(
                          <Select
                            allowClear
                            onChange={e => {
                              // this.mObj.MPSize = e || '';
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
                          initialValue: null, //entity.HSNumber,
                        })(
                          <Input
                            onChange={e => {
                              // this.mObj.HSNumber = e.target.value;
                              // this.combineStandard();
                            }}
                            placeholder="门牌号范围"
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
                            <span className={st.ired}>*</span>名称含义或理由
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
                            placeholder="名称含义或理由"
                            autosize={{ minRows: 2 }}
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
DLQL = Form.create()(DLQL);
export default DLQL;
