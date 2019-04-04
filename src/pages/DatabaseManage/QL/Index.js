import { Component } from 'react';
import st from './Index.less';

import { Table, Button, Input, DatePicker, Icon, Cascader, Select, Spin, Pagination } from 'antd';
import { GetDistrictTree } from '../../../services/Common';
import { getDistricts } from '../../../utils/utils';
import { warn, error } from '../../../utils/notification';

class Index extends Component {
  condition = {
    start: moment().subtract(1, 'years'),
    end: moment(),
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
  };

  async getDistricts() {
    this.setState({ districtLoading: true });
    await GetDistrictTree(d => {
      let districts = getDistricts(d);
      this.setState({ districts: districts, districtLoading: false });
    });
    this.setState({ districtLoading: false });
  }

  componentDidMount() {
    // this.getDistricts();
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
    } = this.state;

    return (
      <div className={st.Index}>
        ql
      </div>
    );
  }
}

export default Index;
