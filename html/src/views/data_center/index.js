const userAccount = () => import(/* webpackChunkName: "data_center-1.0.2" */ './pages/user/account');
const operationCode = () => import(/* webpackChunkName: "data_center-1.0.2" */ './pages/user/operation');
export default [
  {
    path: '/data_center/user/account',
    component: userAccount
  },
  {
    path: '/data_center/operation',
    component: operationCode
  }
]
