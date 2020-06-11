import {mainRouter} from '../../src/router/routers'
const app = {
    state: {
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home'
            },
           
        ], // 面包屑数组
        routers:[...mainRouter],
        quitLogin:0,//如果值发生改变退出登录 存的是网络请求失败那一刻的事件戳
        keepAlives:[],
        userInfo:{},
        cardTitle:'',
        cardExtra:'',
        button: localStorage.button?JSON.parse(localStorage.button):{},
        permissionRoles:[
            'admin',
            'editor'
        ],


    },
    actions:{
        
        
    },
    mutations: {
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },

        setLoginState(state,quitLogin)
        {
            state.quitLogin=quitLogin;

        },
        setCardTitle(state,title)
        {
            state.cardTitle=title;

        },
        setCardExtra(state,data)
        {
            state.cardExtra=data;
        },

        
        setUserInfo(state,info){
            state.userInfo=info
        },
        setButtonPermission(state,data)
        {
            localStorage.button=JSON.stringify(data);
         
            state.button=data;

        }
     
    }
};

export default app;
