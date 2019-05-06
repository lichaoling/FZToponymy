import router from 'umi/router';
import { getCurrentUser, getUser } from './utils/login';
import './global.less';
import React, { Component } from 'react';
import { Icon } from 'antd';

class Loading extends Component {
  render() {
    return (
      <span>
        <Icon type="loading" />
        &ensp;正在验证...
      </span>
    );
  }
}

function showLoading() {
  let $loading = $('<div class="g-loading"></div>');
  ReactDOM.render(<Loading />, $loading[0]);
  $loading.appendTo($('body'));
}

function removeLoading() {
  $('.g-loading').remove();
}

export async function render(oldRender) {
  showLoading();
  await getCurrentUser();
  removeLoading();
  oldRender();
}
