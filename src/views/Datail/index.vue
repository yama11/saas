<script>
/**
 * @overview  用户账户管理  - 用户账户列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {
  name: 'DatailList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        {
          label: '手机号',
          prop: 'phone',
        },
        {
          label: '账户余额',
          prop: 'balance',
        },
      ],

      formData: {},

    };
  },
  computed: {
    searchArr() {
      const column = [
        { prop: 'phone', label: '手机号' },
      ];

      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`member_center.client.${key}`, text);
    },

    datailInfo(id) {
      this.$router.push(`/detail-info/${id}`);
    },
  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    title="用户账户"
    api="/member_center/client"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('index')"
      slot-scope="props">
      <el-table :data="props.listData">
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />
        <el-table-column
          width="150px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('show')"
              size="small"
              @click="datailInfo(scope.row.id)"
            >
              查看明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>


<style lang="postcss">

</style>
