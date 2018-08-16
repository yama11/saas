<script>
/**
 * @overview 版本管理  - 版本详情 - 便签
 *
 * @author yehaifeng
 */

export default {

  name: 'PackageInfoNote',

  props: {
    label: {
      type: String,
      required: true,
    },

    details: {
      type: String,
      required: true,
    },

    version: {
      type: String,
      default: '',
    },

    fullSize: {
      type: Number,
      default: null,
    },

    incrementSize: {
      type: Number,
      default: null,
    },
  },
};
</script>

<template>
  <div class="package-info-note">
    <th>{{ label }}</th>
    <td class="package-info-note__span">{{ details }}

      <div v-if="label === '全量安装包'">
        版本：{{ version }}
        大小：{{ fullSize }}kb
      </div>

      <div v-if="label === '增量安装包'">
        版本：{{ version }}
        大小：{{ incrementSize }}kb
      </div>

    </td>
  </div>
</template>

<style lang="postcss">
.package-info-note th{
  width: 80px;
  text-align: left
}
.package-info-note__span{
  padding-left: 30px;
}
</style>
