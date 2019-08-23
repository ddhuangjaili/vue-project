const tag = () => import(/* webpackChunkName: "ms_app-1.0.0" */ './pages/tag');
const user = () => import(/* webpackChunkName: "ms_app-1.0.0" */ './pages/user');
const idGroup = () => import(/* webpackChunkName: "ms_app-1.0.0" */ './pages/idGroup');
export default [
  {
    path: '/ms_app/tag',
    component: tag
  },
  {
    path: '/ms_app/user',
    component: user
  },
  {
    path: '/ms_app/idGroup',
    component: idGroup
  }
]
