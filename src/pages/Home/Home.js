import { Component } from 'react';
import { } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import st from './Home.less';

class Home extends Component {
  componentDidMount() {
  
  }
  render() {
    return (
      <div className={st.Home}>
        Home
      </div>
    );
  }
}

export default Home;
