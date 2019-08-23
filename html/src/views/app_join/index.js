const appTopicMng = () => import(/* webpackChunkName: "app_join-1.0.0" */ './pages/topicMng');
const appUserGroup = () => import(/* webpackChunkName: "app_join-1.0.0" */ './pages/userGroup');
const appUserMng = () => import(/* webpackChunkName: "app_join-1.0.0" */ './pages/userMng');
const appGlobalMng = () => import(/* webpackChunkName: "app_join-1.0.0" */ './pages/globalMng');
const platformGroupMng = () =>  import (/* webpackChunkName: "app_join-1.0.0" */ './pages/platformGroupMng');
const platformMng = () =>  import (/* webpackChunkName: "app_join-1.0.0" */ './pages/platformMng');
const messagesMng = () =>  import (/* webpackChunkName: "app_join-1.0.0" */ './pages/messagesMng');
const onlineMng = () =>  import (/* webpackChunkName: "app_join-1.0.0" */ './pages/onlineMng');
const statMessage = () =>  import (/* webpackChunkName: "app_join-1.0.0" */ './pages/stat/message');
const statOnline = () =>  import (/* webpackChunkName: "app_join-1.0.0" */ './pages/stat/online');
export default [
  {
    path: '/app_join/platformGroupMng',
    component: platformGroupMng
  },
  {
    path: '/app_join/platformMng',
    component: platformMng
  },
  {
    path: '/app_join/messagesMng',
    component: messagesMng
  },
  {
    path: '/app_join/onlineMng',
    component: onlineMng
  },
  {
    path: '/app_join/topicMng',
    component: appTopicMng
  },
  {
    path: '/app_join/userGroup',
    component: appUserGroup
  },
  {
    path: '/app_join/userMng',
    component: appUserMng
  },
  {
    path: '/app_join/globalMng',
    component: appGlobalMng
  },
  {
    path: '/app_join/stat/message',
    component: statMessage
  },
  {
    path: '/app_join/stat/online',
    component: statOnline
  }
]
