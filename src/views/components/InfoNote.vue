<script>
/**
 * @overview  便签
 *
 * @author suyanping
 */

export default {
  name: 'OrderInfoNote',

  props: {
    label: {
      type: String,
      default: '',
    },

    content: {
      type: String,
      default: '',
    },
  },
};
</script>

<template>
  <div class="order-info-note">
    <span>{{ label }}</span>
    :
    <span>{{ content }}</span>
  </div>
</template>

<style lang="postcss">
.order-info-note {

}
</style>
