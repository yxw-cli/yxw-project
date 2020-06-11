
/**
 * 公共方法
 */
export default {
    props:{
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
    tableRef:{
      type:String,
       default () {
          return new Date().getTime()+''
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
    rowKey: {
      type: Function,
      default () {
        return 'id'
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
       //是否分页（urlTable不同）
    isPage:{
       type: Boolean,
       default: true
    },
    //以下是page 分页的配置，如果有更多需要请自行添加（）
     total: {
      type: Number,
      default: 0
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
    data() {
     return {
      
     }
    },
    created() {
        
    },
    mounted() {},
    methods: {
       edit (row,index) {
         
           
            this.$emit('on-edit',row,index);
          
        },
        del (row,index) {
           this.$emit('on-del',row,index);
        },
        check(row,index)
        {
            this.$emit('on-check',row,index);
        },
        handleSelfBtn(row,index,item)
        {
           this.$emit(item.method,row,index);
        },
        getBtnName(item,row,index)
        {
    
          if((item.name) instanceof Array)
          {
              let btnName='';
              for(let one of item.name){
                   
                    if(row[one.param]==one.value)
                    {
                        btnName=one.name;
                    }

              }
              return btnName;

          }
          else{
            return item.name
          }
        },
         
           exportCsv (params) {
              this.$refs[this.tableRef].exportCsv(params)
           },
            clearCurrentRow () {
              this.$refs[this.tableRef].clearCurrentRow()
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
            //手动设置全选和取消全选
             handleSelectAll (status) {
                this.$refs[this.tableRef].selectAll(status);
             },
             //清空单选
             handleClearCurrentRow () {
                 this.$refs[this.tableRef].clearCurrentRow();
             },
            onSelectAll (selection) {
              this.$emit('on-select-all', selection)
            },
             onSelectCancelAll (selection) {
              this.$emit('on-select-all-cancel', selection)
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
            ,
            onColumnWidthResize (row, status) {
                this.$emit('on-column-width-resize', row, status)
            }
           

    }
   }