import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import st from './MPBZ.less';
import {
  Modal,
  Row,
  Col,
  Button,
  Icon,
  Table,
} from 'antd';

import DLQLQueryForm from '../../../common/Components/Forms/DLQLQueryForm';
import DLQLForm from '../../../common/Components/Forms/DLQLForm';
class MPBZ extends Component {
  constructor(ps) {
    super(ps);
    this.qlPg = {
      pageSize: 10,
      size: 'small',
      showQuickJumper: true,
      showSizeChanger: true
    };
    this.state = {
      showModal: false,
      qlCol: [{
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
        title: '性质',
        dataIndex: 'ZX',
        key: 'ZX',
      }, {
        title: '长度',
        dataIndex: 'CD',
        key: 'CD',
      }, {
        title: '宽度',
        dataIndex: 'KD',
        key: 'KD',
      },{
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
      qlData: [{
        key: 1,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',
      }, {
        key: 2,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 3,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 4,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 5,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 6,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 7,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 8,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 9,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 10,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 11,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

      }, {
        key: 12,
        XH: '01',
        XZQH: '鼓楼区',
        BZMC: '解放大桥',
        ZX: '一级',
        CD: '100米',
        KD: '50米',
        SPSJ:'2018-12-01 11:00',

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
      <div className={st.DLQL}>
        <div className={st.content} >
          {/* <div className={st.ct_header}>
            <div className={st.ct_title}>道路审批</div>
          </div> */}
          <div className={st.ct_form}>
            <DLQLQueryForm />
          </div>
          <div className={st.ct_form}>
            <Table
              className={st.ct_table}
              columns={this.state.qlCol}
              dataSource={this.state.qlData}
              pagination={this.qlPg}
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
                <DLQLForm isApproval={true}/>
              </Modal>
            ) : null
        }
      </div>
    );
  }
}

export default MPBZ;
