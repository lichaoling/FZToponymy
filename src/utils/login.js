import { Login, Logout, GetUser } from '../services/Login';

let user = null;
let privileges = {
  home: {
    edit: true,
    pass: true,
  },
  approval: {
    edit: true,
    pass: true,
  },
  'approval.dlql': {
    edit: true,
    pass: true,
  },
  'approval.xqly': {
    edit: true,
    pass: true,
  },
  'approval.mph': {
    edit: true,
    pass: true,
  },
  'approval.mpbz': {
    edit: true,
    pass: true,
  },
  developer: {
    edit: true,
    pass: true,
  },
  'developer.home': {
    edit: true,
    pass: true,
  },
  'developer.dlql': {
    edit: true,
    pass: true,
  },
  'developer.xqly': {
    edit: true,
    pass: true,
  },
  'developer.mph': {
    edit: true,
    pass: true,
  },
  servicemanage: {
    edit: true,
    pass: true,
  },
  'servicemanage.mapservice': {
    edit: true,
    pass: true,
  },
};

// 异步获取当前session中是否存在用户
async function getCurrentUser() {
  if (!user) {
    let rt = await GetUser();
    if (rt && rt.data) {
      user = rt.data.Data;
      if (user) user.privileges = privileges;
    }
  }
  return user;
}

// 获取内存中的用户
function getUser() {
  return user;
}

// 登录
function login(userName, password, sf, ef) {
  Login(
    { userName, password },
    e => {
      user = e;
      if (user) user.privileges = privileges;
      console.log(e);
      sf(e);
    },
    ef
  );
}

function logout() {
  user = null;
  Logout(e => {
    window.location.reload();
  });
}

export { getUser, login, logout, getCurrentUser };
