import axios from 'axios';

const path = '/api/app_scret/';

export default {

  /**
   * 应用
   * @param params
   * @returns {*}
   */
  getAppScretList (params) {
    return axios({method: 'get', url: `${path}appScret`, params: params});
  },
  addAppScret (params) {
    return axios({method: 'post', url: `${path}appScret`, data: params});
  },
  editAppScret (params) {
    return axios({method: 'put', url: `${path}appScret/${params.id}`, data: params});
  },
  removeAppScret (id) {
    return axios({method: 'delete', url: `${path}appScret/${id}`});
  },
  /**
   * serviceURI
   * @param params
   * @returns {*}
   */
  getServiceURIList (params) {
    return axios({method: 'get', url: `${path}serviceURI`, params: params});
  },
  getServiceURIByType (params) {
    return axios({method: 'get', url: `${path}serviceURI/getUri`, params: params});
  },
  addServiceURI (params) {
    return axios({method: 'post', url: `${path}serviceURI`, data: params});
  },
  editServiceURI (params) {
    return axios({method: 'put', url: `${path}serviceURI/${params.id}`, data: params});
  },
  removeServiceURI (id) {
    return axios({method: 'delete', url: `${path}serviceURI/${id}`});
  }
};
