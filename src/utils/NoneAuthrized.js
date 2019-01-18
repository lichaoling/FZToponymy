import { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import st from './NoneAuthrized.less';

class NoneAuthrized extends Component {
  render() {
    return (
      <div className={st.NoneAuthrized}>
        <div className={st.content}>
          您当前无权查看该内容！
          <br />
          请检查您的登录状态和访问权限！
          <div className={st.btns}>
            <Button
              type="primary"
              onClick={e => {
                router.goBack();
              }}
            >
              返回上一页
            </Button>
            &emsp;
            <Button
              type="primary"
              onClick={e => {
                router.push('/login');
              }}
            >
              好的，去登录
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default NoneAuthrized;
