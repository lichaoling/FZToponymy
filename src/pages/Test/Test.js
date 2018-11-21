import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Test0 from './T0';
import Test1 from './T1';

let cmps = [
  { path: '/test/t0', name: '测试0', component: Test0 },
  { path: '/test/t1', component: Test1 },
];

class Test extends Component {
  getRoutes() {
    let tt = cmps.map((i, idx) => {
      return <Route key={idx} path={i.path} data={i} render={ps => <i.component {...i} />} />;
    });
    return tt;
  }

  getRoutes1() {
    let { routes } = this.props.route;
    let cmps = [];
    for (let i = 0; i < routes.length - 1; i++) {
      let Component = routes[i].component;
      cmps.push(
        <Route key={i} path={routes[i].path} render={ps => <Component {...routes[i]} />} />
      );
    }
    return cmps;
  }

  render() {
    console.log(this.props);

    return (
      <div>
        Test
        {this.getRoutes()}
      </div>
    );
  }
}

export default Test;
