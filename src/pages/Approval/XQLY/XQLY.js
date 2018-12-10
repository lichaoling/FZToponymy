import { Component } from 'react';
import st from './XQLY.less';
import { Table, Pagination, Modal, Popover } from 'antd';
import { warn } from '../../../utils/notification';
import Search from '../Search';
import { searchHouses, searchWorkFlowLines } from '../../../services/XQLY';
import XQLYForm from '../../../common/Components/Forms/XQLYForm';
import FlowViewer from '../FlowViewer';

let baseColumns = [
  {
    title: '行政区划',
    dataIndex: 'DistrictName',
    key: 'DistrictName',
    width: 400,
  },
  {
    title: '名称',
    dataIndex: 'NAME',
    key: 'NAME',
  },
  {
    title: '所属道路',
    dataIndex: 'RoadNames',
    key: 'RoadNames',
  },
  {
    title: '建筑面积（平方千米）',
    dataIndex: 'JZMJ',
    key: 'JZMJ',
  },
];

class XQLY extends Component {
  constructor(ps) {
    super(ps);
    let nColumns = [
      {
        title: '序号',
        dataIndex: 'XH',
        key: 'XH',
        width: 80,
        render: (text, record, index) => {
          let { pageSize, pageNum } = this.state;
          return (pageNum - 1) * pageSize + index + 1;
        },
      },
    ].concat(baseColumns);
    this.columns1 = nColumns.concat([
      {
        title: '审批时间',
        dataIndex: 'OPERATETIME',
        key: 'OPERATETIME',
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record) => (
          <span>
            <Popover
              placement="left"
              trigger="click"
              content={
                <FlowViewer key={record.ID} id={record.ID} getWorkflow={searchWorkFlowLines} />
              }
            >
              <a>流程</a>
            </Popover>
            &ensp;
            <a onClick={e => this.approve(record)}>查看</a>
          </span>
        ),
      },
    ]);
    this.columns0 = nColumns.concat([
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record) => (
          <span>
            <Popover
              placement="left"
              trigger="click"
              content={
                <FlowViewer key={record.ID} id={record.ID} getWorkflow={searchWorkFlowLines} />
              }
            >
              <a>流程</a>
            </Popover>
            &ensp;
            <a onClick={e => this.view(record)}>审批</a>
          </span>
        ),
      },
    ]);
  }

  state = {
    showForm: false,
    pageSize: 20,
    pageNum: 1,
    total: 0,
    rows: [],
    approvalState: 0,
  };

  condition = {};

  showForm(id) {
    this.rowid = id;
    this.setState({ showForm: true });
  }

  closeForm() {
    this.rowid = null;
    this.setState({ showForm: false });
  }

  approve(row) {
    this.showForm(row.ID);
  }

  view(row) {
    this.showForm(row.ID);
  }

  refreshTab() {
    this.closeForm();
    this.search(this.condition);
  }

  search(cdn) {
    if (!cdn.districtID || cdn.districtID.length <= 1) {
      warn('请选择区级以下行政区');
    } else {
      let { pageSize, pageNum } = this.state;
      let nCdn = {
        ...cdn,
        pageSize: pageSize,
        pageNum: pageNum,
      };
      this._search(nCdn);
    }
  }

  async _search(nCdn) {
    this.setState({ loading: true });
    await searchHouses(
      {
        ...nCdn,
        districtID: nCdn.districtID[nCdn.districtID.length - 1],
      },
      d => {
        let { Data, Count } = d;
        this.setState({
          approvalState: nCdn.approvalState,
          rows: Data,
          total: Count,
          loading: false,
        });
        this.condition = nCdn;
      }
    );
    this.setState({ loading: false });
  }

  render() {
    let { pageSize, pageNum, total, rows, approvalState, loading, showForm } = this.state;
    return (
      <div className={st.XQLY}>
        <div className={st.search}>
          <Search
            approvalState={approvalState}
            onClear={e => {
              this.condition = e;
            }}
            onSearch={e => {
              this.setState({ pageNum: 1 }, x => {
                this.search(e);
              });
            }}
          />
        </div>
        <div className={st.table}>
          <Table
            loading={loading}
            pagination={false}
            bordered
            columns={approvalState == 0 ? this.columns0 : this.columns1}
            dataSource={rows}
          />
        </div>
        <div className={st.footer}>
          <Pagination
            showTotal={e =>
              `共：${total}，当前：${(pageNum - 1) * pageSize + 1}-${(pageNum - 1) * pageSize +
                rows.length}`
            }
            total={total}
            current={pageNum}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            onShowSizeChange={(pn, ps) => {
              this.setState({ pageSize: ps, pageNum: 1 }, e => {
                this.search(this.condition);
              });
            }}
            onChange={e => {
              this.setState({ pageNum: e }, e => {
                this.search(this.condition);
              });
            }}
            showSizeChanger
          />
        </div>
        <Modal
          wrapClassName="ct-fullmodal"
          visible={showForm && this.rowid}
          destroyOnClose
          onCancel={this.closeForm.bind(this)}
          footer={null}
        >
          <XQLYForm
            isApproval={true}
            title="住宅小区、楼宇名称命名（更名）审批表"
            id={this.rowid}
            onSaveSuccess={this.refreshTab.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}

export default XQLY;
