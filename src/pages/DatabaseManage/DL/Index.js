import { Component } from 'react';
import st from './Index.less';
import DLForm from './DLForm';

import {
  Table,
  Button,
  Input,
  DatePicker,
  Icon,
  Cascader,
  Select,
  Spin,
  Pagination,
  Popconfirm,
  Modal,
} from 'antd';
import { getDistrictTreeByUID } from '../../../services/Common';
import { RoadSearch, RoadDisable, RoadDel } from '../../../services/DataManage';
import { getDistricts } from '../../../utils/utils';
import { warn, error, success } from '../../../utils/notification';

let condition = {
  end: moment(),
  start: moment().subtract(1, 'years'),
  state: 1,
};

class Index extends Component {
  columns = [
    { title: '序号', dataIndex: 'idx', key: 'idx' },
    { title: '行政区划', dataIndex: 'DISTRICTNAME', key: 'DISTRICTNAME' },
    { title: '名称', dataIndex: 'NAME', key: 'NAME' },
    { title: '状态', dataIndex: 'STATE', key: 'STATE' },
    { title: '长度（米）', dataIndex: 'LENGTH', key: 'LENGTH' },
    { title: '宽度（米）', dataIndex: 'WIDTH', key: 'WIDTH' },
    { title: '登记时间', dataIndex: 'BZTIME', key: 'BZTIME' },
    {
      title: '操作',
      dataIndex: 'Id',
      key: 'action',
      render: (text, record, index) => {
        return (
          <span className={st.operate}>
            <Icon type="edit" title="编辑" onClick={e => this.edit(record)} />
            &ensp;
            <Popconfirm
              title={'确定' + (record.STATE == '启用' ? '禁用' : '启用') + '该条数据？'}
              onConfirm={e => this.lock(record)}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              {record.STATE == '启用' ? (
                <Icon type="lock" title="禁用" />
              ) : (
                <Icon type="unlock" title="启用" />
              )}
            </Popconfirm>
            &ensp;
            <Popconfirm
              title="确定删除该条数据？"
              onConfirm={e => this.delete(record)}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <Icon type="delete" title="删除" />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  condition = {
    ...condition,
  };

  state = {
    districts: [],
    districtLoading: false,
    rows: [],
    total: 0,
    pageSize: 10,
    pageNum: 1,
    reload: false,
    tableLoading: false,
    reset: false,
    showEditModal: false,
    editModalData: null,
  };

  edit(i) {
    this.setState({
      showEditModal: true,
      editModalData: i,
    });
  }
  closeModal() {
    this.setState({
      showEditModal: false,
    });
  }
  save() {
    this.dlform && this.dlform.save && this.dlform.save();
  }

  lock(i) {
    let state = i.STATE == '启用' ? 2 : i.STATE == '禁用' ? 1 : -1;
    let stateMsg = i.STATE == '启用' ? '禁用' : i.STATE == '禁用' ? '启用' : '未知';
    let id = i.ID;
    RoadDisable({ id, state }, e => {
      if (e) {
        success(stateMsg + '成功！');
        this.search();
      } else {
        warn('还有门牌关联该道路，请先禁用或删除关联的门牌再进行此操作!');
      }
    });
  }

  delete(i) {
    RoadDel({ id: i.ID, state: 0 }, e => {
      if (e == null) {
        success('删除成功！');
        this.search();
      }
    });
  }

  clearCondition() {
    this.condition = {
      ...condition,
    };
    this.setState({ reset: true }, e => {
      this.setState({ reset: false });
    });
  }

  search() {
    let { pageSize, pageNum } = this.state;
    let searchCondition = {
      pageSize,
      pageNum,
    };
    let { start, end, roadName, districtID, state } = this.condition;
    if (start) searchCondition.start = start.format('YYYY-MM-DD');
    if (end) searchCondition.end = end.format('YYYY-MM-DD');
    if (roadName) searchCondition.roadName = roadName;
    if (districtID) searchCondition.districtID = districtID;
    if (state) searchCondition.state = state;

    this.setState({ tableLoading: true });
    RoadSearch(
      searchCondition,
      d => {
        let { Data, totalCount } = d;
        Data.map((i, idx) => {
          i.STATE == '1' ? (i.STATE = '启用') : (i.STATE = '禁用');
          i.idx = idx + 1;
        });
        this.setState({ rows: Data, total: totalCount, tableLoading: false });
      },
      e => {
        this.setState({ tableLoading: false });
        error(e.message);
      }
    );
  }

  async getDistricts() {
    await getDistrictTreeByUID(d => {
      let districts = getDistricts(d);
      this.setState({ districts: districts });
    });
  }

  componentDidMount() {
    this.getDistricts();
  }

  render() {
    let {
      districts,
      districtLoading,
      rows,
      total,
      pageSize,
      pageNum,
      reload,
      tableLoading,
      reset,
      showEditModal,
      editModalData,
    } = this.state;

    return (
      <div className={st.Index}>
        <div className={st.header}>
          {reset ? null : (
            <div>
              <span>
                <Cascader
                  expandTrigger="hover"
                  options={districts}
                  placeholder="行政区划"
                  changeOnSelect
                  style={{ width: 300 }}
                  onChange={e => {
                    this.condition.districtID = e && e.length ? e[e.length - 1] : null;
                  }}
                />
              </span>
              &ensp;
              <Input
                style={{ width: 200 }}
                placeholder="名称"
                onChange={e => {
                  this.condition.roadName = e.target.value;
                }}
              />
              &ensp;
              <Select
                placeholder="状态"
                style={{ width: 120 }}
                defaultValue={this.condition.state}
                onChange={e => {
                  this.condition.state = e;
                }}
              >
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={2}>禁用</Select.Option>
              </Select>
              &ensp;
              <DatePicker
                placeholder="登记时间|起"
                allowClear
                defaultValue={this.condition.start}
                onChange={e => {
                  this.condition.start = e;
                }}
              />
              &ensp;
              <DatePicker
                placeholder="登记时间|止"
                allowClear
                defaultValue={this.condition.end}
                onChange={e => {
                  this.condition.end = e;
                }}
              />
              &ensp;
              <Button
                type="primary"
                icon="search"
                onClick={e => {
                  this.setState({ pageNum: 1 }, e => {
                    this.search();
                  });
                }}
              >
                查询
              </Button>
              &ensp;
              <Button icon="sync" onClick={e => this.clearCondition()}>
                清空
              </Button>
            </div>
          )}
        </div>
        <div className={st.body}>
          <Table columns={this.columns} dataSource={rows} pagination={false} loading={tableLoading}/>
        </div>
        <div className={st.footer}>
          <Pagination
            pageNum={pageNum}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={['10', '25', '50', '100']}
            onShowSizeChange={(pn, ps) => {
              this.setState({ pageNum: pn, pageSize: ps }, this.search.bind(this));
            }}
            onChange={(pn, ps) => {
              this.setState({ pageNum: pn, pageSize: ps }, this.search.bind(this));
            }}
          />
        </div>
        {showEditModal ? (
          <Modal
            bodyStyle={{ padding: 0 }}
            width="90%"
            title="道路、桥梁基本信息修改"
            visible={true}
            onOk={() => this.save()}
            onCancel={() => this.closeModal()}
          >
            <DLForm
              data={editModalData}
              addRef={e => {
                this.dlform = e;
              }}
              onSaveSuccess={() => {
                this.closeModal();
                this.search();
              }}
            />
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default Index;
