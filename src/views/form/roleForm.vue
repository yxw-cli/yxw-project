<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="角色名称" prop="roleName">
            <Input    v-model="formValidate.roleName" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
            <Input v-model="formValidate.remark" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
</template>
<script>
    export default {
        props:{
            formValidate:{
                type:Object,
                default:()=>{
                    return {
                        roleName: '',
                        remark: '',
                    }
                }
            },
           
        },
        data () {
            return {
                
                ruleValidate: {

                    roleName: [
                          this.$util.rules.required(),
                    ],
                }
            }
        },
        created:function(){
            
           console.log(this.formValidate)


        
        },
        mounted(){
           
        },
        methods: {
            chooseMenu(data)
            {
                 this.formValidate.parentId=data[0].id;
                 this.parentMenuName=data[0].title;
                
            },
             /*
               提交
            */ 
            handleSubmit () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.saveRole();
                       
                    } else {
                     
                         this.$emit('error','');
                    }
                })
            },
            /*
               保存
            */ 
            saveRole(){

                //根据有无id判断是编辑还是添加
                let method=this.formValidate.id?'updateRole':'createRole';
                this.formValidate.systemType=0;
                console.log(JSON.stringify(this.formValidate))
                this.$api[method](this.formValidate).then(res=>{
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
                this.$refs.formValidate.resetFields();
            },
           


        }
    }
</script>