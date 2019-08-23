const ads  = () => import(/* webpackChunkName: "cfg_center-1.0.5" */ './pages/ads');
const adGroup  = () => import(/* webpackChunkName: "cfg_center-1.0.5" */ './pages/adGroup');
const configs  = () => import(/* webpackChunkName: "cfg_center-1.0.5" */ './pages/configs');
const accountConfig  = () => import(/* webpackChunkName: "cfg_center-1.0.5" */ './pages/accountConfig');
const adsite  = () => import(/* webpackChunkName: "cfg_center-1.0.5" */ './pages/adsite');
const upload  = () => import(/* webpackChunkName: "cfg_center-1.0.5" */ './pages/upload');
const versions  = () => import(/* webpackChunkName: "cfg_center-1.0.5" */ './pages/versions');
const porfolioDefault  = () => import(/* webpackChunkName: "cfg_center-1.0.5" */ './pages/porfolioDefault');
export default [
  {
    path: '/cfg_center/ads',
    component: ads
  },
  {
    path: '/cfg_center/adGroup',
    component: adGroup
  },
  {
    path: '/cfg_center/configs',
    component: configs
  },
  {
    path: '/cfg_center/accountConfig',
    component: accountConfig
  },
  {
    path: '/cfg_center/adsite',
    component: adsite
  },
  {
    path: '/cfg_center/upload',
    component: upload
  },
  {
    path: '/cfg_center/versions',
    component: versions
  },
  {
    path: '/cfg_center/porfolioDefault',
    component: porfolioDefault
  }
]
