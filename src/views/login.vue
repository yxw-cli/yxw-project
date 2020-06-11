<style lang="less">
    @import '../style/login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="top-area">
            <img src='http://www.hrs.com.cn/templates/main/img/logo2.png'>
            <h1>后台管理系统</h1>
        </div>
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon type="ios-person-outline" :size="16" />
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                   <Icon type="ios-lock-outline" size='14' />
                                </span>
                            </Input>
                        </FormItem>
                          <FormItem prop="verificationCode">
                               <Row>
                                    <Col span="16"> 
                                    <Input  v-model="form.verificationCode" placeholder="请输入验证码">
                                        <span slot="prepend">
                                           <Icon type="ios-cog-outline" size='14' />
                                        </span>
                                      </Input>
                                    </Col>
                                    <Col span="8">
                                        <img :src='codeUrl' @click="refreshCode"/>
                                    </Col>
                                </Row>
                           
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
                </div>
            </Card>
        </div>
       
    </div>
</template>

<script>

export default {
    data () {
        return {
            form: {
                password: '',
                userName: '',
                verificationCode:''
            },
            codeUrl:'/api/usermanage/getcode?'+new Date().getTime(),
            rules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { pattern:"^[a-zA-Z0-9]{1,20}$", message: '用户名为1-20位字符，包含数字、字母（区分大小写）！',trigger:'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { pattern:"^[a-zA-Z0-9]{6,20}$", message: '密码为6-20位字符，包含数字、字母（区分大小写）！',trigger:'blur'}
                ],
                 verificationCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ]
            }
        };
    },
    methods: {
        // 提交登录
        handleSubmit () {
        
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.toLogin();
                }
            });
        },
        refreshCode(){
            this.codeUrl='/api/usermanage/getcode?='+new Date().getTime();

        },
        // 请求登录接口
        toLogin()
        {
            var self=this;
            this.$api.login(this.form).then(res => {
                if(res.respCode==0)
                {
                    self.$Message.info('登录成功');
                    window.sessionStorage.setItem("sid",res.data);
                    this.$router.push({
                        name: 'home'
                    });
                }else{
                    self.$Message.error('登录失败:'+res.message);
                          self.refreshCode();
                }
            })
            .catch(error => {
                self.refreshCode();
                console.log(error)
            })
        },
    }
};
</script>

