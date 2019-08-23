import axios from 'axios';
import qs from 'qs';

const path = '/api/data_center/';
const path_execl = '/api/data_center_execl/';

export default {
  /**
   * 账户列表
   * @param params
   * @returns {AxiosPromise}
   */
  getAccountList(params) {
    return axios({method: 'post', url: `${path}accountExtract/getAccountExtractLabel`, data: qs.stringify(params)});
  },
  /**
   * 营运编码解析
   * @param params
   * @returns {AxiosPromise}
   */
  execlReceive(params) {
    return axios({method: 'post', url: `${path_execl}api/execl2hive/receive`, data: params});
  }
};
