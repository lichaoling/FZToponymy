import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export function getDistricts(data) {
  let getSub = p => {
    let obj = {
      label: p.Name,
      value: p.ID,
      disabled: !(p.UserIn === undefined ? true : p.UserIn),
    };
    if (p.SubDistrict) {
      obj.children = p.SubDistrict.map(getSub);
    }
    return obj;
  };
  return data.length ? [getSub(data[0])] : [];
  // return data.length ? data[0].SubDistrict.map(getSub) : [];
}

export function getUserDistricts(data) {
  let getSub = p => {
    let obj = {
      label: p.Name,
      value: p.ID,
      disabled: !p.UserIn,
    };
    if (p.SubDistrict) {
      obj.children = p.SubDistrict.map(getSub);
    }
    return obj;
  };
  return data.length ? [getSub(data[0])] : [];
  // return data.length ? data[0].SubDistrict.map(getSub) : [];
}

export function getDistrictsWithJX(data) {
  let getSub = p => {
    let obj = {
      label: p.Name,
      value: p.ID,
    };
    if (p.SubDistrict) {
      obj.children = p.SubDistrict.map(getSub);
    }
    return obj;
  };

  return data.length ? [getSub(data[0])] : [];
}
export function getDistrictsTreeWithJX(data) {
  let getSub = p => {
    let obj = {
      title: p.Name,
      key: p.ID,
    };
    if (p.SubDistrict) {
      obj.children = p.SubDistrict.map(getSub);
    }
    return obj;
  };

  return data.length ? [getSub(data[0])] : [];
}

export function getDistricts2(data) {
  let getSub = p => {
    let obj = {
      label: p.Name,
      value: p.ID,
    };
    if (p.SubDistrict && p.ID.split('.').length < 3) {
      obj.children = p.SubDistrict.map(getSub);
    }
    return obj;
  };

  return data.map(getSub);
}
export function findStrIndex(str, cha, num) {
  var x = str.indexOf(cha);
  for (var i = 0; i < num; i++) {
    x = str.indexOf(cha, x + 1);
  }
  return x;
}
export function ConverStrToAyyary(str, cha) {
  let distValue = [];
  let distArray = str.split(cha);
  for (let i = 0; i < distArray.length - 1; i++) {
    distValue.push(
      str
        .substr(0, findStrIndex(str, cha, i))
        .split(cha)
        .join('.')
    );
  }
  distValue.push(str.split(cha).join('.'));
  return distValue;
}

export function getStandardAddress(entity, type) {
  if (entity && type) {
    let ept = '',
      obj = entity;
    switch (type) {
      case 'ResidenceMP':
        return `嘉兴市${obj.CountyName || ept}${obj.NeighborhoodsName || ept}${obj.CommunityName ||
          ept}${obj.ResidenceName || ept}${
          obj.MPNumber ? obj.MPNumber + '号' : ept
        }${obj.Dormitory || ept}${obj.LZNumber ? obj.LZNumber + '幢' : ept}${
          obj.DYNumber ? obj.DYNumber + '单元' : ept
        }${obj.HSNumber ? obj.HSNumber + '室' : ept}`;
      case 'RoadMP':
        return `嘉兴市${obj.CountyName || ept}${obj.NeighborhoodsName || ept}${obj.RoadName ||
          ept}${obj.MPNumber ? obj.MPNumber + '号' : ept}`;
      case 'CountryMP':
        return `嘉兴市${obj.CountyName || ept}${obj.NeighborhoodsName || ept}${obj.CommunityName ||
          ept}${obj.ViligeName || ept}${obj.MPNumber ? obj.MPNumber + '号' : ept}${
          obj.HSNumber ? obj.HSNumber + '室' : ept
        }`;
      default:
        return null;
    }
  }
  return null;
}

export function getCommunityStandardAddress(entity, type) {
  if (entity && type) {
    let ept = '',
      obj = entity;
    switch (type) {
      case 'ResidenceMP':
        return `${obj.CommunityName || ept}${obj.ResidenceName || ept}${
          obj.MPNumber ? obj.MPNumber + '号' : ept
        }${obj.Dormitory || ept}${obj.LZNumber ? obj.LZNumber + '幢' : ept}${
          obj.DYNumber ? obj.DYNumber + '单元' : ept
        }${obj.HSNumber ? obj.HSNumber + '室' : ept}`;
      case 'CountryMP':
        return `${obj.CommunityName || ept}${obj.ViligeName || ept}${
          obj.MPNumber ? obj.MPNumber + '号' : ept
        }${obj.HSNumber ? obj.HSNumber + '室' : ept}`;
      default:
        return null;
    }
  }
  return null;
}
