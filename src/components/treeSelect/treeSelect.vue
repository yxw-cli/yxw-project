/*
 * @Author: 于学文 
 * @Date: 2019-06-21 08:49:32 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-21 13:17:59
   封装树形下拉插件 通过iview 中 tree和select结合使用
   
 */
<template>
    <div id="tree-select">
    <Select v-model="selectData" :multiple='multiple' style="width:200px" clearable
      @on-clear='handleClear'
      @on-change='handleChange'
    >  
        <Option style="display:none" v-for="item in list" :value="item.id" :key="item.id">{{ item.title }}</Option>

          <Tree :data="treeListData" 
                :ref='refName'
                 :check-strictly='true'
                 :show-checkbox='multiple'
                 @on-select-change='select'
                 @on-check-change='check'
              >
             </Tree>
        
    </Select>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import { setTimeout } from 'timers';
    export default {
        name:'treeSelect',
        props:{
            treeData:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            multiple:{
                 type:Boolean,
                 default:false,
            },
            refName:{
                type:String,
                default:'treeSelect'
            },
            modelData:{
             
                default:''
            },
            treeKey:{
                type:String,
                default:'id'
            },
        },
        data() {
            return {
                list:[],
                selectData:this.multiple?[]:'',
                checkedLength:0,
                cacheTreeData:'',
                treeListData:[]
               
            }
        },
        created: function () {
            this.init();
         

        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {
            treeData()
            {
                this.init();

            },
            modelData(){
           
                 this.selectData=this.modelData;

            },

        },
        methods: {
            init(){
              
                    this.selectData=this.modelData;
                    this.treeListData=this.treeData;//不在父组件传过来的data 修改，否则tree再改check状态时会报错误
                    this.cacheTreeData=JSON.stringify(this.treeListData);//缓存数据，否则在handelCHnage 方法报错和iview tree机制有关系
                    this.setDefaultSelect();
            },
            /*
              设置默认选中
            */
            setDefaultSelect()
            {
                if(this.selectData)
                {
                       let selectObj={};
                        if(this.multiple)
                        {
                            for(let item of this.selectData)
                            {
                                selectObj[item]=true;  
                            }
                        }
                        else{
                            selectObj[this.selectData]=true;
                            
                            
                        }
                     this.setSelected(this.treeListData,selectObj)

                }
                
             

               
            },

            /**
             *    设置选中工具方法 
             *     selectObj:{id:true} 
             *    selectObj 为{} 是clear
             */
        
             setSelected(data,selectObj){
               
                  
                   for(let item of data)
                  {
                    //   console.log(item.deptName)
                    //   console.log(item.id)
                    //   console.log('077c9acc018c4e8db9be4711dd5b9e18');
                    //   console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                      if(selectObj[item.id])
                      {
                          if(this.multiple)
                          {
                               item.checked=true;
                          }
                          else{
                               item.selected=true;

                          }
                         
                          this.list.push(item);
                      }
                      else{
                          
                          if(this.multiple)
                          {
                               delete item.checked
                          }
                          else{
                               item.selected=false;

                          }
                      }
                      //如果是单选并且已经遍历到，关闭递归
                      
                      if(!item.multiple&&item.selected)
                      {
                          break;
                      }
                      if(item.children)
                      {
                          this.setSelected(item.children,selectObj)
                      }
                  }

            },
            //单选
            select(data){
                this.list=data;
                this.selectData=data.length>0?data[0].id:'';
                 this.$emit('update:modelData',this.selectData)

            },
            //多选
            check(data)
            {
                this.list=data;
                this.selectData=[];

                for(let item of  data)
                {
                    this.selectData.push(item.id);
                    this.$emit('update:modelData',this.selectData)
                }
                //更新当前选中的条数
                this.checkedLength=data.length;
            },

            /**
             * 
             * 清空
             * 要将tree 数据进行递归修改
             */

            handleClear()
            {
                this.setSelected(this.treeListData,{})
                if(this.multiple)
                {
                    this.check([]);
                }
                else{
                    this.select([]);
                }
            },
            //处理多选时，删除选中某一项 将 tree 选中消掉

            handleChange(data){
              
                if(!this.multiple)
                {
                    return;
                }
                //如果是减少
                if(this.checkedLength>data.length)
                {
                   
                   this.list=[];
                    let checkObj={};
                    for(let item of data)
                    {
                        checkObj[item]=true;

                       
                    }
                     this.treeListData=JSON.parse(this.cacheTreeData);
                     this.setSelected(this.treeListData,checkObj);

                }
                else{
                    this.checkedLength=data.length;
                }
           
                
            },

        },
        filters: {

        },
        components: {
         
        }
    }

</script>

<style lang='less'>
     #tree-select{
         .ivu-select-dropdown{
             padding:10px;
         }
     }
   
</style>

