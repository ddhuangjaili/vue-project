const chatMsg = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/chatMsg');

const client = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/client');
const clientApproval = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/clientApproval');
const tradeRule = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/tradeRule');
const goodsInfo = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/goodsInfo');
const orderManage = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/orderManage');
const orderReport = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/orderReport');
const currencyReport = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/currencyReport');
const tokens = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/tokens');
const currency = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/currency');
const publishCur = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/publishCur');
const clientGroup = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/clientGroup');
const notice = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/notice');
const accListReport = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/accListReport');
const orderDetailReport = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/orderDetailReport');
const amountDetailReport = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/amountDetailReport');
const smsInfo = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/smsInfo');
const chargedProposal = () => import(/* webpackChunkName: "vc_gz-1.0.0" */'./pages/chargedProposal');

export default [
  {
    path: '/vc_gz/chatMsg',
    component: chatMsg
  },
  {
    path: '/vc_gz/client',
    component: client
  },
  {
    path: '/vc_gz/clientApproval',
    component: clientApproval
  },
  {
    path: '/vc_gz/tradeRule',
    component: tradeRule
  },
  {
    path: '/vc_gz/goodsInfo',
    component: goodsInfo
  },
  {
    path: '/vc_gz/orderManage',
    component: orderManage
  },
  {
    path: '/vc_gz/orderReport',
    component: orderReport
  },
  {
    path: '/vc_gz/currencyReport',
    component: currencyReport
  },
  {
    path: '/vc_gz/tokens',
    component: tokens
  },
  {
    path: '/vc_gz/currency',
    component: currency
  },
  {
    path: '/vc_gz/publishCur',
    component: publishCur
  },
  {
    path: '/vc_gz/chargedProposal',
    component: chargedProposal
  },
  {
    path: '/vc_gz/clientGroup',
    component: clientGroup
  },
  {
    path: '/vc_gz/notice',
    component: notice
  },
  {
    path: '/vc_gz/accListReport',
    component: accListReport
  },
  {
    path: '/vc_gz/orderDetailReport',
    component: orderDetailReport
  },
  {
    path: '/vc_gz/amountDetailReport',
    component: amountDetailReport
  },
  {
    path: '/vc_gz/smsInfo',
    component: smsInfo
  }
]
