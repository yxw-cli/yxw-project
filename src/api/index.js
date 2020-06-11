import {post,get,put,del} from './api.js';
import baseUrl from './setBaseUrl'


export default {
  //登录接口
  login: (params) => post('/api/usermanage/login', params),
  //获取用户信息
  user_info: (params) => get('/api/usermanage/userinfo', {}),
  //个人中心 中 修改密码
  personal_change_password: (params) => put('/api/usermanage/updatepassword', params),
  //个人中心 中 完成
  updatePersonalInfo: (params) => put('/api/usermanage/oneself', params),

  getUserMenu: (params) => get('/api/usermanage/getmenu', params),
  uploadImage:(params)=>post(baseUrl.uploadImageUrl+'fileUpload/meetingBanner',params),//图片上传地址
  uploadFile:(params)=>post(baseUrl.uploadImageUrl+'fileUpload/reference',params),//文件上传地址


  getWeixinMenu: (params) => get('/menu/get', params),

  //getMenuList: (params) => post('/api/JurisdictionController/list', params),//获得菜单列表
  getMenuList: (params) => get('/api/JurisdictionController/menuList', params),//获得菜单列表
  createMenu: (params) => post('/api/JurisdictionController/create', params),//新建菜单
  updateMenu: (params) => post('/api/JurisdictionController/update', params),//编辑菜单
  delMenu: (params) => post('/api/JurisdictionController/delete', params),//删除菜单

  //角色
  getRoleList: (params) => post('/api/RoleController/page', params),//获得分页列表
  getRoleAllList: (params) => post('/api/RoleController/list', params),//获得全部列表
  createRole: (params) => post('/api/RoleController/add', params),//新建
  updateRole: (params) => post('/api/RoleController/update', params),//编辑
  delRole: (params) => post('/api/RoleController/batchDeleteRole', params),//删除角色
  setAuthsForRole: (params) => post('/api/roleAuth/setAuthsForRole', params),
  queryAuthsByRole: (params) => get('/api/roleAuth/queryAuthsByRole', params),

   //组织部门
   getOrgDepList: (params) => post('/api/DeptController/list', params),//获得列表
   createOrgDep: (params) => post('/api/DeptController/create', params),//新建
   updateOrgDep: (params) => post('/api/DeptController/update', params),//编辑
   delOrgDep: (params) => post('/api/DeptController/batchDelete', params),//删除角色

   //用户管理
   getUserList: (params) => post('/api/usermanage/page', params),
   createUser: (params) => post('/api/usermanage/create', params),
   updateUser: (params) => put('/api/usermanage/update', params),
   delUser: (params) => post('/api/usermanage/deletebatch', params),
   resetPassword: (params) => post('/api/usermanage/resetpasswd', params),

   //权限
   getRolePermissionList: (params)=>get('/api/rolemanage/infolist', params),
   createRolePrmission: (params)=>post('/api/rolemanage/create', params),
   getRoleDetial: (params)=>post('/api/RoleController/queryRoleByIds', params),
   updateRolePrmission: (params)=>put('/api/rolemanage/update', params),

   //报名管理

  getSignList: (params)=>post('/api/wechat/signUp/page', params),
  updateSign: (params)=>post('/api/wechat/signUp/update', params),
  delSign: (params)=>post('/api/wechat/signUp/del', params),
  getSignDetial:(params)=>get('/api/wechat/signUp/details', params),
  exportSignData:(params)=>get('/api/wechat/signUp/exportSignupRecord', params),

  //内容素材管理

  getMaterialList:(params)=>post('/api/material/page', params),
  dataSynchronism:(params)=>get('/api/material/dataSynchronism', params),
  materialDelete:(params)=>post('/api/material/batchdelete', params),





  
};
