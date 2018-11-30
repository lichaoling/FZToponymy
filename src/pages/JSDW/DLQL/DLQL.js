import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Icon,
  Cascader,
  Select,
  Tooltip,
  Spin,
  notification,
} from 'antd';
import st from './DLQL.less';
import DLQLForm from '../Forms/DLQLForm';

const FormItem = Form.Item;
const { TextArea } = Input;

class DLQL extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className={st.DLQL}>
        <DLQLForm />
      </div>
    );
  }
}
export default DLQL;
