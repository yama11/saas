
<script>
/**
 * 表单弹窗容器组件
 *
 * @author huojinzhao
 * @example
 *
 */
import ElDialog from 'element-ui/packages/dialog';
import mixin from './mixin';

const { title, ...props } = ElDialog.props;

export default {
  name: 'AppFormDialog',

  mixins: [mixin],

  props: {
    ...props,

    // 编辑数据时候需要传入ID
    id: {
      type: Number,
      default: null,
    },

    // 表单是否可见
    visible: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    // 当前编辑主体的ID
    targetID() {
      return this.id;
    },
  },

  watch: {
    visible() {
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
  },

  methods: {
    cancelForm() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<template>
  <el-dialog
    ref="dialog"
    :title="title"
    :visible="visible"
    v-bind="$props"
    class="app-form-dialog"
    @update:visible="value => $emit('update:visible', value)"
  >
    <VForm
      ref="form"
      v-bind="$attrs"
      @on-cancel="cancelForm"
      @on-submit="submitForm"
    >
      <!-- 表单内容 -->
      <slot />
    </VForm>
  </el-dialog>
</template>


<style lang="postcss">
.app-form-dialog .el-dialog__body {
  padding-bottom: 0;
}

.app-form-dialog .app-form__footer {
  text-align: right;
  padding-bottom: 1.5em;
}
</style>
