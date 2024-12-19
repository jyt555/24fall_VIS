const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.csv$/,
          use: 'csv-loader',
        }
      ]
    }
  },
  devServer: {
    host: '0.0.0.0',  // 允许所有主机访问
    port: 8080,        // 配置端口
    hot: true,         // 启用热模块替换
    client: {
      webSocketURL: 'ws://localhost:8080/ws', // WebSocket 配置
    },
    proxy: {
      '/assets': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/assets': '' },
      },
    },
    // 禁用不再支持的配置项（如 disableHostCheck）
    // 注意：若有其他不符合 schema 的选项，也需要移除
  },
});
