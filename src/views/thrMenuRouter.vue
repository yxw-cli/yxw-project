<template>
    <keep-alive :include="$store.state.app.keepAlives">
            <router-view ></router-view>
  </keep-alive>
 
</template>

<script>

    export default {
         computed: {
            
            

          }

     
    }

</script>

<style lang='less'>
     
</style>

