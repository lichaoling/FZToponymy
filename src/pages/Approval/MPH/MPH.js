import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import st from './MPH.less';
import {
  Modal,
  Row,
  Col,
  Button,
  Icon,
  Table,
} from 'antd';

import SPQueryForm from '../../../common/Components/Forms/SPQueryForm';
import MPHForm from '../../../common/Components/Forms/MPHForm';
class MPH extends Component {
  constructor(ps) {
    super(ps);
    this.MPHPg = {
      pageSize: 10,
      size: 'small',
      showQuickJumper: true,
      showSizeChanger: true
    };
    this.state = {
      showModal: false,
      MPHCol: [{
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
        title: '街道',
        dataIndex: 'JD',
        key: 'JD',
      }, {
        title: '道路',
        dataIndex: 'DL',
        key: 'DL',
      }, {
        title: '长度',
        dataIndex: 'CD',
        key: 'CD',
      }, {
        title: '宽度',
        dataIndex: 'KD',
        key: 'KD',
      },{
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
      MPHData: [{
        key: 1,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
        
      }, {
        key: 2,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 3,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 4,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 5,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 6,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 7,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 8,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 9,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 10,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 11,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
      }, {
        key: 12,
        XH: '01',
        XZQH: '鼓楼区',
        JD: '解放大桥',
        DL: '一级',
        CD: '100米',
        KD: '20米',
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
      <div className={st.MPH}>
        <div className={st.content} >
          {/* <div className={st.ct_header}>
            <div className={st.ct_title}>门牌号审批</div>
          </div> */}
          <div className={st.ct_form}>
            <SPQueryForm />
          </div>
          <div className={st.ct_form}>
            <Table
              className={st.ct_table}
              columns={this.state.MPHCol}
              dataSource={this.state.MPHData}
              pagination={this.MPHPg}
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
                <MPHForm isApproval={true}/>
              </Modal>
            ) : null
        }
      </div>
    );
  }
}

export default MPH;
