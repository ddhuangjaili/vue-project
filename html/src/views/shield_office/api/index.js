import axios from 'axios';
import qs from 'qs';

const path = '/api/shield_office/';
export default {

    getBlackList(params) {
        return axios({ method: 'get', url: `${path}shield/office/black`, params: params });
    },
    approveBlack(params) {
        return axios({ method: 'post', url: `${path}shield/office/black/approve`, data: qs.stringify(params) });
    },

    getRoleList(params) {
        return axios({ method: 'get', url: `${path}shield/office/role`, params: params });
    },

    getUserList(params) {
        return axios({ method: 'get', url: `${path}shield/office/user`, params: params });
    },
    editUser(params) {
        return axios({ method: 'put', url: `${path}shield/office/user/${params.id}`, data: qs.stringify(params) });
    },
    approveUser(params) {
        return axios({ method: 'post', url: `${path}shield/office/user/approve`, data: qs.stringify(params) });
    },

    getForgetPwdList(params) {
        return axios({ method: 'get', url: `${path}shield/office/user/forgetPwdList`, params: params });
    },
    approveForgetPwd(params) {
        return axios({ method: 'post', url: `${path}shield/office/user/forgetPwdApprove`, data: qs.stringify(params) });
    },

    uploadBlackList(params) {
        return axios({ method: 'post', url: `${path}shield/office/black/upload`, data: qs.stringify(params) });
    },
    getUploadedBlackList(params) {
        return axios({ method: 'get', url: `${path}shield/office/black/query_upload`, params: params });
    },

    exportBlackList(params) {
        return axios({ method: 'get', url: `${path}shield/office/black/download`, params: params });
    },
    downloadBlackList(params) {
        return axios({ method: 'get', url: `${path}shield/office/black/download_action`, params: params });
    },
    qaueryExportBlackListTask(params) {
        return axios({ method: 'get', url: `${path}shield/office/black/query_download`, params: params });
    }
};