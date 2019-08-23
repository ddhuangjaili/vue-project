<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.nickName" placeholder="客户呢称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.mobile" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.accountCode" placeholder="账号"></el-input>
        </el-form-item>
          <el-form-item>
              <el-input v-model="search.realName" placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input v-model="search.idCardNo" placeholder="身份证号"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input v-model="search.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item>
              <el-select clearable v-model="search.accountStatus" placeholder="客户状态">
                  <el-option v-for="(val, key) in accountStatusMap" :label="val" :value="key" v-show="key !== '4' && key !== '5' "
                             :key="'search-accountStatus-'+ key"></el-option>
              </el-select>
          </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.isRealnamecheck" placeholder="实名认证">
            <el-option v-for="(val, key) in checkMap" :label="val" :value="key"
                       :key="'search-isRealnamecheck-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.isAdvancheck" placeholder="身份认证">
            <el-option v-for="(val, key) in checkMap" :label="val" :value="key"
                       :key="'search-isAdvancheck-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.tag" placeholder="客户组别">
            <el-option v-for="(val, key) in clientGroupMap" :label="val" :value="key"
                       :key="'search-tag-'+ key"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
              <el-date-picker
                  clearable
                  v-model="search.datetime"
                  type="daterange"
                  placeholder="时间">
              </el-date-picker>
          </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-row class="toolbar">
      <el-button v-show="optAuth.add" type="primary" @click="showOpenAccountDialog">新增</el-button>
      <el-button v-show="optAuth.categoryAuth" @click="showAuthDialog(2)" type="primary" title="账户类别授权">账户类别授权</el-button>
      <el-button type="primary" v-show="optAuth.export" @click="handleDownload" title="导出"
                 :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出
      </el-button>
    </el-row>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <table class="stat-table" v-if="props.row.accountList && props.row.accountList.length > 0">
            <thead>
            <tr>
              <th>账号</th>
              <th>状态</th>
              <th>账户类型</th>
              <th>账户类别</th>
              <th>产品</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(account, key) in props.row.accountList">
              <td>{{account.accountCode}}</td>
              <td>{{statusFmt(account)}}</td>
              <td>{{typeFmt(account)}}</td>
              <td>{{flagFmt(account)}}</td>
              <td>
                <div v-for="(accountCur, i) in account.accountCurList" style="text-align:left;padding:5px;">
                  币种: {{accountCur.currencyCode}} &nbsp;&nbsp;
                  余额: {{accountCur.availableAmount}} &nbsp;&nbsp;冻结: {{accountCur.publishAmount}}&nbsp;&nbsp;
                  <el-button @click="showFundsDialog(account.accountCode, accountCur.currencyCode)"
                             v-show="account.status !== 1 && optAuth.charge" type="primary" size="mini">充币
                  </el-button>
                  <el-button @click="showRetCoinDialog(account.accountCode, accountCur.currencyCode,accountCur.availableAmount)"
                             v-show="account.status !== 1 && optAuth.charge & accountCur.availableAmount>0" type="primary" size="mini">扣币
                  </el-button>
                  &nbsp;&nbsp;
                  <span v-show="optAuth.tradeInit && account.flag === 2">
                    交易初始值: {{accountCur.tradeInit}} &nbsp;&nbsp;
                    <el-button title="设置交易初始值"
                         @click="showTradeInitDialog(account.accountCode, accountCur.currencyCode, accountCur.tradeInit)" type="primary" size="mini">设置</el-button>
                  </span>
                  <span v-show="accountCur.currencyType == 3">
                    &nbsp;钱包状态: <font style="color:#20a0ff">{{walletFmt(account)}}</font>
                   &nbsp;<label v-show="account.bindWallet == 1" >钱包ID:
                      <font @click="account.flag === 2 && showBindWalletDialog(account)" style="color:#20a0ff" >{{account.walletUid}}</font>
                   </label>
                   &nbsp;<el-button v-show="optAuth.bindWallet && account.flag === 2 && (account.bindWallet == 0||!account.bindWallet)"  title="设置钱包ID"
                         @click="showBindWalletDialog(account)" type="primary" size="mini">设置钱包ID</el-button>
                  </span>
                </div>
              </td>
              <td>
                <el-button title="授权" v-show="optAuth.auth"
                           @click="showAuthDialog(1, account.accountCode, account.authCodes, account.flag)" size="mini" type="primary">授权
                </el-button>
                <el-button title="更新状态" v-show="optAuth.accountStatus && props.row.status === 1"
                           @click="showAccountStatusDialog(account.id, account.status, account.accountCode)" size="mini" type="danger">更新状态
                </el-button>

                <el-button title="更新账户类别" v-show="optAuth.accountFlag"
                           @click="showAccountFlagDialog(account.id, account.flag)" size="mini" type="warning">更新账户类别
                </el-button>
              </td>
            </tr>
            </tbody>
          </table>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="extendInfo"
        :formatter="nickNameFmt"
        label="客户呢称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="clientCode"
        label="客户编码"
        width="130">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="mobileNo"
        label="手机号码"
        width="130">
      </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="email"
            label="邮箱"
            width="130">
        </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        label="状态"
        :formatter="accountStatusFmt"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tags"
        :formatter="clientGroupFmt"
        label="客户组别"
        width="110">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="realName"
        label="真实姓名"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="cardNo"
        label="身份证号码"
        :formatter="idCardNoFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="extendInfo"
        :formatter="realNameAuthFmt"
        label="实名认证"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="extendInfo"
        :formatter="advancedAuthFmt"
        label="身份认证"
        width="100">
      </el-table-column>
       <el-table-column
        :show-overflow-tooltip="true"
        prop="accountList"
        :formatter="videoAuthFmt"
        label="视频认证"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        :formatter="createDateFmt"
        width="200"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="280"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit"
                     @click="showDialog(2, scope.$index)" type="info" icon='edit' size="mini"></el-button>
          <el-button title="修改昵称" v-show="optAuth.modifyNameCn"
                     @click="showModifyNameCnDialog(scope.row)" type="info" size="mini">修改昵称</el-button>
          <el-button title="更新状态" v-show="optAuth.clientStatus"
                     @click="showClientStatusDialog(scope.row.mobileNo, scope.row.status,
                     scope.row.accountList, scope.row.clientCode)" size="mini" type="danger">
            更新状态
          </el-button>
          <el-button title="更新组别" v-show="optAuth.clientGroup"
                     @click="showClientGroupDialog(scope.row.clientCode, scope.row.tags)" size="mini" type="danger">
            更新组别
          </el-button>
          <el-button style="margin-top:10px;margin-left:20px;" title="取消实名验证" v-show="optAuth.unbindIdcard && scope.row.cardNo && scope.row.realName"
                     @click="unbindIdCardFun(scope.row.clientCode,scope.row.cardNo)" type="info" size="mini">取消实名验证</el-button>
          <el-button title="开立账户" v-show="optAuth.openAccount
          && (!scope.row.accountList || scope.row.accountList.length === 0)"
                     @click="showOpenDialog(scope.row.mobileNo,scope.row.clientCode, scope.row.status)" type="info" size="mini">开立账户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.pageNo"
                   :page-sizes="[20, 50, 100, 200]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>

    <!-- 弹窗框 -->
    <el-dialog title="充币" v-model="fundsDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="fundsForm" :model="fundsDialog.form" :rules="fundsDialog.rules" label-width="120px"
               class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="发币账号：" prop="accountCode">
              <el-select v-model="fundsDialog.form.accountCode" @change="getAvailableAmount" filterable placeholder="发币账号">
                <el-option v-for="(account, i) in accounts" :label="account.nameCn" :value="account.accountCode"
                           :key="'form-accountCode-'+ account.accountCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可用数量：" prop="availableAmount">
              <el-input v-model="fundsDialog.form.availableAmount" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标账号：" prop="accountCodeTarget">
              <el-input v-model="fundsDialog.form.accountCodeTarget" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="币编码：" prop="currencyCode">
              <el-input v-model="fundsDialog.form.currencyCode" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量：" prop="amount">
              <el-input-number v-model="fundsDialog.form.amount" :min="1" :max="fundsDialog.form.availableAmount"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitFundsForm" type="primary" :disabled="fundsDialog.isSubmit ||fundsDialog.form.availableAmount < 1 || fundsDialog.form.amount < 1 ||fundsDialog.form.availableAmount<fundsDialog.form.amount">保 存</el-button>
        <el-button @click="fundsDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

     <!-- 弹窗框 -->
    <el-dialog title="扣币设置" v-model="retCoinDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="retCoinForm" :model="retCoinDialog.form" label-width="100px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="源账号：" prop="accountCode">
              <el-input v-model="retCoinDialog.form.accountCode" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="币种编码：" prop="currencyCode">
              <el-input v-model="retCoinDialog.form.currencyCode" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="可用数量：" prop="availableAmount">
              <el-input v-model="retCoinDialog.form.availableAmount" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="扣回数量：" prop="amount">
              <el-input-number v-model="retCoinDialog.form.amount" :min="0" :max="retCoinDialog.form.availableAmount"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="目标账号：">
               <el-input value="系统账号"  auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitRetCoinForm" type="primary" :disabled="retCoinDialog.isSubmit || retCoinDialog.form.amount < 1 || retCoinDialog.form.availableAmount<retCoinDialog.form.amount">保 存</el-button>
        <el-button @click="retCoinDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

