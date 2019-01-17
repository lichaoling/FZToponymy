import { Component } from 'react';
import router, { Redirect } from 'umi/router';
import Authorized, { RedirectToLogin } from '../../../utils/Authorized4';
import XQLY from './XQLY';

class Auth extends Component {
  render() {
    return (
      <Authorized c_id={this.props.route.c_id}>
        <XQLY {...this.props} />
      </Authorized>
    );
  }
}

export default Auth;