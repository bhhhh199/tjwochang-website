# 天津沃昌机械设备有限公司 · 官网

纯静态网站，不需要服务器和数据库。内容保存在 `content/` 目录的 JSON 文件里，可以用 Pages CMS 在线编辑。

## 目录结构

```
index.html          首页
about.html          企业简介
products.html       产品中心（每个产品可点进详情）
cases.html          客户与案例（含互动地图与历史项目清单）
honors.html         资质荣誉
contact.html        联系我们

content/            网站的文字内容（JSON，后台编辑的就是这些文件）
assets/css/         样式
assets/js/          前端脚本
assets/img/         图片素材
assets/vendor/      ECharts 图表库与中国地图数据
tools/build.py      把 content 里的内容写进 HTML（离线查看用）
.pages.yml          Pages CMS 后台配置
```

## 本地查看

直接双击 `index.html` 即可，页面会使用内嵌的内容快照，不需要联网。

## 修改内容

1. 在线：登录 https://app.pagescms.org ，用 GitHub 账号授权后选择本仓库，即可编辑文字、上传图片、新增或下架产品。
2. 本地：直接改 `content/*.json`，改完后运行 `python tools/build.py` 更新各页面内嵌的快照。

> 在线编辑后，网站会立即显示新内容；本地双击打开的那份需要重新运行 `tools/build.py` 才会同步。

## 部署

推送到 GitHub 仓库的 `main` 分支，在仓库 Settings → Pages 里选择 `main` 分支根目录即可。
