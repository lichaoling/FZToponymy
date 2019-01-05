import { Component } from 'react';
import { Input, Icon, Pagination, message } from 'antd';
import st from './MapService.less';

import Map from '../../../common/Components/Maps/Map';
import { SearchFromLucene } from '../../../services/ServiceManage';
import { getRedIcon, getBlueIcon } from '../../../common/LIcons';

let aCls = 'active';

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

  locateItem(item, idx) {
    console.log(item, idx);
    this.clearItemLayerGroup();
    L.marker([26.077768 + Math.random() / 10, 119.311231 + Math.random() / 10], {
      icon: getBlueIcon(idx),
    }).addTo(this.itemLayerGroup);
  }

  locateItems(items) {
    this.clearResultLayerGroup();
    items.map((item, idx) => {
      L.marker([26.077768 + Math.random() / 10, 119.311231 + Math.random() / 10], {
        icon: getRedIcon(idx + 1),
      })
        .addTo(this.resultLayerGroup)
        .on('click', e => {
          this.clearItemLayerGroup();
          this.locateItem(item, idx + 1);
          $($(this.refFinalSearchResults).find('>div')[idx])
            .addClass(aCls)
            .siblings()
            .removeClass(aCls);
        });
    });
  }

  initMap() {
    if (this.refMap) {
      let { map } = this.refMap;
      this.map = map;
      this.resultLayerGroup = L.layerGroup().addTo(map);
      this.itemLayerGroup = L.layerGroup().addTo(map);
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
                      this.locateItem(item, 1);
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
                        this.clearItemLayerGroup();
                        this.locateItem(item, idx + 1);
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
