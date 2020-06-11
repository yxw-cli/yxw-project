
<template>
    <div id="rolePermissionDetial">
     <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
        <FormItem label="角色名称:" prop="roleName">
            <Input    v-model="formData.roleName" placeholder="请输入角色名称" style="width:300px"></Input>
        </FormItem>
        <FormItem label="账号权限:" prop="c">
            <div class="menu-area">
                 <div v-for='item in menuData' class="item">
                       <div class="menu-first">
                           <Checkbox  v-model='allMenuIds[item.id]' style="menu-first" >{{item.title}}</Checkbox>
                       </div>
                       <div v-for='one in item.children' style="padding-left:15px" >
                             <Checkbox  v-model='allMenuIds[one.id]' >{{one.title}}</Checkbox>
                       </div>
                 </div>

            </div>
            <!-- <div style="color:#ed4014" v-if='this.formData.menuIds.length==0'>
                 请选择权限！
            </div> -->
                
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit()">保存</Button>
            <Button @click="handleReset()" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
          
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
import { all } from 'q';
import { constants, pbkdf2 } from 'crypto';
    export default {
        data() {
            return {
                formData:{
                    roleName:'',
                    menuIds:[],
                    c:'1',
                    

                },
                
                menuData:[],
                allMenuIds:{
                },
                menuIds:'',
                hasCheckId:{},
    
                   
                ruleValidate: {

                    roleName: [
                          this.$util.rules.required(),
                           this.$util.rules.max(20,'角色名称长度不能超过20位'),
                    ],
                     c: [
                           { required: true}
                    ],
                    
                }
               
            }
        },
        created: function () {
          let roleId=this.$route.query.roleId;
          if(roleId)
          {
              
              this.formData=this.$route.query;
            
               this.formData.c='1';

          }
          
            this.getMenuList();

        },
        mounted:function()
        {
        


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {

            // getRoleInfo(id){
            //     this.$api.getRoleDetial({roleIds:[id]}).then(res=>{
            //         if(res.result=='0'&&res.data.length>0){
            //              let {roleName,}
            //         }

            //     })

            // },
               /**
             * 获得菜单权限列表
             */
            getMenuList()
            {
            
                this.$api.getMenuList({systemType:0}).then(res=>{
                      if(res.respCode==0||(res.result)-0==0)
                    {
                        this.handleMenuList(res.data);
                          if(this.formData.menuIds.length>0)
                        {
                            for(let item of this.formData.menuIds)
                            {
                               this.allMenuIds[item]=true;
                            }
                        }
                        console.log(this.allMenuIds)
                        
                        this.menuData=res.data;
                      

                    }
                    else{
                        this.$Message.error(res.message);
                    }
                })
            },

             //如果返回的事树形数据
             handleMenuList(data)
            {//createRolePrmission
                  this.allMenuIds={};
                  for(let item of data)
                  {
                      item.title=item.menuName;
                      item.typeName=item.type==0?"菜单":'按钮'
                      if(item.children)
                      {
                          this.handleMenuList(item.children)
                      }
                      
                      this.allMenuIds[item.id]=false;
                   }
                    
                      
            },

                   /*
               提交
            */ 
            handleSubmit () {
                 //将选中的权限菜单
                this.formData.menuIds=[];
                for(let i in this.allMenuIds)
                {
                    if(this.allMenuIds[i])
                    {
                        this.formData.menuIds.push(i);

                    }
                }
                if(this.formData.menuIds.length==0)
                {
                    this.$Message.error('请选择权限菜单');
                    return;
                }
                
             
                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        this.saveRole();
                       
                       
                    } else {
                     
                        
                    }
                })
            },
            /*
               保存
            */ 
            saveRole(){
                //将选中的权限菜单
                this.formData.menuIds=[];
                for(let i in this.allMenuIds)
                {
                    if(this.allMenuIds[i])
                    {
                        this.formData.menuIds.push(i);

                    }
                }

                //根据有无id判断是编辑还是添加
                let method=this.formData.roleId?'updateRolePrmission':'createRolePrmission';
                this.$api[method](this.formData).then(res=>{
                      if(res.respCode==0||(res.result)-0==0)
                    {
                        this.$Message.success('保存成功');
                         this.$router.back(-1);
                       
                    }
                    else{
                          this.$Message.error(res.message?res.message:res.resultMessage);
                     
                    }
                }).catch(error => {
                      
               
                })
            },
            handleReset () {
               this.$router.back(-1);
            },

            
      
            

        },
        filters: {

        },
        components: {
         
        }
    }

</script>

<style lang='less'>
      #rolePermissionDetial{
          .menu-area{
               display: -webkit-flex;
               display:flex;
               width:100%;
               .item{
                   width:0px;
                   flex-grow:1;
                   border:1px solid #d9d9d9;
                   border-right: none;
                   
                   &:last-child{
                       border-right:1px solid #d9d9d9;
                   }
               }
               .menu-first{
                     width: 100%;
                     border-bottom:1px solid #d9d9d9;
                     padding-left:15px;

               }

          }

      }
</style>

