/*
 * @Author: 于学文 
 * @Date: 2019-04-08 09:40:39 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-07-15 16:11:39
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
        :columns="columns" 
        :ref="tableRef"
        :data="data"
        :stripe="stripe"
        :show-header="showHeader"
        :width="width"
        :height="height"
        :loading="loading"
        :disabled-hover="disabledHover"
        :highlight-row="highlightRow"
        :row-class-name="rowClassName"
        :size="size"
        :no-data-text="noDataText"
        :no-filtered-data-text="noFilteredDataText"
        :tooltip='tooltip'
        :indentSize='indentSize'
        :row-key='rowKey'
        :resizable='resizable'
        :draggable='draggable'
        :tooltip-theme='tooltipTheme'
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
       <div class="bottom-page" v-if="isPage">
          <Page  :total="total" 
                 :page-size='pageSize'
                 :current='current'
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
 //普通表格插件（自定义btn,悬浮提示，表格问题过多不换行使用是略号）
    export default {
      mixins: [mixin],
      props: {
    
        
      },
        data () {
            return {
              searchParams:{},
              url:'',
            }
        },
        created:function(){
        
    
        },
        methods: {
                //页码改变
              changePage(page)
              {
                 this.$emit('update:current',page);
                 this.$emit('on-change',page)
                  
              },
              //切换每页条数时的回调，返回切换后的每页条数
              changePageSize(pageSize){
                 this.$emit('update:pageSize',pageSize);
                 this.$emit('on-page-size-change',pageSize);
              },

          
             
            }
    }
</script>