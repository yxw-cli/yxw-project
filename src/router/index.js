import Vue from 'vue';
import {Modal,LoadingBar} from 'view-design';
import VueRouter from 'vue-router';
import {routers} from './routers';
import store from '../../store/index'

Vue.use(VueRouter);

// 路由配置(默认是哈希路由，可切换)
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);
//拦截

router.beforeEach((to, from, next) => {
    //处理退出（加确认框和清除缓存）
    if(to.name=='quitLogon')
    {
        Modal.confirm({
            title: '退出登录',
            content: '您确认退出登录',
            onOk: () => {
                sessionStorage.setItem("sid", '');
                 router.push({ path:'/login',});
            },
            //不加 会出现左侧菜单上的退出依然被选中
            onCancel: () => {
                router.push({ path:from.name,});
            }
        });
    }
   
    LoadingBar.start();
    next();
   
});

router.afterEach((to) => {
    var cardTitle=false;
    var cardExtra=false;

    if(to.meta)
    {
         cardTitle=to.meta.cardTitle?to.meta.cardTitle:false;
         cardExtra=to.meta.cardExtra?to.meta.cardExtra:false;

    }
    //页面title
    store.commit('setCardTitle',cardTitle);
    //title右侧操作按钮
    store.commit('setCardExtra',cardExtra);
    LoadingBar.finish();
    window.scrollTo(0, 0);
});
