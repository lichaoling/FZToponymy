import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import st from './XQLY.less';

class XQLY extends Component {
  render() {
    console.log(this.props);

    return (
      <div className={st.XQLY}>
        <div className={st.content}>XQLY</div>
      </div>
    );
  }
}

export default XQLY;
