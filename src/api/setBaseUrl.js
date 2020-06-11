// 参考地址 https://github.com/vuejs/vue-cli/blob/fb97646ee51d4fb9c95a01913377cdadf819b6cf/docs/guide/mode-and-env.md
// https://segmentfault.com/a/1190000015133974
// https://www.cnblogs.com/XHappyness/p/9337229.html
let baseUrl = {
    // api地址的URL
    apiBaseUrl: "",
    //上传文件地址
    uploadImageUrl:'',
    // 静态资源服务器地址
    assetsUrl: "",
    //
    loactionUrl:'',

}
switch (process.env.VUE_APP_UNIT) {
    case 'development':
        //这里是本地的请求url
        //士伟的
        baseUrl.apiBaseUrl = "http://39.98.197.253:50035"  
        // baseUrl.apiBaseUrl = "http://39.98.197.253:50035/"
        baseUrl.uploadImageUrl = "http://39.98.197.253:50036/"
        // baseUrl.apiBaseUrl = "http://192.168.3.118:50031/"
        baseUrl.assetsUrl = "http://139.224.139.49:9076/static/h5/"
        baseUrl.loactionUrl='http://localhost:8085/'
        break
    case 'uat':
        //这里是本地的请求url
        baseUrl.apiBaseUrl = "http://39.98.197.253:50035/"
        // baseUrl.apiBaseUrl = "http://47.101.104.142:8082/"
        baseUrl.uploadImageUrl = "http://39.98.197.253:50036/"
        baseUrl.assetsUrl = "http://139.224.139.49:9076/static/h5/"
        baseUrl.loactionUrl='http://localhost:8085/v1/'

        break
    case 'production':
        //这里是本地的请求url
        baseUrl.apiBaseUrl = "http://39.98.197.253:50035/"
        // baseUrl.apiBaseUrl = "http://47.101.104.142:8082/"
        baseUrl.uploadImageUrl = "http://39.98.197.253:50036/"
        baseUrl.assetsUrl = "http://139.224.139.49:9076/static/h5/"
        baseUrl.loactionUrl='http://localhost:8085/v1/'

        break
}

export default baseUrl;