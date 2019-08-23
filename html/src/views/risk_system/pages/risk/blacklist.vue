<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <div style="margin-top: 20px;">
          <el-radio-group v-model="radioType" @change="handleChangeClick">
            <el-radio-button label="黑名单"></el-radio-button>
            <el-radio-button label="危险名单"></el-radio-button>
            <el-radio-button label="白名单"></el-radio-button>
          </el-radio-group>
        </div>
        <br>
        <el-form-item prop="accountName">
          <el-input v-model="search.accountName" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.idCard" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="accountNo">
          <el-input v-model="search.accountNo" placeholder="账户"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.bankCard" placeholder="银行卡"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.riskMark" clearable filterable placeholder="案件标签">
            <el-option v-for="(val, key) in labelMap" :label="val[0]" :value="val[1]"
                       :key="'search-riskMark-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.tradePlatform" clearable filterable placeholder="交易平台">
            <el-option v-for="(val, key) in tradePlatformMap" :label="key" :value="key"
                       :key="'search-tradePlatform-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item>
          <el-input v-model="search.ip" placeholder="IP地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.imei" placeholder="IMEI"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.email" placeholder="邮箱地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.batchId" placeholder="导入批次号"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" prop="createDate">
          <el-date-picker
            clearable
            v-model="search.createDate"
            type="daterange"
            placeholder="创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="冻结/解冻时间：" prop="freezeDate">
          <el-date-picker
            clearable
            v-model="search.freezeDate"
            type="daterange"
            placeholder="冻结/解冻时间">
          </el-date-picker>
        </el-form-item>
        <br>
        <el-form-item>
          <el-input v-model="search.sourceOuter" placeholder="外部数据源"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.cookie" placeholder="cookie"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.idfa" placeholder="idfa"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.uuid" placeholder="uuid"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.deviceId" placeholder="设备ID"></el-input>
        </el-form-item>
        <el-form-item prop="payMark">
          <el-input v-model="search.payMark" placeholder="支付标记" v-show="radioType === '危险名单'"></el-input>
        </el-form-item>
        <el-form-item prop="verifyMark">
          <el-input v-model="search.verifyMark" placeholder="验证标记" v-show="radioType === '危险名单'"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="操作类型：" prop="optype">
          <el-select clearable v-model="search.optype">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(val, key) in optypeMap" :label="val" :value="key"
                       :key="'search-optype-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：" prop="status">
          <el-select clearable v-model="search.status">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.export" type="primary" @click="exportExcel" title="导出" :loading="downloading"><i class="icon-download"></i>导出查询结果</el-button>
        </el-form-item>
        <el-tooltip class="item item-doubt" effect="dark" content="单次导出最大不要超过80000条记录，可调整查询时间点导出相应内容" placement="bottom">
          <i class="icon-info"></i>
        </el-tooltip>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button v-show="optAuth.save" @click="showDialog(1)" type="primary">新增</el-button>
      <el-button v-show="optAuth.import" @click="importExcel" type="primary"><i class="icon-upload"></i>&nbsp;&nbsp;导入</el-button>
      <el-button v-show="optAuth.approve" @click="approveMultiple" type="primary">批量审核</el-button>
      <el-button v-show="optAuth.del" @click="deleteMultiple" type="danger">批量删除</el-button>
      <el-button v-show="optAuth.freeze" @click="freezeMultiple" type="warning">批量冻结/解冻</el-button>
      <el-button type="primary" v-show="optAuth.export">&nbsp;<a href="static/files/risk_data_template.xlsx" download="risk_data_template" id="hf">下载模板</a></el-button>
    </el-row>
    <el-table
      id="tableExcel"
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 200"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="item">
          <el-form label-position="left" inline class="ele-table-expand" label-width="0px" style="width: 40%">
            <el-form-item>
              <span class="label">流水号:</span>
              <span>{{ item.row.flowNo }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">批次号:</span>
              <span>{{ item.row.batchId }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">交易平台:</span>
              <span>{{ item.row.tradePlatform }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">标签编码:</span>
              <span>{{ item.row.riskMark }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">IP地址:</span>
              <span>{{ item.row.ip }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">IMEI：</span>
              <span>{{ item.row.imei }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">cookie：</span>
              <span>{{ item.row.cookie }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">创建时间:</span>
              <span>{{item.row.createDate == null?'':item.row.createDate.substr(0, 19) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">创建人员:</span>
              <span>{{ item.row.createUser }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">修改时间:</span>
              <span>{{ item.row.updateDate == null?'':item.row.updateDate.substr(0, 19) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">修改人员:</span>
              <span>{{ item.row.updateUser }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">审核人员:</span>
              <span>{{ item.row.approveUser }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">审核描述:</span>
              <span>{{ item.row.approveRemark }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">数据来源:</span>
              <span>{{ item.row.source }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">IDFA:</span>
              <span>{{ item.row.idfa }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">UUID:</span>
              <span>{{ item.row.uuid }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">设备ID:</span>
              <span>{{ item.row.deviceId }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">外部数据源:</span>
              <span>{{ item.row.sourceOuter }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="phone"
        label="手机号码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号"
        width="230">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bankCard"
        label="银行卡号"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountName"
        label="客户姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="accountNo"
        label="账户"
        width="120">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="riskMark"
        label="标签编码"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="payMark"
        label="支付标记"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="verifyMark"
        label="验证标记"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :formatter="levelFmt"
        prop="level"
        label="案件等级"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bu"
        label="案件来源"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :formatter="optypeNameFmt"
        prop="optype"
        label="操作类型"
        width="100">
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        :formatter="freezeDateFmt"
        prop="freezeDate"
        label="冻结/解冻时间"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :formatter="statusFmt"
        prop="status"
        label="审核状态"
        width="150">
      </el-table-column>
      <el-table-column
        sortable
        :show-overflow-tooltip="true"
        :formatter="approveDateFmt"
        prop="approveDate"
        label="审核时间"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="删除" v-show="optAuth.del && scope.row.status ===0 " size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)">
            <i class="icon-trash-empty"></i>
          </el-button>
          <el-button title="编辑" v-show="optAuth.update" size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)">
            <i class="icon-edit-square"></i>
          </el-button>
          <el-button title="审核" v-show="optAuth.approve && scope.row.status ===0 " size="mini"
                     @click.native.prevent="showApproveDialog(3, scope.$index)"><i class="icon-ok-circled"></i></el-button>
          <el-button title="冻结" @click="freezeItem(scope.row.id, 'freeze_manual')" v-show="optAuth.freeze && scope.row.optype === 'unfreeze_manual'" size="mini">
            <i class="icon-play"></i>
          </el-button>
          <el-button title="解冻" @click="unfreezeItem(scope.row.id, 'unfreeze_manual')" v-show="optAuth.freeze && scope.row.optype === 'freeze_manual'" size="mini">
            <i class="icon-stop"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.page"
                   :page-sizes="[10, 20, 50, 100, 1000, 3000]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <span class="tips" v-show="this.radioType === '黑名单'">[至少选填一个有效证件信息]</span>
      <el-form ref="blackListForm" :model="dialog.form" :rules="dialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户姓名：" prop="accountName">
              <el-input v-model="dialog.form.accountName" placeholder="客户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户：" prop="accountNo">
              <el-input v-model="dialog.form.accountNo" placeholder="账户"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="案件标签：" prop="riskMark">
              <el-select v-model="dialog.form.riskMark" filterable placeholder="案件标签">
                <el-option v-for="(val, key) in labelMap" :label="val[0]" :value="val[1]"
                           :key="'add-form-riskMark-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证：" prop="idCard">
              <el-input v-model="dialog.form.idCard" placeholder="身份证"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作类型：" prop="optype">
              <el-select clearable v-model="dialog.form.optype" placeholder="操作类型" :disabled="dialog.type === 1 || dialog.type === 2">
                <el-option v-for="(val, key) in optypeMap" :label="val" :value="key"
                           :key="'edit-optype-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="dialog.form.phone" placeholder="手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="案件等级：" prop="level">
              <el-select clearable v-model="dialog.form.level" placeholder="案件等级" :disabled="dialog.type === 1 || dialog.type === 2">
                <el-option v-for="(val, key) in levelMap" :label="val" :value="key"
                           :key="'edit-level-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP地址：" prop="ip">
              <el-input v-model="dialog.form.ip" placeholder="IP地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="案件来源：" prop="bu">
              <el-select clearable v-model="dialog.form.bu" :disabled="dialog.type === 1 || dialog.type === 2">
                <el-option v-for="(val, key) in sourceMap" :label="key" :value="key"
                           :key="'add-source-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱地址：" prop="email">
              <el-input v-model="dialog.form.email" placeholder="邮箱地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="银行卡号：" prop="bankCard">
              <el-input v-model="dialog.form.bankCard" placeholder="银行卡号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批次号：" prop="batchId">
              <el-input v-model="dialog.form.batchId" placeholder="批次号" :disabled="dialog.type === 1 || dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="IMEI：" prop="imei">
              <el-input v-model="dialog.form.imei" placeholder="IMEI"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cookie：" prop="cookie">
              <el-input v-model="dialog.form.cookie" placeholder="cookie"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="IDFA：" prop="idfa">
              <el-input v-model="dialog.form.idfa" placeholder="IDFA"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="UUID：" prop="uuid">
              <el-input v-model="dialog.form.uuid" placeholder="UUID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交易平台：" prop="tradePlatform">
              <el-select clearable v-model="dialog.form.tradePlatform" :disabled="dialog.type === 3">
                <el-option v-for="(val, key) in tradePlatformMap" :label="key" :value="key"
                           :key="'add-tradePlatform-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备ID：" prop="deviceId">
              <el-input v-model="dialog.form.deviceId" placeholder="设备ID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="外部数据源：" prop="sourceOuter">
              <el-input v-model="dialog.form.sourceOuter" placeholder="外部数据源"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="dialog.form.remark" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 审核弹窗框 -->
    <el-dialog :title="approveDailog.title" v-model="approveDailog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="approveForm" :model="approveDailog.form" :rules="approveDailog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户姓名：" prop="accountName">
              <el-input v-model="approveDailog.form.accountName" placeholder="客户姓名" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户：" prop="accountNo">
              <el-input v-model="approveDailog.form.accountNo" placeholder="账户" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="案件标签：" prop="riskMark">
              <el-select v-model="approveDailog.form.riskMark" filterable placeholder="案件标签" :disabled="approveDailog.type === 3">
                <el-option v-for="(val, key) in labelMap" :label="val[0]" :value="val[1]"
                           :key="'approve-form-riskMark-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证：" prop="idCard">
              <el-input v-model="approveDailog.form.idCard" placeholder="身份证" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作类型：" prop="optype">
              <el-select clearable v-model="approveDailog.form.optype" placeholder="操作类型" :disabled="approveDailog.type === 3">
                <el-option v-for="(val, key) in optypeMap" :label="val" :value="key"
                           :key="'approve-optype-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="approveDailog.form.phone" placeholder="手机号" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="案件等级：" prop="level">
              <el-select clearable v-model="approveDailog.form.level" placeholder="案件等级" :disabled="approveDailog.type === 3">
                <el-option v-for="(val, key) in levelMap" :label="val" :value="key"
                           :key="'approve-level-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交易平台：" prop="tradePlatform">
              <el-select clearable v-model="approveDailog.form.tradePlatform" :disabled="approveDailog.type === 3">
                <el-option v-for="(val, key) in tradePlatformMap" :label="key" :value="key"
                           :key="'approve-tradePlatform-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="案件来源：" prop="bu">
              <el-select clearable v-model="approveDailog.form.bu" :disabled="approveDailog.type === 3">
                <el-option v-for="(val, key) in sourceMap" :label="key" :value="key"
                           :key="'approve-bu-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱地址：" prop="email">
              <el-input v-model="approveDailog.form.email" placeholder="邮箱地址" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="银行卡号：" prop="bankCard">
              <el-input v-model="approveDailog.form.bankCard" placeholder="银行卡号" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批次号：" prop="batchId">
              <el-input v-model="approveDailog.form.batchId" placeholder="批次号" :disabled="approveDailog.type === 1 || approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="IP地址：" prop="ip">
              <el-input v-model="approveDailog.form.ip" placeholder="IP地址" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IMEI：" prop="imei">
              <el-input v-model="approveDailog.form.imei" placeholder="IMEI" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="cookie：" prop="cookie">
              <el-input v-model="approveDailog.form.cookie" placeholder="cookie" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备ID：" prop="deviceId">
              <el-input v-model="approveDailog.form.deviceId" placeholder="设备ID" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="IDFA：" prop="idfa">
              <el-input v-model="approveDailog.form.idfa" placeholder="IDFA" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="UUID：" prop="uuid">
              <el-input v-model="approveDailog.form.uuid" placeholder="UUID" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="外部数据源：" prop="sourceOuter">
              <el-input v-model="approveDailog.form.sourceOuter" placeholder="外部数据源" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="approveDailog.form.remark" type="textarea" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核状态：" prop="status">
              <el-select clearable v-model="approveDailog.form.status">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'approve-approveType-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="审核描述：" prop="approveRemark">
              <el-input v-model="approveDailog.form.approveRemark" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelApproveForm">取 消</el-button>
        <el-button type="primary" @click="submitApproveForm(3)">确定</el-button>
      </div>
    </el-dialog>
    <!-- /审核弹窗框 -->

    <!-- 批量审核弹窗框 -->
    <el-dialog :title="multiApproveDailog.title" v-model="multiApproveDailog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="multiApproveForm" :model="multiApproveDailog.form" :rules="multiApproveDailog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核状态：" prop="status">
              <el-select clearable v-model="multiApproveDailog.form.status">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'approve-multiApproveType-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="审核描述：" prop="approveRemark">
              <el-input v-model="multiApproveDailog.form.approveRemark" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMultiApproveForm">取 消</el-button>
        <el-button type="primary" @click="approveMultipleItem()">确定</el-button>
      </div>
    </el-dialog>
    <!-- /批量审核弹窗框 -->

    <el-dialog :title="uploadDialog.title" v-model="uploadDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="uploadForm" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-upload
              v-show="optAuth.import"
              :action="uploadFile.uploadFileUrl"
              :show-file-list="false"
              :on-success="avatarSuccess"
              :before-upload="beforeUpload"
              :on-error="avatarError"
              :data="uploadFile.uploadFileImg"
              :headers="uploadFile.uploadFileImg"
            >
              <el-button size="small">选择文件</el-button>
            </el-upload>
          </el-col>
          <el-col :span="22">
            <img v-if="imageUrl" :src="imageUrl" class="show-img">
            <img v-else src="static/images/ewm-file.png">
            <br><br>
            <div v-if="imageUrl">文件地址：<a href="imageUrl" target="_blank">{{imageUrl}}</a></div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 批量冻结/解冻弹窗框 -->
    <el-dialog :title="multiFreezeDailog.title" v-model="multiFreezeDailog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="multiFreezeForm" :model="multiFreezeDailog.form" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="操作类型：" prop="optype">
              <el-radio class="radio" v-model="multiFreezeDailog.form.optype"
                        v-for="(val, key) in optypeMap2"
                        :key="'multiFreeze-form-optype-'+ key"
                        :label="key">{{val}}
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMultiFreezeForm">取 消</el-button>
        <el-button type="primary" @click="submitMultipleFreezeItem()">确定</el-button>
      </div>
    </el-dialog>
    <!-- /批量冻结/解冻弹窗框 -->
  </div>
</template>

<style lang="stylus" scoped>
  .ele-table-expand {

    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 34%;

      .label {
        display: inline-block;
        margin-left: 40px;
        width: 80px;
        color: #99a9bf;
      }
    }
  }

  a {
    text-decoration:none;
    color:#fff;
  }
</style>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'risk_system_blacklist',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        labelMap: {},
        userInfo: null,
        downloading: false,
        loading: true,
        radioType: '黑名单',
        radio: 'freeze_manual',
        search: {
          accountName: '',
          accountNo: '',
          bu: '',
          riskMark: '',
          idCard: '',
          phone: '',
          bankCard: '',
          batchId: '',
          ip: '',
          imei: '',
          cookie: '',
          email:'',
          status: '',
          createDate: '',
          freezeDate: '',
          optype:'',
          source: '',
          sourceOuter: '',
          tradePlatform: '',
          idfa: '',
          uuid: '',
          deviceId: '',
          payMark: '',
          verifyMark: '',
          sort: 'update_date',
          order: 'desc'
        },
        table: {
          items: [],
          pager: {
            pageSize: 10,
            pageNo: 1,
            total: 0
          }
        },
        tradePlatformMap: {
          'GTS':'GTS',
          'GTS2':'GTS2',
          'MT4':'MT4',
          'MT5':'MT5'
        },
        sourceMap: {
          'GWPM': '金道贵金属',
          'GWFX': '金道外汇',
          'HXPM': '恒信贵金属',
          'HXFX': '恒信外汇',
          'CFPM': '创富贵金属',
          'CFFX': '创富外汇'
        },
        riskMarkMap: {
          'P1': 'P1',
          'P2': 'P2',
          'P3': 'P3',
          'P4': 'P4',
          'P5': 'P5'
        },
        statusMap: {
          '0': '未审核',
          '1': '审核通过',
          '2': '审核未通过'
        },
        levelMap: {
          '0': '白名单',
          '1': '黑名单',
          '2': '危险名单',
          '3': '正常名单',
          '4': '其他名单'
        },
        optypeMap: {
          'freeze_auto': '自动冻结',
          'freeze_manual': '人工冻结',
          'unfreeze_auto': '自动解冻',
          'unfreeze_manual': '人工解冻'
        },
        optypeMap2: {
          'freeze_manual': '人工冻结',
          'unfreeze_manual': '人工解冻'
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            accountName: '',
            accountNo: '',
            riskMark: '',
            idCard: '',
            phone: '',
            level:'1',
            ip: '',
            imei: '',
            cookie: '',
            email:'',
            optype: '',
            payMark: '',
            verifyMark: '',
            remark: '',
            tradePlatform: '',
            idfa: '',
            uuid: '',
            deviceId: '',
            sourceOuter: '',
          },
          rules: rules
        },
        approveDailog: {
          show: false,
          type: 3, // 类型，3：审核
          title: '审核',
          form: {
            approveRemark: '',
            status: '',
          },
          rules: approve_rules
        },
        multiApproveDailog: {
          show: false,
          type: 3, // 类型，3：审核
          title: '批量审核',
          form: {
            approveRemark: '',
            status: '',
          },
          rules: multi_approve_rules
        },
        multiFreezeDailog: {
          show: false,
          type: 4, // 类型，4：冻结/解冻
          title: '冻结/解冻',
          form: {
            optype: 'freeze_manual'
          },
          rules: rules
        },
        multipleSelection: [],
        uploadDialog: {
          show: false,
          title: 'excel导入',
          form: {

          },
          rules: rules
        },
        imageUrl: '',
        uploadFile: {
          uploadFileUrl: api.uploadUrl,
          uploadFileImg: {
            type: "AD",
            token: bsmp.util.getToken()
          }
        },
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getLabelDic().then(() => {
          this.query();
        });
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'risk_system_blacklist',
          save: 'risk_system_blacklist_save',
          approve: 'risk_system_blacklist_approve',
          update: 'risk_system_blacklist_update',
          del: 'risk_system_blacklist_delete',
          freeze: 'risk_system_blacklist_freeze',
          import: 'risk_system_blacklist_import',
          export: 'risk_system_blacklist_export'
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      }
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId === 'ALL' && company) {
          this.getLabelDic().then(() => {
            this.query();
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getLabelDic().then(() => {
            this.query();
          });
        }
      }
    },
    methods: {
      handleChangeClick(val){
        this.radioType = val;
        this.getLabelDic().then(() => {
          this.query();
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /**
       * 创建日期格式化
       * */
      createDateFmt (row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 修改日期格式化
       * */
      updateDateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 审核日期格式化
       * */
      approveDateFmt (row) {
        return row.approveDate ? bsmp.util.formatDate.format(new Date(row.approveDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 冻结/解冻日期格式化
       * */
      freezeDateFmt (row) {
        return row.freezeDate ? bsmp.util.formatDate.format(new Date(row.freezeDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 案件等级格式化
       * @param row
       * @returns {string}
       */
      levelFmt (row) {
        return typeof row.level !== 'undefined' ? this.levelMap[row.level] : '';
      },
      /**
       * 审核状态格式化
       * @param row
       * @returns {string}
       */
      statusFmt (row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      /**
       * 操作类型格式化
       * */
      optypeNameFmt (row) {
        return typeof row.optype !== 'undefined' ? this.optypeMap[row.optype] : '';
      },
      /**
       * 批量审核
       * */
      approveMultiple () {
        if (this.$refs['multiApproveForm'] && this.$refs['multiApproveForm'].resetFields) {
          this.$refs['multiApproveForm'].resetFields();
        }
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要审核的数据!'
          });
          return;
        }else{
          for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
              let status = this.multipleSelection[i].status;
              if(status !== 0){
                this.$message({
                  type: 'warning',
                  message: '请选择待审核的数据进行批量审核!'
                });
                return;
              }
          }
        }
        this.multiApproveDailog.show = true;
      },
      /**
       * 批量删除
       * */
      deleteMultiple () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的数据!'
          });
          return;
        }else{
          for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
            let status = this.multipleSelection[i].status;
            if(status !== 0){
              this.$message({
                type: 'warning',
                message: '请选择待审核的数据进行批量删除!'
              });
              return;
            }
          }
        }
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteItem(ids.join(','));
      },
      /**
       * 批量冻结/解冻
       * */
      freezeMultiple () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要冻结/解冻的数据!'
          });
          return;
        }
        if (this.$refs['multiFreezeForm'] && this.$refs['multiFreezeForm'].resetFields) {
          this.$refs['multiFreezeForm'].resetFields();
        }
        this.multiFreezeDailog.show = true;
      },
      submitMultipleFreezeItem (){
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        let id = ids.join(',');
        this.$confirm('确定要冻结/解冻这些记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 冻结/解冻
          let level = 1;
          if(this.radioType === '黑名单') {
            level = 1;
          } else if(this.radioType === '危险名单'){
            level = 2;
          } else if(this.radioType === '白名单'){
            level = 0;
          }
          let action = this.multiFreezeDailog.form.optype;
          api.freezeBlackList({ids: id + '', level:level, action:action}).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
                if(action === 'freeze_manual'){
                  this.$message({
                    type: 'success',
                    message: '冻结成功!'
                  });
                } else if(action === 'unfreeze_manual') {
                  this.$message({
                    type: 'success',
                    message: '解冻成功!'
                  });
                }
              this.multiFreezeDailog.show = false;
              this.query();

              // 记录日志
              bsmp.log({
                component: 'risk_system',
                type: 'freeze',
                content: `[BlackList] params: ${JSON.stringify({id: id, action:action})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['blackListForm'] && this.$refs['blackListForm'].resetFields) {
          this.$refs['blackListForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.level = form.level + '';
          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            accountName: '',
            accountNo: '',
            riskMark: '',
            idCard: '',
            phone: '',
            ip: '',
            imei: '',
            cookie: '',
            email:'',
            bankCard: '',
            level: '',
            optype: 'freeze_manual',
            bu: '',
            batchId: '',
            remark: '',
            tradePlatform: '',
            idfa: '',
            uuid: '',
            deviceId: '',
            payMark: '',
            verifyMark: '',
            sourceOuter: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['blackListForm'].validate((valid) => {
            if(valid){
              this.loading = true;
              let level = '1';
              if(this.radioType === '黑名单') {
                level = '1';
              } else if(this.radioType === '危险名单'){
                level = '2';
              } else if(this.radioType === '白名单'){
                level = '0';
              }
              if (this.dialog.type === 1) {
                // 新增
                if (!this.getCompanyId()) {
                  this.$message.error('请先选择公司！');
                  return;
                }
                this.dialog.form.companyId = this.getCompanyId();
                let params = {
                  accountName: this.dialog.form.accountName,
                  tradePlatform: this.dialog.form.tradePlatform,
                  bankCard: this.dialog.form.bankCard,
                  riskMark: this.dialog.form.riskMark,
                  level: level,
                  phone: this.dialog.form.phone,
                  ip: this.dialog.form.ip,
                  imei: this.dialog.form.imei,
                  cookie: this.dialog.form.cookie,
                  optype: this.dialog.form.optype,
                  idCard: this.dialog.form.idCard,
                  accountNo: this.dialog.form.accountNo,
                  source: this.dialog.form.source,
                  email: this.dialog.form.email,
                  remark: this.dialog.form.remark,
                  payMark: this.dialog.form.payMark,
                  verifyMark: this.dialog.form.verifyMark,
                  idfa: this.dialog.form.idfa,
                  uuid: this.dialog.form.uuid,
                  deviceId: this.dialog.form.deviceId,
                  sourceOuter: this.dialog.form.sourceOuter
                };
                api.saveBlackList(params).then((res) => {
                  let data = res.data;
                  if (data && data.code === '0') {
                    this.$message({
                      type: 'success',
                      message: '新增成功!'
                    });
                    this.query();
                    this.dialog.show = false;
                    // 记录日志
                    bsmp.log({
                      component: 'risk_system',
                      type: 'add',
                      content: `[BlackList] params: ${JSON.stringify(this.dialog.form)}`
                    });
                  }
                }).catch(e => {
                  this.loading = false;
                });
              } else {
                // 修改
                let params = {
                  id: this.dialog.form.id,
                  accountName: this.dialog.form.accountName,
                  bankCard: this.dialog.form.bankCard,
                  riskMark: this.dialog.form.riskMark,
                  level: level,
                  phone: this.dialog.form.phone,
                  ip: this.dialog.form.ip,
                  imei: this.dialog.form.imei,
                  cookie: this.dialog.form.cookie,
                  optype: this.dialog.form.optype,
                  idCard: this.dialog.form.idCard,
                  accountNo: this.dialog.form.accountNo,
                  source: this.dialog.form.source,
                  email: this.dialog.form.email,
                  remark: this.dialog.form.remark,
                  payMark: this.dialog.form.payMark,
                  verifyMark: this.dialog.form.verifyMark,
                  tradePlatform: this.dialog.form.tradePlatform,
                  idfa: this.dialog.form.idfa,
                  uuid: this.dialog.form.uuid,
                  deviceId: this.dialog.form.deviceId,
                  sourceOuter: this.dialog.form.sourceOuter
                };
                api.updateBlackList(params).then((res) => {
                  let data = res.data;
                  if (data && data.code === '0') {
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                    this.query();
                    this.dialog.show = false;
                    // 记录日志
                    bsmp.log({
                      component: 'risk_system',
                      type: 'edit',
                      content: `[BlackList] params: ${JSON.stringify(this.dialog.form)}`
                    });
                  }
                }).catch(e => {
                  this.loading = false;
                });
              }
              this.loading = false;
            }
        })
      },

      /**
       * 删除
       * */
      deleteItem (id) {
        this.$confirm('确定要删除记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let level = 1;
          if(this.radioType === '黑名单') {
            level = 1;
          } else if(this.radioType === '危险名单'){
            level = 2;
          } else if(this.radioType === '白名单'){
            level = 0;
          }
          // 删除
          api.removeBlackList({ids:id,level:level}).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'risk_system',
                type: 'delete',
                content: `[BlackList] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
        });
      },
      /**
       * 手工冻结
       * */
      freezeItem (id, action) {
        this.$confirm('确定要冻结该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let level = 1;
          if(this.radioType === '黑名单') {
            level = 1;
          } else if(this.radioType === '危险名单'){
            level = 2;
          } else if(this.radioType === '白名单'){
            level = 0;
          }
          // 冻结
          api.freezeBlackList({action: action, ids: id+'', level:level}).then((res) => {
            let data = res.data;
            if (data && data.code === "0") {
              this.$message({
                type: 'success',
                message: '冻结成功!'
              });

              // 记录日志
              bsmp.log({
                component: 'risk_system',
                type: 'freeze',
                content: `[BlackList] params: ${JSON.stringify({action, ids: id+''})}`
              });
            }
            this.query();
          });
        }).catch(e => {
        });
      },
      /**
       * 手工解冻
       * */
      unfreezeItem (id, action) {
        this.$confirm('确定要解冻该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let level = 1;
          if(this.radioType === '黑名单') {
            level = 1;
          } else if(this.radioType === '危险名单'){
            level = 2;
          } else if(this.radioType === '白名单'){
            level = 0;
          }
          // 解冻
          api.freezeBlackList({action:action, ids: id+'',level:level}).then((res) => {
            let data = res.data;
            if (data && data.code === "0") {
              this.$message({
                type: 'success',
                message: '解冻成功!'
              });

              // 记录日志
              bsmp.log({
                component: 'risk_system',
                type: 'freeze',
                content: `[BlackList] params: ${JSON.stringify({action, ids: id+''})}`
              });
            }
            this.query();
          });
        }).catch(e => {
        });
      },
      /**
       * 批量冻结/解冻
       * */
      freezeMultiItem (id) {
        this.$confirm('确定要冻结/解冻该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 冻结/解冻
          api.freezeBlackList(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '冻结/解冻成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'risk_system',
                type: 'freeze',
                content: `[BlackList] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 批量审核
       * */
      approveMultipleItem (){
        this.$refs['multiApproveForm'].validate((valid) => {
          if (valid) {
            let ids = [];
            for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
              ids.push(this.multipleSelection[i].id);
            }
            let id = ids.join(',');
            this.$confirm('确定要审核这些记录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.multiApproveDailog.form.status === '0'){
                this.$message({
                  type: 'info',
                  message: '审核状态未改变!'
                });
                return;
              }
              let level = 1;
              if(this.radioType === '黑名单') {
                level = 1;
              } else if(this.radioType === '危险名单'){
                level = 2;
              } else if(this.radioType === '白名单'){
                level = 0;
              }
              // 审核
              api.approveBlackList({ids: id + '', level:level, action:this.multiApproveDailog.form.status, mark:this.multiApproveDailog.form.approveRemark }).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '审核成功!'
                  });
                  this.multiApproveDailog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'risk_system',
                    type: 'approve',
                    content: `[BlackList] params: ${JSON.stringify({id: id})}`
                  });
                }
              });
            }).catch(e => {
            });
          }
        })
      },
      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
      },

      getCompanyId() {
        let companyId = '';
        if (this.userInfo.companyId) {
          if (this.userInfo.companyId === 'ALL') {
            if (this.company) {
              companyId = this.company.companyId;
            }
          } else {
            companyId = this.userInfo.companyId;
          }
        }
        return companyId;
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        if (this.getCompanyId()) {
          params.companyId = this.getCompanyId();
        }

        params = Object.assign({}, params, this.table.pager);
        // 创建时间处理
        if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
          params.createDateStart = bsmp.util.formatDate.format(params.createDate[0], 'yyyy-MM-dd hh:mm:ss');
          params.createDateEnd = bsmp.util.formatDate.format(params.createDate[1], 'yyyy-MM-dd') + ' 23:59:59';
          delete params.createDate;
        }else{
          //默认查询当天数据???
//          params.createDateStart = bsmp.util.formatDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
//          params.createDateEnd = bsmp.util.formatDate.format(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        }
        // 冻结/解冻时间处理
        if (params.freezeDate && params.freezeDate.length && params.freezeDate[0] && params.freezeDate[1]) {
          params.freezeDateStart = bsmp.util.formatDate.format(params.freezeDate[0], 'yyyy-MM-dd hh:mm:ss');
          params.freezeDateEnd = bsmp.util.formatDate.format(params.freezeDate[1], 'yyyy-MM-dd') + ' 23:59:59';
          delete params.freezeDate;
        }
        if(this.radioType === '黑名单') {
          params.blackLevel = 0;
          params.level = 1;
        } else if(this.radioType === '危险名单'){
          params.blackLevel = 2;
          params.level = 2;
        } else if(this.radioType === '白名单'){
          params.blackLevel = 3;
          params.level = 0;
        }
        api.getBlackList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: data.data.pageNo,
                total: data.data.total
              });
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      /**
       * 清空
       */
      clear (){
        this.search = {
          accountName: '',
          accountNo: '',
          riskMark: '',
          idCard: '',
          phone: '',
          ip: '',
          imei: '',
          cookie: '',
          bu: '',
          email:'',
          bankCard: '',
          batchId: '',
          status: '',
          createDate: '',
          freezeDate: '',
          optype:'',
          source: '',
          sourceOuter: '',
          tradePlatform: '',
          idfa: '',
          uuid: '',
          deviceId: '',
          payMark: '',
          verifyMark: ''
        }
      },
      /**
       * 每页显示条数变化
       * @param val
       */
      handleSizeChange (val) {
        this.table.pager.pageSize = val;
        this.query();
      },

      /**
       * 页码变化
       * @param val
       */
      handleCurrentChange (val) {
        if (this.table.pager.pageNo) {
          this.table.pager.pageNo = val;
          this.query();
        }
      },
      /**
       * 审核弹窗
       * */
      showApproveDialog (type, index) {
        if (this.$refs['approveForm'] && this.$refs['approveForm'].resetFields) {
          this.$refs['approveForm'].resetFields();
        }
        if (this.approveDailog.type === 3 && index > -1) {
          this.approveDailog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.status = form.status + '';
          this.approveDailog.form = form;
        }
//        if (this.approveDailog.form.status != '1'){   //审核通过的记录不能再次审核
//          this.approveDailog.show = true;
//        }
        this.approveDailog.show = true;
      },
      submitApproveForm (type, status){
        this.$refs['approveForm'].validate((valid) => {
          if (valid) {
            if (this.approveDailog.type === 3) {
              // 审核
              if (!this.getCompanyId()) {
                this.$message.error('请先选择公司！');
                return;
              }
              this.approveDailog.form.companyId = this.getCompanyId();
              if (status && status != ''){
                this.approveDailog.form.status = status;
              }
              if(this.approveDailog.form.status === '0'){
                this.$message({
                  type: 'info',
                  message: '审核状态未改变!'
                });
                return;
              }
              let level = 1;
              if(this.radioType === '黑名单') {
                level = 1;
              } else if(this.radioType === '危险名单'){
                level = 2;
              } else if(this.radioType === '白名单'){
                level = 0;
              }
              api.approveBlackList({ids:this.approveDailog.form.id, level:level, action:this.approveDailog.form.status, mark:this.approveDailog.form.approveRemark}).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '审核成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'risk_system',
                    type: 'approve',
                    content: `[BlackList] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            }
            this.approveDailog.show = false;
          } else {
            return false;
          }
        });
      },
      /**
       * 取消审核弹窗
       * */
      cancelApproveForm () {
        this.approveDailog.show = false;
      },
      /**
       * 取消批量冻结/解冻弹窗
       * */
      cancelMultiFreezeForm () {
        this.multiFreezeDailog.show = false;
      },

      /**
       * 批量审核
       * */
      showMultiApproveDialog (type, index) {
        if (this.$refs['approveForm'] && this.$refs['approveForm'].resetFields) {
          this.$refs['approveForm'].resetFields();
        }
        if (this.multiApproveDailog.type === 3 && index > -1) {
          this.multiApproveDailog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          this.multiApproveDailog.form = form;
        }
        if (this.multiApproveDailog.form.status != '1'){   //审核通过的记录不能再次审核
          this.multiApproveDailog.show = true;
        }

      },

      /**
       * 取消批量审核弹窗
       * */
      cancelMultiApproveForm () {
        this.multiApproveDailog.show = false;
      },

      /**
       * 获取案件标签字典
       * */
      getLabelDic (){
        let level = 1;
        if(this.radioType === '黑名单') {
          level = 1;
        } else if(this.radioType === '危险名单'){
          level = 2;
        } else if(this.radioType === '白名单'){
          level = 0;
        }
        let params = {
          companyId: this.getCompanyId(),
          status:'1',
          level:level,
          pageSize : 1000
        };
        return api.getRiskLabelList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            let labels = data.data;
            if(labels){
              const map = new Map();
              for (let item of labels.data) {
                map.set(item.riskLabel+"/"+item.riskMark, item.riskMark);
                this.labelMap = [...map];
              }
            }
          }
        }).catch(e => {
          console.error(e);
        });
      },

      /**
       * 导入
       */
      importExcel (){
        this.uploadDialog.show = true;

      },
      /**
       * 查询导出
       */
      exportExcel() {
        let params = bsmp.util.deleteBlank(this.search);
        if (this.getCompanyId()) {
          params.companyId = this.getCompanyId();
        }
        this.downloading = true;
        params = Object.assign({}, params, this.table.pager);
        // 创建时间处理
        let createDateStart= '';
        let createDateEnd= '';
        if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
          createDateStart = bsmp.util.formatDate.format(params.createDate[0], 'yyyy-MM-dd hh:mm:ss');
          createDateEnd = bsmp.util.formatDate.format(params.createDate[1], 'yyyy-MM-dd') + ' 23:59:59';
          delete params.createDate;
        }
        // 冻结/解冻时间处理
        let freezeDateStart= '';
        let freezeDateEnd= '';
        if (params.freezeDate && params.freezeDate.length && params.freezeDate[0] && params.freezeDate[1]) {
          freezeDateStart = bsmp.util.formatDate.format(params.freezeDate[0], 'yyyy-MM-dd hh:mm:ss');
          freezeDateEnd = bsmp.util.formatDate.format(params.freezeDate[1], 'yyyy-MM-dd') + ' 23:59:59';
          delete params.freezeDate;
        }
        let blackLevel = 0;
        let level = 1;
        if(this.radioType === '黑名单') {
          blackLevel = 0;
          level = 1;
        } else if(this.radioType === '危险名单'){
          blackLevel = 2;
          level = 2;
        } else if(this.radioType === '白名单'){
          blackLevel = 3;
          level = 0;
        }
        let token = bsmp.util.getToken();
        params = {
          accountName: this.search.accountName,
          status: this.search.status,
          bankCard: this.search.bankCard,
          riskMark: this.search.riskMark,
          level: level,
          phone: this.search.phone,
          ip: this.search.ip,
          imei: this.search.imei,
          cookie: this.search.cookie,
          optype: this.search.optype,
          idCard: this.search.idCard,
          accountNo: this.search.accountNo,
          source: this.search.source,
          email: this.search.email,
          sourceOuter: this.search.sourceOuter,
          createDateStart:createDateStart,
          createDateEnd:createDateEnd,
          freezeDateStart:freezeDateStart,
          freezeDateEnd:freezeDateEnd,
          batchId:this.search.batchId,
          blackLevel:blackLevel,
          bu:this.search.bu,
          token:token,
          payMark: this.search.payMark,
          verifyMark: this.search.verifyMark,
          tradePlatform: this.search.tradePlatform,
          idfa: this.search.idfa,
          uuid: this.search.uuid,
          deviceId: this.search.deviceId
        };
        api.exportBlackList(params).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            const filedHeader = ['事业部', '风险等级', '风险标签编码', '风险备注','交易平台',
              '账户', '姓名','电话', '身份证', '邮箱', 'IP','银行卡号', 'IMEI', 'IDFA', 'UUID', 'cookies', 'deviceID', '外部数据源','支付标记','验证标记'];
            const fieldNames = ['bu', 'level', 'riskMark', 'remark', 'tradePlatform',
              'accountNo', 'accountName', 'phone', 'idCard', 'email',  'ip', 'bankCard', 'imei','idfa', 'uuid', 'cookie', 'deviceId', 'sourceOuter','payMark','verifyMark'];
            let filedData = bsmp.util.excellentExport.formatJson(fieldNames, data.data, {
              phone: {tab: true},
              idCard: {tab: true},
              bankCard: {tab: true},
              imei: {tab: true},
              idfa: {tab: true},
              uuid: {tab: true},
              cookie: {tab: true},
              deviceId: {tab: true},
              remark: {tab: true},
              accountNo:{tab: true},
              sourceOuter: {tab: true},
              payMark: {tab: true},
              verifyMark: {tab: true}
            });
            let exportFileName = bsmp.util.formatDate.format(new Date(), 'yyyyMMddhhmmss');
            bsmp.util.excellentExport.csvByData(this.radioType+'记录'+exportFileName+'.csv', filedHeader, filedData);
          }else {
            console.error(JSON.stringify(data));
            this.$message({
              type: "error",
              message: "导出失败!"
            });
          }
          this.downloading = false;
        }).catch(e => {
          console.error(e);
          this.downloading = false;
          this.$message({
            type: "error",
            message: "导出失败!"
          });
        });

      },

      /**
       * 导出当前页数据
       */
      exportTableExcel() {
        return bsmp.util.excellentExport.excel('download-btn', 'tableExcel', '黑名单模板');
      },

      beforeUpload(file){
        this.loading = true;
        if (this.optAuth.import) {
          return true;
        } else {
          this.$message.warning('无导入文件权限！');
          return false;
        }
      },
      avatarSuccess(res, file, files){
        this.uploadDialog.show = false;
        if (res.code !== '0') {
          if (res.code === '2006'){
            this.$message({
              message: res.msg,
              type: 'warning',
              duration: '6000',
              center: true
            });
            this.loading = false;
            return;
          }
          this.$message({
            message: '导入文件失败！'+res.msg,
            type: 'error',
            duration: '8000',
            center: true
          });
          this.loading = false;
          return;
        }
        this.$message.success('导入文件成功！');
        this.query();
      },
      avatarError(err, file, fileList) {
        this.loading = false;
        this.uploadDialog.show = false;
        err = err+"";
        if(err.indexOf('504') > -1 || err.indexOf('Error') > -1){
          this.$message.error("导入文件失败！");
        } else{
          this.$message({
            message: '文件正在后台批量处理,文件过大可能导入失败！请尽量控制文件大小...',
            type: 'error',
            duration: '8000',
            center: true
          });
        }
      }
    }
  };

  // 表单规则
  let rules = {
    accountNo: [
      {required: false, message: '请输入账户', trigger: 'blur'},
      {
        pattern: /^[0-9]*$/,
        message: '请输入正确格式的账户'
      }
    ],
    phone: [
      {required: false, message: '请输入手机号', trigger: 'blur'},
      {
        pattern: /(^[0-9]{11})$|(^86(-){0,3}[0-9]{11})$/,
//        pattern: /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/,
        message: '请输入正确的手机号'
      }
    ],
    idCard: [
      {required: false, message: '请输入身份证号', trigger: 'blur'},
      {
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: '请输入正确的身份证号'
      }
    ],
    bankCard: [
      {required: false, message: '请输入银行卡号', trigger: 'blur'},
      {
        pattern: /^\d{16}|\d{19}$/,
        message: '请输入正确的银行卡号'
      }
    ],
    email: [
      {required: false, message: '请输入邮箱', trigger: 'blur'},
      {type: 'email', message: '请输入正确的邮箱', trigger: 'blur,change'}
    ],
    remark: [
      {required: true, message: '请输入备注', trigger: 'blur'}
    ],
    riskMark: [
      {required: true, message: '请输入案件标签', trigger: 'blur'}
    ]
  };
  let rules_account = {
    accountNo: [
      {required: true, message: '请输入账户', trigger: 'blur'},
      {
        pattern: /^[0-9]*$/,
        message: '请输入正确格式的账户'
      }
    ],
    phone: [
      {required: false, message: '请输入手机号', trigger: 'blur'},
      {
        pattern: /(^[0-9]{11})$|(^86(-){0,3}[0-9]{11})$/,
//        pattern: /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/,
        message: '请输入正确格式的手机号'
      }
    ],
    idCard: [
      {required: false, message: '请输入身份证号', trigger: 'blur'},
      {
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: '请输入正确格式的身份证号'
      }
    ],
    bankCard: [
      {required: false, message: '请输入银行卡号', trigger: 'blur'},
      {
        pattern: /^\d{16}|\d{19}$/,
        message: '请输入正确格式的银行卡号'
      }
    ],
    email: [
      {required: false, message: '请输入邮箱', trigger: 'blur'},
      {type: 'email', message: '请输入正确格式的邮箱', trigger: 'blur,change'}
    ],
    remark: [
      {required: true, message: '请输入备注', trigger: 'blur'}
    ],
    riskMark: [
      {required: true, message: '请输入案件标签', trigger: 'blur'}
    ]
  };

  //审核表单规则
  let approve_rules = {
    status: [
      {required: true, message: '请输入审核状态', trigger: 'blur'}
    ],
    approveRemark: [
      {required: true, message: '请输入审核描述', trigger: 'blur'}
    ]
  };

  let multi_approve_rules = {
    status: [
      {required: true, message: '请输入审核状态', trigger: 'blur'}
    ],
    approveRemark: [
      {required: true, message: '请输入审核描述', trigger: 'blur'}
    ]
  };

</script>
<style lang="stylus" scoped>
  .tpl-link
    word-break:break-all
  .export-btn
    text-decoration none
    background #20a0ff
    color #fff
  .tips
    color #e64242
    float:right
    margin-right:20px
  .item-doubt{
    background:#c4c4c4;
    border-radius:50%;
    cursor:pointer;
  }
  .item-doubt:before{
    color:#fff;
  }
  .icon-download{
    font-size: 80%
  }
  .icon-upload{
    font-size: 80%
  }
</style>
