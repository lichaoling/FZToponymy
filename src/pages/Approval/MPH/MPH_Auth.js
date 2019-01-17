import { Component } from 'react';
import router, { Redirect } from 'umi/router';
import Authorized, { RedirectToLogin } from '../../../utils/Authorized4';
import MPH from './MPH';

class Auth extends Component {
  render() {
    return (
      <Authorized c_id={this.props.route.c_id}>
        <MPH {...this.props} />
      </Authorized>
    );
  }
}

export default Auth;