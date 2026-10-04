# 校园二手交易平台 · 前端 campus-market-web

> Vue 3.5 · Vite · axios

校园二手交易平台的前端。后端仓库：[`campus-market`](https://github.com/Vega0717/campus-market)

## 功能

- 商品列表：表格展示，支持分页、关键词搜索、状态筛选
- 发布商品：标题 / 价格 / 分类 / 卖家 / 联系方式 / 描述，带前端基础校验
- 标记已售出、删除商品
- axios 统一封装，响应拦截器自动拆掉后端的 `{code, msg, data}` 外壳

## 技术栈

| 项 | 选型 |
|---|---|
| 框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建 | Vite |
| 请求 | axios（自定义实例 + 拦截器） |
| 样式 | 原生 CSS（无 UI 框架） |

## 目录结构

```
campus-market-web
├── index.html
├── vite.config.js              # /api 代理到后端 8080
└── src
    ├── main.js                 # 应用入口
    ├── App.vue                 # 页头 + 布局
    ├── style.css               # 全局样式
    ├── api/item.js             # axios 封装 + 响应拦截器
    └── views/ItemList.vue      # 列表页（表格 / 搜索 / 发布表单）
```

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
```

**必须先启动后端**（`campus-market` 仓库，跑在 8080）。前端开发服务器把 `/api` 开头的请求代理到 `http://localhost:8080`，所以本地不会出现跨域问题。

打包：

```bash
npm run build      # 产物在 dist/，可直接交给 Nginx 托管
```

## 和后端的约定

1. 所有请求都带 `/api` 前缀，开发期由 Vite 代理，生产期由 Nginx 反代，代码里不用写死后端地址。
2. 后端统一返回 `{ "code": 0, "msg": "ok", "data": ... }`。拦截器里判断 `code !== 0` 就直接 `reject`，业务代码拿到的永远是干净的数据。
3. 这一层的好处是：后端换错误码、换包装结构，只需要改拦截器一处。

## 已知限制

- 写操作（发布 / 标记售出 / 删除）之后重新拉一次列表，没有做乐观更新
- 未引入路由（vue-router），目前是单页
- 未做移动端适配，表格在窄屏会横向滚动
- 未做登录态与权限，任何人都能发布和删除

## 说明

个人练手项目，配合后端一起写，代码以「能讲清楚每一处为什么这么写」为标准。

GitHub：[@Vega0717](https://github.com/Vega0717)
