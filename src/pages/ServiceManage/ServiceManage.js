import { Component } from 'react';
import { Menu, Dropdown, Icon, Divider } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import Link from 'umi/link';
import st from './ServiceManage.less';
import { GetUser } from '../../services/Login';

class ServiceManage extends Component {
  render() {
    let { children } = this.props;
    return (
      <div className={st.ServiceManage}>
        {/* <div ref={e => (this.nave = e)} className={st.nave}>
          <div className={st.nave_ct}>{this.getNavs()}</div>
        </div> */}
        <div className={st.body}>{children}</div>
      </div>
    );
  }
}

export default ServiceManage;
