const validateCardNo = (rule, value, callback) => {
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{17}(\d|X)$)/;
    var reg2 = /(^\d{15}$)/;
    if (!reg.test(value) && !reg2.test(value)) {
        callback(new Error('请输入正确的身份证号码'));
    }
    callback();
}
//校验iview timePicker 时间范围
const validTimemarge= (rule, value, callback)=>{
        if(Array.isArray(value)&value.length>0)
        {
            if(value[0]!=''&value[1]!='')
            {
                callback()
            }
            else{
                callback('请选择时间');
            }
        }
        else{
            callback('请选择时间');
        }
      
}

const validateAge = (rule, value, callback) => {

    
    // 模拟异步验证效果
        if (!Number.isInteger(value-0)) {
            callback(new Error('请输入合法年龄'));
        } 
        
        if ((value-0)>=150) {
            callback(new Error('请输入合法年龄'));
        }
        else {        
                callback();
        }
};



var rules={
            //必填项
            required:(message,trigger)=>{ return  { required: true, message: message?message:'必填项不能为空', trigger: trigger?trigger:'blur' }},
            //邮件
            mail:(message,trigger)=>{return   { type: 'email', message: message?message:'请输入正确邮箱地址！', trigger: trigger?trigger:'blur' }},
            //日期
            date:(message,trigger)=>{return   { type: 'date', message: message?message:'请选择正确日期', trigger: trigger?trigger:'change' }},
            //时间
            time:(message,trigger)=>{return   { type: 'date', message: message?message:'请选择正确时间', trigger: trigger?trigger:'change' }},
            //时间范围
            timemarge:(message,trigger)=>{   return   {required: true, validator: validTimemarge, trigger: 'change' } },
            //最小值
            min:(min,message,trigger)=>{return{ min:min, message: message?message:` 长度最小为${min}`, trigger: trigger?trigger:'blur' }},
            //最大值
            max:(max,message,trigger)=>{return{max:max, message: message?message:` 长度最大为${max}`, trigger: trigger?trigger:'blur' }},
            //长度范围
            minAndmax:(min,max,message,trigger)=>{return{ min:min,max:max,message: message?message:` 长度范围为${min}至${max}`, trigger: trigger?trigger:'blur' }},
            //手机号码
            phone:(message,trigger)=>{ return { pattern:"^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$", message: message?message:'请输入正确的手机号码！',trigger:trigger?trigger:'blur'}},
            //座机号码
            telephone:(message,trigger)=>{ return { pattern:"/0\d{2}-\d{7,8}/", message: message?message:'请输入正确的座机号码！',trigger:trigger?trigger:'blur'}},
            //身份证号码（自定义验证）
            cardNo:(message,trigger)=>{
                  return   { validator: validateCardNo, trigger: 'blur' }
            },
            //验证用户名
            userName:(message,trigger)=>{ return { pattern:"^[a-zA-Z0-9]{1,20}$", message: message?message:'输入值为1-20位字符，包含数字、字母（区分大小写）！',trigger:trigger?trigger:'blur'}},

            validateAge:(message,trigger)=>{
                return   { validator: validateAge, trigger: 'blur' }
             },
             validateNumber:(message,trigger)=>{
                return   {type: 'number', message: '请输入数字', trigger: 'blur', transform(value) {
                        return Number(value);
                     }}
             },
             validUserName:(message,trigger)=>{
                return   { pattern:"^[a-zA-Z0-9]{1,20}$", message: message?message:'用户名为1-20位字符，包含数字、字母（区分大小写）！',trigger:'blur'}

             },



             
              
            

            
   }


export default rules;