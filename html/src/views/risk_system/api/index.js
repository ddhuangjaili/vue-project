import axios from 'axios';
import qs from 'qs';

const path = '/api/risk_system';

export default {
    path,
    uploadUrl: `${path}/black/add/batch`, // 上传文件地址
    creditUploadUrl: `${path}/credit/creditBatch`, // 征信验证上传文件地址
    point: {
        batchImport: `${path}_spider/point/batch/import/infoSearch`, // 批量导入信息搜索查询
        batchImportRelevant: `${path}_spider/point/batch/import/infoSearch/relevant`, // 可疑客户通讯查询关联信息查询
        batchImportBlack: `${path}_spider/point/batch/import/black/info2Excel`, // 黑名单批量查询
        batchImportSampleStat: `${path}_spider/point/batch/import/stat/recently/call/info`, // 客户通话记录训练采样统计
    },

    getDict(params) {
        return axios({ method: 'post', url: `${path}/dict/parentCode/list`, data: params });
    },
    /**
     * 黑名单管理
     * @param params
     * @returns {AxiosPromise}
     */
    getBlackList(params) {
        return axios({ method: 'get', url: `${path}/black/list`, params: params });
    },
    saveBlackList(params) {
        return axios({ method: 'post', url: `${path}/black/add`, data: qs.stringify(params) });
    },
    updateBlackList(params) {
        return axios({ method: 'post', url: `${path}/black/edit`, data: qs.stringify(params) });
    },
    approveBlackList(params) {
        return axios({ method: 'post', url: `${path}/black/approve`, data: qs.stringify(params) });
    },
    removeBlackList(params) {
        return axios({ method: 'post', url: `${path}/black/delete`, data: qs.stringify(params) });
    },
    freezeBlackList(params) {
        return axios({ method: 'post', url: `${path}/black/freeze`, data: qs.stringify(params) });
    },
    importBlackList(params) {
        return axios({ method: 'post', url: `${path}/black/add/batch`, data: qs.stringify(params) });
    },
    exportBlackList(params) {
        return axios({ method: 'get', url: `${path}/black/export`, params: params });
    },

    /**
     * 黑账户管理
     * @param params
     * @returns {AxiosPromise}
     */
    getBlackAccountList(params) {
        return axios({ method: 'get', url: `${path}/blackAccount/page/list`, params: params });
    },
    saveBlackAccount(params) {
        return axios({ method: 'post', url: `${path}/blackAccount/save`, data: params });
    },
    updateBlackAccount(params) {
        return axios({ method: 'post', url: `${path}/blackAccount/update`, data: params });
    },
    approveBlackAccount(params) {
        return axios({ method: 'post', url: `${path}/blackAccount/approve`, data: params });
    },
    removeBlackAccount(id, params) {
        return axios({ method: 'post', url: `${path}/blackAccount/delete/${id}`, data: params });
    },
    /**
     * 标签页管理
     * @param params
     * @returns {AxiosPromise}
     */
    getRiskLabelList(params) {
        return axios({ method: 'get', url: `${path}/label/list`, params: params });
    },
    saveRiskLabel(params) {
        return axios({ method: 'post', url: `${path}/label/add`, data: qs.stringify(params) });
    },
    updateRiskLabel(params) {
        return axios({ method: 'post', url: `${path}/label/update`, data: qs.stringify(params) });
    },
    approveRiskLabel(params) {
        return axios({ method: 'post', url: `${path}/label/approve/batch`, data: qs.stringify(params) });
    },
    removeRiskLabel(params) {
        return axios({ method: 'post', url: `${path}/label/delete/batch`, data: qs.stringify(params) });
    },


    /**
     * 征信验证
     * @param params
     * @returns {AxiosPromise}
     */
    credit(params) {
        return axios({ method: 'get', url: `${path}/credit`, params: params });
    },
    getServiceListDic() {
        return axios({ method: 'get', url: `${path}/credit/service/list` });
    },
    getChannelDic(params) {
        return axios({ method: 'get', url: `${path}/credit/channel/list`, params: params });
    },
    getCreditInfo(params) {
        return axios({ method: 'get', url: `${path}/credit/info`, params: params });
    },
    getCreditInfoStat(params) {
        return axios({ method: 'get', url: `${path}/credit/info/stat`, params: params });
    },
    getCreditInfoCStat(params) {
        return axios({ method: 'get', url: `${path}/credit/info/company/stat`, params: params });
    },

    /**
     * 场景
     * @param params
     * @returns {AxiosPromise}
     */
    getSceneList() {
        return axios({ method: 'get', url: `${path}/rule/scene/list` });
    },
    saveScene(params) {
        return axios({ method: 'post', url: `${path}/rule/scene/add`, data: qs.stringify(params) });
    },
    editScene(params) {
        return axios({ method: 'post', url: `${path}/rule/scene/edit`, data: qs.stringify(params) });
    },
    removeScene(params) {
        return axios({ method: 'post', url: `${path}/rule/scene/del`, params: params });
    },


    /**
     * 规则
     * @param params
     * @returns {AxiosPromise}
     */
    getRuleList(params) {
        return axios({ method: 'get', url: `${path}/rule/info/list`, params: params });
    },
    saveRule(params) {
        return axios({ method: 'post', url: `${path}/rule/info/add`, data: qs.stringify(params) });
    },
    editRule(params) {
        return axios({ method: 'post', url: `${path}/rule/info/edit`, data: qs.stringify(params) });
    },
    removeRule(params) {
        return axios({ method: 'post', url: `${path}/rule/info/del`, params: params });
    },
    approveRule(params) {
        return axios({ method: 'post', url: `${path}/rule/info/approve`, data: qs.stringify(params) });
    },
    enableRule(params) {
        return axios({ method: 'post', url: `${path}/rule/info/enable`, data: qs.stringify(params) });
    },
    importRule(params) {
        return axios({ method: 'post', url: `${path}/rule/info/import`, params: params });
    },
    getRuleInfoResult() {
        return axios({ method: 'get', url: `${path}/rule/info/result` });
    },
    getRuleResultList(params) {
        return axios({ method: 'get', url: `${path}/rule/info/result/list`, params: params });
    },
    addRuleResul(params) {
        return axios({ method: 'post', url: `${path}/rule/info/result/add`, data: qs.stringify(params) });
    },
    editRuleResul(params) {
        return axios({ method: 'post', url: `${path}/rule/info/result/edit`, data: qs.stringify(params) });
    },
    deleteRuleResul(params) {
        return axios({ method: 'post', url: `${path}/rule/info/result/del`, data: qs.stringify(params) });
    },
    approveRuleResul(params) {
        return axios({ method: 'post', url: `${path}/rule/info/result/approve`, data: qs.stringify(params) });
    },

    getRuleStatList(params) {
        return axios({ method: 'get', url: `${path}/rule/stat/list`, params: params });
    },

    getRuleStatToday(params) {
        return axios({ method: 'get', url: `${path}/rule/stat/today`, params: params });
    },

    getRuleStatScene(params) {
        return axios({ method: 'get', url: `${path}/rule/stat/scene`, params: params });
    },
    getGroupList() {
        return axios({ method: 'get', url: `${path}/rule/info/group/list` });
    },

    /**
     * 参数
     * @param params
     * @returns {AxiosPromise}
     */
    getVariableParams(params) {
        return axios({ method: 'get', url: `${path}/rule/variable/params`, params: params });
    },
    getVariableCalList(params) {
        return axios({ method: 'get', url: `${path}/rule/variable/cal/list`, params: params });
    },
    getVariableCalParams(params) {
        return axios({ method: 'get', url: `${path}/rule/variable/cal/params`, params: params });
    },
    getVariableDimTree(params) {
        return axios({ method: 'get', url: `${path}/rule/variable/dim/tree`, params: params });
    },
    getVariableList(params) {
        return axios({ method: 'get', url: `${path}/rule/variable/list`, params: params });
    },
    getVariableDimList() {
        return axios({ method: 'get', url: `${path}/rule/variable/dim/list` });
    },
    getVariableList(params) {
        return axios({ method: 'get', url: `${path}/rule/variable/list`, params: params });
    },
    saveVariable(params) {
        return axios({ method: 'post', url: `${path}/rule/variable/add`, data: qs.stringify(params) });
    },
    editVariable(params) {
        return axios({ method: 'post', url: `${path}/rule/variable/edit`, data: qs.stringify(params) });
    },
    removeVariable(params) {
        return axios({ method: 'post', url: `${path}/rule/variable/del`, params: params });
    },
    approveVariable(params) {
        return axios({ method: 'post', url: `${path}/rule/variable/approve`, data: qs.stringify(params) });
    },

    /**
     * 条件
     * @param params
     * @returns {AxiosPromise}
     */
    getConditionList(params) {
        return axios({ method: 'get', url: `${path}/rule/condition/list`, params: params });
    },
    saveCondition(params) {
        return axios({ method: 'post', url: `${path}/rule/condition/add`, data: qs.stringify(params) });
    },
    editCondition(params) {
        return axios({ method: 'post', url: `${path}/rule/condition/edit`, data: qs.stringify(params) });
    },
    removeCondition(params) {
        return axios({ method: 'post', url: `${path}/rule/condition/del`, params: params });
    },
    changeConditionSeq(params) {
        return axios({ method: 'post', url: `${path}/rule/condition/changeseq`, params: params });
    },
    logicalSetting(params) {
        return axios({ method: 'post', url: `${path}/rule/condition/logicalSetting`, params: params });
    },

    /**
     * 爬虫
     * @param params
     * @returns {AxiosPromise}
     */
    exportSpiderList(params) {
        return axios({ method: 'get', url: `${path}/spider/export`, params: params });
    },
    getSpiderList(params) {
        return axios({ method: 'get', url: `${path}/spider/list`, params: params });
    },
    getSpiderKeyword(params) {
        return axios({ method: 'get', url: `${path}/spider/keyword/list`, params: params });
    },
    delSpiderKeyword(params) {
        return axios({ method: 'post', url: `${path}/spider/keyword/del`, params: params });
    },
    addSpiderKeyword(params) {
        return axios({ method: 'post', url: `${path}/spider/keyword/add`, params: params });
    },
    editSpiderKeyword(params) {
        return axios({ method: 'post', url: `${path}/spider/keyword/edit`, params: params });
    },
    getSpiderWarn(params) {
        return axios({ method: 'get', url: `${path}/spider/warn/list`, params: params });
    },
    delSpiderWarn(params) {
        return axios({ method: 'post', url: `${path}/spider/warn/del`, params: params });
    },
    addSpiderWarn(params) {
        return axios({ method: 'post', url: `${path}/spider/warn/add`, params: params });
    },
    editSpiderWarn(params) {
        return axios({ method: 'post', url: `${path}/spider/warn/edit`, params: params });
    },
    excludeSpiderInfo(params) {
        return axios({ method: 'post', url: `${path}/spider/exclude`, params: params });
    },
    markSpiderInfo(params) {
        return axios({ method: 'post', url: `${path}/spider/mark`, params: params });
    },
    getWebsitList(params) {
        return axios({ method: 'get', url: `${path}/spider/websit/list`, params: params });
    },
    getWebsitCount(params) {
        return axios({ method: 'get', url: `${path}/spider/websit/count`, params: params });
    },


    /**
     * 黑名单记录
     * @param params
     * @returns {AxiosPromise}
     */
    getBlackStat(params) {
        return axios({ method: 'get', url: `${path}/black/stat`, params: params });
    },
    getFindHitList(params) {
        return axios({ method: 'get', url: `${path}/black/findHitList`, params: params });
    },
    getStatHitSummary(params) {
        return axios({ method: 'get', url: `${path}/black/statHitSummary`, params: params });
    },

    /**
     * 埋点记录
     * @param params
     * @returns {AxiosPromise}
     */
    getPointList(params) {
        return axios({ method: 'get', url: `${path}/point/list`, params: params });
    },
    getPointStatList(params) {
        return axios({ method: 'get', url: `${path}/point/statList`, params: params });
    },
    getPointDetailInfo(params) {
        return axios({ method: 'get', url: `${path}/point/detailInfo`, params: params });
    },


    /**
     * 配置信息
     */
    queryCreditConfig(params) {
        return axios({ method: 'get', url: `${path}/credit/config`, params: params });
    },
    editCreditConfig(params) {
        return axios({ method: 'post', url: `${path}/credit/config/edit`, data: qs.stringify(params) });
    },
    addCreditConfig(params) {
        return axios({ method: 'post', url: `${path}/credit/config/add`, data: qs.stringify(params) });
    },
    deleteCreditConfig(params) {
        return axios({ method: 'post', url: `${path}/credit/config/delete`, data: qs.stringify(params) });
    },
    queryDepositList(params) {
        return axios({ method: 'get', url: `${path}/credit/deposit/list`, params: params });
    },
    addDeposit(params) {
        return axios({ method: 'post', url: `${path}/credit/deposit`, data: qs.stringify(params) });
    },
    deleteDeposit(params) {
        return axios({ method: 'post', url: `${path}/credit/deposit/delete/${params.id}`, data: qs.stringify(params) });
    },

    /**
     * 用户画像
     */
    getCustomerScoreCard() {
        return axios({ method: 'get', url: `${path}/customer/scoreCard/list`});
    },
    getCustomerPortraitScore(params) {
        return axios({ method: 'get', url: `${path}/customer/portrait/score`, params: params});
    },
    getCustomerScoreCardDetail(params) {
        return axios({ method: 'get', url: `${path}/customer/scoreCard/detail`, params: params});
    },
    getCustomerScoreCardSample(params) {
        return axios({ method: 'get', url: `${path}/customer/scoreCard/sample`, params: params});
    },
    getCustomerScoreCardLabel(params) {
        return axios({ method: 'get', url: `${path}/customer/scoreCard/label`, params: params});
    },
    getCustomerScoreCardPicture(params) {
        return axios({ method: 'get', url: `${path}/customer/scoreCard/picture`, params: params});
    },

    /**
     * 批量任务处理
     */
    getPointBlackDeviceId(params, headers) {
        return axios({ method: 'get', url: `${path}_spider/point/black/deviceId/accountlist`, params, headers});
    },
    getPointBlackContact(params, headers) {
        return axios({ method: 'post', url: `${path}_spider/point/black/contact/call/list`, data: qs.stringify(params), headers});
    },
    getPointBlackUploadlist(params, headers) {
        return axios({ method: 'get', url: `${path}_spider/point/handle/black/uploadlist`, params, headers});
    },

    /**
     * 业务管理
     */
    addBusinessAccount(params) {
        return axios({ method: 'post', url: `${path}/business/account`, data: qs.stringify(params) });
    },
    editBusinessAccount(params) {
        return axios({ method: 'post', url: `${path}/business/account/edit`, data: qs.stringify(params) });
    },
    approveBusinessAccount(params) {
        return axios({ method: 'post', url: `${path}/business/account/approve`, data: qs.stringify(params) });
    },
    getBusinessAccountList(params) {
        return axios({ method: 'get', url: `${path}/business/account/list`, params: params });
    },
    getBusinessAccount(params) {
        return axios({ method: 'get', url: `${path}/business/account`, params: params });
    },
    /***********办理点**********/
    getAgencyList() {
        return axios({ method: 'get', url: `${path}/business/agency/list` });
    },
    saveAgency(params) {
        return axios({ method: 'post', url: `${path}/business/agency`, params: params });
    },
    editAgency(params) {
        return axios({ method: 'post', url: `${path}/business/agency/edit`, params: params });
    },
    deleteAgency(params) {
        return axios({ method: 'post', url: `${path}/business/agency/delete`, params: params });
    },
    /*******业务类型 *********/
    getApplicationTypeList(params) {
        return axios({ method: 'get', url: `${path}/business/application/type/list`, params: params });
    },
    saveApplicationType(params) {
        return axios({ method: 'post', url: `${path}/business/application/type`, params: params });
    },
    editApplicationType(params) {
        return axios({ method: 'post', url: `${path}/business/application/type/edit`, params: params });
    },
    deleteApplicationType(params) {
        return axios({ method: 'post', url: `${path}/business/application/type/delete`, params: params });
    },
    /******* 文件 *********/
    getAccountFileList(params) {
        return axios({ method: 'get', url: `${path}/business/account/file/list`, params: params });
    },
    saveAccountFile(params) {
        return axios({ method: 'post', url: `${path}/business/account/file`, params: params });
    },
    editAccountFile(params) {
        return axios({ method: 'post', url: `${path}/business/account/file/edit`, params: params });
    },
    deleteAccountFile(params) {
        return axios({ method: 'post', url: `${path}/business/account/file/delete`, params: params });
    },
    saveFileConfig(params) {
        return axios({ method: 'post', url: `${path}/business/account/file/setting`, params: params });
    },
    getFileConfigList(params) {
        return axios({ method: 'get', url: `${path}/business/account/file/setting`, params: params });
    },
    saveApplyStep(params) {
        return axios({ method: 'post', url: `${path}/business/apply/step`, params: params });
    },
    /******机构开户部分 */
    updateFileDetect(params) {
        return axios({ method: 'post', url: `${path}/business/institution/updateFileDetect`, params: params });
    },
    getFileDetect(params) {
        return axios({ method: 'get', url: `${path}/business/institution/getFileDetect`, params: params });
    },
    /****业务场景部分 */
    getBusinessSceneList(params){
        return axios({ method: 'get', url: `${path}/business/scene`, params: params });
    },
    editBusinessScene(params){
        return axios({ method: 'post', url: `${path}/business/scene/edit`, params: params });
    },
    deleteBusinessScene(params){
        return axios({ method: 'post', url: `${path}/business/scene/delete`, params: params });
    },
    addBusinessScene(params){
        return axios({ method: 'post', url: `${path}/business/scene`, params: params });
    },
    getSceneParamList(params){
        return axios({ method: 'get', url: `${path}/business/scene/param`, params: params });
    },
    editSceneParam(params){
        return axios({ method: 'post', url: `${path}/business/scene/param/edit`, params: params });
    },
    deleteSceneParam(params){
        return axios({ method: 'post', url: `${path}/business/scene/param/delete`, params: params });
    },
    addSceneParam(params){
        return axios({ method: 'post', url: `${path}/business/scene/param`, params: params });
    },
    getFileParamList(params){
        return axios({ method: 'get', url: `${path}/business/scene/param/file`, params: params });
    },
};
