/*
 * @Author: 于学文 
 * @Date: 2019-06-20 13:23:38 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-21 09:58:43
 */
<template>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
    
        <FormItem label="名称" prop="deptName">
            <Input v-model="formData.deptName" placeholder="请输入部门名称"></Input>
        </FormItem>
         <!-- <FormItem label="部门编号" prop="deptNo">
            <Input    v-model="formData.deptNo" placeholder="请输入部门编号"></Input>
        </FormItem> -->
       
    </Form>
</template>
<script>
    export default {
        props:{
            formValidate:{
                type:Object,
            },
          
           
        },
        data () {
            return {
                formData:{
                        deptName: '',
                        deptNo: '',
                        parentId:null,
                        id:''
                },
                ruleValidate: {
                    deptName: [
                         this.$util.rules.required(),
                          this.$util.rules.max(20,'部门名称不能超过20位'),
                    ],
                   
                }
            }
        },
        created:function(){
            
            for(let i in this.formData)
            {
                if(this.formValidate[i])
                {
                    this.formData[i]=this.formValidate[i];
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
                 console.log(this.formData)
                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        this.saveMenu();
                       
                    } else {
                     
                         this.$emit('error','');
                    }
                })
            },
            /*
               保存
            */ 
            saveMenu(){
                //根据有无id判断是编辑还是添加
                let method=this.formData.id?'updateOrgDep':'createOrgDep';
                this.$api[method](this.formData).then(res=>{
                    if(res.respCode==0||res.result==0)
                    {
                        this.$Message.success('保存成功');
                        this.$emit('finish','');
                    }
                    else{
                        this.$emit('error','');
                        this.$Message.error(res.resultMessage?res.resultMessage:res.message);
                    }
                }) .catch(error => {
                      this.$emit('error','');
                })
            },
            handleReset () {
                this.$refs.formData.resetFields();
            },
           


        }
    }
</script>