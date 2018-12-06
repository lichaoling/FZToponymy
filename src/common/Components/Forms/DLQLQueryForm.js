import { Component } from 'react';
import {
    Form, Select, InputNumber, Switch, Radio,
    Slider, Button, Upload, Icon, DatePicker,
    TreeSelect, Cascader, Row, Input, notification,
    Spin,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
import {
    // baseUrl,
    url_GetDistrictTreeByUID,
    // url_CheckRoadName,
    // url_SearchRoadByID,
    // url_RoadAndBridgeApplicant,
  } from '../../../common/urls.js';
import { Post } from '../../../utils/request.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import st from './DLQLQueryForm.less';
import { getUserDistricts } from '../../../utils/utils.js';
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

    XianSelectChange(e) {
        $.post(
            _URL_.SA + "GetListByParentId",
            { id: e },
            function (e) {
                this.setState({ zjd: e });
            }.bind(this)).
            error(function () {
                notification['warning']({
                    message: '提示',
                    description: '网络故障，请稍后再试',
                });
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['xian'] = values['xian'] == undefined ? "" : values['xian'];
                values['zjd'] = values['zjd'] == undefined ? "" : values['zjd'];
                if (this.props.url == "GetOverTimeProjects") {
                    $.post(
                        _URL_.PM + "GetOverTimeProjects",
                        {
                            pageindex: 1,
                            listnum: 1000,
                            xian: values['xian'],
                            zhen: values['zjd'],
                        },
                        function (e) {
                            this.props.getQueryData(e);
                        }.bind(this))
                        .error(function () {
                            notification['warning']({
                                message: '提示',
                                description: '网络故障，请稍后再试',
                            });
                        });
                }
                if (this.props.url == "GetInitCatelogs") {
                    this.props.openLoad();
                    var zjd = values['xian'];
                    if (values['zjd'] != "") {
                        zjd = values['zjd'];
                    }
                    $.post(
                        _URL_.FR + "GetInitCatelogs",
                        {
                            zjd: zjd
                        },
                        function (e) {
                            this.props.getQueryData(e, zjd);
                        }.bind(this)).
                        error(function () {
                            notification['warning']({
                                message: '提示',
                                description: '网络故障，请稍后再试',
                            });
                        });
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
        var xianOptions = this.state.xian.map(xian => <Select.Option value={xian.Id}>{xian.Name}</Select.Option>);
        var zjdOptions = this.state.zjd != [] ? this.state.zjd.map(zjd => <Select.Option value={zjd.Id}>{zjd.Name}</Select.Option>) : "";
        var s = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        var areaSrc = [
            {
                value: '350102',
                label: '鼓楼区',
                children: [
                    {
                        value: '350102001',
                        label: '鼓东街道',
                    }, {
                        value: '350102002',
                        label: '鼓西街道',
                    }, {
                        value: '350102003',
                        label: '温泉街道',
                    }, {
                        value: '350102004',
                        label: '东街街道',
                    }, {
                        value: '350102005',
                        label: '南街街道',
                    }, {
                        value: '350102006',
                        label: '安泰街道',
                    }, {
                        value: '350102007',
                        label: '华大街道',
                    }, {
                        value: '350102008',
                        label: '水部街道',
                    }, {
                        value: '350102009',
                        label: '五凤街道',
                    }, {
                        value: '350102100',
                        label: '洪山镇',
                    }

                ],
            }, {
                value: '350103',
                label: '台江区',
                children: [
                    {
                        value: '350103001',
                        label: '瀛洲街道',
                    }, {
                        value: '350103002',
                        label: '后洲街道',
                    }, {
                        value: '350103003',
                        label: '义洲街道',
                    }, {
                        value: '350103004',
                        label: '新港街道',
                    }, {
                        value: '350103005',
                        label: '上海街道',
                    }, {
                        value: '350103006',
                        label: '苍霞街道',
                    }, {
                        value: '350103007',
                        label: '茶亭街道',
                    }, {
                        value: '350103008',
                        label: '洋中街道',
                    }, {
                        value: '350103009',
                        label: '鳌峰街道',
                    }, {
                        value: '3501030010',
                        label: '宁化街道',
                    }

                ],
            },];
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
                        <FormItem label={`行政区划：`} /*{...formItemLayout}*/ className={st.edit_row}>
                            {getFieldDecorator('xian', {
                                rules: [
                                    { required: false, message: '请选择' },
                                ],
                            })(
                                // <Cascader placeholder={"请选择"} options={areaSrc} />
                                <Cascader
                                    initalValue={districts ? districts : undefined}
                                    expandTrigger="hover"
                                    options={districts}
                                    placeholder="所在（跨）行政区"
                                    style={{ width: 300 }}
                                    // onChange={(a, b) => {
                                    //     districts = a;
                                    //     this.setState({ showCheckIcon: 'empty' });
                                    // }}
                                    />
                            )}
                        </FormItem>
                        <FormItem label={`审批状态：`} /*{...formItemLayout}*/ className={st.edit_row}>
                            {getFieldDecorator('spzt', {
                                rules: [
                                    { required: false, message: '请选择' },
                                ],
                            })(
                                <Select placeholder="请选择" name="xian" style={{ width: 130 }}>
                                    <Option value="1">未审批</Option>
                                    <Option value="2">已审批</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={`审批时间：`} /*{...formItemLayout}*/  >
                            {getFieldDecorator('spkssj', {
                                rules: [
                                    { required: false, message: '请输入' },
                                ],
                            })(
                                <DatePicker />
                            )}
                        </FormItem>
                        <span className={st.spanSpr}>~</span>
                        <FormItem  className={st.edit_row} >
                            {getFieldDecorator('spjssj', {
                                rules: [
                                    { required: false, message: '请输入' },
                                ],
                            })(
                                <DatePicker />
                            )}
                        </FormItem>
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