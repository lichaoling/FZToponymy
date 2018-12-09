import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import XQLYForm from '../../../common/Components/Forms/XQLYForm';
import st from './XQLY.less';

class XQLY extends Component {
  componentDidMount() { }
  render() {
    return (
      <div className={st.XQLY}>
        <div className={st.Content}>
          <XQLYForm isApproval={false} title={"住宅小区、楼宇名称命名（更名）申报表"}/>
        </div>
      </div>
    );
  }
}
export default XQLY;
