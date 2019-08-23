import axios from 'axios';

const path = '/api/base_config/';

export default {

  getDict(params) {
    return axios({method: 'post', url: `${path}dict/parentCode/list`, data: params});
  },
  /**
   * 邮件基础配置
   * @param params
   * @returns {AxiosPromise}
   */
  getMailConfList (params) {
    return axios({method: 'get', url: `${path}email/conf/page/list`, params: params});
  },
  saveMailConf (params) {
    return axios({method: 'post', url: `${path}email/conf/save`, data: params});
  },
  removeMailConf (id, params) {
    return axios({method: 'post', url: `${path}email/conf/delete/${id}`, data: params});
  },

  /**
   * 邮件模板配置
   * @param params
   * @returns {AxiosPromise}
   */
  getMailMgrList (params) {
    return axios({method: 'get', url: `${path}email/mgr/page/list`, params: params});
  },
  saveMailMgr (params) {
    return axios({method: 'post', url: `${path}email/mgr/save`, data: params});
  },
  removeMailMgr (id, params) {
    return axios({method: 'post', url: `${path}email/mgr/delete/${id}`, data: params});
  },
  /**
   * 邮件发送记录
   * @param params
   * @returns {AxiosPromise}
   */
  getEmailSendRecordList (params) {
    return axios({method: 'get', url: `${path}email/record/page/list`, params: params});
  },
  /**
   * 导出邮件发送记录
   * @param params
   * @returns {AxiosPromise}
   */
  downloadEmailSendRecordList (params) {
    return axios({method: 'get', url: `${path}email/record/exportExcel`, params: params});
  },

  /**
   * 短信供应方配置
   * @param params
   * @returns {AxiosPromise}
   */
  getSmsSupplierList (params) {
    return axios({method: 'get', url:`${path}sms/supplier/page/list`, params: params});
  },
  saveSmsSupplier (params) {
    return axios({method: 'post', url:`${path}sms/supplier/save`, data: params});
  },
  removeSmsSupplier (id, params) {
    return axios({method: 'post', url:`${path}sms/supplier/delete/${id}`, data: params});
  },

  /**
   * 短信应用方配置
   * @param params
   * @returns {AxiosPromise}
   */
  getSmsConfList (params) {
    return axios({method: 'get', url:`${path}sms/app/page/list`, params: params});
  },
  saveSmsConf (params) {
    return axios({method: 'post', url:`${path}sms/app/save`, data: params});
  },
  removeSmsConf (id, params) {
    return axios({method: 'post', url:`${path}sms/app/delete/${id}`, data: params});
  },
  /**
   * 短信发送记录
   * @param params
   * @returns {AxiosPromise}
   */
  getSmsLogList (params) {
    return axios({method: 'get', url: `${path}sms/log/page/list`, params: params});
  },
  /**
   * 导出短信发送记录
   * @param params
   * @returns {AxiosPromise}
   */
  downloadSmsLogList (params) {
    return axios({method: 'get', url: `${path}sms/log/exportExcel`, params: params});
  },

  /**
   * 短信规则记录
   * @param params
   * @returns {AxiosPromise}
   */
  getSmsRuleList (params) {
    return axios({method: 'get', url: `${path}sms/rule/list`, params: params});
  },
  saveSmsRule(params) {
    return axios({method: 'post', url: `${path}sms/rule/save`, data: params});
  },
  removeSmsRule(id, params) {
    return axios({method: 'post', url: `${path}sms/rule/delete/${id}`, data: params});
  },
  /**
   * 短信规则明细
   * @param params
   * @returns {AxiosPromise}
   */
  getSmsRuleDetailList (params) {
    return axios({method: 'get', url: `${path}sms/rule/detail/getSmsRuleDetail`, params: params});
  },
  saveSmsRuleDetail(params) {
    return axios({method: 'post', url: `${path}sms/rule/detail/save`, data: params});
  },
  removeSmsRuleDetail(id, params) {
    return axios({method: 'post', url: `${path}sms/rule/detail/delete/${id}`, data: params});
  },

  /**
   * 短信模板配置
   * @param params
   * @returns {AxiosPromise}
   */
  getSmsTplList (params) {
    return axios({method: 'get', url: `${path}sms/tpl/page/list`, params: params});
  },
  saveSmsTpl (params) {
    return axios({method: 'post', url: `${path}sms/tpl/save`, data: params});
  },
  removeSmsTpl (id, params) {
    return axios({method: 'post', url: `${path}sms/tpl/delete/${id}`, data: params});
  },

  /**
   * 聚合配置
   * @param params
   * @returns {AxiosPromise}
   */
  getAggregateList (params) {
    return axios({method: 'get', url: `${path}aggregate/conf/page/list`, params: params});
  },
  saveAggregate (params) {
    return axios({method: 'post', url: `${path}aggregate/conf/save`, data: params});
  },
  removeAggregate (id, params) {
    return axios({method: 'post', url: `${path}aggregate/conf/delete/${id}`, data: params});
  },
  updateAggregateOrder (params) {
    return axios({method: 'post', url: `${path}aggregate/conf/order/update`, data: params});
  },
  updateAggregateStatus (params) {
    return axios({method: 'post', url: `${path}aggregate/conf/update/status`, data: params});
  },

  /**
   * 聚合供应商
   * @param params
   * @returns {AxiosPromise}
   */
  getAggregateSupplierList (params) {
    return axios({method: 'get', url: `${path}aggregate/supplier/page/list`, params: params});
  },
  saveAggregateSupplier (params) {
    return axios({method: 'post', url: `${path}aggregate/supplier/save`, data: params});
  },
  removeAggregateSupplier (id, params) {
    return axios({method: 'post', url: `${path}aggregate/supplier/delete/${id}`, data: params});
  },

  /**
   * 文件管理
   * @param params
   * @returns {AxiosPromise}
   */
  getFileMngFileList (params) {
    return axios({method: 'get', url: `${path}file/record/page/list`, params: params});
  },
  removeFileMngFile (id, params) {
    return axios({method: 'post', url: `${path}file/record/delete/${id}`, data: params});
  },

  /**
   * 获取所有聚合供应商
   */
  getSupplierDic (companyId) {
    return axios({method: 'get', url: `${path}aggregate/supplier/getSupplierDic/${companyId}`});
  },
  /**
   * 获取所有短信供应商
   */
  getSmsSupplierDic (companyId) {
    return axios({method: 'get', url: `${path}sms/supplier/getSmsSupplierDic/${companyId}`});
  },
  /**
   * 获取所有短信应用配置
   */
  getSmsAppConfIdDic (companyId) {
    return axios({method: 'get', url: `${path}sms/app/getSmsAppConfIdDic/${companyId}`});
  }
};
