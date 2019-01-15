import { Component } from 'react';
import { Icon } from 'antd';
import st from './HousePopupContent.less';
import { SearchDetails } from '../../../services/ServiceManage';

class HousePopupContent extends Component {
  state = {
    item: null,
    error: null,
    loading: true,
  };

  componentDidMount() {
    let { type, id, callback } = this.props;
    SearchDetails(
      {
        type: type,
        id: id,
      },
      d => {
        this.setState({ loading: false, item: d });
        callback && callback(d);
      },
      e => {
        this.setState({ loading: false, error: '未能获取指定的数据' });
      }
    );
  }

  render() {
    let { item, error, loading } = this.state;
    let { FULLADDRESS } = this.props;
    return (
      <div className={st.HousePopupContent}>
        {loading ? (
          <div className={st.loading}>
            <Icon type="loading" />
            &emsp;加载中...
          </div>
        ) : error ? (
          <div className={st.error}>{error}</div>
        ) : (
          <div className={st.content}>
            <div className={st.name}>{item.NAME}</div>
            <table className={st.items}>
              <tr>
                <th>别&emsp;&emsp;名：</th>
                <td>{item.ALIAS || '无'}</td>
              </tr>
              <tr>
                <th>区&emsp;&emsp;划：</th>
                <td>{item.DISTRICTNAME || '无'}</td>
              </tr>
              <tr>
                <th>完整地址：</th>
                <td>{FULLADDRESS || '无'}</td>
              </tr>
              <tr>
                <th>申请时间：</th>
                <td>{item.BZTIME || '无'}</td>
              </tr>
              <tr>
                <th>门&emsp;&emsp;牌：</th>
                <td>{item.MPList ? item.MPList.map(i => <span>{i.MPNUM}</span>) : '无'}</td>
              </tr>
              <tr>
                <th>楼&emsp;&emsp;幢：</th>
                <td>{item.LZList ? item.LZList.map(i => <span>{i.LZNUM}</span>) : '无'}</td>
              </tr>
              <tr>
                <th>户&emsp;&emsp;数：</th>
                <td>{item.RoomCount ? `共 ${item.RoomCount} 户` : '无'}</td>
              </tr>
            </table>
            <div className={st.pic}>
              <img src={item.pic || require('../../../common/assets/none-picture.png')} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default HousePopupContent;
