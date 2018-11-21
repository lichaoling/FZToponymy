import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import st from './MPBZ.less';

class MPBZ extends Component {
  render() {
    return (
      <div className={st.MPBZ}>
        <div className={st.content}>MPBZ</div>
      </div>
    );
  }
}

export default MPBZ;
