/**
 * 学生校内双证管理系统 - 演示 PPT 生成脚本
 * 运行方式：node generate-ppt.js
 * 依赖：pptxgenjs（运行前需执行 npm install pptxgenjs ）
 */

const path = require('path');
const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.title = '学生校内双证管理系统演示';
pptx.author = 'honlili';
pptx.company = '';
pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 inches

// ============ 公用工具 ============
const colors = {
  primary: '1890ff',      // 主蓝
  dark: '222831',
  accent: '393e46',
  green: '27ae60',
  red: 'e74c3c',
  gray: '8b8b8b',
  lightBlue: 'e6f7ff',
  bg: 'ffffff'
};

function addTitle(slide, text, fontSize = 36) {
  return slide.addText(text, {
    x: 0.5, y: 0.3, w: 12.3, h: 0.8,
    fontSize, bold: true,
    color: colors.primary
  });
}

function addSubtitle(slide, text) {
  return slide.addText(text, {
    x: 0.5, y: 1.15, w: 12.3, h: 0.4,
    fontSize: 14,
    color: colors.gray
  });
}

// ============ 第 1 张：封面 ============
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.primary };

  // 顶部装饰条
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 0.3, fill: { color: colors.dark }
  });
  slide.addShape('rect', {
    x: 0, y: 7.2, w: 13.33, h: 0.3, fill: { color: colors.dark }
  });

  // 主标题
  slide.addText('学生校内双证管理系统', {
    x: 0.8, y: 2.0, w: 11.7, h: 1.5,
    fontSize: 52, bold: true,
    color: 'ffffff',
  });

  slide.addText('Student Dual-Certificate Management System', {
    x: 0.8, y: 3.5, w: 11.7, h: 0.5,
    fontSize: 20,
    color: 'ffffff',
    italic: true
  });

  // 装饰线
  slide.addShape('line', {
    x: 0.8, y: 4.3, w: 4, h: 0, line: { color: 'ffffff', width: 2 }
  });

  slide.addText('演示报告', {
    x: 0.8, y: 4.5, w: 11.7, h: 0.6,
    fontSize: 24, bold: true, color: 'ffffff'
  });

  slide.addText(new Date().toLocaleDateString('zh-CN'), {
    x: 0.8, y: 5.2, w: 11.7, h: 0.4,
    fontSize: 14, color: 'd8edff'
  });

  slide.addText('基于 React + Node.js + Express + Ant Design', {
    x: 0.8, y: 6.5, w: 11.7, h: 0.4,
    fontSize: 14, color: 'ffffff'
  });
}

// ============ 第 2 张：项目背景与目标 ============
{
  const slide = pptx.addSlide();
  slide.background = { color: 'ffffff' };
  addTitle(slide, '一、项目背景与目标');
  addSubtitle(slide, '为什么需要双证管理系统');

  slide.addShape('rect', {
    x: 0.5, y: 1.0, w: 12.3, h: 0.03, fill: { color: colors.primary }
  });

  slide.addText(
    [
      { text: '背景 Background', options: { fontSize: 26, bold: true, color: colors.primary } },
      { text: '■ 国家职业教育改革要求，学生在校期间需取得至少一项职业资格证书', options: { bullet: true, fontSize: 18 } },
      { text: '■ 学校管理制度要求学生完成"毕业证书 + 职业资格证书"双证毕业', options: { bullet: true, fontSize: 18 } },
      { text: '■ 传统人工登记、纸质管理的方式效率低，无法追踪学生证书获取进度', options: { bullet: true, fontSize: 18 } },
    ],
    { x: 0.8, y: 1.4, w: 5.6, h: 5.5, valign: 'top' }
  );

  slide.addText(
    [
      { text: '目标 Objectives', options: { fontSize: 26, bold: true, color: colors.primary } },
      { text: '■ 实现学生证书管理全过程数字化', options: { bullet: true, fontSize: 18 } },
      { text: '■ 提供学生信息、报名、成绩、证书的统一管理', options: { bullet: true, fontSize: 18 } },
      { text: '■ 提供便捷的证书审核和数据统计', options: { bullet: true, fontSize: 18 } },
      { text: '■ 提供外部系统开放接口供第三方调用', options: { bullet: true, fontSize: 18 } },
    ],
    { x: 6.8, y: 1.4, w: 5.6, h: 5.5, valign: 'top' }
  );
}

