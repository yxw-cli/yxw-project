<template>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
        <FormItem label="登录账号:" prop="userName">
            <Input    v-model="formData.userName" placeholder="登录账号"></Input>
        </FormItem>
        <FormItem label="编号:" prop="userNo">
            <Input  type="text"  v-model="formData.userNo" placeholder="标号"></Input>
        </FormItem>
         <FormItem label="姓名:" prop="realName">
            <Input    v-model="formData.realName" placeholder="姓名"></Input>
        </FormItem>

        <FormItem label="角色:" prop="roleIds">
              <Select v-model="formData.roleIds"  multiple  placeholder="请选择角色">
                   <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
             </Select>
         </FormItem>
         <FormItem label="部门:" prop="deptId">
              <treeSelect  :treeData='depTreeData' :modelData.sync="formData.deptId"  placeholder="所属部门"></treeSelect>
        </FormItem>
          <FormItem label="手机号码:" prop="phoneNo">
            <Input    v-model="formData.phoneNo" placeholder="姓名"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
            <Input v-model="formData.remark" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
</template>
<script>

    export default {
        props:{
            formValidate:{
                type:Object,
                  default:()=>{
                    return {}
                }
              
            },
            depTreeData:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            roleList:{
                type:Array,
                default:()=>{
                    return []
                }
            },
           
        },
        data () {
            return {
                formData:{
                        userName: '',
                        realName:'',
                        userNo:'',
                        remark: '',
                        roleIds:[],
                        deptId:'1',
                        phoneNo:'',
                        deptName:'',
                        id:''
                },
                ruleValidate: {

                    userName: [
                          this.$util.rules.required(),
                          
                    ],
                    userNo:[
                          this.$util.rules.required(),
                    ],
                },
             
            }
        },
        components: {
            
        },
        created:function(){
            
            for(let i in this.formData)
            {
                if(this.formValidate[i])
                {
                    this.formData[i]=this.formValidate[i]
                }
            }
        
        },
        mounted(){
           
        },
        methods: {
          
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
                        this.$Message.success('保存成功');
                        this.$emit('finish','');
                    }
                    else{
                        this.$emit('error','');
                        this.$Message.error(res.message);
                    }
                }).catch(error => {
                      this.$emit('error','');
               
                })
            },
            handleReset () {
                this.$refs.formData.resetFields();
            },
           


        }
    }
</script>