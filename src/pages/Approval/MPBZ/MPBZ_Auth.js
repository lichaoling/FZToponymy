import { Component } from 'react';
import router, { Redirect } from 'umi/router';
import Authorized, { RedirectToLogin } from '../../../utils/Authorized4';
import MPBZ from './MPBZ';

class Auth extends Component {
  render() {
    return (
      <Authorized c_id={this.props.route.c_id}>
        <MPBZ {...this.props} />
      </Authorized>
    );
  }
}

export default Auth;