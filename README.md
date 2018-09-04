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
        |-- courseware          // 系统维护 -> 直播间管理  -   霍金朝
        |-- Dealer              // 系统维护 -> 经销商管理  -   叶海峰
        |-- Organization        // 系统维护 -> 机构管理   -   叶海峰
        |-- Package             // 系统维护 -> 版本管理   -   叶海峰
        |-- School              // 系统维护 -> 生源学校   -   叶海峰
        |-- Arrange             // 排班上课 -> 上课安排   -   叶海峰
        |-- Arrstudent          // 排班上课 -> 约课学生   -   叶海峰
        |-- Class               // 排班上课 -> 约课班级   -   叶海峰
        |-- Change              // 变更调度 -> 转班管理   -   叶海峰
        |-- Quit                // 变更调度 -> 退班管理   -   叶海峰
        |-- Freeze              // 变更调度 -> 挂起管理   -   叶海峰
        |-- Parent              // 注册用户 -> 家长管理   -   叶海峰
        |-- Student             // 注册用户 -> 学生管理   -   叶海峰
        |-- Datail              // 财务中心 -> 账户管理   -   叶海峰
        |-- Drawmoney           // 财务中心 -> 用户提现   -   叶海峰
        |-- Dealeraccount       // 财务中心 -> 经销商结算  -   叶海峰
        |-- Departmentaccount   // 财务中心 -> 机构结算   -   叶海峰
        |-- Curriculum          // 课程中心 -> 课程管理   -   苏严萍
        |-- Category            // 商品中心 -> 品类管理   -   苏严萍
        |-- Product             // 商品中心 -> 商品管理   -   苏严萍
        |-- Order               // 商品中心 -> 订单管理   -   苏严萍
        |-- Discount            // 商品中心 -> 优惠券管理 -   苏严萍
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
