
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
     // 下面是本配置文件的参考文章
  // 参考地址 https://blog.csdn.net/qq_35167373/article/details/80671346 
  // https://segmentfault.com/a/1190000016006971
  // https://github.com/vuejs/vue-cli/tree/3b9ecf38fb5a8b0ef8e4ee18bba6761f9c457663/docs/zh

  // build之后输出的文件夹 为 dist/环境名 如: dist/uat/***
  //outputDir: 'dist/' + process.env.NODE_ENV,
  baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 下方的配置是webpack的配置 从上面的文章能够找到其他的 webpack配置项
  // 下方目前启用了压缩机制 使用了插件 uglifyjs-webpack-plugin
  // 参考地址 https://github.com/webpack-contrib/uglifyjs-webpack-plugin
  configureWebpack: {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            }
          }
        })
      ]
    }
  },
  transpileDependencies: [
    'view-design/src/locale',
  ],

    devServer: {
        hot: true, //热加载
        host: '0.0.0.0', //ip地址
        port: 8085, //端口
        https: false, //false关闭https，true为开启
        open: false, //自动打开浏览器
        // open: true,
        // host: '0.0.0.0',
        // port: 8080,
        // https: false,
        // //以上的ip和端口是我们本机的;下面为需要跨域的
        proxy: {//配置跨域
             
            '/api': {
              target: 'http://47.111.133.169:50031/api/',//这里后台的地址模拟的;应该填写你们真实的后台接口
            // target: 'http://192.168.3.130:80/api/',//这里后台的地址模拟的;应该填写你们真实的后台接口
              ws: true,
              changOrigin: true,//允许跨域
              pathRewrite: {
                  '^/api': ''//请求的时候使用这个api就可以
              }
          },
          
            
        }
    }

}