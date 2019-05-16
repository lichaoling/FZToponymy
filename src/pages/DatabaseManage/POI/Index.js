import { Component } from 'react';
import st from './Index.less';

import {
  Modal,
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
} from 'antd';
import { getDistrictTreeByUID } from '../../../services/Common';
import { getDistricts } from '../../../utils/utils';
import { warn, error, success } from '../../../utils/notification';
import { POISearch, LockPOI, UnLockPOI, DelPOI } from '../../../services/DataManage';
import LocateMap from '../../../common/Components/Maps/LocateMap2.js';
import POIForm from './POIForm';
import { getRedIcon } from '../../../common/LIcons';

let defaultCondition = {
  start: moment()
    .subtract(1, 'years')
    .format('YYYY-MM-DD'),
  end: moment().format('YYYY-MM-DD'),
  state: 1,
};

class Index extends Component {
  //行政区划、名称、所在地址、操作
  columns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 80 },
    { title: '行政区划', dataIndex: 'DISTRICTNAME', key: 'DISTRICTNAME' },
    { title: '名称', dataIndex: 'NAME', key: 'NAME' },
    { title: '所在地址', dataIndex: 'ADDRESS', key: 'ADDRESS' },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (v, r) => {
        return (
          <div className={st.rowbtns}>
            <Icon type="edit" onClick={e => this.showPOIForm(r)} title="编辑" />
            <Popconfirm
              title={`确定${r.STATE == 1 ? '禁用该数据' : '解除禁用'}？`}
              onConfirm={e => this.toggleLock(r)}
            >
              <Icon
                type={r.STATE == 1 ? 'lock' : 'unlock'}
                title={`${r.STATE == 1 ? '禁用' : '启用'}`}
              />
            </Popconfirm>
            <Popconfirm title={`确定删除该数据？`} onConfirm={e => this.delete(r)}>
              <Icon type="delete" title="删除" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  condition = {
    ...defaultCondition,
  };

  queryCondition = {};

  state = {
    districts: [],
    districtLoading: false,
    rows: [],
    total: 0,
    pageSize: 10,
    pageNum: 1,
    reload: false,
    tableLoading: false,
    showPOIForm: false,
    resetCondition: false,
  };

  search(condition) {
    let { pageSize, pageNum } = this.state;
    let newCondition = {
      ...(condition || this.condition),
      pageSize,
      pageNum,
    };
    console.log(newCondition);
    this.setState({ tableLoading: true });
    POISearch(
      newCondition,
      d => {
        let { totalCount, Data } = d;
        let { pageNum, pageSize } = this.state;
        Data.map((r, i) => (r.index = (pageNum - 1) * pageSize + i + 1));
        this.setState({
          tableLoading: false,
          total: totalCount,
          rows: Data,
        });
        this.queryCondition = newCondition;
        this.addFeaturesToMap(Data);
      },
      ex => {
        error(ex.message);
        this.setState({ tableLoading: false });
      }
    );
  }

  async getDistricts() {
    this.setState({ districtLoading: true });
    await getDistrictTreeByUID(d => {
      let districts = getDistricts(d);
      this.setState({ districts: districts, districtLoading: false });
    });
    this.setState({ districtLoading: false });
  }

  toggleLock(r) {
    let state = r.STATE;
    if (state === 1) {
      LockPOI(r.ID, d => {
        success('数据已禁用');
        this.search(this.queryCondition);
      });
    } else {
      UnLockPOI(r.ID, d => {
        success('数据已启用');
        this.search(this.queryCondition);
      });
    }
  }

  delete(r) {
    DelPOI(r.ID, d => {
      success('删除成功');
      this.search(this.queryCondition);
    });
  }

  showPOIForm(r) {
    this.entityId = r && r.ID;
    this.setState({ showPOIForm: true });
  }

  resetCondition() {
    this.condition = { ...defaultCondition };
    this.queryCondition = { ...defaultCondition };
    this.setState({ resetCondition: true }, e => this.setState({ resetCondition: false }));
  }

  initMap(lm) {
    this.locateMap = lm;
    this.fg = L.featureGroup().addTo(this.locateMap.map);
  }

  addFeaturesToMap(rows) {
    this.fg.clearLayers();
    for (let r of rows) {
      if (r.WKT) {
        L.geoJSON(Terraformer.WKT.parse(r.WKT), {
          onEachFeature: (f, l) => {
            l.on('click', e => {
              this.showPOIForm(r);
            });
            l.__id__ = r.index;
            l.setIcon(getRedIcon(r.index));
            l.bindTooltip(r.NAME, { permanent: true, direction: 'top' });
            l.addTo(this.fg);
          },
        });
      }
    }
    let bounds = this.fg.getBounds();
    if (bounds.isValid()) this.locateMap.map.fitBounds(this.fg.getBounds());
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
      showPOIForm,
      resetCondition,
    } = this.state;

    let { condition } = this;

    return (
      <div className={st.Index + ' ct-search'}>
        {resetCondition ? null : (
          <div className="ct-search-header">
            <Cascader
              defaultValue={['3501030000000000000']}
              style={{ width: 260 }}
              placeholder="请选择行政区"
              onChange={e => {
                this.condition.districtID = e.join('.');
              }}
              options={districts}
              expandTrigger="hover"
            />
            <Select
              placeholder="类型"
              allowClear
              style={{ width: '100px' }}
              onChange={e => {
                this.condition.lx = e;
              }}
            >
              <Select.Option value="1">门牌</Select.Option>
              <Select.Option value="2">楼栋</Select.Option>
            </Select>
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
              style={{ width: 140 }}
              defaultValue={moment(condition.start)}
              placeholder="登记时间 | 起"
              onChange={e => {
                this.condition.start = e && e.format('YYYY-MM-DD');
              }}
            />
            <DatePicker
              style={{ width: 140 }}
              defaultValue={moment(condition.end)}
              placeholder="登记时间 | 止"
              onChange={e => {
                this.condition.end = e && e.format('YYYY-MM-DD');
              }}
            />
            <Input
              placeholder="名称"
              style={{ width: '260px' }}
              onChange={e => {
                this.condition.name = e.target.value;
              }}
            />
            <Button type="primary" icon="search" onClick={e => this.search()}>
              搜索
            </Button>
            <Button type="primary" icon="sync" onClick={this.resetCondition.bind(this)}>
              清空
            </Button>
            <Button type="primary" icon="plus" onClick={e => this.showPOIForm()}>
              新增
            </Button>
          </div>
        )}
        <div className="ct-search-content">
          <div className={st.results}>
            <Table
              pagination={false}
              bordered
              dataSource={rows}
              columns={this.columns}
              loading={tableLoading}
              onRow={r => {
                return {
                  onDoubleClick: event => {
                    let idx = r.index;
                    let ls = this.fg.getLayers();
                    let layer = ls.find(l => l.__id__ === idx);
                    if (layer) {
                      this.locateMap.map.setView(layer._latlng, 16);
                    }
                  },
                };
              }}
            />
          </div>
          <div className={st.map}>
            <LocateMap
              showToolbar={false}
              onMapReady={lm => {
                this.initMap(lm);
              }}
            />
          </div>
        </div>
        <div className="ct-search-footer">
          <Pagination
            showSizeChanger
            current={pageNum}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={['10', '25', '50', '100']}
            showTotal={(t, r) => {
              let { pageSize, pageNum, rows } = this.state;
              return t > 0
                ? `当前：${(pageNum - 1) * pageSize + 1}-${(pageNum - 1) * pageSize +
                    rows.length}，共${t}条`
                : null;
            }}
            onShowSizeChange={(pn, ps) => {
              this.setState({ pageNum: 1, pageSize: ps }, e => this.search(this.queryCondition));
            }}
            onChange={(pn, ps) => {
              this.setState({ pageNum: pn, pageSize: ps }, e => this.search(this.queryCondition));
            }}
          />
        </div>
        <Modal
          wrapClassName="ct-modal-1200"
          visible={showPOIForm}
          destroyOnClose={true}
          onCancel={e => {
            this.setState({ showPOIForm: false });
          }}
          title={`${this.entityId ? '修改兴趣点' : '新增兴趣点'}`}
          footer={null}
        >
          <POIForm id={this.entityId} onSaveSuccess={e => this.search(this.queryCondition)} />
        </Modal>
      </div>
    );
  }
}

export default Index;
