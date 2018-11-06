<template>
  <div
    class="app-search-column">
    <el-input
      v-if="hasSelect"
      v-model="inputValue"
      class="list-header__input"
      placeholder="请输入关键字进行搜索"
      size="small"
      @keyup.enter.native="search"
    >
      <el-select
        slot="prepend"
        v-model="selectValue"
        :style="{ width: selectWidth }"
        placeholder="请选择"
      >
        <el-option
          v-for="column in type"
          :key="column.prop"
          :label="column.label"
          :value="column.prop.split('.').join('_')"
        />
      </el-select>
    </el-input>

    <el-input
      v-else
      v-model="onlyInputValue"
      :placeholder="placeholder"
      class="list-header__input"
      size="small"
      @keyup.enter.native="search"
    />
  </div>
</template>

<script>
export default {
  name: 'AppSearchColumn',

  props: {
    value: {
      type: String,
      default: '',
    },

    type: {
      type: [Array, String],
      default: () => ([]),
    },

    placeholder: {
      type: String,
      default: '',
    },
  },

  data() {
    return {

      inputValue: '',

      selectValue: '',

      onlyInputValue: '',
    };
  },

  computed: {

    hasSelect() {
      return this.type instanceof Array;
    },

    /**
     * 搜索字段下拉列表的宽度，根据传入的最长字段名计算
     */
    selectWidth() {
      const maxLength = Math.max(
        ...this.type.map(({ label }) => label.length),
      );

      return `${maxLength + 4}em`;
    },

  },

  watch: {
    inputValue(value) {
      if (!this.selectValue) {
        this.$emit('input', '');

        return;
      }

      this.$emit('input', `like[${this.selectValue}]:${value}`);
    },

    selectValue(value) {
      this.$emit('input', `like[${value}]:${this.inputValue}`);
    },

    onlyInputValue(value) {
      if (!value) {
        this.$emit('input', '');

        return;
      }

      this.$emit('input', `like[${this.type}]:${value}`);
    },
  },

  created() {
    if (this.hasSelect) {
      this.getUrlData();

      return;
    }

    this.getIsTypeData();
  },

  methods: {
    getUrlData() {
      const { page, per_page, ...search } = this.$route.query;

      const keyList = Object.keys(search);

      if (keyList.length === 0) return;

      const data = keyList.find((item) => {
        const likeExist = item.indexOf('like') !== -1;

        const likeWechat = item.indexOf('like[wechat_user]') === -1;

        const likeCategory = item.indexOf('like[category_name]') === -1;

        const likeProduct = item.indexOf('like[product_name]') === -1;

        return likeExist && likeWechat && likeCategory && likeProduct;
      });

      if (data !== undefined) {
        this.inputValue = search[data];

        this.selectValue = data.slice(5, -1);
      }
    },

    getIsTypeData() {
      const { page, per_page, ...search } = this.$route.query;

      const like = `like[${this.type}]`;

      if (like in search) {
        this.onlyInputValue = search[like];
      }
    },

    search() {
      this.$emit('searchColumn');
    },
  },
};
</script>

<style lang="postcss">
.app-search-column{
  display: inline-block;
}
</style>
