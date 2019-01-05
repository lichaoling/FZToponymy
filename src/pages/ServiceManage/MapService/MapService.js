import { Component } from 'react';
import st from './MapService.less';
import Map from '../../../common/Components/Maps/Map';
import { Input, Divider } from 'antd';
const Search = Input.Search;

class MapService extends Component {
  state = {
    inputValue: false,
  };
  initCard0(e) {
    this.closeCard();
    if (e.target.value) $(this.card0).css({ display: 'block' });
    let bool = e.target.value ? true : false;
    this.setState({ inputValue: bool });
  }
  initCard1(e) {
    this.closeCard();
    if (e.target.value) $(this.card1).css({ display: 'block' });
    let bool = e.target.value ? true : false;
    this.setState({ inputValue: bool });
  }
  closeCard() {
    $(this.card0).css({ display: 'none' });
    $(this.card1).css({ display: 'none' });
  }
  clearInput() {
    this.setState({ inputValue: false });
    this.closeCard();
    this.input.input.value = null;
  }
  render() {
    return (
      <div className={st.MapService}>
        <div className={st.MapContainer}>
          <Map />
        </div>
        <div className={st.LeftPanel}>
          <div className={st.searchbox}>
            <div className={st.searchbox_container}>
              <div className={st.searchbox_content}>
                <Input
                  ref={e => (this.input = e)}
                  placeholder="搜索标准地名、地址"
                  className={st.searchbox_content_common}
                  onChange={this.initCard0.bind(this)}
                  onPressEnter={this.initCard1.bind(this)}
                />
                {this.state.inputValue ? (
                  <div className={st.input_clear} onClick={e => this.clearInput()} />
                ) : null}
              </div>
            </div>
            <button data-title="搜索" />
          </div>
          <div className={st.card0} ref={e => (this.card0 = e)}>
            <div className={st.card0_list}>
              <span className="iconfont icon-chaxun" />
              <span className={st.ct}>111</span>
            </div>
            <div className={st.card0_list}>
              <span className="iconfont icon-chaxun" />
              <span className={st.ct}>222</span>
            </div>
          </div>
          <div className={st.card1} ref={e => (this.card1 = e)}>
            <div className={st.list}>
              <span className={st.marker} />
              <div className={st.ct}>
                <div className={st.name}>明珠苑</div>
                <div className={st.address}>浙江省嘉兴市海盐县海兴东路21-2</div>
              </div>
            </div>
            <Divider className={st.divide} />
            <div className={st.list}>
              <span className={st.marker} />
              <div className={st.ct}>
                <div className={st.name}>当代华府</div>
                <div className={st.address}>嘉兴市南湖区云东路290号</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MapService;
