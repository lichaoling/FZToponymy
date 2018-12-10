import { Component } from 'react';
import st from './MPBZ.less';
import { Table, Pagination, Modal, Input, Select, Button } from 'antd';
import { warn, success } from '../../../utils/notification';
import Search from '../Search';
import { searchHousesBZToLocate, houseBZLocate } from '../../../services/MPBZ';
import LocateMap from '../../../common/Components/Maps/LocateMap2';

let mpIcon = L.divIcon({
  className: 'div-icon-mp',
  iconSize: [42, 40],
  iconAnchor: [21, 20],
  popupAnchor: [0, -22],
  tooltipAnchor: [0, -22],
});

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

  saveLocate(mObj) {
    houseBZLocate({ mObj: JSON.stringify(mObj) }, e => {
      success("保存成功！");
      this.search(this.condition);
    });
  }

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
        start: nCdn.approvalState === 0 ? null : nCdn.start,
        end: nCdn.approvalState === 0 ? null : nCdn.end,
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
          <LocateMap
            beforeBtns={[
              {
                id: 'mpbz',
                icon:'icon-paizhao',
                name: "门牌编制",
                onClick: ((e, i, cmp) => {
                  let row = this.row;

                  this.mpbzTool = new L.Draw.Marker(cmp.map, { icon: mpIcon });

                  this.mpbzTool.on(L.Draw.Event.CREATED, e => {
                    if (this.mpMarker) {
                      this.mpMarker.remove();
                      this.mpMarker = null;
                    }
                    var { layer } = e;
                    this.mpMarker = layer;

                    var latlngs = layer.getLatLng();
                    let { lat, lng } = latlngs;
                    let dom = document.createElement("div");
                    let popup = ReactDOM.render(
                      <Popup
                        saveLocate={e => {
                          let obj = { ...e, X: lng.toFixed(8) - 0, Y: lat.toFixed(8) - 0, ID: this.row.ID };
                          this.saveLocate(obj);
                        }}
                        MPNUM={row.MPNUM}
                        MPNUM_NO={row.MPNUM_NO} />, dom);
                    this.mpMarker
                      .bindPopup(dom)
                      .addTo(cmp.map)
                      .openPopup();
                  });

                  cmp.disableMSTools();
                  this.mpbzTool.enable();
                }).bind(this)
              }
            ]}
            onMapReady={e => {
              let row = this.row;
              if (!this.row.isNew) {
                let { X, Y } = this.row;
                if (X && Y) {
                  e.map.setView([Y, X], 16);
                  if (this.mpMarker) {
                    this.mpMarker.remove();
                    this.mpMarker = null;
                  }
                  let dom = document.createElement("div");
                  let popup = ReactDOM.render(<Popup saveLocate={e => {
                    let obj = { ...e, X, Y, ID: this.row.ID };
                    this.saveLocate(obj);
                  }} MPNUM={row.MPNUM} MPNUM_NO={row.MPNUM_NO} />, dom);
                  this.mpMarker = L.marker([Y, X], { icon: mpIcon }).bindPopup(dom).addTo(e.map);
                  setTimeout(e => {
                    this.mpMarker.openPopup();
                  }, 1000);
                }
              }
            }}
          />
        </Modal>
      </div>
    );
  }
}

class Popup extends Component {
  constructor(ps) {
    super(ps);
    this.state = ps.MPNUM ? {
      MPNUM: ps.MPNUM,
      MPNUM_NO: ps.MPNUM_NO.substring(ps.MPNUM_NO.indexOf(ps.MPNUM) + ps.MPNUM.length, ps.MPNUM_NO.length)
    } : {
        MPNUM_NO: '号'
      };
  }

  save() {
    let { MPNUM, MPNUM_NO } = this.state;
    if (!MPNUM) {
      warn("请填写门牌号后再保存！");
    } else {
      let { saveLocate } = this.props;
      saveLocate({
        MPNUM, MPNUM_NO: MPNUM + MPNUM_NO
      });
    }
  }

  render() {
    let { MPNUM, MPNUM_NO } = this.state;
    return <div className={st.popup}>
      <div>
        <Input
          placeholder="请输入门牌号"
          value={MPNUM}
          onChange={e => this.setState({ MPNUM: e.target.value })}
          addonBefore="门牌号："
          addonAfter={
            <Select value={MPNUM_NO} onChange={e => {
              this.setState({ MPNUM_NO: e });
            }}>
              <Select.Option value="号">号</Select.Option>
            </Select>
          } />
      </div>
      <div>
        <Button type="primary" onClick={e => this.save()}>保存</Button>
      </div>
    </div>;
  }
}

export default MPBZ;
