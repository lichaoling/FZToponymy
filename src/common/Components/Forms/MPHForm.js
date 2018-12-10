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
import st from './MPHForm.less';
import {
  baseUrl,
  url_GetDistrictTree,
  url_GetHousesByDistFromMP,
  url_SearchHouseBZByID,
  url_HouseAndBuildingBZ,
  url_UploadPicture,
  url_RemovePicture,
  url_GetPictureUrls,
  url_GetNewGuid,
} from '../../../common/urls.js';
import { getDistricts } from '../../../utils/utils.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import { Post } from '../../../utils/request.js';
import UploadPicture from '../UploadPicture/UploadPicture.js';
import UploadFile from '../UploadFile/UploadFile.js';
import { fileType, HouseBZUploadFileType } from '../../enums.js';

const FormItem = Form.Item;
const { TextArea } = Input;
const Search = Input.Search;
const RadioGroup = Radio.Group;

class MPHForm extends Component {
  state = {
    districts: [],
    entity: { BZTIME: moment() },
    showLocateMap: false,
    showLoading: false,
    showCheckIcon: 'empty',
    houseNames: [],
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
    // 获取门牌号的申请数据
    if (id) {
      this.showLoading();
      let rt = await Post(url_SearchHouseBZByID, { id: id });
      rtHandle(rt, d => {
        let data = d.Data;
        let dIDs = data.DistrictIDs;
        data.Districts = dIDs ? dIDs.reverse() : null;

        data.BZTIME = data.BZTIME ? moment(data.BZTIME) : null;
        this.setState({ entity: data });
        this.hideLoading();
      });
    } else {
      // 获取一个新的guid
      let rt = await Post(url_GetNewGuid);
      rtHandle(rt, d => {
        let { entity } = this.state;
        entity.ID = d;
        this.setState({ entity: entity });
      });
    }
  }

  async getHouseNames(districtID) {
    this.showLoading();
    let rt = await Post(url_GetHousesByDistFromMP, { districtID: districtID });
    rtHandle(rt, d => {
      this.setState({ houseNames: d });
      this.hideLoading();
    });
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
      delete saveObj.Districts;
    }
    if (saveObj.BZTIME) {
      saveObj.BZTIME = saveObj.BZTIME.toISOString();
    }
    let validateObj = {
      ...entity,
      ...saveObj,
    };
    // 行政区必填
    if (!validateObj.DISTRICTID) {
      errs.push('请选择行政区');
    }
    // 小区名称必选
    if (!validateObj.HOUSEID) {
      errs.push('请选择小区、楼宇名称');
    }
    //如果是审批
    if (this.props.isApproval && this.state.approveState != 'complete') {
      if (!this.state.result) errs.push('请选择审批结果');
      if (!this.state.suggestion || this.state.suggestion === '') errs.push('请填写审批意见');
    }

