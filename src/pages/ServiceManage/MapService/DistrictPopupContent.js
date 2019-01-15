import { Component } from 'react';
import { Icon } from 'antd';
import st from './DistrictPopupContent.less';
import { SearchDetails } from '../../../services/ServiceManage';

class DistrictPopupContent extends Component {
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
      <div className={st.DistrictPopupContent}>
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
            <div className={st.fulladdress}>{FULLADDRESS}</div>
            <div className={st.pic}>
              <img src={item.pic || require('../../../common/assets/none-picture.png')} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DistrictPopupContent;
