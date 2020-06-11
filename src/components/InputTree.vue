/*
 * @Author: 于学文 
 * @Date: 2019-06-20 17:32:15 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-20 21:57:45
 */
<template>
    <div>
          <Poptip :title="title"  :placement="placement">
             
               <Input v-model="checkTitle" :placeholder="placeholder"></Input>
               <template  slot="content">
                  <div>
                       <Tree :data="data" 
                        :ref='refName'
                        :show-checkbox='showCheck'
                        @on-select-change='select'
                        @on-check-change='check'
                        @on-toggle-expand='toggle'
                        >
                        </Tree>
                  </div>
              </template>
        </Poptip>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
import { Stream } from 'stream';


    export default {
        props:{
            model:{
                 type:String||Number,
                 default:''
                
            },
            value:{
                  type:String||Number||Array,
                  default:''
            },
            title:{
                type:String,
                default:''
            },
            placement:{
                type:String,
                default:'bottom'
            },
            placeholder:{
                  type:String,
                  default:''
            },
            data:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            showCheck:{
                type:Boolean,
                default:false
            },
            refName:{
                 type:String,
                 default:'treeRef'
            },
            id:{
                type:String,
                default:'id'
            },
            parentId:{
                type:String,
                default:'parentId'
            },
        },
        data() {
            return {
               checkTitle:this.model,
               checkValue:this.value,
            }
        },
        created: function () {
            this.setCheck(this.data,this.value)
           

        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {

            setCheck(data,id)
            {
                  for(let item of data)
                  {
                    
                      item.title=item.deptName;
                      
                      if(item.id==id)
                      {
                          this.model=item.title;
                          alert(this.model)
                          item.check=true;
                      }
                   
                      if(item.children)
                      {
                          this.setMenuCheck(item.children,this.formValidate.parentId)
                      }
                  }
            },

            //多项选中
            check(data){
               
                this.$emit('on-check-change',data);

            },
            //单选
            select(data){
                                   
                  this.checkTitle=data[0].title;
                  this.checkValue=data[0].id;
                  this.$emit('update:model',data[0].title)
                  this.$emit('update:value',data[0][this.id])
                  this.$emit('on-select-change',data);

            },
            toggle(data){
                  this.$emit('on-toggle-expand',data);

            }

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

