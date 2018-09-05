<script>
/**
 * @overview 版本管理 - 发布版本
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';

export default {

  name: 'PackageForm',

  mixins: [form],

  data() {
    return {

      PackageForm: {
        update_type: 1,
        production: null,
        increment: '',
        increment_size: '',
        full: '',
        full_size: '',
        version: '',
        content: '',
      },

      rules: {
        production: [
          this.$rules.required('产品', 'number'),
        ],
        update_type: [
          this.$rules.required('更新方式', 'number'),
        ],
        full: [
          this.$rules.required('全量安装包'),
        ],
        version: [
          this.$rules.required('版本号'),
        ],
      },

      packStoreBefore: {
        production: {},
        update_type: [],
      },

      url: '/upload/zip',

      uploadForm: {
        name: '',
        size: '',
      },

      adduploadForm: {
        name: '',
        size: '',
      },

    };
  },

  computed: {

    uploadURL() {
      const productionURL = this.$http.baseURI + this.url;

      return productionURL;
    },

    adduploadURL() {
      const addproductionURL = this.$http.baseURI + this.url;

      return addproductionURL;
    },

    uploadHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
    },

  },

  methods: {

    getFormBefore() {
      this.$http.get('/package/store_before')
        .then((res) => {
          this.packStoreBefore = res;
        });
    },

    wareRemoved() {
      this.PackageForm.full = '';
    },

    addwareRemoved() {
      this.PackageForm.increment = '';
    },

    // 全量安装包上传成功
    wareUploaded(file) {
      this.uploadForm = file;
      this.PackageForm.full_size = file.size;
      this.PackageForm.full = file.url;
    },

    // 增量安装包上传成功
    addwareUploaded(file) {
      this.adduploadForm = file;
      this.PackageForm.increment_size = file.size;
      this.PackageForm.increment = file.url;
    },

    // 安装包上传失败
    errUpload(err) {
      this.$message.error(err.message);
    },

    // 上传安装包格式
    wareBeforeUploaded(file) {
      // eslint-disable-next-line
      const pattern = (/\.[^\.]+$/.exec(file.name)[0]).toLocaleLowerCase();

      const isType = (pattern === '.7z' || pattern === '.zip');

      if (!isType) this.$message.error('只能上传7z或者zip格式的文件');

      return isType;
    },

    submitForm(submit) {
      submit();
    },
  },
};
</script>

<template>
  <AppFormPage
    ref="PackageForm"
    :model="PackageForm"
    :rules="rules"
    :from="from"
    url="/package"
    object="发布新版本"
    label-width="100px"
    @on-submit="submitForm"
  >

    <el-form-item
      label="产品"
      prop="production"
    >
      <el-radio
        v-for="level in packStoreBefore.package_productions"
        v-model="PackageForm.production"
        :label="level.value"
        :key="level.value">
        {{ level.name }}
      </el-radio>
    </el-form-item>

    <el-form-item
      label="全量安装包"
      prop="full"
    >
      <el-upload
        :action="uploadURL"
        :headers="uploadHeaders"
        :on-remove="wareRemoved"
        :on-success="wareUploaded"
        :on-error="errUpload"
        :limit="1"
        :before-upload="wareBeforeUploaded"
        name="resource"
      >
        <el-button size="small">请选择安装包</el-button>

      </el-upload>
      <div
        v-if="uploadForm.size"
      >
        安装包：{{ uploadForm.name }}
        大小：{{ uploadForm.size }}
      </div>
    </el-form-item>

    <el-form-item
      label="增量安装包"
      prop="increment"
    >
      <el-upload
        :action="adduploadURL"
        :headers="uploadHeaders"
        :on-remove="addwareRemoved"
        :on-success="addwareUploaded"
        :on-error="errUpload"
        :limit="1"
        :before-upload="wareBeforeUploaded"
        name="resource"
      >
        <el-button size="small">请选择安装包</el-button>
      </el-upload>
      <div
        v-if="adduploadForm.size"
      >
        安装包：{{ adduploadForm.name }}
        大小：{{ adduploadForm.size }}
      </div>
    </el-form-item>

    <el-form-item
      label="版本号"
      prop="version"
    >
      <el-input
        v-model="PackageForm.version"
        :maxlength="30"
        placeholder="请输入版本号"
      />
    </el-form-item>

    <el-form-item
      label="更新方式"
      prop="update_type"
    >
      <el-radio
        v-for="level in packStoreBefore.update_types"
        v-model="PackageForm.update_type"
        :label="level.value"
        :key="level.value">
        {{ level.name }}
      </el-radio>
    </el-form-item>

    <el-form-item
      prop="content"
      label="更新内容"
    >
      <el-input
        v-model="PackageForm.content"
        :autosize="{ minRows: 4, maxRows: 100}"
        :maxlength="200"
        placeholder="请输入更新内容描述"
        type="textarea"
      />
    </el-form-item>

  </AppFormPage>
</template>


<style lang="postcss">

</style>
