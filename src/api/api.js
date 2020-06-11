/*
 * @Author: 于学文 
 * @Date: 2019-04-02 11:47:36 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-27 21:15:47
 */
/* eslint-disable indent */
// 引入axios
import $axios from 'axios';
import qs from 'qs';
import baseUrl from './setBaseUrl'
import { EMSGSIZE } from 'constants';
import store from '../../store/index'
import {Message} from 'view-design'
// 跨域
$axios.defaults.withCredentials = false
//设置不同环境的baseUrl
//$axios.defaults.baseURL = baseUrl.apiBaseUrl


// 添加请求拦截器(需要根据不同系统接口返回格式修改)

$axios.interceptors.request.use(function (config) {

  // 在发送请求之前做些什么
  // 塞header
  config.headers['sid'] = window.sessionStorage.getItem("sid");

 
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器  
$axios.interceptors.response.use(
  function(response){  
    
    // 扒皮 扒掉状态码
    response = response.data
    if(response.code==0&&response.content)
    {
       return response.content;
    }
  
   if(response.respCode == 10002) {
      store.commit('setLoginState',new Date().getTime());
     
    } else  {
      return response;
    }
}),function(error){
  
    error
}  
// 请求方法 get
let get = (url, params) => {
  params.systemType=1;
  return new Promise((success, error) => {
    $axios.get(url, {
        params: params
      })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if(!handleError(err.response)) 
        {
           error(err);
 
        }
    
        error(err);
      });
  });
};
// 请求方法 put
let put = (url, params) => {
      params.systemType=1;
  //  params.Serialize = false;
    return new Promise((success, error) => {
      $axios.put(url,params)
        .then(res => {
          success(res);
        })
        .catch(err => {

          if(!handleError(err.response)) 
          {
             error(err);
   
          }
        
          error(err);
        });
    });
  };
  // 请求方法 delete
let del = (url, params) => {
      params.systemType=1;
  //  params.Serialize = false;
    return new Promise((success, error) => {
      $axios.delete(url,params)
        .then(res => {
          success(res);
        })
        .catch(err => {
          if(!handleError(err.response)) 
          {
             error(err);
   
          }
          error(err);
        });
    });
  };
// post
let post = (url, params) => {
  params.systemType=1;
  return new Promise((success, error) => {
    $axios.post(url, params)
      .then(res => {
        success(res);
      })
      .catch(err => {
      
       if(!handleError(err.response)) 
       {
          error(err);

       }
      
      });
  });
};

//对接不同后台此处会有所变更，特别是登出
let handleError=(errRes)=>
{
  console.log(errRes)
   //登录失效 需要退出
    if(errRes.status==401)
    {
        //store.commit('setLoginState',new Date().getTime());
        return true;
    }
    else  if(errRes.status==500)
    {
        Message.error(`服务器内部错误：${errRes.data}`);
        return false;
        
    }
    else  if(errRes.status==404)
    {
        Message.error('访问接口路径不存在');
        return false
        
    }

}


export{
  post,
  get,
  del,
  put
}

