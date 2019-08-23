## 功能清单

* 基于 [Vue][] **2.3.4**、[Vuex][] **2.3.1**、[Element][] **1.4.3**
* 建立整体前端目录结构

## [开发]()

## icon 图库
  * https://www.iconfont.cn/

### 前提

  * Node >= v5

  * NPM >= v3

  * Webpack v3


## 构建步骤
``` 脚本
# 安装依赖
cd html
npm install

# 运行开发模式
cd html
npm run dev

# 生产模式构建脚本
cd html
npm run build
```

## UAT场自动发布
```

# 运行uat指令
cd html
npm run uat
  
```

## 线上环境构建打包
# 以新接入的abc模块为例，切换到develop分支开发完abc模块，并完成uat场的测试后准备上线构建打包
```

# 切换到release分支，并拉取release分支最新代码
git checkout release
git pulll

# 强制合并abc模块到release分支
# 注意：不可智能合并(merge)develop分支代码到release分支，以防把其他接入的模块合并到release分支，并一并发布到上线引发故障
git checkout develop html/src/views/abc/

# 检查文件状态
git status -s
# 添加文件
git add .
# 提交 注释（模块名-版本号）
git commit -m 'abc-1.0.0'
# push到远程分支
git push

# 构建打包，在html目录下取zip包上传到ops
cd html
npm run build

# 经上线验证无故障一段时间后合并到master分支
git checkout master
git merge release
git push

```

## 配置npm私服
```
# npm registry 配置：寻找操作系统.npmrc文件路径（如：C:\Users\link\.npmrc）
# 将如下配置复制到.npmrc配置文件中
registry=http://192.168.35.11/nexus/repository/npm-all/
email=alan.wu@gwtsz.net
always-auth=true
_auth=YnNtcC1hZG1pbjpic21wMTIz
```

### **注意事项**
# 系统模块配置路由时必须设置webpackChunkName，以便将系统模块下的所有代码打包到指定的webpackChunkName的同一个js文件中
```
const configs  = () => import(/* webpackChunkName: "cfg_center-1.0.0" */ './pages/configs');
const upload  = () => import(/* webpackChunkName: "cfg_center-1.0.0" */ './pages/upload');
export default [
  {
    path: '/cfg_center/configs',
    component: configs
  },
  {
    path: '/cfg_center/upload',
    component: upload
  }
]

```

## 下载NPM私服中注册系统模块（abandoned）
```
# 运行install指令
cd html/bin
node install.js
```

## 发布开发系统模块到NPM私服中（abandoned）
```

# 运行deploy指令
cd html/bin
node deploy.js
```

## Element-UI 自定义主题
```
# 安装工具
cd html
npm i element-theme -g
# 安装默认主题
npm i https://github.com/ElementUI/theme-default -D
# 修改变量element-variables.css
# 编译主题
et
```

[Vue]: http://vuejs.org
