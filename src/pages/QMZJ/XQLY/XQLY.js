import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import st from './XQLY.less';
import {
  Modal,
  Row,
  Col,
  Button,
  Icon,
  Table,
} from 'antd';

import DLQLQueryForm from '../../../common/Components/Forms/DLQLQueryForm';
import XQLYForm from '../../../common/Components/Forms/XQLYForm';
class XQLY extends Component {
  constructor(ps) {
    super(ps);
    this.xqlyPg = {
      pageSize: 10,
      size: 'small',
      showQuickJumper: true,
      showSizeChanger: true
    };
    this.state = {
      showModal: false,
      xqlyCol: [{
        title: '序号',
        dataIndex: 'XH',
        key: 'XH',
        render: (text, record, index) => (
          index + 1
        ),
      }, {
        title: '行政区划',
        dataIndex: 'XZQH',
        key: 'XZQH',
      }, {
        title: '名称',
        dataIndex: 'BZMC',
        key: 'BZMC',
      }, {
        title: '所属道路',
        dataIndex: 'SSDL',
        key: 'SSDL',
      }, {
        title: '建筑面积',
        dataIndex: 'JZMJ',
        key: 'JZMJ',
      }, {
        title: '审批时间',
        dataIndex: 'SPSJ',
        key: 'SPSJ',
      }, {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record) => (
          <span>
            <a onClick={() => this.setState({ showModal: true })} >审批</a>
          </span>

        ),
      }
      ],
      xqlyData: [{
        key: 1,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 2,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 3,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 4,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 5,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 6,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 7,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 8,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 9,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 10,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 11,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }, {
        key: 12,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        SSDL: '一级',
        SPSJ: '2018-12-01 05:00',
        JZMJ: '50米',
      }],
    };
  }
  handleOk = (e) => {
    this.setState({
      showModal: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      showModal: false,
    });
  }
  render() {
    return (
      <div className={st.XQLY}>
        <div className={st.content} >
          {/* <div className={st.ct_header}>
            <div className={st.ct_title}>小区楼宇审批</div>
          </div> */}
          <div className={st.ct_form}>
            <DLQLQueryForm />
          </div>
          <div className={st.ct_form}>
            <Table
              className={st.ct_table}
              columns={this.state.xqlyCol}
              dataSource={this.state.xqlyData}
              pagination={this.xqlyPg}
              size="small"
              bordered>
            </Table>
          </div>
        </div>
        {
          this.state.showModal ?
            (
              <Modal
                title="审批"
                visible={true}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                className={st.ct_modalCon}
                width={"80%"}
              >
                <XQLYForm />
              </Modal>
            ) : null
        }
      </div>
    );
  }
}

export default XQLY;
