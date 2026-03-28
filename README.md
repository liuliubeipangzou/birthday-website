# Birthday Website

一个送给女朋友的生日网页，记录从 `2018-09-16` 开始的恋爱时间。

## 本地预览

```bash
python3 -m http.server 4173
```

然后打开 `http://localhost:4173`。

## 部署到 GitHub 和 Vercel

1. 初始化仓库并提交：

   ```bash
   git init
   git add .
   git commit -m "Create birthday website"
   ```

2. 推送到 GitHub 新仓库。
3. 在 Vercel 导入这个 GitHub 仓库。
4. Framework Preset 选择 `Other`，直接部署即可。

## 可改内容

- [index.html](/Users/tulei/code/ai/ddd/index.html) 里的文案
- [script.js](/Users/tulei/code/ai/ddd/script.js) 里的恋爱开始时间
