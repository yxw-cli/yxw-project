<template>
   
           <FormItem  :label="params.name" :prop="params.model">
                <template v-if="params.type=='input'">
                      <Input type="text" 
                            v-model="models[params.model]" 
                            :placeholder="params.props.placeholder"
                            :type="params.props.type"
                            :clearable='params.props.clearable'
                            :disabled='params.props.disabled'
                            :readonly='params.props.readonly'
                            >
                        <Icon :type="params.icon" slot="prepend" v-if='params.icon'></Icon>
                      </Input>
                </template>
           </FormItem >
 
</template>

<script>
    import {mapGetters} from 'vuex'
import { setTimeout } from 'timers';
  
    export default {
        props:{
            params:{
                type:Object,
                default:()=>{
                    return{
                            name:'',
                            model:'',
                            type:'input',
                            //树形
                            props:{
                                placeholder:'',
                                disabled:false,
                                clearable:false,
                                readonly:false,
                                width:'100%',
                                
                            },
                            //radio select 数据
                            options:[]

                    }
                 
                },

            },
            models:{
                type:Object,
                default:()=>{
                    return {}
                }
            },
        },
        data() {
            return {
                  

               
            }
        },
        created: function () {
         
        },
        mounted:function()
        {


        },
        computed: mapGetters({

        }),
        watch: {

        },
        methods: {
         

        },
        filters: {

        },
        components: {
         
        }
    }

</script>

<style lang='less'>
    
     
</style>

