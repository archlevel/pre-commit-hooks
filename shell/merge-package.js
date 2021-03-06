#!/usr/bin/env node
/**
 * Created by rocky on 2018/1/18.
 * 载入自定义package.json配置
 */
var fs = require('fs');
var projectPackage = process.argv[2];

if (!projectPackage) {
  console.log('项目package.json路径不存在');
  process.exit(1);
}

//处理package修改
var content = null;
try {
  content = require(projectPackage);
  if (!content || typeof content != 'object') {
    console.log('项目package.json格式正确');
  }
} catch (e) {
  console.log(e);
  console.log('项目package.json读取失败');
  process.exit(1);
}

//pre-commit 钩子配置
var hookConfig = {
  'pre-commit': [
    'eslint'
  ]
};
var scriptsConfig = {
  'eslint.sh': 'bash node_modules/pre-commit-hooks/shell/eslint.sh',
  'eslint': 'npm run eslint.sh'
};

try {
  Object.assign(content || {}, hookConfig);
  if (!content.scripts) {
    content.scripts = scriptsConfig;
  } else {
    Object.assign(content.scripts, scriptsConfig);
  }
  fs.writeFileSync(projectPackage, JSON.stringify(content, null, 2), 'utf-8');
  console.log('项目package.json修改成功');
} catch (e) {
  console.log(e);
  console.log('项目package.json修改失败');
}
