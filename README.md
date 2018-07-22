# saas.final.vue - 麦克斯韦后台管理v2.0

## # Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## # 线上地址

```text
测试版地址：https://oa-v2-admin.caihonggou.com
```

## # 原型地址

```text
http://ax.gy720.com/houtaiguanli/#g=1&p=%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E

账号：caihonggou
密码：chg5995993
```

## # 技术栈说明

```text
vue + vue-router + vuex + element-ui
```

## # 项目结构说明

```text
······
|-- src
    |-- assets          // 静态资源，按views结构组织，公用的则放在首层
    |-- components      // 全局组件
        |-- AppComponent        // 全局组件，以 App- 前缀命名，包含readme说明文件
    |-- mixins          // 全局组件混合
    |-- plugins         // 全局组件实例可调用的api
    |-- router          // 路由管理
    |-- store           // 数据管理
    |-- style           // 全局样式
        |-- index.css           // 入口
        |-- base.css            // 全局基础、element-ui样式重置
        |-- vars.css            // 全局变量
    |-- utils           // 全局工具
        |-- rules.js            // 表单校验规则
        |-- http.js             // ajax请求封装
        |-- ...
    |-- views           // 视图模块
        |-- components          // 公用组件
        |-- Subject             // 课程中心 -> 学科管理   -   霍金朝
        |-- courseware          // 课程中心 -> 课时内容   -   霍金朝
    |-- App.vue         // 根组件
    |-- main.js         // 程序入口
......
```

## # 开发文档

详情见document.md
