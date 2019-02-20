import { Component } from 'react';
import st from './DataImport.less';

import { Button, DatePicker, Icon, Cascader, Select, Spin, Pagination } from 'antd';
import Map from '../../../common/Components/Maps/Map';

class DataImport extends Component {
  state = {
    districts: [],
    districtLoading: false,
  };

  initMap() {
    if (this.refMap) {
      let { map } = this.refMap;
      this.map = map;
    }
  }

  componentDidMount() {
    this.initMap();
  }

  render() {
    let { districts, districtLoading } = this.state;

    return (
      <div className={st.DataImport}>
        <div className={st.header}>
          <Spin wrapperClassName="dataimport-loading" spinning={districtLoading}>
            <Cascader
              style={{ width: 240 }}
              expandTrigger="hover"
              changeOnSelect
              options={districts}
              placeholder="所在（跨）行政区"
              onChange={(a, b) => {}}
            />
          </Spin>
          &ensp;
          <Select style={{ width: 200 }} placeholder="街道/自然村" />
          &ensp;
          <Select allowClear style={{ width: 200 }} placeholder="数据类别">
            <Select.Option value="小区">小区</Select.Option>
            <Select.Option value="道路">道路</Select.Option>
            <Select.Option value="行政区">行政区</Select.Option>
          </Select>
          &ensp;
          <DatePicker placeholder="入库时间|起" />
          &ensp;~&ensp;
          <DatePicker placeholder="入库时间|止" />
          &ensp;
          <Button type="primary" icon="search">
            搜索
          </Button>
          &ensp;
          <Button icon="reload">清空</Button>
        </div>
        <div className={st.content}>
          <div className={st.results}>
            <div className={st.resultsitems}>resultsitems</div>
            <div className={st.resultsfooter}>
              <Pagination
                showSizeChanger
                //onShowSizeChange={onShowSizeChange}
                defaultCurrent={3}
                total={500}
              />
            </div>
          </div>
          <div className={st.map}>
            <Map ref={e => (this.refMap = e)} />
          </div>
        </div>
      </div>
    );
  }
}

export default DataImport;
