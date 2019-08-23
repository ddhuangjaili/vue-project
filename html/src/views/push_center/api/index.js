import axios from 'axios';

const path = '/api/push_center/';
const baseServicePath = '/api/base_config/';

export default {
    /**
     * 获取指定角色的用户列表
     * @param roleCode
     * @returns {AxiosPromise}
     */
    getUsers(roleCode) {
        return axios({ method: 'get', url: `/api/sys_config/role/${roleCode}/users` });
    },
    getUsersBySource({ roleCode, id }) {
        return axios({ method: 'get', url: `/api/sys_config/user/source/${id}`, params: { roleCode } });
    },

    getDictList(params) {
        return axios({ method: 'get', url: `${path}fieldDict/list`, params: params });
    },
    updateDict(params) {
        return axios({ method: 'post', url: `${path}fieldDict/updateField`, data: params });
    },

    /**
     * 推送内容
     * @param params
     * @returns {*}
     */
    getContentList(params) {
        return axios({ method: 'get', url: `${path}pushInfor/list`, params: params });
    },
    addContentList(params) {
        return axios({ method: 'post', url: `${path}pushInfor/list`, data: params });
    },
    addContent(params) {
        return axios({ method: 'post', url: `${path}pushInfor/add`, data: params });
    },
    editContent(params) {
        return axios({ method: 'post', url: `${path}pushInfor/update`, data: params });
    },
    removeContent(params) {
        return axios({ method: 'post', url: `${path}pushInfor/delete`, data: params });
    },
    batchDelete(params) {
        return axios({ method: 'post', url: `${path}pushInfor/batchDelete`, data: params });
    },
    sendEmail(params) {
        return axios({ method: 'post', url: `${path}notice/send`, data: params });
    },
    batchSetApproval(params) {
        return axios({ method: 'post', url: `${path}pushInfor/batchSetApproval`, data: params });
    },
    executeApproval(params) {
        return axios({ method: 'post', url: `${path}pushInfor/batchExecute`, data: params });
    },
    getFileNameByFilePath(params) {
        return axios({ method: 'get', url: `/api/base_config/file/record/page/list`, params: params });
    }
};