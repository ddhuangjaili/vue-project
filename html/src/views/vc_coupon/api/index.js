import axios from 'axios';
import qs from 'qs';

const path = '/api/vc_coupon/admin/';
const filePath = '/api/virtual_coin_file/';

export default {

  // 上传文件地址
  configUploadUrl: filePath,
  getFormatPath(uri) {
    return path+uri;
  },
   /**
   * 客户信息
   * @param params
   * @returns {AxiosPromise}
   */
  getClientList (params) {
    return axios({method: 'get', url: this.getFormatPath('client'), params: params});
  },
  getAuthCodeList () {
    return axios({method: 'get', url: this.getFormatPath('client/authCodeList')});
  },
  saveClient (params) {
    return axios({method: 'post', url: this.getFormatPath('client/save'), data: qs.stringify(params)});
  },
  getClientCPList (params) {
    return axios({method: 'get', url: this.getFormatPath('client/cpList'), params: params});
  },
  editClient (params) {
    return axios({method: 'post', url: this.getFormatPath('client/updateBaseInfo'), data: qs.stringify(params)});
  },
  getClientByMobileNo(mobileNo) {
    return axios({method: 'get', url: this.getFormatPath(`client/findClientInfoByMobileNo/${mobileNo}`)});
  },
  setAcAuth(params) {
    return axios({method: 'post', url: this.getFormatPath('client/setAcAuth'), data: qs.stringify(params)});
  },
  updateClientStatus(params) {
    return axios({method: 'post', url: this.getFormatPath('client/updateClientStatus'), data: qs.stringify(params)});
  },
  updateAcStatus(params) {
    return axios({method: 'post', url: this.getFormatPath('client/updateAcStatus'), data: qs.stringify(params)});
  },
  updateAcFlag(params) {
    return axios({method: 'post', url: this.getFormatPath('client/updateAcFlag'), data: qs.stringify(params)});
  },
  openAccount(params) {
    return axios({method: 'post', url: this.getFormatPath('client/account'), data: qs.stringify(params)});
  },
  updateClientGroup(params) {
    return axios({method: 'post', url: this.getFormatPath('client/updateGroup'), data: qs.stringify(params)});
  },
  setTradeInit(params) {
    return axios({method: 'post', url: this.getFormatPath('client/setTradeInit'), data: qs.stringify(params)});
  },
  registerAccount(params) {
    return axios({method: 'post', url: this.getFormatPath('client/openAccount'), data: qs.stringify(params)});
  },

  /**
   * 获取上传文件的参数信息
   * @returns {AxiosPromise}
   */
  getUploadFileConfig (params) {
    return axios({method: 'post', url: this.getFormatPath('client/afile_params'), data: qs.stringify(params)});
  },

  /**
   * 获取账户身份认证情况
   * @param params
   * @returns {AxiosPromise}
   */
  getAccountFileList(params) {
    return axios({method: 'get', url: `${filePath}list`, params: params});
  },
  /**
   * 账号信息
   * @param params
   * @returns {AxiosPromise}
   */
  getAccountList (params) {
    return axios({method: 'get', url: this.getFormatPath('account'), params: params});
  },
  addAccount (params) {
    return axios({method: 'post', url: this.getFormatPath('account'), data: qs.stringify(params)});
  },
  editAccount (params) {
    return axios({method: 'put', url: this.getFormatPath(`account/${params.id}`), data: qs.stringify(params)});
  },
  deleteAccount (id) {
    return axios({method: 'delete', url: this.getFormatPath(`account/${id}`)});
  },

  /**
   * 交易规则
   * @param params
   * @returns {AxiosPromise}
   */
  getTradeRuleList (params) {
    return axios({method: 'get', url: this.getFormatPath('rule'), params: params});
  },
  addTradeRule (params) {
    return axios({method: 'post', url: this.getFormatPath('rule'), data: qs.stringify(params)});
  },
  editTradeRule (params) {
    return axios({method: 'put', url: this.getFormatPath(`rule/${params.id}`), data: qs.stringify(params)});
  },
  deleteTradeRule (id) {
    return axios({method: 'delete', url: this.getFormatPath(`rule/${id}`)});
  },
  deleteTradeRules (id) {
    return axios({method: 'delete', url: this.getFormatPath(`rule/deleteByIds/${id}`)});
  },

  /**
   * 广告信息
   * @param params
   * @returns {AxiosPromise}
   */
  getGoodsInfoList (params) {
    return axios({method: 'get', url: this.getFormatPath('goods'), params: params});
  },
  addGoodsInfo (params) {
    return axios({method: 'post', url: this.getFormatPath('goods'), data: qs.stringify(params)});
  },
  editGoodsInfo (params) {
    return axios({method: 'put', url: this.getFormatPath(`goods/${params.id}`), data: qs.stringify(params)});
  },
  deleteGoodsInfo (id) {
    return axios({method: 'delete', url: this.getFormatPath(`goods/${id}`)});
  },

  /**
   * 订单管理
   * @param params
   * @returns {AxiosPromise}
   */
  getOrderManageList (params) {
    return axios({method: 'get', url: this.getFormatPath('order'), params: params});
  },
  getOrderOp (params) {
    return axios({method: 'get', url: this.getFormatPath('getOrderOp'), params: params});
  },
  orderApprove (params) {
    return axios({method: 'post', url: this.getFormatPath('order/approve'), data: qs.stringify(params)});
  },
  orderCancel (params) {
    return axios({method: 'post', url: this.getFormatPath('order/cancel'), data: qs.stringify(params)});
  },
  orderCancelAppeal (params) {
    return axios({method: 'post', url: this.getFormatPath('order/cancelAppeal'), data: qs.stringify(params)});
  },

  getOrderReportList (params) {
    return axios({method: 'get', url: this.getFormatPath('orderOp'), params: params});
  },
  getCurrencyReportList (params) {
    return axios({method: 'get', url: this.getFormatPath('amounts'), params: params});
  },
  addAmounts (params) {
    return axios({method: 'post', url: this.getFormatPath('amounts'), data: qs.stringify(params)});
  },

  getTokenList (params) {
    return axios({method: 'get', url: this.getFormatPath('tokens'), params: params});
  },
  findByToken (token) {
    return axios({method: 'get', url: this.getFormatPath(`tokens/${token}`)});
  },
  cancelToken (params) {
    return axios({method: 'post', url: this.getFormatPath('tokens/cancelToken'), data: qs.stringify(params)});
  },

  /**
   * 币种
   * @param params
   * @returns {AxiosPromise}
   */
  getCurrencyList (params) {
    return axios({method: 'get', url: this.getFormatPath('currency'), params: params});
  },
  addCurrency (params) {
    return axios({method: 'post', url: this.getFormatPath('currency'), data: qs.stringify(params)});
  },
  editCurrency (params) {
    return axios({method: 'put', url: this.getFormatPath(`currency/${params.id}`), data: qs.stringify(params)});
  },
  deleteCurrency (id) {
    return axios({method: 'delete', url: this.getFormatPath(`currency/${id}`)});
  },
  deleteCurrencies (id) {
    return axios({method: 'delete', url: this.getFormatPath(`currency/deleteByIds/${id}`)});
  },

  /**
   * 通过标识查询列表
   * @param flag
   * @returns {AxiosPromise}
   */
  getClientAccounts (flag) {
    return axios({method: 'get', url: this.getFormatPath(`client/account/${flag}`)});
  },

  /**
   * 发币
   * @param params
   * @returns {AxiosPromise}
   */
  getPublishCurList (params) {
    return axios({method: 'get', url: this.getFormatPath('publishCur'), params: params});
  },
  addPublishCur (params) {
    return axios({method: 'post', url: this.getFormatPath('publishCur'), data: qs.stringify(params)});
  },
  editPublishCur (params) {
    return axios({method: 'put', url: this.getFormatPath(`publishCur/${params.id}`), data: qs.stringify(params)});
  },
  deletePublishCur (id) {
    return axios({method: 'delete', url: this.getFormatPath(`publishCur/${id}`)});
  },
  deletePublishCurs (id) {
    return axios({method: 'delete', url: this.getFormatPath(`publishCur/deleteByIds/${id}`)});
  },

  /**
   * 组别
   * @param params
   * @returns {AxiosPromise}
   */
  getClientGroupList (params) {
    return axios({method: 'get', url: this.getFormatPath('clientGroup'), params: params});
  },
  addClientGroup (params) {
    return axios({method: 'post', url: this.getFormatPath('clientGroup'), data: qs.stringify(params)});
  },
  editClientGroup (params) {
    return axios({method: 'put', url: this.getFormatPath(`clientGroup/${params.id}`), data: qs.stringify(params)});
  },
  deleteClientGroup (id) {
    return axios({method: 'delete', url: this.getFormatPath(`clientGroup/${id}`)});
  },

  /**
   * 公告
   * @param params
   * @returns {AxiosPromise}
   */
  getNoticeList (params) {
    return axios({method: 'get', url: this.getFormatPath('notice'), params: params});
  },
  addNotice (params) {
    return axios({method: 'post', url: this.getFormatPath('notice'), data: qs.stringify(params)});
  },
  editNotice (params) {
    return axios({method: 'put', url: this.getFormatPath(`notice/${params.id}`), data: qs.stringify(params)});
  },
  deleteNotice (id) {
    return axios({method: 'delete', url: this.getFormatPath(`notice/${id}`)});
  },

  /**
   * 统计报表
   * @param params
   * @returns {AxiosPromise}
   */
  getAccLsit (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/acc/list'), params: params});
  },

  getAvglist (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/acc/avglist'), params: params});
  },

  getAccOrderRank (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/acc/rank'), params: params});
  },

  getOrderStatus (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/order/status'), params: params});
  },

  getOrderPrice (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/order/price'), params: params});
  },

  getOrderDod (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/order/dod'), params: params});
  },

  getOrderWeek (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/order/week'), params: params});
  },

  getAmountClientGroupNums (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/amount/clientgroup/nums'), params: params});
  },

  getAmountClientGroupAmounts (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/amount/clientgroup/amounts'), params: params});
  },

  getAmountType (params) {
    return axios({method: 'get', url: this.getFormatPath('reports/amount/type'), params: params});
  },

  /**
   * 代用券发布
   * @param params
   * @returns {AxiosPromise}
   */
  getPublishCouponList (params) {
    return axios({method: 'get', url: this.getFormatPath('publishCoupon'), params: params});
  },
  /*addPublishCoupon (params) {
    return axios({method: 'post', url: this.getFormatPath('publishCur'), data: qs.stringify(params)});
  },
  editPublishCoupon (params) {
    return axios({method: 'put', url: this.getFormatPath(`publishCur/${params.id}`), data: qs.stringify(params)});
  },*/
  deletePublishCoupon (id) {
    return axios({method: 'delete', url: this.getFormatPath(`publishCoupon/${id}`)});
  },
  deletePublishCoupons (id) {
    return axios({method: 'delete', url: this.getFormatPath(`publishCoupon/deleteByIds/${id}`)});
  },
};
