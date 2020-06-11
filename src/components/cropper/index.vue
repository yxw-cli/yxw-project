<template>
  <div class="cropper-wrapper">
    <div class="img-box">
      <img class="cropper-image" :id="imgId" alt="">
    </div>
    <div class="right-con">
      <div v-if="preview" class="preview-box" :id="previewId"></div>
      <div class="button-box">
        <slot>
          <Upload  action='upload' 
           :before-upload="beforeUpload">
            <Button style="width: 150px;" type="info">选择图片</Button>
          </Upload>
        </slot>
        <div v-show="insideSrc">
          <Button type="primary" @click="rotate">
            <Icon type="md-refresh" :size="18"/>
          </Button>
          <Button type="primary" @click="shrink">
            <Icon type="md-remove" :size="18"/>
          </Button>
          <Button  @click="magnify" type="primary">
            <Icon type="md-add" :size="18"/>
          </Button>
          <Button type="primary" @click="scale('X')">
    
            <Icon type="md-code-working" :size="18"/>
          </Button>
          <Button type="primary" @click="scale('Y')">
              <Icon type="md-code-working" :size="18" class="btn-icon-transform"/>
          </Button>
          <Button type="primary" @click="move(0, -moveStep)">
            <Icon type="md-arrow-round-up" :size="18"/>
          </Button>
          <Button type="primary" @click="move(-moveStep, 0)">
            <Icon type="md-arrow-round-back" :size="18"/>
          </Button>
          <Button type="primary" @click="move(0, moveStep)">
            <Icon type="md-arrow-round-down" :size="18"/>
          </Button>
          <Button type="primary" @click="move(moveStep, 0)">
            <Icon type="md-arrow-round-forward" :size="18"/>
          </Button>
          <Button style="width: 150px;margin-top: 10px;" type="success" @click="crop" v-if='!cropSuccess'>{{ cropButtonText }}</Button>
          <div v-else style="margin-top:10px">
                 <Button style="width: 70px;margin-left: 5px;" type="success" @click="handleCropResult" :loading="loading">上传</Button>
                 <Button style="width: 70px;;" type="warning" @click="cancelUpload" >取消</Button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import './index.less'
import 'cropperjs/dist/cropper.min.css'
import axios from 'axios'
import { debug, types } from 'util';
export default {
  name: 'Cropper',
  props: {
    src: {
      type: String,
      default: ''
    },
    imageWidth:{
         type: Number,
         default: 320
    },
    imageHeight:{
         type: Number,
         default: 180
    },
    proportion:{
         type: Number,
         default: 16/9
    },
    preview: {
      type: Boolean,
      default: true
    },
    moveStep: {
      type: Number,
      default: 4
    },
    cropButtonText: {
      type: String,
      default: '裁剪'
    }
  },
  data () {
    return {
      cropper: null,
      insideSrc: '',
      cropSuccess:false,
      loading:false,
      fileName:'',
      crobReslult:null
    }
  },
  computed: {
    imgId () {
      return `cropper${this._uid}`
    },
    previewId () {
      return `cropper_preview${this._uid}`
    }
  },
  watch: {
    src (src) {
      this.replace(src)
    },
    insideSrc (src) {
      this.replace(src)
    }
  },
  methods: {
    beforeUpload (file) {
  
      var fileTypes={jpg:true,png:true,jpeg:true};
      var fileName=file.name;
      var type=fileName.substring(fileName.lastIndexOf('.')+1)
      if(!fileTypes[type])
      {
         this.$Message.error('请选择后缀名jpg或者png的图片');
          return false;
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        this.insideSrc = event.srcElement.result
      }
      this.fileName=fileName;
      //因为此处 是return false 后面的方法会被拦截，因此校验图片类型和大小需要自己校验
      return false
    },
   
    replace (src) {
      this.cropper.replace(src)
      this.insideSrc = src
    },
    rotate () {
      this.cropper.rotate(90)
    },
    shrink () {
      this.cropper.zoom(-0.1)
    },
    magnify () {
      this.cropper.zoom(0.1)
    },
    scale (d) {
      this.cropper[`scale${d}`](-this.cropper.getData()[`scale${d}`])
    },
    move (...argu) {
      this.cropper.move(...argu)
    },
    //将base64转换为文件
     dataURLtoFile(dataurl, filename) { 
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    },
    //裁剪
  
    crop () {
        var  self=this;
        this.cropper.getCroppedCanvas().toBlob(blob => {
    
               self.cropSuccess=true;
               self.crobReslult=blob;
      })
    },
    //压缩
    handleCropResult(){
          this.loading=true;
          var blob=this.crobReslult;
          var  self=this;
          var a = new FileReader();
                a.readAsDataURL(blob);
                a.onload = function (e){
                       var img2 = new Image();
                            img2.onload = function() {
                                 var canvas = document.createElement("canvas");
                                 var context = canvas.getContext("2d");
                                canvas.width =  self.imageWidth;
                                canvas.height =  self.imageHeight;
                                // 清除画布
                                context.clearRect(0, 0, self.imageWidth,  self.imageHeight);
                                // 图片压缩
                                context.drawImage(img2, 0, 0, self.imageWidth,  self.imageHeight);
                                var type = 'image/jpeg';
                                //将canvas元素中的图像转变为DataURL
                                var dataurl = canvas.toDataURL(type);
                                var file=self.dataURLtoFile(dataurl,self.fileName);
                                self.uploadFile(file);
                          
                            }
                            img2.src=e.target.result;
                
                };

    },
    //上传
      uploadFile(file){
         var self=this;
         var formData = new FormData();
         formData.append('file', file);
          this.$api.uploadImage(formData).then(res => {
                self.loading=false;
               if(res.respCode == 0){
                 self.$emit('upload-success',res.data);
               }
               else{
                 self.$emit('upload-error',res);
               }
                   
                 })
                 .catch(error => {
                       self.loading=false;
                       self.$emit('uoload-error',error);
                       console.log(error)
                 })
              
    },
    cancelUpload()
    {
      this.cropSuccess=false;
      this.crobReslult=null;
    },
  },
  
  mounted () {
    var self=this;
    this.$nextTick(() => {
      let dom = document.getElementById(this.imgId)
      this.cropper = new Cropper(dom, {
        preview: `#${this.previewId}`,
        aspectRatio:self.proportion,
        checkCrossOrigin: true
      })
    })
  }
}
</script>