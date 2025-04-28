const fs = require('fs');
const path = require('path');

// 要复制的项目路径
const MATCHING_SRC = path.resolve(__dirname, '../../match');
const MAXFLOW_SRC = path.resolve(__dirname, '../../maxflow/build');
const TEACHER_APP_SRC = path.resolve(__dirname, '../../TeacherSubstitutionApp');

// 目标路径
const MATCHING_DEST = path.resolve(__dirname, '../matching-algorithm');
const MAXFLOW_DEST = path.resolve(__dirname, '../maxflow');
const TEACHER_APP_DEST = path.resolve(__dirname, '../teacher-app');

// 创建目标目录
try {
  if (!fs.existsSync(MATCHING_DEST)) {
    fs.mkdirSync(MATCHING_DEST, { recursive: true });
    console.log(`创建目录: ${MATCHING_DEST}`);
  }
  
  if (!fs.existsSync(MAXFLOW_DEST)) {
    fs.mkdirSync(MAXFLOW_DEST, { recursive: true });
    console.log(`创建目录: ${MAXFLOW_DEST}`);
  }

  if (!fs.existsSync(TEACHER_APP_DEST)) {
    fs.mkdirSync(TEACHER_APP_DEST, { recursive: true });
    console.log(`创建目录: ${TEACHER_APP_DEST}`);
  }
} catch (err) {
  console.error('创建目录时出错:', err);
  process.exit(1);
}

// 复制目录函数
function copyDir(src, dest) {
  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // 复制每个文件/目录
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // 跳过.git目录
    if (entry.name === '.git') {
      console.log(`跳过.git目录: ${srcPath}`);
      continue;
    }

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDir(srcPath, destPath);
    } else {
      try {
        // 复制文件
        fs.copyFileSync(srcPath, destPath);
        console.log(`复制文件: ${srcPath} -> ${destPath}`);
      } catch (err) {
        console.error(`复制文件失败: ${srcPath} -> ${destPath}`, err.message);
      }
    }
  }
}

// 执行复制
console.log('开始复制匹配算法可视化项目...');
copyDir(MATCHING_SRC, MATCHING_DEST);
console.log('匹配算法可视化项目复制完成！');

console.log('开始复制最大流算法可视化项目...');
copyDir(MAXFLOW_SRC, MAXFLOW_DEST);
console.log('最大流算法可视化项目复制完成！');

console.log('开始复制教师替换应用...');
copyDir(TEACHER_APP_SRC, TEACHER_APP_DEST);
console.log('教师替换应用复制完成！');

console.log('所有项目已成功整合到combined-algorithms-visualizer中！'); 