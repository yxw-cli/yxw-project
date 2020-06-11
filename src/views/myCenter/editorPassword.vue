<template>
<div class="only-content" style="height:100%;font-size:16px">
    <div style="margin:30px">修改密码</div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleInfor" :label-width="120">
        <FormItem label="原密码:" prop="oldPassword">
            <Input type="password" v-model="formValidate.oldPassword" placeholder="请输入原密码" style="width:40%"></Input>
        </FormItem>
        <FormItem label="新密码:" prop="newPassword">
            <Input type="password" v-model="formValidate.newPassword" placeholder="请输入新密码" style="width:40%"></Input>
        </FormItem>
        <FormItem label="确认密码:" prop="againPass">
            <Input type="password" v-model="formValidate.againPass" placeholder="请再次输入密码" style="width:40%"></Input>
        </FormItem>
        <FormItem>
            <Button style="margin-top:20px;margin-left: 2px" @click="cancelChange">取消</Button>
            <Button style="margin-top:20px;margin-left: 2px" @click="determineChange('formValidate')">确定</Button>
        </FormItem>
    </Form>
</div>  
</template>

<script>
    import {mapGetters} from 'vuex'
import { setTimeout } from 'timers';

    export default {
        data() {
            return {
                formValidate:{
                    newPassword:'',
                    oldPassword:'',
                    againPass:'',
                    userId:'',
                    userName:'',
                    systemType:0
                },
                // 验证字段
                ruleInfor: {
                    oldPassword: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { pattern:"^[a-zA-Z0-9]{6,20}$", message: '密码为6-20位字符，包含数字、字母（区分大小写），请重新输入',trigger:'blur'}
                    ],                   
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { pattern:"^[a-zA-Z0-9]{6,20}$", message: '密码为6-20位字符，包含数字、字母（区分大小写），请重新输入',trigger:'blur'},
                         { validator: this.checkPassword, trigger: 'blur' }
                    ],                 
                    againPass: [
                        { required: true, message: '请再次输入密码', trigger: 'blur' },
                        { validator: this.checkConfirm, trigger: 'blur' }
                    ],                 
                }
            }
        },
        created: function () {

        },
        mounted:function()
        {
          
            this.$api.user_info({}).then(res => {
               
                    this.formValidate.userName = res.data.userName;
                    this.formValidate.userId = res.data.id;                  
                })
                .catch(error => {
                    console.log(error)
                })
        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
            //验证再次输入密码
            checkConfirm(rule, value, callback){
                // console.log(value)
                var express = /^[\w]{6,20}$/;
                if (value==""||value && value !== this.formValidate.newPassword) {
                    if(value==""){
                        callback('');
                    }
                    if(!express.test(value) ){
                        callback('密码为6-20位字符，包含数字、字母（区分大小写），请重新输入');
                    }
                    if(value && value !== this.formValidate.newPassword){
                        callback('两次输入的密码不一致!');
                    }else{
                        callback();
                    }
                // 相同时
                } else {
                    callback();;
                }
            },
              //验证再次输入密码
            checkPassword(rule, value, callback){
            
                if (value && value == this.formValidate.oldPassword) {
                       callback('新密码不能与原密码相同!');
                     
                
                } else {
                    callback();;
                }
            },
            //取消操作
            cancelChange(){
                this.$router.back(-1);
            },
            //确定 操作
            determineChange(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {                       
                        var self=this;
                        this.$api.personal_change_password(this.formValidate).then(res => {
                            console.log(res)
                            if(res.respCode==0)
                            {
                                self.$Message.info('修改成功!即将退出登录，请重新登录！');
                                setTimeout(()=>{
                                     sessionStorage.setItem("sid", '');
                                    this.$router.push({name:"login"});
                                },1000)
                            }
                            else
                            {
                                self.$Message.error(res.message);
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

