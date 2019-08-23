<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select clearable v-model="search.type" placeholder="消息类型">
            <el-option v-for="(val, key) in typesMap" :label="val" :value="key" :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.target" placeholder="消息目标"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.send" placeholder="发送者"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 130"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="id"
        label="ID"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="date"
        label="时间"
        :formatter="dateFmt"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="content"
        label="内容"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="send"
        label="发送方"
        :formatter="sendFmt"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="target"
        label="接受方"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="type"
        label="消息类型"
        :formatter="typeFmt">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="查看详情" @click="showDialog(scope.$index)" size="mini"><i class="icon-eye"></i></el-button>
          <el-button title="删除" type="danger" icon='delete' size="mini"
                     @click="deleteItem(scope.row.id)"></el-button>
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
    <el-dialog title="消息详情" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="msgForm" label-width="100px"
               class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID：">
              <el-input v-model="dialog.form.id" auto-complete="off" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间：">
              <el-date-picker
                readonly
                v-model="dialog.form.date"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="内容：">
              <el-input type="textarea" readonly :rows="3" v-model="dialog.form.content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发送方：">
              <el-input v-model="dialog.form.send.uid" auto-complete="off" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接受方：">
              <el-input v-model="dialog.form.target" auto-complete="off" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="消息关联方：">
              <el-input v-model="dialog.form.relation" auto-complete="off" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消息类型：">
              <el-select clearable v-model="dialog.form.type" disabled placeholder="消息类型">
                <el-option v-for="(val, key) in typesMap" :label="val" :value="key" :key="'type-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="3">
            <el-form-item>
              <el-checkbox v-model="dialog.form.apiMsg" disabled>是否通过api方式发送</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'messagesMng',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
        search: {
          appCode: 'fxChat',
          type: '',
          target: '',
          send: ''
        },
        table: {
          appCode: null,
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
          form: {
            id: '',
            date: null,
            send: {
              uid: ''
            },
            content: '',
            type: null,
            target: '',
            relation: [],
            apiMsg: false
          }
        },
        apps: null,
        typesMap: {
          'GLOBAL': '全局消息',
          'PERSONAL': '用户个人消息',
          'TAG': '标签消息',
          'TOPIC': '渠道消息',
          'PLATFORM': '平台消息'
        }
      };
    },
    mounted () {
      this.query();
    },
    methods: {
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.date ? bsmp.util.formatDate.format(new Date(row.date), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 发送方格式化
       * */
      sendFmt (row) {
        return row.send && row.send.uid ? row.send.uid : '';
      },
      /**
       * 类型格式化
       * */
      typeFmt (row) {
        return typeof row.type !== 'undefined' ? this.typesMap[row.type] : '';
      },
      apiMsgFmt (row) {
        return row.apiMsg ? '是' : '否';
      },
      /**
       * 显示弹窗
       * */
      showDialog (index) {
        this.dialog.index = index;
        let form = Object.assign({}, this.table.items[index]);
        form.relation = form.relation.toString();

        this.dialog.form = form;
        this.dialog.show = true;
      },
      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
      },

      /**
       * 删除
       * */
      deleteItem (id) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.removeMessage(this.table.appCode, id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'app_join',
                type: 'delete',
                content: `[Message] params: ${JSON.stringify({appCode: this.table.appCode, id: id})}`
              });
            }
          });
        }).catch(e => {});
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        params.appCode = this.search.appCode;
        if (this.search.type) {
          params.type = this.search.type;
        }
        if (this.search.target && this.search.send) {
          params.relation = this.search.send + ',' + this.search.target;
        } else {
          if (this.search.target) {
            params.target = this.search.target
          }
          if (this.search.send) {
            params["send.uid"] = this.search.send;
          }
        }

        api.getMessageList(params.appCode, params).then((res) => {
          this.loading = false;
          let data = res.data;

          this.table.appCode = params.appCode;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: data.data.pageNo + 1,
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
      }
    }
  };
</script>
