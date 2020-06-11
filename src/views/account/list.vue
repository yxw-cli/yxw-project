<template>
    <div>
      
     <Form ref="params" :model="params"  inline>
         <Row type="flex" justify="space-between">
             <Col span='16'>
             
            <FormItem prop="userName">
                <Input type="text" v-model="params.userName" placeholder="登录账号">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="realName">
                <Input type="text" v-model="params.realName" placeholder="姓名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="search(1)" style="margin-left：10px">查询</Button>
                <Button @click="reset()">重置</Button>
            </FormItem>
             </Col>
             <Col span='8'>
               <div class="to-right">
                     <Button type="warning" @click="delUser()" v-has='"account:delete"'>批量删除</Button>
                     <Button @click="toCheckOrg()" v-has='"account:org"'>组织管理</Button>
                     <Button @click="toCheckRole()" v-has='"account:permission"'>权限管理</Button>
               </div>
               
             </Col>
         </Row>
     
     </Form>

       <div>
             <primaryTable 
                     :columns="columns" :data="tableList"
                     :total='total'
                     :pageSize='params.pageSize'
                     ref='primaryTable'
                     @on-edit='editUser'
                     @on-del='delUser'
                     @on-select='handleSelect'
                     @on-change='changePage'
                     @on-change-status='changeUserStatus'
                     :loading='tableLoading'
                     @on-reset='resetPassword'
                     :current.sync='params.page'
                     @on-page-size-change='changePageSize'
                  
                    >
            </primaryTable>
       </div>
    </div>
</template>

