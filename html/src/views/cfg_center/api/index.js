import axios from 'axios';
import qs from 'qs';

const path = '/api/cfg_center/';

export default {
  uploadUrl: `/api/cfg_center/upload`, // 上传文件地址
  configUploadUrl: `/api/cfg_center/config/upload`, // 配置文件上传地址

  getChannels () {
    return axios({method: 'post', url: `${path}channel`});
  },
  getPublishTime(type) {
    return axios({method: 'post', url: `${path}publishTime`, data: qs.stringify({business: type})});
  },
  getAds(params) {
    return axios({method: 'post', url: `${path}ad`, data: qs.stringify(params)});
  },
  curdAds(params) {
    return axios({method: 'post', url: `${path}ad/curd`, data: qs.stringify(params, {allowDots: true})});
  },
  publish(params) {
    return axios({method: 'post', url: `${path}ad/publish`, data: qs.stringify(params)});
  },
  batch(params) {
    return axios({method: 'post', url: `${path}ad/batch`, data: qs.stringify(params)});
  },
  getConfigs(params) {
    return axios({method: 'post', url: `${path}config`, data: qs.stringify(params)});
  },
  curdConfig(params) {
    return axios({method: 'post', url: `${path}config/curd`, data: qs.stringify(params)});
  },

  getAccountConfig(params) {
    return axios({method: 'post', url: `${path}accountConfig`, data: qs.stringify(params)});
  },
  curdAccountConfig(params) {
    return axios({method: 'post', url: `${path}accountConfig/curd`, data: qs.stringify(params)});
  },

  getAdGroup(params) {
    return axios({method: 'get', url: `${path}adGroup`, params: params});
  },
  addAdGroup(params) {
    return axios({method: 'post', url: `${path}adGroup`, data: qs.stringify(params)});
  },
  editAdGroup(params) {
    return axios({method: 'put', url: `${path}adGroup`, data: qs.stringify(params)});
  },
  removeAdGroup(params) {
    return axios({method: 'delete', url: `${path}adGroup`, params: params});
  },
  getAdGroupList() {
    return axios({method: 'get', url: `${path}adGroup/list`});
  },

  addAdSite(params) {
    return axios({method: 'post', url: `${path}adsite/add`, data: qs.stringify(params)});
  },
  editAdSite(params) {
    return axios({method: 'post', url: `${path}adsite/edit`, data: qs.stringify(params)});
  },
  editAdSiteStatus(params) {
    return axios({method: 'get', url: `${path}adsite/status`, params: params});
  },
  getAdSiteList(params) {
    return axios({method: 'post', url: `${path}adsite/list`, data: qs.stringify(params)});
  },
  getVersions(params) {
    return axios({method: 'get', url: `${path}versions/list`, params: params});
  },
  addVersions(params) {
    return axios({method: 'post', url: `${path}versions`, data: params});
  },
  editVersions(params) {
    return axios({method: 'put', url: `${path}versions`, data: params});
  },
  getPorfolioDefault(params) {
    return axios({method: 'get', url: `${path}porfoliodefault/list`, params: params});
  },
  addPorfolioDefault(params) {
    return axios({method: 'post', url: `${path}porfoliodefault`, data: qs.stringify(params)});
  },
  editPorfolioDefault(params) {
    return axios({method: 'put', url: `${path}porfoliodefault`, data: qs.stringify(params)});
  },
  getCompany() {
    return axios({method: 'post', url: `${path}company`});
  },
  getVersionsAccountlist(params) {
    return axios({method: 'get', url: `${path}versions/accountlist`, params: params});
  },
};
