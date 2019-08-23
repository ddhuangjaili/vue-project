<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="search.resultCode" clearable filterable placeholder="风控结果">
            <el-option v-for="(val, key) in ruleResultMap" :label="val" :value="key" :key="'search-ruleResult-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-cascader @change="getRuleList" clearable :options="sceneTree" v-model="search.sceneId" placeholder="风控决策树" style="width: 300px"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.ruleId" clearable filterable placeholder="对应规则" :loading="rule.loading">
            <el-option v-for="rule in rule.items" :label="rule.ruleName" :value="rule.ruleId" :key="'search-rule-'+ rule.ruleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker clearable v-model="search.createTime" type="datetimerange" placeholder="时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.customerNo" placeholder="账户"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.customerName" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.idCard" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.deviceId" placeholder="deviceId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.email" placeholder="邮箱地址"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 170"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="input"
        label="查询项(输入参数)"
        width="300">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="resultDesc"
        label="风控返回结果"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="actionName"
        label="后置动作"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sceneName"
        label="命中场景"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="ruleName"
        label="命中规则名称"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="city"
        label="命中城市"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="命中时间"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="deviceId"
        label="deviceId"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="详情">
        <template slot-scope="scope">
          <el-button title="查看详情" v-show="scope.row.input || scope.row.output" @click="showDialog(scope.$index)" size="mini"><i class="icon-eye"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="table.pager.page"
      :page-sizes="[20, 50, 100, 500]"
      :page-size="table.pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="table.pager.total">
    </el-pagination>

    <!-- 详细信息 -->
    <el-dialog title="详情" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="msgForm" label-width="150px" class="dialog-form">
        <el-tabs v-if="dialog.form && dialog.form.input" v-model="inputActive" type="card">
          <el-tab-pane label="查询输入" name="input">
             <table class="stat-table">
                <thead>
                  <tr>
                    <th>字段</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(val, key) in dialog.form.input" :key="'input-' + key">
                    <td>{{key}}</td>
                    <td v-html="val"></td>
                  </tr>
                </tbody>
             </table>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="dialog.form && dialog.form.output" v-model="outputActive" type="card">
          <el-tab-pane label="查询输出" name="output">
            <table class="stat-table">
                <thead>
                  <tr>
                    <th>字段</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(val, key) in dialog.form.output" :key="'output-' + key">
                    <td>{{key}}</td>
                    <td v-html="val"></td>
                  </tr>
                </tbody>
             </table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "risk_system_policy_hit_record",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      search: {
        resultCode: "",
        sceneId: [],
        ruleId: "",
        createTime: null,
        customerNo: "",
        customerName: "",
        idCard: "",
        phone: "",
        deviceId: "",
        email: ""
      },
      table: {
        items: [],
        pager: {
          pageSize: 20,
          pageNo: 1,
          total: 0
        }
      },
      ruleResultMap: {},
      sceneTree: [],
      rule: {
        loading: false,
        items: []
      },
      dialog: {
        show: false,
        index: -1, // 数据下标
        form: null
      },
      inputActive: 'input',
      outputActive: 'output'
    };
  },
  mounted() {
    this.getRuleResult();
    this.getSceneList();
    this.query();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        search: "risk_system_policy_hit_record_list"
      });
    },
  },
  methods: {
    // 显示详细弹窗
    showDialog(index) {
      this.dialog.index = index;
      let form = Object.assign({}, this.table.items[index]);
      this.dialog.form = form;

      this.dialog.form.input = JSON.parse(form.input);
      this.dialog.form.output = JSON.parse(form.output);

      this.dialog.show = true;
    },
    getRuleResult() {
      return api.getRuleInfoResult().then(res => {
        let data = res.data;
        if (data && data.code === "0") {
          let items = data.data;
          items.forEach(item => {
              this.ruleResultMap[item.code] = item.result;
          });
        }
      });
    },
    getSceneList() {
      return api.getSceneList().then(res => {
        let data = res.data;
        if (data && data.code === "0") {
          this.sceneTree = [];
          let node = null;

          data.data.forEach(item => {
            node = {
              value: item.sceneId,
              label: item.sceneName,
              children: []
            };

             if (item.children && item.children.length) {
              item.children.forEach(i => {
                node.children.push({
                  value: i.sceneId,
                  label: i.sceneName,
                });
              });
             }

             this.sceneTree.push(node);
          });
        }
      });
    },
    getRuleList() {
      if (!this.search.sceneId || this.search.sceneId.length < 1) {
        this.search.ruleId = '';
        this.rule.items = [];
        return;
      }

      this.rule.loading = true;
      api.getRuleList({sceneId: this.search.sceneId[1]}).then(res => {
          this.rule.loading = false;
          let data = res.data;
          if (data && data.code === "0") {
              this.rule.items = data.data;
          }
      }).catch(e => {
          this.rule.loading = false;
      });
    },
    query() {
      if (this.search.idCard !== ""
          && /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.search.idCard) == false) {
        this.$message.warning("请输入正确的身份证！");
        return null;
      }
      if (this.search.phone !== "" && bsmp.util.isMobile(this.search.phone) == false) {
        this.$message.warning("请输入正确的手机号码！");
        return null;
      }
      if (this.search.email !== "" && /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.search.email) == false) {
        this.$message.warning("请输入正确的邮箱！");
        return null;
      }

      this.loading = true;
      let params = bsmp.util.deleteBlank(this.search);
      params = Object.assign({}, params, this.table.pager);

      if (params.createTime && params.createTime.length && params.createTime[0] && params.createTime[1]) {
        params.createTimeStart = bsmp.util.formatDate.format(params.createTime[0], "yyyy-MM-dd hh:mm:ss");
        params.createTimeEnd = bsmp.util.formatDate.format(params.createTime[1], "yyyy-MM-dd hh:mm:ss");
      }
      delete params.createTime;

      if (params.sceneId && params.sceneId.length) {
        params.sceneId = params.sceneId[1];
      }

      this.loading = true;
      api.getRuleStatList(params).then(res => {
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
    },

    clear() {
      this.search = {
        resultCode: "",
        sceneId: [],
        ruleId: "",
        createTime: null,
        customerNo: "",
        customerName: "",
        idCard: "",
        phone: "",
        deviceId: "",
        email: ""
      };
    }

  }
};
</script>
<style lang="stylus" scoped>
.stat-table 
  width: 100%;
  line-height: 30px;
  thead 
    color: #5e6d82;
    background-color: #eff2f7;
    th 
      width: 50%;
      text-align: center;
      border: 1px solid rgb(223, 230, 236);
  tbody 
    td 
      text-align: center;
      border: 1px solid rgb(223, 230, 236);
</style>
