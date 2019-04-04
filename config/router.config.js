export default [
  //建设单位
  {
    c_id: 'developer',
    path: '/developer',
    component: './Developer/Developer',
    name: '建设单位',
    routes: [
      { path: '/developer', redirect: '/developer/home' },
      {
        c_id: 'developer.home',
        path: '/developer/home',
        component: './DeveloperHome/DeveloperHome',
        name: '主页',
      },
      {
        c_id: 'developer.dlql',
        path: '/developer/dlql',
        name: '道路、桥梁命名申请',
        component: './Developer/DLQL/DLQL',
      },
      {
        c_id: 'developer.xqly',
        path: '/developer/xqly',
        name: '小区、楼宇命名申请',
        component: './Developer/XQLY/XQLY',
      },
      {
        c_id: 'developer.mph',
        path: '/developer/mph',
        name: '门牌号申请',
        component: './Developer/MPH/MPH',
      },
    ],
  },

  //登录
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: './Login/Login',
    name: '用户登录',
  },
  //经办人主页
  {
    c_id: 'home',
    path: '/home',
    component: './Home/Home_Auth',
    name: '用户主页',
  },
  //地名地址审批管理系统
  {
    c_id: 'approval',
    path: '/approval',
    component: './Approval/Approval_Auth',
    name: '地名地址审批管理系统',
    routes: [
      { path: '/approval', redirect: '/approval/dlql' },
      { c_id: 'home', path: '/home', name: '主页', component: './Home/Home_Auth' },
      {
        c_id: 'approval.dlql',
        path: '/approval/dlql',
        name: '道路、桥梁命名审批',
        component: './Approval/DLQL/DLQL_Auth',
      },
      {
        c_id: 'approval.xqly',
        path: '/approval/xqly',
        name: '小区、楼宇命名审批',
        component: './Approval/XQLY/XQLY_Auth',
      },
      {
        c_id: 'approval.mph',
        path: '/approval/mph',
        name: '门牌号审批',
        component: './Approval/MPH/MPH_Auth',
      },
      {
        c_id: 'approval.mpbz',
        path: '/approval/mpbz',
        name: '门牌号编制',
        component: './Approval/MPBZ/MPBZ_Auth',
      },
    ],
  },
  //协同更新
  {
    c_id: 'collaborativeupdating',
    path: '/collaborativeupdating',
    component: './CollaborativeUpdating/CollaborativeUpdating_Auth',
    name: '业务协同更新系统',
    routes: [
      { path: '/collaborativeupdating', redirect: '/collaborativeupdating/dataimport' },
      { c_id: 'home', path: '/home', name: '主页', component: './Home/Home_Auth' },
      {
        c_id: 'collaborativeupdating.dataimport',
        path: '/collaborativeupdating/dataimport',
        name: '地址数据入库',
        component: './CollaborativeUpdating/DataImport/DataImport_Auth',
      },
      {
        c_id: 'collaborativeupdating.statistic',
        path: '/collaborativeupdating/statistic',
        name: '协同更新统计',
        component: './CollaborativeUpdating/Statistic/Statistic_Auth',
      },
    ],
  },
  //地名地址服务应用系统
  {
    c_id: 'servicemanage',
    path: '/servicemanage',
    component: './ServiceManage/ServiceManage',
    name: '地名地址服务应用系统',
    routes: [
      { path: '/servicemanage', redirect: '/servicemanage/mapservice' },
      { c_id: 'home', path: '/home', name: '主页', component: './Home/Home_Auth' },
      {
        c_id: 'servicemanage.mapservice',
        path: '/servicemanage/mapservice',
        name: '地图管理',
        component: './ServiceManage/MapService/MapService_Auth',
      },
    ],
  },
  //数据库管理
  {
    c_id: 'databasemanage',
    path: '/databasemanage',
    component: './DatabaseManage/DatabaseManage',
    name: '地名地址服务应用系统',
    routes: [
      { path: '/databasemanage', redirect: '/databasemanage/dl' },
      { c_id: 'home', path: '/home', name: '主页', component: './Home/Home_Auth' },
      {
        c_id: 'databasemanage.dl',
        path: '/databasemanage/dl',
        name: '道路管理',
        component: './DatabaseManage/DL/Index_Auth',
      },
      {
        c_id: 'databasemanage.ql',
        path: '/databasemanage/ql',
        name: '桥梁管理',
        component: './DatabaseManage/QL/Index_Auth',
      },
      {
        c_id: 'databasemanage.yl',
        path: '/databasemanage/yl',
        name: '院落管理',
        component: './DatabaseManage/YL/Index_Auth',
      },
      {
        c_id: 'databasemanage.poi',
        path: '/databasemanage/poi',
        name: 'POI管理',
        component: './DatabaseManage/POI/Index_Auth',
      },
    ],
  },
  /*
  // test
  {
    path: '/test',
    component: './Test/Test',
    name: 'test',
    routes: [
      // { path: '/test', redirect: '/test/t0' },
      { path: '/test/t0', name: 'hehe', component: './Test/T0' },
      { path: '/test/t1', component: './Test/T1' },
    ],
  },
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      // { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },*/
  {
    component: '404',
  },
];
