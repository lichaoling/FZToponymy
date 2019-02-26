import { Component } from 'react';
import { Icon } from 'antd';
import st from './LZPopup.less';
import { SearchHSDetails } from '../../../services/ServiceManage';

class LZPopup extends Component {
  state = {
    error: null,
    loading: false,
    DYList: [],
  };

  getDYs() {
    let { DYList } = this.state;
    if (DYList && DYList.length) {
      return (
        <div className={st.lzs}>
          {DYList.map(i => {
            return (
              <div>
                <div>{i.DYNUM || '无单元号'}</div>
                <div>
                  {i.HSList && i.HSList.length
                    ? i.HSList.map(h => {
                        return <div>{h.HSNUM}</div>;
                      })
                    : null}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return <div className={st.nonehs}>无户室信息</div>;
    }
  }

  getLZInfos() {
    if (!this.bGeted) {
      this.bGeted = true;
      let { data } = this.props;
      if (data && data.ID) {
        this.setState({ loading: true });
        SearchHSDetails(
          {
            lzid: data.ID,
          },
          d => {
            console.log(d);
            this.setState({ loading: false, DYList: d || [] });
          },
          e => {
            this.bGeted = false;
            this.setState({ loading: false, error: '未能获取指定的数据' });
          }
        );
      }
    }
  }

  // componentDidMount() {
  //   this.getLZInfos();
  // }

  render() {
    let { data, name } = this.props;
    data = data || {};
    let { loading, error } = this.state;
    return (
      <div className={st.LZPopup}>
        <div className={st.name}>
          {name} - {data.LZNUM}
        </div>
        {loading ? (
          <div className={st.loading}>
            <Icon type="loading" />
            &emsp;加载中...
          </div>
        ) : error ? (
          <div className={st.error}>{error}</div>
        ) : (
          this.getDYs()
        )}
      </div>
    );
  }
}

export default LZPopup;
