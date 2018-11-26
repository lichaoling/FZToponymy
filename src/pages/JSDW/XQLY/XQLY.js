import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import XQLYForm from '../Forms/XQLYForm';
import st from './XQLY.less';

class XQLY extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className={st.XQLY}>
        <XQLYForm />
      </div>
    );
  }
}
export default XQLY;
