/*
 * @Author: 于学文 
 * @Date: 2019-06-20 13:23:43 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-24 13:33:37
 */
<template>
    <div id="menu_index" class="only-content">
        <Button type="info" @click="addMenu()" >新建</Button>
        <tree-grid 
           :items='treeData' 
           :columns='treeColumns'
           :expanded='true'
           @on-edit='editMenu'
           @on-del='delMenu'
      ></tree-grid>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import menuForm from '../form/menuForm'
    import { constants } from 'crypto';
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
                    title: '菜单编号',
                    key: 'menuNo'
                },
                {
                    title: '菜单名称',
                    key: 'menuName',
                    align:'center',
                }, {
                    title: '地址',
                    key: 'url'
                }, {
                    title: '菜单类型',
                    key: 'typeName'
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
                treeData: []
               
            }
        },
        created: function () {
            this.getMenuList();

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
             * 获得菜单列表
             */
            getMenuList()
            {
                this.$api.getMenuList({systemType:0}).then(res=>{
                      if(res.respCode==0||(res.result)-0==0)
                    {
                        this.handleMenuList(res.data);
                        this.treeData=res.data;

                    }
                    else{
                        this.$Message.error(res.message);
                    }
                })
            },
            /*
              生成树形菜单(适用于 返回不是树形数据)
            */ 
            getTreeMenu(list,treeData,id)
            {
                let itemArr=[]
                filter(itemArr,null)
                function get(array)
                {
                    for(let item of array)
                    {
                        filter(item,item.id)
                    }
                } 
                function filter(tree,id){
                    
                    let array=list.filter(item=>{
                      
                         return item.parentId==id;
                    })
                    if(id==null||id==0)
                    {
                        itemArr=array;
                    }
                    else{
                        tree.children=array;
                    }
                    if(array.length>0)
                    {
                         get(array)
                    }
                  
                }
                return itemArr;

            },
            //如果返回的事树形数据
             handleMenuList(data)
            {
                  for(let item of data)
                  {
                    
                      item.title=item.menuName;
                      item.typeName=item.type==0?"菜单":'按钮'
                      if(item.children)
                      {
                          this.handleMenuList(item.children)
                      }
                  }
            },
            /*
                弹窗
            */
            addMenu(formData)
            {
            
                let props={},title='新建菜单';
                props.menuList=this.treeData;
                if(formData)
                {
                    props.formValidate=formData;
                    title='编辑菜单';
                }
                let self=this;
                  var params={
                      self:this,
                      title:title,
                      width:600,//默认600
                      props:props,
                      form:menuForm,//弹窗中的表单
                      success:(res)=>{
                          this.getMenuList();
                      },
                      cancel:()=>{
                    
                      }
                }
                this.$util.openModelForm(params);

            },
            /**
             * 
             * 编辑菜单
             */
            editMenu(row)
            {
                let {id,menuName,menuNo,children,url,type,parentId,otherInfo1}=row;
                let params={
                    id:id,
                    menuName:menuName,
                    menuNo:menuNo+'',
                    url:url,
                    children:children,
                    type:type-0,
                    parentId:parentId,
                    otherInfo1:otherInfo1//备用字段用于做是否是在左侧菜单栏显示
                }
                this.addMenu(params)

            },
            /**
             * 
             * 删除菜单
             */
            delMenu(row)
            {
                 this.$util.confirmDialog(this,"确认",'确认删除菜单',self=>{
                     self.$api.delMenu({ids:[row.id],systemType:0}).then(res=>{
                         if(res.respCode==0||(res.result)-0==0)
                         {
                             self.$Message.success('删除成功');
                             self.getMenuList();

                         }
                         else{
                             self.$Message.error(res.message);
                         }
                     })
                     
                  })
            }

        },
        filters: {

        },
        components: {
            menuForm
         
        }
    }

</script>

<style lang='less'>
      #menu_index{

      }
</style>

