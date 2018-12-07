import { Component } from 'react';
import {
    Form, Select, Button,  Icon, DatePicker,
    Cascader, Row, Input, notification,
    Spin,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const { RangePicker } = DatePicker;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
import {
    url_GetDistrictTreeByUID,
  } from '../../../common/urls.js';
import { Post } from '../../../utils/request.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import { getUserDistricts } from '../../../utils/utils.js';
import st from './DLQLQueryForm.less';
class DLQLQueryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            loading: false,
            xian: [],
            zjd: [],
            secFormItem: "",
            districts: [],
        };
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
        let rt = await Post(url_GetDistrictTreeByUID);
        rtHandle(rt, d => {
        let districts = getUserDistricts(d);
        this.setState({ districts: districts });
        });
        this.hideLoading();
    }

    componentDidMount() {
        this.props.form.validateFields();
        this.getDistricts();
    }

 

    handleSubmit = (e) => {
        e.preventDefault();
        let cthis=this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // values['zjd'] = values['zjd'] == undefined ? "" : values['zjd'];
                switch(cthis.props.name){
                    case 'DLQL':
                        var districtID = values["xzqh"][values["xzqh"].length-1];
                        var approvalState = parseInt(values["spzt"]);
                        var start = values["spsj"][0].toISOString();
                        var end = values["spsj"][1].toISOString();
                        cthis.props.searchDLQL(districtID, approvalState, start, end);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    handleReset = () => {
        this.props.form.resetFields();
    }
    onDmlbChange(e) {
        this.setState({ secFormItem: e });
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        let { districts, showLoading, } = this.state;
        var s = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <div className={st.DLQLQueryForm}>
            <Spin
                className={showLoading ? 'active' : ''}
                spinning={showLoading}
                size="large"
                tip="数据加载中..."
                />
                <Form onSubmit={this.handleSubmit} layout="inline" style={{ fontSize: "14px" }} >
                    <Row className={st.up_row}>
                        <FormItem label={`行政区划：`} className={st.edit_row}>
                            {getFieldDecorator('xzqh', {
                                rules: [
                                    { required: false, message: '请选择' },
                                ],
                            })(
                                <Cascader
                                    name="xzqh"
                                    initalValue={districts ? districts : undefined}
                                    expandTrigger="hover"
                                    options={districts}
                                    placeholder="所在（跨）行政区"
                                    style={{ width: 300 }}
                                    changeOnSelect
                                    // onChange={(a, b) => {
                                    //     districts = a;
                                    //     this.setState({ showCheckIcon: 'empty' });
                                    // }}
                                    />
                            )}
                        </FormItem>
                        <FormItem label={`审批状态：`} className={st.edit_row}>
                            {getFieldDecorator('spzt', {
                                rules: [
                                    { required: false, message: '请选择' },
                                ],
                            })(
                                <Select placeholder="请选择" name="spzt" style={{ width: 130 }}>
                                    <Option value="0">未审批</Option>
                                    <Option value="1">已审批</Option>
                                </Select>
                            )}
                        </FormItem>
                        {/* <FormItem label={`审批时间：`}  >
                            {getFieldDecorator('spsj', {
                                rules: [
                                    { required: false, message: '请输入' },
                                ],
                            })(
                                <DateRange name="spsj" />
                            )}
                        </FormItem> */}
                        <FormItem label={`审批时间：`}  >
                            {getFieldDecorator('spsj', {
                                rules: [
                                    { required: false, message: '请输入' },
                                ],
                            })(
                                <RangePicker name="spsj" />
                            )}
                        </FormItem>
                        {/* <FormItem label={`审批时间：`}  >
                            {getFieldDecorator('spkssj', {
                                rules: [
                                    { required: false, message: '请输入' },
                                ],
                            })(
                                <DatePicker name="spkssj"  />
                            )}
                        </FormItem>
                        <span className={st.spanSpr}>~</span>
                        <FormItem  className={st.edit_row} >
                            {getFieldDecorator('spjssj', {
                                rules: [
                                    { required: false, message: '请输入' },
                                ],
                            })(
                                <DatePicker name="spjssj"  />
                            )}
                        </FormItem> */}
                        <FormItem style={{ marginLeft: 15 }}>
                            <Button type="primary" htmlType="submit" loading={this.state.loading} icon="search"></Button>
                            <Button style={{ marginLeft: 5 }} onClick={this.handleReset} icon="delete"></Button>
                        </FormItem>
                    </Row>
                </Form>
            </div>
        );
    }
}

DLQLQueryForm = Form.create()(DLQLQueryForm);
export default DLQLQueryForm;