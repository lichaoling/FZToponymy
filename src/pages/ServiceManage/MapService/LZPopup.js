import { Component } from 'react';
import { Icon } from 'antd';
import st from './LZPopup.less';

class LZPopup extends Component {
  getDYs() {
    let { data } = this.props;
    if (data && data.DYList && data.DYList.length) {
      return (
        <div className={st.lzs}>
          {data.DYList.map(i => {
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

  render() {
    let { data, name } = this.props;
    data = data || {};
    return (
      <div className={st.LZPopup}>
        <div className={st.name}>
          {name} - {data.LZNUM}
        </div>
        {this.getDYs()}
      </div>
    );
  }
}

export default LZPopup;
