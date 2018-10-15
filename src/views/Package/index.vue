<script>
/**
 * @overview 版本管理  - 版本列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'PackageList',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'production_name', label: '产品' },
        { prop: 'version', label: '版本' },
        { prop: 'update_type_name', label: '更新方式' },
        { prop: 'update_count', label: '更新人数' },
        { prop: 'package_status_name', label: '状态' },
        { prop: 'created_at', label: '发布时间' },
      ],

      list: {},

      package_productions: [],

    };
  },
  computed: {
    searchArr() {
      const searchList = [
        { selectValue: this.package_productions,
          componentType: 'AppSearchStatus',
          searchType: 'package_production',
          placeholder: '请选择产品',
        },
      ];
      return searchList;
    },
  },

  created() {
    this.indexBefore();
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`system.package.${key}`, text);
    },

    toCreatePackage() {
      this.$router.push('/package-create');
    },

    infoPackage(id) {
      this.$router.push(`/package-info/${id}`);
    },

    indexBefore() {
      this.$http.get('/package/index_before')
        .then((res) => {
          this.package_productions = res.package_productions;
        });
    },

    deleteClass(id) {
      const url = `/package/${id}/unpublish`;
      this.$http.patch(url)
        .then(() => {
          this.$refs.list.getList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    publishClass(id) {
      const url = `/package/${id}/publish`;
      this.$http.patch(url)
        .then(() => {
          this.$refs.list.getList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store')?'发布新版本':null"
    api="/package"
    title="版本管理"
    @create="toCreatePackage"
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
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        />
        <el-table-column
          label="操作"
          width="230px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('show')"
              size="small"
              @click="infoPackage(scope.row.id)"
            >查看</el-button>
            <el-button
              v-if="scope.row.package_status !== 2&&checkPermission('unpublish')"
              type="danger"
              size="small"
              @click="deleteClass(scope.row.id)"
            >
              停止
            </el-button>
            <el-button
              v-else-if="checkPermission('publish')"
              type="danger"
              size="small"
              @click="publishClass(scope.row.id)"
            >
              发布
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

