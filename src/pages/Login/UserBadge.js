import { Component } from 'react';
import { Icon, Menu, Popover } from 'antd';
import router from 'umi/router';
import './UserBadge.less';

import { getUser, logout } from '../../utils/login';

class UserBadge extends Component {
  static defaultProps = {
    style: 'normal',
  };

  constructor(ps) {
    super(ps);
    this.user = getUser() || {};
  }

  render() {
    let { style } = this.props;

    return (
      <Popover
        overlayClassName="UserBadgePopover"
        placement="bottom"
        content={
          <div className="UserBadgePanel">
            <div>
              <Icon type="user" />
              &ensp;个人中心
            </div>
            <div
              onClick={e =>
                logout(e => {
                  router.push('/login');
                })
              }
            >
              <Icon type="logout" />
              &ensp;退出登录
            </div>
          </div>
        }
      >
        <div className={`UserBadge ${style}`}>
          <div className="usericon">
            <Icon type="user" />
          </div>
          <div className="username">{this.user.UserName || '未登录'}</div>
        </div>
      </Popover>
    );
  }
}

export default UserBadge;
