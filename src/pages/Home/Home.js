import React, { Component } from 'react';
import { Icon, Input, Tooltip } from 'antd';
import { Link } from 'dva/router';
import st from './Home.less';
import Authorized from '../../utils/Authorized2';
import '../../common/Extends/手风琴/css/style.less';

class Home extends Component {
  constructor(ps) {
    super(ps);
    this.time = moment();
  }

  setTime() {
    this.time = moment();
    let { year, month, date, day, hour, minute } = this.getTime();
    $(this.t1).html(`${hour} : ${minute}`);
    $(this.t2).html(`${year}/${month + 1}/${date}&ensp;周${day}`);
    // this.setState({ time: moment() });
  }

  getTime() {
    let { time } = this;
    let year = time.year(),
      month = time.month(),
      date = time.date(),
      day = time.day(),
      hour = time.hour(),
      minute = time.minute();
    minute = minute < 10 ? '0' + minute : minute;
    switch (day) {
      case 0:
        day = '日';
        break;
      case 1:
        day = '一';
        break;
      case 2:
        day = '二';
        break;
      case 3:
        day = '三';
        break;
      case 4:
        day = '四';
        break;
      case 5:
        day = '五';
        break;
      case 6:
        day = '六';
        break;
      default:
        day = '';
        break;
    }
    return { year, month, date, day, hour, minute };
  }

  getNoneAuth() {
    return (
      <div className={st.noauth}>
        <div>
          <Icon type="exclamation-circle" theme="filled" />
          无访问权限
        </div>
      </div>
    );
  }

