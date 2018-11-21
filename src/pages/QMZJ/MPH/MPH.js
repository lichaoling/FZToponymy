import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import st from './MPH.less';

class MPH extends Component {
  render() {
    return (
      <div className={st.MPH}>
        <div className={st.content}>MPH</div>
      </div>
    );
  }
}

export default MPH;
