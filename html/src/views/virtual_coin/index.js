const chatMsg = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/chatMsg');

const client = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/client');
const clientOld = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/clientOld');
const clientApproval = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/clientApproval');
const tradeRule = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/tradeRule');
const goodsInfo = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/goodsInfo');
const orderManage = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/orderManage');
const orderReport = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/orderReport');
const currencyReport = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/currencyReport');
const tokens = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/tokens');
const currency = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/currency');
const publishCur = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/publishCur');
const clientGroup = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/clientGroup');
const notice = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/notice');
const accListReport = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/accListReport');
const orderDetailReport = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/orderDetailReport');
const amountDetailReport = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/amountDetailReport');
const smsInfo = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/smsInfo');
const chargedProposal = () => import(/* webpackChunkName: "virtual_coin-1.0.0" */'./pages/chargedProposal');

export default [
  {
    path: '/virtual_coin/chatMsg',
    component: chatMsg
  },
  {
    path: '/virtual_coin/client',
    component: client
  },
  {
    path: '/virtual_coin/client_old',
    component: clientOld
  },
  {
    path: '/virtual_coin/clientApproval',
    component: clientApproval
  },
  {
    path: '/virtual_coin/tradeRule',
    component: tradeRule
  },
  {
    path: '/virtual_coin/goodsInfo',
    component: goodsInfo
  },
  {
    path: '/virtual_coin/orderManage',
    component: orderManage
  },
  {
    path: '/virtual_coin/orderReport',
    component: orderReport
  },
  {
    path: '/virtual_coin/currencyReport',
    component: currencyReport
  },
  {
    path: '/virtual_coin/tokens',
    component: tokens
  },
  {
    path: '/virtual_coin/currency',
    component: currency
  },
  {
    path: '/virtual_coin/publishCur',
    component: publishCur
  },
  {
    path: '/virtual_coin/chargedProposal',
    component: chargedProposal
  },
  {
    path: '/virtual_coin/clientGroup',
    component: clientGroup
  },
  {
    path: '/virtual_coin/notice',
    component: notice
  },
  {
    path: '/virtual_coin/accListReport',
    component: accListReport
  },
  {
    path: '/virtual_coin/orderDetailReport',
    component: orderDetailReport
  },
  {
    path: '/virtual_coin/amountDetailReport',
    component: amountDetailReport
  },
  {
    path: '/virtual_coin/smsInfo',
    component: smsInfo
  }
]
