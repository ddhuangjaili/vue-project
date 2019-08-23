const app = () => import(/* webpackChunkName: "dfs_admin-1.0.0" */'./pages/app');
const file = () => import(/* webpackChunkName: "dfs_admin-1.0.0" */'./pages/file');
const monitorFastDFS = () => import(/* webpackChunkName: "dfs_admin-1.0.0" */'./pages/monitor/fastDFS');

export default [
  {
    path: '/dfs_admin/app',
    component: app
  },
  {
    path: '/dfs_admin/file',
    component: file
  },
  {
    path: '/dfs_admin/monitor/fastDFS',
    component: monitorFastDFS
  }
]
