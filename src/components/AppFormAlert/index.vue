
<script>
import errorHandler from './errorHandler';

export default {
  name: 'AppFormAlert',

  props: {
    title: {
      type: String,
      default: '提交出现错误',
    },

    type: {
      type: String,
      default: 'error',
    },

    contents: {
      type: [Object, String],
      default: () => ({}),
    },

    labelWidth: {
      type: String,
      default: '0',
    },

    closable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    flatContents() {
      return Object.keys(this.contents).length ? errorHandler(this.contents) : [];
    },
  },

  methods: {
    // 关闭alert时触发的事件
    close() {
      this.$emit('update:contents', {});
      this.$emit('close');
    },
  },
};
</script>

<template>
  <div
    v-if="flatContents.length"
    :style="{ paddingLeft: labelWidth }"
    class="alert"
  >
    <el-alert
      :title="title"
      :type="type"
      :closable="closable"
      show-icon
      @close="close"
    >
      <div
        v-for="(msg, index) in flatContents"
        :key="index"
        class="alert__content"
        v-html="msg"
      />
    </el-alert>
  </div>

</template>

<style scoped>
.alert .el-alert {
  margin-bottom: 22px;
}

.alert .alert__content {
  font-size: 12px;
  margin: 5px 0 0;
}

</style>
