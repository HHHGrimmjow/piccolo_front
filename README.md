# Piccolo Front 🎲

> 帮你做选择，投票更有趣！

Piccolo 是一个面向年轻人的选择投票网站前端项目，采用可爱俏皮的粉色系设计风格，提供流畅的投票互动体验。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 4.5
- **状态管理**: Pinia 2.1
- **路由**: Vue Router 4.2
- **UI 组件**: Element Plus 2.4
- **HTTP 客户端**: Axios 1.6
- **图表**: ECharts 5.4
- **样式**: SCSS

## 功能特性

### 页面功能
- 🏠 **首页** - 话题列表展示、搜索、排序
- 🔐 **登录/注册** - 用户认证
- 📝 **发起投票** - 创建投票话题（支持图片上传）
- 🗳️ **投票详情** - 查看话题、投票、评论
- 👤 **个人中心** - 资料编辑、投票历史
- 🏆 **排行榜** - 热门话题和活跃用户

### 交互特色
- 🎲 **随机投票** - 一键帮你随机选择选项
- 📊 **实时结果** - 投票后显示动态进度条
- 💬 **评论互动** - 支持嵌套回复的评论系统
- 🎨 **可爱风格** - 粉色渐变、圆角卡片、流畅动画
- 📱 **响应式设计** - 适配移动端和桌面端

## 项目结构

```
src/
├── api/              # API 请求模块
│   ├── auth.js       # 认证相关
│   ├── topic.js      # 话题相关
│   ├── user.js       # 用户相关
│   └── ranking.js    # 排行榜
├── assets/           # 静态资源
│   └── main.scss     # 全局样式
├── components/       # 通用组件
│   ├── LayoutHeader.vue    # 顶部导航
│   ├── TopicCard.vue       # 话题卡片
│   └── CommentSection.vue  # 评论区
├── router/           # 路由配置
│   └── index.js
├── stores/           # Pinia 状态管理
│   ├── user.js       # 用户状态
│   └── topic.js      # 话题状态
├── utils/            # 工具函数
│   └── request.js    # Axios 封装
├── views/            # 页面视图
│   ├── HomeView.vue         # 首页
│   ├── LoginView.vue        # 登录
│   ├── RegisterView.vue     # 注册
│   ├── TopicDetailView.vue  # 话题详情
│   ├── TopicCreateView.vue  # 创建话题
│   ├── ProfileView.vue      # 个人中心
│   └── RankingView.vue      # 排行榜
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 快速开始

### 1. 环境要求
- Node.js >= 14.18（推荐 16+）
- npm >= 6.0

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173`

### 4. 构建生产版本
```bash
npm run build
```

### 5. 预览生产构建
```bash
npm run preview
```

## 配置说明

### Vite 配置
`vite.config.js` 中已配置后端 API 代理：
```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

### 环境变量（可选）
如需自定义后端地址，可创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:8080
```

## 样式设计

### 主题色
```scss
--pink: #ff6b9d;          // 主色调
--pink-light: #fff0f5;    // 浅粉色背景
--purple: #c44dff;        // 辅助色
--purple-light: #f3e8ff;  // 浅紫色背景
```

### 设计特点
- 渐变背景：粉色到紫色的柔和过渡
- 圆角卡片：20px-24px 大圆角
- 流畅动画：hover 效果、页面切换动画
- 可爱元素：emoji 图标、bounce 动画

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 开发计划

- [ ] 暗色模式切换
- [ ] ECharts 投票结果图表
- [ ] 话题标签分类
- [ ] 分享功能
- [ ] PWA 支持
- [ ] 国际化

## 相关项目

- [Piccolo Backend](https://github.com/HHHGrimmjow/piccolo_backend) - 后端服务

## License

MIT License