<script>
     import {mapGetters} from 'vuex'
     import userForm from '../form/userForm'


    export default {
        data() {
            return {
           
                params:{
                    userName:'',
                    roleId:'',
                    partmentId:'',
                    realName:'',
                    pageSize:10,
                    page:1
                },
                tableLoading:false,
                depTreeData:[],
                total:0,
                 selectIds:[],
                 columns:[
                     {
                         type:'selection',
                         align:'center',
                         width:60
                     },
                    //  {
                    //     title: '编号',
                    //     key: 'userNo',
                    // },
                    {
                        title: '账户名称',
                        slot:"alarm",
                        key: 'userName'
                    },
                      
                       {
                        title: '联系姓名',
                        slot:"alarm",
                        key: 'realName'
                    },
                    
                       {
                        title: '联系方式',
                        slot:"alarm",
                        key: 'phoneNo'
                    },
                    
                     {
                        title: '角色',
                        slot:"alarm",
                        key: 'roleNameStr'
                    },
                     {
                        title: '所属组织',
                        slot:"alarm",
                        key: 'deptName'
                    },
                     {
                        title: '更新时间',
                        slot:"alarm",
                        key: 'updateDate',
                        sortable: true,
                    },
                     {
                        title: '状态',
                        slot:"alarm",
                        width:80,
                        key: 'statusDesc'
                    },

                    {
                        title: '操作',
                        slot: 'action',
                        width: 300,
                        align: 'center',
                 
                        //permission:"account:reset"  permission:"	account:changeState"
                        selfBtn:  [
                                   {name:'编辑',type:'info',method:'on-edit', permission:"account:edit"},
                                  {name:'重置密码',type:'',method:'on-reset',permission:"account:reset"},
                                  { permission:"account:changeState",name:[{name:'禁用',value:0,param:'status'},{name:'启用',value:1,param:'status'}],type:'success',method:'on-change-status'}                 
                        ],
                       
                    }
                ],

                tableList:[],
                roleList:[],
                searchUserParams:{},
               
               
            }
        },
        created: function () {
            this.search(1);
         

        },
        mounted:function()
        {
             //由于新建按钮在右上角，那是在路由中配置显示的
             if( document.querySelector('#addUser'))
             {
                    document.querySelector('#addUser').onclick=()=>{

                       this.addUser();
            
                  };

             }
           
        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {

         
            search(page){
                this.params.page=page?page:this.params.page;
                this.searchUserParams=JSON.parse(JSON.stringify(this.params))
                this.getUserList(this.searchUserParams);
              
            },

            getUserList(params)
            {
              
                 this.tableLoading=true;
                 this.$api.getUserList(params).then(res=>{
                
                   this.tableLoading=false;
                  if(res.respCode==0||(res.result)-0==0)
                    {
                        this.total=res.data.count;
                        for(let item of res.data.list)
                        {
                            if(item.roleVOS)
                            {
                                    let roleNames=[];
                                    for(let one of item.roleVOS)
                                    {
                                        roleNames.push(one.roleName);
                                    }
                                
                                    item.roleNameStr=roleNames.join(',');
                            }
                            if(item.deptVOS&&item.deptVOS.length>0)
                            {
                                
                                item.deptName=item.deptVOS[0].parentName?`${item.deptVOS[0].parentName} - ${item.deptVOS[0].deptName}`:item.deptVOS[0].deptName;
                            }
                              item.status=item.status?item.status:0;
                             item.statusDesc=item.status==0?"启用":'禁用';
                             item.updateDate= item.modifyDate?this.$util.getFormatDate(item.modifyDate):'';
                          
                        }
                    
                        this.tableList=res.data.list;
                    }
                    else{
                        this.$Message.error(res.message);
                    }


                })
            },
            //获得角色·
            getRoleAllList()
            {
                this.$api.getRoleAllList({}).then(res=>{
                    
                    if(res.result==0)
                    {
                        this.roleList=res.data;


                    }
                })
            },
            reset(){
                this.params={
                    userName:'',
                    roleId:'',
                    partmentId:'',
                    realName:'',
                    pageSize:10,
                    page:1
                };
                this.search(1);

            },
            //处理选中
            handleSelect(data)
            {
                this.selectIds=[];
                for(let item of data)
                {
                    this.selectIds.push(item.id);
                }

            },
           
           changePage(page)
           {  
               this.searchUserParams.page=page;
               this.getUserList(this.searchUserParams);

           },
        //    changePageSize(pageSize){
        //         this.searchUserParams.pageSize=pageSize;
        //        this.getUserList(this.searchUserParams);

        //    },

           changeUserStatus(row){
               let  status=row.status==1?0:1;
               let  id=row.id;
               let content=`您确定${status==1?'禁用':'启用'}用户: ${row.realName}吗？`
                this.$util.confirmDialog(this,'确认',content,self=>{
        
                    self.$api.updateUser({status:status,id:id}).then(res=>{
                      if(res.respCode==0||(res.result)-0==0)
                        {
                            self.$Message.success('修改状态成功');
                            self.getUserList(self.searchUserParams);
                        }
                        else{
                    
                            self.$Message.error(res.message);
                        }
                    }).catch(error => {
                        
                
                    })
                   
                  })
              
           },

            addUser()
            {
                this.$router.push({name:'account-edit'})
                

            },
            editUser(row){
                let {id,userNo,userName,realName,remark,phoneNo,userSex,userType,mobileNo,status}=row;
                let params={
                      id:id,
                      userNo:userNo,
                      userName:userName,
                      realName:realName,
                      remark:remark,
                      phoneNo:phoneNo,
                      userSex:userSex,
                      userType:userType,
                      mobileNo:mobileNo,
                      status:status,
                      roleIds:[]
                }
                if(row.deptVOS)
                {
                    for(let item of row.deptVOS)
                    {
                        
                        if(item.id)
                        {
                            params.deptId=item.id;
                        }
                    }

                }
              if(row.roleVOS)
                {
                    for(let item of row.roleVOS)
                    {
                        if(item.id)
                        {
                            params.roleIds.push(item.id);
                        }
                    }
                }
              
                
                console.log(params.deptId)
                 this.$router.push({name:'account-edit',query:params})
                

            },
            delUser(row){
                let content='您确认删除'
                let params={ids:[]}
                if(row)
                {
                    params.ids.push(row.id);

                }
                 else if (this.selectIds.length==0){
                    this.$Message.error('请至少选择一个用户');
                    return;
                }
                else {
                    params.ids=this.selectIds;
                }
                 this.$util.confirmDialog(this,'确认',content,self=>{
                     self.$api.delUser(params).then(res=>{
                         if(res.respCode==0)
                         {
                             self.$Message.success('删除成功');
                             self.search();
                         }
                         else{
                             self.$Message.error(res.message);
                         }
                     })
                     
                  })

            },
            resetPassword(row){
                let userId=row.id;
                    let content=`您确定重置用户:${row.userName}的密码吗？`
                 this.$util.confirmDialog(this,'确认',content,self=>{
                    self.$api.resetPassword({userId:row.id}).then(res=>{
                      if(res.respCode==0||(res.result)-0==0)
                        {
                            self.$Message.success('重置密码成功');
                            self.search();
                        }
                        else{
                    
                            self.$Message.error(res.message);
                        }
                    }).catch(error => {
                        
                
                    })
                   
                  })

            },
            chooseDep(data)
            {
                this.params.deptName=data[0].title;
                this.params.partmentId=data[0].id;

            },

         

            toCheckOrg(){

                this.$router.push({name:'org'})
            },
            toCheckRole()
            {
                  this.$router.push({name:'rolePermission'})
            },
         
        },
        filters: {

        },
        components: {
            userForm
         
        }
    }

</script>

<style lang='less'>
       .ivu-modal-confirm-body{
           word-break: break-all;
            overflow: hidden;
       }
      .to-right{
          display: -webkit-flex;
          display: flex;
          justify-content: flex-end;
      }
</style>