// ============ 第 3 张：功能模块总览 ============
{
  const slide = pptx.addSlide();
  addTitle(slide, '二、核心功能模块');
  addSubtitle(slide, '全流程覆盖，一站式管理');

  slide.addShape('rect', {
    x: 0.5, y: 1.0, w: 12.3, h: 0.03, fill: { color: colors.primary }
  });

  const modules = [
    { icon: '📊', title: '仪表板', color: '1890ff', desc: '待审核数量、通过率、新增趋势、各类实时统计' },
    { icon: '📜', title: '证书管理', color: '27ae60', desc: '人社 / 专业 / 校内三大类证书增删改查' },
    { icon: '👨\u200d🎓', title: '学生管理', color: 'e67e22', desc: '学生信息维护、批量导入、自定义班级与学院' },
    { icon: '✅', title: '报名审核', color: '9b59b6', desc: '学生报名、AI 预审、人工审核、状态流转' },
    { icon: '📚', title: '成绩归档', color: '3498db', desc: '按班级查看证书获取情况、上传成绩单附件' },
    { icon: '📖', title: '培训与接口', color: '2c3e50', desc: '培训资料发布、API Key 对外开放接口' }
  ];

  // 3x2 布局
  modules.forEach((m, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.8 + col * 4.0;
    const y = 1.5 + row * 2.9;

    slide.addShape('rect', {
      x, y, w: 3.8, h: 2.6,
      fill: { color: colors.lightBlue },
      line: { color: m.color, width: 1.5 }
    });

    slide.addText(m.icon, { x, y: y + 0.2, w: 3.8, h: 1.0, fontSize: 44, align: 'center', valign: 'middle' });

    slide.addText(m.title, { x, y: y + 1.2, w: 3.8, h: 0.5, fontSize: 22, bold: true, align: 'center', color: m.color });

    slide.addText(m.desc, { x, y: y + 1.8, w: 3.8, h: 0.7, fontSize: 12, align: 'center', color: colors.dark });
  });
}

// ============ 第 4 张：管理员端演示 ============
{
  const slide = pptx.addSlide();
  addTitle(slide, '三、管理员端界面');
  addSubtitle(slide, '功能强大的管理控制台');
  slide.addShape('rect', {
    x: 0.5, y: 1.0, w: 12.3, h: 0.03, fill: { color: colors.primary }
  });

  // 左侧：核心功能流程
  slide.addText('核心工作流程', {
    x: 0.8, y: 1.5, w: 6.0, h: 0.5, fontSize: 22, bold: true, color: colors.primary
  });

  const steps = ['证书维护', '学生录入', '报名审核', '成绩归档'];
  steps.forEach((s, idx) => {
    const x = 0.8 + idx * 1.55;
    slide.addShape('rect', {
      x, y: 2.2, w: 1.4, h: 0.8,
      fill: { color: 'd9f7be' },
      line: { color: colors.green, width: 1.2 }
    });
    slide.addText(s, {
      x, y: 2.2, w: 1.4, h: 0.8, fontSize: 14, align: 'center', valign: 'middle', bold: true, color: colors.dark
    });
    if (idx < steps.length - 1) {
      slide.addText('→', {
        x: x + 1.4, y: 2.3, w: 0.2, h: 0.8, fontSize: 28, align: 'center', color: colors.primary
      });
    }
  });

  // 下方：功能列表
  slide.addText('管理员操作功能', {
    x: 0.8, y: 3.4, w: 11.7, h: 0.5, fontSize: 22, bold: true, color: colors.primary
  });

  slide.addText([
    { text: '证书管理：分类管理 / 类型管理（人社、专业、校内）', options: { bullet: true, fontSize: 18 } },
    { text: '学生管理：批量导入 / 自定义班级与学院 / Excel 模板下载', options: { bullet: true, fontSize: 18 } },
    { text: '报名审核：AI 预审 + 人工审核 / 状态流转 / 审核记录', options: { bullet: true, fontSize: 18 } },
    { text: '成绩归档：按班级查看 / 考试信息编辑 / 成绩单附件上传', options: { bullet: true, fontSize: 18 } },
    { text: '接口测试：API Key 认证 / 外部系统对接', options: { bullet: true, fontSize: 18 } },
    { text: '个人设置：账号信息 / 密码修改', options: { bullet: true, fontSize: 18 } }
  ], { x: 0.8, y: 4.0, w: 11.7, h: 3.2, valign: 'top' });
}

