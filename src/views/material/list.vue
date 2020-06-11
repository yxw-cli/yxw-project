/*
 * @Author: 于学文 
 * @Date: 2019-06-20 13:23:50 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-07-01 17:56:31
 */
<template>
    <div id="material-permission" class="only-content">
             <div class="header">
                  <div class="left">
                         <Form ref="formInline" :model="params" inline>
                            <FormItem prop="user">
                                <Input v-model="params.value" placeholder='请输入搜索内容'>
                                    <Select v-model="params.key" slot="prepend" style="width: 80px" placeholder='筛选条件'>
                                        <Option :value="item.key" v-for="item in filterArray">{{item.label}}</Option>
                                    </Select>
                                 </Input>
                            </FormItem>
                            <FormItem>
                                <Button @click="search(1)">查询</Button>
                                 <Button @click="reset()">重置</Button>
                            </FormItem>
                        </Form>
                  </div>
                  <div class="right">
                            <Button @click="dataSynchronism()" v-has='"material:data"'>同步数据</Button>
                            <Button @click="delmaterial()" type='warning' v-has='"material:delete"'> 批量删除</Button>
                           
                  </div>
             </div>
              <div>
                  <primaryTable 
                     :columns="columns"
                      :data="tableList"
                      ref='primaryTable'
                     :total='total'
                      @on-change='changePage'
                      @on-selection-change='selectChange'
                      @on-check='checkmaterial'
                      :loading='tableLoading'
                       :current.sync='params.pageNum'
                    >
                 </primaryTable>
                </div>
                
         
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
import { isContext } from 'vm';


    export default {
        data() {
            return {
                params:{
                    pageSize:10,
                    pageNum:1,
                    isContact:"",
                    key:'title',
                    value:'',
                },
                searchParams:{},
             
                filterArray:[
                    
                    {
                        key:'title',
                        label:'文章标题'
                    },
                    {
                        key:'menuType',
                        label:'分类名称'
                    },
                   
                ],
                tableLoading:false,
                

                left:24,//左侧表格比例
                right:0,
                treeMenuData:[],
                materialName:'',
                materialId:'',
                tableList:[],
                total:0,
                ids:[],//选中的id
                columns:[
                       {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },

                     {
                        title: '素材标题',
                        key: 'title',
                        slot:"alarm"//添加可实现表格edit
                    },
                    {
                        title: '分类',
                        slot:"alarm",
                        key: 'type'
                    },
                   
                     {
                        title: '发布时间',
                        slot:"alarm",
                        key: 'createTime'
                    },
                    {
                        title: '更新时间',
                        slot:"alarm",
                        key: 'updateTime'
                    },
                  
                    {
                        title: '操作',
                        slot: 'action',
                        width: 250,
                        align: 'center',
                        selfBtn:[
                                 {name:"查看",method:"on-check"},
                              
                            ]
                    }
                ],
               
            }
        },
        created: function () {
            this.search();

        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
            search(page){
                let {pageSize,pageNum,isContact}=this.params;
                let searchData={
                    pageSize:pageSize,
                    pageNum:page?page:pageNum,
                };
                if(this.params.key)
                {
                    searchData[this.params.key]=this.params.value;
                }
                this.getmaterialList(searchData)

            },
          /*  
              获得列表
           */
            getmaterialList(params)
            {
                 this.searchParams=params;
                 this.tableLoading=true;
            
                this.$api.getMaterialList(params).then(res=>{
                    this.tableLoading=false;
                  if(res.respCode==0||(res.result)-0==0)
                    {
                        for(let item of res.data.list )
                        {
                           
                            item.createTime=this.$util.getFormatDate(item.create_time*1000);
                            item.updateTime=this.$util.getFormatDate(item.update_time*1000);

                        }
                     
                        this.tableList=res.data.list;
                        this.total=res.data.count;
                    }
                    else{
                        this.$Message.error(res.message);
                    }


                })
            },
            reset(){
                 this. params={
                    pageSize:10,
                    pageNum:1,
                    isContact:"",
                    key:'title',
                    value:'',
                };
                this.search(1);

            },
            changePage(page){
                this.params.pageNum=page;
                this.searchParams.pageNum=page;
                this.getmaterialList(this.searchParams);

            },

            selectChange(data)
            {
                let ids=[];
                for(let item of data)
                {
                    ids.push(item.mediaId);
                }
                this.ids=ids;
            },
            //批量删除
            

        
            //删除
            delmaterial(row)
            {
                if(this.ids.length==0)
                {
                    this.$Message.error('至少勾选一条信息');
                    return;
                }
          
                 this.$util.confirmDialog(this,"确认",`确认删除？`,self=>{
                     self.$api.materialDelete({ids:this.ids}).then(res=>{
                         if(res.respCode==0)
                         {
                             self.$Message.success('删除成功');
                             self.getmaterialList();
                         }
                         else{
                             self.$Message.error(res.message);
                         }
                     })
                     
                  })
                  

            },
            /**
             * 
             * 导出
             */

            exportData(){
                 if(this.ids.length==0)
                {
                    this.$Message.error('至少勾选一条信息');
                    return;
                }
                window.location.href='/api/wechat/materialUp/exportmaterialupRecord?ids='+this.ids.join(',');

                

            },
            /**
             * 查看
             */
            checkmaterial(row){
             
                  window.open(row.url,'_blank')
                  // this.$router.push({name:'material-check',query:{id:row.id}})

            },

            /**
             * 同步数据
             */
            dataSynchronism(){
                 this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'ios-loading',
                                    size: 18
                                }
                            }),
                            h('div', '数据同步中')
                        ])
                    }
                });
              
                this.$api.dataSynchronism({}).then(res=>{
                     this.$Spin.hide();
                     if(res.respCode==0)
                     {
                         this.$Message.info('同步数据成功');

                     }
                     else{
                          this.$Message.error(`同步数据失败：${res.message}`);

                     }
                })
            }
       
          

        },
        filters: {

        },
        components: {
            
        }
    }

</script>

<style lang='less'>
      #material-permission{
         .header{
              display: -webkit-flex;
              display: flex;
              justify-content: space-around;
              .left{
                  width:0px;
                  flex-grow:1;
              }
              .right{
                  width: auto;

              }
         }

      }
</style>

