/*
 * @Author: 于学文 
 * @Date: 2019-04-02 11:08:39 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-07-11 10:42:45
 */
import Main from '../views/Main';
import Login from '../views/login';




// 不作为Main组件的子页面展示的页面单独写，如下
//home.vue 一级菜单容器  secMenurouter.vue 二级菜单容器  thrMenuRouter.vue 三级菜单容器
//如果子路由需要自定义父容器 在相应目录下了新增index.vue
//icon是菜单图标，可查看iview、

export const mainRouter = [
        
          { 
            path: '/home',
            title: '首页', 
            name: 'home', 
            children:[],
            component: () => import('../views/Home.vue'),
            icon:'ios-contact-outline',
            hidden:true
         },
         
     
        { 
            path: '/sys',
            title: '系统管理', 
            icon:'ios-settings',
            name: 'sys', 
            redirect:'/menu',
            component: () => import('../views/secMenurouter.vue'),
            hidden:false,
            children:[
                { 
                    path: '/menu',
                    title: '菜单管理', 
                    icon:'ios-contact-outline',
                    name: 'menu', 
                    component: () => import('../views/sys/menu.vue'),
                    children:[],
                    meta:{
                         cardTitle:'菜单管理',//页面中card的标签,
                         
                    },
                    hidden:false
                 },
                 { 
                    path: '/demo',
                    title: '插件实例',
                    icon:'ios-contact-outline', 
                    name: 'demo', 
                    component: () => import('../views/sys/demo.vue'),
                    children:[],
                    meta:{
                        cardTitle:'插件实例'//页面中card的标签
                    },
                    hidden:false
                 },
                //  { 
                //     path: '/organization',
                //     title: '组织机构管理', 
                //     name: 'organization', 
                //     icon:'ios-contact-outline',
                //     component: () => import('../views/sys/organization.vue'),
                //     children:[],
                //     meta:{
                //         cardTitle:'组织机构管理'//页面中card的标签
                //     },
                //     hidden:false
                //  },
                //  { 
                //     path: '/role',
                //     title: '角色管理', 
                //     name: 'role', 
                //     icon:'ios-contact-outline',
                //     component: () => import('../views/sys/role.vue'),
                //     children:[],
                //     meta:{
                //         cardTitle:'角色管理'//页面中card的标签
                //     },
                //     hidden:false
                //  },
                //  { 
                //     path: '/user',
                //     title: '用户管理', 
                //     name: 'user', 
                //     icon:'ios-contact-outline',
                //     component: () => import('../views/sys/user.vue'),
                //     children:[],
                //     meta:{
                //         cardTitle:'用户管理'//页面中card的标签
                //     },
                //     hidden:false
                //  },
                //  { 
                //     path: '/thrMenu',
                //     title: '三级菜单', 
                //     icon:'ios-contact-outline',
                //     name: 'thrMenu', 
                //     component: () => import('../views/thrMenuRouter.vue'),
                //     redirect:'/thrMenu1',
                //     children:[
                //         { 
                //             path: '/thrMenu1',
                //             title: '下级菜单一', 
                //             name: 'thrMenu1', 
                //             icon:'ios-contact-outline',
                //             component: () => import('../views/sys/role.vue'),
                //             children:[],
                //             meta:{
                //                 title:"下级菜单一",
                //                 cardTitle:'下级菜单一'//页面中card的标签
                //             },
                //             hidden:false
                //          },
                //          { 
                //             path: '/thrMenu2',
                //             title: '下级菜单二', 
                //             name: 'thrMenu2', 
                //             icon:'ios-contact-outline',
                //             component: () => import('../views/sys/organization.vue'),
                //             children:[],
                //             hidden:false
                //          },
                //     ],
                //     hidden:false
                //  },
            ],
            hidden:false
           },
          
        
        

         
           { 
            path: '/myCenter',
            title: '个人中心', 
            icon:'ios-contact-outline',
            name: 'myCenter',
            redirect:'/myCenter',
            children:[
                { 
                    path: '/myCenter',
                    title: '个人中心', 
                    name: 'myCenter', 
                    icon:'ios-contact-outline',
                    component: () => import('../views/myCenter/personalCenter.vue'),
                    children:[],
                    auth:true,
                    hidden:false
                },
                { 
                    path: '/editorPassword',
                    title: '修改密码', 
                    name: 'editorPassword', 
                    icon:'ios-contact-outline',
                    component: () => import('../views/myCenter/editorPassword.vue'),
                    children:[],
                    hidden:false
                 },
            ], 
            icon:'ios-contact-outline',
            component: () => import('../views/secMenurouter.vue'),       
            hidden:false,
            hiddenChildren:true,
           },
            {
                path: '/quitLogon',
                title: '退出',
                name: 'quitLogon',
                icon:'ios-power',
                children:[],
                meta:{
                    auth:true,
                },
                hidden:false
            },
           
];

export const projectRouter= [
            {
                path:'/',
                redirect:"/main",
            },
            { 
                path: '/login',
                title: '登录', 
                name: 'login', 
                component: Login,
             
            },
            { 
                path: '/main',
                title: '首页', 
                name: 'home', 
                component: Main,
                redirect:'/home',
                icon:'ios-contact-outline',
                children:mainRouter,
            }
    
    ]
       

export const routers=[
   
    ...projectRouter

]
