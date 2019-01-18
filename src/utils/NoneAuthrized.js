import { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import st from './NoneAuthrized.less';

class NoneAuthrized extends Component {
  state = {
    waitTime: 10,
  };

  componentWillUnmount() {
    if (this.handle) {
      clearInterval(this.handle);
    }
  }

  componentDidMount() {
    let t = this.state.waitTime;

    this.handle = setInterval(e => {
      t--;
      this.setState({ waitTime: t });
      if (t === 0) {
        clearTimeout(this.handle);
        router.push('/login');
      }
    }, 1000);
  }

  render() {
    let { waitTime } = this.state;
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
                clearInterval(this.handle);
                this.handle = null;
                router.goBack();
              }}
            >
              返回上一页
            </Button>
            &emsp;
            <Button
              type="primary"
              onClick={e => {
                clearInterval(this.handle);
                this.handle = null;
                router.push('/login');
              }}
            >
              好的，马上登录（&ensp;{waitTime}&ensp;s&ensp;）
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default NoneAuthrized;
