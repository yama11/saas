<template>
  <div class="app-check-map">
    <slot />
  </div>
</template>

<script>
/**
 * @author  huojinzhao
 * @desc    多选级联容器组件
 */

export default {
  name: 'AppCheckMap',

  provide() {
    return {
      $_appCheckMap: this,
      $_appCheckMap_isValueIncluded: this.isBoxValueIncluded,
      $_appCheckMap_reportMap: this.getBoxReport,
    };
  },

  props: {
    value: {
      type: [Array],
      required: true,
    },

    // [suspend] 扩展，父box下行响应
    downStream: {
      type: Boolean,
      default: false,
    },

    // [suspend] 扩展，子box上行响应
    upStream: {
      type: Boolean,
      default: false,
    },

    // [suspend] 扩展，子集排列方向
    direction: {
      type: String,
      default: 'column',
    },
  },

  methods: {
    /**
     * 从AppCheckBox获取需要处理的值
     * @param   {Boolean}   state   false:删除 true:添加
     * @param   {any}       value   单值 || 值数组
     */
    getBoxReport(state, value) {
      const valueArr = value instanceof Array ? value : [value];

      return state
        ? this.concatList(valueArr)
        : this.fliterList(valueArr);
    },

    /**
     * 插入操作 - 将获得的值列表插入当前值列表
     * @param   {Array}     list     从AppCheckBox获取的值列表
     */
    concatList(list) {
      const arr = [...this.value, ...list];

      this.$emit('input', Array.from(new Set(arr)));
    },

    /**
     * 删除操作 - 从当前值列表中过滤获得的值列表
     * @param   {Array}     list     从AppCheckBox获取的值列表
     */
    fliterList(list) {
      const arr = this.value
        .filter(item => !list.includes(item));

      this.$emit('input', arr);
    },

    isBoxValueIncluded(value) {
      return this.value.includes(value);
    },
  },
};
</script>

<style lang="postcss">
.app-check-map {

}
</style>
