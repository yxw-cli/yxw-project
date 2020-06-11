
<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" >
                <div class="menu-head">
                     <img :src="logoIcon" v-if="!isCollapsed">
                     <img :src="logoIcon2" v-if="isCollapsed" style="width:50px;height:50px">
                </div>
               <siderMenu
                :menuList='menuList'
                :shrink='isCollapsed'
                :openNames='openNames'
                 theme='light'
              >
              </siderMenu>
            </Sider>
            <Layout>
                
                <Header :style="{padding: 0}" class="layout-header-bar">
                     <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                     <breadcrumbNav :currentPath='currentPath'></breadcrumbNav>
                     <div class="hearder-person">
                          <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click"  @on-click='handleDropMenuClick'>
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{getUserName}}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="0">个人中心</DropdownItem>
                                    <DropdownItem name="1" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="logoIcon2" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                     </div>

                </Header>
                <div class="main-content">
                    <Content :style="{margin: '10px', background: '#fff', minHeight: '260px'}">
                       <Card dis-cover>
                           <div class="ivu-card-head"  v-if='cardTitle' style="margin-bottom:10px;margin-top:-10px">
                                   <p slot='title' v-if='cardTitle' class="title">{{cardTitle}}</p>
                                   <div v-if="cardExtra" class="extra" :id='cardExtra.id' v-has='cardExtra.permission?cardExtra.permission:true'>
                                       <Icon :type="cardExtra.icon" v-if="cardExtra.icon" />
                                        <span>
                                            {{cardExtra.text}}
                                        </span>
                                   </div>
                           </div>
                        <div >
                            <keep-alive :include="$store.state.app.keepAlives">
                                <router-view ></router-view>
                            </keep-alive>
                       </div>
                         <Spin size="large" fix v-if="showLoad"></Spin>
                    </Card>
                </Content>
                </div>
                
            </Layout>
        </Layout>
    </div>
</template>
<script>
   import siderMenu from '../components/sider-menu/siderMenu.vue'
   import breadcrumbNav from '../components/breadcrumb-nav.vue'
   import {mainRouter} from '../router/routers.js'
   import { setTimeout } from 'timers';

    export default {
        data () {
            return {
                 isCollapsed: false,
                 showLoad:false,
                 menuList:[],
                 openNames:[],//默认展开的菜单
                 userName:'',
                 logoIcon:'http://www.hrs.com.cn/templates/main/img/logo1.png',
                 logoIcon2:'http://www.hrs.com.cn/templates/main/img/logo2.png'
            }
        },
        created:function(){
            if(mainRouter)
            {
                 this.menuList=mainRouter;
            }
           // this.getUserInfo();
            //this.getUserMenu()

        },
        mounted(){
             let pathArr = this.$util.setCurrentPath(this, this.$route.name);
             
             //面包屑长度如果小于2 说明当前路由没有子菜单 掐头去尾得到需要展开的菜单
             if(pathArr.length>2)
             {
                 for(var i=1;i<pathArr.length-1;i++)
                 {
                     this.openNames.push(pathArr[i].name);    
                 }
             }
           
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
         
           
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
              currentPath () {

                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
                cardTitle()
                 {
                     return this.$store.state.app.cardTitle
                },
             cardExtra()
                 {
                   
                     return this.$store.state.app.cardExtra
                },
            isQuitLogin()
            {
                 return this.$store.state.app.quitLogin
            },

            getUserName()
            {
                 return this.$store.state.app.userInfo.realName?this.$store.state.app.userInfo.realName:''
            }

        },
        watch:{
             '$route' (to) {
              
                let pathArr = this.$util.setCurrentPath(this, to.name);
            
            },
            'isQuitLogin'(){
                    this.$Message.error('登录状态失效，即将退出登录');
                    setTimeout(()=>{
                        this.quitLogin();

                    },2000);
            },
        },
        methods: {
            collapsedSider () {
                  this.$refs.side1.toggleCollapse();
            },
            quitLogin()
            {
                
                    sessionStorage.setItem("sid", '');
                    this.$router.push({name:"login"});
            },

               getUserInfo()
            {
                
                this.$api.user_info(window.sessionStorage.getItem("sid")).then(res=>{
                    if(res.result||res.respCode==0)
                    {
                        let data=res.data;
                        localStorage.userId=data.id;
                        this.$store.commit('setUserInfo',data);
                    }

                })
            },

            getUserMenu(){
                  this.showLoad=true;
               
                   this.$api.getUserMenu({}).then(res=>{
                    if(res.result||res.respCode==0)
                    {
                         this.handleMenuData(res.data);
                    }

                })


            },
            // 处理获得的菜单数据
            handleMenuData(data){
                let menuData=[];
                let button={};
                for(let item of data)
                  {
                      if((item.otherInfo1)-0==0&&(item.type)-0==0)
                      {
                          item.hidden=false;
                          item.title=item.menuName;
                          item.name=item.url;
                      
                          item.icon=item.img?item.img:'ios-contact-outline'
                          item.children=[];
                          menuData.push(item);
                      }
                      //获取所有按钮权限
                      else if((item.type)-0==1)
                      {
                            button[item.url]=true;
                      }
                     
                  }

                  //将所有按钮权限数据缓存在store
                  this.$store.commit('setButtonPermission',button);
                  console.log(JSON.stringify(button))
                  console.log(this.getTreeMenu(menuData,null))
                  this.menuList=this.getTreeMenu(menuData,null)
                  this.showLoad=false;
                
            },

                /*
              生成树形菜单(适用于 返回不是树形数据)
            */ 
            getTreeMenu(list,id)
            {
                let itemArr=[]
                filter(itemArr,null)

                function get(array)
                {
                    for(let item of array)
                    {
                        filter(item,item.id)
                    }
                } 
                function filter(tree,id){
                    
                    let array=list.filter(item=>{
                      
                         return item.parentId==id;
                    })
                    if(id==null||id==0)
                    {
                        itemArr=array;
                    }
                    else{
                        tree.children=array;
                    }
                    if(array.length>0)
                    {
                         get(array)
                    }
                  
                }
                return itemArr;

            },
             handleDropMenuClick(name)
            {
                //个人中心
                if(name==0)
                {
                    this.$router.push({name:'myCenter'});
                    
                }
                else if(name==1)
                {
                    this.$util.confirmDialog(this,"确认",'您确认退出登录',self=>{
                        self.quitLogin();

                     
                  })
                }

            },
        },
           components:{
            siderMenu,
            breadcrumbNav
        },

    }
</script>

