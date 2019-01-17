import { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import Link from 'umi/link';
import DLQL from './DLQL/DLQL';
import MPBZ from './MPBZ/MPBZ';
import MPH from './MPH/MPH';
import st from './Approval.less';
import { GetUser } from '../../services/Login';
import { logout } from '../../utils/login';
import { validateC_ID } from '../../utils/Authorized4';

class Approval extends Component {
  state = {
    user: {},
  };

  getNavs() {
    let { pathname } = this.props.location;
    let { routes } = this.props.route;
    let navs = [];
    for (let i = 0; i < routes.length; i++) {
      let r = routes[i];
      let v = validateC_ID(r.c_id);
      if (r.path && !r.redirect && v.pass)
        navs.push(
          <Link
            key={i}
            to={routes[i].path}
            className={pathname.indexOf(routes[i].path.toLowerCase()) >= 0 ? 'active' : ''}
          >
            {routes[i].name}
          </Link>
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

    this.getUser();
  }

  async getUser() {
    await GetUser({}, d => {
      this.setState({ user: d });
    });
  }
  onClick(e) {
    if (e.key === '3') this.props.history.push('/login');
  }
  render() {
    let { user } = this.state;
    const menu = (
      <Menu onClick={e => this.onClick(e)}>
        <Menu.Item key="1">个人中心</Menu.Item>
        <Menu.Item key="2">账号设置</Menu.Item>
        <Menu.Item
          key="3"
          onClick={e => {
            logout();
          }}
        >
          退出
        </Menu.Item>
      </Menu>
    );
    let { children } = this.props;
    return (
      <div className={st.Approval}>
        <div className={st.header}>
          <div className={st.logo} />
          <div className={st.jz} />

          <div className={st.user}>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                <Icon type="user" style={{ fontSize: 18 }} />
                &nbsp;你好, {user.USERNAME}
              </a>
            </Dropdown>
          </div>
        </div>
        <div ref={e => (this.nave = e)} className={st.nave}>
          <div className={st.nave_ct}>{this.getNavs()}</div>
        </div>
        <div className={st.body}>{children}</div>
      </div>
    );
  }
}

export default Approval;
