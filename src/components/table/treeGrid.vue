<!--
 
 * 
 * @events  @on-row-click 单击行或者单击操作按钮方法
            @on-selection-change  多选模式下 选中项变化时触发
            @on-sort-change  排序时有效，当点击排序时触发
   @props   items 显示的结构化数据
            columns 表格列的配置描述 sortable:true 开启排序功能 
            type: 'selection'为多选功能 type: 'action' 为操作功能 actions:[{}] 操作按钮
 -->
<template>
    <div :style="{width:tableWidth}" class='autoTbale'>
        <table class="table table-bordered" id='hl-tree-table'>
            <thead>
                <tr>
                    <th v-for="(column,index) in cloneColumns" :style="{'text-align':column.align?column.align:'left'}">
                        <label v-if="column.type === 'selection'">
                            <Checkbox  v-model="checks" @on-change="handleCheckAll"></Checkbox>
                        </label>
                       
                        <label v-else>
                            {{ renderHeader(column, index) }}
                            <span class="ivu-table-sort" v-if="column.sortable">
                                <Icon type="ios-arrow-up" :class="{on: column._sortType === 'asc'}" @click.native="handleSort(index, 'asc')" />
                                <Icon type="ios-arrow-down" :class="{on: column._sortType === 'desc'}" @click.native="handleSort(index, 'desc')" />
                            </span>
                        </label>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in initItems" :key="item.id" v-show="show(item)" :class="{'child-tr':item.parent}">
                    <td v-for="(column,snum) in columns" :key="column.key" :style=tdStyle(column)>
                        <label v-if="column.type === 'selection'">
                            <Checkbox  v-model="item.isChecked" @on-change="handleCheckClick(item,$event,index)"></Checkbox>
                        </label>
                        <div v-else-if="column.type === 'action'">
                            <i-button v-has='item.permission?item.permission:true' :type="action.type" size="small" @click="RowClick(item,$event,index,action.method)" v-for='action in (column.actions)' :key="action.text">{{action.text}}</i-button>
                        </div>
                        <label @click="toggle(index,item)" v-else>
                            <span v-if='snum==iconRow()'>
                                <i v-html='item.spaceHtml'></i>
                                <i v-if="item.children&&item.children.length>0" class="ivu-icon" :class="{'ivu-icon-ios-arrow-down':!item.expanded,'ivu-icon-ios-arrow-up':item.expanded }"></i>
                                <i v-else class="ms-tree-space"></i>
                            </span> 
                            {{renderBody(item,column,index) }}
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { constants } from 'crypto';
import { debug } from 'util';
export default {
    name: 'treeGrid',
    props: {
        columns: Array,
        items: {
            type: Array,
            default: function() {
                return [];
            }
        },
        expanded:{
            type:Boolean,
            default:false,

        },
    },
    data() {
        return {
            initItems: [], //处理后数据数组
            cloneColumns: [], //处理后的表头数据
            checkGroup: [], //复选框数组
            checks: false, //全选
            screenWidth: document.body.clientWidth, //自适应宽
            tdsWidth: 0, //td总宽
            timer: false, //控制监听时长
            dataLength: 0, //树形数据长度
            i:0,
            tableData:[],
        }
    },
    computed: {
        tableWidth() {
            return this.tdsWidth > this.screenWidth && this.screenWidth > 0 ? this.screenWidth + 'px' : '100%'
        }
    },
    watch: {
        screenWidth(val) {
            if (!this.timer) {
                this.screenWidth = val
                this.timer = true
                setTimeout(() => {
                    this.timer = false
                }, 400)
            }
        },
        items() {
            if (this.items) {
                this.tableData=this.items;
                this.dataLength = this.Length(this.tableData)
                this.initItems=[];
                this.initData(this.deepCopy(this.tableData), 1, null);
               
                this.checkGroup = this.renderCheck(this.tableData)
                if (this.checkGroup.length == this.dataLength) {
                    this.checks = true
                } else {
                    this.checks = false
                }
            }
        },
        columns: {
            handler() {
                this.cloneColumns = this.makeColumns();
            },
            deep: true
        },
        checkGroup(data) {
            this.checkAllGroupChange(data)
        },
    },
    mounted() {
        if (this.items) {
            this.tableData=this.items;
            this.dataLength = this.Length(this.tableData)
            this.initData(this.deepCopy(this.tableData), 1, null);
            this.cloneColumns = this.makeColumns();
            this.checkGroup = this.renderCheck(this.tableData)
            if (this.checkGroup.length == this.dataLength) {
                this.checks = true
            } else {
                this.checks = false
            }
        }
        // 绑定onresize事件 监听屏幕变化设置宽
        this.$nextTick(() => {
            this.screenWidth = document.body.clientWidth
        })
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                this.screenWidth = window.screenWidth
            })()
        }
    },
    methods: {
      // 有无多选框折叠位置优化
      iconRow() {
        for (var i = 0, len = this.columns.length; i < len; i++) {
          if (this.columns[i].type == 'selection') {
            return 1
          }
        }
        return 0
      },
        // 设置td宽度,td的align
        tdStyle(column) {
            var style = {}
            if (column.align) {
                style["text-align"] = column.align;
            }
            if (column.width) {
                style["min-width"] = column.width + 'px';
            }
            return style;
        },

        // 排序事件
        handleSort(index, type) {
            this.cloneColumns.forEach((col) => col._sortType = 'normal');
            if (this.cloneColumns[index]._sortType === type) {
                this.cloneColumns[index]._sortType = 'normal'
            } else {
                this.cloneColumns[index]._sortType = type
            }
            this.$emit('on-sort-change', this.cloneColumns[index]['key'], this.cloneColumns[index]['_sortType'])
        },
        // 点击某一行事件
        RowClick(data, event, index, method) {
            
            let result = this.makeData(data);
            this.$emit(method, result, event, index)
        },
        // 点击事件 返回数据处理
        makeData(data) {
            const t = this.type(data);
            let o;
            if (t === 'array') {
                o = [];
            } else if (t === 'object') {
                o = {};
            } else {
                return data;
            }

            if (t === 'array') {
                for (let i = 0; i < data.length; i++) {
                    o.push(this.makeData(data[i]));
                }
            } else if (t === 'object') {
                for (let i in data) {
                    if (i != 'spaceHtml' && i != 'parent' && i != 'level' && i != 'expanded' && i != 'isShow' && i !=
                        'load') {
                        o[i] = this.makeData(data[i]);
                    }
                }
            }
            return o;
        },
        // 处理表头数据
        makeColumns() {
            let columns = this.deepCopy(this.columns);
            this.tdsWidth = 0
            columns.forEach((column, index) => {
                column._index = index;
                column._width = column.width ? column.width : '';
                column._sortType = 'normal';
                this.tdsWidth += column.width ? parseFloat(column.width) : 0;
            });
            return columns;
        },
        // 数据处理 增加自定义属性监听
        initData(items, level, parent) {
          
            let spaceHtml = "";
            for (var i = 1; i < level; i++) {
                spaceHtml += "<i class='ms-tree-space'></i>"
            }
            items.forEach((item, index) => {
                
                item = Object.assign({}, item, {
                    "parent": parent,
                    "level": level,
                    "spaceHtml": spaceHtml
                });
               
                if ((typeof item.isChecked) == "undefined") {
                    item = Object.assign({}, item, {
                        "isChecked": false
                    });
                }
                   //设置了全部展开

                if(this.expanded)
                {
                      item = Object.assign({}, item, {
                        "expanded": true
                    });

                }
                 else if ((typeof item.expanded) == "undefined") {
                       item = Object.assign({}, item, {
                        "expanded": false
                      });
                     item = Object.assign({}, item, {
                        "isShow": false
                    });
                }
                item = Object.assign({}, item, {
                    "load": (item.expanded ? true : false),
                    "isShow":(item.expanded ? true : false),
                });
              
                this.initItems.push(item);
                console.log(item)
              
                if (item.children && item.expanded) {
                    this.initData(item.children, level + 1, item);
                }
            })
            
        },
        //  隐藏显示
        show(item) {
          
           return ((item.level == 1) || (item.parent && item.parent.expanded ));
          // return true
        },
        //展开和关闭
        toggle(index, item) {
            let level = item.level + 1;
            let spaceHtml = "";
            for (var i = 1; i < level; i++) {
                spaceHtml += "<i class='ms-tree-space'></i>"
            }
            if (item.children) {
                if (item.expanded) {
                    item.expanded = !item.expanded;
                    this.close(index, item);
                    
                    this.$set(this.initItems,index,item)
                } else {
                    item.expanded = !item.expanded;
                    if (item.load) {
                        this.open(index, item);
                    } else {
                        item.load = true;
                        item.children.forEach((child, childIndex) => {
                            this.initItems.splice((index + childIndex + 1), 0, child);
                            //设置监听属性
                            this.$set(this.initItems[index + childIndex + 1], 'parent', item);
                            this.$set(this.initItems[index + childIndex + 1], 'level', level);
                            this.$set(this.initItems[index + childIndex + 1], 'spaceHtml', spaceHtml);
                            this.$set(this.initItems[index + childIndex + 1], 'isShow', true);
                            this.$set(this.initItems[index + childIndex + 1], 'expanded', false);
                        })
                    }
                }
            }
        },
        /**关闭
         * index：索引
         * item：展开的项
         * 
         */
        open(index, item) {
            if (item.children) {
                item.children.forEach((child, childIndex) => {
                    child.isShow = true;
                    if (child.children && child.expanded) {
                        this.open(index + childIndex + 1, child);
                    }
                })
            }
        },
        /*
           关闭和展开区别：展开只需要展开最近的一级
                         关闭呢需要关闭所有的下级
           可以打印initItem 看看数据结构
           根据children找到表格索引
        */ 
        close(index, item,i) {
          
               
            if(index==0)
            {
               this.i=0;
            }
           console.log(item.menuName+'='+i);
            this.initItems[this.i].isShow=false;
            this.initItems[this.i].expanded=false;
            if (item.children) {
                item.children.forEach((child, childIndex) => {
                   this.i++;
                    child.isShow = false;
                    child.expanded = false;
                    if (child.children) {
                        this.close(index + childIndex + 1, child,this.i);
                    }
                })
            }
             i++;
           
         
           
        },
        //点击check勾选框
        handleCheckClick(data, event, index){
             
           if(data.isChecked)
            {
                this.checkGroup.push(this.makeData(data))
            }
            else
            {
                this.checkGroup=this.checkGroup.filter((item)=>{
                    console.log(item)
                    return item.id!=data.id;
                })
            }
            this.$emit('on-selection',this.checkGroup);
            // // if(arr){
            // //       this.handleTreeChecked(arr,data.isChecked);
            // // }
            // console.log(JSON.stringify(this.checkGroup))
        },


        handleTreeChecked(arr,state)
        {
           
            arr.forEach((value,inde)=>{
                if(state)
                {
                    this.checkGroup.push(value)
                }
                else{
                    this.checkGroup=this.checkGroup.filter(item=>{
                        return item.id!=value.id
                    })
                }
                value.isChecked=state;
                
                if(value.children&&value.children.length>0)
                {
                    this.handleTreeChecked(value.children,state)
                }
            })
        },
      
        //checkbox 全选 选择事件
        handleCheckAll(value) {
           
            if (this.checks) {
                //this.checkGroup = this.getArray(this.checkGroup.concat(this.All(this.tableData)))
                this.checkGroup=this.All(this.tableData);
            } else {
                 this.All(this.tableData);
                this.checkGroup = []
            }
            console.log(this.checkGroup)
            // this.$emit('on-selection-change', this.checkGroup)
        },
        // 数组去重
        getArray(a) {
         
            var hash = {},
                len = a.length,
                result = [];
            for (var i = 0; i < len; i++) {
                if (!hash[a[i]]) {
                    hash[a[i]] = true;
                    result.push(a[i]);
                }
            }
            return result;
        },
        checkAllGroupChange(data) {
            if (this.dataLength > 0 && data.length === this.dataLength) {
                this.checks = true;
            } else {
                this.checks = false;
            }
            this.$emit('on-selection-change', this.checkGroup)
        },
        All(data) {
            let arr = []
            data.forEach((item) => {
                item.isChecked=this.checks;
                arr.push(item)
                if (item.children && item.children.length > 0) {
                    arr = arr.concat(this.All(item.children));
                }
            })
            // // this.$set(this.tableData,0,arr[0])
            // alert(this.tableData.length)
            this.tableData=data;
            return arr
        },
        // 返回树形数据长度
        Length(data) {
            let length = data.length
            data.forEach((child) => {
                if (child.children) {
                    length += this.Length(child.children)
                }
            })
            return length;
        },
        // 返回表头
        renderHeader(column, $index) {
            
            if ('renderHeader' in this.columns[$index]) {
                console.log(this.columns[$index].renderHeader(column, $index))
            } else {
                return column.title || '#';
            }
        },

        // 返回内容
        renderBody(row, column, index) {
        
            return row[column.key]
        },
        // 默认选中
        renderCheck(data) {
            let arr = []
            data.forEach((item) => {
                if (item._checked) {
                    arr.push(item.id)
                }
                if (item.children && item.children.length > 0) {
                    arr = arr.concat(this.renderCheck(item.children));
                }
            })
            return arr
        },
        // 深度拷贝函数
        deepCopy(data) {
            var t = this.type(data),
                o, i, ni;
            if (t === 'array') {
                o = [];
            } else if (t === 'object') {
                o = {};
            } else {
                return data;
            }
            if (t === 'array') {
                for (i = 0, ni = data.length; i < ni; i++) {
                    o.push(this.deepCopy(data[i]));
                }
                return o;
            } else if (t === 'object') {
                for (i in data) {
                    o[i] = this.deepCopy(data[i]);
                }
                return o;
            }

        },
        type(obj) {
            var toString = Object.prototype.toString;
            var map = {
                '[object Boolean]': 'boolean',
                '[object Number]': 'number',
                '[object String]': 'string',
                '[object Function]': 'function',
                '[object Array]': 'array',
                '[object Date]': 'date',
                '[object RegExp]': 'regExp',
                '[object Undefined]': 'undefined',
                '[object Null]': 'null', 
                '[object Object]': 'object'
            };
            return map[toString.call(obj)];
        }
    },
    beforeDestroy() {
        window.onresize = null
    }
}
</script>
<style>
.autoTbale {
    overflow: auto;
}

table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
}

.table-bordered {
    border: 1px solid #EBEBEB;
}

.table>tbody>tr>td,
.table>tbody>tr>th,
.table>thead>tr>td,
.table>thead>tr>th {
    border-top: 1px solid #e7eaec;
    line-height: 1.42857;
    padding: 8px;
    vertical-align: middle;
}

.table-bordered>tbody>tr>td,
.table-bordered>tbody>tr>th,
.table-bordered>tfoot>tr>td,
.table-bordered>tfoot>tr>th,
.table-bordered>thead>tr>td,
.table-bordered>thead>tr>th {
    border: 1px solid #e7e7e7;
}

.table>thead>tr>th {
    border-bottom: 1px solid #DDD;
}

.table-bordered>thead>tr>td,
.table-bordered>thead>tr>th {
    background-color: #F5F5F6;
}

#hl-tree-table>tbody>tr {
    background-color: #fbfbfb;
}

#hl-tree-table>tbody>.child-tr {
    background-color: #fff;
}



.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 14px;
    height: 14px;
}

.ms-tree-space::before {
    content: ""
}

#hl-tree-table th>label {
    margin: 0;
}
</style>
