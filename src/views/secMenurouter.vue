<template>
 
    <div >
          <keep-alive :include="$store.state.app.keepAlives">
            <router-view ></router-view>
         </keep-alive>
    </div>
   
 
</template>

<script>

    export default {
    

     
    }

</script>

<style lang='less'>
     
</style>

