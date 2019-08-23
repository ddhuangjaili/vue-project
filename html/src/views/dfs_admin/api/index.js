import axios from 'axios';

const path = '/api/dfs_app/admin/';

export default {
  app:{
    list (params) {
      return axios({method: 'get', url: `${path}app`, params: params});
    },
    add (params) {
      return axios({method: 'post', url: `${path}app`, data: params});
    },
    update (params) {
      return axios({method: 'put', url: `${path}app/${params.code}`, data: params});
    },
    updateLimit(code,params){
      return axios({method: 'put', url: `${path}app/${code}/limit`, data: params});
    },
	domainList (params) {
      return axios({method: 'get', url: `${path}app/${params.appCode}/domain`, params: params});
    },
    domainAdd (params) {
      return axios({method: 'post', url: `${path}app/${params.appCode}/domain`, data: params});
    },
    domainUpdate (params) {
      return axios({method: 'put', url: `${path}app/${params.appCode}/domain`, data: params});
    },
	domainDelete (params) {
      return axios({method: 'delete', url: `${path}app/${params.appCode}/domain`, data: params});
    },
	
	 refererList (params) {
      return axios({method: 'get', url: `${path}app/domain/${params.appCode}/referer`, params: params});
    },
    refererAdd (params) {
      return axios({method: 'post', url: `${path}app/domain/${params.appCode}/referer`, data: params});
    },
    refererUpdate (params) {
      return axios({method: 'put', url: `${path}app/domain/${params.appCode}/referer`, data: params});
    },
    refererDelete(params){
      return axios({method: 'delete', url: `${path}app/domain/${params.appCode}/referer`, data: params});
    }
  },
  monitor:{
    fastDFS(){
      return axios({method: 'get', url: `${path}monitor/fastDFS`});
    }
  },
  file:{
    list(params){
      return axios({method: 'get', url: `${path}file`, params: params});
    },
    upload(params){
      let config = {
        headers:{'Content-Type':'multipart/form-data'}
      }
      return axios.post(`${path}file`,params,config);
    },
    delete(ids){
      return axios({method: 'delete', url: `${path}file/`+ids.join(",")});
    }
  },
  company:{
    list(){
      return axios({method: 'get', url: `${path}company`});
    },
    apps(company){
      return axios({method: 'get', url: `${path}company/${company}/apps`});
    }
  }
};
