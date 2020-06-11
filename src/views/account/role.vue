/*
 * @Author: 于学文 
 * @Date: 2019-06-20 13:23:50 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-24 14:29:58
 */
<template>
    <div id="role-permission" class="only-content">
          <div class="create" @click="addRole()">
              <Icon type="md-add" />
               新建角色
          </div>
              <div>
                    <primaryTable 
                     :columns="columns" :data="tableList"
                     ref='primaryTable'
                     @on-edit='editRole'
                     @on-del='delRole'
                     :isPage='false'
                    >
                 </primaryTable>
                </div>
                
         
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import roleForm from '../form/roleForm'

    export default {
        data() {
            return {
                params:{
                    pageSize:10,
                    systemType:0,
                    page:1

                },
                left:24,//左侧表格比例
                right:0,
                treeMenuData:[],
                roleName:'',
                roleId:'',
                tableList:[],
                total:0,
                columns:[
                     {
                        title: '角色名称',
                        key: 'roleName',
                        slot:"alarm"//添加可实现表格edit
                    },
                    {
                        title: '权限',
                        slot:"alarm",
                        key: 'permissionNamesStr'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 250,
                        align: 'center',
                        selfBtn:[
                                {name:"编辑",method:"on-edit",type:"primary"},
                                {name:"删除",method:"on-del",type:"error"},
                              
                            ]
                    }
                ],
               
            }
        },
        created: function () {
            this.getRoleList();

        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
          /*  
              获得列表
          
           */
            getRoleList()
            {
                this.$api.getRolePermissionList({}).then(res=>{
                  
                  if(res.respCode==0||(res.result)-0==0)
                    {
                       for(let item of res.data)
                       {
                           item.permissionNames=[];
                           item.permissionIds=[];
                             if(item.jurisdictionVOS)
                             {
                                 for(let one of item.jurisdictionVOS){
                                     if(one)
                                     {
                                          item.permissionNames.push(one.menuName);
                                          item.permissionIds.push(one.id);

                                     }
                                     
                                 }
                             }
                             item.permissionNamesStr=item.permissionNames.join(',');
                       }
                        this.tableList=res.data;
                    }
                    else{
                        this.$Message.error(res.message);
                    }


                })
            },

            //新增
            addRole(params)
            {
            
                this.$router.push({name:'rolePermission-detial',query:params?params:{}});

            },
            //编辑
            editRole(row)
            {
                let {id,permissionIds,roleName}=row;
                
                let params={
                    roleId:id,
                    roleName:roleName,
                    menuIds:permissionIds
                }
                console.log(params)
                this.addRole(params)

            },
            //删除
            delRole(row)
            {
                 this.$util.confirmDialog(this,"确认",`确认删除角色：${row.roleName}`,self=>{
                     self.$api.delRole({roleIds:[row.id],systemType:0}).then(res=>{
                         if(res.result==0)
                         {
                             self.$Message.success('删除成功');
                             self.getRoleList();

                         }
                         else{
                             self.$Message.error(res.message);
                         }
                     })
                     
                  })
                  

            },
       
          

        },
        filters: {

        },
        components: {
            roleForm
        }
    }

</script>

<style lang='less'>
      #role-permission{
          width:100;
          overflow: hidden;
      
          
          .create{
               display: -webkit-flex;
              display: flex;
              justify-content: flex-end;
              margin-bottom: 10px;
              cursor: pointer;
              
              &:hover{
                  color:#2db7f5;
              }

          }
      

      }
</style>

