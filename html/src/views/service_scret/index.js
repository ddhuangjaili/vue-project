const appScret = () => import(/* webpackChunkName: "service_scret-1.0.1" */ './pages/appScret');
const uriMng = () => import(/* webpackChunkName: "service_scret-1.0.1" */ './pages/uriMng');
export default [
  {
    path: '/service_scret/appScret',
    component: appScret
  },{
    path: '/service_scret/uriMng',
    component: uriMng
  }
]
