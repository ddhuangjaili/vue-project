import axios from 'axios';

const path = '/api/ms_center/';

export default {

  /**
   * 应用
   * @param params
   * @returns {*}
   */
  getAppList (params) {
    return axios({method: 'get', url: `${path}app`, params: params});
  },
  addApp (params) {
    return axios({method: 'post', url: `${path}app`, data: params});
  },
  editApp (params) {
    return axios({method: 'put', url: `${path}app/${params.code}`, data: params});
  },
  deleteApp (code) {
    return axios({method: 'delete', url: `${path}app/${code}`});
  },

  /**
   * 平台分组
   * @param appCode
   * @param params
   * @returns {AxiosPromise}
   */
  getPlatformGroupList (appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/platformGroup`, params: params});
  },
  addPlatformGroup (appCode, params) {
    return axios({method: 'post', url: `${path}app/${appCode}/platformGroup`, data: params});
  },
  editPlatformGroup (appCode, params) {
    return axios({method: 'put', url: `${path}app/${appCode}/platformGroup/${params.code}`, data: params});
  },
  removePlatformGroup (appCode, code) {
    return axios({method: 'delete', url: `${path}app/${appCode}/platformGroup/${code}`});
  },

  /**
   * 平台
   * @param appCode
   * @param params
   * @returns {AxiosPromise}
   */
  getPlatformList (appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/platform`, params: params});
  },
  addPlatform (appCode, params) {
    return axios({method: 'post', url: `${path}app/${appCode}/platform`, data: params});
  },
  editPlatform (appCode, params) {
    return axios({method: 'put', url: `${path}app/${appCode}/platform/${params.code}`, data: params});
  },
  removePlatform (appCode, code) {
    return axios({method: 'delete', url: `${path}app/${appCode}/platform/${code}`});
  },
  /**
   * 频道
   * @param appCode
   * @param params
   * @returns {*}
   */
  getTopicList (appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/topic`, params: params});
  },
  addTopic (appCode, params) {
    return axios({method: 'post', url: `${path}app/${appCode}/topic`, data: params});
  },
  removeTopic (appCode, code) {
    return axios({method: 'delete', url: `${path}app/${appCode}/topic/${code}`});
  },
  editTopic (appCode, params) {
    return axios({method: 'put', url: `${path}app/${appCode}/topic/${params.code}`, data: params});
  },
  disableTopic (appCode, topicCode, disable) {
    return axios({method: 'put', url: `${path}app/${appCode}/topic/${topicCode}/disable/${disable}`});
  },
  getTopicUsers (appCode, topicCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/topic/${topicCode}/user`, params: params});
  },
  editTopicUser (appCode, topicCode, uid) {
    return axios({method: 'put', url: `${path}app/${appCode}/topic/${topicCode}/user/${uid}`});
  },
  removeTopicUser (appCode, topicCode, uid) {
    return axios({method: 'delete', url: `${path}app/${appCode}/topic/${topicCode}/user/${uid}`});
  },
  getTopicPublishUsers (appCode, topicCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/topic/${topicCode}/limits/publish/users`, params: params});
  },
  editTopicPublishUser (appCode, topicCode, uid) {
    return axios({method: 'put', url: `${path}app/${appCode}/topic/${topicCode}/limits/publish/user/${uid}`});
  },
  removeTopicPublishUser (appCode, topicCode, uid) {
    return axios({method: 'delete', url: `${path}app/${appCode}/topic/${topicCode}/limits/publish/user/${uid}`});
  },
  getTopicSubscribeUsers (appCode, topicCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/topic/${topicCode}/limits/subscribe/users`, params: params});
  },
  editTopicSubscribeUser (appCode, topicCode, uid) {
    return axios({method: 'put', url: `${path}app/${appCode}/topic/${topicCode}/limits/subscribe/user/${uid}`});
  },
  removeTopicSubscribeUser (appCode, topicCode, uid) {
    return axios({method: 'delete', url: `${path}app/${appCode}/topic/${topicCode}/limits/subscribe/user/${uid}`});
  },
  /**
   * 用户
   * @param appCode
   * @param params
   * @returns {*}
   */
  getUserList (appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/user`, params: params});
  },
  disableUser(appCode, uid, disable) {
    return axios({method: 'put', url: `${path}app/${appCode}/user/${uid}/disable/${disable}`});
  },
  limitUser(appCode, uid, params) {
    return axios({method: 'put', url: `${path}app/${appCode}/user/${uid}/limits/speech`, data: params});
  },
  /**
   * 标签
   * @param appCode
   * @param params
   * @returns {*}
   */
  getTagList (appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/tag`, params: params});
  },
  addTag (appCode, params) {
    return axios({method: 'post', url: `${path}app/${appCode}/tag`, data: params});
  },
  removeTag (appCode, tagId) {
    return axios({method: 'delete', url: `${path}app/${appCode}/tag/${tagId}`});
  },
  getTagUserList (appCode, tagId,  params) {
    return axios({method: 'get', url: `${path}app/${appCode}/tag/${tagId}/user`, params: params});
  },
  editTagUser (appCode, tagId,  uid) {
    return axios({method: 'put', url: `${path}app/${appCode}/tag/${tagId}/user/${uid}`});
  },
  removeTagUser (appCode, tagId,  uid) {
    return axios({method: 'delete', url: `${path}app/${appCode}/tag/${tagId}/user/${uid}`});
  },

  /**
   * 消息
   * @param appCode
   * @param params
   * @returns {*}
   */
  getMessageList (appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/message`, params: params});
  },
  removeMessage (appCode, msgId) {
    return axios({method: 'delete', url: `${path}app/${appCode}/message/${msgId}`});
  },

  /**
   * 在线列表
   * @param appCode
   * @param params
   * @returns {*}
   */
  getListOnline (appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/online/list`, params: params});
  },
  getPlatformOnline (appCode, platformCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/platform/${platformCode}/online/list`, params: params});
  },
  getTopicOnline (appCode, topicCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/topic/${topicCode}/online/list`, params: params});
  },
  joinTopic (appCode, uid, topics) {
    return axios({method: 'post', url: `${path}app/${appCode}/command/user/${uid}/join/topic/${topics}`});
  },
  leaveTopic (appCode, uid, topics) {
    return axios({method: 'post', url: `${path}app/${appCode}/command/user/${uid}/leave/topic/${topics}`});
  },

  /**
   * 统计
   * @param appCode
   * @param params
   */
  statMessage(appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/statistics/message`, params: params});
  },
  statOnline(appCode, params) {
    return axios({method: 'get', url: `${path}app/${appCode}/statistics/online`, params: params});
  },

  adminAppStatus(appCode, status) {
    return axios({method: 'put', url: `${path}app/${appCode}/status/${status}`});
  },
  adminAppDisable(appCode, params) {
    return axios({method: 'put', url: `${path}app/${appCode}/disableSetting`, data: params});
  },

  adminGetChannels() {
    return axios({method: 'get', url: `${path}admin/channels`});
  },
  adminShutdownChannel(serverId) {
    if (serverId) {
      return axios({method: 'post', url: `${path}admin/channel/${serverId}/shutdown`});
    } else {
      return axios({method: 'post', url: `${path}admin/channels/shutdown`});
    }
  },
  adminPlatformGroupStatus(appCode, platformGroup, status) {
    return axios({method: 'put', url: `${path}app/${appCode}/platformGroup/${platformGroup}/status/${status}`});
  },
  adminPlatformStatus(appCode, platform, status) {
    return axios({method: 'put', url: `${path}app/${appCode}/platform/${platform}/status/${status}`});
  },
  adminTagStatus(appCode, tag, status) {
    return axios({method: 'put', url: `${path}app/${appCode}/tag/${tag}/status/${status}`});
  },
  adminTopicStatus(appCode, topic, status) {
    return axios({method: 'put', url: `${path}app/${appCode}/topic/${topic}/status/${status}`});
  },
  adminUserStatus(appCode, uid, status) {
    return axios({method: 'put', url: `${path}app/${appCode}/user/${uid}/status/${status}`});
  },
  adminStatMessage(params) {
    return axios({method: 'get', url: `${path}statistics/message`, params: params});
  },
  adminStatOnline(params) {
    return axios({method: 'get', url: `${path}statistics/online`, params: params});
  }
};
