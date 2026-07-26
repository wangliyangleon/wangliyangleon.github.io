# Liyang's Blog - 极客主页与项目索引

这是一个针对全键盘与终端极客定制的、无需复杂构建框架（如 Docusaurus、Gatsby）的个人博客主页。

主要使用 **原生 HTML5 / CSS3 / JavaScript** 编写，使用 `marked.js` 实现在浏览器端动态异步渲染 Markdown 博客文章。

## 目录结构

```text
.
├── index.html         # 博客主页 (Neofetch, 项目卡片, 文章与随笔列表)
├── post.html          # 通用文章渲染模板 (动态解析 posts/*.md)
├── README.md          # 维护说明文档 (本文件)
├── CNAME              # GitHub Pages 自定义域名 (wangliyang.me)
├── assets/
│   ├── style.css      # 自适应亮暗色主题、毛玻璃与微动画样式表
│   └── main.js        # 键盘快捷键监听、Tab 路由控制器与项目/文章数据
└── posts/             # 存放 Markdown 博客文章与随笔 (目前为空，见下文说明)
```

## 本地预览

由于网页包含了以 `fetch()` 动态请求本地 Markdown 文件的异步逻辑，直接双击 `index.html` 在浏览器中打开可能会因为浏览器的跨域安全策略 (CORS) 导致文章加载失败。

你需要在本地启动一个轻量级的 HTTP 开发服务器来进行预览。在当前目录下运行：

```bash
# 使用 Python3 快速启动
python3 -m http.server 8000
```

启动后，在浏览器访问：[http://localhost:8000](http://localhost:8000) 即可进行完整的键盘交互与文章阅读体验。

---

## 极客快捷键交互

在博客的任何页面（非输入聚焦状态下），你可以通过键盘敲击实现秒切和控制：

* `1` / `2` / `3` - 切换主页 Tab（1: PROJECTS, 2: TECH_BLOG, 3: WRITINGS）
* `H` / `L` - 向前/向后切换主页 Tab
* `/` - 快速聚焦到搜索框，开始输入过滤
* `T` - 快速在 **DARK** (暗色) 和 **LIGHT** (复古纸张亮色) 主题间切换
* `?` - 隐藏/显示浮动的快捷键指示面板

---

## 部署到 GitHub Pages (`wangliyang.me`)

本仓库本身就是 GitHub Pages 的部署根目录，没有任何编译或构建链路，直接推送即可上线：

```bash
git add .
git commit -m "更新内容"
git push origin main
```

推送后数分钟内，GitHub Pages 就会自动更新 [wangliyang.me](https://wangliyang.me)。`CNAME` 文件已包含该自定义域名，无需额外配置。

---

## 如何写新博客？

为了保持极简，我们跳过了传统的 SSG 编译，使用前端 JSON 驱动的列表。当你想写一篇新文章时：

1. **新建 Markdown 文件**：
   在 `posts/` 目录下创建一个新文件，例如 `posts/my-new-post.md`。使用标准的 Markdown 语法撰写内容，首行可以写一个 `# 你的标题`。

2. **注册到主页列表**：
   打开 `assets/main.js` 文件，在最顶部的 `articles` 数组中添加你的文章元数据（默认为空数组 `[]`，按下面格式追加即可）：

   ```javascript
   {
     id: 'my-new-post',            // 必须与 posts/ 下的 md 文件名一致 (排除 .md 后缀)
     title: '你新文章的标题',        // 显示在列表和文章页大标题
     date: '2026-07-21',           // 日期
     category: 'tech',             // 'tech' 代表技术博客，'writings' 代表随笔文学
     tags: ['C++', 'Performance'], // 标签 (支持按此过滤)
     summary: '文章的一句话简介...'  // 主页列表预览文案
   }
   ```

3. **注册到文章页数据库**：
   `post.html` 通过独立的 `articleDB` 对象查找并渲染文章（同样默认为空对象 `{}`），需要在其底部脚本中补充对应条目：

   ```javascript
   'my-new-post': {
     title: '你新文章的标题',
     date: '2026-07-21',
     tag: 'tech',           // 'poetry' 会触发随笔专属的排版样式
     file: 'my-new-post.md' // posts/ 目录下的实际文件名
   }
   ```

   本项目为了结构极简，在 `main.js` 与 `post.html` 中各维护一份数据，未来如需减少重复可以考虑抽取一个公共的 `db.js`。