// ============ 第 5 张：学生端演示 ============
{
  const slide = pptx.addSlide();
  addTitle(slide, '四、学生端界面');
  addSubtitle(slide, '面向学生的自主服务入口');

  slide.addShape('rect', {
    x: 0.5, y: 1.0, w: 12.3, h: 0.03, fill: { color: colors.primary }
  });

  // 登录说明
  slide.addText('登录方式', {
    x: 0.8, y: 1.5, w: 11.7, h: 0.5, fontSize: 22, bold: true, color: colors.primary
  });

  slide.addShape('rect', {
    x: 0.8, y: 2.1, w: 5.6, h: 0.8, fill: { color: 'fff7e6' }, line: { color: 'faad14', width: 1 }
  });

  slide.addText([
    { text: '管理员登录：', options: { bold: true, fontSize: 18 } },
    { text: '账号：admin / 密码：admin123', options: { fontSize: 16 } }
  ], { x: 1.0, y: 2.1, w: 5.6, h: 0.8, valign: 'middle' });

  slide.addShape('rect', {
    x: 6.9, y: 2.1, w: 5.6, h: 0.8, fill: { color: 'e6f7ff' }, line: { color: colors.primary, width: 1 } });

  slide.addText([
    { text: '学生登录：', options: { bold: true, fontSize: 18 } },
    { text: '学号：2023001001 / 密码：123456', options: { fontSize: 16 } }
  ], { x: 7.1, y: 2.1, w: 5.6, h: 0.8, valign: 'middle' });

  // 学生功能模块
  slide.addText('学生端功能', {
    x: 0.8, y: 3.2, w: 11.7, h: 0.5, fontSize: 22, bold: true, color: colors.primary
  });

  const stuFeatures = [
    { icon: '📋', title: '个人中心', desc: '查看和修改个人资料' },
    { icon: '🎓', title: '我的证书', desc: '查看已获证书列表' },
    { icon: '📝', title: '报名考试', desc: '自主报名证书考试' },
    { icon: '📖', title: '培训资料', desc: '查看培训课程资料' }
  ];

  stuFeatures.forEach((f, idx) => {
    const x = 0.8 + idx * 3.0;
    slide.addShape('rect', {
      x, y: 3.9, w: 2.8, h: 2.8, fill: { color: 'f0f5ff' }, line: { color: colors.primary, width: 1 } });
    slide.addText(f.icon, { x, y: 4.1, w: 2.8, h: 1.1, fontSize: 40, align: 'center', valign: 'middle' });
    slide.addText(f.title, { x, y: 5.2, w: 2.8, h: 0.5, fontSize: 18, bold: true, align: 'center', color: colors.primary });
    slide.addText(f.desc, { x, y: 5.8, w: 2.8, h: 0.7, fontSize: 12, align: 'center', color: colors.dark });
  });
}

// ============ 第 6 张：技术架构 ============
{
  const slide = pptx.addSlide();
  addTitle(slide, '五、技术架构');
  addSubtitle(slide, '现代化 Web 应用架构');

  slide.addShape('rect', {
    x: 0.5, y: 1.0, w: 12.3, h: 0.03, fill: { color: colors.primary }
  });

  // 三层架构：前端 - 后端 - 数据库
  const layers = [
    { title: '前端 / Web 界面', color: 'f6ffed', border: colors.green, items: ['React 18', 'Ant Design 5', 'React Router 6', 'Axios'] },
    { title: '后端 / API 服务', color: 'fff7e6', border: 'faad14', items: ['Node.js + Express', 'JWT 认证', 'API Key 认证', 'multer 文件上传', 'xlsx Excel 处理'] },
    { title: '数据存储', color: 'f0f5ff', border: colors.primary, items: ['MySQL 8/9 (生产)', 'mysql2 连接池', '演示模式：内存数据'] }
  ];

  layers.forEach((layer, idx) => {
    const y = 1.5 + idx * 1.8;
    slide.addShape('rect', {
      x: 0.8, y, w: 11.7, h: 1.6, fill: { color: layer.color }, line: { color: layer.border, width: 2 } });
    slide.addText(layer.title, {
      x: 0.8, y, w: 11.7, h: 0.5, fontSize: 20, bold: true, align: 'left', color: colors.dark
    });

    const itemWidth = 11.7 / layer.items.length;
    layer.items.forEach((item, i) => {
      slide.addShape('rect', {
        x: 0.8 + i * itemWidth,
        y: y + 0.7, w: itemWidth - 0.15, h: 0.8,
        fill: { color: 'ffffff' }, line: { color: layer.border, width: 0.8 } });
      slide.addText(item, {
        x: 0.8 + i * itemWidth, y: y + 0.7,
        w: itemWidth - 0.15, h: 0.8,
        fontSize: 14, bold: true, align: 'center', valign: 'middle', color: colors.dark
      });
    });
  });

  // 箭头注释
  slide.addText('⬆', {
    x: 5, y: 3.1, w: 0.5, h: 0.5, fontSize: 18, align: 'center', color: colors.primary
  });
  slide.addText('⬆', {
    x: 5, y: 4.9, w: 0.5, h: 0.5, fontSize: 18, align: 'center', color: colors.primary
  });

  slide.addText('RESTful API 响应', {
    x: 6, y: 3.1, w: 6, h: 0.5, fontSize: 12, color: colors.gray
  });

  slide.addText('SQL 查询', {
    x: 6, y: 4.9, w: 6, h: 0.5, fontSize: 12, color: colors.gray
  });
}

