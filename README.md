# 认知需求量表 (NCS-18) 交互测评

一个高质感的交互式测评页面，用于测量个体的**认知需求 (Need for Cognition, NFC)**。

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://cpu-1126-sskk.github.io/ncs-18/)

## 🌟 项目亮点

- **深邃美学**：专为智性思考设计的暗色主题，采用玻璃拟态（Glassmorphism）和流光交互动效。
- **单题聚焦**：v1.1.0 新增，每次仅显示一题，选后自动平移切页，降低长表单的认知负担。
- **可视化仪表盘**：结果页采用 SVG 动态表盘，直观展示得分在量表中的位置。
- **精准逻辑**：完整实现 NCS-18 计分规则，自动处理 9 道反向计分题（3, 4, 5, 7, 8, 9, 12, 16, 17）。
- **国内友好**：针对国内访问环境优化，字体源切换至 `fonts.font.im` 镜像，并配置了完善的系统字体回退方案。
- **极致适配**：针对移动端优化 Likert 量表布局，支持横向操作。

## 🧠 关于认知需求 (NFC)

认知需求是指个体参与并享受艰苦智力活动的倾向。本测评基于 18 题版本的 NCS 量表：
- **高认知需求 (≥72)**：享受智力挑战，主动分析高难度信息。
- **中等认知需求 (46-71)**：根据情境重要性平衡思考投入。
- **低认知需求 (≤45)**：偏好直截了当、低认知消耗的任务。

## 🚀 快速开始

1. **在线访问**：[https://cpu-1126-sskk.github.io/ncs-18/](https://cpu-1126-sskk.github.io/ncs-18/)
2. **本地开发**：
   ```bash
   # 克隆仓库
   git clone https://github.com/cpu-1126-sskk/ncs-18.git
   # 使用任意静态服务器运行，例如 Python
   cd ncs-18
   python3 -m http.server 8081
   ```

## 🛠️ 技术栈

- **Core**: Vanilla HTML5 / JavaScript (ES6+)
- **Styling**: Vanilla CSS3 (Custom Variables, Backdrop-filter)
- **Fonts**: Inter, Outfit (via fonts.font.im)
- **Deployment**: GitHub Pages


