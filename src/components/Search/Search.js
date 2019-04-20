import { Component } from 'react';
import st from './Search.less';
import { Table, Pagination, Button, Input, Select, Cascader } from 'antd';

let Search = (p, s, e) => {};

class Search extends Component {
  state = {
    pageSize: 20,
    pageNum: 1,
    total: 0,
    rows: [],
    resetCondition: false,
    tableLoading: false,
  };

  columns = [
    { title: '序号', dataIndex: 'index', key: 'index' },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (v, r) => {
        return (
          <div className={st.rowbtns}>
            <Icon type="edit" />
            <Popconfirm title={`确定删除该数据？`} onConfirm={e => this.delete(r)}>
              <Icon type="delete" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  queryCondition = {};

  condition = {};

  resetCondition() {
    this.setState({ resetCondition: true });
    this.condition = {};
    this.queryCondition = {};
  }

  search(condition) {
    let { pageSize, pageNum } = this.state;
    let newCondition = {
      ...(condition || this.condition),
      pageSize,
      pageNum,
    };

    this.setState({ tableLoading: true });
    Search(
      newCondition,
      d => {
        let { Total, Data } = d;
        let { pageNum, pageSize } = this.state;
        Data.map((r, i) => (r.index = (pageNum - 1) * pageSize + 1));
        this.setState({
          tableLoading: false,
          total: Total,
          rows: Data,
        });
        this.queryCondition = newCondition;
      },
      e => {
        alert(ex.message);
        this.setState({ tableLoading: false });
      }
    );
  }

  render() {
    let { pageNum, pageSize, total, resetCondition, tableLoading, rows } = this.state;

    return (
      <div className={st.sc}>
        {resetCondition ? null : (
          <div className={st.schd}>
            <Button type="primary" icon="search">
              查询
            </Button>
            <Button type="default" icon="sync" onClick={this.resetCondition.bind(this)}>
              清空
            </Button>
          </div>
        )}
        <div className={st.scbd}>
          <Table bordered loading={tableLoading} dataSource={rows} columns={columns} />
        </div>
        <div className={st.scft}>
          <Pagination
            showSizeChanger
            showTotal={(t, r) => {
              let { pageSize, pageNum, rows } = this.state;
              return t > 0
                ? `当前：${(pageNum - 1) * pageSize + 1}-${(pageNum - 1) * pageSize +
                    rows.length}，共${t}条`
                : null;
            }}
            total={total}
            current={pageNum}
            pageSize={pageSize}
            pageSizeOptions={[20, 50, 100, 200]}
            onShowSizeChange={(pn, ps) => {
              this.setState({ pageNum: 1, pageSize: ps }, e => this.search(this.queryCondition));
            }}
            onChange={(pn, ps) => {
              this.setState({ pageNum: pn, pageSize: ps }, e => this.search(this.queryCondition));
            }}
          />
        </div>
      </div>
    );
  }
}

export default Search;
