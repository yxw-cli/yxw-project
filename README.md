# baseframe

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


基于vue+iview后台管理系统使用说明和开发规范
一：主要技术选型：
  Vue-cli3
  Vue 2
  Iview:ui框架
  Vuex：
Axios：网络请求框架
二：主要模块说明
  1：路由配置
     
默认使用哈希路由,系统路由在routers.js文件中
基础框架左侧菜单栏是根据注册路由动态配置的，根据字段“hidden”控制是否在左侧菜单栏显示，cardTitle字段是页面中标题头
 

2：网络请求：
  采用axios网络请求框架，所有请求接口都要放在api/index.js 方法中，不要放在具体页面中，具体使用见下图，



setBaseUrl.js 中是设置请求接口地址。
注意：如果接口不能直接跨域，需要在vue.config.js中配置，
同时将api.js中
注释掉。
如下图


3：表格
后台管理系统已表格表单为主，目前封装三中表格组件 分别是普通表格，可编辑表格，树形表格（iview框架没有树形表格，不能基于框架表格修改）
具体使用可详见 src\views\sys\demo.vue

1：普通展示表格实现的可配置悬浮提示，文字过多不换行，自定义操作按钮
  


Columns：

2：可编辑表格
   实现行内数据可编辑




三：表单
后台管理系统一般通过弹窗嵌套表单实现对表格数据新增和编辑。
系统中所有相关表单vue文件都放置在src\views\form中。
在调用页面注册表单组件，避免表单放在主页面中，代码混乱不易维护。
使用方法如下图。推荐使用方式1。
具体使用可详见 src\views\sys\demo.vue






方式1


方式2


表单使用
1：传参：表单页面在编辑是要接收父组件的传递的数据


2：表单校验
   目前系统对表单校验进行了二次封装，避免正则表达式出现在表单页面，开发误操作容易出现错误。具体操作方法如下
在Form表单中使用

封装的校验方法


注：开发中有时需求表单组件的动态增减表单项，此时校验需要处理。在src\views\form\sysForm.vue提供了相关校验方案，可提供参考使用。
3：表单提交
成功提交
   this.$emit('finish','');
2：提交失败
this.$emit('error','');



四：其他
1：工具类：src\lib\util.js
  系统常用方法封装，开发中可自行添加。

开发规范
1、文件命名

文件名以小写开头，取有意义的英文名字，H5文件名与对应的JS文件名相同，命名以模块名开头加数字（该模块第几个文件），加一杠，以内容名结尾，如live1-ctrol.vue。

2、文件格式

UTF-8格式

3、页面中id命名要求

除入口页外，一个页面就是一个Page，每个Page有唯一ID，该ID命名以模块名开头加一杠，以内容名结尾，如login-wrap

 

4、H5文件内容要求

1）、功能模块的入口页，需要包含基本类库，以及入口页对应的JS脚本，其他子页面只有一个Page内容。

2）、对没有任何业务逻辑控制的页面，可以直接跳转。

3）、对于有业务逻辑控制的页面，应绑定链接事件方式，在事件中需要显示loading层，转到目标页面后，再隐藏loading层。

4）、弹框、select等需要大量代码去实现，要以组件的方式引入。

 

5、JS内容要求

1）、需要用请求和公共方法的文件，要用import引入：

import store from '@/store'

import { login, logout, getInfo } from '@/api/login'

2)、尽量使用ES6的方法（箭头函数，模板字符串等）

2）、子组件引入方式：

公共组件经常使用如： header,footer等会一起打包到公共js文件。

先import LoginComponent from './login.vue'

再暴露 components: {

      /* 引入登陆组件*/

      'v_loginComponent': LoginComponent

    };

4、Css要求

1）、vue以局部css来写<style lang="less" scoped></style>只作用于当前vue文件。

2）、公共使用的css要单独放在一个文件夹里（less.css）。

5、接口请求

1）、请求用Axios ，Axios 的所有请求请使用公共的api.js的方法，配合编辑api接口文件。

2）、看后台需要配置post、get请求，所有的请求均会自动带上token（登陆api除外），后台需要校验token的失效性。另外put（PUT 往服务器上上传文件），或者其他个性化请求另外处理。

5、注释规范

代码注释在一个项目的后期维护中显的尤为重要，所以我们要为每一个被复用的组件编写组件使用说明，为组件中每一个方法编写方法说明。

以下情况，务必添加注释：

1）、公共组件使用说明

2）、各组件中重要函数或者类说明

3）、复杂的业务逻辑处理说明

4）、特殊情况的代码处理说明,对于代码中特殊用途的变量、存在临界值、函数中使用的hack、使用了某种算法或思路等需要进行注释描述

5）、注释块必须以/**（至少两个星号）开头**/；

6）、单行注释使用//；

单行注释

    普通方法一般使用单行注释// 来说明该方法主要作用

多行注释

     组件使用说明，和调用说明

   <!--公用组件：数据表格

      /**

      * 组件名称

      * @module 组件存放位置

      * @desc 组件描述

      * @author 组件作者

      * @date 2018年8月13日17:22:43

      * @param {Object} [title]    - 参数说明

      * @param {String} [columns] - 参数说明

      * @example 调用示例

      *  <hbTable :title="title" :columns="columns" :tableData="tableData"></hbTable>

          */

       -->
