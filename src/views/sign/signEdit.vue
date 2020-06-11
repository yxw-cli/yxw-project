
<template>
    <div id="sign-edit">
          <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="150" label-position='left'>
              <FormItem label="项目名称" prop='projectName' :label-width='100'>
                                    <p>
                                        {{formData.projectName}}
                                    </p>
                  </FormItem>
                  <FormItem label="类型" prop='type' :label-width='100'>
                                    <p>
                                        {{formData.type==0?'肿瘤类':'非肿瘤类'}}
                                    </p>
                  </FormItem>
                <Row :gutter='20'>
                      <Col :span='6' >
                            <FormItem label="姓名" prop='name'>
                                    <p class="end">
                                        {{formData.name}}
                                    </p>
                            </FormItem>
                            <FormItem label="手机号" prop='mobileNo'>
                                    <p class="end">
                                       {{formData.mobileNo}}
                                    </p>
                            </FormItem>
                            <FormItem label="所在城市" prop='city'>
                                    <p class="end">
                                       {{formData.city}}
                                    </p>
                            </FormItem>
                             
                            
                      </Col>
                      <Col :span='9' :offset='2'>
                            <FormItem label="年龄" prop="age">
                                <Input v-model="formData.age" placeholder="请输入年龄"></Input>
                            </FormItem>
                            <FormItem label="诊断疾病全称" prop="illnessFullName">
                                <Input v-model="formData.illnessFullName" placeholder="请输入诊断疾病全称"></Input>
                            </FormItem>
                             <FormItem label=" 最近一次C A125 的值：" prop="ca" v-if="formData.type!=1">
                                <Input v-model="formData.ca" placeholder="请输入补充信息："></Input>
                            </FormItem>
                            <div v-else >
                                   <FormItem label=" 最近一次HbAlc 的值：" prop="hb" >
                                <Input v-model="formData.hb" placeholder="请输入补充信息：">
                                  <span slot="append">({{formData.hbRemarks}})</span>
                            </Input>
                               
                            </FormItem>
                              <FormItem label="最近一次餐前血糖：" prop="bloodSugar"  >
                                <Input v-model="formData.bloodSugar" placeholder="请输入补充信息：">
                                     <span slot="append">({{formData.bloodSugarRemarks}})</span>
                                </Input>
                            </FormItem>
                              <FormItem label="最近一次餐后2h后血糖：" prop="bloodSugar2h" >
                                <Input v-model="formData.bloodSugar2h" placeholder="请输入补充信息：">
                                      <span slot="append">({{formData.bloodSugar2hRemarks}})</span>
                                </Input>
                            </FormItem>
                             <FormItem label="最近一次血清尿酸：" prop="serum" >
                                <Input v-model="formData.serum" placeholder="请输入补充信息：">
                                      <span slot="append">(痛风)</span>
                                </Input>
                            </FormItem>

                            </div>
                            
                           
                      </Col>
                </Row>
                 <FormItem label="是否已联系">
                                <RadioGroup v-model="formData.isContact">
                                    <Radio label="0">否</Radio>
                                    <Radio label="1">是</Radio>
                                </RadioGroup>
                </FormItem>
                <FormItem label="备注" prop="remarks">
                    <Input v-model="formData.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注信息："></Input>
                </FormItem>
             <FormItem>
                <Button type="primary" @click="submit">保存</Button>
                <Button @click="back" style="margin-left: 8px">返回</Button>
            </FormItem>
          </Form>
          
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        data() {
            return {
                
                formData:{
                    "age": "",
                    "bloodSugar": "",
                    "bloodSugar2h": "",
                    "bloodSugar2hRemarks": "",
                    "bloodSugarRemarks": "",
                    "ca": "",
                    "city": "",
                    "hb": "",
                    "hbRemarks": "",
                    "id": "",
                    "illnessFullName": "",
                    "isContact": "",
                    "isDel": "",
                    "mobileNo": "",
                    "name": "",
                    "otherInfo1": "",
                    "otherInfo10": "",
                    "otherInfo2": "",
                    "otherInfo3": "",
                    "otherInfo4": "",
                    "otherInfo5": "",
                    "otherInfo6": "",
                    "otherInfo7": "",
                    "otherInfo8": "",
                    "otherInfo9": "",
                    "projectName": "",
                    "remarks": "",
                    "serialNumber": "",
                    "serum": "",
                    "serumRemarks": "",
                    "sex": "",
                    "signUpTime": "",
                    "status": "",
                    "type": ""
               },
                ruleValidate:{
                    name: [
                          this.$util.rules.required(),
                    ],
                    city:[
                          this.$util.rules.required(),
                    ],
                    mobileNo:[
                          this.$util.rules.required(),
                    ],
                    age:[
                          this.$util.rules.validateAge(),
                       
                          
                    ],
                    illnessFullName:[
                          
                           this.$util.rules.max(200,'输入限制200字符'),
                    
                    ],
                    ca:[
                       
                         this.$util.rules.max(50,'输入限制50字符'),

                    ],
                    hb:[
                        //this.$util.rules.validateNumber(),
                         this.$util.rules.max(50,'输入限制50字符'),

                    ],
                    bloodSugar:[
                        //this.$util.rules.validateNumber(),
                         this.$util.rules.max(50,'输入限制50字符'),

                    ],
                      bloodSugar2h:[
                        //this.$util.rules.validateNumber(),
                         this.$util.rules.max(50,'输入限制50字符'),

                    ],
                      serum:[
                        //this.$util.rules.validateNumber(),
                        this.$util.rules.max(200,'输入限制200字符'),

                    ],
                },
               
            }
        },
        created: function () {

            let id=this.$route.query.id;
            if(id)
            {
                this.getSignDetial(id);
            }

        },
        mounted:function()
        {
         


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
            /**
             * 获取详情
             * 
             */
            getSignDetial(id){
                this.$api.getSignDetial({id:id}).then(res=>{
                    if(res.respCode==0||res.result==0)
                    {
                        //常量显示
                        if(res.data.type==1)
                        {
                            res.data.bloodSugar2hRemarks='糖尿病';
                            res.data.bloodSugarRemarks='糖尿病';
                            res.data.hbRemarks='糖尿病';
                            res.data.serumRemarks='痛风';
                          
                        }
                        this.formData=res.data;
                    }

                })

            },
            submit(){
                    this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.save();
                       
                    } else {
                     
                        
                    }
                })
            },
            save()
            {
                this.formData.sex=0;
                 this.$util.confirmDialog(this,"确认",`确认保存信息？`,self=>{
                     self.$api.updateSign(this.formData).then(res=>{
                         if(res.respCode==0||res.result==0)
                         {
                             self.$Message.success('保存成功');
                             self.$router.back(-1);

                         }
                         else{
                             self.$Message.error(res.message);
                         }
                     })
                     
                  })
                  


            },
            back()
            {
                  this.$util.confirmDialog(this,"确认",`确认放弃编辑?`,self=>{
                       self.$router.back(-1);

                     
                  })
                  
              
            },

        },
        filters: {

        },
        components: {
         
        }
    }

</script>

<style lang='less'>
      #sign-edit{
           
           .end{
               //text-align: end
           }
           textarea{
                 max-width:400px;
           }
           .ivu-form-item-error{
               min-height: 45px;
           }

      }
</style>

