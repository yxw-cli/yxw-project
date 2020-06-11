/*
 * @Author: 于学文 
 * @Date: 2019-07-15 13:40:39 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-07-15 16:30:10
 */

<style lang="less">
     
     .primary-table{
          
      .ivu-table-body .ivu-tooltip .content{
         display: inline-block;
         width: 100%;
         overflow: hidden;
         white-space: nowrap;
         margin-top: 7px;
         text-overflow: ellipsis

     }
      .bottom-page{
         display: -webkit-flex;
         display: flex;
         margin-top: 10px;
         justify-content: flex-end
     }
     .ivu-tooltip-inner{
         white-space:normal;
         z-index: 1000;
         height:auto;
         white-space: normal !important;
     }

     }
      
    
</style>
<template>
    <div class="primary-table">
    <Table border 
        :columns="tableColumns" 
        :ref="tableRef"
        :data="tableData"
        :stripe="stripe"
        :show-header="showHeader"
        :width="width"
        :height="height"
        :loading="load"
        :disabled-hover="disabledHover"
        :highlight-row="highlightRow"
        :row-class-name="rowClassName"
        :size="size"
        :no-data-text="noDataText"
        :no-filtered-data-text="noFilteredDataText"
        @on-current-change="onCurrentChange"
        @on-select="onSelect"
        @on-select-cancel="onSelectCancel"
        @on-select-all="onSelectAll"
        @on-select-all-cancel="onSelectCancelAll"
        @on-selection-change="onSelectionChange"
        @on-sort-change="onSortChange"
        @on-filter-change="onFilterChange"
        @on-row-click="onRowClick"
        @on-row-dblclick="onRowDblclick"
        @on-expand="onExpand"
    >
         <template slot-scope="{ row,column }" slot="alarm">
            <Tooltip :content="row[column.key]" placement="bottom">
              <span class="content">{{ row[column.key] }}</span>
          </Tooltip>
           
        </template>
        <template slot-scope="{ row,column,index }" slot="action">
             <div style="display:inline;" v-if="column.btn">
                <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row,index)" v-if='column.btn.edit'>编辑</Button>
                <Button type="error" size="small" style="margin-right: 5px" @click="del(row,index)" v-if='column.btn.del'>删除</Button>
                <Button type="info" size="small" @click="check(row,index)" v-if='column.btn.check'>查看</Button>
             </div>
            
            <div v-for="item in column.selfBtn" style="display:inline;margin-left:5px">
                 <Button v-has="item.permission?item.permission:true" style="margin-right:5px" size="small" @click="handleSelfBtn(row,index,item)" v-if='item.type' :type='item.type'>{{getBtnName(item,row,index)}}</Button>
                 <Button v-has="item.permission?item.permission:true" style="margin-right:5px" size="small" @click="handleSelfBtn(row,index,item)" v-else>{{getBtnName(item,row,index)}}</Button>
            </div>
        </template>
    </Table>
       <div class="bottom-page" v-if="configure.page">
          <Page  :total="totals" 
                 :page-size='searchParams[configure.page.pageSize]?searchParams[configure.page.pageSize]:10'
                 :current='searchParams[configure.page.pageNo]?searchParams[configure.page.pageNo]:1'
                 :transfer='transfer'
                 :show-elevator='showElevator'
                 :show-sizer='showSizer'
                 show-total  
                 @on-change='changePage'
                 @on-page-size-change='changePageSize'
                 />
        </div> 
    </div>
</template>
<script>
   import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {

    configure:{
        type:Object,
        default:()=>{
            return{
              url:'',
              params:{
                  
              },
              page:{
                  page:1,
                  pageSize:10,
              },
              callback:(res)=>{
                  return res;
              },
              columns:[],
                
            }
        },
    },

    
  },
    data () {
        //注意miikin props传参 不要和 data中的 重名，例如mixin中已经存在loading 和 
          //total 此组件需要不需要从父组件传递这两个参数，可以修改mixin，也可以在本组件中避免重复命名
         return {
              searchParams:{},
              url:'',
              tableData:[],
              tableColumns:[],
              load:false,
              totals:false,
            }
        },
        created:function(){
            this.tableColumns=this.configure.columns;
            this.searchParams=this.configure.params?JSON.parse(JSON.stringify(this.configure.params)):{};
    
        },
        mounted(){
            
            this.searchData();
        },
        watch:{

        },
        methods: {
       
        

             refresh(){
                   this.searchParams=this.configure.params?JSON.parse(JSON.stringify(this.configure.params)):{};
                   this.tableColumns=this.configure.columns;
                   this.searchData();

             },

                //页码改变
              changePage(page)
              {
                 this.searchParams[this.configure.page.pageNo]=page;
                 this.searchData();
                 this.$emit('on-change',page)
                  
              },
              //切换每页条数时的回调，返回切换后的每页条数
              changePageSize(pageSize){
                
                 this.searchParams[this.configure.page.pageSize]=pageSize;
                 this.searchData();
                 this.$emit('on-page-size-change',pageSize);
              },

              searchData(){
                  this.load=true;
                 this.$api[this.configure.url](this.searchParams).then(res=>{
                        this.load=false;
                        let data=this.configure.callback(res);
                        this.tableData=data.list;
                        this.totals=data.total;
                 })
                 .catch(error => {
                     this.$Message.error(error)
                     this.load=false;
                 });
              },
            }
    }
</script>