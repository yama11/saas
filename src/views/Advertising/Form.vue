<script>
/**
 * @overview 家长端管理 - 广告管理 - 创建、编辑表单
 *
 * @author suyanping
 */
import errorHandler from '@/components/AppFormAlert/errorHandler';

export default {
  name: 'AdvertForm',

  props: {
    showVisible: {
      type: Boolean,
      default: false,
    },

    formData: {
      type: Object,
      default: () => {},
    },

    type: {
      type: Number,
      default: null,
    },

    id: {
      type: Number,
      default: null,
    },

    imageSize: {
      type: Object,
      default: () => ({
        width: 375,
        height: 667,
      }),
    },
  },

  data() {
    return {

      dataForm: JSON.parse(JSON.stringify(this.formData)),

      rules: {
        title: [
          { required: true, message: '请输入标题' },
        ],

        image: [
          { required: true, message: '请上传广告图片' },
        ],
      },

      btnLoading: false,
    };
  },

  computed: {
    title() {
      return this.id ? '编辑广告' : '添加广告';
    },
  },

  created() {

  },

  methods: {
    getImage(image) {
      this.dataForm = {
        ...this.dataForm,
        image,
      };
    },

    sureBtn(advertForm) {
      this.btnLoading = true;

      this.$refs[advertForm].validate((valid) => {
        if (!valid) {
          this.btnLoading = false;

          return;
        }

        this.dataForm = {
          ...this.dataForm,
          advertising_type: this.type,
        };

        const method = this.id ? 'put' : 'post';
        const url = this.id ? `/advertising/${this.id}` : '/advertising';

        this.$http[method](url, this.dataForm)
          .then(() => {
            this.$emit('updateList', this.type);

            this.cancelBtn();
          })
          .catch((error) => {
            const errorMessage = errorHandler(error);

            this.$message.error(errorMessage[0]);
          });
      });
    },

    cancelBtn() {
      this.btnLoading = false;

      this.$emit('close');
    },
  },
};
</script>

<template>
  <el-dialog
    :visible="showVisible"
    :title="title"
    width="700px"
    class="advert-dialog"
    @close="cancelBtn">
    <el-form
      ref="advertForm"
      :model="dataForm"
      :rules="rules"
      label-width="100px"
      class="advert-form">

      <el-form-item
        label="标题"
        prop="title">
        <el-input
          v-model="dataForm.title"
          :maxlength="20"
          placeholder="请输入标题"
        />
      </el-form-item>

      <el-form-item
        label="广告图片"
        prop="image">
        <AppUploadSize
          v-model="dataForm.image"
          :image-size="imageSize"
          @sendImgUrl="getImage"/>
      </el-form-item>

      <el-form-item
        label="链接"
        prop="link">
        <el-input
          v-model="dataForm.link"
          :image-size="imageSize"
          placeholder="请输入链接"
        />
      </el-form-item>

    </el-form>

    <span
      slot="footer"
      class="advert-dialog__footer">
      <el-button
        @click="cancelBtn">
        取 消
      </el-button>

      <el-button
        :loading="btnLoading"
        type="primary"
        @click="sureBtn('advertForm')">
        确 定
      </el-button>
    </span>

  </el-dialog>
</template>

<style lang="postcss">
.advert-form .el-input{
  width: 500px;
}
</style>
