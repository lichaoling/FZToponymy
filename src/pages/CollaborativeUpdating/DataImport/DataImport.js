import { Component } from 'react';
import st from './DataImport.less';

import { Table, Button, Input, DatePicker, Icon, Cascader, Select, Spin, Pagination } from 'antd';
import Map from '../../../common/Components/Maps/Map';
import { ImportDataSearch } from '../../../services/CollaborativeUpdating';
import { getDistrictTreeByUID } from '../../../services/Common';
import { getDistricts } from '../../../utils/utils';
import { warn, error } from '../../../utils/notification';
import {
  getRedIcon,
  getBlueIcon,
  getOrangeIcon,
  orangeIcon,
  redStyle,
  blueStyle,
} from '../../../common/LIcons';
import HousePopupContent from '../../ServiceManage/MapService/HousePopupContent';
import LZPopup from '../../ServiceManage/MapService/LZPopup';

class DataImport extends Component {
  condition = {
    start: moment().subtract(1, 'years'),
    end: moment(),
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'idx',
      key: 'idx',
    },
    {
      title: '行政区',
      dataIndex: 'DISTRICTNAME',
      key: 'DISTRICTNAME',
    },
    {
      title: '道路（自然村）',
      dataIndex: 'ROADNAME',
      key: 'ROADNAME',
      render: (text, record, index) => {
        let { ROADNAME, VILLAGENAME } = record;
        return ROADNAME || VILLAGENAME;
      },
    },
    {
      title: '门牌',
      dataIndex: 'MPNUM',
      key: 'MPNUM',
    },
    {
      title: '小区（楼宇）',
      dataIndex: 'HOUSENAME',
      key: 'HOUSENAME',
    },
    {
      title: '入库时间',
      dataIndex: 'CREATETIME',
      key: 'CREATETIME',
    },
  ];

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

  search(pageNum, pageSize) {
    pageNum = pageNum || 1;
    pageSize = pageSize || this.state.pageSize;

    this.setState({ pageNum, pageSize });
    this.condition.pageNum = pageNum;
    this.condition.pageSize = pageSize;
    let { districtID, start, end, houseName } = this.condition;
    if (!districtID) {
      warn('请选择行政区');
      return;
    }
    if (!start || !end) {
      warn('请选择入库时间');
      return;
    }
    this.setState({ tableLoading: true });
    ImportDataSearch(
      this.condition,
      d => {
        let { Data, totalCount } = d;

        Data.map((i, idx) => {
          i.idx = idx + 1;
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
    // 获取行政区数据
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
    } = this.state;

    return (
      <div className={st.DataImport}>
        <div className={st.header}>
          {reload ? null : (
            <div>
              {/* <Spin wrapperClassName="dataimport-loading" spinning={districtLoading}> */}
              <Cascader
                style={{ width: 320 }}
                expandTrigger="hover"
                changeOnSelect
                options={districts}
                placeholder="行政区划"
                onChange={(a, b) => {
                  this.condition.districtID = a.length ? a[a.length - 1] : null;
                }}
              />
              {/* </Spin> */}
              &ensp;
              <Input
                style={{ width: 240 }}
                placeholder="小区名称"
                onChange={e => {
                  var v = e.target.value;
                  this.condition.houseName = v;
                }}
              />
              &ensp;
              <DatePicker
                style={{ width: 160 }}
                placeholder="入库时间|起"
                onChange={e => {
                  this.condition.start = e ? e.format('YYYY-MM-DD') : null;
                }}
                defaultValue={moment().subtract(1, 'years')}
              />
              &ensp;~&ensp;
              <DatePicker
                defaultValue={moment()}
                style={{ width: 160 }}
                placeholder="入库时间|止"
                onChange={e => {
                  this.condition.end = e ? e.format('YYYY-MM-DD') : null;
                }}
              />
              &ensp;
              <Button
                type="primary"
                icon="search"
                onClick={e => {
                  this.search(1, this.state.pageSize);
                }}
              >
                搜索
              </Button>
              &ensp;
              <Button
                icon="reload"
                onClick={e => {
                  this.condition.moment().subtract(1, 'years');
                  this.condition.end = moment();
                  this.condition.districtID = null;
                  this.condition.houseName = null;
                  this.setState({ reload: true }, e => this.setState({ reload: false }));
                }}
              >
                清空
              </Button>
            </div>
          )}
        </div>
        <div className={st.content}>
          <div className={st.results}>
            <div className={st.resultsitems}>
              <Table
                bordered
                pagination={false}
                loading={tableLoading}
                columns={this.columns}
                dataSource={rows}
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
            <div className={st.resultsfooter}>
              <Pagination
                showSizeChanger
                onShowSizeChange={(pn, ps) => {
                  this.search(1, ps);
                }}
                current={pageNum}
                pageSize={pageSize}
                total={total}
                onChange={(pn, ps) => {
                  this.search(pn, ps);
                }}
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
