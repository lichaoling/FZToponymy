import { Component } from 'react';
import st from './Index.less';

import { Table, Button, Input, DatePicker, Icon, Cascader, Select, Spin, Pagination } from 'antd';
import { getDistrictTreeByUID } from '../../../services/Common';
import { RoadSearch, RoadDisable, RoadDel } from '../../../services/DataManage';
import { getDistricts } from '../../../utils/utils';
import { warn, error } from '../../../utils/notification';

let condition = {
  end: moment(),
  start: moment().subtract(1, 'years'),
  state: 1,
};

class Index extends Component {
  columns = [
    { title: '序号', dataIndex: 'idx', key: 'idx' },
    { title: '行政区划', dataIndex: 'name', key: 'name' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '状态', dataIndex: 'name', key: 'name' },
    { title: '长度（米）', dataIndex: 'name', key: 'name' },
    { title: '宽度（米）', dataIndex: 'name', key: 'name' },
    { title: '登记时间', dataIndex: 'name', key: 'name' },
    {
      title: '操作',
      dataIndex: 'Id',
      key: 'action',
      render(text, record, index) {
        return (
          <span>
            <Icon type="edit" title="编辑" onClick={this.edit(record)} />
            &ensp;
            <Popconfirm
              title="确定禁用该条数据？"
              icon={
                <Icon
                  type="question-circle-o"
                  style={{ color: 'red' }}
                  onConfirm={e => this.lock(record)}
                />
              }
            >
              <Icon type="lock" title="禁用" />
            </Popconfirm>
            &ensp;
            <Popconfirm
              title="确定删除该条数据？"
              icon={
                <Icon
                  type="question-circle-o"
                  style={{ color: 'red' }}
                  onConfirm={e => this.delete(record)}
                />
              }
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
    pageNum: 0,
    reload: false,
    tableLoading: false,
    reset: false,
  };

  edit(i) {
    console.log(i);
  }

  lock(i) {
    console.log(i);
  }

  delete(i) {
    console.log(i);
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

    RoadSearch(searchCondition, d => {
      console.log(d);
    });
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
                placeholder="道路名称"
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
              <Button type="primary" icon="search" onClick={e => this.search()}>
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
          <Table columns={this.columns} dataSource={rows} />
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
      </div>
    );
  }
}

export default Index;
