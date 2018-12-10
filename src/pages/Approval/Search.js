import { Component } from 'react';
import { Cascader, Select, DatePicker, Button, Spin } from 'antd';
import { getUserDistricts } from '../../utils/utils.js';
import { getDistrictTreeByUID } from '../../services/Common';

class Search extends Component {
  // string districtID, int approvalState, DateTime? start, DateTime? end

  constructor(ps) {
    super(ps);
    this.ex = ps.extension || '审批';
    this.condition.approvalState = ps.approvalState || 0;
    this.oCondition = { ...this.condition };
  }

  state = {
    districtLoading: false,
    reload: false,
    districts: [],
  };

  condition = {
    districtID: null,
    approvalState: 0,
    start: null,
    end: null,
  };

  search() {
    let { onSearch } = this.props;
    onSearch && onSearch(this.condition);
  }

  clearCondition() {
    this.condition = { ...this.oCondition };
    this.setState({ reload: true }, e => this.setState({ reload: false }));
    let { onClear } = this.props;
    onClear && onClear(this.condition);
  }

  async getDistricts() {
    this.setState({ districtLoading: true });
    await getDistrictTreeByUID(d => {
      let districts = getUserDistricts(d);
      this.setState({ districts: districts, districtLoading: false });
    });
    this.setState({ districtLoading: false });
  }

  componentDidMount() {
    this.getDistricts();
  }

  render() {
    let { reload, districts, districtLoading } = this.state;
    let { districtID, approvalState, start, end } = this.oCondition;
    let cmp = reload ? null : (
      <div>
        <Spin wrapperClassName="ct-inline-loading" spinning={districtLoading}>
          <Cascader
            defaultValue={districtID}
            expandTrigger="hover"
            changeOnSelect
            allowClear
            style={{ width: 400 }}
            placeholder="行政区划"
            options={districts}
            onChange={e => {
              this.condition.districtID = e;
            }}
          /></Spin>
        &emsp;
        <Select
          // allowClear
          defaultValue={approvalState}
          placeholder={this.ex + '状态'}
          style={{ width: 200 }}
          onChange={e => {
            this.condition.approvalState = e;
          }}
        >
          <Select.Option value={0}>待{this.ex}</Select.Option>
          <Select.Option value={1}>已{this.ex}</Select.Option>
        </Select>
        &emsp;
        <DatePicker
          defaultValue={start}
          placeholder={this.ex + '时间（起）'}
          onChange={e => {
            this.condition.start = e && e.format('YYYY-MM-DD');
            debugger;
          }}
        />
        &ensp; ~ &ensp;
        <DatePicker
          defautlValue={end}
          placeholder={this.ex + '时间（止）'}
          onChange={e => {
            this.condition.end = e && e.format('YYYY-MM-DD');
          }}
        />
        &emsp;
        <Button icon="search" type="primary" onClick={this.search.bind(this)}>
          查询
        </Button>
        &ensp;
        <Button onClick={this.clearCondition.bind(this)} icon="sync">
          清空
        </Button>
      </div>
    );
    return cmp;
  }
}

export default Search;
