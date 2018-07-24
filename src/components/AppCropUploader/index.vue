
<script>

/**
 * 头像上传裁剪组件
 *
 * @author  suyanping
 */

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

export default {
  name: 'AppCropUploader',

  props: {

    // 双向绑定值
    value: {
      type: String,
      default: '',
    },

    // 上传接口地址
    url: {
      type: String,
      required: true,
    },

    // 上传接口名
    postName: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      // 用户选择文件时默认展示格式，写在input-file上
      accept: 'image/*',

      // cropper的图片预览
      preview: null,
      cropDetail: null,

      loading: false,

      // 裁剪弹窗的显示隐藏
      dialogVisible: false,

      corpper: '',

    };
  },

  computed: {

    // 完整接口
    action() {
      const productionURL = this.$http.apiRoot + this.url;

      return productionURL;
    },

    uploadHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
    },

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

    // 上传裁剪后的图片
    uploadImg() {
      this.corpper.getCroppedCanvas().toBlob((blob) => {
        // 新建formData
        const formData = new FormData();

        // 配置图片裁剪后丢失的：类型，时间，名称
        const file = new File([blob], this.file.name, {
          type: this.file.type,
          lastModified: new Date(),
        });

        // 将图片加入到上传阵列中
        formData.append(this.postName, file);

        // 图片上传loading
        this.loading = true;

        fetch(this.action, {
          method: 'POST',
          headers: this.uploadHeaders,
          body: formData,
        })
          // eslint-disable-next-line
          .then((res) => {
            // 处理接口返回信息
            if (res.ok) {
              return res.json();
            }
            return res.json()
              .then((e) => {
                throw e;
              });
          })
          .then(({ head_url, head_name, face_token }) => {
            this.$message({
              type: 'success',
              message: '头像上传成功！',
            });
            this.$emit('on-success', head_url, head_name, face_token);
            this.cancelUpload();
          })
          .catch(({ message }) => {
            this.handleError(message);
          })
          .then(() => {
            this.loading = false;
          });
      }, this.file.type);
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
  <div class="app-crop-uploader">

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
          @click="uploadImg">确 定</el-button>
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

