
<script>
/**
 * @author  huojinzhao
 *
 * @example 支持事件
 *    表单提交事件  @on-submit  提供validate和callback两个函数参数
 *    表单取消时间  @on-cancel
 *
 * 支持属性：继承el-form属性，可参考element文档
 */
import ElForm from 'element-ui/packages/form/src/form';

export default {

  name: 'AppForm',

  props: {
    ...ElForm.props,

    // 确认按钮文案
    submitText: {
      type: String,
      default: '提交',
    },

    cancelText: {
    // 取消按钮文案
      type: String,
      default: '取消',
    },
  },

  data() {
    return {
      // 提交按钮loading
      loading: false,

      // 服务端返回的错误信息
      alertInfo: {},
    };
  },

  methods: {
    // 提交表单前校验的预处理
    submitValidate() {
      let result = false;

      this.validate((valid) => { result = valid; });

      if (!result) this.loading = false;

      return result;
    },

    // 提交表单后的行为
    submitCallback(error) {
      // 若提交错误，显示后端返回的错误信息
      if (error) this.alertInfo = error;

      this.loading = false;
    },

    // 提交表单
    submit() {
      // 重置表单错误信息
      this.alertInfo = {};
      // 开启提交按钮loading
      this.loading = true;

      this.$emit(
        'on-submit',
        this.submitValidate,
        this.submitCallback,
      );
    },

    // 取消表单编辑事件
    cancel() {
      this.$emit('on-cancel');
      this.loading = false;
      this.alertInfo = {};
    },

    /**
     * 提供el-form的api
     */

    validate(callback) {
      this.$refs.form.validate(callback);
    },

    clearValidate() {
      this.$refs.form.clearValidate();
    },
  },
};
</script>

<template>
  <el-form
    ref="form"
    v-bind="$props"
    class="app-form"
  >
    <!-- 表单内容 -->
    <slot/>

    <!-- 表单提交服务响应信息 -->
    <AppFormAlert
      :contents="alertInfo"
      :label-width="labelWidth"
    />

    <!-- 表单底部内容 -->
    <el-form-item class="app-form__footer">
      <slot name="footer">
        <el-button
          :loading="loading"
          type="primary"
          @click="submit"
        >
          {{ submitText }}
        </el-button>
        <el-button
          :disabled="loading"
          @click="cancel"
        >
          {{ cancelText }}
        </el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<style lang="postcss">
.app-form {

}
</style>
