<template>
  <div class="app-search-address">
    <el-cascader
      :change-on-select = "true"
      :options="searchList"
      v-model="place"
      :placeholder="placeholder"
      clearable
      size="small"
    />
  </div>
</template>

<script>
/**
 * 搜索--地区选择
 *
 * @author  suyanping
 */

export default {
  name: 'AppSearchAddress',

  props: {
    value: {
      type: String,
      default: '',
    },

    searchList: {
      type: Array,
      default: () => [],
    },

    type: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
      default: '选择地区',
    },
  },

  data() {
    return {
      place: [],

      placeType: `equal[${this.type}][]`,
    };
  },

  watch: {
    place(value) {
      if (value.length === 0) {
        this.$emit('input', '');

        return;
      }

      const places = value.join(`&${this.placeType}=`);

      this.$emit('input', `${this.placeType}:${places}`);
    },
  },

  created() {
    this.getUrlData();
  },

  methods: {
    getUrlData() {
      const { page, per_page, ...search } = this.$route.query;

      if (this.placeType in search) {
        const data = search[this.placeType];

        const placeArr = data.split(`&${this.placeType}=`);

        this.place = placeArr.map(item => Number(item));
      }
    },
  },
};
</script>

<style lang="postcss">
.app-search-address{
  display: inline-block;
  margin-left: 1em;
}
</style>
