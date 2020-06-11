import Vue from 'vue'
import store from '../../../store/index'

/** 权限指令**/

Vue.directive('has', {
  bind: function(el, binding) {
    
    if (!Vue.prototype.$_has(binding.value)) {
   
     // el.parentNode.removeChild(el)
     Vue.nextTick(()=>{
         el.parentNode.removeChild(el)
     })
    }
  }
})

// 权限检查方法
Vue.prototype.$_has = function(value) {

  
  
  // example
  // array :  v-has="['userList:add','userList:edit']"
  // single : v-has="'userList:add'"
  //直接赋值true，则不校验
  if(value===true)
  {
    return true;
  }
  if (!value) {
    return false
  }
  // 获取用户按钮权限
  const dynamicButtons = store.state.app.button;
  if (dynamicButtons === undefined || dynamicButtons === null || dynamicButtons.length < 1) {
    return true
  }
  if (value instanceof Array && value.length > 0) {
   
    let hasPermission=false;
    for(let item of value)
    {
      if( dynamicButtons[item])
      {
         hasPermission=true;
         break;
      }
     

    }
    return hasPermission
  } else {
    
    const hasPermission = dynamicButtons[value]?true:false;
    return hasPermission
  }
}

