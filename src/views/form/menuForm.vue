<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
         <FormItem label="父级菜单" prop="parentId">
         <!-- <Poptip title="菜单"  placement="bottom">
             
              
              <Input v-model="parentMenuName" placeholder="选择父级菜单"></Input>
              <template  slot="content">
                  <div>
                       <Tree :data="menuList" @on-select-change='chooseMenu'></Tree>
                  </div>
              </template>
        </Poptip> -->
          <treeSelect :treeData='menuData'   
                      :modelData.sync='parentId'>
         </treeSelect>
        </FormItem>
        <FormItem label="编号" prop="menuNo">
            <Input    v-model="formValidate.menuNo" placeholder="请输入菜单编号"></Input>
        </FormItem>
        <FormItem label="名称" prop="menuName">
            <Input v-model="formValidate.menuName" placeholder="请输入菜单名称"></Input>
        </FormItem>
          <FormItem label="路径" prop="url">
            <Input v-model="formValidate.url" placeholder="请输入路径"></Input>
        </FormItem>
         <FormItem label="图标" prop="img">
            <Input v-model="formValidate.img" placeholder="请输入路径"></Input>
        </FormItem>
         <FormItem label="是否隐藏" prop="otherInfo1">
               <i-switch v-model='formValidate.otherInfo1' true-value='1'  false-value='0'>
                 <span slot="open" >是</span>
                 <span slot="close">否</span>
              </i-switch>
         </FormItem>
          <FormItem label="类型" prop="type">
           <RadioGroup v-model="formValidate.type">
                <Radio :label="0" >菜单</Radio>
                <Radio :label="1">按钮</Radio>
            </RadioGroup>
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
                        menuName: '',
                        menuNo: '',
                        type: 0,
                        url:'',
                        img:'',
                        otherInfo1:0,
                        parentId:0
                    }
                }
            },
            menuList:{
                type:Array,
                default:()=>{
                    return [
                        
                    ]
                }
            },
           
        },
        data () {
            return {
                parentId:0,//因为接口需要为顶级时候parentId 为null，
                            //但是组件传空报错,所以在提交时候讲parentId 赋值给formValidate的parentId
                menuData:[
                     {
                         title:'顶级菜单',
                         id:0,
                         children:this.menuList
                     }
                ],
                ruleValidate: {
                    // parentId: [
                    //       this.$util.rules.required(),
                    // ],
                    menuNo: [
                          this.$util.rules.required(),
                    ],
                    menuName: [
                         this.$util.rules.required(),
                    ],
                   
                }
            }
        },
        created:function(){
              this.parentId=this.formValidate.parentId?this.formValidate.parentId:0;
            
        
        },
        mounted(){
           
        },
        methods: {
            
          
             /*
               提交
            */ 
            handleSubmit () {
                this.$refs.formValidate.validate((valid) => {
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
            
                let method=this.formValidate.id?'updateMenu':'createMenu';
                this.formValidate.systemType=0;
                this.formValidate.parentId=this.parentId?this.parentId:null;
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