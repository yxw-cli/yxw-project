/*
 * @Author: 于学文 
 * @Date: 2019-06-20 13:23:50 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-07-15 15:02:19
 */
<template>
    <div id="sign-permission" class="only-content">
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
                            <FormItem prop="password">
                                
                               <Select v-model="params.isContact" style="width:100px" placeholder='联系状态'>
                                  
                                    <Option :value="0">未联系</Option>
                                    <Option :value="1">已联系</Option>
                                </Select>
                            </FormItem>
                            <FormItem>
                                <Button @click="search(1)" style="margin-right:5px">查询</Button>
                                  <Button @click="reset()">重置</Button>
                            </FormItem>
                        </Form>
                  </div>
                  <div class="right">
                            <Button @click="setProject()"  v-has='"sign:set"'>报名配置</Button>
                            <Button @click="delSign()" type='warning'  v-has='"sign:delete"'> 批量删除</Button>
                            <Button @click="exportData()"  v-has='"sign:export"'>批量导出</Button>   
                  </div>
             </div>
              <div>
                  <primaryTable 
                      :columns="columns" :data="tableList"
                       ref='primaryTable'
                       @on-edit='editSign'
                       :total='total'
                       @on-change='changePage'
                       @on-selection-change='selectChange'
                       @on-check='checkSign'
                       @on-sort-change='handleSortChange'
                       :loading='tableloading'
                       :current.sync='params.page'
                    >
                 </primaryTable>
                </div>
              <Modal
                    v-model="projectForm"
                     title="项目配置"
                    :draggable='true'
                    :loading="true"
                    :closable="false"
                >
                 <Form :model="formData" ref="formData"  :rules="ruleValidate"  :label-width="80" v-if="projectForm">
                    <FormItem label="项目名称" prop='title'>
                        <Input v-model="formData.title" placeholder='请输入项目名称'></Input>
                    </FormItem>
                     <FormItem label="项目类型">
                        <RadioGroup v-model="formData.type">
                            <Radio :label="0">肿瘤类</Radio>
                            <Radio :label="1">非肿瘤类</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="二维码" v-if="projectForm&&linkUrl">
                            <qrCode :qr-url='linkUrl'  :qr-size='150' ></qrCode>
                    </FormItem>

                 </Form>
                    <div slot="footer" >
                        <Button type="success" @click="getQr">生成二维码</Button>
                        <Button @click='close'>取消</Button>
                    </div>
                </Modal>
         
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
     import logo from '../../assets/logo.png'
     import qrCode from '../../components/qrCode/index'
     import  constants from '../../api/constant'


    export default {
        data() {
            return {
                params:{
                    pageSize:10,
                    page:1,
                    isContact:"",
                    key:'',
                    value:'',
                    sort:"",
                },
                tableloading:false,
                linkUrl:'',
                qrLogo:'',
                projectForm:false,
                formData:{
                    title:'',
                    type:0,
                },
                ruleValidate:{
                     title: [
                          this.$util.rules.required('项目名称为空'),
                          this.$util.rules.max(100,'输入限制100位'),
                    ],
                },
             
                filterArray:[
                    
                    
                    {
                        key:'projectName',
                        label:'项目名称'
                    },
                    {
                        key:'name',
                        label:'姓名'
                    },
                     {
                        key:'mobileNo',
                        label:'手机号码'
                    },   
                     {
                        key:'city',
                        label:'城市'
                    }
                ],
                 searchParams:{},

                left:24,//左侧表格比例
                right:0,
                treeMenuData:[],
                SignName:'',
                SignId:'',
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
                        title: '报名编号',
                        key: 'serialNumber',
                        slot:"alarm"//添加可实现表格edit
                    },

                     {
                        title: '项目名称',
                        key: 'projectName',
                        slot:"alarm"//添加可实现表格edit
                    },
                    {
                        title: '姓名',
                        slot:"alarm",
                        width:100,
                        key: 'name'
                    },
                     {
                        title: '类型',
                         width:100,
                        slot:"alarm",
                        key: 'typeDesc'
                    },
                     {
                        title: '联系电话',
                        slot:"alarm",
                        key: 'mobileNo'
                    },
                    {
                        title: '所在城市',
                        slot:"alarm",
                        key: 'city'
                    },
                     {
                        title: '是否联系',
                        slot:"alarm",
                        width:90,
                        key: 'isContactDesc'
                    },
                      {
                        title: '报名时间',
                        slot:"alarm",
                        sortable: true,
                        key: 'signUpTime'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center',
                        selfBtn:[
                                {name:"编辑",method:"on-edit",type:"primary",permission:'sign:edit'},
                                 {name:"查看",method:"on-check",permission:'sign:check'},
                              
                            ]
                    }
                ],
               
            }
        },
        created: function () {
            this.search(1);

        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
          /*  
              获得列表
           */

            search(page){
                this.params.page=page?page:1;
                //注意：不能使用直接使用 this.params，因为根据 key-value 处理后的查询数据 下次查询还会存在
                let {pageSize,isContact,sort}=this.params;
                let searchData={
                    pageSize:pageSize,
                    page:page,
                    isContact:isContact,
                    sort:sort,
                };
                if(this.params.key)
                {
                    searchData[this.params.key]=this.params.value;
                }
                this.getSignList(searchData);
                this.searchParams=searchData;

            },
            getSignList(searchData)
            {
                this.tableloading=true;
                this.$api.getSignList(searchData).then(res=>{
                  if(res.respCode==0||(res.result)-0==0)
                    {
                       for(let item of res.data.list)
                       {
                          item.typeDesc=item.type==0?'肿瘤类':'非肿瘤类';
                          item.isContactDesc=item.isContact==1?'是':'否';
                          item.signUpTime=this.$util.getFormatDate(this.dateToGMT(item.signUpTime));
                       }
                        this.tableList=res.data.list;
                        this.total=res.data.count;
                     
                    }
                    else{
                        this.$Message.error(res.message);
                    }
                    this.tableloading=false;

                })
            },
            reset(){
                this.params.key='';
                this.params.isContact='';
                this.params.value='';
                this.search(1);

            },

         dateToGMT(sDate){
        　　var dateS=sDate.split(" ");
        　　var strGMT = dateS[0]+" "+dateS[1]+" "+dateS[2]+" "+dateS[5]+" "+dateS[3]+" GMT+0800";
        　　var date = new Date(Date.parse(strGMT));
        　　return date;
        },
            
            changePage(page){
                this.params.page=page;
                this.searchParams.page=page;
                this.getSignList(this.searchParams);

            },
            handleSortChange(data){ 
                   this.searchParams.sort=data.order;
                  this.getSignList(this.searchParams);
            },

            selectChange(data)
            {
                let ids=[];
                for(let item of data)
                {
                    ids.push(item.id);
                }
                this.ids=ids;
            },
            //批量删除
            

            //新增
            addSign(params)
            {
                this.$router.push({name:'SignPermission-detial',query:params?params:{}});

            },
            //编辑
            editSign(row)
            {
                // let {id,permissionIds,SignName}=row;
                // let params={
                //     id:id,
                //     SignName:SignName,
                //     menuIds:permissionIds
                // }
                // this.addSign(params)
                this.$router.push({name:'sign-edit',query:{id:row.id}})

            },
            //删除
            delSign(row)
            {
                if(this.ids.length==0)
                {
                    this.$Message.error('至少勾选一条信息');
                    return;
                }
                let params={ids:this.ids.join(',')};
        
                 this.$util.confirmDialog(this,"确认",`确认删除？`,self=>{
                     self.$api.delSign(params).then(res=>{
                         if(res.respCode==0||res.result==0)
                         {
                             self.$Message.success('删除成功');
                             self.search(self.params.page);
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
                window.location.href='/api/wechat/signUp/exportSignupRecord?ids='+this.ids.join(',');

                

            },
            /**
             * 查看
             */
            checkSign(row){
                   this.$router.push({name:'sign-check',query:{id:row.id}})

            },

            setProject(){
                this.qrLogo=logo;
                this.projectForm=true;

            },
            getQr(){

             this.$refs.formData.validate((valid) => {
                    if (valid) {
                        
                              let name=encodeURI(this.formData.title);
                              this.linkUrl=`${constants.signUrl}?projectName=${name}&type=${this.formData.type}`
                         
                       
                    } else {
                     
                        
                    }
                })
             
             
         
                
            },

            close(){
                this.linkUrl='';
                this.formData={
                    title:'',
                    type:0
                };
                this.projectForm=false;
            },
       
          

        },
        filters: {

        },
        components: {
            qrCode
            
        }
    }

</script>

<style lang='less'>
      #sign-permission{
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

