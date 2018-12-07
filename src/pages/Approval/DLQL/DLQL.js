import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import st from './DLQL.less';
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
import {
  url_SearchRoads
} from '../../../common/urls.js';
import { Post } from '../../../utils/request.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import { getUserDistricts } from '../../../utils/utils.js';
class DLQL extends Component {
  constructor(ps) {
    super(ps);
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
        dataIndex: 'DistrictName',
        key: 'DistrictName',
        width: 300,
      }, {
        title: '名称',
        dataIndex: 'NAME',
        key: 'NAME',
      }, {
        title: '性质',
        dataIndex: 'PLANNAME',
        key: 'PLANNAME',
      }, {
        title: '长度',
        dataIndex: 'LENGTH',
        key: 'LENGTH',
      }, {
        title: '宽度',
        dataIndex: 'WIDTH',
        key: 'WIDTH',
      },{
        title: '审批时间',
        dataIndex: 'ApprovalTime',
        key: 'ApprovalTime',
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
      qlData: [],
    };

    //pagination参数
    this.qlPg= {
      current: 1, //当前页码
      pageSize: 10, //每页几条
      size: 'small',
      showQuickJumper: true,
      showSizeChanger: true
    };
  }
  showLoading() {
    this.setState({ showLoading: true });
  }
  hideLoading() {
      this.setState({ showLoading: false });
  }
  //获取子组件DLQLQueryForm的查询条件
  searchDLQL = (districtID, approvalState, start, end) => {
    this.setState({districtID: districtID, approvalState: approvalState, start: start, end: end});
    this.getDLQLTableData(districtID, approvalState, start, end);
  }
  // 获取道路桥梁查询内容-接口url_SearchRoads(pageNum, pageSize, districtID, approvalState, start, end)
  async getDLQLTableData(districtID, approvalState, start, end) {
    this.showLoading();
    var pageNum = this.qlPg.current;
    var pageSize = this.qlPg.pageSize;
    let rt = await Post(url_SearchRoads,{pageNum, pageSize, districtID, approvalState, start, end});
    rtHandle(rt, d => {
      this.qlPg.total = d.Count;
      debugger
      this.setState({ qlData: d.Data });
    });
    this.hideLoading();
  }
  //切换页码
  handleTableChange = (pagination, filters, sorter) => {
    this.qlPg = pagination;
    this.getDLQLTableData(this.state.districtID, this.state.approvalState, this.state.start, this.state.end);
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
          <div className={st.ct_form}>
            <DLQLQueryForm name={"DLQL"} searchDLQL={this.searchDLQL} />
          </div>
          <div className={st.ct_form}>
            <Table
              rowKey={record => record.ID}
              className={st.ct_table}
              columns={this.state.qlCol}
              dataSource={this.state.qlData}
              pagination={this.qlPg}
              onChange={this.handleTableChange}
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

export default DLQL;
