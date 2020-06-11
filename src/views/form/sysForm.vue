<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Name" prop="name">
            <Input    v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="E-mail" prop="mail">
            <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
        </FormItem>
     
            <FormItem prop="time"  label="Time">
                        <TimePicker confrim  @on-ok='formatTime' type="timerange" placeholder="Select time" v-model="formValidate.time"></TimePicker>
          </FormItem>
          <!-- 开发中出现动态表单校验可采用该方法 -->
          <Row v-for='(item,index) in formValidate.interest'>
             <Col span="8">
               <FormItem label="用户姓名" :prop="getProp('userName',index)">
                    <Input type="text" v-model="formValidate.interest[index].userName" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                </Col>
             <Col span="8">
                <FormItem  label="年龄" :prop="getProp('age',index)">
                    <Input  v-model="item.age" placeholder="年龄" :maxlength="-1">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                   <FormItem  label="地区" :prop="getProp('cityStr',index)">
                     <Cascader :data="area" v-model="item.city"  @on-change='(value)=>handleCity(value,select,index)'></Cascader>
                </FormItem>
            </Col>
             <Col span="8">
                   <Button type="error">删除</Button>
            </Col>
            
          </Row>
             <Button type="glost" @click="addUser">新增</Button>
     
    </Form>
</template>
<script>
    export default {
        props:{
            formValidate:{
                type:Object,
                default:()=>{
                    return {
                        name: '',
                        mail: '',
                        age: '',
                        interest: [
                            {userName:'',age:"",city:[],cityStr:''}
                        ],
                    }
                }
            },
           
        },
        data () {
            return {
                timemarge:[],
                  area: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }],
                //循环验证数组的规则
                userRule:{
                       userName:[
                         this.$util.rules.required(),
                    ],
                     age:[
                       this.$util.rules.required(),
                    ],
                    city:[
                       this.$util.rules.required('必填项','change'),
                    ],
                    cityStr:[
                       this.$util.rules.required('必填项','blur'),
                    ]
                },
        
                ruleValidate: {
                    name: [
                          this.$util.rules.required(),
                    ],
                    mail: [
                          this.$util.rules.required(),
                          this.$util.rules.mail(),
                    ],
                    city: [
                         this.$util.rules.required(),
                    ],
                    time:[
                         this.$util.rules.timemarge()
                    ],
                }
            }
        },
        created:function(){
            alert(this.formValidate)
        
        },
        mounted(){
           
        },
        methods: {

            handleCity(value,select,index){
                var that=this;
               that.formValidate.interest[index].cityStr=value.toString();
                       
                      //that.formValidate.interest[index].city=value;
                        that.$refs.formValidate.validateField(that.getProp('cityStr',index),(res)=>{
                           
                            
                        });

            

            },
            formatTime()
            {
                this.formatTime.time='1'
                
            },
            //生成验证数组的prop 
            getProp(prop,index){
                var ruleName=`interest[${index}].${prop}`
                this.ruleValidate[ruleName]=this.userRule[prop];
                return ruleName;
            },
            handleSubmit () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                        this.$emit('finish','');
                    } else {
                         this.$Message.error('Fail!');
                         this.$emit('error','');
                    }
                })
            },
            handleReset () {
                this.$refs.formValidate.resetFields();
            },
            //添加
            addUser()
            {
                this.formValidate.interest.push({userName:'',age:""});

            },


        }
    }
</script>