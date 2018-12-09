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
import {
  url_SearchHouses
} from '../../../common/urls.js';
import { Post } from '../../../utils/request.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import SPQueryForm from '../../../common/Components/Forms/SPQueryForm'; //查询表
import XQLYForm from '../../../common/Components/Forms/XQLYForm'; //申请表

class XQLY extends Component {

  constructor(ps) {
    super(ps);

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
        dataIndex: 'DistrictName',
        key: 'DistrictName',
        width: 300,
      }, {
        title: '名称',
        dataIndex: 'NAME',
        key: 'NAME',
      }, {
        title: '所属道路',
        dataIndex: 'RoadNames',
        key: 'RoadNames',
      }, {
        title: '建筑面积',
        dataIndex: 'JZMJ',
        key: 'JZMJ',
      }, {
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
      xqlyData: [],
    };

    //pagination参数
    this.xqlyPg = {
      current: 1, //当前页码
      pageSize: 10,
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
  //获取子组件SPQueryForm的查询条件
  searchXQLY = (districtID, approvalState, start, end) => {
    this.setState({ districtID: districtID, approvalState: approvalState, start: start, end: end });
    this.getXQLYTableData(districtID, approvalState, start, end);
  }
  // 获取道路桥梁查询内容-接口url_SearchHouses(pageNum, pageSize, districtID, approvalState, start, end)
  async getXQLYTableData(districtID, approvalState, start, end) {
    this.showLoading();
    var pageNum = this.xqlyPg.current;
    var pageSize = this.xqlyPg.pageSize;
    let rt = await Post(url_SearchHouses, { pageNum, pageSize, districtID, approvalState, start, end });
    rtHandle(rt, d => {
      debugger
      this.xqlyPg.total = d.Count;
      this.setState({ xqlyData: d.Data });
    });
    this.hideLoading();
  }
  //切换页码
  handleTableChange = (pagination, filters, sorter) => {
    this.xqlyPg = pagination;
    this.getXQLYTableData(this.state.districtID, this.state.approvalState, this.state.start, this.state.end);
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
          <div className={st.ct_form}>
            <SPQueryForm name={"XQLY"} searchXQLY={this.searchXQLY} />
          </div>
          <div className={st.ct_form}>
            <Table
              rowKey={record => record.ID}
              className={st.ct_table}
              columns={this.state.xqlyCol}
              dataSource={this.state.xqlyData}
              pagination={this.xqlyPg}
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
                  destroyOnClose
                visible={true}
                className={st.ct_modalCon}
                width={"90%"}
                footer={null}
                style={{top:10}}
                bodyStyle={{padding:0}}
              >
                <XQLYForm isApproval={true} title={"住宅小区、楼宇名称命名（更名）申报表"}/>
              </Modal>
            ) : null
        }
      </div>
    );
  }
}

export default XQLY;
