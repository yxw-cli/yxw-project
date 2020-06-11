<template>
<div class="only-content" style="height:100%;font-size:16px">
    <div style="margin:30px">账户资料</div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleInfor" :label-width="120">
        <FormItem label="账户名称: " prop="userName">
            <Input v-model="formValidate.userName" placeholder="请输入用户名" style="width:40%" disabled></Input>
        </FormItem>
        <FormItem label="联系姓名: " prop="realName">
            <Input v-model="formValidate.realName" placeholder="请输入姓名" style="width:40%"></Input>
        </FormItem>
        <FormItem label="联系方式: " prop="phoneNo">
            <Input v-model="formValidate.phoneNo" placeholder="请输入手机号" style="width:40%"></Input>
        </FormItem>
        <!-- <FormItem label="联系邮箱: " prop="email">
            <Input v-model="formValidate.email" placeholder="请输入联系邮箱" style="width:40%"></Input>
        </FormItem> -->
        <FormItem>
            <Button style="margin-top:20px;margin-left: 2px" @click="editorPassword">修改密码</Button>
            <Button style="margin-top:20px;margin-left: 20px" type="primary" @click="completeInfor('formValidate')">完成</Button>
        </FormItem>
    </Form>
</div>  
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            
            return {
                
                formValidate:{
                    userName:'',
                    realName:'',
                    phoneNo:'',
                    email:'',
                    id:'',
                    // userRoleInSyses:[{
                    //     "customerId":1,
                    //     "deptId":1,
                    //     "roleId":1,
                    //     "systemType":0,
                    // }]
                },
                // 验证字段
                ruleInfor: {                    
                    userName: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                        { pattern:"^[a-zA-Z0-9]{1,20}$", message: '请输入1-20位字符，包含数字、字母（区分大小写）！',trigger:'blur'}
                    ],
                    realName: [
                  
                        {max:20,message: '姓名应为不超过20位，中英文',rigger:'blur'}
                    ],
                    phoneNo: [
                        
                        { pattern:"^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0135678]|18[0|1|2|3|5|6|7|8|9]|19[89])\\d{8}$", message: '请输入正确的电话！',trigger:'blur'}
                    ],
                    email: [
                      
                        { type:'email', message: '请输入正确的邮箱！',trigger:'blur' }
                    ],                 
                },
                
            }
        },
        created: function () {
            
          

        },
         computed: {
              userInfo () {
                  let data= this.$store.state.app.userInfo; 
                  console.log(data)
             },
         },

        mounted:function()
        {
            this.getUserInfo();
            // var self=this;
              
        },
      
        watch: {

        },
        methods: {
            editorPassword(){
                // this.$router.push({name: "meetSignView", params: {'meetingId': params.meetingId}})
                this.$router.push({name: "editorPassword",query:{userId:this.formValidate.id,userName:this.formValidate.userName}})
            },
          getUserInfo()
            {
                
                this.$api.user_info(window.sessionStorage.getItem("sid")).then(res=>{
                    if(res.result||res.respCode==0)
                    {
                      let data=res.data;
                       for(let i in this.formValidate)
                       {
                           if(data[i])
                           {
                               this.formValidate[i]=data[i];
                           }

                       }
                
                    }

                })
            },
            //获取用户信息的 完成操作
            completeInfor(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var self=this;
                        this.$api.updatePersonalInfo(this.formValidate).then(res => {
                            if(res.respCode==0)
                            {
                                self.$Message.success('保存成功');
                                this.$store.commit('setUserInfo',this.formValidate);
                            }
                            else
                            {
                                self.$Message.error('失败');
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    } else {
                        // this.$Message.error('失败');
                    }
                })
            }
        },
        filters: {

        },
        components: {
         
        }
    }

</script>

<style lang='less'>
  
</style>

