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
import {
  url_SearchHousesBZToProve
} from '../../../common/urls.js';
import { Post } from '../../../utils/request.js';
import { rtHandle } from '../../../utils/errorHandle.js';
import SPQueryForm from '../../../common/Components/Forms/SPQueryForm'; //查询表
import MPHForm from '../../../common/Components/Forms/MPHForm';
class MPH extends Component {
  constructor(ps) {
    super(ps);

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
        dataIndex: 'DistrictName',
        key: 'DistrictName',
      }, {
        title: '道路',
        dataIndex: 'RoadName',
        key: 'RoadName',
      }, {
        title: '长度',
        dataIndex: 'LENGTH',
        key: 'LENGTH',
      }, {
        title: '宽度',
        dataIndex: 'WIDTH',
        key: 'WIDTH',
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
      MPHData: [],
    };

    //pagination参数
    this.MPHPg = {
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
  searchMPH = (districtID, approvalState, start, end) => {
    this.setState({ districtID: districtID, approvalState: approvalState, start: start, end: end });
    this.getMPHTableData(districtID, approvalState, start, end);
  }
  // 获取道路桥梁查询内容-接口url_SearchHousesBZToProve(pageNum, pageSize, districtID, approvalState, start, end)
  async getMPHTableData(districtID, approvalState, start, end) {
    this.showLoading();
    var pageNum = this.MPHPg.current;
    var pageSize = this.MPHPg.pageSize;
    let rt = await Post(url_SearchHousesBZToProve, { pageNum, pageSize, districtID, approvalState, start, end });
    rtHandle(rt, d => {
      debugger
      this.MPHPg.total = d.Count;
      this.setState({ MPHData: d.Data });
    });
    this.hideLoading();
  }
  //切换页码
  handleTableChange = (pagination, filters, sorter) => {
    this.MPHPg = pagination;
    this.getMPHTableData(this.state.districtID, this.state.approvalState, this.state.start, this.state.end);
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
          <div className={st.ct_form}>
            <SPQueryForm name={"MPH"} searchMPH={this.searchMPH} />
          </div>
          <div className={st.ct_form}>
            <Table
              rowKey={record => record.ID}
              className={st.ct_table}
              columns={this.state.MPHCol}
              dataSource={this.state.MPHData}
              pagination={this.MPHPg}
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
                <MPHForm isApproval={true}/>
              </Modal>
            ) : null
        }
      </div>
    );
  }
}

export default MPH;
