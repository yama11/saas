<script>
/**
 * @overview 操作日志 - 列表
 *
 * @author huojinzhao
 */

export default {
  name: 'LogList',

  data: () => ({
    list: {
      data: [],
    },

    columns: [
      {
        prop: 'user.name',
        label: '账号',
      },
      {
        prop: 'permission.parent.name',
        label: '菜单',
      },
      {
        prop: 'permission.name',
        label: '操作',
      },
      {
        prop: 'url',
        label: '链接',
      },
      {
        prop: 'created_at',
        label: '操作时间',
      },
    ],
  }),

  computed: {
    searchArr() {
      const column = [
        {
          prop: 'user.name',
          label: '账号',
        },
        {
          prop: 'permission.parent.name',
          label: '菜单',
        },
        {
          prop: 'permission.name',
          label: '操作',
        },
      ];

      return [
        {
          componentType: 'AppSearchDate',
          searchType: 'created_at',
        },
        {
          componentType: 'AppSearchColumn',
          searchType: column,
        },
      ];
    },
  },

  methods: {
    checkPermission(key) {
      return this.$permissions(`system.operation_log.${key}`);
    },

    seeDetail(message) {
      const title = '数据详情';
      const customClass = 'log-list__message';

      this.$msgbox({ message, title, customClass });
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    class="log-list"
    api="/operation_log"
    title="操作日志"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />

    <template
      v-if="checkPermission('index')"
      slot-scope="props"
    >
      <el-table :data="props.listData">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        />
        <el-table-column
          label="数据"
          width="230px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="seeDetail(scope.row.body)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<style lang="postcss">
.log-list {

}

.log-list__message {
  word-break: break-all;
}
</style>
