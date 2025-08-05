const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://localhost:5023',
        // target: 'https://mipsapp.vertivco.com.cn',
        target:process.env.VUE_APP_API_URL,
        changeOrigin: true
      }
    }
  }
})
