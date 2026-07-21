# Liyang's Blog - 极客主页与项目索引

这是一个针对全键盘与终端极客定制的、无需复杂构建框架（如 Docusaurus、Gatsby）的个人博客主页。

主要使用 **原生 HTML5 / CSS3 / JavaScript** 编写，使用 `marked.js` 实现在浏览器端动态异步渲染 Markdown 博客文章。

## 目录结构

```text
my_blog/
├── index.html         # 博客主页 (Neofetch, 项目卡片, 文章与随笔列表)
├── post.html          # 通用文章渲染模板 (动态解析 posts/*.md)
├── README.md          # 维护说明文档 (本文件)
├── assets/
│   ├── style.css      # 自适应亮暗色主题、毛玻璃与微动画样式表
│   └── main.js        # 键盘快捷键监听与 Tab 路由控制器
└── posts/             # 存放 Markdown 博客文章与随笔
    ├── pzt-design.md  # 示例技术博客
    └── spring-rain.md # 示例随笔
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

## 部署到 GitHub Pages (`wangliyang.com`)

因为原生的博客没有任何编译或构建链路，部署非常简单：

1. **清理旧的 Docusaurus 目录**：
   进入你的 `wangliyangleon.github.io` 仓库本地目录，备份并删除里面所有的 Docusaurus 源文件（如 `docusaurus.config.js`、`src/`、`static/` 等），只留下 `.git` 文件夹和 `CNAME` 文件（`CNAME` 包含 `wangliyang.com` 以保持你的域名重定向）。

2. **复制新博客文件**：
   将 `my_blog` 下的所有文件（`index.html`、`post.html`、`assets/`、`posts/`）复制到你的 GitHub 仓库根目录。

3. **推送代码**：
   ```bash
   git add .
   git commit -m "feat: deploy lightweight geek-style vanilla blog homepage"
   git push origin main
   ```
   推送后数分钟内，GitHub Pages 就会自动上线你的新主页。

---

## 如何写新博客？

为了保持极简，我们跳过了传统的 SSG 编译，使用前端 JSON 驱动的列表。当你想写一篇新文章时：

1. **新建 Markdown 文件**：
   在 `posts/` 目录下创建一个新文件，例如 `posts/my-new-post.md`。使用标准的 Markdown 语法撰写内容，首行可以写一个 `# 你的标题`。

2. **注册到主页数据库**：
   打开 `assets/main.js` 文件，在最顶部的 `articles` 数组中，仿照已有格式添加你的文章元数据：

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
   
   同样，如果你在 `post.html` 中也想要实现单独打开直接刷新，也可以在 `post.html` 底部脚本的 `articleDB` 中注册对应的 ID（或者你直接引用 `assets/main.js` 的 `articles` 数组，本项目为了结构极简采用两处注册，你可以未来根据需要引入一个公共 of `db.js` 以保持 DRY 原则）。