  startRefreshTime() {
    this.setTime();
    this.interval = setInterval(this.setTime.bind(this), 1000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  componentDidMount() {
    this.startRefreshTime();

    (function(t, i) {
      var e = {
        id: '#cardArea',
        sid: '.card-item',
      };
      i.fn.cardArea = function(t) {
        var t = i.extend({}, e, t);
        return this.each(function() {
          var e = i(t.id),
            n = e.find(t.sid);
          n.on('mouseenter', function() {
            i(this)
              .addClass('active')
              .siblings()
              .removeClass('active');
          });
        });
      };
    })(window, jQuery);

    $(function() {
      $('#cardArea').cardArea();
    });
  }

  render() {
    return (
      <div className={st.home}>
        <div className={st.bg} />
        <div className={st.content}>
          <div className={st.logo} />
          <div className={st.timeuser}>
            <div className={st.time}>
              <span ref={e => (this.t1 = e)}>{/* {hour} : {minute} */}</span>&emsp;
              <span ref={e => (this.t2 = e)}>{/* {year}/{month + 1}/{date}&ensp;周{day} */}</span>
              &emsp;
              <span className={st.user}>
                <Icon type="user" />
              </span>
            </div>
          </div>
          {/* <div className={st.tel}>
            <span>技术支持：福州市勘测院</span>
            <span>服务热线：0573-12345678</span>
          </div> */}
          <div className={st.panel}>
            <ul id="cardArea" className="card-area clearfix">
              <li className="card-item animated fadeIn">
                <div className="card">
                  <div className="card-title card-title-sp title-even">
                    <div className="content">
                      <div className="zq-product-img">
                        <i className="zq-icon icon40x40 crad-area-icon1" />
                      </div>
                      <h1>地名地址审批管理系统</h1>
                      <p className="short-info">高效规范 标准清晰</p>
                    </div>
                    <div className="contentNew">地名地址审批管理系统</div>
                  </div>
                  <div className="card-content content-first bg-e8e8e8">
                    <ul className="content-first-list">
                      <li>道路、桥梁审批</li>
                      <li>小区、楼宇审批</li>
                      <li>住宅门牌号审批</li>
                      <li>住宅门牌号编制</li>
                    </ul>
                  </div>
                  <div className="card-content content-second">
                    <div className="main-info">
                      <p className="main-head">地名地址审批管理系统</p>
                      <p className="main-tip">
                        对标准地名地址数据库进行长效管理，完成地名命名、更名、销名、证明等业务审批，为公安、规划、住房和城乡建设、国土资源、民政、交通等部门的业务办理提供统一、精确的地址基础数据。
                      </p>
                      <button
                        className="main-btn"
                        onClick={() => {
                          this.props.history.push('/approval');
                        }}
                      >
                        点击进入
                      </button>
                    </div>
                    <ul className="other-info clearfix">
                      <Tooltip title="点击进入道路、桥梁审批">
                        <li className="other-info-list">
                          <a href={'#/approval/dlql'} className="no-effect">
                            <span className="other-head">道路、桥梁审批</span>
                          </a>
                        </li>
                      </Tooltip>
                      <Tooltip title="点击进入小区、楼宇审批">
                        <li className="other-info-list">
                          <a href={'#/approval/xqly'} className="no-effect">
                            <span className="other-head">小区、楼宇审批</span>
                          </a>
                        </li>
                      </Tooltip>
                      <Tooltip title="点击进入住宅门牌号审批">
                        <li className="other-info-list">
                          <a href={'#/approval/mph'} className="no-effect">
                            <span className="other-head">住宅门牌号审批</span>
                          </a>
                        </li>
                      </Tooltip>
                      <Tooltip title="点击进入住宅门牌号编制">
                        <li className="other-info-list">
                          <a href={'#/approval/mpbz'} className="no-effect">
                            <span className="other-head">住宅门牌号编制</span>
                          </a>
                        </li>
                      </Tooltip>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="card-item animated fadeIn">
                <div className="card">
                  <div className="no-prv">
                    <div>
                      <Icon type="exclamation-circle" />
                      无访问权限
                    </div>
                  </div>
                  <div className="card-title card-title-xt title-even">
                    <div className="content">
                      <div className="zq-product-img">
                        <i className="zq-icon icon40x40 crad-area-icon2" />
                      </div>
                      <h1>业务协同更新系统</h1>
                      <p className="short-info">连接互通 简便开放</p>
                    </div>
                    <div className="contentNew">业务协同更新系统</div>
                  </div>
                  <div className="card-content content-first bg-e1e1e1">
                    <ul className="content-first-list">
                      <li>行业数据更新</li>
                      <li>统计分析</li>
                    </ul>
                  </div>

                  <div className="card-content content-second">
                    <div className="main-info">
                      <p className="main-head">业务协同更新系统</p>
                      <p className="main-tip">
                        提高各项业务开展、管理和运营的科学性和可实施性，减少了各委办局业务间衔接矛盾困扰，还可实现标准地址更新联动机制，保证基础地址数据鲜活、完整、详尽和权威，避免地址数据的重复建设与矛盾更新。
                      </p>
                      <button
                        className="main-btn"
                        onClick={() => this.handleUrl('fuzhou_coUpdating')}
                      >
                        点击进入
                      </button>
                    </div>
                    <ul className="other-info clearfix">
                      <Tooltip title="点击进入行业数据更新">
                        <li className="other-info-list">
                          <a href={'/CooperationUpdating/DataRefresh'} className="no-effect">
                            <span className="other-head">行业数据更新</span>
                          </a>
                        </li>
                      </Tooltip>
                      <Tooltip title="点击进入统计分析">
                        <li className="other-info-list">
                          <a href={'/CooperationUpdating/Statistic'} className="no-effect">
                            <span className="other-head">统计分析</span>
                          </a>
                        </li>
                      </Tooltip>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="card-item animated fadeIn">
                <div className="card">
                  <div className="no-prv">
                    <div>
                      <Icon type="exclamation-circle" />
                      无访问权限
                    </div>
                  </div>
                  <div className="card-title card-title-sj title-even">
                    <div className="content">
                      <div className="zq-product-img">
                        <i className="zq-icon icon40x40 crad-area-icon3" />
                      </div>
                      <h1>数据库管理系统</h1>
                      <p className="short-info">海量数据 轻松管理</p>
                    </div>
                    <div className="contentNew">数据库管理系统</div>
                  </div>
                  <div className="card-content content-first bg-e8e8e8">
                    <ul className="content-first-list">
                      <li>道路、桥梁管理</li>
                      <li>小区、楼宇管理</li>
                      <li>门牌号管理</li>
                    </ul>
                  </div>

                  <div className="card-content content-second">
                    <div className="main-info">
                      <p className="main-head">数据库管理系统</p>

                      <p className="main-tip">
                        基于地址元数据实现地址数据从入库、匹配、编辑、审核提交、历史管理的流程化管理，确保地址信息的有效性规范性、现势性和完整性。
                      </p>

                      <button className="main-btn" onClick={() => this.handleUrl('fuzhou_DBM')}>
                        点击进入
                      </button>
                    </div>
                    <ul className="other-info clearfix">
                      <Tooltip title="点击进入道路、桥梁管理">
                        <li className="other-info-list">
                          <a href={'/DatabaseManage/Index?id=0'} className="no-effect">
                            <span className="other-head">道路、桥梁管理</span>
                          </a>
                        </li>
                      </Tooltip>
                      <Tooltip title="点击进入小区、楼宇管理">
                        <li className="other-info-list">
                          <a href={'/DatabaseManage/Index?id=1'} className="no-effect">
                            <span className="other-head">小区、楼宇管理</span>
                          </a>
                        </li>
                      </Tooltip>
                      <Tooltip title="点击进入门牌号管理">
                        <li className="other-info-list">
                          <a href={'/DatabaseManage/Index?id=2'} className="no-effect">
                            <span className="other-head">门牌号管理</span>
                          </a>
                        </li>
                      </Tooltip>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="card-item animated fadeIn">
                <div className="card">
                  {/* <div className="no-prv">
                    <div><Icon type="exclamation-circle" />无访问权限</div>
                  </div> */}
                  <div className="card-title card-title-yyff title-even">
                    <div className="content">
                      <div className="zq-product-img">
                        <i className="zq-icon icon40x40 crad-area-icon4" />
                      </div>
                      <h1>地名地址服务应用</h1>
                      <p className="short-info">标准服务 信息共享</p>
                    </div>
                    <div className="contentNew">地名地址服务应用</div>
                  </div>
                  <div className="card-content content-first bg-e8e8e8">
                    <ul className="content-first-list">
                      <li>服务应用</li>
                    </ul>
                  </div>
                  <div className="card-content content-second">
                    <div className="main-info">
                      <p className="main-head">地名地址服务应用</p>
                      <p className="main-tip">
                        基于地名地址数据，提供权威的、标准化的电子地图、数据接口服务，为各委办局基于地名地址的信息化工作提供基础服务支撑。
                      </p>
                      <button
                        className="main-btn"
                        onClick={() => window.open('#/servicemanage')}
                      >
                        点击进入
                      </button>
                    </div>
                    <ul className="other-info clearfix">
                      <Tooltip title="点击进入服务应用">
                        <li className="other-info-list">
                          <a href={'#/servicemanage/mapservice'} className="no-effect" target="view_window">
                            <span className="other-head">服务应用</span>
                          </a>
                        </li>
                      </Tooltip>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
