<script>
/**
 * @overview 家长端管理 - 视频配置 - 视频item
 *
 * @author suyanping
 */

export default {
  name: 'VideoItem',

  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {

    };
  },

  methods: {
    getLinkVideo(link) {
      if (link) {
        window.open(link);
      }
    },

    updateEvent(id) {
      this.$emit('getUpdate', id);
    },

    deleteEvent(id) {
      this.$emit('getDelete', id);
    },

    shelveEvent(id) {
      this.$emit('getShelve', id);
    },

    offShelveEvent(id) {
      this.$emit('getOffShelve', id);
    },
  },
};
</script>

<template>
  <div class="video-item">
    <div
      class="video-item__image"
      @click="getLinkVideo(data.link)">
      <img :src="data.cover_image">
    </div>

    <div class="video-item__content">
      <div class="video-item__title">
        {{ data.title }}
      </div>

      <div class="video-item__desc">
        {{ data.description }}
      </div>

      <div class="video-item__action">

        <i
          v-if="data.video_status === 3"
          class="el-icon-upload2"
          @click="shelveEvent(data.id)">
          上架
        </i>

        <i
          v-if="data.video_status === 2"
          class="el-icon-download"
          @click="offShelveEvent(data.id)">
          下架
        </i>

        <i
          class="el-icon-edit"
          @click="updateEvent(data.id)">
          编辑
        </i>

        <i
          class="el-icon-delete"
          @click="deleteEvent(data.id)">
          删除
        </i>
      </div>

    </div>

  </div>
</template>

<style lang="postcss">
.video-item{
  display: inline-block;
  width: 250px;
  height: 270px;
  border: 1px solid gainsboro;
  margin: 20px 20px 0 0;
  position: relative;
}

.video-item__image{
  cursor: pointer;
}

.video-item__image img{
  width: 100%;
  height: 150px;
  border-bottom: 1px solid gainsboro;
}

.video-item__content{
  height: 120px;
  padding: 15px 0px 5px 10px;
}

.video-item__title{
  font-size: 15px;
}

.video-item__desc{
  font-size: 13px;
  color: darkgray;
}

.video-item__action{
  width: 90%;
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 5px;
}

.video-item__action i{
  cursor: pointer;
}
</style>
