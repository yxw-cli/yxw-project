<template>
    <div id="org">
         
          <div  class="tree-area">
              <div class="item"   v-for='item in depTreeData' :key='item.id'>
                    <Tree :data="[item]" :render="renderContent" ></Tree>
                </div> 
          </div>
    </div>
   
  
</template>

<script>
import orgForm from '../form/orgForm'
    export default {
        data () {
            return {
                depTreeData: [
                  
                ],
                buttonProps: {
                    type: 'default',
                    size: 'small',
                }
            }
        },
        mounted(){
              this.getOrgDepList();
              let that=this;
              document.querySelector('#createOrg').onclick=function(){

                  that.addorgDep({parentId:null});
              
              };


        },
        methods: {
            renderContent (h, { root, node, data }) {
              let that=this;
    
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('div', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px',
                            width:'110px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-brush'
                            }),
                            style: {
                                marginRight: '8px',
                                float:'left'
                                
                            },
                            on: {
                                click: () => { this.editorgDep(data) }
                            }
                        }),
                      
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-remove'
                            }),
                            on: {
                                click: () => { this.delorgDep( data) }
                            }
                        }),
                          h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-add'
                            }),
                            style: {
                                marginRight: '8px',
                                display:this.judgeEmpty(data.parentId)?'inline-block':'none'
                            },
                            on: {
                                click: () => { this.append(data) }
                            }
                        }),
                    ])
                ]);
            },
            
          getOrgDepList()
            {
                this.$api.getOrgDepList({systemType:0}).then(res=>{
                    if(res.respCode==0||res.result==0)
                    {
                        this.depTreeData= this.getTreeOrgDept(res.data);
                    
                    }
                    else{
                        this.$Message.error(res.message?res.message:res.resultMessage);
                    }

                })
            },
              /*
                 生成树形组织结构(适用于 返回不是树形数据)
              */ 

           
          getTreeOrgDept(list,id)
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
                        if(that.judgeEmpty)
                        {    
                             item.title=item.deptName;
                             item.expand=true;
                          
                        }
                         return item.parentId==id;
                    })
                    if(id==null||id==0||id=='')
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

            judgeEmpty(data)
            {
                if(data=null||data==''||data==undefined)
                {
                    return true
                }
                return false;
            },

            append(data)
            {
                let formData={
                    deptName:"",
                    parentId:data.id?data.id:null,
                    deptNo:''
                }
                this.addorgDep(formData)

            },


                  /*
                弹窗
            */
            addorgDep(formData)
            {
                
                let props={},title='新建组织部门';
                props.depTreeData=this.treeData;
                if(formData.id)
                {
                  
                    title='编辑组织部门';
                }
                  props.formValidate=formData;
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
                    parentId:parentId,
                }
                this.addorgDep(params)
            },
            /**
             * 
             * 删除组织部门
             */
            delorgDep(row)
            {
                if(row.children.length>0)
                {
                      this.$Message.error({
                            content: '下级部门尚未清空，无法删除！',
                            duration: 10,
                            closable: true
                         });
                    return;
                }
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
         components: {
            orgForm
         
        }
    }
</script>
<style lang="less">
     #org{
          .header{
              width: 100%;
              line-height: 30px;
              margin-bottom: 10px;

          }
         .tree-area{
             display: -webkit-flex;
             display: flex;
             width:100%;
             justify-content: space-between;
             flex-direction: row;
            flex-wrap: wrap;
             .item{
                 width:50%;
             }
         }
     }
</style>
