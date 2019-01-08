import { Component } from 'react';
import { Input, Icon, Pagination, message } from 'antd';
import st from './MapService.less';

import Map from '../../../common/Components/Maps/Map';
import { SearchFromLucene } from '../../../services/ServiceManage';
import { getRedIcon, getBlueIcon } from '../../../common/LIcons';
import TopItem from './TopItem';

let aCls = 'active';

let tmpLineWkt =
  'LINESTRING(119.32180166244507 26.084225177764893,119.32197332382202 26.0795259475708,119.32214498519897 26.077938079833984,119.32231664657593 26.075899600982666,119.3228530883789 26.07330322265625,119.32328224182129 26.071457862854004,119.3238615989685 26.06858253479004)';
let tmpPolygonWkt =
  'POLYGON((119.3034553527832 26.089954376220703,119.31169509887695 26.090726852416992,119.31521415710449 26.091928482055664,119.32611465454102 26.096134185791016,119.32929039001465 26.092357635498047,119.32971954345703 26.08454704284668,119.33049201965332 26.07733726501465,119.33100700378418 26.06884002685547,119.32405471801758 26.068496704101562,119.31538581848145 26.06832504272461,119.30817604064941 26.066608428955078,119.30740356445312 26.074419021606445,119.30577278137207 26.079483032226562,119.3034553527832 26.089954376220703))';

window.tmpLineWkt = tmpLineWkt;
window.tmpPolygonWkt = tmpPolygonWkt;

class MapService extends Component {
  state = {
    searchText: '',
    qsLoading: false,
    fsLoading: false,
    quickSearchResults: [],
    finalSearchResults: [],
    total: 100,
    pageSize: 10,
    pageNum: 1,
  };

  condition = {};

  searchbarClear() {
    this.hideFinalSearchResultPanel(true);
    this.hideQuickSearchResultPanel(true);
  }

  quickSearch(v) {
    this.hideFinalSearchResultPanel(true);
    this.showQuickSearchResultPanel();
    this.setState({ qsLoading: true });
    SearchFromLucene(
      { pageSize: 10, pageNum: 1, word: v },
      e => {
        this.setState({ qsLoading: false, quickSearchResults: (e && e.Data) || [] });
      },
      e => {
        message.error(e.message);
        this.setState({ qsLoading: false });
      }
    );
  }

  finalSearch(pageNum, pageSize, word, sf, ef) {
    this.hideQuickSearchResultPanel(true);
    this.showFinalSearchResultPanel();
    this._finalSearch(pageNum, pageSize, word, sf, ef);
  }

  _finalSearch(pageNum, pageSize, word, sf, ef) {
    let newCondition = { pageSize, pageNum, word };
    this.setState({ fsLoading: true });
    SearchFromLucene(
      newCondition,
      e => {
        this.condition = newCondition;
        let rows = (e && e.Data) || [];
        this.setState(
          {
            pageSize: pageSize,
            pageNum: pageNum,
            fsLoading: false,
            finalSearchResults: rows,
            total: (e && e.totalCount) || 0,
          },
          e => {
            this.initResultClick();
            sf && sf(rows);
          }
        );
      },
      e => {
        ef && ef();
        message.error(e.message);
        this.setState({ fsLoading: false });
      }
    );
  }

  initResultClick() {
    let { finalSearchResults } = this.state;
    if (finalSearchResults.length && this.refFinalSearchResults) {
      $(this.refFinalSearchResults)
        .find('>div')
        .on('click', function() {
          let $this = $(this);
          $this
            .addClass(aCls)
            .siblings()
            .removeClass(aCls);
        });
    }
  }

  clearMap() {
    this.clearResultLayerGroup();
    this.clearItemLayerGroup();
    this.clearActiveItem();
  }

  activeItem(item, center = true) {
    if (!item.GEOM_WKT) {
      // message.error('不包含空间数据，无法定位！');
      //return;
      if (item.TYPE === 'ROAD') {
        item.GEOM_WKT = tmpLineWkt;
      } else if (item.TYPE === 'DISTRICT') {
        item.GEOM_WKT = tmpPolygonWkt;
      }
    }

    this.clearActiveItem();
    let _activeItem = new TopItem(item, this.map, null, '★');
    _activeItem.activeItem(this.itemLayerGroup);
    if (center) _activeItem.center();
    this._activeItem = _activeItem;
  }

  clearActiveItem() {
    if (this._activeItem) {
      this._activeItem.clear();
      this._activeItem = null;
    }
  }

  clearResultLayerGroup() {
    this.resultLayerGroup.clearLayers();
  }

  clearItemLayerGroup() {
    this.itemLayerGroup.clearLayers();
  }

  hideFinalSearchResultPanel(clear = false) {
    if (clear) this.setState({ finalSearchResults: [] });
    $(this.finalSearchResultPanel).removeClass(aCls);
  }

  hideQuickSearchResultPanel(clear = false) {
    if (clear) this.setState({ quickSearchResults: [] });
    $(this.quickSearchResultPanel).removeClass(aCls);
  }

  showFinalSearchResultPanel() {
    $(this.finalSearchResultPanel).addClass(aCls);
  }

