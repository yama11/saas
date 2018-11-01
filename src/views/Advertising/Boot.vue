<script>
/**
 * @overview 家长端管理 - 广告管理 - 启动页
 *
 * @author suyanping
 */

export default {
  name: 'BootList',

  props: {
    advertisingList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      styleSize: {
        width: '200px',
        height: '300px',
      },
    };
  },

  computed: {
    imgUrl() {
      const length = this.advertisingList.length;

      return length > 0
        ? this.advertisingList[0].image
        : '';
    },

    imgId() {
      const length = this.advertisingList.length;

      return length > 0
        ? this.advertisingList[0].id
        : null;
    },
  },

  methods: {
    getImgUrl(url) {
      this.$emit('updateImg', url, this.imgId);
    },
  },
};
</script>

<template>
  <div
    class="boot-list">

    <AppUploadSize
      v-model="imgUrl"
      :style-size="styleSize"
      @sendImgUrl="getImgUrl"/>

  </div>
</template>

<style lang="postcss">
.boot-list{

}
</style>
