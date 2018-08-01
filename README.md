# saas.final.vue - 麦克斯韦后台管理v2.0

## # 原型地址

```text
http://ax.gy720.com/

账号：caihonggou
密码：chg5995993

项目：admin2.0
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
        |-- Subject             // 系统维护 -> 角色管理   -   霍金朝
        |-- courseware          // 系统维护 -> 用户管理   -   霍金朝
    |-- App.vue         // 根组件
    |-- main.js         // 程序入口
......
```

## # 模块开发规范

- SFC结构顺序`<script>` -> `<template>` -> `<style>`，在`<style>`头部至少添加**开发者**和**模块介绍**两项信息；

- 模块目录下创建index.js作为路由导出，在@/router/main中引入；

- 在@/view/Main/Menu.vue，中添加菜单（如果后端没有给权限，和后端沟通）；

- 在README.MD的**项目结构说明**的view结构下，按格式添加已完成的模块；

## # GIT代码提交规范

- 调试性代码不允许提交；

- 开发使用的假数据不允许提交；

- 提交代码前在浏览器和编辑器调试信息中确认没有报错信息后才能commit；

## # 开发文档

详情见document.md
