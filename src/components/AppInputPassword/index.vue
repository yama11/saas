<script>
/**
 * @author  huojinzhao
 */

import ElInput from 'element-ui/packages/input/src/input';

export default {
  name: 'AppInputPassword',

  extend: ElInput,

  props: {
    value: {
      type: String,
      required: true,
    },

    exposed: {
      type: Boolean,
      default: false,
    },

    toggle: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    visible: false,
  }),

  computed: {
    passwordLen() {
      return this.value.length;
    },

    // 原生input[type='password']存在控制问题
    // 使用input[type='text']重写
    password: {
      get() {
        return this.visible
          ? this.value
          : '•'.repeat(this.passwordLen);
      },
      set(val) {
        let password = '';
        const delta = this.passwordLen - val.length;

        // eslint-disable-next-line
        delta > 0
          ? (password = this.value.slice(0, -delta))
          : (password = `${this.value}${val.slice(delta)}`);

        this.$emit('input', password);
      },
    },
  },

  created() {
    this.visible = this.exposed;
  },

  methods: {
    togglePasswordVisible() {
      this.visible = !this.visible;
    },
  },
};
</script>

<template>
  <el-input
    v-model="password"
    v-bind="$attrs"
    class="app-input-password"
  >
    <i
      v-if="toggle"
      slot="append"
      class="iconfont icon-eye"
      @click="togglePasswordVisible"
    />
  </el-input>
</template>

<style lang="postcss">
.app-input-password .el-input-group__append {
  padding: 0 10px;

  & i:hover {
    color: var(--color-primary);
    cursor: pointer;
  }
}

.app-input-password .iconfont {
}
</style>
