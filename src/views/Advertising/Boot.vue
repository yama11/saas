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

    isCreateOrUpdate() {
      const length = this.advertisingList.length;
      const isCreate = this.checkAdvert('store');
      const isUpdate = this.checkAdvert('update');

      let isDiable = false;

      if (length === 0 && isCreate) {
        isDiable = true;
      }

      if (length > 0 && isUpdate) {
        isDiable = true;
      }

      return isDiable;
    },
  },

  methods: {
    checkAdvert(key, text) {
      return this.$permissions(`client.advertising.${key}`, text);
    },

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
      v-if="isCreateOrUpdate"
      v-model="imgUrl"
      :style-size="styleSize"
      @sendImgUrl="getImgUrl"/>

    <div
      v-else
      :style="styleSize"
      class="boot-list__block">
      <img :src="imgUrl">
    </div>
  </div>
</template>

<style lang="postcss">
.boot-list__block img{
  width: 100%;
  height: 100%;
}
</style>
