<script>
/**
 * @overview 家长端管理 - 广告管理 - 广告显示item
 *
 * @author suyanping
 */

export default {
  name: 'AdvertItem',

  props: {
    dataForm: {
      type: Object,
      default: () => {},
    },

    styleSize: {
      type: Object,
      default: () => ({
        width: '180px',
        height: '250px',
        imgHeight: '180px',
      }),
    },
  },

  data() {
    return {

    };
  },

  computed: {
    style() {
      const itemStyle = {
        width: this.styleSize.width,
        height: this.styleSize.height,
      };

      const imgStyle = {
        height: this.styleSize.imgHeight,
      };

      return { itemStyle, imgStyle };
    },
  },

  created() {

  },

  methods: {
    getLinkVideo(link) {
      if (link) {
        window.open(link);
      }
    },

    updateEvent(data) {
      this.$emit('update', data);
    },

    deleteEvent(id) {
      this.$emit('delete', id);
    },
  },
};
</script>

<template>
  <div
    :style="style.itemStyle"
    class="advert-item">
    <div
      class="advert-item__image"
      @click="getLinkVideo(dataForm.link)">
      <img
        :src="dataForm.image"
        :style="style.imgStyle">
    </div>

    <div class="advert-item__content">
      <div class="advert-item__title">
        {{ dataForm.title }}
      </div>

      <div class="advert-item__action">
        <i
          class="el-icon-edit"
          @click="updateEvent(dataForm)">
          编辑
        </i>

        <i
          class="el-icon-delete"
          @click="deleteEvent(dataForm.id)">
          删除
        </i>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.advert-item{
  display: inline-block;
  margin: 10px 20px 0 0;
  border: 1px solid gainsboro;
  position: relative;
}

.advert-item__image{
  cursor: pointer;
}

.advert-item__image img{
  width: 100%;
  border-bottom: 1px solid gainsboro;
}

.advert-item__content{
  padding: 5px 0px 5px 10px;
}

.advert-item__title{
  font-size: 14px;
}

.advert-item__action{
  width: 90%;
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 5px;
}

.advert-item__action i{
  cursor: pointer;
}
</style>
