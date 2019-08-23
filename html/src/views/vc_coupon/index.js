
const client = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/client');
const clientOld = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/clientOld');
const clientApproval = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/clientApproval');
const tradeRule = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/tradeRule');
const goodsInfo = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/goodsInfo');
const orderManage = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/orderManage');
const orderReport = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/orderReport');
const currencyReport = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/currencyReport');
const tokens = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/tokens');
const currency = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/currency');
const publishCur = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/publishCur');
const clientGroup = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/clientGroup');
const notice = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/notice');
const accListReport = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/accListReport');
const orderDetailReport = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/orderDetailReport');
const amountDetailReport = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/amountDetailReport');
const publishCoupon = () => import(/* webpackChunkName: "vc_coupon-1.0.0" */'./pages/publishCoupon');

export default [
  {
    path: '/vc_coupon/client',
    component: client
  },
  {
    path: '/vc_coupon/client_old',
    component: clientOld
  },
  {
    path: '/vc_coupon/clientApproval',
    component: clientApproval
  },
  {
    path: '/vc_coupon/tradeRule',
    component: tradeRule
  },
  {
    path: '/vc_coupon/goodsInfo',
    component: goodsInfo
  },
  {
    path: '/vc_coupon/orderManage',
    component: orderManage
  },
  {
    path: '/vc_coupon/orderReport',
    component: orderReport
  },
  {
    path: '/vc_coupon/currencyReport',
    component: currencyReport
  },
  {
    path: '/vc_coupon/tokens',
    component: tokens
  },
  {
    path: '/vc_coupon/currency',
    component: currency
  },
  {
    path: '/vc_coupon/publishCur',
    component: publishCur
  },
  {
    path: '/vc_coupon/clientGroup',
    component: clientGroup
  },
  {
    path: '/vc_coupon/notice',
    component: notice
  },
  {
    path: '/vc_coupon/accListReport',
    component: accListReport
  },
  {
    path: '/vc_coupon/orderDetailReport',
    component: orderDetailReport
  },
  {
    path: '/vc_coupon/amountDetailReport',
    component: amountDetailReport
  },
  {
    path: '/vc_coupon/publishCoupon',
    component: publishCoupon
  }
]
