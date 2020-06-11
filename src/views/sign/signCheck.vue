
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
                            <!-- <FormItem label="性别" prop='sex'>
                                    <p class="end">
                                       {{formData.sex!=1?'男':'女'}}
                                    </p>
                            </FormItem> -->
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
                                    <p class="end">
                                       {{formData.age}}
                                    </p>
                            </FormItem>
                            <FormItem label="诊断疾病全称" prop="illnessFullName">
                                     <p class="end">
                                       {{formData.illnessFullName}}
                                    </p>
                            </FormItem>
                             <FormItem label=" 最近一次C A125 的值：" prop="ca" v-if="formData.type!=1">
                                   <p class="end">
                                       {{formData.ca}}  
                                    </p>
                            </FormItem>
                              <FormItem label=" 最近一次HbAlc 的值：" prop="hb" v-if="formData.type==1">
                                   <p class="end">
                                       {{formData.hb}}
                                    </p>
                               
                            </FormItem>
                              <FormItem label="最近一次餐前血糖：" prop="bloodSugar"  v-if="formData.type==1">
                                 <p class="end">
                                       {{formData.bloodSugar}}
                                    </p>
                            </FormItem>
                              <FormItem label="最近一次餐后2h后血糖：" prop="bloodSugar2h"  v-if="formData.type==1">
                                    <p class="end">
                                       {{formData.bloodSugar2h}}
                                  </p>
                            </FormItem>
                              <FormItem label="最近一次血清尿酸：" prop="serum"  v-if="formData.type==1">
                                <!-- <Input v-model="formData.serum" placeholder="请输入补充信息：">
                                    <span slot="append">({{formData.serumRemarks}})</span>
                                </Input> -->
                                  <p class="end">
                                       {{formData.serum}}
                                 </p>
                            </FormItem>
                           
                           
                      </Col>
                </Row>
                 <FormItem label="是否已联系">
                                <RadioGroup v-model="formData.isContact">
                                    <Radio label="0">否</Radio>
                                    <Radio label="1">是</Radio>
                                </RadioGroup>
                </FormItem>
                <FormItem label="备注" prop="remarks">
                       <p class="end">
                             {{formData.remarks}}
                       </p>
                </FormItem>
             <FormItem>
               
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
       
            back()
            {
                  this.$router.back(-1);
                  
              
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
               word-break: break-all;
           }
           textarea{
                 max-width:400px;
           }

      }
</style>

