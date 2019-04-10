import { Component } from 'react';
import { Button } from 'antd';
import st from './DLQLForm.less';

class DLQLForm extends Component {
  render() {
    return (
      <div className={st.DLQLForm}>
        <div className={st.header}>道路、桥梁名称核准、命名（更名）申请单</div>
        <div className={st.body}>
          <div className={st.group}>
            <div className={st.groupheader}>基本信息</div>
            <div className={st.groupbody}>groupbody </div>
          </div>
        </div>
        <div className={st.footer}>
          <Button type="primary">保存</Button>
          &ensp;
          <Button>取消</Button>
        </div>
      </div>
    );
  }
}

export default DLQLForm;
