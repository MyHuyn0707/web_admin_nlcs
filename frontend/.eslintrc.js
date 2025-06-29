module.exports = {
  // ...
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser', // hoặc '@babel/eslint-parser' nếu bạn dùng
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    // 'vue/multi-word-component-names': 'off'
  }
}
