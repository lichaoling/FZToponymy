import { Component } from 'react';
import { Icon, Badge } from 'antd';
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
    let {FULLADDRESS}=this.props;
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
                <td>{item.BZTIME || '无'}</td>
              </tr>
              <tr>
                <th>原规划名：</th>
                <td>{item.PLANNAME || '无'}</td>
              </tr>
              <tr>
                <th>长&emsp;&emsp;度：</th>
                <td>{(item.LENGTH && item.LENGTH.toFixed(2) + '米') || '无'}</td>
              </tr>
              <tr>
                <th>宽&emsp;&emsp;度：</th>
                <td>{(item.WIDTH && item.WIDTH.toFixed(2) + '米') || '无'}</td>
              </tr>
              <tr>
                <th>建成时间：</th>
                <td>{item.JCSJ || '无'}</td>
              </tr>
              <tr>
                <th>性&emsp;&emsp;质：</th>
                <td>{item.DLLB || '无'}</td>
              </tr>
              <tr>
                <th>建设单位：</th>
                <td>{item.SBDW || '无'}</td>
              </tr>
              <tr>
                <th>标准地址：</th>
                <td>{FULLADDRESS || '无'}</td>
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
