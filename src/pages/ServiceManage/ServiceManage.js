import { Component } from 'react';
import { Menu, Dropdown, Icon, Divider } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import Link from 'umi/link';
import st from './ServiceManage.less';
import { GetUser } from '../../services/Login';

class ServiceManage extends Component {
  getNavs() {
    let { pathname } = this.props.location;
    let { routes } = this.props.route;
    let navs = [];
    for (let i = 0; i < routes.length - 1; i++) {
      if (routes[i].path && !routes[i].redirect)
        navs.push(
          <div className={st.link}>
            <Link
              key={i}
              to={routes[i].path}
              className={pathname.indexOf(routes[i].path.toLowerCase()) >= 0 ? 'active' : ''}
            >
              {routes[i].name}
            </Link>
            {i === routes.length - 2 ? null : <Divider type="vertical" />}
          </div>
        );
    }
    return navs;
  }
  componentDidMount() {
    $(this.nave)
      .find('a')
      .on('click', function() {
        let ac = 'active';
        $(this)
          .addClass(ac)
          .siblings()
          .removeClass(ac);
      });
  }
  render() {
    let { children } = this.props;
    return (
      <div className={st.ServiceManage}>
        <div ref={e => (this.nave = e)} className={st.nave}>
          <div className={st.nave_ct}>{this.getNavs()}</div>
        </div>
        <div className={st.body}>{children}</div>
      </div>
    );
  }
}

export default ServiceManage;
