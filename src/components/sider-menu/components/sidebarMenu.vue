<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="judgeMenu(item)" :name="item.name" :key="'menuitem' + item.name">
                <Icon :type="item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item) }}</span>
            </MenuItem>

            <Submenu v-if="!item.hidden&!item.hiddenChildren&item.children.length > 0" :name="item.name" :key="item.name">
                <template slot="title" >
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="'menuitem' + child.name" v-if="!child.hidden&child.children.length<1">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>
                     <Submenu v-if="!child.hidden&child.children.length >=1" :name="child.name" :key="child.name">
                          <template slot="title" >
                            <Icon :type="child.icon" :size="iconSize"></Icon>
                            <span class="layout-text">{{ itemTitle(child) }}</span>
                         </template>
                          <template v-for="thrChild in child.children">
                                <MenuItem :name="thrChild.name" :key="'menuitem' + thrChild.name" v-if="!thrChild.hidden">
                                    <Icon :type="thrChild.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                                    <span class="layout-text" :key="'title' + thrChild.name">{{ itemTitle(thrChild) }}</span>
                                </MenuItem>
                          </template>
                     </Submenu>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    created:function(){
         
    },
    mounted()
    {
          this.$nextTick(() => {
            
          
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });

    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        
        itemTitle (item) {
           
              if (this.$t(item.name)!=item.name) {
                return this.$t(item.name);
            } else {
                return item.title;
            }
        },
          judgeMenu(item)
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
    },
    
   
    updated () {

        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
