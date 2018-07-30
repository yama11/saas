
<script>

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

export default {

  name: 'AppUploader',

  props: {
    value: {
      type: String,
      default: '',
    },

    // 上传接口名
    postName: {
      type: String,
      default: '',
    },

  },

  data() {
    return {
      accept: 'image/png,image/gif,image/jpeg',
      // 裁剪弹窗的显示隐藏
      dialogVisible: false,
      // cropper的图片预览
      preview: null,
      cropDetail: null,
      loading: false,

      corpper: '',
    };
  },

  methods: {
    // 点击上传图片,触发input
    touchInput() {
      this.$refs.input_id.click();
    },

    // 获取用户上传缩略图
    getPreview({ target: { files } }) {
      /**
       * this.file是用户选择的文件
       */
      this.file = files[0];
      const isMatch = /image\/(png|jpg|jpeg|bmp)/.test(this.file.type);
      const isLimited = this.file.size < 2 * 1024 * 1024;

      // 裁剪前的校验
      if (!isMatch) {
        this.handleFormatError(this.file);
      } else if (!isLimited) {
        this.handleMaxSize(this.file);
      } else {
        // 这里拿到用户选择的文件的本地缩略图，并将它转换成base64，在回调中打开裁剪弹窗
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.preview = reader.result;
          this.dialogVisible = true;
        });
        reader.readAsDataURL(this.file);
      }
    },
    crop({ target }) {
      this.corpper = new Cropper(target, {

      // 将拖拽区域限制为不超过画布的大小
        viewMode: 1,

        // 拖拽模式
        dragMode: 'move',

        // 设置截图拖拽区域比例
        aspectRatio: 1 / 1,

        // 这个回调可能用不到
        crop(e) {
          this.cropDetail = e.detail;
        },
      });
    },

    update() {
      this.corpper.getCroppedCanvas().toBlob((blob) => {
        const file = new File([blob], this.file.name, {
          type: this.file.type,
          lastModified: new Date(),
        });
        const param = new FormData(); // 创建form对象
        param.append('chunk', '0');// 断点传输
        param.append('chunks', '1');
        param.append('file', file, file.name);
        // console.log(param.get('file')); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
        // 先从自己的服务端拿到token
        this.$http.get('https://oa-v2-admin-api.caihonggou.com/v1/uptoken')
          .then((response) => {
            this.token = response.uptoken;
            param.append('token', this.token);
            this.uploading(param, file);// 然后将参数上传七牛
          });
      });
    },

    uploading(param, file) {
      const addr = 'https://oa-statics.caihonggou.com/';
      this.$http.post('http://upload.qiniup.com/', param)
        .then((response) => {
          this.preview = addr + response.key;

          this.$message({
            type: 'success',
            message: '头像上传成功！',
          });
          this.$emit('on-success', this.preview, file.name);
          this.cancelUpload();
        })
        .catch(({ message }) => {
          this.handleError(message);
        })
        .then(() => {
          this.loading = false;
        });
    },

    // 校验文件格式提示框
    handleFormatError(currentFile) {
      this.$message({
        type: 'warning',
        message: `文件 ${currentFile.name} 格式不正确，请上传 jpg/png/bmp 格式的图片。`,
      });
    },

    // 校验文件大小提示框
    handleMaxSize(currentFile) {
      this.$message({
        type: 'warning',
        message: `文件 ${currentFile.name} 太大，不能超过2M。`,
      });
    },
    // 上传错误
    handleError(message) {
      this.$message.error(message);
    },
    // 取消上传图片
    cancelUpload() {
      this.$refs.input_id.value = '';
      this.dialogVisible = false;
    },
  },
};
</script>

<template>
  <div class="student-info">
    <div>
      <div
        class="app-crop-uploader__div"
        @click="touchInput">
        <img
          v-if="value"
          :src="value"
          class="app-crop-uploader-div__img">
        <i
          v-else
          class="el-icon-plus app-crop-uploader-div__placeholder"/>
      </div>
      <input
        ref="input_id"
        :accept="accept"
        type="file"
        style="display:none;"
        name="file"
        @change="getPreview">
      <span class="app-crop-uploader__span">只能上传jpg/png/bmp文件，且不超过2MB</span>
    </div>
    <!--裁剪弹窗 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :loading="loading"
      :close-on-click-modal="false"
      title="头像裁剪"
      width="400px"
      @close="cancelUpload"
    >

      <div v-if="preview">
        <img
          :src="preview"
          style="max-width:500px;"
          @load="crop">
      </div>

      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="update">确 定</el-button>
        <el-button @click="cancelUpload">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="postcss">
.app-crop-uploader__div{
  width: 100px;
  height: 100px;
  cursor: pointer;
  border: 1px solid gainsboro;
  text-align: center;
  line-height: 110px;
}
.app-crop-uploader-div__img{
  width: 100%;
  height: 100%;
}
.app-crop-uploader-div__placeholder{
  font-size: 28px;
  color: gainsboro;
}
.app-crop-uploader__span{
  color: gray;
}
</style>

