<script>
/**
 * @overview 上传图片限制宽、高
 *
 * @author suyanping
 */

export default {
  name: 'AppUploadSize',

  props: {
    value: {
      type: String,
      default: '',
    },

    imageLimit: {
      type: Number,
      default: 20,
    },

    imageSize: {
      type: Object,
      default: () => ({
        width: 563,
        height: 1001,
      }),
    },

    styleSize: {
      type: Object,
      default: () => ({
        width: '150px',
        height: '200px',
      }),
    },
  },

  data() {
    return {

    };
  },

  computed: {
    style() {
      return {
        width: this.styleSize.width,
        height: this.styleSize.height,
      };
    },
  },

  methods: {
    uploadImg() {
      this.$refs.inputImg.click();
    },

    changeImg() {
      const inputs = this.$refs.inputImg;

      const file = inputs.files[0];

      const pattern = /^image\/(jpe?g|png|bmp|JPE?G|PNG|BMP|gif)$/;
      const isPicture = pattern.test(file.type);

      const isLimit20M = file.size / 1024 / 1024 <= this.imageLimit;

      if (!isPicture) {
        this.$message.error('上传图片只能是 JPG、PNG、BMP、GIF 格式!');

        inputs.value = '';

        return;
      }

      if (!isLimit20M) {
        this.$message.error('上传图片大小过大!');

        inputs.value = '';

        return;
      }

      const reader = new FileReader();

      reader.readAsDataURL(file);

      // eslint-disable-next-line
      reader.onload = (e) =>{
        const data = e.target.result;
        const image = new Image();

        image.onload = () => {
          const width = image.width;
          const height = image.height;

          const isWidth = (width === this.imageSize.width);
          const isHeight = (height === this.imageSize.height);

          if (!isWidth || !isHeight) {
            this.$message.error(
              `应上传${this.imageSize.width}*${this.imageSize.height}的图片`,
            );

            inputs.value = '';

            return;
          }

          this.getImgData(file);
        };

        image.src = data;
      };
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

          this.$emit('sendImgUrl', url, param.name);
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
  <div class="app-upload-size">

    <input
      ref="inputImg"
      type="file"
      accept="image/jpg,image/jpeg,image/png,image/bmp,image/gif"
      style="display:none;"
      @change="changeImg">

    <div
      :style="style"
      class="app-upload-size__block"
      @click="uploadImg">
      <i
        v-if="!value"
        :class="['el-icon-plus', 'app-upload-size-block__icon']"/>

      <img
        v-if="value"
        :src="value">
    </div>
  </div>
</template>

<style lang="postcss">
.app-upload-size__block{
  cursor: pointer;
  border: 1px solid gainsboro;
  position: relative;
}

.app-upload-size-block__icon{
  font-size: 25px;
  position: absolute;
  left: calc((100% - 25px) / 2);
  top: calc((100% - 25px) / 2);
}

.app-upload-size__block img{
  width: 100%;
  height: 100%;
}
</style>