// ============ 第 7 张：项目亮点 ============
{
  const slide = pptx.addSlide();
  addTitle(slide, '六、项目亮点');
  addSubtitle(slide, '让系统与众不同的特色');

  slide.addShape('rect', {
    x: 0.5, y: 1.0, w: 12.3, h: 0.03, fill: { color: colors.primary }
  });

  const highlights = [
    { icon: '⚡', title: '一键启动', desc: '双击 start.bat 即可启动前后端，无需复杂配置' },
    { icon: '💡', title: '双端支持', desc: '同时提供管理员端与学生端，两个独立界面' },
    { icon: '🔌', title: '演示模式', desc: '内置内存数据，无需安装 MySQL，开箱即用' },
    { icon: '🔒', title: '双重认证', desc: 'JWT 认证 + API Key 双机制，保证数据安全' },
    { icon: '📄', title: '外部接口', desc: '开放学生证书信息 API 接口，便于外部系统调用' },
    { icon: '🖥️', title: '数据可视化', desc: '仪表板实时展示审核数量与趋势' },
    { icon: '🧠', title: 'AI 预审', desc: '自动根据分数建议通过/驳回，减少人工负担' },
    { icon: '📊', title: '批量导入', desc: '支持 Excel 模板批量录入学生信息' }
  ];

  highlights.forEach((h, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const x = 0.8 + col * 3.0;
    const y = 1.6 + row * 2.5;

    slide.addShape('roundRect', {
      x, y, w: 2.8, h: 2.2, fill: { color: 'fafafa' }, line: { color: colors.primary, width: 1 } });
    slide.addText(h.icon, { x, y: y + 0.1, w: 2.8, h: 0.8, fontSize: 32, align: 'center', valign: 'middle' });
    slide.addText(h.title, { x, y: y + 1.0, w: 2.8, h: 0.4, fontSize: 16, bold: true, align: 'center', color: colors.primary });
    slide.addText(h.desc, { x, y: y + 1.45, w: 2.8, h: 0.7, fontSize: 11, align: 'center', color: colors.dark });
  });
}

