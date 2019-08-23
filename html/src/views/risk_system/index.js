const blacklist = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/risk/blacklist');
const blackAccount = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/risk/blackAccount');
const riskLabel = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/risk/riskLabel');

const policyRules = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/policy/rules');
const policyVariable = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/policy/variable');
const hitRecord = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */  './pages/policy/hitRecord');
const ruleResultDesign = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/policy/ruleResultDesign');
const ruleGroup = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */  './pages/policy/ruleGroup');

const spider = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/assist/spider');

const infoSeek = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/assist/infoSeek');

const channel = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/assist/channel');

const pointBlack = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/assist/pointBlack');

const hitlog = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/risk/blackHitLog');

const gwpm = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/fingerprint/gwpm');
const gwfx = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/fingerprint/gwfx');
const hxpm = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/fingerprint/hxpm');
const hxfx = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/fingerprint/hxfx');
const cf = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/fingerprint/cf');
  
const customerPortrait = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/customer/portrait');

const creditService = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/credit/creditService');
const creditInfo = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/credit/creditInfo');
const creditInfoStat = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/credit/creditInfoStat');
const creditInfoCStat = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/credit/creditInfoCStat');

const businessAccount = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/account');
const businessAccountOne = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/accountOne');
const businessAccountTwo = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/accountTwo');
const businessAccountAdd = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/accountAdd');
const businessNavigation = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/navigation');
const businessNavigationOpen = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/navigationOpen');
const businessAgency = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/agency');
const businessNavigationConfig = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/navigationConfig');
const businessScene = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/business/scene');

const statisticsRule = () =>
  import ( /* webpackChunkName: "risk_system-1.0.2" */ './pages/statistics/rule');

export default [{
    path: '/risk_system/black',
    component: blacklist
  },
  {
    path: '/risk_system/blackAccount',
    component: blackAccount
  },
  {
    path: '/risk_system/label',
    component: riskLabel
  },
  {
    path: '/risk_system/policy/rules',
    component: policyRules
  },
  {
    path: '/risk_system/policy/variable',
    component: policyVariable
  },
  {
    path: '/risk_system/policy/rule_result_design',
    component: ruleResultDesign
  },
  {
    path: '/risk_system/policy/hit_record',
    component: hitRecord
  },
  {
    path: '/risk_system/policy/rule_group',
    component: ruleGroup
  },
  {
    path: '/risk_system/assist_tools/spider',
    component: spider
  },
  {
    path: '/risk_system/black/hitlog',
    component: hitlog
  },
  {
    path: '/risk_system/assist_tools/infoseek',
    component: infoSeek
  },
  {
    path: '/risk_system/assist_tools/channel',
    component: channel
  },
  {
    path: '/risk_system/assist_tools/pointBlack',
    component: pointBlack
  },
  {
    path: '/device_fingerprint/gwpm',
    component: gwpm
  },
  {
    path: '/device_fingerprint/gwfx',
    component: gwfx
  },
  {
    path: '/device_fingerprint/hxpm',
    component: hxpm
  },
  {
    path: '/device_fingerprint/hxfx',
    component: hxfx
  },
  {
    path: '/device_fingerprint/cf',
    component: cf
  },
  {
    path: '/risk_system/customer/portrait',
    component: customerPortrait
  },  
  {
    path: '/risk_system/risk_credit/credit',
    component: creditService
  },
  {
    path: '/risk_system/risk_credit/info',
    component: creditInfo
  },
  {
    path: '/risk_system/risk_credit/stat',
    component: creditInfoStat
  },
  {
    path: '/risk_system/risk_credit/cstat',
    component: creditInfoCStat
  },
  {
    path: '/risk_system/business/account',
    component: businessAccount
  },
  {
    path: '/risk_system/business/accountOne',
    component: businessAccountOne
  },
  {
    path: '/risk_system/business/accountTwo',
    component: businessAccountTwo
  },
  {
    path: '/risk_system/business/accountAdd',
    component: businessAccountAdd
  },
  {
    path: '/risk_system/business/navigationConfig',
    component: businessNavigationConfig
  },
  {
    path: '/risk_system/business/navigation',
    component: businessNavigation
  },
  {
    path: '/risk_system/business/navigationOpen',
    component: businessNavigationOpen
  },
  {
    path: '/risk_system/business/agency',
    component: businessAgency
  },
  {
    path: '/risk_system/business/scene',
    component: businessScene
  },
  {
    path: '/risk_system/statistics/rule',
    component: statisticsRule
  },
]
