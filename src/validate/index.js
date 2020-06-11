/*
 * @Author: 于学文 
 * @Date: 2019-04-02 11:38:06 
 * @Last Modified by:   于学文 
 * @Last Modified time: 2019-06-20 11:38:06 
 */
import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate';
import cn from 'vee-validate/dist/locale/zh_CN'
import idNoCheck from './idNoCheck'

Vue.use(VeeValidate, {
  // 关闭一切校验事件
  events: '',
  // 解决跟ElementUI 冲突的问题
  // 参考文档 https://blog.csdn.net/l_z_w99/article/details/81512393
  errorBagName: 'errorBags',
  fieldsBagName:'fieldBags'
});
Validator.locale = 'zh_CN'
Validator.localize("zh_CN", {
  messages: cn.messages,
  attributes: {
  }
})

Validator.extend('mobile', {
  // getMessage(field, args){ 下面这个getMessage会有第二个参数的
  getMessage(field){
    return "您填写的手机号格式错误";
  }, 
  // validate(value, args){ 下面这个getMessage会有第二个参数的
  validate(value) {
    return value.length === 11 && /^[1][0-9]{10}$/.test(value)
  }
})
Validator.extend('required', {
  // getMessage(field, args){ 下面这个getMessage会有第二个参数的
  getMessage(field){
    return field + '不能为空';
  }, 
  // validate(value, args){ 下面这个getMessage会有第二个参数的
  validate(value) {
    if(value){
      return true
    }
    return false
  }
})


// 姓名校验规则
Validator.extend("name", {
    getMessage: field => "您填写的姓名有误，只能为9位以内汉字",
    validate: value => {
      return /^[\u4e00-\u9fa5·]{2,9}$/.test(value);
    }
  });

//身份证号校验规则
Validator.extend('idNo', {
    getMessage(field){
      return "您填写的证件号码有误，只能为18位以内数字或字母组合";
    }, 
    validate(value) {
      if(idNoCheck.isIdno(value)){
        return true
      }
      return false
    }
  })


 //车牌号校验规则
 Validator.extend('carNo', {
    getMessage(field){
      return "请输入正确格式的车牌号";
    }, 
    validate(value) {
      return /^[A-Z0-9]{6,7}$/.test(value)
    }
  })

  //发动机号校验规则
 Validator.extend('carDrivenNo', {
  getMessage(field){
    return "请输入正确格式的发动机号";
  }, 
  validate(value) {
    return /^[A-Z0-9]{4,40}$/.test(value)
  }
})

  //邮箱校验规则
 Validator.extend('email', {
  getMessage(field){
    return "邮箱格式错误";
  }, 
  validate(value) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)
  }
})

  //车架号校验规则
Validator.extend('carframeNo', {
  getMessage: field => "请输入正确格式的车架号",
  validate: value => {

    if(!(/^[A-HJ-NPR-Z0-9]{17}$/.test(value))){
      return false     
    }else if(/([0-9A-Z])\1{16}/.test(value)){
      return false  
    }
    return true
  }
})

export default VeeValidate;