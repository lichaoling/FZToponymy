import { Component } from 'react';
import router, { Redirect } from 'umi/router';
import Authorized, { RedirectToLogin } from '../../utils/Authorized4';
import Home from './Home';

class Home_Auth extends Component {
  render() {
    return (
      <Authorized c_id={this.props.route.c_id} >
        <Home {...this.props} />
      </Authorized>
    );
  }
}

export default Home_Auth;