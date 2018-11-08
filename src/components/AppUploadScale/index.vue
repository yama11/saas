<script>
/**
 * @overview 图片上传压缩
 *
 * @author suyanping
 */

export default {
  name: 'AppUploadScale',

  props: {
    // 双向绑定值
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {

    };
  },

  computed: {
    style() {
      return this.value ? '' : { border: '1px solid gainsboro' };
    },
  },

  methods: {
    uploadImg() {
      this.$refs.inputImg.click();
    },

    changeImg() {
      const inputs = this.$refs.inputImg;

      const file = inputs.files[0];

      const pattern = /^image\/(jpe?g|png|bmp|JPE?G|PNG|BMP)$/;
      const isPicture = pattern.test(file.type);

      const isLimit2M = file.size / 1024 / 1024 <= 2;

      if (!isPicture) {
        this.$message.error('上传图片只能是 JPG、PNG、BMP 格式!');

        inputs.value = '';

        return;
      }

      if (isLimit2M) {
        this.getImgData(file);

        inputs.value = '';

        return;
      }

      this.getScalePhoto(file, { quality: 0.3 }, (base64Codes) => {
        const newFile = this.convertBase64UrlToFile(base64Codes, file.name);

        const isAgainLimit2M = newFile.size / 1024 / 1024 <= 2;

        if (!isAgainLimit2M) {
          this.$message.error('上传图片大小过大!');

          return;
        }

        this.getImgData(newFile);
      });

      inputs.value = '';
    },

    getScalePhoto(file, percentage, objDiv) {
      const that = this;
      const ready = new FileReader();

      ready.readAsDataURL(file);

      // eslint-disable-next-line
      ready.onload = function () {
        const result = this.result;
        that.canvasDataURL(file.type, result, percentage, objDiv);
      };
    },

    canvasDataURL(type, path, obj, callback) {
      const img = new Image();
      const imgType = type || 'image/jpeg';

      img.src = path;
      // eslint-disable-next-line
      img.onload = function () {
        const that = this;
        // 默认按比例压缩
        // eslint-disable-next-line
        let w = that.width,h = that.height,scale = h / w;
        w = obj.width || w;
        h = obj.height || (w / scale);

        let quality = 0.5; // 默认图片质量为0.5

        // 生成canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 创建属性节点
        const anw = document.createAttribute('width');
        anw.nodeValue = w;

        const anh = document.createAttribute('height');
        anh.nodeValue = h;

        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);

        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }

        // quality值越小，所绘制出的图像越模糊
        const base64 = canvas.toDataURL(imgType, quality);

        // 回调函数返回base64的值
        callback(base64);
      };
    },

    convertBase64UrlToFile(urlData, filename) {
      // eslint-disable-next-line
      let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],bstr = atob(arr[1]),n = bstr.length,u8arr = new Uint8Array(n);

      // eslint-disable-next-line
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },

    getImgData(file) {
      const formData = new FormData();

      formData.append('chunk', '0');// 断点传输
      formData.append('chunks', '1');

      formData.append('file', file, file.name);

      const fileType = file.type.split('/')[1];

      // 先从自己的服务端拿到token
      this.$http.get(`/upload/token/${fileType}`)
        .then((res) => {
          formData.append('token', res.token);
          formData.append('key', res.key);

          this.uploading(formData, file);// 然后将参数上传七牛
        });
    },

    uploading(param) {
      const addr = 'https://oa-statics.caihonggou.com/';

      this.$http.post('https://upload.qiniup.com/', param)
        .then((res) => {
          const url = addr + res.key;

          this.$emit('on-success', url, param.name);
        })
        .catch(({ message }) => {
          this.$message({
            type: 'error',
            message,
          });
        });
    },

  },
};
</script>

<template>
  <div class="app-upload-scale">
    <input
      ref="inputImg"
      type="file"
      accept="image/jpg,image/jpeg,image/png,image/bmp"
      style="display:none;"
      @change="changeImg">

    <div
      :style="style"
      class="app-upload-scale__block"
      @click="uploadImg">
      <img
        v-if="value"
        :src="value">
    </div>
  </div>
</template>

<style lang="postcss">
.app-upload-scale{
  display: inline-block;
}
.app-upload-scale__block {
  cursor: pointer;
  width: 100px;
  height: 100px;
}

</style>
