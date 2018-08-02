
<script>
/**
 * 表单页容器组件
 *
 * @author  huojinzhao
 * @example
 *
 */
import mixin from './mixin';

export default {
  name: 'AppFormPage',

  mixins: [mixin],

  props: {
    // type: $route
    from: {
      type: Object,
      default: null,
    },
  },

  methods: {
    // 取消表单编辑事件
    cancelForm() {
      if (this.from.matched.length) {
        return this.$router.back();
      }

      const prefix = this.$route.path.match(/^\/\w+-/)[0];

      const location = (prefix && prefix.concat('list')) || '/';

      return this.$router.push(location);
    },
  },
};
</script>

<template>
  <div
    class="app-form-page"
  >
    <!-- 表单标题 -->
    <header
      v-if="object"
      class="app-form-page__header"
    >
      <h2 class="app-form-page__title">{{ object }}</h2>
    </header>


    <VForm
      ref="form"
      v-bind="$attrs"
      class="app-form-page__body"
      @on-submit="submitForm"
      @on-cancel="cancelForm"
    >
      <!-- 表单内容 -->
      <slot/>

      <slot
        slot="footer"
        name="footer"
      />
    </VForm>
  </div>
</template>

<script>
/**
 * 表单页容器组件
 *
 * @author  huojinzhao
 * @example
 *
 */
import mixin from './mixin';

export default {
  name: 'AppFormPage',

  mixins: [mixin],

  props: {
    // type: $route
    from: {
      type: Object,
      default: null,
    },
  },

  methods: {
    // 取消表单编辑事件
    cancelForm() {
      if (this.from.matched.length) {
        return this.$router.back();
      }

      const prefix = this.$route.path.match(/^\/\w+-/)[0];

      const location = (prefix && prefix.concat('list')) || '/';

      return this.$router.push(location);
    },
  },
};
</script>

<style>
.app-form-page {
  display: flex;
  flex-direction: column;
  padding: 0 2em;
}

.app-form-page__header {
  display: flex;
  align-items: center;
  padding: 1em 0;
}

.app-form-page__title {
  font-size: 1rem;
}

.app-form-page__body {
  /* width: calc((100vw - 500px) / 1.75); */
  min-width: 350px;
}
</style>
