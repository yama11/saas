<script>
/**
 * @overview 家长端管理 - 广告管理 - 启动页广告/首页弹框广告/banner广告
 *
 * @author suyanping
 */
import AdvertItem from './AdvertItem';
import AddButton from './AddButton';

export default {
  name: 'OtherAdvert',

  components: {
    AdvertItem,
    AddButton,
  },

  props: {
    advertisingList: {
      type: Array,
      default: () => [],
    },

    showList: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {

    };
  },

  computed: {
    styleSize() {
      return this.showList === 4
        ? {
          width: '220px',
          height: '170px',
          imgHeight: '100px',
        }
        : {
          width: '180px',
          height: '250px',
          imgHeight: '180px',
        };
    },
  },

  methods: {
    checkAdvert(key, text) {
      return this.$permissions(`client.advertising.${key}`, text);
    },

    addAdvert() {
      this.$emit('advertEvent');
    },

    updateAdvert(data) {
      this.$emit('updateEvent', data);
    },

    deleteAdvert(id) {
      this.$emit('deleteEvent', id);
    },
  },
};
</script>

<template>
  <div class="other-advert">
    <AdvertItem
      v-for="item in advertisingList"
      :key="item.id"
      :data-form="item"
      :style-size="styleSize"
      @update="updateAdvert"
      @delete="deleteAdvert"/>

    <AddButton
      v-if="checkAdvert('store')"
      :style-size="styleSize"
      @addItem="addAdvert"/>
  </div>
</template>

<style lang="postcss">
.other-advert{
  display: flex;
  flex-wrap: wrap;
}
</style>
