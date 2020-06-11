/*
 * @Author: 于学文 
 * @Date: 2019-04-07 13:22:18 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-27 21:35:58
   @Descripon：面包屑组件
 */
<template>
    <Breadcrumb>
        <BreadcrumbItem 
            v-for="item in currentPath" 
            :to="item.path" 
            :key="item.name"
        >{{ itemTitle(item) }}</BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
export default {
    name: 'breadcrumbNav',
    props: {
        currentPath: Array
    },
    methods: {
        itemTitle (item) {
          if (this.$t(item.name)!=item.name) {
                return this.$t(item.name);
            } else {
                return item.title;
            }
        }
    }
};
</script>

