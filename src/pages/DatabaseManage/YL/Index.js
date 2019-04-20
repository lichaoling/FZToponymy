import { Component } from 'react';
import st from './Index.less';
import YLForm from './YLForm';

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
import Map from '../../../common/Components/Maps/Map';
import LZPopup from '../../ServiceManage/MapService/LZPopup';
import HousePopupContent from '../../ServiceManage/MapService/HousePopupContent';
import { getDistrictTreeByUID } from '../../../services/Common';
import {
  HouseSearch,
  HouseDetails,
  HouseDisableOrDel,
  HouseModify,
} from '../../../services/DataManage';
import {
  getRedIcon,
  getBlueIcon,
  getOrangeIcon,
  orangeIcon,
  redStyle,
  blueStyle,
} from '../../../common/LIcons';
import { getDistricts } from '../../../utils/utils';
import { warn, error, success } from '../../../utils/notification';

let condition = {
  start: moment().subtract(1, 'years'),
  end: moment(),
  state: 1,
};

class Index extends Component {
  columns = [
    { title: '序号', dataIndex: 'idx', key: 'idx' },
    { title: '行政区划', dataIndex: 'DISTRICTNAME', key: 'DISTRICTNAME' },
    { title: '道路（自然村）', dataIndex: 'RNAME', key: 'RNAME' },
    { title: '门牌号', dataIndex: 'MPNUM', key: 'MPNUM' },
    { title: '小区', dataIndex: 'HOUSENAME', key: 'HOUSENAME' },
    { title: '状态', dataIndex: 'STATE', key: 'STATE' },
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
    pageSize: 8,
    pageNum: 0,
    reload: false,
    tableLoading: false,
    reset: false,
    showEditModal: false,
    editModalData: null,
  };

