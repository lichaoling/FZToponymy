import { Login, Logout, GetUser } from '../services/Login';

let user = null;

let getPrivileges = role => {
  switch (role) {
    case '区民政局':
      return qmzjPrivileges;
    case '市民政局':
      return smzjPrivileges;
    case '市政府':
      return szfPrivileges;
    case 'admin':
      return adminPrivileges;
    default:
      return {};
  }
};

let adminPrivileges = {
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
  collaborativeupdating: {
    edit: true,
    pass: true,
  },
  'collaborativeupdating.dataimport': {
    edit: true,
    pass: true,
  },
  'collaborativeupdating.statistic': {
    edit: true,
    pass: true,
  },
  // databasemanage: {
  //   edit: true,
  //   pass: true,
  // },
  servicemanage: {
    edit: true,
    pass: true,
  },
  'servicemanage.mapservice': {
    edit: true,
    pass: true,
  },
};

let qmzjPrivileges = {
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
    edit: false,
    pass: false,
  },
  'approval.mph': {
    edit: true,
    pass: true,
  },
  'approval.mpbz': {
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

let smzjPrivileges = {
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
  servicemanage: {
    edit: true,
    pass: true,
  },
  'servicemanage.mapservice': {
    edit: true,
    pass: true,
  },
};

let szfPrivileges = {
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
      if (user) user.privileges = getPrivileges(user.RoleNames[0]);
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
      if (user) user.privileges = getPrivileges(user.RoleNames[0]);
      console.log(e);
      sf(e);
    },
    ef
  );
}

function logout(f) {
  user = null;
  Logout(e => {
    if (f) {
      f();
    } else {
      window.location.reload();
    }
  });
}

export { getUser, login, logout, getCurrentUser };
