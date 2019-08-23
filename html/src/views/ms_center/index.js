const appList = () => import(/* webpackChunkName: "ms_center-1.0.0" */ './pages/appList');
const topicList = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/topicList');
const userList = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/userList');
const tagMng = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/tagMng');
const platformGroup = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/platformGroup');
const platform = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/platform');
const messages = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/messages');
const online = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/online');

const messageStat = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/stat/message');
const onlineStat = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/stat/online');

const adminApps = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/apps');
const adminChannels = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/channels');
const adminPlatformGroup = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/platformGroup');
const adminPlatform = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/platform');
const adminTag = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/tag');
const adminTopic = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/topic');
const adminUser = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/user');

const adminMessageStat = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/messageStat');
const adminOnlineStat = () =>  import (/* webpackChunkName: "ms_center-1.0.0" */ './pages/admin/onlineStat');
export default [
  {
    path: '/ms_center/appList',
    component: appList
  },
  {
    path: '/ms_center/topicList',
    component: topicList
  },
  {
    path: '/ms_center/userList',
    component: userList
  },
  {
    path: '/ms_center/tagMng',
    component: tagMng
  },
  {
    path: '/ms_center/platformGroup',
    component: platformGroup
  },
  {
    path: '/ms_center/platform',
    component: platform
  },
  {
    path: '/ms_center/messages',
    component: messages
  },
  {
    path: '/ms_center/online',
    component: online
  },
  {
    path: '/ms_center/stat/message',
    component: messageStat
  },
  {
    path: '/ms_center/stat/online',
    component: onlineStat
  },

  {
    path: '/ms_center/admin/apps',
    component: adminApps
  },
  {
    path: '/ms_center/admin/channels',
    component: adminChannels
  },
  {
    path: '/ms_center/admin/platformGroup',
    component: adminPlatformGroup
  },
  {
    path: '/ms_center/admin/platform',
    component: adminPlatform
  },
  {
    path: '/ms_center/admin/tag',
    component: adminTag
  },
  {
    path: '/ms_center/admin/topic',
    component: adminTopic
  },
  {
    path: '/ms_center/admin/user',
    component: adminUser
  },
  {
    path: '/ms_center/admin/messageStat',
    component: adminMessageStat
  },
  {
    path: '/ms_center/admin/onlineStat',
    component: adminOnlineStat
  }
]
