<script>
/**
 * @overview 二维码配置
 *
 * @author suyanping
 */
import QRCode from 'qrcodejs2';

export default {

  name: 'AppQRCode',

  components: {
    QRCode,
  },

  props: {
    codeForm: {
      type: Object,
      default: () => {},
    },

    size: {
      type: Number,
      default: 48,
    },

    codeVal: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      code: '',
    };
  },

  computed: {
    style() {
      return {
        outside: {
          width: `${this.size + 42}px`,
          height: `${this.size + 42}px`,
        },
        inside: {
          width: `${this.size}px`,
          height: `${this.size}px`,
        },
      };
    },


    imageCss() {
      return {
        width: `${this.size * 0.3}px`,
        height: `${this.size * 0.3}px`,
        left: `${(this.size * 0.35) + 20}px`,
        top: `${(this.size * 0.35) + 20}px`,
      };
    },
  },

  methods: {
    changeCode() {
      document.getElementById('qrcode').innerHTML = '';

      this.code = new QRCode(this.$refs.qrCodeUrl, {
        width: this.codeForm.size,
        height: this.codeForm.size,
        text: this.codeForm.content,
        colorDark: this.codeForm.color,
        colorLight: this.codeForm.background_color,
        correctLevel: QRCode.CorrectLevel.H,
      });

      this.$emit('sendSize', this.codeForm.size);
    },

    getLogo(url) {
      this.$emit('sendLogo', url);
    },

    madeCode(upload) {
      this.$emit('buildCode', upload);
    },
  },
};
</script>

<template>
  <div class="app-code">
    <div class="app-code__config">
      <h2>二维码参数配置</h2>

      <el-form
        ref="form"
        :model="codeForm"
        label-position="left"
        label-width="60px">

        <el-form-item
          label="大小："
          prop="size">
          <div class="app-code__size">
            <span>{{ codeForm.size }}px</span>
            <el-slider
              v-model="codeForm.size"
              :min="48"
              :max="800"
              @change="changeCode"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="颜色：">
          <span class="app-code__text">
            前景
          </span>
          <el-color-picker
            v-model="codeForm.color"
            class="app-code__select"
            @change="changeCode"/>

          <span class="app-code__text">
            背景
          </span>
          <el-color-picker
            v-model="codeForm.background_color"
            @change="changeCode"/>
        </el-form-item>

        <el-form-item
          label="LOGO：">
          <AppUploadScale
            :is-button="true"
            btn-text="上传logo"
            @on-success="getLogo"/>
        </el-form-item>
      </el-form>

      <div class="app-code__btn">
        <el-button
          type="primary"
          @click="madeCode">
          生成
        </el-button>

        <el-button
          type="primary"
          @click="madeCode('upload')">
          下载
        </el-button>
      </div>
    </div>

    <div class="app-code__code">
      <el-input
        v-model="codeVal"
        :disabled="true"
        placeholder="请输入内容"/>

      <div
        :style="style.outside"
        class="app-code__show">
        <div
          id="qrcode"
          ref="qrCodeUrl"
          :style="style.inside"/>
        <img
          v-if="codeForm.merge"
          :src="codeForm.merge"
          :style="imageCss"
          class="qrcode__image">
      </div>
    </div>

  </div>
</template>

<style lang="postcss">
.app-code {
  margin: 0 15px;
  display: flex;
}

.app-code__config {
  width: 300px;
  padding-right: 10px;
  border-right: 1px dashed gainsboro;
}

.app-code__config > h2 {
  font-size: 1rem;
}

.app-code__size {
  position: relative;
}

.app-code__size .el-slider {
  width: 160px;
  position: absolute;
  top: 0px;
  left: 70px;
}

.app-code__select{
  margin-right: 30px;
}

.app-code__text{
  margin-right: 10px;
  position: relative;
  top: -15px;
}

.app-code__btn {
  display: flex;
  justify-content: space-around;
}

.app-code__code {
  margin: 30px 0 0 30px;
  width: calc(100% - 330px);
}

.app-code__show{
  margin-top: 20px;
  padding: 20px;
  border: 1px solid gainsboro;
  position: relative;
}

.qrcode__image{
  position: absolute;
}
</style>
