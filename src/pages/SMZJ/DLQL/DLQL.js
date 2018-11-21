import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import st from './DLQL.less';

class DLQL extends Component {
  render() {
    return (
      <div className={st.DLQL}>
        <div className={st.content}>sstDLQL</div>
      </div>
    );
  }
}

export default DLQL;