  edit(i) {
    // console.log(i);
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

  lock(i) {
    let state = i.STATE == '启用' ? 2 : i.STATE == '禁用' ? 1 : -1;
    let stateMsg = i.STATE == '启用' ? '禁用' : i.STATE == '禁用' ? '启用' : '未知';
    let id = i.ID;
    HouseDisableOrDel({ id, state }, e => {
      if (e == null) {
        success(stateMsg + '成功！');
        this.search();
      }
    });
  }

  delete(i) {
    HouseDisableOrDel({ id: i.ID, state: 0 }, e => {
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
  initMap() {
    if (this.refMap) {
      let { map } = this.refMap;
      this.map = map;

      this.layerGroup = L.featureGroup().addTo(map);
    }
  }
  clearMap() {
    this.layerGroup.clearLayers();
    this.clearActiveItem();
  }

  clearActiveItem() {
    if (this._activeItem) {
      this._activeItem.remove();
      this._activeItem = null;
    }
  }

  activeItem(item, center) {
    if (center && item.latlng) {
      this.map.setView(item.latlng);
    }
    if (item.latlng) {
      this.clearActiveItem();
      this._activeItem = L.featureGroup().addTo(this.map);
      let activeMarker = L.marker(item.latlng, { icon: getBlueIcon('★') }).addTo(this._activeItem);
      if (item.HOUSEWKT) {
        let popupDom = $('<div></div>')
          .addClass('topitem')
          .get(0);
        let popup = ReactDOM.render(
          <HousePopupContent
            FULLADDRESS={item.HOUSEFULLADDRESS}
            callback={d => {
              this.addHouseSubItems(d);
            }}
            type={'HOUSE'}
            id={item.HOUSEID}
          />,
          popupDom
        );
        activeMarker.bindPopup(popupDom, { maxWidth: 400 }).openPopup();
      }
    } else {
      warn('该数据不包含空间位置信息');
    }
  }

  addHouseSubItems(item) {
    if (item.LZList && item.LZList.length) {
      item.LZList.map(i => {
        let { GEOM_WKT } = i;
        if (GEOM_WKT) {
          let dom = $('<div></div>').get(0);
          let popup = ReactDOM.render(<LZPopup data={i} name={item.NAME} />, dom);
          let l = L.geoJSON(Terraformer.WKT.parse(GEOM_WKT), {
            onEachFeature: (f, l) => {
              if (l.setIcon)
                l.setIcon(getOrangeIcon('<span class="iconfont icon-jianzhu"></span>'));
            },
          })
            .unbindPopup()
            .bindPopup(dom, { maxWidth: 370 })
            .bindTooltip(i.LZNUM, {
              // permanent: true,
              direction: 'top',
              className: 'ct-lztip',
            });
          l.on('click', e => {
            popup.getLZInfos();
          });
          this._activeItem.addLayer(l);
        }
      });
    }
  }

  addHouseItems(rows) {
    this.clearMap();
    if (rows && rows.length) {
      var { layerGroup } = this;
      rows.map((i, idx) => {
        let { HOUSEWKT, MPWKT } = i;
        if (HOUSEWKT || MPWKT) {
          let dom = $('<div></div>').get(0);
          let l = L.geoJSON(Terraformer.WKT.parse(HOUSEWKT || MPWKT), {
            onEachFeature: (f, l) => {
              if (l.setIcon) {
                l.setIcon(getRedIcon(idx + 1));
                i.latlng = l.getLatLng();
                if (HOUSEWKT)
                  l.on('click', e => {
                    this.activeItem(i);
                  });
              }
              // 绑定popup事件？添加查询小区marker？
            },
          });
          if (HOUSEWKT)
            l.bindTooltip(i.HOUSENAME, {
              permanent: true,
              direction: 'top',
              className: 'ct-lztip',
            });
          this.layerGroup.addLayer(l);
        }
      });
      let bounds = this.layerGroup.getBounds();
      if (bounds.isValid()) this.map.fitBounds(bounds);
    }
  }

  search() {
    let { pageSize, pageNum } = this.state;
    let searchCondition = {
      pageSize,
      pageNum,
    };
    let { start, end, roadName, houseName, districtID, state } = this.condition;
    if (start) searchCondition.start = start.format('YYYY-MM-DD');
    if (end) searchCondition.end = end.format('YYYY-MM-DD');
    if (roadName) searchCondition.roadName = roadName;
    if (houseName) searchCondition.houseName = houseName;
    if (districtID) searchCondition.districtID = districtID;
    if (state) searchCondition.state = state;

    this.setState({ tableLoading: true });
    HouseSearch(
      searchCondition,
      d => {
        let { Data, totalCount } = d;
        Data.map((i, idx) => {
          i.STATE == '1' ? (i.STATE = '启用') : (i.STATE = '禁用');
          i.idx = idx + 1;
          i.RNAME = i.ROADNAME || i.VILLAGENAME;
        });
        this.setState({ rows: Data, total: totalCount, tableLoading: false });
        this.addHouseItems(Data);
      },
      e => {
        this.setState({ tableLoading: false });
        error(e.message);
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

  componentDidMount() {
    this.initMap();
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
                  style={{ width: 250 }}
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
              <Input
                style={{ width: 200 }}
                placeholder="小区名称"
                onChange={e => {
                  this.condition.houseName = e.target.value;
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
        <div className={st.content}>
          <div className={st.body}>
            <div className={st.tab}>
              <Table
                bordered
                columns={this.columns}
                dataSource={rows}
                pagination={false}
                loading={tableLoading}
                onRow={record => {
                  return {
                    onClick: event => {
                      this.activeItem(record, true);
                    },
                    // onDoubleClick: (event) => {},
                  };
                }}
              />
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
          <div className={st.map}>
            <Map ref={e => (this.refMap = e)} />
          </div>
        </div>
        {showEditModal ? (
          <Modal
            wrapClassName="ct-modal-1200"
            title="院落信息"
            visible={showEditModal}
            // onOk={() => this.save()}
            // onCancel={() => this.closeModal()}
            footer={false}
            onCancel={e => {
              this.setState({ showEditModal: false });
            }}
          >
            <YLForm
              id={editModalData && editModalData.MPID}
              onCancel={e => {
                this.setState({ showEditModal: false });
              }}
              onSaveSuccess={() => {
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
