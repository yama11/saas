<template>
  <div class="app-search-date">
    <div v-if="searchList.length > 0">
      <el-select
        v-model="dateType"
        clearable
        size="small"
        placeholder="选择日期类型"
        style="margin-left: 1em;"
      >
        <el-option
          v-for="(type,index) in searchList"
          :key="index"
          :label="type.name"
          :value="type.type"
        />
      </el-select>
      <el-date-picker
        v-model="dateValue"
        style="width: 290px;margin-left:1em;"
        type="daterange"
        range-separator="-"
        size="small"
        start-placeholder="选择日期"
        end-placeholder="选择日期"
        value-format="yyyy-MM-dd"/>
    </div>
    <div v-else>
      <el-date-picker
        v-model="timeValue"
        style="width: 290px;margin-left:1em;"
        type="daterange"
        range-separator="-"
        size="small"
        start-placeholder="选择日期"
        end-placeholder="选择日期"
        value-format="yyyy-MM-dd"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSearchDate',

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

  },

  data() {
    return {
      dateType: '',

      dateValue: [],

      timeValue: [],

      timeType: `between[${this.type}][]`,
    };
  },

  watch: {
    dateType(value) {
      this.getUrl(value, this.dateValue);
    },

    dateValue(value) {
      this.getUrl(this.dateType, value);
    },

    timeValue(value) {
      if (!value) {
        this.$emit('input', '');

        return;
      }

      const dates = value.join(`&${this.timeType}=`);

      this.$emit('input', `${this.timeType}:${dates}`);
    },
  },

  created() {
    this.getStatusDate();
  },

  methods: {
    getStatusDate() {
      const { page, per_page, ...search } = this.$route.query;

      const keyList = Object.keys(search);

      if (keyList.length === 0) return;

      if (this.timeType in search) {
        const data = search[this.timeType];

        this.timeValue = data.split(`&${this.timeType}=`);

        return;
      }

      const data = keyList.find((item) => {
        const betweenExist = item.indexOf('between') !== -1;

        const betweenCreated = item.indexOf('between[created_at]') === -1;

        return betweenExist && betweenCreated;
      });

      if (data !== undefined) {
        this.dateValue = search[data].split(`&${data}=`);

        this.dateType = data.slice(8, -3);
      }
    },

    getUrl(key, value) {
      if (!key) {
        this.$emit('input', '');
        return;
      }

      if (!value || value.length === 0) {
        this.$emit('input', '');
        return;
      }

      const keys = `between[${key}][]`;
      const dates = value.join(`&${keys}=`);

      this.$emit('input', `${keys}:${dates}`);
    },
  },
};
</script>

<style lang="postcss">
.app-search-date{
  display: inline-block;
  & div{
    display: inline-block;
  }
}
</style>
