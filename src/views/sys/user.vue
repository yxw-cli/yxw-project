<template>
    <div>
     <Form ref="params" :model="params"  inline>
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
           <FormItem prop="realName">
              <Select v-model="params.roleId" style="width:180px"  placeholder="请选择角色">
                   <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
             </Select>
         </FormItem>
     
          <FormItem prop="deptId">
              <treeSelect :treeData='depTreeData'
                       
                         :modelData.sync='params.deptId'>
              </treeSelect>
            <!-- <Poptip title="部门"  placement="bottom">
             
               <Input    v-model="params.deptName" placeholder="所属部门"></Input>
               <template  slot="content">
                  <div>
                       <Tree :data="depTreeData" @on-select-change='chooseDep'></Tree>
                  </div>
              </template>
           </Poptip> -->
        </FormItem>
        <FormItem>
            <Button type="primary" @click="getUserList()" style="margin-left：10px">查询</Button>
             <Button type="info" @click="addUser()" style="margin-left：10px">新建</Button>
              <Button type="warning" @click="delUser()">批量删除</Button>
        </FormItem>
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
                    >
            </primaryTable>
       </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
      import userForm from '../form/userForm'
import { parse } from 'path';


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
                depTreeData:[],
                total:0,
                 selectIds:[],
                 columns:[
                     {
                         type:'selection',
                         align:'center',
                         width:60
                     },
                     {
                        title: '编号',
                        key: 'userNo',
                    },
                    {
                        title: '登录账号',
                        slot:"alarm",
                        key: 'userName'
                    },
                      
                       {
                        title: '姓名',
                        slot:"alarm",
                        key: 'realName'
                    },
                     {
                        title: '用户类型',
                        slot:"alarm",
                        key: 'userType'
                    },
                     {
                        title: '性别',
                        slot:"alarm",
                        key: 'userSex'
                    },
                     {
                        title: '状态',
                        slot:"alarm",
                        key: 'userSex'
                    },

                    {
                        title: '操作',
                        slot: 'action',
                        width: 250,
                        align: 'center',
                        btn:{edit:true,del:true},
                       
                    }
                ],

                tableList:[],
                roleList:[],
               
               
            }
        },
        created: function () {
            this.getUserList();
            this.getOrgDepList();
            this.getRoleAllList();

        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {

              getUserList()
            {
                this.$api.getUserList(this.params).then(res=>{
                  
                  if(res.respCode==0||(res.result)-0==0)
                    {
                       this.total=res.data.count;
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
            //处理选中
            handleSelect(data)
            {
                for(let item of data)
                {
                    this.selectIds.push(item.id);
                }

            },
           
           changePage(page)
           {
               this.params.page=page;
               this.getUserList();

           },

            addUser(formData)
            {
                let props={},title='新建用户';
                props.depTreeData=this.depTreeData;
                props.roleList=this.roleList;
                if(formData)
                {
                    props.formValidate=formData;
                    title='编辑用户';
                }
                let self=this;
                  var params={
                      self:this,
                      title:title,
                      width:600,//默认600
                      props:props,
                      form:userForm,//弹窗中的表单
                      success:(res)=>{
                          this.getUserList();
                      },
                      cancel:()=>{
                      }
                }
                this.$util.openModelForm(params);


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
          
                for(let item of row.userRoleInSyses)
                {
                    if(item.roleId)
                    {
                          params.roleIds.push(item.roleId);
                    }
                    if(item.deptId)
                    {
                        params.deptId=item.deptId;
                    }
                }
                this.addUser(params);
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
                             self.$Message.success('保存成功');
                             self.close();

                         }
                         else{
                             self.$Message.error(res.message);
                         }
                     })
                     
                  })

            },
            chooseDep(data)
            {
                this.params.deptName=data[0].title;
                this.params.partmentId=data[0].id;

            },

           getOrgDepList()
            {
                this.$api.getOrgDepList({systemType:0}).then(res=>{
                    if(res.respCode==0||res.result==0)
                    {
                        
                        this.depTreeData= this.getTreeOrgDept(res.data);
                        console.log(this.depTreeData)

                    }
                    else{
                        this.$Message.error(res.message?res.message:res.resultMessage);
                    }

                })
            },
              /*
              生成树形组织结构(适用于 返回不是树形数据)
            */ 

           
          getTreeOrgDept(list,treeData,id)
            {
                let itemArr=[];
                let that=this;
                filter(itemArr,null)
                function get(array)
                {
                    for(let item of array)
                    {
                        filter(item,item.id)
                    }
                } 
                //遍历过滤
                function filter(tree,id){
                    
                    let array=list.filter(item=>{
                        //第一次递归 ：赋值为了新建和编辑时候tree插件使用title
                        if(id==null)
                        {
                             item.title=item.deptName;
                        }
                         return item.parentId==id;
                    })
                    if(id==null||id==0)
                    {
                        itemArr=array;
                    }
                    else{
                        tree.children=array;
                    }
                    //依次遍历
                    if(array.length>0)
                    {
                         get(array)
                    }
                  
                }

                return itemArr;

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
      #menu_index{

      }
</style>

