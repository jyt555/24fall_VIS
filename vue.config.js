// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

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
    proxy: {
      '/assets': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/assets': '' },
      },
    },
  },
});

