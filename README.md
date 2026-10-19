# 桌邊小鼠

Vite、React、TypeScript 製作的辦公室打地鼠遊戲。

## 本機執行

```sh
npm ci
npm run dev
```

## 發布到 GitHub Pages

1. 將專案推送到 GitHub 上的 `main` 分支。
2. 在儲存庫的 **Settings → Pages → Build and deployment**，將來源設為 **GitHub Actions**。
3. 等待 **Actions** 裡的 `Deploy to GitHub Pages` 工作完成；之後每次推送 `main` 都會自動更新網站。

網站網址會是 `https://<GitHub 帳號>.github.io/<儲存庫名稱>/`。若儲存庫設為 Public，專案原始碼也會公開。