  showQuickSearchResultPanel() {
    $(this.quickSearchResultPanel).addClass(aCls);
  }

  getType(type) {
    switch (type) {
      case 'ROAD':
        return '道路';
      case 'HOUSE':
        return '小区';
      case 'DISTRICT':
        return '行政区';
      default:
        return null;
    }
  }

  locateItems(items) {
    this.clearResultLayerGroup();
    items.map((item, idx) => {
      if (!item.GEOM_WKT) {
        if (item.TYPE === 'ROAD') item.GEOM_WKT = tmpLineWkt;
        if (item.TYPE === 'DISTRICT') item.GEOM_WKT = tmpPolygonWkt;
      }
      let topItem = new TopItem(
        item,
        this.map,
        t => {
          // this.clearItemLayerGroup();
          this.clearActiveItem();
          this.activeItem(item, false);
          $($(this.refFinalSearchResults).find('>div')[idx])
            .addClass(aCls)
            .siblings()
            .removeClass(aCls);
        },
        idx + 1
      );
      topItem.addTo(this.resultLayerGroup);
    });
    if (items && items.length)
      this.map.fitBounds(this.resultLayerGroup.getBounds(), { padding: [100, 100] });
  }

  initMap() {
    if (this.refMap) {
      let { map } = this.refMap;
      this.map = map;
      window.map = map;
      this.resultLayerGroup = L.geoJSON().addTo(map);
      this.itemLayerGroup = L.geoJSON().addTo(map);
    }
  }

  componentDidMount() {
    this.initMap();
  }

  render() {
    let {
      searchText,
      qsLoading,
      fsLoading,
      quickSearchResults,
      finalSearchResults,
      total,
      pageSize,
      pageNum,
    } = this.state;

    return (
      <div className={st.MapService}>
        <div className={st.searchbar} ref={e => (this.search = e)}>
          <Input.Search
            value={searchText}
            size="large"
            enterButton
            placeholder="搜索标准地名、地址..."
            onChange={e => {
              let v = e.target.value;
              this.setState({ searchText: v });
              this.quickSearch(v);
            }}
            onSearch={e => {
              this.finalSearch(1, 10, e, this.locateItems.bind(this));
            }}
          />
          <Icon
            className={searchText ? '' : 'hidden'}
            type="close"
            onClick={e => {
              this.setState({ searchText: '' }, e => {
                this.searchbarClear();
              });
              let that = this;
              if (that.search) {
                $(that.search)
                  .find('input')[0]
                  .focus();
              }
            }}
          />
        </div>
        <div ref={e => (this.quickSearchResultPanel = e)} className={st.quicksearchresult}>
          {qsLoading ? (
            <div className={st.searchloading}>
              <Icon type="loading" />
              &emsp;搜索中...
            </div>
          ) : (
            <div className={st.container}>
              {quickSearchResults.length ? (
                quickSearchResults.map((item, idx) => (
                  <div
                    className={st.item}
                    onClick={e => {
                      this.clearMap();
                      this.activeItem(item);
                      this.hideQuickSearchResultPanel(true);
                    }}
                  >
                    <Icon type="search" />
                    &ensp;{item.NAME}
                    {item.TYPE ? <span>{this.getType(item.TYPE)}</span> : null}
                  </div>
                ))
              ) : (
                <div className={st.noresult}>未找到符合条件的数据</div>
              )}
            </div>
          )}
        </div>
        <div ref={e => (this.finalSearchResultPanel = e)} className={st.finalsearchresult}>
          {fsLoading ? (
            <div className={st.searchloading}>
              <Icon type="loading" />
              &emsp;搜索中...
            </div>
          ) : (
            <div className={st.container}>
              <div ref={e => (this.refFinalSearchResults = e)} className={st.results}>
                {finalSearchResults.length ? (
                  finalSearchResults.map((item, idx) => (
                    <div
                      className={st.item}
                      onClick={e => {
                        // this.clearItemLayerGroup();
                        this.clearActiveItem();
                        this.activeItem(item);
                      }}
                    >
                      <div className={st.index}>
                        <div>{idx + 1}</div>
                      </div>
                      <div className={st.content}>
                        <div className={st.name}>
                          {item.NAME}
                          {item.TYPE ? <span>{this.getType(item.TYPE)}</span> : null}
                        </div>
                        <div className={st.describles}>
                          <div className={st.describle}>{item.FULLADDRESS}</div>
                          <div className={st.pic}>
                            <img
                              src={item.pic || require('../../../common/assets/none-picture.png')}
                              alt="暂无图片"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={st.noresult}>未找到符合条件的数据</div>
                )}
              </div>
              <div className={st.pagination}>
                <Pagination
                  onChange={(pn, ps) => {
                    this._finalSearch(pn, ps, this.condition.word, this.locateItems.bind(this));
                  }}
                  current={pageNum}
                  pageSize={pageSize}
                  size="small"
                  total={total}
                  showTotal={e => `共${total}条`}
                />
              </div>
            </div>
          )}
        </div>

        <div className={st.mapcontainer}>
          <Map ref={e => (this.refMap = e)} />
        </div>
      </div>
    );
  }
}

export default MapService;
