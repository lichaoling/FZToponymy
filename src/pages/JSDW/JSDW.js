import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Link from 'umi/link';
import st from './JSDW.less';
import DLQL from './DLQL/DLQL';
import XQLY from './XQLY/XQLY';
import MPH from './MPH/MPH';

class JSDW extends Component {
  getRoutes() {
    let { routes } = this.props.route;
    let cmps = [];
    for (let i = 0; i < routes.length - 1; i++) {
      let Component = routes[i].component;
      if (routes[i].redirect)
        cmps.push(<Redirect key={i} exact path={routes[i].path} to={routes[i].redirect} />);
      if (routes[i].path && !routes[i].redirect)
        cmps.push(
          <Route key={i} path={routes[i].path} render={ps => <Component {...routes[i]} />} />
        );
    }
    return cmps;
  }
  getNavs() {
    let { pathname } = this.props.location;
    let { routes } = this.props.route;
    let navs = [];
    for (let i = 0; i < routes.length - 1; i++) {
      if (routes[i].path && !routes[i].redirect)
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
  }
  render() {
    console.log(this.props);
    return (
      <div className={st.JSDW}>
        <div className={st.header}>
          <div className={st.logo} />
          <div className={st.jz} />
          <div className={st.user}>你好，开发商</div>
        </div>
        <div ref={e => (this.nave = e)} className={st.nave}>
          <div className={st.nave_ct}>{this.getNavs()}</div>
        </div>
        <div className={st.body}>{this.getRoutes()}</div>
      </div>
    );
  }
}

export default JSDW;
