const category = () => import(/* webpackChunkName: "crm_service-1.0.4" */ './pages/category');
const knowledgeBase = () => import(/* webpackChunkName: "crm_service-1.0.4" */ './pages/knowledgeBase');
const commonQ = () => import(/* webpackChunkName: "crm_service-1.0.4" */ './pages/commonQ');
const seatGroup = () => import(/* webpackChunkName: "crm_service-1.0.4" */ './pages/seatGroup');
const seat = () => import(/* webpackChunkName: "crm_service-1.0.4" */ './pages/seat');
const signType = () => import(/* webpackChunkName: "crm_service-1.0.4" */ './pages/signType');
const sign = () => import(/* webpackChunkName: "crm_service-1.0.4" */ './pages/sign');
const strategy = () => import(/* webpackChunkName: "crm_service-1.0.4" */ './pages/strategy');
export default [
  {
    path: '/crm_service/category',
    component: category
  },
  {
    path: '/crm_service/knowledgeBase',
    component: knowledgeBase
  },
  {
    path: '/crm_service/commonQ',
    component: commonQ
  },
  {
    path: '/crm_service/seatGroup',
    component: seatGroup
  },
  {
    path: '/crm_service/seat',
    component: seat
  },
  {
    path: '/crm_service/signType',
    component: signType
  },
  {
    path: '/crm_service/sign',
    component: sign
  },
  {
    path: '/crm_service/strategy',
    component: strategy
  }

]
