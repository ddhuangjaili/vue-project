// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  env: {
    "es6": true
  },
  // add your custom rules here
  'rules': {
    // /箭头函数用小括号括起来
    'arrow-parens': 0,
    // 生成器函数*的前后空格
    'generator-star-spacing': 0,
    // 禁止在条件中使用常量表达式 if(true) if(1)
    "no-constant-condition": 2,
    // 开发模式允许调试
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 不允许空格和 tab 混合缩进
    "no-mixed-spaces-and-tabs": 2,
    // 语句强制分号结尾
    "semi": [2, "always"],
    "no-useless-escape":0,// 禁用不必要的转义字符会让正则表达式中的转义字符不可用，此处放开
    // 使用严格模式
    "strict": 2,
    "no-undef": 0//不能有未定义的变量 ActiveXObject无法编译通过
  }
}
