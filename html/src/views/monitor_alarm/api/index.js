import axios from 'axios';

const path = '/api/monitor_alarm';

export default {

  getDict(params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/dict/parentCode/list`, data: params});
  },
  /**
   * 监控告警应用配置
   * @param params
   * @returns {AxiosPromise}
   */
  getAlertAppList (params) {
    return axios({method: 'get', url: `${path}/monitorAlarm/alertApp/page/list`, params: params});
  },
  saveAlertApp (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertApp/save`, data: params});
  },
  updateAlertApp (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertApp/update`, data: params});
  },
  removeAlertApp (id, params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertApp/delete/${id}`, data: params});
  },
  /**
   * 监控告警方式配置
   * @param params
   * @returns {AxiosPromise}
   */
  getAlertModeList (params) {
    return axios({method: 'get', url: `${path}/monitorAlarm/alertMode/page/list`, params: params});
  },
  saveAlertMode (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertMode/save`, data: params});
  },
  updateAlertMode (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertMode/update`, data: params});
  },
  removeAlertMode (id, params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertMode/delete/${id}`, data: params});
  },
  /**
   * 监控告警人员配置
   * @param params
   * @returns {AxiosPromise}
   */
  getAlertPeopleList (params) {
    return axios({method: 'get', url: `${path}/monitorAlarm/alertPeople/page/list`, params: params});
  },
  saveAlertPeople (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertPeople/save`, data: params});
  },
  updateAlertPeople (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertPeople/update`, data: params});
  },
  removeAlertPeople (id, params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertPeople/delete/${id}`, data: params});
  },

  /**
   * 监控告警人员配置
   * @param params
   * @returns {AxiosPromise}
   */
  getAlertIndividualList (params) {
    return axios({method: 'get', url: `${path}/monitorAlarm/alertIndividual/page/list`, params: params});
  },
  saveAlertIndividual (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertIndividual/save`, data: params});
  },
  updateAlertIndividual (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertIndividual/update`, data: params});
  },
  removeAlertIndividual (id, params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/alertIndividual/delete/${id}`, data: params});
  },

  /**
   * 自定义告警API验证
   * @param params
   * @returns {AxiosPromise}
   */
  verifyApi (params) {
    return axios({method: 'post', url: `${path}/monitorAlarm/apiVerify/auth`, data: params});
  },
  /**
   * 告警API统计图表
   * @param params
   * @returns {AxiosPromise}
   */
  queryStatisticsChart (params) {
    return axios({method: 'get', url: `${path}/monitorAlarm/alertStatistic/queryStatisticsChart`, data: params});
  }
};
