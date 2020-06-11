<template>
    <div id="menu_index">
        <Row :gutter="16">
        <Col span="8"  :offset='2'>
            <div class="wei-area">
               <div class="top-title">
                   <div class="title-name"> {{name}}</div>
               </div>
               <div class="content-area">
               </div>
               <div class="bottom-area" >
                     <div v-for='(item,index) in menuList' class="menu" :key='index' @click='addMenu(item)'>
                          
                          <Poptip   v-model="item.show">
                                    <template  slot="content">
                                           <div v-for='one in item.sub_button' class="submenu" >
                                                  {{one.name}}
                                           </div>
                                           <div class="submenu">
                                               <Icon type="md-add" />
                                           </div>
                                    </template>
          
                                 {{item.name}}
                          </Poptip>
                          
                     </div>
                     <div class="menu" v-if="menuList.length<3" @click="addMenu(false)">
                             <Icon type="md-add" />
                     </div>

               </div>

            </div>
        </Col>
        <Col span="12" :offset='2'>
            <div class="right-form">
                <div class="title-area">
                    <p>
                       {{checked.name}}
                    </p>
                    <div class="del">
                      <Icon type="ios-trash" />  删除菜单
                    </div>
                </div>
                <div>

                </div>
                <div style="margin-top:30px">
                       <Form :model="checked" :label-width="80">
                            <FormItem label="菜单名称">
                                <Input v-model="checked.name" placeholder="Enter something..."></Input><br>

                                <span>仅支持中英文和数字，字数不超过4个汉字或8个字母</span>
                            </FormItem>
                             <FormItem label="菜单内容">
                                <RadioGroup v-model="checked.type">
                                    <Radio :label="0">发送消息</Radio>
                                    <Radio :label="1">跳转网页</Radio>
                                    <Radio :label="2">跳转小程序</Radio>
                                </RadioGroup>
                             
                            </FormItem>
                               <div class="menu-content">
                                    <div></div>
                                     <div class="top-group">
                                             <div class="item item-checked">
                                                 <Icon type="ios-images-outline" />
                                                   图文消息
                                             </div>
                                               <div class="item">
                                                <Icon type="md-photos" />
                                                   图片
                                             </div>
                                               <div class="item">
                                                <Icon type="md-volume-up" />
                                                   语音
                                             </div>
                                               <div class="item">
                                                 <Icon type="ios-images-outline" />
                                                   视频
                                             </div>
                                     </div>
                                     <div class="choose-content">
                                         <div class="item">
                                             
                                               <Icon type="ios-folder-outline" />
                                                  <p> 从素材库选择 </p>
                                             
                                         </div>
                                           <div class="item">
                                             
                                                <Icon type="ios-create-outline" />
                                                  <p> 自建图文 </p>
                                             
                                         </div>
                                           <div class="item">
                                             
                                               <Icon type="md-share" />
                                                  <p> 转载文章 </p>
                                             
                                         </div>
                                     </div>
                                </div>
                     </Form>
                        
                </div>
            </div>
            
        </Col>
    </Row>
          
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
import { setTimeout } from 'timers';
  
    export default {
        data() {
            return {
                //wx1bbdf0c911f8e2f9
                //61a24ae6bd3cb72cdc061d6ff5e6e61b
                //22_Ba73RGRydEBRHRjl0iUEu3uDSl-60-TC8VXP0KvVd3oxBEX0tTroe_w6SDkoHI6oHVPxlFF9OcBl2An4x846_IZhbRAfvXnT5TZxXs2J7weAP_7t1LPUJW-fIJ89o0ikjIZRGi2kBu3nFebkUPJiAJAYTN
                params:{
                    'access_token':'22_BTsfD4cQSvL1HYc61fOxHH1gn_ZhRbt0fwToGxcA6VTQcaI7Zrsku7iVnheLXri71X_qW8vTYnV3BaxBobgzglwK2HY-FCPcvdNUBPWD5s4mJiUw79qQ7XWQlkjveZ9yhKj-nsHaywhTYqUMYYSjAGAQQK'
                },
                menuList:[

                ],
                checked:{
                    keyId:0

                },
                name:'测试公众号'
               
            }
        },
        created: function () {
           this.getWeixinMenu();

        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
            getWeixinMenu()
            {
                   this.$api.getWeixinMenu(this.params).then(res => {
                       for(let i in res.menu.button)
                       {
                           res.menu.button[i].keyId=i;
                           res.menu.button[0].show=false;
                           for( let j in res.menu.button[i].sub_button)
                           {
                                res.menu.button[i].sub_button[j].keyId= `${i}-${j}`
                                res.menu.button[i].sub_button[j].show=false;
                           }
                       }
                        res.menu.button[0].show=true;
                        this.menuList=res.menu.button;
                        console.log(this.menuList)
            
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            addMenu(item)
            {
                
                if(!item)
                {
                    let keyId=this.menuList.length;
                    this.checked={
                        name:"新建菜单",
                        keyId:keyId,
                        'sub_button':[],
                        type:'click',
                        show:false,
                    }
                    this.menuList.push(this.checked);
                  
                    setTimeout(()=>{
                            this.menuList[this.menuList.length-1].show=true;

                    },200)
                 
                }
                

                this.checked=item;


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
            .wei-area{
                    width: 320px;
                    border:1px solid #e7e7eb;
                   .top-title{
                     
                        height: 54px;
                        background-image: url('../../assets/weiTop.png');
                        background-repeat: no-repeat;
                        .title-name{
                                color: #fff;
                                text-align: center;
                                padding-top: 30px;
                                font-size: 15px;
                                width: auto;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                word-wrap: normal;
                                margin: 0 30px;
                        }
                    
                   }
                   .content-area{
                       width: 318px;
                       height: 400px;
                       border-bottom:1px solid #e7e7eb;
                      
                   }
                   .bottom-area{
                        
                          height: 54px;
                          padding-left: 50px;
                          background-image: url('../../assets/weiBottom.png');
                          background-repeat: no-repeat;
                          display: flex;
                          display: -webkit-flex;
                          justify-content: space-around;
                          align-items: center;
                         
                          .menu{
                             
                             text-align: center;
                             width:0px;
                             flex-grow: 1;
                             line-height: 24px;
                             border-left:1px solid #e7e7eb;
                             i{
                                 font-size: 24px;
                             }
                             &:first-child{
                                 border-left:none;
                             }
                             .submenu{
                                 height:50px;
                                 border: 1px solid #d9d9d9;
                                 border-bottom: none;
                                 line-height: 48px;
                                 cursor: pointer;
                                 i{
                                     font-size: 30px;
                                 }
                                 &:last-child{
                                     border-bottom: 1px solid #d9d9d9;
                                 }
                                 &:hover{
                                      border: 1px solid #2d8cf0;
                                      color:#2d8cf0
                                 }
                             }
                             
                          }
                   }
                

            }
            .right-form{
                .title-area{
                    display: flex;
                    display: -webkit-flex;
                    justify-content: space-between;
                    line-height: 50px;
                    border-bottom: 1px solid #e7e7eb;
                    cursor: pointer;
                    .del:hover{
                        color:#2d8cf0;
                    }
                }
                .menu-content{
                    padding: 16px 20px;
                    border: 1px solid #e7e7eb;
                    background-color: #fff;
                    .top-group{
                        display: flex;
                        display:-webkit-flex;
                        .item{
                            width:0px;
                            flex-grow: 1;
                            i{
                                font-size: 18px;
                            }
                             &:hover{
                                color:#2d8cf0;

                            }
                            &-checked{
                                  color:#2d8cf0

                            }
                         
                        }
                            
                    }
                    .choose-content{
                        height: 160px;
                        display: flex;
                        display:-webkit-flex;
                        margin-top:80px;
                        .item{
                            width:0px;
                            flex-grow: 1;
                            text-align: center;
                            font-size: 16px;
                            line-height:30px;
                            cursor: pointer;
                            &:hover{
                                color:#2d8cf0;

                            }
                             i{
                                font-size: 30px;
                            }
                        }
                    }
                }

            }

            .checked{
                 border: 1px solid #2d8cf0;
                  color:#2d8cf0
            }
        


      }
     
</style>

