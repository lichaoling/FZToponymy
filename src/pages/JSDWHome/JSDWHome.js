import { Component } from 'react';
import { } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import st from './JSDWHome.less';

class JSDWHome extends Component {
  componentDidMount() {
  
  }
  render() {
    return (
      <div className={st.JSDWHome}>
        Home
      </div>
    );
  }
}

export default JSDWHome;
