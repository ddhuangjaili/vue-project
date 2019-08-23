const alertApp  = () => import(/* webpackChunkName: "monitor_alarm-1.0.4" */ './pages/monitor/alertApp');
const alertMode  = () => import(/* webpackChunkName: "monitor_alarm-1.0.4" */ './pages/monitor/alertMode');
const alertPeople  = () => import(/* webpackChunkName: "monitor_alarm-1.0.4" */ './pages/monitor/alertPeople');
const alertIndividual  = () => import(/* webpackChunkName: "monitor_alarm-1.0.4" */ './pages/monitor/alertIndividual');
const alertStatistic  = () => import(/* webpackChunkName: "monitor_alarm-1.0.4" */ './pages/monitor/alertStatistic');

export default [
  {
    path: '/monitor_alarm/monitor/alertStatistic',
    component: alertStatistic
  },
  {
    path: '/monitor_alarm/monitor/alertApp',
    component: alertApp
  },
  {
    path: '/monitor_alarm/monitor/alertMode',
    component: alertMode
  },
  {
    path: '/monitor_alarm/monitor/alertPeople',
    component: alertPeople
  },
  {
    path: '/monitor_alarm/monitor/alertIndividual',
    component: alertIndividual
  }
]

