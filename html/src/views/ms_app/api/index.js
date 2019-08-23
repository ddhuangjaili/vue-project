import axios from 'axios';

const path = '/api/ms_app/';

export default {
  /**
   * id分组
   * @param params
   * @returns {*}
   */
  getIdGroupList (params) {
    return axios({method: 'get', url: `${path}idGroup`, params: params});
  },
  addIdGroup (params) {
    return axios({method: 'post', url: `${path}idGroup`, data: params});
  },
  editIdGroup (params) {
    return axios({method: 'put', url: `${path}idGroup/${params.id}`, data: params});
  },
  removeIdGroup (id) {
    return axios({method: 'delete', url: `${path}idGroup/${id}`});
  },
  /**
   * 标签
   * @param params
   * @returns {*}
   */
  getTagList (params) {
    return axios({method: 'get', url: `${path}tag`, params: params});
  },
  addTag (params) {
    return axios({method: 'post', url: `${path}tag`, data: params});
  },
  editTag (params) {
    return axios({method: 'put', url: `${path}tag/${params.id}`, data: params});
  },
  removeTag (id) {
    return axios({method: 'delete', url: `${path}tag/${id}`});
  },

  /**
   * 用户
   * @param params
   * @returns {*}
   */
  getUserList (params) {
    return axios({method: 'get', url: `${path}user`, params: params});
  }
};
