<template>
  <div class="app-search-status">
    <el-select
      v-model="selectValue"
      :style="{ width: selectStatusWidth }"
      clearable
      size="small"
      placeholder="请选择"
    >
      <el-option
        v-for="state in searchList"
        :key="state.value"
        :label="state.name"
        :value="state.value"
      />
    </el-select>
  </div>
</template>

<script>
/**
 * 搜索--状态选择
 *
 * @author  suyanping
 */

export default {
  name: 'AppSearchStatus',

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
      selectValue: '',
    };
  },

  computed: {
    selectStatusWidth() {
      const maxLength = Math.max(
        ...this.searchList.map(({ name }) => name.length),
      );

      return `${maxLength + 4}em`;
    },
  },

  watch: {
    selectValue(value) {
      if (!value && value !== 0) {
        this.$emit('input', '');

        return;
      }

      this.$emit('input', `equal[${this.type}]:${value}`);
    },
  },

  created() {
    this.getUrlData();
  },

  methods: {
    getUrlData() {
      const { page, per_page, ...search } = this.$route.query;

      const status = `equal[${this.type}]`;

      if (status in search) {
        this.selectValue = Number(search[status]);
      }
    },
  },

};
</script>

<style lang="postcss">
.app-search-status{
  display: inline-block;
  margin-left: 1em;
}
</style>
