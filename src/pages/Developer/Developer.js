import { Component } from 'react';
import { Icon } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import Link from 'umi/link';
import st from './Developer.less';
import DLQL from './DLQL/DLQL';
import XQLY from './XQLY/XQLY';
import MPH from './MPH/MPH';
import { validateC_ID } from '../../utils/Authorized4';

class Developer extends Component {
  // getRoutes() {
  //   let { routes } = this.props.route;
  //   let cmps = [];
  //   for (let i = 0; i < routes.length - 1; i++) {
  //     let Component = routes[i].component;
  //     if (routes[i].redirect)
  //       cmps.push(<Redirect key={i} exact path={routes[i].path} to={routes[i].redirect} />);
  //     if (routes[i].path && !routes[i].redirect)
  //       cmps.push(
  //         <Route key={i} path={routes[i].path} render={ps => <Component {...routes[i]} />} />
  //       );
  //   }
  //   return cmps;
  // }
  getNavs() {
    let { pathname } = this.props.location;
    let { routes } = this.props.route;
    let navs = [];
    for (let i = 0; i < routes.length; i++) {
      let r = routes[i];
      let v = validateC_ID(r.c_id);
      if (r.path && !r.redirect && v.pass) {
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
    // console.log('developer');
    return (
      <div className={st.Developer}>
        <div className={st.header}>
          <div className={st.logo} />
          <div className={st.jz} />
          <div className={st.user}>
            <Icon type="user" style={{ fontSize: 18 }} />
            &nbsp;你好，开发商
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

export default Developer;
