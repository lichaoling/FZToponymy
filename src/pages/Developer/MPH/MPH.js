import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Icon,
  Select,
  Tooltip,
  Spin,
  notification,
} from 'antd';
import st from './MPH.less';
import MPHForm from '../../../common/Components/Forms/MPHForm';

const FormItem = Form.Item;
const { TextArea } = Input;
const Search = Input.Search;

class MPH extends Component {
  closeEditForm() {}
  onSaveClick() {}
  onCancel() {}
  render() {
    return (
      <div className={st.MPH}>
      <div className={st.Content}>
        <MPHForm isApproval={false} title={"新建住宅小区（楼宇）门牌号申请单"}/>
        </div>
      </div>
    );
  }
}
export default MPH;
