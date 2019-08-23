<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.isEnable" placeholder="是否有效期内">
            <el-option v-for="(val, key) in isEnableMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.status" placeholder="状态">
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <!--el-form-item>
          <el-input v-model="search.createUser" placeholder="创建人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.updateUser" placeholder="更新人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.datetime"
            type="daterange"
            placeholder="时间">
          </el-date-picker>
        </el-form-item-->
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
      <!--el-button v-show="optAuth.batch" @click="deleteMultiple" type="danger">批量删除</el-button-->
    </el-row>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <!--el-table-column
        fixed
        type="selection"
        width="55">
      </el-table-column-->
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="title"
        label="公告标题"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="content"
        label="公告内容"
        width="150"
        :formatter="contentFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="startDate"
        :formatter="startDateFmt"
        label="公告起始时间"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="endDate"
        :formatter="endDateFmt"
        width="200"
        label="公告结束时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        label="状态"
        :formatter="statusFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注信息"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createUser"
        label="创建人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        :formatter="createDateFmt"
        width="200"
        label="创建时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateUser"
        label="更新人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateDate"
        :formatter="updateDateFmt"
        width="200"
        label="更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" @click="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"
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
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="noticeForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="公告标题：" prop="title">
              <el-input v-model="dialog.form.title" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布时间周期：" prop="dateRange">
              <el-date-picker
                  clearable
                  v-model="dialog.form.dateRange"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange">
               </el-date-picker>
            </el-form-item>
            <!--el-form-item label="开始时间：" prop="startDate">
              <el-date-picker
                  clearable
                  v-model="dialog.form.startDate"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange">
               </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间：" prop="endDate">
              <el-date-picker
                  clearable
                  v-model="dialog.form.endDate"
                  format="yyyy-MM-dd hh:mm:ss"
                  type="date">
               </el-date-picker>
            </el-form-item-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="状态：" prop="status">
              <el-select v-model="dialog.form.status" filterable placeholder="状态">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'form-status-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="内容：" prop="content">
             <vue-editor :editorToolbar="customToolbar" placeholder="请输入内容"
                                      v-model="dialog.form.content"></vue-editor>
              <!--el-input type="textarea" :rows="3" v-model="dialog.form.content"></el-input-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注信息：" prop="remark">
              <el-input type="textarea" :rows="3" v-model="dialog.form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary">保 存</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  import {VueEditor} from 'vue2-editor';
  export default {
    name: 'notice',
    components: {
      VueEditor
    },
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          title: '',
          isEnable: '',
          status: ''/*,
          createUser: '',
          updateUser: '',
          datetime: null*/
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
          title: '',
          form: {
            title: '',
            content: '',
            dateRange: '',
            startDate: '',
            endDate: '',
            remark: '',
            status: '0'
          },
          rules: rules
        },
        statusMap: {
          '0': '启用',
          '1': '停用'
        },
        isEnableMap: {
          '1': '是',
          '0': '否'
          },
        multipleSelection: [],
        customToolbar: [
            [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
            [{ 'header': 1 }, { 'header': 2 }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'formula'],
            ['clean'],
        ]
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'vc_coupon_notice_view',
          add: 'vc_coupon_notice_add',
          edit: 'vc_coupon_notice_edit',
          del: 'vc_coupon_notice_del'/*,
          batch: 'virtual_coin_notice_batch'*/
        });
      },
    },
    watch: {
      'dialog.form.content'(ctx) {
        if (ctx && !this.delHtmlTag(ctx)) {
          this.dialog.form.content = '';
        }
      }
    },
    methods: {
      statusFmt(row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      /**
       * 日期格式化
       * */
      startDateFmt (row) {
        return row.startDate ? bsmp.util.formatDate.format(new Date(row.startDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      endDateFmt (row) {
        return row.endDate ? bsmp.util.formatDate.format(new Date(row.endDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      createDateFmt (row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      updateDateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      contentFmt(row) {
        return row.content ? row.content.replace(/<[^>]+>/g,"") : '';//去掉所有的html标记
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['noticeForm'] && this.$refs['noticeForm'].resetFields) {
          this.$refs['noticeForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '编辑';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.status = form.status + '';

          form.dateRange = [];
          form.dateRange[0] = new Date(form.startDate);
          form.dateRange[1] = new Date(form.endDate);

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            title: '',
            content: '',
            dateRange: '',
            startDate: '',
            endDate: '',
            remark: '',
            status: '0'
          };
        }

        this.dialog.show = true;
      },
      delHtmlTag(str) {
        return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
      },
      submitForm () {
        this.$refs['noticeForm'].validate((valid) => {
          if (valid) {
            let params = {
              title: this.dialog.form.title,
              content: this.dialog.form.content,
              dateRange: this.dialog.form.dateRange,
              status: this.dialog.form.status,
              remark: this.dialog.form.remark
            };

            if (params.dateRange) {
              params.startDate = bsmp.util.formatDate.format(params.dateRange[0], 'yyyy-MM-dd hh:mm:ss');
              params.endDate = bsmp.util.formatDate.format(params.dateRange[1], 'yyyy-MM-dd hh:mm:ss');
            } else {
              this.$message.warning('请选择发布时间周期！');
              return;
            }
            delete params.dateRange;
            if (this.dialog.type === 1) {
              // 新增
              api.addNotice(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'vc_coupon',
                    type: 'add',
                    content: `[notice] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              params.id = this.dialog.form.id;
              // 修改
              api.editNotice(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '编辑成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'vc_coupon',
                    type: 'modify',
                    content: `[notice] params: ${JSON.stringify(params)}`
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      },

      deleteMultiple () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的公告!'
          });
          return;
        }
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteItem(ids.join(','), 2);
      },

      /**
       * 删除
       * */
      deleteItem (id, type) {
        this.$confirm(type === 1 ? '确定要删除该条记录?': '确定要删除所选记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let method = null;
          if (type && type === 2) {
            //method = api.deleteNotices(id);
          } else {
            method = api.deleteNotice(id);
          }
          // 删除
          method.then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'vc_coupon',
                type: 'delete',
                content: `[notice] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
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
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);

        /*if (this.search.datetime && this.search.datetime.length) {
          if (this.search.datetime[0]) {
            params.startDate = this.dateToStr(this.search.datetime[0]);
          }
          if (this.search.datetime[1]) {
            params.endDate = this.dateToStr(new Date(this.search.datetime[1].setHours(23, 59, 59, 0)));
          }
        }
        delete params.datetime;*/

        api.getNoticeList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: parseInt(data.data.pageNo, 10),
                total: data.data.total
              });
          }
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

  let validateNum = (rule, value, callback) => {
    let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if (value === '') {
      callback(new Error('请输入正确的数字'));
    } else {
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的数字'));
      }
    }
  };

  // 表单规则
  let rules = {
    title: [
      {required: true, message: '请输入标题', trigger: 'blur'}
    ],
    content: [
      {required: true, message: '请输入内容', trigger: 'blur'}
    ],
    /*startDate: [
      {required: true, type: 'Date', message: '请输入开始时间', trigger: 'blur,change'},
    ],
    endDate: [
      {required: true, type: 'Date', message: '请输入结束时间', trigger: 'blur,change'},
    ],*/
  };
</script>
