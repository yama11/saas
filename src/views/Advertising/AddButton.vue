<script>
/**
 * @overview 家长端管理 - 广告管理 - 添加按钮
 *
 * @author suyanping
 */

export default {
  name: 'AddButton',

  props: {
    styleSize: {
      type: Object,
      default: () => ({
        width: '180px',
        height: '250px',
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
    addItem() {
      this.$emit('addItem');
    },
  },
};
</script>

<template>
  <div
    :style="style"
    class="add-button"
    @click="addItem">
    <i
      class="el-icon-plus"/>
  </div>
</template>

<style lang="postcss">
.add-button{
  display: inline-block;
  border: 1px solid gainsboro;
  margin: 10px 20px 0 0;
  cursor: pointer;
  position: relative;
}

.add-button .el-icon-plus{
  font-size: 25px;
  position: absolute;
  left: calc((100% - 25px) / 2);
  top: calc((100% - 25px) / 2);
}
</style>
