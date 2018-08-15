<template>
  <div class="app-search-cascader">
    <el-cascader
      v-model="selectValue"
      :options="searchList"
      clearable
      size="small"
      change-on-select
    />
  </div>
</template>

<script>
/**
 * 搜索--级联状态选择
 *
 * @author  suyanping
 */

export default {
  name: 'AppSearchCascader',

  props: {
    value: {
      type: Object,
      default: () => {},
    },

    searchList: {
      type: Array,
      default: () => [],
    },

    type: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      selectValue: [],
    };
  },

  watch: {
    selectValue(value) {
      if (value.length === 0) {
        this.$emit('input', {});

        return;
      }

      const arrStr = value.reduce(((acc, item, index) => {
        const type = `like[${this.type[index]}]`;

        if (item) {
          acc[type] = item;
        }

        return acc;
      }), {});

      this.$emit('input', arrStr);
    },
  },

  created() {
    this.getUrlData();
  },

  methods: {
    getUrlData() {
      const { page, per_page, ...search } = this.$route.query;

      this.selectValue = this.type.map((item) => {
        const status = `like[${item}]`;

        return search[status];
      });
    },
  },

};
</script>

<style lang="postcss">
.app-search-cascader{
  display: inline-block;
  margin-left: 1em;
}
</style>
