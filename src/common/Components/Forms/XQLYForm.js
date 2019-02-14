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
  Pagination,
  Tag,
} from 'antd';
import {
  baseUrl,
  url_GetDistrictTree,
  url_CheckHouseName,
  url_SearchHouseByID,
  url_HouseAndBuildingApplicant,
  url_SearchRoadNames,
  url_GetNewGuid,
  url_HouseApprove,
} from '../../../common/urls.js';
import { getDistricts } from '../../../utils/utils.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import { Post } from '../../../utils/request.js';
import st from './XQLYForm.less';
import LocateMap from '../Maps/LocateMap2.js';
import { getDivIcons } from '../Maps/icons';

const FormItem = Form.Item;
const { TextArea } = Input;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const { xq } = getDivIcons();

class XQLYForm extends Component {
  state = {
    open: false,
    districts: [],
    entity: { BZTIME: moment() },
    showLocateMap: false,
    showLoading: false,
    showCheckIcon: 'empty',
    roadDatas: [],
    selectedRoads: [],
    reload: false,
    approveState: null,
    result: null,
    suggestion: null,
    districtLoading: false,
    fetching: false,
    nameCheckMessage: null,
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
    this.setState({ districtLoading: true });
    let rt = await Post(url_GetDistrictTree);
    rtHandle(rt, d => {
      let districts = getDistricts(d);
      this.setState({ districts: districts, districtLoading: false });
    });
    this.setState({ districtLoading: false });
  }
  async getFormData(id) {
    if (!id) {
      id = this.props.id;
    }
    // id = 'd2dcfa99-0d1c-4149-ab90-befd797d2af8';
    // 获取小区楼宇的申请数据
    if (id) {
      this.showLoading();
      let rt = await Post(url_SearchHouseByID, { id: id });
      rtHandle(rt, d => {
        let data = d.Data;
        let dIDs = data.DistrictIDs;
        data.Districts = dIDs.split('.');
        data.BZTIME = data.BZTIME ? moment(data.BZTIME) : null;
        data.SJSJ = data.SJSJ ? moment(data.SJSJ) : null;
        data.JCSJ = data.JCSJ ? moment(data.JCSJ) : null;
        this.setState({ reload: true }, e => {
          // debugger;
          this.setState({
            entity: data,
            approveState: d.State,
            selectedRoads: data.RoadList,
            roadDatas: data.RoadList || [],
            reload: false,
          });
        });
        this.hideLoading();
      });
    } else {
      // 获取一个新的guid
      let rt = await Post(url_GetNewGuid);
      rtHandle(rt, d => {
        let entity = {};
        entity.ID = d;
        entity.BZTIME = moment();
        this.mObj.BZTIME = moment();
        this.setState({ reload: true }, e => {
          this.setState({ reload: false, roadDatas: [], selectedRoads: [], entity: entity });
        });
      });
    }
  }
  validate(errs, bName) {
    errs = errs || [];
    let { entity, selectedRoads } = this.state;
    let roadIDs = (selectedRoads || []).map(x => x.ID);

    let ROADID = roadIDs.join(',');
    this.mObj.ROADID = ROADID;
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
    if (saveObj.SJSJ) {
      saveObj.SJSJ = saveObj.SJSJ.toISOString();
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
      //   // 功能
      //   if (!validateObj.GN) {
      //     errs.push('请填写功能');
      //   }

      // 建筑面积
      if (!validateObj.JZMJ) {
        errs.push('请填写建筑面积');
      }

      //占地面积
      if (!validateObj.ZDMJ) {
        errs.push('请填写占地面积');
      }

      //   //绿化率
      //   if (!validateObj.LHL) {
      //     errs.push('请填写绿化率');
      //   }

      //   //地址分类
      //   if (!validateObj.DZFLBM) {
      //     errs.push('请填写地址分类');
      //   }

      //   //建成时间
      //   if (!validateObj.JCSJ) {
      //     errs.push('请填写建成时间');
      //   }

      //   //始建时间
      //   if (!validateObj.SJSJ) {
      //     errs.push('请填写始建时间');
      //   }

      //   //宣传名
      //   if (!validateObj.XCMC) {
      //     errs.push('请填写宣传名');
      //   }

      //   //登记名
      //   if (!validateObj.DJMC) {
      //     errs.push('请填写登记名');
      //   }

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

      //所属道路
      if (validateObj.ROADID === '') {
        errs.push('请选择所属道路');
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
      // Modal.error({
      //   title: '错误',
      //   okText: '知道了',
      //   content: errs.map((e, i) => (
      //     <div>
      //       {i + 1}、{e}；
      //     </div>
      //   )),
      // });
      // nameCheckMessage = errs.map((e, i) => (
      //   <div>
      //     {i + 1}、{e}；
      //   </div>
      // ));
      // this.setState({ showCheckIcon: 'no' });
    } else {
      let { ID, DISTRICTID, NAME } = validateObj;
      await Post(
        url_CheckHouseName,
        {
          ID,
          DISTRICTID,
          NAME,
        },
        e => {
          if (e.length == 0) {
            // notification.success({ description: '“命名”有效、可用！', message: '成功' });
            // this.setState({ showCheckIcon: 'yes' });
            this.setState({
              nameCheckMessage: '“命名”有效、可用！',
              showCheckIcon: 'yes',
            });
          } else {
            // notification.error({
            //   description: e.map(t => <span>{t}</span>),
            //   message: '失败',
            // });
            // this.setState({ showCheckIcon: 'no' });
            this.setState({
              nameCheckMessage: e.map(t => <span>{t}</span>),
              showCheckIcon: 'no',
            });
          }
        }
      );
    }
  }

  async searchRoads(name) {
    name = name.trim();
    let rt = await Post(url_SearchRoadNames, { name });
    rtHandle(rt, d => {
      this.setState({ roadDatas: d, open: true });
    });
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
          Modal.confirm({
            title: '提醒',
            content: '提交后不能再次修改，是否确认提交？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              this.props.isApproval ? this.approve(saveObj) : this.save(saveObj);
            },
            onCancel() {},
          });
        }
      }.bind(this)
    );
  };

  async approve(obj) {
    let { result, suggestion } = this.state;
    await Post(url_HouseApprove, { mObj: JSON.stringify(obj), result, suggestion }, e => {
      notification.success({ description: '审批成功！', message: '成功' });
      this.mObj = {};
      this.setState({ showCheckIcon: 'empty' });
      if (this.props.onSaveSuccess) {
        this.props.onSaveSuccess();
      }
    });
  }

  async save(obj) {
    await Post(url_HouseAndBuildingApplicant, { mObj: JSON.stringify(obj) }, e => {
      notification.success({ description: '提交成功！', message: '成功' });
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
    this.getFormData();
    this.mObj = {};
  }

  // componentDidUpdate() {
  //   if (this.select) {
  //     $(this.select)
  //       .find('input')
  //       .unbind('keydown')
  //       .on('keydown', e => {
  //         if (event.keyCode == 13) {
  //           this.searchRoads(e.target.value);
  //         }
  //       });
  //   }
  // }

  componentDidMount() {
    this.getDistricts();
    this.getFormData();
  }
  render() {
    let {
      open,
      districts,
      entity,
      showLocateMap,
      showLoading,
      showCheckIcon,
      roadDatas,
      selectedRoads,
      reload,
      approveState,
      result,
      suggestion,
      districtLoading,
      fetching,
      nameCheckMessage,
    } = this.state;

    let shapeOptions = {
      stroke: true,
      color: 'red',
      weight: 4,
      opacity: 1,
      fill: true,
      fillColor: 'red',
      fillOpacity: 0.2,
      clickable: true,
    };
    console.log(entity);
    return (
      <div
        className={st.XQLYForm}
        ref={e => (this.root = e)}
        onClick={e => {
          this.setState({ open: false });
        }}
      >
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
                                <span className={st.ired}>*</span>所在行政区
                              </span>
                            }
                          >
                            <Spin
                              wrapperClassName="ct-inline-loading-100"
                              spinning={districtLoading}
                            >
                              <Cascader
                                style={{ width: '100%' }}
                                changeOnSelect
                                defaultValue={entity.Districts ? entity.Districts : undefined}
                                expandTrigger="hover"
                                options={districts}
                                placeholder="所在行政区"
                                onChange={(a, b) => {
                                  this.mObj.districts = a;
                                  this.setState({ showCheckIcon: 'empty', nameCheckMessage: null });
                                  this.checkName();
                                }}
                                disabled={approveState === 'notFirst' ? true : false}
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
                              defaultValue={entity.NAME ? entity.NAME : undefined}
                              onChange={e => {
                                this.mObj.NAME = e.target.value;
                                this.setState({ showCheckIcon: 'empty', nameCheckMessage: null });
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
                            {/* <Button
                              onClick={this.checkName.bind(this)}
                              style={{ marginLeft: '20px', display: 'flex' }}
                              type="primary"
                            >
                              命名检查
                            </Button> */}
                            <div style={{ color: showCheckIcon === 'no' ? 'red' : 'green' }}>
                              {nameCheckMessage}
                            </div>
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="宣传名称"
                          >
                            <Input
                              defaultValue={entity.XCMC ? entity.XCMC : undefined}
                              onChange={e => {
                                this.mObj.XCMC = e.target.value;
                              }}
                              placeholder="宣传名称"
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="登记名称"
                          >
                            <Input
                              defaultValue={entity.DJMC ? entity.DJMC : undefined}
                              onChange={e => {
                                this.mObj.DJMC = e.target.value;
                              }}
                              placeholder="登记名称"
                              disabled={approveState === 'notFirst' ? true : false}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="功能">
                            <Input
                              defaultValue={entity.GN ? entity.GN : undefined}
                              onChange={e => {
                                this.mObj.GN = e.target.value;
                              }}
                              placeholder="功能"
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
                            label={
                              <span>
                                <span className={st.ired}>*</span>建筑面积
                              </span>
                            }
                          >
                            <InputNumber
                              defaultValue={entity.JZMJ ? entity.JZMJ : undefined}
                              style={{ width: '100%' }}
                              onChange={e => {
                                this.mObj.JZMJ = e;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                              placeholder="建筑面积（平方千米）"
                            />
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
                            <InputNumber
                              defaultValue={entity.ZDMJ ? entity.ZDMJ : undefined}
                              style={{ width: '100%' }}
                              onChange={e => {
                                this.mObj.ZDMJ = e;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                              placeholder="占地面积（平方米）"
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="地址分类"
                          >
                            <Input
                              defaultValue={entity.DZFLBM ? entity.DZFLBM : undefined}
                              style={{ width: '100%' }}
                              onChange={e => {
                                this.mObj.DZFLBM = e.target.value;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                              placeholder="地址分类"
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="小区类型"
                          >
                            <Select
                              defaultValue={
                                [entity.XQLX, entity.DZBM] ? [entity.XQLX, entity.DZBM] : undefined
                              }
                              allowClear
                              onChange={e => {
                                this.mObj.XQLX = e[0];
                                this.mObj.DZBM = e[1];
                                this.mObj.DZFLBM = e[1];
                              }}
                              placeholder="小区类型"
                              disabled={approveState === 'notFirst' ? true : false}
                            >
                              <Select.Option key="31" value={['小区', '31']}>
                                小区
                              </Select.Option>
                              <Select.Option key="32" value={['大厦院落', '32']}>
                                大厦院落
                              </Select.Option>
                              <Select.Option key="33" value={['单位院落', '33']}>
                                单位院落
                              </Select.Option>
                              <Select.Option key="34" value={['工矿企业', '34']}>
                                工矿企业
                              </Select.Option>
                              <Select.Option key="35" value={['文体娱乐', '35']}>
                                文体娱乐
                              </Select.Option>
                              <Select.Option key="36" value={['宗教场所', '36']}>
                                宗教场所
                              </Select.Option>
                              <Select.Option key="37" value={['其它', '37']}>
                                其它
                              </Select.Option>
                            </Select>
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="绿化率">
                            <InputNumber
                              defaultValue={entity.LHL ? entity.LHL : undefined}
                              style={{ width: '100%' }}
                              onChange={e => {
                                this.mObj.LHL = e;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                              placeholder="绿化率"
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            label="始建时间"
                          >
                            <DatePicker
                              defaultValue={entity.SJSJ ? entity.SJSJ : undefined}
                              style={{ width: '100%' }}
                              onChange={e => {
                                this.mObj.SJSJ = e;
                              }}
                              disabled={approveState === 'notFirst' ? true : false}
                              placeholder="始建时间"
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
                              placeholder="建成时间"
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
                              placeholder="命名时间"
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <FormItem
                          labelCol={{ span: 3 }}
                          wrapperCol={{ span: 21 }}
                          label="名称来历及含义"
                        >
                          <TextArea
                            defaultValue={entity.MCHY ? entity.MCHY : undefined}
                            onChange={e => {
                              this.mObj.MCHY = e.target.value;
                            }}
                            placeholder="名称来历及含义"
                            autosize={{ minRows: 2 }}
                            disabled={approveState === 'notFirst' ? true : false}
                          />
                        </FormItem>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 19 }}
                            label={
                              <span>
                                <span className={st.ired}>*</span>所属道路
                              </span>
                            }
                          >
                            <div className={st.selectroads}>
                              {selectedRoads && selectedRoads.length ? (
                                <div className={st.selectedroads}>
                                  {(selectedRoads || []).map(x => {
                                    return (
                                      <span>
                                        {x.NAME}
                                        &emsp;
                                        <Icon
                                          type="close"
                                          onClick={e => {
                                            let { selectedRoads } = this.state;
                                            selectedRoads = (selectedRoads || []).filter(
                                              t => t.ID !== x.ID
                                            );
                                            this.setState({ selectedRoads: selectedRoads });
                                          }}
                                        />
                                      </span>
                                    );
                                  })}
                                </div>
                              ) : null}
                              <div
                                className={st.roadssearch}
                                onClick={e => {
                                  e.stopPropagation();
                                  e.nativeEvent.stopImmediatePropagation();
                                }}
                              >
                                <Input
                                  placeholder="请查询并选择道路..."
                                  onFocus={e => {
                                    this.setState({ open: true });
                                  }}
                                  onChange={e => {
                                    let v = e.target.value;
                                    if (v) this.searchRoads(v);
                                  }}
                                />
                                {open ? (
                                  <div className={st.roads}>
                                    {roadDatas && roadDatas.length ? (
                                      roadDatas.map(r => {
                                        return (
                                          <div>
                                            {r.NAME}
                                            <Icon
                                              type="plus"
                                              onClick={e => {
                                                let { selectedRoads } = this.state;
                                                let idx = (selectedRoads || []).findIndex(
                                                  i => i.ID === r.ID
                                                );
                                                if (idx === -1) selectedRoads.push(r);
                                                this.setState({ selectedRoads: selectedRoads });
                                              }}
                                            />
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className={st.noneresult}>未找到相关道路</div>
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            {/* <div style={{ width: '100%' }} ref={e => (this.select = e)}>
                              <Select
                                open={open}
                                ref={e => (this.selectO = e)}
                                dropdownClassName={'road'}
                                mode="multiple"
                                labelInValue={false}
                                value={selectedRoads}
                                placeholder="请选择道路..."
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                filterOption={false}
                                // onSearch={this.searchRoads.bind(this)}
                                onChange={value => {
                                  let { selectedRoads } = this.state;
                                  this.setState({
                                    selectedRoads: value,
                                    fetching: false,
                                    open: false,
                                  });
                                }}
                                disabled={approveState === 'notFirst' ? true : false}
                              >
                                {(roadDatas || [])
                                  .filter(o => !selectedRoads.includes(o))
                                  .map(d => (
                                    <Select.Option key={d.ID}>
                                      {
                                        <div className={st.road}>
                                          <div className={st.roadName}>{d.NAME}</div>
                                          <div className={st.distName}>
                                            {d.DistrictName}
                                          </div>
                                        </div>
                                      }
                                    </Select.Option>
                                  ))}
                              </Select>
                            </div> */}
                          </FormItem>
                        </Col>
                        <Col span={10}>
                          <FormItem
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            label={'空间定位'}
                          >
                            <Input
                              value={entity.X && entity.Y ? `${entity.Y},${entity.X}` : undefined}
                              style={{ width: '100%' }}
                              disabled={true}
                              placeholder="空间定位"
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
                                  value={'不同意。' + entity.ROLLBACKSSUGGESTION}
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
                              label={
                                <span>
                                  <span className={st.ired}>*</span>审批结果
                                </span>
                              }
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
                              label={
                                <span>
                                  <span className={st.ired}>*</span>审批意见
                                </span>
                              }
                            >
                              <TextArea
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
                提交
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
              // let { GEOM_WKT } = this.state.entity;
              // if (GEOM_WKT) {
              //   let geometry = Terraformer.WKT.parse(GEOM_WKT);
              //   lm.mpLayer = L.geoJSON(geometry, {
              //     style: function(feature) {
              //       return shapeOptions;
              //     },
              //   }).addTo(lm.map);
              //   let coordinates = geometry.coordinates[0].map(e => {
              //     return e.reverse();
              //   });
              //   lm.map.fitBounds(coordinates);
              let { Y, X } = this.state.entity;
              if (Y && X) {
                lm.mpLayer = L.marker([Y, X], { icon: xq }).addTo(lm.map);
                lm.map.setView([Y, X], 16);
              }
            }}
            onMapClear={lm => {
              lm.mpLayer && lm.mpLayer.remove();
              lm.mpLayer = null;
              let { entity } = this.state;
              entity.X = null;
              entity.Y = null;
              entity.GEOM_WKT = null;
              this.mObj.X = entity.X;
              this.mObj.Y = entity.Y;
              this.mObj.GEOM_WKT = entity.GEOM_WKT;
            }}
            beforeBtns={[
              {
                id: 'locate',
                name: '小区、楼宇定位',
                icon: 'icon-dingwei',
                onClick: (dom, i, lm) => {
                  if (!lm.locatePen) {
                    // lm.locatePen = new L.Draw.Polygon(lm.map, {
                    //   shapeOptions: shapeOptions,
                    //   icon: new L.DivIcon({
                    //     iconSize: new L.Point(8, 8),
                    //     className: 'leaflet-div-icon leaflet-editing-icon',
                    //   }),
                    //   touchIcon: new L.DivIcon({
                    //     iconSize: new L.Point(10, 10),
                    //     className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon',
                    //   }),
                    // });
                    lm.locatePen = new L.Draw.Marker(lm.map, { icon: xq });
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
                  let { lat, lng } = lm.mpLayer.getLatLng();
                  let { entity } = this.state;

                  entity.X = lng.toFixed(8) - 0;
                  entity.Y = lat.toFixed(8) - 0;
                  entity.GEOM_WKT = Terraformer.WKT.convert(geometry);

                  this.mObj.X = entity.X;
                  this.mObj.Y = entity.Y;
                  this.mObj.GEOM_WKT = entity.GEOM_WKT;

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
XQLYForm = Form.create()(XQLYForm);
export default XQLYForm;
