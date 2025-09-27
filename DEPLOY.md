# 部署到 Deno Deploy 指南

## 方法一：通过 GitHub 部署（推荐）

1. **准备代码**
   - 确保所有文件都在项目根目录
   - 确保 `main.ts` 是入口文件
   - 确保 `deno.json` 配置正确

2. **推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **在 Deno Deploy 部署**
   - 访问 [Deno Deploy Dashboard](https://dash.deno.com/)
   - 点击 "New Project"
   - 选择 "Import from GitHub repository"
   - 选择你的仓库
   - 设置项目名称
   - 设置入口文件为 `main.ts`
   - 点击 "Deploy"

## 方法二：通过 Deno Deploy CLI

1. **安装 Deploy CLI**
   ```bash
   deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
   ```

2. **登录 Deno Deploy**
   ```bash
   deployctl auth login
   ```

3. **部署项目**
   ```bash
   deployctl deploy --project=your-project-name main.ts
   ```

## 环境变量

如果需要设置环境变量，在 Deno Deploy Dashboard 中：
- 进入项目设置
- 在 "Environment Variables" 部分添加变量
- 例如：`PORT=8000`

## 权限说明

项目需要以下权限：
- `--allow-net`: 网络访问
- `--allow-read`: 文件读取
- `--allow-env`: 环境变量访问

这些权限在 `deno.json` 中已配置。

## 测试部署

部署完成后，访问你的 Deno Deploy URL 测试功能：
- 主页：`https://your-project-name.deno.dev/`
- API：`https://your-project-name.deno.dev/api/generate`

## 故障排除

1. **权限错误**：确保 `deno.json` 中包含所有必要权限
2. **导入错误**：检查所有依赖的 URL 是否正确
3. **文件路径错误**：确保静态文件路径正确
4. **端口错误**：确保使用环境变量 `PORT`

## 性能优化

- 使用 `--watch` 标志进行开发
- 生产环境不需要 `--watch` 标志
- 考虑使用 CDN 加速静态资源
