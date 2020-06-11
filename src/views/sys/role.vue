/*
 * @Author: 于学文 
 * @Date: 2019-06-20 13:23:50 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-24 14:29:58
 */
<template>
    <div id="menu_index" class="only-content">
          <Button v-has='"role:add"' type="info" @click="addRole()" style="margin-botttom:10px">新建</Button>
          <Row type='flex' :gutter="24">
              <Col :span="left" >
                <div>
                    <primaryTable 
                     :columns="columns" :data="tableList"
                     :total='total'
                     :pageSize='params.pageSize'
                     ref='primaryTable'
                     @on-edit='editRole'
                     @on-del='delRole'
                     @on-set='setPermission'
                    >
                 </primaryTable>
                </div>
                
              </Col>
              <Col :span="right" style="border-left:1px solid #d9d9d9" v-if="right>0">
                  <Card dis-hover>
                     <div slot="title" class="right-title">
                          <p> 权限设置： {{roleName}}</p>
                          <Icon type="ios-backspace-outline" @click="close"/>
                     </div>
                     <p>
                         菜单列表:
                     </p>
                     <Tree :data="treeMenuData"    :check-strictly='true' show-checkbox ref='treeMenu'></Tree>
                     <Button type='primary' style='margin-right:5px' size='small' @click='savePermission'>保存</Button>
                     <Button type='info' size='small'>取消</Button>
                 </Card>
               
             </Col>
          </Row>
         
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import roleForm from '../form/roleForm'

    export default {
        data() {
            return {
                params:{
                    pageSize:10,
                    systemType:0,
                    page:1

                },
                left:24,//左侧表格比例
                right:0,
                treeMenuData:[],
                roleName:'',
                roleId:'',
                tableList:[],
                total:0,
                columns:[
                     {
                        title: '角色名称',
                        key: 'roleName',
                        slot:"alarm"//添加可实现表格edit
                    },
                    {
                        title: '备注',
                        slot:"alarm",
                        key: 'remark'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 250,
                        align: 'center',
                        selfBtn:[
                                {name:"编辑",method:"on-edit",type:"primary",permission:'role:edit'},
                                {name:"删除",method:"on-del",type:"error",permission:'role:delete'},
                                {name:"权限设置",method:"on-set",type:"info"},
                            ]
                    }
                ],
               
            }
        },
        created: function () {
            this.getRoleList();

        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
          /*  
             获得列表
          
           */
            getRoleList()
            {
                this.$api.getRoleList(this.params).then(res=>{
                  
                  if(res.respCode==0||(res.result)-0==0)
                    {
                       this.total=res.data.count;
                        this.tableList=res.data.list;
                    }
                    else{
                        this.$Message.error(res.message);
                    }


                })
            },

            //新增
            addRole(formData)
            {
                let props={},title='新建角色';
                props.menuList=this.treeData;
                if(formData)
                {
                    props.formValidate=formData;
                    title='编辑角色';
                }
                let self=this;
                  var params={
                      self:this,
                      title:title,
                      width:600,//默认600
                      props:props,
                      form:roleForm,//弹窗中的表单
                      success:(res)=>{
                          this.getRoleList();
                      },
                      cancel:()=>{
                      }
                }
                this.$util.openModelForm(params);


            },
            //编辑
            editRole(row)
            {
                let {roleName,id,remark}=row;
                let params={
                    roleName:roleName,
                    id:id,
                    remark:remark
                }
                this.addRole(params)

            },
            //删除
            delRole(row)
            {
                 this.$util.confirmDialog(this,"确认",`确认删除角色：${row.roleName}`,self=>{
                     self.$api.delRole({roleIds:[row.id],systemType:0}).then(res=>{
                         if(res.result==0)
                         {
                             self.$Message.success('删除成功');
                             self.getMenuList();

                         }
                         else{
                             self.$Message.error(res.message);
                         }
                     })
                     
                  })
                  

            },
            // 设置权限
            setPermission(row)
            {
                this.left=16;
                this.right=8;
                this.roleName=row.roleName;
              
                this.roleId=row.id;
                this.getRoleMenu();
              
            },
            /* 保存权限
             */
            savePermission(){
                 
                  let menu=this.$refs.treeMenu.getCheckedAndIndeterminateNodes();
                  if(menu.length==0)
                  {
                      this.$Message.error('请选择菜单！');
                      return;
                  }
                  let params={
                      authIds:[],
                      roleId:this.roleId,
                      systemType:0
                  };
                  for(let item of menu)
                  {
                      params.authIds.push(item.id);

                  }
                   this.$util.confirmDialog(this,'确认','确认添加角色权限',self=>{
                     self.$api.setAuthsForRole(params).then(res=>{
                         if(res.result==0||res.respCode==0)
                         {
                             self.$Message.success('保存成功');
                             self.close();

                         }
                         else{
                             self.$Message.error(res.resultMessage?res.resultMessage:res.message);
                         }
                     })
                     
                  })
                  console.log(menu)
                  

            },
            close()
            {
                this.left=24;
                this.right=0;
                this.roleName='';

            },
           
           getRoleMenu()
           {
               this.$api.queryAuthsByRole({roleId:this.roleId,systemType:0}).then(res=>{
                   if(res.respCode==0||res.result==0)
                   {
                       let roleMenuId={};
                       for(let item of res.data)
                       {
                           roleMenuId[item.id+'']=true;

                       }
                       
                       console.log(roleMenuId)

                       this.getMenuList(roleMenuId);



                   }
                   else{
                       this.$Message.error(res.message);
                   }
               })
           },

         getMenuList(roleMenuId)
            {
                this.$api.getMenuList({systemType:0}).then(res=>{
                      if(res.respCode==0||(res.result)-0==0)
                    {
                        this.handleMenuList(res.data,roleMenuId);
                        this.treeMenuData=res.data;

                      

                    }
                    else{
                        this.$Message.error(res.message);
                    }

                })
            },

              //如果返回的事树形数据
             handleMenuList(data,roleMenuId)
            {
             
                  for(let item of data)
                  {
                    
                      item.title=item.menuName;
                      item.typeName=item.type==0?"菜单":'按钮'
                      item.expand=true;
                      if(roleMenuId[item.id+''])
                      {
                          item.checked=true;
                      }
                      else{
                          item.checked=false;
                      }
                      if(item.children)
                      {
                          this.handleMenuList(item.children,roleMenuId)
                      }
                  }
            },

        },
        filters: {

        },
        components: {
            roleForm
        }
    }

</script>

<style lang='less'>
      #menu_index{
          .ivu-col{
                transition: width 0.5s;
                -moz-transition: width 0.5s;; /* Firefox 4 */
                -webkit-transition: width 0.5s;; /* Safari 和 Chrome */
                -o-transition: width 0.5s;; /* Opera */
          }
          .right-title{
              display: -webkit-flex;
              display: flex;
              justify-content: space-around;
              .ivu-card{
                  width:100%;
                  overflow: hidden;
              }
              i{
                  font-size: 18px;
                  cursor: pointer;
                  &:hover{
                      color: #2d8cf0;
                  }
              }
              p{}
          }

      }
</style>

