/*
 * @Author: 于学文 
 * @Date: 2019-06-19 10:50:10 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-20 14:02:16
 */
<template>
    <div id="menu_index" class="only-content">
        <Button type="info" @click="addorgDep()">新建</Button>
        
        <tree-grid 
           :items='treeData' 
           :columns='treeColumns'
           :expanded='true'
           @on-edit='editorgDep'
           @on-del='delorgDep'
      ></tree-grid>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import orgForm from '../form/orgForm'


    export default {
        data() {
            return {
                  treeColumns: [
                //       {
                //        width:'60',
                //        align:'center',
                //        type: 'selection'
                // }, 
                 {
                    title: '组织部门编号',
                    key: 'deptNo'
                },
                {
                    title: '组织部门名称',
                    key: 'deptName',
                    align:'center',
                },
                 {
                    title: '组织部门类型',
                    key: 'typeDesc'
                }, {
                    title: '操作',
                    type: 'action',
                    align:'center',
                    actions: [
                        {
                        type: 'primary',
                        method:'on-edit',
                        text: '编辑'
                    },
                    {
                        type: 'error',
                        method:'on-del',
                        text: '删除'
                    }
                    ]
                }],
                 treeData: [],
                 //
                  typeObj:{
                       '0':'部门',
                       '1':'小组',
                       '2':'其他'
                  },
               
            }
        },
        created: function () {
            this.getOrgDepList();

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
             * 获得组织部门列表
             *  目前代码存在两种不同的返回值结构
             */
            getOrgDepList()
            {
                this.$api.getOrgDepList({systemType:0}).then(res=>{
                    if(res.respCode==0||res.result==0)
                    {
                        
                        this.treeData= this.getTreeOrgDept(res.data);
                        console.log(this.treeData)
                       

                    }
                    else{
                        this.$Message.error(res.message?res.message:res.resultMessage);
                    }

                })
            },
              /*
              生成树形组织结构(适用于 返回不是树形数据)
            */ 
            getTreeOrgDept(list,treeData,id)
            {
                let itemArr=[];
                let that=this;
                filter(itemArr,null)
                function get(array)
                {
                    for(let item of array)
                    {
                        filter(item,item.id)
                    }
                } 
                //遍历过滤
                function filter(tree,id){
                    
                    let array=list.filter(item=>{
                        //第一次递归 ：赋值为了新建和编辑时候tree插件使用title
                        if(id==null)
                        {
                             item.title=item.deptName;
                          
                             if(item.orgType)
                             {
                                  item.typeDesc=(that.typeObj[item.orgType])?(that.typeObj[item.orgType]):'';
                             }
                        }
                     
                         return item.parentId==id;
                    })
                    if(id==null||id==0)
                    {
                        itemArr=array;
                    }
                    else{
                        tree.children=array;
                    }
                    //依次遍历
                    if(array.length>0)
                    {
                         get(array)
                    }
                  
                }

                return itemArr;

            },
         
            /*
                弹窗
            */
            addorgDep(formData)
            {
            
                let props={},title='新建组织部门';
                props.depTreeData=this.treeData;
                if(formData)
                {
                    props.formValidate=formData;
                    title='编辑组织部门';
                }
                let self=this;
                  var params={
                      self:this,
                      title:title,
                      width:600,//默认600
                      props:props,
                      form:orgForm,//弹窗中的表单
                      success:(res)=>{
                          this.getOrgDepList();
                      },
                      cancel:()=>{
                    
                      }
                }
                this.$util.openModelForm(params);

            },
            /**
             * 
             * 编辑组织部门
             */
            editorgDep(row)
            {
                let {id,deptName,deptNo,orgType,parentId,parentName}=row;
                let params={
                    id:id,
                    deptNo:deptNo,
                    deptName:deptName,
                    orgType:orgType,
                    parentId:parentId,
                    parentName:parentName?parentName:'顶级部门'
                }
                this.addorgDep(params)
            },
            /**
             * 
             * 删除组织部门
             */
            delorgDep(row)
            {
                 this.$util.confirmDialog(this,"确认",'确认删除组织部门',self=>{
                     self.$api.delOrgDep({deptIds:[row.id],systemType:0}).then(res=>{
                         if(res.result==0||res.respCode==0)
                         {
                             self.$Message.success('删除成功');
                             self.getOrgDepList();

                         }
                         else{
                             self.$Message.error(res.resultMessage?res.resultMessage:res.message);
                         }
                     })
                     
                  })
            }

        },
        filters: {

        },
        components: {
            orgForm
         
        }
    }

</script>

<style lang='less'>
      #menu_index{

      }
</style>

