const mailConf  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/mail/conf');
const mailMgr  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/mail/mgr');
const mailRecord  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/mail/record');

const smsSupplier  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/sms/supplier');
const smsConf  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/sms/conf');
const smsLog  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/sms/log');
const smsRule  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/sms/rule');
const smsTpl  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/sms/tpl');

const aggregateConf  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/aggregate/conf');
const aggregateSupplier  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/aggregate/supplier');

const fileMngFileList  = () => import(/* webpackChunkName: "base_config-1.0.4" */ './pages/fileMng/fileList');
export default [
  {
    path: '/base_config/mail/conf',
    component: mailConf
  },
  {
    path: '/base_config/mail/mgr',
    component: mailMgr
  },
  {
    path: '/base_config/mail/record',
    component: mailRecord
  },
  {
    path: '/base_config/sms/supplier',
    component: smsSupplier
  },
  {
    path: '/base_config/sms/conf',
    component: smsConf
  },
  {
    path: '/base_config/sms/log',
    component: smsLog
  },
  {
    path: '/base_config/sms/rule',
    component: smsRule
  },
  {
    path: '/base_config/sms/tpl',
    component: smsTpl
  },
  {
    path: '/base_config/aggregate/conf',
    component: aggregateConf
  },
  {
    path: '/base_config/aggregate/supplier',
    component: aggregateSupplier
  },
  {
    path: '/base_config/fileMng/fileList',
    component: fileMngFileList
  }
]

