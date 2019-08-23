import axios from 'axios';
import qs from 'qs';

const path = '/api/crm_service/admin/';

export default {
 /**
   * 知识库
   * @param params
   * @returns {AxiosPromise}
   */
  getKnowledgeBaseList (params) {
    return axios({method: 'get', url: `${path}knowledgeBase`, params: params});
  },

  getKnowledgeBaseAll () {
    return axios({method: 'get', url: `${path}knowledgeBase/list`});
  },
  /**
   * 分类
   * @param params
   * @returns {*}
   */
  getCategoryList (params) {
    return axios({method: 'get', url: `${path}category`, params: params});
  },
  addCategory (params) {
    return axios({method: 'post', url: `${path}category`, data: params});
  },
  editCategory (params) {
    return axios({method: 'put', url: `${path}category/${params.id}`, data: params});
  },
  removeCategory (id) {
    return axios({method: 'delete', url: `${path}category/${id}`});
  },

  /**
   * 常见问题
   * @returns {*}
   */
  getCommonQCount () {
    return axios({method: 'get', url: `${path}commonQ/count`});
  },
  /**
   * 分类
   * @param params
   * @returns {*}
   */
  getCommonQList (params) {
    return axios({method: 'get', url: `${path}commonQ`, params: params});
  },
  getCommonQ (id) {
    return axios({method: 'get', url: `${path}commonQ/${id}`});
  },
  addCommonQ (params) {
    return axios({method: 'post', url: `${path}commonQ`, data: params});
  },
  editCommonQ (params) {
    return axios({method: 'put', url: `${path}commonQ/${params.id}`, data: params});
  },
  removeCommonQ (id) {
    return axios({method: 'delete', url: `${path}commonQ/${id}`});
  },
  /**
   * 客服分组
   * @param params
   * @returns {*}
   */
  getSeatGroupList (params) {
    return axios({method: 'get', url: `${path}seatGroup`, params: params});
  },
  getSeatGroupListAll (params) {
    return axios({method: 'get', url: `${path}seatGroup/list`, params: params});
  },
  addSeatGroup (params) {
    return axios({method: 'post', url: `${path}seatGroup`, data: params});
  },
  editSeatGroup (params) {
    return axios({method: 'put', url: `${path}seatGroup/${params.id}`, data: params});
  },
  removeSeatGroup (id) {
    return axios({method: 'delete', url: `${path}seatGroup/${id}`});
  },

  /**
   * 客服
   * @param params
   * @returns {*}
   */
  getSeatList (params) {

    return axios({method: 'get', url: `${path}seat`, params: params});
  },
  addSeat (params) {
    return axios({method: 'post', url: `${path}seat`, data: params});
  },
  editSeat (params) {
    return axios({method: 'put', url: `${path}seat/${params.id}`, data: params});
  },
  removeSeat (id) {
    return axios({method: 'delete', url: `${path}seat/${id}`});
  },
  getRoleList (params) {
    return axios({method: 'get', url: `/api/sys_config/role`});
  },
  resetPwd (params) {
    return axios({method: 'post', url: `/api/sys_config/user/resetPwd`, data: qs.stringify(params)});
  },
  /**
   * 标签分类
   * @param params
   * @returns {*}
   */
  getSignTypeList (params) {
    return axios({method: 'get', url: `${path}signType`, params: params});
  },
  getSignTypeListAll (params) {
    return axios({method: 'get', url: `${path}signType/list`, params: params});
  },
  addSignType (params) {
    return axios({method: 'post', url: `${path}signType`, data: params});
  },
  editSignType (params) {
    return axios({method: 'put', url: `${path}signType/${params.id}`, data: params});
  },
  removeSignType (id) {
    return axios({method: 'delete', url: `${path}signType/${id}`});
  },
  /**
   * 标签
   * @param params
   * @returns {*}
   */
  getSignList (params) {
    return axios({method: 'get', url: `${path}sign`, params: params});
  },
  addSign(params) {
    return axios({method: 'post', url: `${path}sign`, data: params});
  },
  editSign (params) {
    return axios({method: 'put', url: `${path}sign/${params.id}`, data: params});
  },
  removeSign (id) {
    return axios({method: 'delete', url: `${path}sign/${id}`});
  },
  /**
   * 策略
   * @param params
   * @returns {*}
   */
  getStrategyList (params) {
    return axios({method: 'get', url: `${path}strategyConfig`, params: params});
  },
  addStrategy(params) {
    return axios({method: 'post', url: `${path}strategyConfig`, data: params});
  },
  editStrategy (params) {
    return axios({method: 'put', url: `${path}strategyConfig/${params.id}`, data: params});
  },
  removeStrategy (id) {
    return axios({method: 'delete', url: `${path}strategyConfig/${id}`});
  },
  enableStrategy (id) {
    return axios({method: 'put', url: `${path}strategyConfig/enable/${id}`});
  },
};
