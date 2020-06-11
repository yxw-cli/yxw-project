import { Modal } from 'view-design'
import rules from '../validate/validateUtils'
let util = {
    rules:rules,
    openModelForm:(params)=>{
        var  self=params.self;
        var title=params.title;
        var width=params.width?params.width:600;
        var form=params.form;
        var props=params.props;
        var loading=true;
        var modelContext=null;
        Modal.confirm(
            {
            title: title,
            ref:'model',
            scrollable:true,
            render: (h) => {
                return h(form, {//在此处使用引入的组件
                   ref: 'formModel',
                   props: props,
                   on:{
                       finish:(res)=>{
                           self.$Modal.remove();
                           params.success();
                       },
                       error:(res)=>{
                          modelContext.buttonLoading=false;
                          
                       }
                   }
                   
                })
            },
            width: width,
            closable: false,
            okText: "确定",
            cancelText: "取消",
            loading: true,
            onOk() {
                modelContext=this;
               
                this.$refs.formModel.handleSubmit();
               
            },
              onCancel() {
                params.cancel();
            },

            });
            //渲染完成后 将title的图标去掉
            self.$nextTick(function(){
                document.getElementsByClassName("ivu-modal-confirm-head")[0].style.lineHeight='43px'
                document.getElementsByClassName("ivu-modal-confirm-head-icon")[0].style.display='none'
            
            })
    },
    //获得两个时间区间的日期
    getDateSelection:(begin, end)=> {
        　　　　var arr = [];
               var dateStart = new Date(begin).getTime();
        　　　　var dateEnd = new Date(end).getTime();
        　　　　for (var k = dateStart; k <= dateEnd;) {
            　　　　　　//console.log((new Date(parseInt(k))).format());
            　　　　　　k = k + 24 * 60 * 60 * 1000;
            　　　　　　arr.push(util.getFormatOnlyDate(k));
        　　　　}
        　　　　return arr;
    },
    downloadFile:(href,name)=>
    {
        var  a = document.createElement('a');
        a.href =href
        a.download=name?name:"文件下载";
        document.body.append(a);
        a.click();
    },

  
    cityData:{
        "上海": {
            "上海": [
                "黄浦区",
                "卢湾区",
                "徐汇区",
                "长宁区",
                "静安区",
                "普陀区",
                "闸北区",
                "虹口区",
                "杨浦区",
                "闵行区",
                "宝山区",
                "嘉定区",
                "浦东新区",
                "金山区",
                "松江区",
                "青浦区",
                "奉贤区",
                "崇明县",
                "其他"
            ]
        },
        "云南": {
            "临沧": [
                "临翔区",
                "凤庆县",
                "云县",
                "永德县",
                "镇康县",
                "双江拉祜族佤族布朗族傣族自治县",
                "耿马傣族佤族自治县",
                "沧源佤族自治县",
                "其他"
            ],
            "丽江": [
                "古城区",
                "玉龙纳西族自治县",
                "永胜县",
                "华坪县",
                "宁蒗彝族自治县",
                "其他"
            ],
            "保山": [
                "隆阳区",
                "施甸县",
                "腾冲县",
                "龙陵县",
                "昌宁县",
                "其他"
            ],
            "大理": [
                "大理市",
                "漾濞彝族自治县",
                "祥云县",
                "宾川县",
                "弥渡县",
                "南涧彝族自治县",
                "巍山彝族回族自治县",
                "永平县",
                "云龙县",
                "洱源县",
                "剑川县",
                "鹤庆县",
                "其他"
            ],
            "德宏": [
                "瑞丽市",
                "潞西市",
                "梁河县",
                "盈江县",
                "陇川县",
                "其他"
            ],
            "怒江": [
                "泸水县",
                "福贡县",
                "贡山独龙族怒族自治县",
                "兰坪白族普米族自治县",
                "其他"
            ],
            "文山": [
                "文山县",
                "砚山县",
                "西畴县",
                "麻栗坡县",
                "马关县",
                "丘北县",
                "广南县",
                "富宁县",
                "其他"
            ],
            "昆明": [
                "五华区",
                "盘龙区",
                "官渡区",
                "西山区",
                "东川区",
                "呈贡县",
                "晋宁县",
                "富民县",
                "宜良县",
                "石林彝族自治县",
                "嵩明县",
                "禄劝彝族苗族自治县",
                "寻甸回族彝族自治县",
                "安宁市",
                "其他"
            ],
            "昭通": [
                "昭阳区",
                "鲁甸县",
                "巧家县",
                "盐津县",
                "大关县",
                "永善县",
                "绥江县",
                "镇雄县",
                "彝良县",
                "威信县",
                "水富县",
                "其他"
            ],
            "普洱": [
                "思茅区",
                "宁洱镇",
                "墨江哈尼族自治县",
                "景东彝族自治县",
                "景谷傣族彝族自治县",
                "镇沅彝族哈尼族拉祜族自治县",
                "江城哈尼族彝族自治县",
                "孟连傣族拉祜族佤族自治县",
                "澜沧拉祜族自治县",
                "西盟佤族自治县",
                "其他"
            ],
            "曲靖": [
                "麒麟区",
                "马龙县",
                "陆良县",
                "师宗县",
                "罗平县",
                "富源县",
                "会泽县",
                "沾益县",
                "宣威市",
                "其他"
            ],
            "楚雄": [
                "楚雄市",
                "双柏县",
                "牟定县",
                "南华县",
                "姚安县",
                "大姚县",
                "永仁县",
                "元谋县",
                "武定县",
                "禄丰县",
                "其他"
            ],
            "玉溪": [
                "红塔区",
                "江川县",
                "澄江县",
                "通海县",
                "华宁县",
                "易门县",
                "峨山彝族自治县",
                "新平彝族傣族自治县",
                "元江哈尼族彝族傣族自治县",
                "其他"
            ],
            "红河": [
                "个旧市",
                "开远市",
                "蒙自县",
                "屏边苗族自治县",
                "建水县",
                "石屏县",
                "弥勒县",
                "泸西县",
                "元阳县",
                "红河县",
                "金平苗族瑶族傣族自治县",
                "绿春县",
                "河口瑶族自治县",
                "其他"
            ],
            "西双版纳": [
                "景洪市",
                "勐海县",
                "勐腊县",
                "其他"
            ],
            "迪庆": [
                "香格里拉县",
                "德钦县",
                "维西傈僳族自治县",
                "其他"
            ]
          }
        },
        //处理上面的数据
    formatCityData:(cityData)=>{
        var result=[];
        for(let i in cityData)
        {
            var item={name:i,value:i,children:[]};//省，直辖市
            var value=cityData[i];
            for(let j in value)
            {
                if(j==i)
                {
                   for(let one of value[j])//处理直辖市
                   {
                      item.children.push({name:one,label:one})

                   }
                }
                else{
                    var city={name:j,label:j,children:[]};
                    for(let county of  value[j])
                    {
                        city.children.push({name:county,label:county})

                    }
                    item.children.push(city);
                     
                }
            }
            result.push(item)

        }
        console.log(JSON.stringify(result))

    },
    
};