// ============ 第 8 张：启动说明 ============
{
  const slide = pptx.addSlide();
  addTitle(slide, '七、快速启动与使用');
  addSubtitle(slide, '三步跑起来，一分钟上手');
  slide.addShape('rect', { x: 0.5, y: 1.0, w: 12.3, h: 0.03, fill: { color: colors.primary } });

  // 三步启动
  const steps = [
    { step: '1', title: '安装 Node.js', desc: '下载安装', color: colors.primary },
    { step: '2', title: '双击启动脚本', desc: '双击 start.bat 或 启动系统.vbs', color: colors.green },
    { step: '3', title: '打开浏览器', desc: '访问 http://localhost:3000', color: 'faad14' }
  ];

  steps.forEach((s, idx) => {
    const x = 0.8 + idx * 4.2;
    slide.addShape('ellipse', {
      x, y: 1.7, w: 1.0, h: 1.0, fill: { color: s.color }, line: { color: s.color, width: 0 } });
    slide.addText(s.step, {
      x, y: 1.7, w: 1.0, h: 1.0, fontSize: 36, bold: true, align: 'center', valign: 'middle', color: 'ffffff' });

    slide.addText(s.title, {
      x: x + 1.2, y: 1.8, w: 2.8, h: 0.5, fontSize: 18, bold: true, color: colors.dark });
    slide.addText(s.desc, {
      x: x + 1.2, y: 2.35, w: 2.8, h: 0.5, fontSize: 13, color: colors.gray });

    if (idx < steps.length - 1) {
      slide.addText('→', {
        x: x + 4.0, y: 1.9, w: 0.3, h: 1.0, fontSize: 30, align: 'center', valign: 'middle', color: colors.primary
      });
    }
  });

  // 停止与账号
  slide.addShape('rect', {
    x: 0.8, y: 3.5, w: 5.6, h: 1.4, fill: { color: 'fff2e8' }, line: { color: 'e67e22', width: 1.5 }
  });

  slide.addText('停止服务', { x: 1.0, y: 3.6, w: 5.4, h: 0.5, fontSize: 20, bold: true, color: 'e67e22' });
  slide.addText('■ 双击 stop.bat 停止所有服务', { x: 1.0, y: 4.1, w: 5.4, h: 0.4, fontSize: 14, color: colors.dark });
  slide.addText('■ 或在服务窗口按 Ctrl+C', { x: 1.0, y: 4.5, w: 5.4, h: 0.4, fontSize: 14, color: colors.dark });

  slide.addShape('rect', {
    x: 6.9, y: 3.5, w: 5.6, h: 1.4, fill: { color: 'e6ffed' }, line: { color: colors.green, width: 1.5 }
  });
  slide.addText('演示账号', {
    x: 7.1, y: 3.6, w: 5.4, h: 0.5, fontSize: 20, bold: true, color: colors.green });
  slide.addText('■ 管理员：admin / admin123', { x: 7.1, y: 4.1, w: 5.4, h: 0.4, fontSize: 14, color: colors.dark });
  slide.addText('■ 学生：2023001001 / 123456', { x: 7.1, y: 4.5, w: 5.4, h: 0.4, fontSize: 14, color: colors.dark });

  // 注意事项
  slide.addShape('rect', {
    x: 0.8, y: 5.2, w: 11.7, h: 1.8, fill: { color: 'fffbe6' }, line: { color: 'faad14', width: 1.2 } });
  slide.addText('注意事项', {
    x: 1.0, y: 5.3, w: 11.3, h: 0.45, fontSize: 18, bold: true, color: 'faad14' });
  slide.addText([
    { text: '首次启动需要 npm install 下载依赖，可能需要几分钟', options: { bullet: true, fontSize: 13 } },
    { text: '前端需要 15-30 秒编译完成，如页面无法访问请刷新', options: { bullet: true, fontSize: 13 } },
    { text: '演示模式下重启后数据会重置，生产请使用 MySQL 版本', options: { bullet: true, fontSize: 13 } }
  ], { x: 1.0, y: 5.8, w: 11.3, h: 1.0, valign: 'top' });
}

// ============ 第 9 张：项目仓库与致谢 ============
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.primary };

  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 0.3, fill: { color: colors.dark } });
  slide.addShape('rect', {
    x: 0, y: 7.2, w: 13.33, h: 0.3, fill: { color: colors.dark } });

  slide.addText('感谢观看！', {
    x: 0.8, y: 1.5, w: 11.7, h: 1.2,
    fontSize: 54, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });

  slide.addText('Thank You for Watching', {
    x: 0.8, y: 3.0, w: 11.7, h: 0.6, fontSize: 24, italic: true, align: 'center', valign: 'middle', color: 'e6f7ff' });

  // GitHub 仓库地址
  slide.addShape('rect', {
    x: 2, y: 4.2, w: 9.33, h: 1.6, fill: { color: 'ffffff' }, line: { color: 'ffffff', width: 0 } });
  slide.addText('项目源代码已发布在 GitHub', {
    x: 2, y: 4.3, w: 9.33, h: 0.6, fontSize: 20, bold: true, align: 'center', valign: 'middle', color: colors.primary });
  slide.addText('https://github.com/honlili/project1', {
    x: 2, y: 5.0, w: 9.33, h: 0.6, fontSize: 18, align: 'center', valign: 'middle', color: colors.dark });

  slide.addText('欢迎交流与反馈', {
    x: 0.8, y: 6.3, w: 11.7, h: 0.4, fontSize: 14, align: 'center', valign: 'middle', color: 'ffffff' });
}

// 保存文件
const outputFile = path.join(__dirname, '学生校内双证管理系统-演示.pptx');
pptx.writeFile({ fileName: outputFile })
  .then(() => {
    console.log(`PPT 生成成功：${outputFile}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('生成失败：', err);
    process.exit(1);
  });