    return { errs, saveObj, validateObj };
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
    await Post(url_HouseAndBuildingBZ, { mObj: JSON.stringify(obj) }, e => {
      notification.success({ description: '保存成功！', message: '成功' });
      this.mObj = {};
      if (this.props.onSaveSuccess) {
        this.props.onSaveSuccess();
      }
      this.setState({ showCheckIcon: 'empty', entity: { BZTIME: moment() } });
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
      houseNames,
      reload,
      approveState,
      result,
      suggestion,
    } = this.state;
    return (
      <div className={st.MPHForm}>
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
            {reload ? null : (
              <Form>
                <div className={st.group}>
                  <div className={st.grouptitle}>
                    基本信息<span>说明：“ * ”号标识的为必填项</span>
                  </div>
                  <div className={st.groupcontent}>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          labelCol={{ span: 5 }}
                          wrapperCol={{ span: 15 }}
                          label={
                            <span>
                              <span className={st.ired}>*</span>所在行政区
                            </span>
                          }
                        >
                          <Cascader
                            changeOnSelect
                            initalValue={entity.Districts ? entity.Districts : undefined}
                            expandTrigger="hover"
                            options={districts}
                            placeholder="所在行政区"
                            onChange={(a, b) => {
                              this.mObj.districts = a;
                              this.getHouseNames(a[a.length - 1]);
                            }}
                            disabled={approveState === 'notFirst' ? true : false}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 15 }}
                          label={
                            <span>
                              <span className={st.ired}>*</span>小区（楼宇）名称
                            </span>
                          }
                        >
                          <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="小区（楼宇）名称"
                            optionFilterProp="children"
                            defaultValue={entity.HOUSEID ? entity.HOUSEID : undefined}
                            onChange={e => {
                              this.mObj.HOUSEID = e;
                            }}
                            filterOption={(input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={approveState === 'notFirst' ? true : false}
                          >
                            {houseNames.map(e => {
                              return <Select.Option value={e.ID}>{e.NAME}</Select.Option>;
                            })}
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className={st.group}>
                  <div className={st.grouptitle}>附件信息</div>
                  <div className={st.groupcontent}>
                    <Row>
                      <Col span={12}>
                        <FormItem label="立项批文">
                          <UploadPicture
                            fileList={entity.LXPW}
                            id={entity.ID}
                            fileBasePath={baseUrl}
                            data={{
                              fileType: fileType.HouseBZ,
                              docType: HouseBZUploadFileType.LXPW,
                            }}
                            uploadAction={url_UploadPicture}
                            removeAction={url_RemovePicture}
                            getAction={url_GetPictureUrls}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="营业执照">
                          <UploadPicture
                            fileList={entity.YYZZ}
                            id={entity.ID}
                            fileBasePath={baseUrl}
                            data={{
                              fileType: fileType.HouseBZ,
                              docType: HouseBZUploadFileType.YYZZ,
                            }}
                            uploadAction={url_UploadPicture}
                            removeAction={url_RemovePicture}
                            getAction={url_GetPictureUrls}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem label="土地出让合同">
                          <UploadPicture
                            fileList={entity.TDCRHT}
                            id={entity.ID}
                            fileBasePath={baseUrl}
                            data={{
                              fileType: fileType.HouseBZ,
                              docType: HouseBZUploadFileType.TDCRHT,
                            }}
                            uploadAction={url_UploadPicture}
                            removeAction={url_RemovePicture}
                            getAction={url_GetPictureUrls}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="申请报告">
                          <UploadFile
                            fileList={entity.SQBG}
                            id={entity.ID}
                            fileBasePath={baseUrl}
                            data={{
                              fileType: fileType.HouseBZ,
                              docType: HouseBZUploadFileType.SQBG,
                            }}
                            uploadAction={url_UploadPicture}
                            removeAction={url_RemovePicture}
                            getAction={url_GetPictureUrls}
                            listType="text"
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem label="总平面图">
                          <UploadPicture
                            fileList={entity.ZPMT}
                            id={entity.ID}
                            fileBasePath={baseUrl}
                            data={{
                              fileType: fileType.HouseBZ,
                              docType: HouseBZUploadFileType.ZPMT,
                            }}
                            uploadAction={url_UploadPicture}
                            removeAction={url_RemovePicture}
                            getAction={url_GetPictureUrls}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="红线图">
                          <UploadPicture
                            fileList={entity.HXT}
                            id={entity.ID}
                            fileBasePath={baseUrl}
                            data={{
                              fileType: fileType.HouseBZ,
                              docType: HouseBZUploadFileType.HXT,
                            }}
                            uploadAction={url_UploadPicture}
                            removeAction={url_RemovePicture}
                            getAction={url_GetPictureUrls}
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
                            initalValue={entity.LXR ? entity.LXR : undefined}
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
                            initalValue={entity.LXDH ? entity.LXDH : undefined}
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
                            initalValue={entity.SBDW ? entity.SBDW : undefined}
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
                            initalValue={entity.BZ ? entity.BZ : undefined}
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
                {this.props.isApproval ? (
                  <div className={st.group}>
                    <div className={st.grouptitle}>
                      审批信息<span>说明：“ * ”号标识的为必填项</span>
                    </div>
                    <div className={st.groupcontent}>
                      <Row>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label={<span>审批结果</span>}
                          >
                            <RadioGroup>
                              <Radio value="1">通过</Radio>
                              <Radio value="0">不通过</Radio>
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
                                this.mObj.SPYJ = e.target.value;
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
      </div>
    );
  }
}
MPHForm = Form.create()(MPHForm);
export default MPHForm;
