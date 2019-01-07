import { Component } from 'react';
import { Icon } from 'antd';
import st from './RoadPopupContent.less';
import { SearchDetails } from '../../../services/ServiceManage';

class RoadPopupContent extends Component {
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
    return (
      <div className={st.RoadPopupContent}>
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
                <th>申请时间：</th>
                <td>{item.ApprovalTime || '无'}</td>
              </tr>
              <tr>
                <th>小区（{item.HouseList ? item.HouseList.length : 0}）：</th>
                <td>
                  <div className={st.items}>
                    {item.HouseList ? item.HouseList.map(i => <span>{i.NAME}</span>) : '无'}
                  </div>
                </td>
              </tr>
              <tr>
                <th>门牌（{item.MPList ? item.MPList.length : 0}）：</th>
                <td>
                  <div className={st.items}>
                    {item.MPList ? item.MPList.map(i => <span>{i.MPNUM}</span>) : '无'}
                  </div>
                </td>
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

export default RoadPopupContent;
