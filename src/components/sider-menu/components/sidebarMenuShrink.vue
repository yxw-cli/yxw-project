<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;" :key="index">
                <Dropdown transfer v-if="!judgeSecMenu(item)" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="min-width: 200px;width:auto" slot="list">
                        <template v-for="(child, i) in item.children">
                            <DropdownItem :name="child.name" :key="i" v-if="judgeThrMenu(child)"><Icon :type="child.icon"></Icon><span style="padding-left:10px;">{{ itemTitle(child) }}</span></DropdownItem>
                        
                               <Dropdown v-else-if='!child.hidden' @on-click="changeMenu" placement="right-start">
                                <DropdownItem>
                                      <Icon  :type="child.icon"></Icon>
                                        {{item.title}}
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem :name="thr.name" v-for='thr in child.children'> <Icon  :type="child.icon"></Icon> {{thr.title}}</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-else-if="!item.hidden" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button @click="changeMenu(item.name)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon || item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="min-width: 200px;" slot="list">
                        <DropdownItem :name="item.name" :key="'d' + index"><Icon :type="item.icon || item.icon"></Icon><span style="padding-left:10px;">{{ itemTitle(item) }}</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },

      judgeSecMenu(item)
       {
         //三个检验顺序不能改变
         if(item.hidden)
         {
             return true;
         }
         //需要显示，如果需要隐藏子路由
         else if(item.hiddenChildren)
          {
              return true;
          }
        else if(item.children.length==0)
         {
             return true;
         }

       },
        judgeThrMenu(item)
       {
         //三个检验顺序不能改变
         if(item.hidden)
         {
             return false;
         }
         //需要显示，如果需要隐藏子路由
         else if(item.hiddenChildren)
          {
              return true;
          }
        else if(item.children.length==0)
         {
             return true;
         }

       },
        itemTitle (item) {
           if (this.$t(item.name)!=item.name) {
                return this.$t(item.name);
            } else {
                return item.title;
            }
      }
}
}
</script>
<style  lang="less" >
    .ivu-dropdown :hover{
        button .ivu-icon{
            color:#2d8cf0 !important;
        }
    }
    
</style>