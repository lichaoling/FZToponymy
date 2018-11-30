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
import MPHForm from '../Forms/MPHForm';

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
        <MPHForm />
      </div>
    );
  }
}
export default MPH;
