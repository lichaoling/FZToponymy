import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Icon,
  Select,
  Tooltip,
  Spin,
  notification,
} from 'antd';
import st from './MPH.less';
import { baseUrl } from '../../../common/urls.js';
import UploadPicture from '../../../common/Components/UploadPicture/UploadPicture.js';

const FormItem = Form.Item;
const { TextArea } = Input;
const Search = Input.Search;

class MPH extends Component {
  closeEditForm() {}
  onSaveClick() {}
  onCancel() {}
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={st.MPH}>
        <div className={st.content}>
          <div className={st.ct_header}>
            <h1>新建住宅小区（楼宇）门牌号申请单</h1>
          </div>
          <div className={st.ct_form}>
            <Form>
              <div className={st.group}>
                <div className={st.grouptitle}>
                  基本信息<span>说明：“ * ”号标识的为必填项</span>
                </div>
                <div className={st.groupcontent}>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={
                          <span>
                            <span className={st.ired}>*</span>小区（楼宇）名称
                          </span>
                        }
                      >
                        <Search
                          style={{ width: '100%' }}
                          placeholder="小区（楼宇）名称搜索"
                          onSearch={value => {}}
                          enterButton
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className={st.group}>
                <div className={st.grouptitle}>立项批文、营业执照</div>
                <div className={st.groupcontent}>
                  <Row>
                    <Col span={12}>
                      <FormItem label="立项批文">
                        <UploadPicture
                          // fileList={entity.FCZ}
                          // id={entity.ID}
                          fileBasePath={baseUrl}
                          // data={{ RepairType: -1, DOCTYPE: 'FCZ', FileType: 'Residence' }}
                          // uploadAction={url_UploadPicture}
                          // removeAction={url_RemovePicture}
                          // getAction={url_GetPictureUrls}
                        />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="营业执照">
                        <UploadPicture
                          // fileList={entity.TDZ}
                          // id={entity.ID}
                          fileBasePath={baseUrl}
                          // data={{ RepairType: -1, DOCTYPE: 'TDZ', FileType: 'Residence' }}
                          // uploadAction={url_UploadPicture}
                          // removeAction={url_RemovePicture}
                          // getAction={url_GetPictureUrls}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className={st.group}>
                <div className={st.grouptitle}>土地出让合同、申请报告</div>
                <div className={st.groupcontent}>
                  <Row>
                    <Col span={12}>
                      <FormItem label="土地出让合同">
                        <UploadPicture
                          // fileList={entity.BDCZ}
                          // id={entity.ID}
                          fileBasePath={baseUrl}
                          // data={{ RepairType: -1, DOCTYPE: 'BDCZ', FileType: 'Residence' }}
                          // uploadAction={url_UploadPicture}
                          // removeAction={url_RemovePicture}
                          // getAction={url_GetPictureUrls}
                        />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="申请报告">
                        <UploadPicture
                          // fileList={entity.HJ}
                          // id={entity.ID}
                          fileBasePath={baseUrl}
                          // data={{ RepairType: -1, DOCTYPE: 'HJ', FileType: 'Residence' }}
                          // uploadAction={url_UploadPicture}
                          // removeAction={url_RemovePicture}
                          // getAction={url_GetPictureUrls}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className={st.group}>
                <div className={st.grouptitle}>总平面图、红线图</div>
                <div className={st.groupcontent}>
                  <Row>
                    <Col span={12}>
                      <FormItem label="总平面图">
                        <UploadPicture
                          // fileList={entity.HJ}
                          // id={entity.ID}
                          fileBasePath={baseUrl}
                          // data={{ RepairType: -1, DOCTYPE: 'HJ', FileType: 'Residence' }}
                          // uploadAction={url_UploadPicture}
                          // removeAction={url_RemovePicture}
                          // getAction={url_GetPictureUrls}
                        />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="红线图">
                        <UploadPicture
                          // fileList={entity.BDCZ}
                          // id={entity.ID}
                          fileBasePath={baseUrl}
                          // data={{ RepairType: -1, DOCTYPE: 'BDCZ', FileType: 'Residence' }}
                          // uploadAction={url_UploadPicture}
                          // removeAction={url_RemovePicture}
                          // getAction={url_GetPictureUrls}
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
MPH = Form.create()(MPH);
export default MPH;
