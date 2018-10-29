<script>
/**
 * @overview 家长端管理 - 广告管理
 *
 * @author suyanping
 */
import errorHandler from '@/components/AppFormAlert/errorHandler';
import BootList from './Boot';
import BootAdvertising from './BootAdvertising';
import AlertList from './Alert';
import BannerList from './Banner';

export default {
  name: 'AdvertisingList',

  components: {
    BootList,
    BootAdvertising,
    AlertList,
    BannerList,
  },

  data() {
    return {
      advertisingTypes: [],

      advertisingList: [],

      showList: null,
    };
  },

  created() {
    this.getIndexBefore();
  },

  methods: {
    getIndexBefore() {
      this.$http.get('/advertising/index_before')
        .then((res) => {
          if (res.advertising_types.length > 0) {
            this.advertisingTypes = res.advertising_types;

            this.showList = res.advertising_types[0].value;

            this.getList(this.showList);
          }
        })
        .catch((error) => {
          this.alertError(error);
        });
    },

    changeType(value) {
      this.showList = value;

      this.getList(this.showList);
    },

    getList(value) {
      this.advertisingList = [];

      this.$http.get(`/advertising?equal[advertising_type]=${value}`)
        .then((res) => {
          this.advertisingList = res.data;
        })
        .catch((error) => {
          this.alertError(error);
        });
    },

    alertError(error) {
      const errorMessage = errorHandler(error);

      this.$message.error(errorMessage[0]);
    },
  },
};
</script>

<template>
  <div class="advertising-list">
    <h2 class="advertising-list__title">
      广告管理
    </h2>

    <hr>

    <div class="advertising-list__select">
      <el-button
        v-for="(btn,index) in advertisingTypes"
        :key="index"
        :disabled="btn.value === showList"
        type="primary"
        size="small"
        plain
        @click="changeType(btn.value)">
        {{ btn.name }}
      </el-button>
    </div>

    <div class="advertising-list__content">
      <BootList
        v-if="showList === 1"
        :advertising-list="advertisingList"/>

      <BootAdvertising
        v-if="showList === 2"
        :advertising-list="advertisingList"/>

      <AlertList
        v-if="showList === 3"
        :advertising-list="advertisingList"/>

      <BannerList
        v-if="showList === 4"
        :advertising-list="advertisingList"/>
    </div>
  </div>
</template>

<style lang="postcss">
.advertising-list__title{
  font-size: 1rem;
}

.advertising-list__content{
  margin-top: 20px;
}
</style>
