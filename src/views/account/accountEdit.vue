<template>
   <div id="account-edit">
         <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
        <FormItem label="账户名称:" prop="userName">
            <Input    v-model="formData.userName" placeholder="账户名称" :disabled='formData.id!=""'></Input>
        </FormItem>
         <FormItem label="联系姓名:" prop="realName">
            <Input    v-model="formData.realName" placeholder="联系姓名"></Input>
        </FormItem>
          <FormItem label="联系方式:" prop="phoneNo">
            <Input    v-model="formData.phoneNo" placeholder="联系方式"></Input>
        </FormItem>
         <FormItem label="选择角色:" prop="roleIds">
              <Select v-model="formData.roleIds"  multiple  placeholder="请选择角色">
                   <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
             </Select>
         </FormItem>
         <FormItem label="所属组织:" prop="deptId">
              <treeSelect  :treeData='depTreeData' :modelData.sync="formData.deptId"  placeholder="所属组织"></treeSelect>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit()">保存</Button>
            <Button @click="back()" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
   </div>
  
</template>
<script>

    export default {
     
        data () {
            return {
                formData:{
                        userName: '',
                        realName:'',
                        userNo:'',
                        remark: '',
                        roleIds:[],
                        deptId:'',
                        phoneNo:'',
                        deptName:'',
                        id:''
                },
                roleList:[],
                currentRoleIds:'',
                depTreeData:[],
                ruleValidate: {

                    userName: [
                          this.$util.rules.required(),
                          this.$util.rules.validUserName(),
                    ],
                    realName: [
                        this.$util.rules.max(20,'姓名不能超过20位'),
                    ],
                    phoneNo:[
                          this.$util.rules.phone(),
                    ],
                    roleIds:[
                          { type: 'array', required: true, message: '请选择角色'}
                       
                    ],
                    deptId: [
                          { required: true, message: '请选择所属组织' }
                       
                    ],
                },
             
            }
        },
        components: {
            
        },
        created:function(){
            if(this.$route.query)
            {
                let params=this.$route.query;
               for(let i in this.formData)
                {
                    if(params[i])
                    {
                        this.formData[i]=params[i]
                    }
                }
                 this.currentRoleIds=(this.formData.roleIds).join('');
            }
            
            
            this.getRoleAllList();
            this.getOrgDepList();
        
        },
        mounted(){
           
        },
        methods: {
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

              getOrgDepList()
            {
                this.$api.getOrgDepList({systemType:0}).then(res=>{
                    if(res.respCode==0||res.result==0)
                    {
                        this.depTreeData= this.getTreeOrgDept(res.data);

                    }
                    else{
                        this.$Message.error(res.message?res.message:res.resultMessage);
                    }

                })
            },
              /*
                 生成树形组织结构(适用于 返回不是树形数据)
              */ 

           
          getTreeOrgDept(list,id)
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
          
             /*
               提交
            */ 
            handleSubmit () {
                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        this.saveUser();
                       
                    } else {
                     
                         this.$emit('error','');
                    }
                })
            },
           
            /*
               保存
            */ 
            saveUser(){
              
                //根据有无id判断是编辑还是添加
                let method=this.formData.id?'updateUser':'createUser';
                this.formData.systemType=0;
                console.log(JSON.stringify(this.formData))
                this.$api[method](this.formData).then(res=>{
                      if(res.respCode==0||(res.result)-0==0)
                    {
                        this.handleResult(this.formData)

                       
                    }
                    else{
                   
                        this.$Message.error(res.message);
                    }
                }).catch(error => {
                    
               
                })
            },
            back () {
                this.$router.back(-1);
            },

            handleResult(formData)
            {
                      
                      let roles=(formData.roleIds).join('');
                      if(formData.id==localStorage.userId&&roles!=this.currentRoleIds)
                        {
                            this.$Message.info('您的角色信息已变更，请重新登录！');
                                setTimeout(()=>{
                                     sessionStorage.setItem("sid", '');
                                     localStorage.userId='';
                                     this.$router.push({name:"login"});
                                },1000)
                                return;
                            
                        }
                        
                         this.$Message.success('保存成功');
                         this.$router.back(-1);
            }
           


        }
    }
</script>
<style lang="less">
      #account-edit{

         .ivu-form-item-content{
             width: 360px;
         }

      }
</style>
