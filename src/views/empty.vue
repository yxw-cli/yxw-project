
<template>
    <div>
          组织管理
          
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        data() {
            return {
                depTreeData:[],
               
            }
        },
        created: function () {

        },
        mounted:function()
        {
            this.getOrgDepList();


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
                getOrgDepList()
            {
                this.$api.getOrgDepList({systemType:0}).then(res=>{
                    if(res.respCode==0||res.result==0)
                    {
                        this.depTreeData= this.getTreeOrgDept(res.data);
                        console.log( this.depTreeData)

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
                filter(itemArr,"")
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
                        if(!id)
                        {    
                             item.title=item.deptName;
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

        },
        filters: {

        },
        components: {
         
        }
    }

</script>

<style lang='less'>
      #menu_index{

      }
</style>

