import { Component } from 'react';
import st from './MPBZ.less';
import { Table, Pagination, Modal } from 'antd';
import { warn } from '../../../utils/notification';
import Search from '../Search';
import { searchHousesBZToLocate } from '../../../services/MPBZ';
import LocateMap from '../../../common/Components/Maps/LocateMap2'

let baseColumns = [
  {
    title: '行政区划',
    dataIndex: 'DistrictName',
    key: 'DistrictName',
    width: 400,
  },
  {
    title: '小区名称',
    dataIndex: 'HouseName',
    key: 'HouseName',
  },
  {
    title: '道路名称',
    dataIndex: 'ROADNAME',
    key: 'ROADNAME',
  },
  {
    title: '门牌号',
    dataIndex: 'MPNUM',
    key: 'MPNUM',
  },
  {
    title: '经度',
    dataIndex: 'X',
    key: 'X',
  },
  {
    title: '维度',
    dataIndex: 'Y',
    key: 'Y',
  },
];

class MPBZ extends Component {
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
        title: '编制时间',
        dataIndex: 'BZTIME',
        key: 'BZTIME',
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record) => (
          <span>
            <a onClick={e => this.showMap(record)}>查看</a>
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
            <a onClick={e => this.showMap(record, true)}>编制</a>
          </span>
        ),
      },
    ]);
  }

  state = {
    showMap: false,
    pageSize: 20,
    pageNum: 1,
    total: 0,
    rows: [],
    approvalState: 0,
  };

  condition = {};

  showMap(row, isNew = false) {
    this.row = {
      ...row,
      isNew
    };
    this.setState({ showMap: true });
  }

  closeMap() {
    this.row = null;
    this.setState({ showMap: false });
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
    await searchHousesBZToLocate(
      {
        ...nCdn,
        locateState: nCdn.approvalState,
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
    let { pageSize, pageNum, total, rows, approvalState, loading, showMap } = this.state;
    return (
      <div className={st.MPBZ}>
        <div className={st.search}>
          <Search
            extension="编制"
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
          title="门牌编制"
          wrapClassName="ct-fullmodal2 ct-map"
          visible={showMap && this.row}
          destroyOnClose
          onCancel={this.closeMap.bind(this)}
          footer={null}
        >
          <LocateMap />
        </Modal>
      </div>
    );
  }
}

export default MPBZ;