util.getDayAll = function(begin,end){
        var dateAllArr = new Array();
        var ab = begin.split("-");
        var ae = end.split("-");
        var db = new Date();
        db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
        var de = new Date();
        de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
        var unixDb=db.getTime();
        var unixDe=de.getTime();
        for(var k=unixDb;k<=unixDe;){
            dateAllArr.push(util.getFormatOnlyDate(k));
            k=k+24*60*60*1000;
        }
        return dateAllArr;
}
util.confirmDialog=function(self,title,content,cb) {
    self.$Modal.confirm({
        title: title,
        content: content,
        onOk: () => {
            cb(self)
            //this.$Message.info('Clicked ok');
        },
        onCancel: () => {
            //this.$Message.info('Clicked cancel');
        }
    });
}
util.showToast=function(self,type,content)
{
      self.$Message[type](content);
}
 util.getFormatOnlyDate=function(time) {

    var date = new Date(time);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
/*
   格式化时间
 */

 util.getFormatDate=function(time){
    var date = new Date(time);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour=date.getHours();
    var minute=date.getMinutes();
    var seconds=date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hour + seperator2 + minute
        + seperator2 + seconds;
    return currentdate;
}
util.title = function (title) {
    title = title || 'iView admin';
    window.document.title = title;
};



util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};


util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    
    let title = '';
    let isOtherRouter = false;

    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
      
       var  currentPathArr = name=='home'?[]:[
            {
                title: '首页',
                path: '/home',
                name: 'home'
            }
        ];
       // var  currentPathArr=[];
        var currentPathObj=judge(vm.$store.state.app.routers,name)
        for (var i in currentPathObj)
        {
            var item=currentPathObj[i];
            currentPathArr.push(
                {
                    title: item.title,
                    path: item.path,
                    name: item.name
                }
            )
        }

    
    
    vm.$store.commit('setCurrentPath', currentPathArr);
 

    function judge(data,name,y)
    {
      var res=[];
        for(var item of data)
        {
            if(item.name==name)
            {
                res.push(item)
                return res;
            }
            else if(item.children){
                for(let one of item.children)
                {
                    if(one.name==name)
                    {
                        res.push(item);
                        res.push(one)
                        return res;
                    }
                    else if(one.children){
                      
                         for(let child of one.children)
                         {
                            if(child.name==name)
                            {
                                res.push(item);
                                res.push(one)
                                res.push(child)
                                return res;
                            }
                         }
                    }
        
                }

            }
          

        }
    


    }

    return currentPathArr;
};

export default util;