<!-- 设置钱包id弹窗框 -->
    <el-dialog title="设置钱包ID" v-model="bindWalletDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="bindWalletForm" :model="bindWalletDialog.form"  label-width="10px"
               class="dialog-form">
        <el-row :gutter="10" style="display: none;">
          <el-col :span="10">
            <el-form-item label="ID" prop="accountId">
              <el-input v-model="bindWalletDialog.form.accountId" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
       <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item prop="walletId">
              <el-input v-model="bindWalletDialog.form.walletId" auto-complete="off" placeholder="请输入钱包ID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitBindWalletForm" type="primary" :disabled="!bindWalletDialog.form.walletId">保 存</el-button>
        <el-button @click="bindWalletDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="设置交易初始值" v-model="tradeInitDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="tradeInitForm" :model="tradeInitDialog.form" :rules="tradeInitDialog.rules" label-width="100px"
               class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="账号：" prop="accountCode">
              <el-input v-model="tradeInitDialog.form.accountCode" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="币种编码：" prop="currencyCode">
              <el-input v-model="tradeInitDialog.form.currencyCode" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="初始值：" prop="tradeInit">
              <el-input-number v-model="tradeInitDialog.form.tradeInit" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitTradeInitForm" type="primary" :disabled="tradeInitDialog.form.tradeInit < 1">保 存</el-button>
        <el-button @click="tradeInitDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->


    <!-- 弹窗框 -->
    <el-dialog title="授权" v-model="authDialog.show" size="tiny" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="authForm" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="账户类别：" v-show="authDialog.type === 2">
              <el-select @change="changeAuthFlag" clearable v-model="authDialog.flag" placeholder="账户类别">
                <el-option v-for="(flag, key) in flagMap" :label="flag.name" :value="flag.flag"
                           :key="'form-flag-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="应用权限：">
              <el-checkbox-group v-model="authDialog.authCodes" class="head-check">
                <el-checkbox v-for="(c, key) in authDialog.appAuthList" :label="c.code"
                             :key="'form-appAuth-'+ c.code">{{c.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toAppAuth" type="primary">保 存</el-button>
        <el-button @click="authDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="更新账户类别" v-model="flagDialog.show" size="tiny" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="flagForm" :model="flagDialog.form" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="账户类别：" prop="flag" :rules="[
                { required: true, message: '请选择账户类别', trigger: 'change' }
              ]">
              <el-select v-model="flagDialog.form.flag" placeholder="账户类别">
                <el-option v-for="(flag, key) in flagMap" :label="flag.name" :value="flag.flag + ''"
                           :key="'form-account-flag-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateAccountFlag" type="primary">保 存</el-button>
        <el-button @click="flagDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="更新客户状态" v-model="clientStatusDialog.show" size="tiny" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="clientStatusForm" :model="clientStatusDialog.form" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="客户状态：" prop="accountStatus" :rules="[
                { required: true, message: '请选择客户状态', trigger: 'change' }
              ]">
              <el-select clearable v-model="clientStatusDialog.form.accountStatus" placeholder="客户状态">
                <el-option v-for="(val, key) in accountStatusMap" :label="val" :value="key" v-show="key !== '4' && key !== '5' "
                           :key="'clientStatusDialog-accountStatus-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateClientStatus" type="primary">保 存</el-button>
        <el-button @click="clientStatusDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="更新客户组别" v-model="clientGroupDialog.show" size="tiny" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="clientGroupForm" :model="clientGroupDialog.form" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="客户组别：" prop="tags" :rules="[
                { required: true, message: '请选择客户组别', trigger: 'change' }
              ]">
              <el-select clearable v-model="clientGroupDialog.form.tags" placeholder="客户组别">
                <el-option v-for="(val, key) in clientGroupMap" :label="val" :value="key"
                           :key="'clientGroupDialog-tags-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateClientGroup" type="primary">保 存</el-button>
        <el-button @click="clientGroupDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="更新账户状态" v-model="accountStatusDialog.show" size="tiny" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="accountStatusForm" :model="accountStatusDialog.form" label-width="100px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="账户状态：" prop="status" :rules="[
                { required: true, message: '请选择账户状态', trigger: 'change' }
              ]">
              <el-select clearable v-model="accountStatusDialog.form.status" placeholder="账户状态">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'accountStatusDialog-status-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateAccountStatus" type="primary">保 存</el-button>
        <el-button @click="accountStatusDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="clientForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form form-detail">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户编码：">
              <el-input v-model="dialog.form.clientCode" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册时间：">
              <el-form-item>
                <el-date-picker
                  :readonly="true"
                  v-model="dialog.form.createDate"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="注册时间">
                </el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册IP：">
              <el-input v-model="dialog.form.createIp" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-tabs type="card" v-model="tabs.activeName1">
          <el-tab-pane label="认证/绑定" name="bind">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="实名认证">
                  <el-checkbox v-model="authMap.realNameAuth" @change="rcheckboxFun"
                               :disabled="this.dialog.form.realNameAuth === '1'"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="身份认证">
                  <el-checkbox v-model="authMap.advancedAuth" @change="acheckboxFun"
                               :disabled="this.dialog.form.realNameAuth !== '1'
                               || this.dialog.form.advancedAuth === '1'"></el-checkbox>
                  <span class="tips"
                        v-show="this.dialog.form.realNameAuth !== '1'">[完成实名认证后才能设置身份认证]</span>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="视频认证">
                  <el-checkbox v-model="authMap.videoAuth" :disabled="(this.dialog.form.advancedAuth !== '1' && !authMap.videoAuth) || this.dialog.form.videoAuth == 2"></el-checkbox>
                  <span class="tips" v-show="!authMap.videoAuth && (this.dialog.form.advancedAuth !== '1'||this.dialog.form.realNameAuth !== '1')">[完成实名及身份认证后才能设置视频认证]</span>
                </el-form-item>
              </el-col>
            </el-row>
            <!--<el-row :gutter="20">-->
              <!--<el-col :span="8">-->
                <!--<el-form-item label="绑定手机">-->
                  <!--<el-checkbox v-model="authMap.phoneAuth"></el-checkbox>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="8">-->
                <!--<el-form-item label="绑定邮箱">-->
                  <!--<i v-if="dialog.form.unifyInfo.baseInfo.email" class="el-icon-check"></i>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="8">-->
                <!--<el-form-item label="绑定银行卡">-->
                  <!--<i v-if="hasBankCard" class="el-icon-check"></i>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
            <!--</el-row>-->
          </el-tab-pane>
        </el-tabs>

        <el-tabs type="card" v-model="tabs.activeName2">
          <el-tab-pane label="基础资料（* 为实名认证必填项）" name="base">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名：*">
                  <el-input v-model="dialog.form.unifyInfo.baseInfo.cnName" auto-complete="off" placeholder="实名认证必填项" :disabled="!authMap.realNameAuth || this.dialog.form.realNameAuth === '1'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="出生日期：">
                  <el-date-picker
                    :disabled="true"
                    v-model="dialog.form.unifyInfo.baseInfo.birthday"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="出生日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="国籍：">
                  <el-input v-model="dialog.form.unifyInfo.baseInfo.nationality" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="手机：">
                  <el-input v-model="dialog.form.unifyInfo.baseInfo.mobile" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="电邮：">
                 <el-input v-model="dialog.form.fillemail" auto-complete="off" :disabled="dialog.form.email!=null && dialog.form.email!=''"  placeholder="请输入邮箱">
                     <template slot="append"><font style="color:#50bfff;">{{dialog.form.emailAuth==1?'已验证':'未验证'}}</font></template>
                   </el-input>
                  <el-checkbox v-model="dialog.form.verfycheck" @change="verfycheckFun" :disabled="dialog.form.dbverfycheck==true"></el-checkbox>&nbsp;&nbsp;开启邮箱接收短信验证码
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="证件类型：">
                  <el-select v-model="dialog.form.unifyInfo.idCardInfo.idCardType" placeholder="证件类型" :disabled="true">
                    <el-option label="身份证" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证件号码：*">
                  <el-input v-model="dialog.form.unifyInfo.idCardInfo.idCardNo" placeholder="实名认证必填项" auto-complete="off" :disabled="!authMap.realNameAuth||this.dialog.form.realNameAuth === '1'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>

        <el-tabs type="card" v-model="tabs.activeName5">
          <el-tab-pane label="银行资料" name="bankInfo">
            <table class="stat-table file-table">
              <thead>
              <tr>
                <th width="200">银行名称</th>
                <th>开户人</th>
                <th>银行账户</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(bank, i) in dialog.form.unifyInfo.bankCardInfo">
                <td>{{bankNameFmt(bank)}}</td>
                <td>{{bank.bankAccountName}}</td>
                <td>{{bank.bankAccountNumber}}</td>
              </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>

        <el-tabs type="card" v-model="tabs.activeName3">
          <el-tab-pane label="文件（* 为身份认证必填项）" name="files">
            <table class="stat-table file-table">
              <thead>
              <tr>
                <th width="200">文件名</th>
                <th width="400">预览</th>
                <th>文件</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>身份证（正面）*</td>
                <td><img :src="imagesMap.front.url" width="150"/></td>
                <td>
                  <el-upload
                      v-show="optAuth.upload"
                    :action="uploadFile.uploadFileUrl"
                    :show-file-list="false"
                    :on-success="(res, file, files) => {avatarSuccess(res, file, files, 'front')}"
                    :before-upload="(file) => {beforeUpload(file, 'front', 'idCard')}"
                    :on-error="(err, file, fileList) => {avatarError(err, file, fileList, 'front')}"
                    :data="uploadFile.uploadFileData">
                    <el-button :loadiing="imagesMap.front.uploading"
                               :disabled="!authMap.advancedAuth||this.dialog.form.advancedAuth === '1'"
                               type="primary" size="small">
                      <i class="icon-upload"></i>&nbsp;&nbsp;上传</el-button>
                  </el-upload>
                </td>
              </tr>
              <tr>
                <td>身份证（反面）*</td>
                <td><img :src="imagesMap.back.url" width="150"/></td>
                <td>
                  <el-upload
                      v-show="optAuth.upload"
                    :action="uploadFile.uploadFileUrl"
                    :show-file-list="false"
                    :on-success="(res, file, files) => {avatarSuccess(res, file, files, 'back')}"
                    :before-upload="(file) => {beforeUpload(file, 'back', 'idCard')}"
                    :on-error="(err, file, fileList) => {avatarError(err, file, fileList, 'back')}"
                    :data="uploadFile.uploadFileData">
                    <el-button :loadiing="imagesMap.back.uploading"
                               :disabled="!authMap.advancedAuth||this.dialog.form.advancedAuth === '1'"
                               type="primary" size="small">
                      <i class="icon-upload"></i>&nbsp;&nbsp;上传</el-button>
                  </el-upload>
                </td>
              </tr>
              <tr>
                <td>身份证（手持）</td>
                <td><img :src="imagesMap.holdon.url" width="150"/></td>
                <td>
                  <el-upload
                      v-show="optAuth.upload"
                    :action="uploadFile.uploadFileUrl"
                    :show-file-list="false"
                    :on-success="(res, file, files) => {avatarSuccess(res, file, files, 'holdon')}"
                    :before-upload="(file) => {beforeUpload(file, 'holdon', 'idCard')}"
                    :on-error="(err, file, fileList) => {avatarError(err, file, fileList, 'holdon')}"
                    :data="uploadFile.uploadFileData">
                    <el-button :loadiing="imagesMap.holdon.uploading"
                               :disabled="!authMap.advancedAuth ||this.dialog.form.advancedAuth === '1'"
                               type="primary" size="small">
                      <i class="icon-upload"></i>&nbsp;&nbsp;上传</el-button>
                  </el-upload>
                </td>
              </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>

        <!--<el-tabs type="card" v-model="tabs.activeName4">-->
          <!--<el-tab-pane label="备注信息" name="remark">-->
            <!--<el-input v-model="dialog.form.remark" type="textarea" :rows="3"></el-input>-->
          <!--</el-tab-pane>-->
        <!--</el-tabs>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary">保 存</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
        <el-dialog title="开立新账户" v-model="openAccountDialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
          <el-form ref="openAccountForm" :model="openAccountDialog.form" :rules="openAccountDialog.rules" label-width="120px"
                   class="dialog-form">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="手机号：" prop="mobileNo">
                  <el-input v-model="openAccountDialog.form.mobileNo" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="密码：" prop="password">
                  <el-input v-model="openAccountDialog.form.password" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="昵称：" prop="nameCn">
                  <el-input v-model="openAccountDialog.form.nameCn" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="submitOpenAccountForm" type="primary">保 存</el-button>
            <el-button @click="openAccountDialog.show = false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="修改昵称" v-model="modifyNameCnDialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="modifyNameCnForm" :model="modifyNameCnDialog.form" :rules="modifyNameCnDialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20" style="display: none;">
          <el-col :span="24">
            <el-form-item label="密码：" prop="clientCode">
              <el-input v-model="openAccountDialog.form.clientCode" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="昵称：" prop="nameCn">
              <el-input v-model="modifyNameCnDialog.form.nameCn" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitModifyNameCnForm" type="primary">保 存</el-button>
        <el-button @click="modifyNameCnDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  import {getBankName} from '../api/bankList';

  export default {
    name: 'client',
    props: {
      height: {
        type: Number
      }
    },
    data() {
      return {
        loading: true,
        downloading: false,
        search: {
          nickName: '',
          mobile: '',
          accountStatus: '',
          isRealnamecheck: '',
          isAdvancheck: '',
          tag: '',
            realName: '',
            idCardNo: '',
            email: '',
            datetime: null
        },
        uploadFile: {
          uploadFileUrl: api.getFormatPath('client/upload'),
            uploadFileData: {
                token: bsmp.util.getToken()
            }
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '客户资料',
          form: {
            clientCode: '',
            createDate: null,
            createIp: null,
            realNameAuth: '0',
            advancedAuth: '0',
            phoneAuth: '0',
            videoAuth: 0,
            email: '',
            emailAuth:0,
            verfycheck:false,
            dbverfycheck:false,
            fillemail:'',
            bankName: '',
            bankBranch: '',
            bankAccountNumber: '',
            unifyInfo: {
              baseInfo: {
                birthday: "",
                cnName: "",
                nationality: "",
                sex: 0,
                mobile: "",
                email: ""
              },
              bankCardInfo: [
                {
                  bankAccountName: "",
                  bankBranch: "",
                  bankCounty: "",
                  bankName: "",
                  bankOther: "",
                  bankAddress: "",
                  bankCountry: "",
                  bankCity: "",
                  bankId: 0,
                  bankAccountType: "",
                  bankAccountNumber: "",
                  internationalRemittanceCode: "",
                  bankProvince: "",
                  bankAccountCurrency: ""
                }
              ],
              idCardInfo: {
                idCardType: "1",
                cnName: "",
                idCardCountry: "",
                idCardNo: "",
                idCardAddress: "",
                idCardCountryOther: ""
              }
            },
            accountList: [],
            remark: ''
          },
          rules: rules
        },
        fundsDialog: {
          show: false,
          isSubmit:false,
          form: {
            accountCode: '',
            accountCodeTarget: '',
            currencyCode: 'USDT',
            availableAmount: 0,
            amount: 1
          },
          rules: fundsRules
        },
        retCoinDialog:{
          show: false,
          form: {
            accountCode: '',
            currencyCode: '',
            amount: 0
          }
        },
        tradeInitDialog: {
          show: false,
          form: {
            accountCode: '',
            currencyCode: 'SB',
            tradeInit: 1
          },
          rules: tradeInitRules
        },
        bindWalletDialog: {
          show: false,
          form: {
            walletId: '',
            accountId: '',
          }
        },
        accounts: [],
        statusMap: {
          '0': '正常',
          '1': '禁止',
          '2': '挂起'
        },
        accountStatusMap: {
          '1': '已注册',
          '2': '禁用',
          '3': '挂起',
          '4': '实名认证',
          '5': '身份认证'
        },
        typeMap: {
          '1': '法币',
          '2': '虚拟币'
        },
        checkMap: {
          '1': '已认证',
          '2': '未认证'
        },
        authListMap: {
          '0': '待审批',
          '1': '已认证',
          '-1': '未认证',
          '2': '未认证'
        },
        flagMap: {},
        walletMap: {
          '0': '未绑定',
          '1': '已绑定'
        },
        clientGroupMap: {},
        authDialog: {
          show: false,
          type: 1,
          appAuthList: null,
          authCodes: [],
          accountCode: '',
          flag: null
        },
        flagDialog: {
          show: false,
          form: {
            id: null,
            flag: null
          }
        },
        clientStatusDialog: {
          show: false,
          form: {
            mobileNo: '',
            accountStatus: '',
            accountCodes: '',
            clientCode: ''
          }
        },
        clientGroupDialog: {
          show: false,
          form: {
            clientCode: '',
            tags: ''
          }
        },
        openAccountDialog: {
          show: false,
          form: {
            mobileNo: '',
            password: '',
            nameCn: ''
          },
          rules: openAccountRules
        },
        modifyNameCnDialog: {
          show: false,
          form: {
            clientCode: '',
            nameCn: ''
          },
          rules: modifyNameCnRules
        },
        accountStatusDialog: {
          show: false,
          form: {
            id: '',
            status: ''
          }
        },
        tabs: {
          activeName1: 'bind',
          activeName2: 'base',
          activeName3: 'files',
          activeName4: 'remark',
          activeName5: 'bankInfo'
        },
        imagesMap: {
          front: {
            uploading: false,
            url: ''
          },
          back: {
            uploading: false,
            url: ''
          },
          holdon: {
            uploading: false,
            url: ''
          }
        },
        authMap: {
          realNameAuth: false,
          advancedAuth: false,
          phoneAuth: false,
          videoAuth:false
        }
      }
    },
    mounted() {
      this.query();
      this.getAuthCodeList();
      this.getClientGroupList();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          add: 'vc_gz_client_add',
          search: 'vc_gz_client_view',
          edit: 'vc_gz_client_edit',
          auth: 'vc_gz_client_auth',
          charge: 'vc_gz_client_charge',
          clientStatus: 'vc_gz_client_update_client_status',
          clientGroup: 'vc_gz_client_update_client_group',
          accountStatus: 'vc_gz_client_update_account_status',
          accountFlag: 'vc_gz_client_update_account_flag',
          authCodeList: 'vc_gz_client_auth_code_list',
          uploadConfig: 'vc_gz_client_upload_config',
          openAccount: 'vc_gz_client_open_account',
          categoryAuth:'vc_gz_client_category_auth',
          export: 'vc_gz_client_export',
          tradeInit: 'vc_gz_client_trade_init',
          modifyNameCn: 'vc_gz_client_edit_nickname',
          unbindIdcard: 'vc_gz_client_unbindIdcard',
          bindWallet:'vc_gz_client_bindWallet',
          upload:'vc_gz_client_upload',
        });
      },
      hasBankCard() {
        return !!(this.dialog.form.unifyInfo.bankCardInfo
          && this.dialog.form.unifyInfo.bankCardInfo.length
          && this.dialog.form.unifyInfo.bankCardInfo[0].bankAccountNumber);
      }
    },
    methods: {
      beforeUpload(file, fileType, businessType) {
        if (/\.(jpg|jpeg|png|bmp)$/.test(file.name.toLowerCase())) {
          this.uploadFile.uploadFileData.fileType = fileType;
          this.uploadFile.uploadFileData.businessType = businessType;
          return true;
        } else {
          this.$message.error('文件格式不正确！');
          return false;
        }

        this.imagesMap[fileType].uploading = true;
      },
      avatarSuccess(res, file, files, fileType) {
        this.imagesMap[fileType].uploading = false;
        if (res.code !== '0') {
          this.$message.error('上传图片失败');
          return;
        }
        this.$message.success('上传成功');
        this.imagesMap[fileType].url = res.data;
      },
      avatarError(err, file, fileList, fileType) {
        this.imagesMap[fileType].uploading = false;
        this.$message.error('上传图片失败' + err);
      },
       bankNameFmt(row) {
        if (row.bankName) {
          return getBankName(row.bankName);
        }
        return '';
      },
      idCardNoFmt(row) {
        return !row.cardNo?"":row.cardNo.toString().replace(/^(\w{6})(\w+)(\w{4})$/g,'$1****$3');
      },
      flagFmt(row) {
        if (typeof row.flag !== 'undefined' && this.flagMap[row.flag]) {
          return this.flagMap[row.flag].name;
        }
        return '';
      },
      typeFmt(row) {
        return typeof row.type !== 'undefined' ? this.typeMap[row.type] : '';
      },
      statusFmt(row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      accountStatusFmt(row) {
        return typeof row.status !== 'undefined' ? this.accountStatusMap[row.status] : '';
      },
      nickNameFmt(row) {
        if (row && row.extendInfo
          && row.extendInfo.ACC && row.extendInfo.ACC.extendInfo
          && row.extendInfo.ACC.extendInfo.nickName) {
          return row.extendInfo.ACC.extendInfo.nickName;
        }
        return '';
      },
      realNameAuthFmt(row) {
        return typeof row.realNameAuth !== 'undefined' ? this.authListMap[row.realNameAuth] : '';
      },
      advancedAuthFmt(row) {
        return typeof row.advancedAuth !== 'undefined' ? this.authListMap[row.advancedAuth] : '';
      },
      videoAuthFmt(row){
        let vt=row.videoAuth;
        return vt==2?'已认证':'未认证';
      },
      clientGroupFmt(row) {
        return typeof row.tags !== 'undefined' ? this.clientGroupMap[row.tags] : '';
      },
      walletFmt(row) {
        if (typeof row.bindWallet !== 'undefined' && this.walletMap[row.bindWallet]) {
          return this.walletMap[row.bindWallet];
        }
        return '';
      },
      /**
       * 日期格式化
       * */
      createDateFmt(row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      updateDateFmt(row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },

      verfycheckFun() {
         this.dialog.form.verifyType=this.dialog.form.verfycheck?'email':'';
      },
      /**
       * 解除实名验证
       * */
      unbindIdCardFun(clientCode,cardNo) {
        if(!cardNo||cardNo==''){
            this.$message({
                    type: 'warning',
                    message: '该客户还没有实名验证!'
                  });
            return;
        }
        this.$confirm('确定要取消实名验证?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let params = {
                clientCode
              };
              api.unbindIdCard(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '取消成功!'
                  });
                  this.flagDialog.show = false;
                  this.query();
                  // 记录日志
                  bsmp.log({
                    component: 'vc_gz',
                    type: 'unbindIdCard',
                    content: `[client] params: ${JSON.stringify(params)}`
                  });
                }
              });
            }).catch(e => {
            });
      },
      /**
       * 显示开立账户
       * */
      showOpenDialog(mobile,clientCode, clientStatus) {
        this.$prompt('请输入开立账户备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let params = {
            mobile,
            clientCode,
            clientStatus,
            remark: value
          };
          api.openAccount(params).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });

              this.query();

              // 记录日志
              bsmp.log({
                component: 'vc_gz',
                type: 'openAccount',
                content: `[client] params: ${JSON.stringify(params)}`
              });
            }
          });
        }).catch(() => {

        });
      },

      /**
       * 显示账户类别弹窗
       * */
      showAccountFlagDialog(id, flag) {
        this.flagDialog.show = true;
        this.flagDialog.form.id = id;
        this.flagDialog.form.flag = flag + '';
      },

      /**
       * 更新客户状态
       * */
      updateAccountFlag() {
        this.$refs['flagForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确定要更新该条记录的账户类别?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 更新账户类别
              api.updateAcFlag(this.flagDialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '更新成功!'
                  });
                  this.flagDialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'vc_gz',
                    type: 'updateAcFlag',
                    content: `[client] params: ${JSON.stringify(this.flagDialog.form)}`
                  });
                }
              });
            }).catch(e => {
            });
          }
        });
      },

      /**
       * 查询默认权限列表
       * */
      getAuthCodeList() {
        this.flagMap = {};
        return api.getAuthCodeList().then((res) => {
          let data = res.data;
          if (data && data.code === '0' && data.data && data.data.length) {
            data.data.forEach((item) => {
              this.flagMap[item.flag] = item;
            });
          }
        });
      },

      /**
       * 查询客户分组列表
       * */
      getClientGroupList() {
        this.clientGroupMap = {};
        return api.getClientGroupList({pageNo:1,pageSize:30,status:0}).then((res) => {
          let data = res.data;
          if (data && data.code === '0' && data.data && data.data.data.length) {
            data.data.data.forEach((item) => {
              this.clientGroupMap[item.id] = item.name;
            });
          }
        });
      },
      /**
       * 显示更新客户状态弹窗
       * */
      showClientStatusDialog(mobileNo, accountStatus, accountList, clientCode) {
        this.clientStatusDialog.form.mobileNo = mobileNo;
        this.clientStatusDialog.form.accountStatus = accountStatus + '';
        this.clientStatusDialog.form.clientCode = clientCode;

        if (accountList && accountList.length) {
          this.clientStatusDialog.form.accountCodes = accountList.map((item) => {
            return item.accountCode;
          }).join(',');
        } else {
          this.clientStatusDialog.form.accountCodes = '';
        }
        this.clientStatusDialog.show = true;
      },

      /**
       * 更新客户状态
       * */
      updateClientStatus() {
        this.$refs['clientStatusForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确定要更新该条记录的客户状态?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 更新客户状态
              api.updateClientStatus(this.clientStatusDialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '更新成功!'
                  });
                  this.clientStatusDialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'vc_gz',
                    type: 'updateClientStatus',
                    content: `[client] params: ${JSON.stringify(this.clientStatusDialog.form)}`
                  });
                }
              });
            }).catch(e => {
            });
          }
        });
      },

      /**
       * 显示更新客户组别弹窗
       * */
      showClientGroupDialog(clientCode, tags) {
        this.clientGroupDialog.form.clientCode = clientCode;
        this.clientGroupDialog.form.tags = tags != null ? tags + '' : '';

        this.clientGroupDialog.show = true;
      },

      /**
       * 更新客户组别
       * */
      updateClientGroup() {
        this.$refs['clientGroupForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确定要更新该条记录的客户组别?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 更新客户状态
              api.updateClientGroup(this.clientGroupDialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '更新成功!'
                  });
                  this.clientGroupDialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'vc_gz',
                    type: 'updateClientGroup',
                    content: `[client] params: ${JSON.stringify(this.clientGroupDialog.form)}`
                  });
                }
              });
            }).catch(e => {
            });
          }
        });
      },

      /**
       * 显示更新账户状态弹窗
       * */
      showAccountStatusDialog(id, status, accountCode) {
        this.accountStatusDialog.form.id = id;
        this.accountStatusDialog.form.status = status + '';
        this.accountStatusDialog.form.accountCode = accountCode;

        this.accountStatusDialog.show = true;
      },
      rcheckboxFun:function(row){
       if(this.dialog.form.realNameAuth !== '1' && this.authMap.realNameAuth){

       }
      },
      acheckboxFun:function(){

      },
      /**
       * 更新账户状态
       * */
      updateAccountStatus() {
        this.$refs['accountStatusForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确定要更新该条记录的账户状态?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 更新账户状态
              api.updateAcStatus(this.accountStatusDialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '更新成功!'
                  });
                  this.accountStatusDialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'vc_gz',
                    type: 'updateAccountStatus',
                    content: `[client] params: ${JSON.stringify(this.accountStatusDialog.form)}`
                  });
                }
              });
            }).catch(e => {
            });
          }
        });
      },

      changeAuthFlag() {
        if (this.authDialog.flag) {
          let flag = this.flagMap[this.authDialog.flag];
          this.authDialog.authCodes = flag.authCodes ? flag.authCodes.split(',').filter((code) => {
            return !!code.trim();
          }) : [];
        } else {
          this.authDialog.authCodes = [];
        }
      },

      /**
       * 显示权限设置弹窗
       * */
      showAuthDialog(type, accountCode, authCodes, flag) {
        this.authDialog.type = type;

        if (this.authDialog.type === 1) {
          // 账户权限设置
          this.authDialog.accountCode = accountCode;
          this.authDialog.flag = flag;
          if (authCodes) {
            this.authDialog.authCodes = authCodes.split(',').filter((code) => {
              return !!code.trim();
            });
          } else {
            this.authDialog.authCodes = [];
          }
        } else {
          // 账户类别权限设置
          this.authDialog.flag = null;
        }
        this.authDialog.show = true;

        if (!this.authDialog.appAuthList) {
          // 获取APP授权字典
          this.getVcAppAuthDict();
        }
      },

      /**
       * APP授权字典
       * */
      getVcAppAuthDict() {
        return bsmp.util.getDictByCode('vc_app_auth').then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.authDialog.appAuthList = data.data;
          }
        });
      },

      toAppAuth() {
        if (this.authDialog.type === 2 && !this.authDialog.flag) {
          this.$message({
            type: 'warning',
            message: '请选择账户类别!'
          });
          return;
        }
        if (!this.authDialog.authCodes.length) {
          this.$message({
            type: 'warning',
            message: '请选择授权项!'
          });
          return;
        }

        let params = {
          authCodes: this.authDialog.authCodes.join(',')
        };

        params.flag = this.authDialog.flag;
        if (this.authDialog.type === 1) {

          params.accountCode = this.authDialog.accountCode;
        }

        // 授权
        api.setAcAuth(params).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '授权成功!'
            });

            this.authDialog.show = false;
            this.query();
            this.getAuthCodeList();

            // 记录日志
            bsmp.log({
              component: 'vc_gz',
              type: 'setAcAuth',
              content: `[client] params: ${JSON.stringify(params)}`
            });
          }
        });
      },

      /**
       * 获取发币账号列表
       * */
      getClientAccounts() {
        return api.getClientAccounts(1).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.accounts = data.data;
          }
        });
      },

      /**
       * 获取可用数量
       * */
      getAvailableAmount() {
        if (!this.fundsDialog.form.accountCode) {
          return;
        }
        this.accounts && this.accounts.length && this.accounts.forEach((account) => {
          account.accountCurList && account.accountCurList.length && account.accountCurList.forEach((item) => {
            if (item.currencyCode === this.fundsDialog.form.currencyCode && item.accountCode ==1 ) {
               this.fundsDialog.form.availableAmount = item.availableAmount;
            }
          });
        });
      },
      /**
       * 显示扣币弹窗
       **/
      showRetCoinDialog(accountCode, currencyCode, amount) {
        if (this.$refs['retCoinForm'] && this.$refs['retCoinForm'].resetFields) {
            this.$refs['retCoinForm'].resetFields();
        }

        this.retCoinDialog.form = {
          accountCode: accountCode,
          currencyCode: currencyCode,
          accountCodeTarget:1,
          availableAmount: amount,
          amount: 0
        };
        this.retCoinDialog.show = true;
        this.retCoinDialog.isSubmit=false;
      },
      /**
       * 显示充币弹窗
       * */
      showFundsDialog(accountCode, currencyCode) {
        if (this.$refs['fundsForm'] && this.$refs['fundsForm'].resetFields) {
          this.$refs['fundsForm'].resetFields();
        }

        this.fundsDialog.form = {
          accountCode: '',
          accountCodeTarget: accountCode,
          currencyCode: currencyCode,
          availableAmount: 0,
          amount: 1
        };
        this.getClientAccounts();
        this.fundsDialog.show = true;
        this.fundsDialog.isSubmit=false;
      },

      submitFundsForm() {
        this.$refs['fundsForm'].validate((valid) => {
          if (valid && !this.fundsDialog.isSubmit) {
            // 充币
            this.fundsDialog.isSubmit=true;
            this.fundsDialog.show = false;
            this.$message({type: 'info',message: '正在充币....'});
            api.addAmounts(this.fundsDialog.form).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '充币成功!'
                });
                this.query();
                // 记录日志
                bsmp.log({
                  component: 'vc_gz',
                  type: 'inCoin',
                  content: `[client] params: ${JSON.stringify(this.fundsDialog.form)}`
                });
              }
              this.fundsDialog.isSubmit=false;
            });
          }
        });
      },
      submitRetCoinForm() {
        this.$refs['retCoinForm'].validate((valid) => {
          if (valid && !this.retCoinDialog.isSubmit) {
            // 扣币
            this.retCoinDialog.isSubmit=true;
            this.retCoinDialog.show = false;
            this.$message({type: 'info',message: '正在扣币....'});
            api.addAmounts(this.retCoinDialog.form).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '扣币成功，币已扣回到系统账号!'
                });

                this.query();
                // 记录日志
                bsmp.log({
                  component: 'vc_gz',
                  type: 'outCoin',
                  content: `[client] params: ${JSON.stringify(this.retCoinDialog.form)}`
                });
              }
              this.retCoinDialog.isSubmit=false;
            });
          }
        });
      },
      /**
       * 显示弹窗
       **/
      showBindWalletDialog(account) {
        if (this.$refs['bindWalletForm'] && this.$refs['bindWalletForm'].resetFields) {
          this.$refs['bindWalletForm'].resetFields();
        }

        this.bindWalletDialog.form = {
          accountId: account.id,
          walletId: account.walletUid
        };

        this.bindWalletDialog.show = true;
      },

      submitBindWalletForm() {
        this.$refs['bindWalletForm'].validate((valid) => {
          if (valid) {
            // 设置初始值
            api.toBindWalletId(this.bindWalletDialog.form).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });

                this.bindWalletDialog.show = false;
                this.query();

                // 记录日志
                bsmp.log({
                  component: 'vc_gz',
                  type: 'bindWallet',
                  content: `[client] params: ${JSON.stringify(this.bindWalletDialog.form)}`
                });
              }
            });
          }
        });
      },
      /**
       * 显示弹窗
       **/
      showTradeInitDialog(accountCode, currencyCode, tradeInit) {
        if (this.$refs['tradeInitForm'] && this.$refs['tradeInitForm'].resetFields) {
          this.$refs['tradeInitForm'].resetFields();
        }

        this.tradeInitDialog.form = {
          accountCode: accountCode,
          currencyCode: currencyCode,
          tradeInit: tradeInit
        };

        this.tradeInitDialog.show = true;
      },

      submitTradeInitForm() {
        this.$refs['tradeInitForm'].validate((valid) => {
          if (valid) {
            // 设置初始值
            api.setTradeInit(this.tradeInitDialog.form).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });

                this.tradeInitDialog.show = false;
                this.query();

                // 记录日志
                bsmp.log({
                  component: 'vc_gz',
                  type: 'setTradeInit',
                  content: `[client] params: ${JSON.stringify(this.tradeInitDialog.form)}`
                });
              }
            });
          }
        });
      },
      showOpenAccountDialog() {
        this.openAccountDialog.form.mobileNo = '';
        this.openAccountDialog.form.password = '';
        this.openAccountDialog.form.nameCn = '';
        this.openAccountDialog.show = true;
      },
      submitOpenAccountForm() {
        this.$refs['openAccountForm'].validate((valid) => {
          if (valid) {
            // 设置初始值
            api.registerAccount(this.openAccountDialog.form).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '账号开立成功!'
                });

                this.openAccountDialog.show = false;
                this.query();

                // 记录日志
                bsmp.log({
                  component: 'vc_gz',
                  type: 'OpenAccount',
                  content: `[client] params: ${JSON.stringify(this.OpenAccountDialog.form)}`
                });
              }
            });
          }
        });
      },

      /**
       * 显示修改昵称
       * */
      showModifyNameCnDialog(row) {
        if (row && row.extendInfo
          && row.extendInfo.ACC && row.extendInfo.ACC.extendInfo
          && row.extendInfo.ACC.extendInfo.nickName) {
          this.modifyNameCnDialog.form.nameCn = row.extendInfo.ACC.extendInfo.nickName;
        }
        this.modifyNameCnDialog.form.clientCode = row.clientCode;
        this.modifyNameCnDialog.show = true;
      },
      submitModifyNameCnForm() {
        this.$refs['modifyNameCnForm'].validate((valid) => {
          if (valid) {
            // 设置初始值
            api.modifyNameCn(this.modifyNameCnDialog.form).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '昵称修改成功!'
                });

                this.modifyNameCnDialog.show = false;
                this.query();

                // 记录日志
                bsmp.log({
                  component: 'vc_gz',
                  type: 'ModifyNameCn',
                  content: `[client] params: ${JSON.stringify(this.modifyNameCnDialog.form)}`
                });
              }
            });
          }
        });
      },
      /**
       * 获取账户信息
       * */
      getClientByMobileNo(mobileNo) {
        this.loading = true;
        api.getClientByMobileNo(mobileNo).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            let form = data.data;

            // 客户编码
            this.dialog.form.clientCode = form.clientCode;
            // 注册时间
            if (form && form.accountList && form.accountList.length) {
              this.dialog.form.createDate = form.accountList[0].createDate;
              this.dialog.form.createIp = form.accountList[0].createIp;
            }

            // 认证
               let isCheckbox=(form.verifyType && form.verifyType.indexOf('email')!=-1)?true:false;
            this.dialog.form.verfycheck=isCheckbox;
            this.dialog.form.dbverfycheck=isCheckbox;
            this.dialog.form.realNameAuth = form.realNameAuth;
            this.dialog.form.advancedAuth = form.advancedAuth;
            this.dialog.form.phoneAuth = form.phoneAuth;
            this.authMap.realNameAuth = form.realNameAuth === '1';
            this.authMap.advancedAuth = form.advancedAuth === '1';
            this.authMap.phoneAuth = form.phoneAuth === '1';
            this.dialog.form.videoAuth =form.videoAuth;
            this.authMap.videoAuth = (this.dialog.form.videoAuth==2);
            this.imagesMap['front'].url=form.idCardFrontend;
              this.imagesMap['back'].url=form.idCardBackend;
              this.imagesMap['holdon'].url=form.idCardHand;
            this.dialog.form.fillemail = form.email;
            this.dialog.form.emailAuth=form.emailAuth;
            this.dialog.form.email = form.email;
            this.dialog.form.unifyInfo = form.unifyInfo;
            this.dialog.form.accountList = form.accountList;

            this.dialog.form.unifyInfo.idCardInfo.idCardType = '1';

            if (this.dialog.form.unifyInfo.baseInfo.birthday) {
              this.dialog.form.unifyInfo.baseInfo.birthday =
                bsmp.util.formatDate.parse(this.dialog.form.unifyInfo.baseInfo.birthday, 'yyyy-MM-dd');
            }

            this.dialog.form.remark = form.remark;

            //this.dialog.form = data.data;
            this.loading = false;
            this.dialog.show = true;
          }else{
            this.loading = false;
          }
        }).catch(e => {
          this.loading = false;
        });
      },

      /**
       * 显示弹窗
       * */
      showDialog(type, index) {
        if (this.$refs['clientForm'] && this.$refs['clientForm'].resetFields) {
          this.$refs['clientForm'].resetFields();
        }

        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;

          let form = {...this.table.items[index]};

          this.dialog.form = {
            clientCode: '',
            createDate: null,
            createIp: null,
            realNameAuth: '0',
            advancedAuth: '0',
            phoneAuth: '0',
            emailAuth:0,
            email: '',
            verfycheck:false,
            dbverfycheck:false,
            verifyTypes:'',
            bankName: '',
            bankBranch: '',
            bankAccountNumber: '',
            unifyInfo: {
              baseInfo: {
                birthday: "",
                cnName: "",
                nationality: "",
                sex: 0,
                mobile: "",
                email: ""
              },
              bankCardInfo: [
                {
                  bankAccountName: "",
                  bankBranch: "",
                  bankCounty: "",
                  bankName: "",
                  bankOther: "",
                  bankAddress: "",
                  bankCountry: "",
                  bankCity: "",
                  bankId: 0,
                  bankAccountType: "",
                  bankAccountNumber: "",
                  internationalRemittanceCode: "",
                  bankProvince: "",
                  bankAccountCurrency: ""
                }
              ],
              idCardInfo: {
                idCardType: "",
                cnName: "",
                idCardCountry: "",
                idCardNo: "",
                idCardAddress: "",
                idCardCountryOther: ""
              }
            },
            accountList: [],
            remark: ''
          };
          // 获取详细信息
          this.getClientByMobileNo(form.mobileNo);

          this.imagesMap = {
            front: {
              uploading: false,
              url: ''
            },
            back: {
              uploading: false,
              url: ''
            },
            holdon: {
              uploading: false,
              url: ''
            }
          };
        }
      },

      submitForm() {

        // 判断是否编辑，未编辑不生成提案
        let editCount = 0;
        if (this.authMap.realNameAuth && this.dialog.form.realNameAuth !== '1') {
          editCount++;
        }
        if (this.authMap.advancedAuth && this.dialog.form.advancedAuth !== '1') {
          editCount++;
        }
        if (this.authMap.videoAuth && this.dialog.form.videoAuth !=2) {
            editCount++;
        }
        var bindEmail=false,dbcheckEmail=false;
        if(this.dialog.form.verifyType=='email' && this.dialog.form.fillemail){
             bindEmail=true;
             dbcheckEmail=this.dialog.form.dbverfycheck;
        }

        if (editCount === 0 && !bindEmail) {
          this.dialog.show = false;
          return;
        }

        if (this.dialog.form.unifyInfo.baseInfo.mobile
          && !bsmp.util.isMobile(this.dialog.form.unifyInfo.baseInfo.mobile)) {
          this.$message.warning('请输入正确的手机号码');
          return;
        }

        if (bindEmail && !bsmp.util.isEmail(this.dialog.form.fillemail)) {
             this.$message.warning('请输入正确的Email');
             return;
        }

        let params = {
          mobileNo: this.dialog.form.unifyInfo.baseInfo.mobile,
          clientCode: this.dialog.form.clientCode,
          name: this.dialog.form.unifyInfo.baseInfo.cnName,
          nationality: this.dialog.form.unifyInfo.baseInfo.nationality,
          email: this.dialog.form.fillemail,
          verifyType: this.dialog.form.verifyType,
          realName: this.dialog.form.unifyInfo.baseInfo.cnName,
          idCardType: this.dialog.form.unifyInfo.idCardInfo.idCardType,
          cardNo: this.dialog.form.unifyInfo.idCardInfo.idCardNo,
          bankName: this.dialog.form.bankName,
          bankBranch: this.dialog.form.bankBranch,
          bankAccountNumber: this.dialog.form.bankAccountNumber,
          remark: this.dialog.form.remark
        };
        if(!bindEmail){
            if (this.imagesMap.front.url) {
              params.frontIdCard = this.imagesMap.front.url;
            }
            if (this.imagesMap.back.url) {
              params.backIdCard = this.imagesMap.back.url;
            }
            if (this.imagesMap.holdon.url) {
              params.holdonIdCard = this.imagesMap.holdon.url;
            }
            if (this.authMap.realNameAuth && this.dialog.form.realNameAuth !== '1') {
              params.approveType = '1';
              if(!params.realName || params.realName==''||!params.cardNo || params.cardNo==''){
                  this.$message({
                    type: 'warning',
                    message: '实名认证需填写真实姓名及身份证号码!'
                  });
                  return;
              }
            } else if (this.authMap.advancedAuth && this.dialog.form.advancedAuth !== '1') {
              params.approveType = '2';
              if(!params.frontIdCard || params.frontIdCard==''||!params.backIdCard || params.backIdCard==''){
                  this.$message({
                    type: 'warning',
                    message: '身份认证需要上传身份证正反面!'
                  });
                  return;
              }
            } else if (this.authMap.videoAuth && this.dialog.form.videoAuth !=2) {
                params.approveType = '4';
            }

            if (this.dialog.form.unifyInfo.baseInfo.birthday) {
              params.birthDay = bsmp.util.formatDate.format(this.dialog.form.unifyInfo.baseInfo.birthday, 'yyyy-MM-dd')
            }
        }

          // 保存提案
          api.saveClient(params).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });

              this.dialog.show = false;
              this.query();
              if(params.approveType){
                this.$message({
                  type: 'info',
                  message: '认证提案已生成，请到【客户资料审批】审批提案!'
                });
              }
              if(bindEmail){
                  if(data.data==true){
                       this.$message({
                        type: 'info',
                        message: '设置邮箱收取验证码成功，已给客户邮箱发送认证链接，请通知客户登录邮箱认证!'
                      });
                  }else{
                     this.$message({
                        type: 'info',
                        message: '设置邮箱收取验证码成功!'
                      });
                  }
              }
              // 记录日志
              bsmp.log({
                component: 'vc_gz',
                type: 'save',
                content: `[client] params: ${JSON.stringify(params)}`
              });
            }else{
               if(data && data.code!=0){
                  this.$message({
                      type: 'warning',
                      message: data.msg
                    });
               }
            }
          });
      },

      handleDownload() {

        if (!this.table.items.length) {
          this.$message.warning('查询结果为空，没有可导出的数据！');
          return;
        }

        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);

        if (!params.isRealnamecheck) {
          params.isRealnamecheck = '0';
        }
        if (!params.isAdvancheck) {
          params.isAdvancheck = '0';
        }
          if (this.search.datetime && this.search.datetime.length) {
              if (this.search.datetime[0]) {
                  params.startDate = this.dateToStr(this.search.datetime[0]);
              }
              if (this.search.datetime[1]) {
                  params.endDate = this.dateToStr(new Date(this.search.datetime[1].setHours(23, 59, 59, 0)));
              }
          }
          delete params.datetime;
        params.pageNumber = 1;
        params.pageSize = 1000000;

        this.downloading = true;
        api.getClientList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.code === '0') {
            if (data.data.data instanceof Array) {
              items = data.data.data;

              let filedHeader = ['客户呢称', '客户编码', '手机号码', '邮箱', '状态','客户组别', '真实姓名','身份证号码',
                  '实名认证', '身份认证', '视频认证', '创建时间'],
                fieldNames = ['nickName', 'clientCode', 'mobileNo', 'email', 'status','tags', 'realName','cardNo',
                  'realNameAuth', 'advancedAuth', 'videoAuth', 'createDate'];

              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {
                nickName: {map: this.nickNameFmt},
                clientCode: {tab: true},
                mobileNo: {tab: true},
                  email: {tab: true},
                cardNo: {tab: true},
                status: {map: this.accountStatusFmt},
                tags:{map: this.clientGroupFmt},
                realNameAuth: {map: this.realNameAuthFmt},
                advancedAuth: {map: this.advancedAuthFmt},
                videoAuth: {map: this.videoAuthFmt},
                createDate: {map: this.createDateFmt, tab: true}
              });
              bsmp.util.excellentExport.csvByData('客户信息维护.csv', filedHeader, filedData);
            }
            this.downloading = false;
          }
        });
      },

        /**
         * 日期格式化
         * */
        dateToStr(date) {
            return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm:ss');
        },
      /**
       * 查询
       */
      query() {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);

        if (!params.isRealnamecheck) {
          params.isRealnamecheck = '0';
        }
        if (!params.isAdvancheck) {
          params.isAdvancheck = '0';
        }
        if (this.search.datetime && this.search.datetime.length) {
          if (this.search.datetime[0]) {
              params.startDate = this.dateToStr(this.search.datetime[0]);
          }
          if (this.search.datetime[1]) {
              params.endDate = this.dateToStr(new Date(this.search.datetime[1].setHours(23, 59, 59, 0)));
          }
        }
          delete params.datetime;

        api.getClientList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager.total = data.data.total;
          } else {
            this.table.items = [];
            this.table.pager = {
              pageNo: 1,
              total: 0
            };
          }
        });
      },

      /**
       * 每页显示条数变化
       * @param val
       */
      handleSizeChange(val) {
        this.table.pager.pageSize = val;
        this.query();
      },

      /**
       * 页码变化
       * @param val
       */
      handleCurrentChange(val) {
        if (this.table.pager.pageNo) {
          this.table.pager.pageNo = val;
          this.query();
        }
      }
    }
  };

  let validatePhone = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入手机号码'));
    } else {
      if (bsmp.util.isMobile(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的手机号码'));
      }
    }
  };
  // 表单规则
  let rules = {

  };

  let fundsRules = {
    accountCode: [
      {required: true, message: '请选择发币账号', trigger: 'change'}
    ],
    accountCodeTarget: [
      {required: true, message: '请输入目标账号', trigger: 'blur'}
    ]
  };

  let tradeInitRules = {

  };

    let openAccountRules = {
      mobileNo: [
        {required: true, message: '请输入手机号', trigger: 'blur'},
        {
          pattern: /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/,
          message: '请输入正确的手机号'
        }
      ],
      password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
        {
          pattern: /^(\w){8,20}$/,
          message: '只能输入8-20个字母、数字、下划线'
        }
      ],
      nameCn: [
        {required: true, message: '请输入昵称', trigger: 'blur'}/*,
        {
          pattern: /^(\w){3,15}$/,
          message: '只能输入3-15个字母、数字、下划线'
        }*/
      ]
    };

  let modifyNameCnRules = {
    nameCn: [
      {required: true, message: '请输入昵称', trigger: 'blur'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .form-detail
    .el-form-item
      margin-bottom 10px !important

  .head-check
    .el-checkbox
      display block
    .el-checkbox + .el-checkbox
      margin-left 0 !important

  .stat-table
    width 80%
    thead
      color #5e6d82
      background-color #eff2f7
      th
        text-align center
        border 1px solid rgb(223, 230, 236)
    tbody
      td
        text-align center
        border 1px solid rgb(223, 230, 236)

  .file-table
    width 100% !important
    line-height 30px
    margin-bottom 20px

  .tips
    color #e64242
</style>
