<script>
/**
 * @overview 家长端管理 - 广告管理
 *
 * @author suyanping
 */
import errorHandler from '@/components/AppFormAlert/errorHandler';
import BootList from './Boot';
import OtherAdvert from './OtherAdvert';
import AdvertForm from './Form';

export default {
  name: 'AdvertisingList',

  components: {
    BootList,
    OtherAdvert,
    AdvertForm,
  },

  data() {
    return {
      advertisingTypes: [],

      advertisingList: [],

      showList: null,

      visible: false,

      formData: {
        title: '',
        link: '',
        image: '',
      },

      imageSize: {
        width: 563,
        height: 1001,
      },

      id: null,

      loading: false,
    };
  },

  created() {
    this.getIndexBefore();
  },

  methods: {
    checkAdvert(key, text) {
      return this.$permissions(`client.advertising.${key}`, text);
    },

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

      if (value === 1 || value === 2) {
        this.imageSize = {
          width: 563,
          height: 1001,
        };

        return;
      }

      if (value === 3) {
        this.imageSize = {
          width: 705,
          height: 956,
        };

        return;
      }

      this.imageSize = {
        width: 1035,
        height: 537,
      };
    },

    getList(value) {
      this.loading = true;

      this.$http.get(`/advertising?equal[advertising_type]=${value}`)
        .then((res) => {
          this.advertisingList = res;
        })
        .catch((error) => {
          this.alertError(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    alertError(error) {
      const errorMessage = errorHandler(error);

      this.$message.error(errorMessage[0]);
    },

    updateData(image, id) {
      const data = {
        title: '',
        advertising_type: 1,
        image,
        link: '',
      };

      const method = id ? 'put' : 'post';
      const url = id ? `/advertising/${id}` : '/advertising';

      this.$http[method](url, data)
        .then(() => {
          this.getList(1);
        })
        .catch((error) => {
          this.alertError(error);
        });
    },

    updateAdvertItem(data) {
      this.createAdvert(data);
    },

    createAdvert(data) {
      this.visible = true;

      if (!data) {
        this.formData = {
          title: '',
          link: '',
          image: '',
        };

        return;
      }

      this.id = data.id;

      this.formData = data;
    },

    closeForm() {
      this.visible = false;
    },

    updateAdvert(value) {
      this.getList(value);

      this.id = null;
    },

    deleteAdvertItem(id) {
      this.$confirm(
        '确定删除该广告？',
        '确认删除',
        {
          showCancelButton: true,
          type: 'danger',
          confirmButtonText: '刪除',
          confirmButtonClass: 'el-button--danger',
        })
        .then(() => {
          this.sureDelete(id);
        })
        .catch(() => {});
    },

    sureDelete(id) {
      this.$http.delete(`/advertising/${id}`)
        .then(() => {
          this.getList(this.showList);
          this.id = null;
        })
        .catch((error) => {
          this.alertError(error);
        });
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

    <div
      v-if="checkAdvert('index')"
      class="advertising-list__select">
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

    <div
      v-loading="loading"
      v-if="checkAdvert('index')"
      class="advertising-list__content">

      <OtherAdvert
        :advertising-list="advertisingList"
        :show-list="showList"
        @advertEvent="createAdvert"
        @updateEvent="updateAdvertItem"
        @deleteEvent="deleteAdvertItem"/>
    </div>

    <AdvertForm
      v-if="visible"
      :show-visible="visible"
      :form-data="formData"
      :id="id"
      :image-size="imageSize"
      :type="showList"
      @close="closeForm"
      @updateList="updateAdvert"/>
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
