/*
 * @Author: 于学文 
 * @Date: 2019-04-08 09:40:39 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-07-15 17:29:28
 */

<style lang="less">
    .ivu-table-body .ivu-tooltip{
        display: inline-block;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis

    }
    .bottom-page{
        display: -webkit-flex;
        display: flex;
        margin-top: 10px;
        justify-content: flex-end
    }
    .ivu-tooltip-inner{

        max-width: max-content;
        white-space:normal;
        z-index: 1000

    }
</style>
<template>
    <div>
        <Button @click="addData()" v-if='add'>+新建</Button>
        <Table border
               :columns="columns"
               ref="tablesMain"
               :data="tableData"
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
               @on-current-change="onCurrentChange"
               @on-select="onSelect"
               @on-select-cancel="onSelectCancel"
               @on-select-all="onSelectAll"
               @on-selection-change="onSelectionChange"
               @on-sort-change="onSortChange"
               @on-filter-change="onFilterChange"
               @on-row-click="onRowClick"
               @on-row-dblclick="onRowDblclick"
               @on-expand="onExpand"
        >
            <template slot-scope="{ row,column,index }" slot="edit">
                <Input type="text" v-model="editRowData[column.key]" v-if="editIndex === index" />
                <Tooltip v-else :content="row[column.key]" placement="bottom">
                    <span>{{ row[column.key] }}</span>
                </Tooltip>
            </template>
             <template slot-scope="{ row,column,index }" slot="select">
                 <Select   v-if="editIndex === index&&column.keyValue" v-model="editRowData[column.keyValue]" @on-change='changeSelect(row,column,index)'>
                    <Option v-for="item in column['selectData']" :value="item[column.selectKey?column.selectKey:'id']" 
                    :key="item[column.selectKey?column.selectKey:'id']">{{ item[column.selectLabel?column.selectLabel:'label'] }}</Option>
                </Select>
                  <Select   v-else-if="editIndex === index" v-model="editRowData[column.key]" @on-change='changeSelect(row,column,index)'>
                    <Option v-for="item in column['selectData']" :value="item" 
                     :key="item">{{ item }}</Option>
                 </Select>
                <Tooltip v-else :content="row[column.key]" placement="bottom">
                    <span>{{ row[column.key] }}</span>
                </Tooltip>
            </template>
            <template slot-scope="{ row,column,index }" slot="action">
                <div style="display:inline;" v-if="column.btn&&editIndex!=index">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row,index)" v-if='column.btn.edit'>编辑</Button>
                    <Button type="error" size="small" style="margin-right: 5px" @click="del(row,index)" v-if='column.btn.del'>删除</Button>
                    <Button type="info" size="small" @click="check(row,index)" v-if='column.btn.check'>查看</Button>
                </div>
                <Button type="info" size="small" style="margin-right: 5px"  @click="save(row,index)" v-if='editIndex==index'>保存</Button>
                <Button type="warning" size="small" @click="cancel(row,index)" v-if='editIndex==index'>取·消</Button>
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

    //普通表格插件（自定义btn,悬浮提示，表格问题过多不换行使用是略号）
    export default {
        props: {
            data: {
                type: Array,
                default () {
                    return []
                }
            },
            columns: {
                type: Array,
                default () {
                    return []
                }
            },
            size: String,
            width: {
                type: [Number, String]
            },
            height: {
                type: [Number, String]
            },
            stripe: {
                type: Boolean,
                default: false
            },
            border: {
                type: Boolean,
                default: false
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            highlightRow: {
                type: Boolean,
                default: false
            },
            rowClassName: {
                type: Function,
                default () {
                    return ''
                }
            },
            context: {
                type: Object
            },
            noDataText: {
                type: String
            },
            noFilteredDataText: {
                type: String
            },
            disabledHover: {
                type: Boolean
            },
            loading: {
                type: Boolean,
                default: false
            },
            //是否分页
            isPage:{
                type: Boolean,
                default: true
            },
            //是否显示新建
             add:{
                type: Boolean,
                default: false
            },
           pageSize: {
              type: Number,
               default: 10
            },
            current: {
              type: Number,
              default: 1
            },
            transfer:{
              type: Boolean,
               default: false
            },
            showElevator:{
              type: Boolean,
              default: false
            },
            showSizer:{
                type: Boolean,
                default: false
            },
         


        },
        data () {
            return {
                editIndex: -1,
                editRowData:{},
                saveEditData:{},
                tableData:[],
                isAdd:false,
            }
        },
        created:function(){
            this.tableData=JSON.parse(JSON.stringify(this.data));

        },
        watch:{
            data(){
             
               this.tableData=JSON.parse(JSON.stringify(this.data));

            },
        },
        methods: {
            /**
             * 编辑
             */
            edit (row,index) {
                this.editIndex=index;
                this.editRowData=row;
                this.isAdd=false;
                this.saveEditData=JSON.parse(JSON.stringify(row));
            },
            /**
             * 删除
             */
            del (row,index) {
                this.$emit('on-del',row,index);
            },
        
            check(row,index)
            {
                this.$emit('on-check',row,index);

            },
            save(row,index){
                this.editIndex=-1;
                this.$emit('on-save',row,index,this.isAdd);

            },
               addData(){
                let row={};
                 for(let i in this.tableData[0])
                 {
                      row[i]=''
                 }
              
                this.tableData.push( row);
                  this.editRowData=row;
                this.editIndex=this.tableData.length-1;
                this.isAdd=true;
          
            },

            handleSelfBtn(row,index,item)
            {

                this.$emit(item.method,row,index);

            },

            //页码改变
            changePage(page)
            {
                this.$emit('on-change',page)

            },
             //切换每页条数时的回调，返回切换后的每页条数
            changePageSize(pageSize){

                 this.$emit('update:pageSize',pageSize);
                 this.$emit('on-page-size-change',pageSize);

              },
            cancel()
            {
                if(this.isAdd)
                {
                    this.tableData.splice(  this.tableData.length-1,1)
                }
                else{
                     this.$set(this.tableData,this.editIndex,this.saveEditData)
                }
                this.editIndex=-1;
                this.editRowData={};

            },
            /**
             * 下拉列表
             */
            changeSelect(row,column,index){
                
                /**
                 * 如果是对象数组的 
                 * 
                 */
                
                if(column.keyValue)
                {
                    for(let item of column.selectData )
                    {
                        if(row[column.keyValue]==item[column.selectKey?column.selectKey:'id'])
                        {
                            row[column.key]=item[column.selectLabel?column.selectLabel:'label']
                        }

                    }

                }
                this.$emit('on-select-change',row,column,index);
              
            },
            exportCsv (params) {
                this.$refs.tablesMain.exportCsv(params)
            },
            clearCurrentRow () {
                this.$refs.talbesMain.clearCurrentRow()
            },
            onCurrentChange (currentRow, oldCurrentRow) {
                this.$emit('on-current-change', currentRow, oldCurrentRow)
            },
            onSelect (selection, row) {
                this.$emit('on-select', selection, row)
            },
            onSelectCancel (selection, row) {
                this.$emit('on-select-cancel', selection, row)
            },
            onSelectAll (selection) {
                this.$emit('on-select-all', selection)
            },
            onSelectionChange (selection) {
                this.$emit('on-selection-change', selection)
            },
            onSortChange (data) {
              
                  this.$emit('on-sort-change', data)
                },
            onFilterChange (row) {
                this.$emit('on-filter-change', row)
            },
            onRowClick (row, index) {
                this.$emit('on-row-click', row, index)
            },
            onRowDblclick (row, index) {
                this.$emit('on-row-dblclick', row, index)
            },
            onExpand (row, status) {
                this.$emit('on-expand', row, status)
            }
        }
    }
</script>
