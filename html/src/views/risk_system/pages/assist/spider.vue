<template>
  <div>
    <query-panel>
      <el-form :model="search" class="demo-form-inline">
        <el-form-item label="发布时间：">
          <el-radio-group v-model="search.releaseTimeType">
            <el-radio :label="0" >全部</el-radio>
            <el-radio :label="1" >当天</el-radio>
            <el-radio :label="2" >近三天</el-radio>
            <el-radio :label="3" >近一周</el-radio>
            <el-radio :label="4" >近半月</el-radio>
            <el-radio :label="5" >自定义</el-radio>
          </el-radio-group>
          <el-date-picker
            label="自定义"
            v-model="search.releaseTime"
            :disabled="search.releaseTimeType != 5"
            type="daterange"
            placeholder="请选择时间段">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抓取时间：">
          <el-radio-group v-model="search.createTimeType">
            <el-radio :label="0" >全部</el-radio>
            <el-radio :label="1" >当天</el-radio>
            <el-radio :label="2" >近三天</el-radio>
            <el-radio :label="3" >近一周</el-radio>
            <el-radio :label="4" >近半月</el-radio>
            <el-radio :label="5" >自定义</el-radio>
          </el-radio-group>
          <el-date-picker
            label="自定义"
            v-model="search.createTime"
            :disabled="search.createTimeType != 5"
            type="daterange"
            onPick="filterTime"
            placeholder="请选择时间段">
          </el-date-picker>
        </el-form-item>        
        <el-form-item label="标记：">
          <el-checkbox :indeterminate="marks.isIndeterminate" v-model="marks.checkAll" @change="markAllChange(marks.checkAll)">全选</el-checkbox>
          <el-checkbox-group v-model="search.mark" @change="markCheckedChange">
            <el-checkbox v-for="(val, key) in marks.markMap" :label="key" :key="key">{{val}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="来源站点：">
          <el-checkbox :indeterminate="marks.isIndeterminate" v-model="source.checkAll" @change="codeAllChange(source.checkAll)">全选</el-checkbox>
          <el-checkbox-group v-model="search.code" @change="codeCheckedChange">
            <el-checkbox v-for="code in source.items" :label="code.code" :key="code.code">{{code.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-show="optAuth.search" @click="query(1)">查询</el-button>
          <!-- <el-button type="primary" @click="clear">清空</el-button> -->
          <a v-show="optAuth.export" class="el-button el-button--primary exportSpider" download="爬虫信息查询.xlsx" :href="downloadUrl" title="查询结果导出"
            ><i class="icon-download"></i>导出查询结果</a>
          <el-button type="primary" v-show="optAuth.search_keyword" @click="showDialog" title="关键词配置">关键词配置</el-button>
          <el-button type="primary" v-show="optAuth.search_warn" @click="showDialogWarn" title="告警通知配置">告警通知配置</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-table
      highlight-current-row
      border
      stripe
      v-loading.body="loading"
      :max-height="height - 330"
      :data="table.items"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <div class="itemCont">
            <a class="itemTitle" target="_blank" :href="scope.row.url" v-html="filterHtml(scope.row.title,scope.row.keyword)"></a>
            <p v-html="filterHtml(scope.row.summary,scope.row.keyword)"></p>
            <p>涉及信息：<span v-html="filterHtml(scope.row.relatedToInfo,scope.row.keyword)"></span></p>
            <p>关键字：{{scope.row.keyword}}</p>
            <ul>
              <li>来源：{{scope.row.name}}</li>
              <li>作者：{{scope.row.author}}</li>
              <!-- <li>浏览：{{scope.row.hit}}</li> -->
              <!-- <li>回复：{{scope.row.replycount}}</li> -->
              <li>发布时间：{{scope.row.releaseTime}}</li>
              <li>抓取时间：{{scope.row.createTime}}</li>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="操作">
        <template slot-scope="scope">
          <div class="itemOption" v-show="optAuth.mark">
            <div class="itemBtn"><el-button type="primary" @click="excludeSpiderInfo(1, scope.row.id)">排除此记录</el-button></div>
            <div class="itemBtn"><el-button type="primary" @click="excludeSpiderInfo(2, scope.row.author)">排除此作者</el-button></div>
            <el-select class="itemMark" 
              v-model="scope.row.mark" 
              placeholder="标记" 
              @change="markSpiderInfo(scope.row.id,scope.row.mark)"
              @visible-change="visibleChange">
              <el-option v-for="(val, key) in marks.markMap" :label="val" :value="key"
                  :key="key"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px" v-show="optAuth.search_websit">
      共<b>{{table.pager.total}}</b>条记录
      <span v-show="websit.items && websit.items.length">，其中
        <span v-for="(item, index) in websit.items"  :key="index">
          <b> {{item.name}} </b>有<b> {{item.count ? item.count:'0'}} </b>
          条<span v-show="index != websit.items.length-1">，</span>
        </span>
      </span>。
    </div>
    <el-pagination class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="table.pager.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="table.pager.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="table.pager.total">
    </el-pagination>

    <!-- 配置爬虫弹窗框 -->
    <el-dialog :title="dialog.title" size="medium" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="blackListForm" :model="dialog.form" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-button type="primary" v-show="optAuth.add_keyword" @click="spiderKeywordConf(1)" title="新增" style="margin-bottom:10px;">新增</el-button>
          </el-col>
        </el-row>
        <el-table
          highlight-current-row
          border
          :data="keyword.items"
          v-loading="keywordLoad"
          :default-sort = "{prop: 'createTime', order: 'descending'}"
          stripe>
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column 
            prop="keyword"
            width="250"
            label="关键词" >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            :formatter="modifiedStatus"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            sortable
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="updateUser"
            label="修改人"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createUser"
            label="创建人"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            width="100"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div class="keyWordOption">
                <el-button title="修改" type="info" icon='edit' size="mini"
                    v-show="optAuth.edit_keyword"
                    @click.native.prevent="spiderKeywordConf(2, scope.row.id, scope.row.keyword, scope.row.status)"></el-button>
                <el-button title="删除" type="danger" icon='delete' size="mini"
                    v-show="optAuth.del_keyword"
                    @click.native.prevent="delSpiderKeyword(scope.row.id)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
    <!-- 修改/新增弹窗 -->
    <el-dialog :title="keyword.dialog.title" v-model="keyword.dialog.show"  size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="keyword.dialog.form" :rules="rules" ref="keywordForm" label-width="100px" class="dialog-form" >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="关键词：" required prop="keyword">
              <el-input v-model="keyword.dialog.form.keyword" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="状态：" required prop="status" v-show="keyword.dialog.type !== 1">
              <el-select class="itemMark" 
                v-model="keyword.dialog.form.status"
                filterable>
                <el-option v-for="(val, key) in status" :label="val" :value="key"
                    :key="'spider-info-mark'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="注：" class="keywordTip">
                <p>输入的关键词，词语之间用一个空格隔开。以第一个词语作为品牌词，其后的都是敏感词。</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitKeyWord" type="primary" :loading="addKeywordLoad" v-show="optAuth.edit_keyword">保 存</el-button>
        <el-button @click="keyword.dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改/删除弹窗 -->

    <!-- 爬虫预警配置弹窗框 -->
    <el-dialog :title="dialog.warn.title" size="medium" v-model="dialog.warn.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="blackListForm" :model="dialog.warn.form" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-button type="primary" v-show="optAuth.add_warn" @click="spiderWarnConf(1)" title="新增" style="margin-bottom:10px;">新增</el-button>
          </el-col>
        </el-row>
        <el-table
          highlight-current-row
          border
          :data="warn.items"
          v-loading="keywordLoad"
          :default-sort = "{prop: 'createTime', order: 'descending'}"
          stripe>
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column 
            prop="email"
            width="250"
            label="邮箱" >
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            sortable
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="updateUser"
            label="修改人"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createUser"
            label="创建人"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            width="100"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div class="keyWordOption">
                <el-button title="修改" type="info" icon='edit' size="mini"
                    v-show="optAuth.edit_warn"
                    @click.native.prevent="spiderWarnConf(2, scope.row.id, scope.row.email)"></el-button>
                <el-button title="删除" type="danger" icon='delete' size="mini"
                    v-show="optAuth.del_warn"
                    @click.native.prevent="delSpiderWarn(scope.row.id)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.warn.show = false;">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 爬虫预警配置弹窗框 -->
    <!-- 修改/新增预警配置弹窗 -->
    <el-dialog :title="warn.dialog.title" v-model="warn.dialog.show"  size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="warn.dialog.form" :rules="rules" ref="warnForm" label-width="100px" class="dialog-form" >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="邮箱：" required prop="email">
              <el-input v-model="warn.dialog.form.email" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitWarn" type="primary" :loading="addKeywordLoad" v-show="optAuth.edit_warn">保 存</el-button>
        <el-button @click="warn.dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改/新增预警配置弹窗 -->
  </div>
</template>

<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "spider",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      selectTime:'',
      loading:false,
      downloading: false,
      triggerChange: false,
      keywordLoad:false,
      addKeywordLoad:false,
      search:{
        releaseTimeType:0,
        releaseTime:'',
        createTimeType:0,
        createTime:'',
        mark:['1','2','3','4'],
        code:[],
        keyword:'',
        status:'',
        author:'',
      },
      export:{},
      dialog: {
        show: false,
        title: '关键词配置',
        warn: {
          show: false,
          title: '告警邮箱配置',
        }
      },
      keyword: {
        items:[],
        pager: {
          pageSize: 10,
          pageNo: 1,
          total: 0
        },
        dialog:{
          show: false,
          title:'',
          type:'',
          form:{
            id:'',
            keyword:'',
            status:'1',
          }
        },
      },
      warn: {
        items:[],
        pager: {
          pageSize: 10,
          pageNo: 1,
          total: 0
        },
        dialog:{
          show: false,
          title:'',
          type:'',
          form:{
            id:'',
            email:'',
            status:'1',
          }
        },
      },
      websit: {
        items: [],
        total:0,
      },
      marks:{
        markMap: {
          '1':'严重',
          '2':'关注',
          '3':'轻微',
          '4':'未标记',
        },
        checkAll: true,
        isIndeterminate: false,
      },
      status:{
        '1':'有效',
        '2':'无效',
      },
      source:{
        items:[],
        checkAll: true,
        isIndeterminate: false,
      },
      table: {
        items: [],
        pager: {
          pageSize: 10,
          pageNo: 1,
          total: 0
        },
      },
      rules: {
        keyword: [
          { required: true, message: '请输入关键词', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择关键词状态', trigger: 'change' }
        ],
      },
    };
  },

  mounted() {
    this.query(1);
    this.getWebsitList();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        export: 'assist_tools_spider_export',
        search: 'assist_tools_spider_list',
        exclude: 'assist_tools_spider_exclude',
        mark: 'assist_tools_spider_mark',
        search_keyword: 'assist_tools_spider_keyword_list',
        del_keyword: 'assist_tools_spider_keyword_del',
        add_keyword: 'assist_tools_spider_keyword_add',
        edit_keyword: 'assist_tools_spider_keyword_edit',
        search_websit: 'assist_tools_spider_websit_list',
        count_websit: 'assist_tools_spider_websit_count',
        search_warn: 'assist_tools_spider_warn_list',
        del_warn: 'assist_tools_spider_warn_del',
        add_warn: 'assist_tools_spider_warn_add',
        edit_warn: 'assist_tools_spider_warn_edit',
      });
    },
    //导出excel url
    downloadUrl() {
      let params = this.export;
      params.token = bsmp.util.getToken();
      let keyVals = [];
      for (let key in params) {
        keyVals.push(`${key}=${params[key]}`);
      }
      return `${api.path}/spider/export?${keyVals.join('&')}`;
    }
  },
  methods: {
    //标记全选
    markAllChange(val) {
      this.search.mark = val ? Object.keys(this.marks.markMap) : [];
      this.marks.isIndeterminate = false;
    },
    //标记单选
    markCheckedChange(value) {
      let checkedCount = value.length;
      this.marks.checkAll = checkedCount === Object.keys(this.marks.markMap).length
      this.marks.isIndeterminate = checkedCount > 0 && checkedCount < this.marks.markMap.length;
    },
    //来源全选
    codeAllChange(val) {
      let items = this.source.items;
      let arr = [];
      for(let i in items){
        arr.push(Number(items[i].code))
      }
      this.search.code = val ? arr : [];
      this.source.isIndeterminate = false;
    },
    //来源单选
    codeCheckedChange(value) {
      let checkedCount = value.length;
      this.source.checkAll = checkedCount === Object.keys(this.source.items).length
      this.source.isIndeterminate = checkedCount > 0 && checkedCount < this.source.items.length;
    },
    //判断select是通过下拉change触发的
    visibleChange(val){
      this.triggerChange = val;
    },
    //格式化状态
    modifiedStatus(row){
      if(row.status && row.status === 1){
        return '有效'
      }else if(row.status && row.status === 2){
        return '无效'
      }
    },
    //标题、内容高亮关键词
    filterHtml(value,keyword){
      if (!value) return '';
      if(keyword){
        let keyArr = keyword.split(' ');
        for(let i=0;i<keyArr.length;i++){
          value = value.replace(new RegExp(keyArr[i],'g'),'<span style="color:red">'+keyArr[i]+'</span>');
        }
      }
      return value
    },
    //查询爬虫信息
    query (type){
      let params = this.getQueryParams();
      //导出使用查询参数
      this.export = params;
      params = Object.assign({}, params, this.table.pager);
      //是否查询站点信息
      if(type && type == 1){
        params.countFlag = type
      }else{
        params.countFlag = 0
      };
      this.loading = true;
      api.getSpiderList(params).then(res => {
        this.loading = false;
        let data = res.data;
        if (data && data.code === '0') {
          this.table.items = data.data.data;
          //标记number类型转string
          for(let i in this.table.items){
            this.table.items[i].mark = this.table.items[i].mark.toString();
          }
          this.table.pager = Object.assign({}, this.table.pager,
            {
              pageNo: data.data.pageNo,
              total: data.data.total
            });
          if(data.ext){
            this.websit.items = data.ext;
            this.websit.total = 0;
            for(let i in data.ext){
              this.websit.total += data.ext[i].count;
            }
          }else{
            this.websit.total = 0
          }
        }
      }).catch(e => {
        this.loading = false;
      })
    },
    //获取parems
    getQueryParams(){
      let params = bsmp.util.deleteBlank(this.search);
      // 发布时间处理
      if (params.releaseTimeType==5 && params.releaseTime && params.releaseTime.length && params.releaseTime[0] && params.releaseTime[1]) {
        params.releaseTimeStart = bsmp.util.formatDate.format(params.releaseTime[0], 'yyyy-MM-dd hh:mm:ss');
        params.releaseTimeEnd = bsmp.util.formatDate.format(params.releaseTime[1], 'yyyy-MM-dd') + ' 23:59:59';
        delete params.releaseTime;
        delete params.releaseTimeType;
      }else{
        delete params.releaseTime;
      }
      // 抓取时间处理
      if (params.createTimeType==5 && params.createTime && params.createTime.length && params.createTime[0] && params.createTime[1]) {
        params.createTimeStart = bsmp.util.formatDate.format(params.createTime[0], 'yyyy-MM-dd hh:mm:ss');
        params.createTimeEnd = bsmp.util.formatDate.format(params.createTime[1], 'yyyy-MM-dd') + ' 23:59:59';
        delete params.createTime;
        delete params.createTimeType;
      }else{
        delete params.createTime;
      }
      // 标记数组分割
      if(params.mark && params.mark.length){
        params.mark = params.mark.toString();
      }else{
        delete params.mark;
      }
      // 来源站点数组分割
      if(params.code && params.code.length){
        params.code = params.code.toString();
      }else{
        delete params.code;
      }
      
      return params;
    },
    //清空
    // clear (){
    //   //标记与来源站点默认全选
    //   let sourceArr = [];
    //   let markArr = [];
    //   for (let i = 0, len = this.source.items.length; i < len; i++) {
    //     let code = this.source.items[i].code;
    //     sourceArr.push(code);
    //   }
    //   for (let i in this.marks.markMap){
    //     markArr.push(i)
    //   }
    //   this.search = {
    //     releaseTimeType:2,
    //     releaseTime:'',
    //     releaseTimeStart:'',
    //     releaseTimeEnd:'',
    //     createTimeType:2,
    //     createTime:'',
    //     createTimeStart:'',
    //     createTimeEnd:'',
    //     mark:markArr,
    //     code:sourceArr,
    //     keyword:'',
    //     status:'',
    //     author:'',
    //   }
    //   this.marks.checkAll = true;
    //   this.source.checkAll = true;
    // },
    //获取关键词配置
    getSpiderKeyword (){
      api.getSpiderKeyword().then(res => {
        let data = res.data;
        if(data && data.code === '0'){
          this.keyword.items = data.data
        }
      }).catch(e => {
      })
    },
    //显示添加、修改关键词弹窗
    spiderKeywordConf (type, id, keyword, status ) {
      if (this.$refs['blackListForm'] && this.$refs['blackListForm'].resetFields) {
        this.$refs['blackListForm'].resetFields();
      }
      this.keyword.dialog.title = type === 1 ? '新增关键词' : '修改关键词';
      this.keyword.dialog.type = type;
      // 编辑
      if (id && this.keyword.dialog.type === 2 ) {
        this.keyword.dialog.form.id = id;
        this.keyword.dialog.form.keyword = keyword;
        this.keyword.dialog.form.status = status.toString();
      } else {
        this.keyword.dialog.form={
          id:'',
          keyword:'',
          status:'1',
        }
      }
      this.keyword.dialog.show = true;
    },
    //添加或修改关键词
    submitKeyWord(){
      this.$refs['keywordForm'].validate((valid) => {
        if(valid){
          this.addKeywordLoad = true;
          if (this.keyword.dialog.type === 1) {
            // 新增
            let params = {
              keyword: this.keyword.dialog.form.keyword
            };
            api.addSpiderKeyword(params).then((res) => {
              this.addKeywordLoad = false;
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                this.getSpiderKeyword();
                this.keyword.dialog.show = false;
              }
            }).catch(e => {
              this.addKeywordLoad = false;
            });
          } else {
            // 修改
            let params = {
              id: this.keyword.dialog.form.id,
              keyword: this.keyword.dialog.form.keyword,
              status: this.keyword.dialog.form.status,
            };
            api.editSpiderKeyword(params).then((res) => {
              this.addKeywordLoad = false;
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.getSpiderKeyword();
                this.keyword.dialog.show = false;
              }
            }).catch(e => {
              this.addKeywordLoad = false;
            });
          }
        }
      })
    },
    //删除关键词
    delSpiderKeyword (id){
      this.$confirm('确定要删除记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.keywordLoad = true;
        // 删除
        api.delSpiderKeyword({id:id}).then((res) => {
          this.keywordLoad = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getSpiderKeyword();
          }
        }).catch(e => {
          this.keywordLoad = false;
        });
      }).catch(e => {
      });
    },

    //获取告警邮箱配置
    getSpiderWarn (){
      api.getSpiderWarn().then(res => {
        let data = res.data;
        if(data && data.code === '0'){
          this.warn.items = data.data
        }
      }).catch(e => {
      })
    },
    //显示添加、修改告警邮件弹窗
    spiderWarnConf (type, id, email) {
      if (this.$refs['blackListForm'] && this.$refs['blackListForm'].resetFields) {
        this.$refs['blackListForm'].resetFields();
      }
      this.warn.dialog.title = type === 1 ? '新增邮箱' : '修改邮箱';
      this.warn.dialog.type = type;
      // 编辑
      if (id && this.warn.dialog.type === 2 ) {
        this.warn.dialog.form.id = id;
        this.warn.dialog.form.email = email;
      } else {
        this.warn.dialog.form={
          id:'',
          warn:'',
        }
      }
      this.warn.dialog.show = true;
    },
    //添加或修改告警邮箱
    submitWarn(){
      this.$refs['warnForm'].validate((valid) => {
        if(valid){
          this.addKeywordLoad = true;
          if (this.warn.dialog.type === 1) {
            // 新增
            let params = {
              email: this.warn.dialog.form.email
            };
            api.addSpiderWarn(params).then((res) => {
              this.addKeywordLoad = false;
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                this.getSpiderWarn();
                this.warn.dialog.show = false;
              }
            }).catch(e => {
              this.addKeywordLoad = false;
            });
          } else {
            // 修改
            let params = {
              id: this.warn.dialog.form.id,
              email: this.warn.dialog.form.email,
            };
            api.editSpiderWarn(params).then((res) => {
              this.addKeywordLoad = false;
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.getSpiderWarn();
                this.warn.dialog.show = false;
              }
            }).catch(e => {
              this.addKeywordLoad = false;
            });
          }
        }
      })
    },
    //删除告警邮箱
    delSpiderWarn (id){
      this.$confirm('确定要删除记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.keywordLoad = true;
        // 删除
        api.delSpiderWarn({id:id}).then((res) => {
          this.keywordLoad = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getSpiderWarn();
          }
        }).catch(e => {
          this.keywordLoad = false;
        });
      }).catch(e => {
      });
    },

    //排除信息
    excludeSpiderInfo (type,val){
      let typeName = '';
      let params = {
        status:'2',
      };
      if (type === 1 ) {
        params.ids = val;
        typeName = '记录';
      } else if(type === 2 ){
        params.author = val;
        typeName = '作者';
      }
      this.$confirm('确定要排除此'+typeName+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        api.excludeSpiderInfo(params).then(res => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '排除成功!'
            });
            this.query(1);
          }
        }).catch(e => {
          this.loading = false;
        })
      }).catch(e => {
      });
      
    },
    //标记爬虫信息
    markSpiderInfo (id,val){
      if(!this.triggerChange){
        return
      }
      val = val ? Number(val) : '';
      let params = {
        ids: id,
        mark: val,
      };
      this.loading = true;
      api.markSpiderInfo(params).then(res => {
        this.loading = false;
        let data = res.data;
        if (data && data.code === '0') {
          this.$message({
            type: 'success',
            message: '标记成功!'
          });
        }
        this.query(1);
      }).catch(e => {
        this.loading = false;
      })
    },
    //获取站点
    getWebsitList (){
      api.getWebsitList().then(res => {
        let data = res.data;
        if(data && data.code === '0'){
          this.source.items = data.data;
          for(let i in data.data){
            this.search.code.push(data.data[i].code)
          }
        }
      }).catch(e => {
      })
    },
    //显示弹窗
    showDialog () {
      this.getSpiderKeyword();
      this.dialog.show = true;
    },
    //显示告警通知配置弹窗
    showDialogWarn () {
      this.getSpiderWarn();
      this.dialog.warn.show = true;
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
  }
};
</script>
<style lang="stylus" scoped>
  .exportSpider
    text-decoration:none;
  .searchTime
    display:inline-block;
    margin-left:20px;
  .el-checkbox-group
    display:inline;
    margin-left:10px;
  .itemCont
    margin:20px 0;
    line-height:24px;
    .itemTitle
      font-weight:bold;
      font-size:16px;
      color:#333;
      text-decoration:none;
      &:hover
        text-decoration:underline;
    p
      margin-bottom:10px;
    ul
      li
        margin-right:15px;
        list-style:none;
        display:inline;
  .itemOption
    text-align:center
    .itemBtn
      margin:5px auto;
      button
        width:120px;
    .itemMark
      width:120px;
  .keyWordOption
    margin:5px 0;
  .icon-download
    font-size: 80%
</style>
