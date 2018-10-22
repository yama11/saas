<script>
/**
 * @overview 机构管理 - 培训机构
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {
  name: 'Organization',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'name', label: '机构名称' },
        { prop: 'number', label: '机构编码' },
        { prop: 'dealer.name', label: '所属区域运营商' },
        { prop: 'account', label: '管理员账号' },
        { label: '地区',
          formatter: (row) => {
            let arr = '';
            if (row.province) {
              arr += row.province.name;
            }
            if (row.city) {
              arr += row.city.name;
            }
            if (row.district) {
              arr += row.district.name;
            }
            return arr;
          },
        },
        { prop: 'address', label: '详细地址' },
        { prop: 'phone', label: '联系电话' },
      ],
      departments: [],

      dialog: false,

      title: '',

      formData: {},

      list: {},
    };
  },
  computed: {
    searchArr() {
      const column = [
        { prop: 'name', label: '机构名称' },
        { prop: 'number', label: '机构编码' },
        { prop: 'account', label: '账号' },
      ];

      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '选择机构' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`system.department.${key}`, text);
    },
    Permission(key, text) {
      return this.$permissions(`system.manager_teacher.${key}`, text);
    },

    toCreate() {
      this.$router.push('/organization-create');
    },

    editDepartment(id) {
      this.$router.push(`/organization-edit/${id}`);
    },
    managerTeacher(id) {
      this.$router.push(`/organization-teacher/${id}`);
    },

    deleteDepartment(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '机构', '/department');
    },
  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store')?'新增机构':null"
    title="培训机构"
    api="/department"
    @create="toCreate"
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
          :formatter="column.formatter"
        />
        <el-table-column
          label="操作"
          width="280px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="Permission('index')"
              size="small"
              @click="managerTeacher(scope.row.id)"
            >辅师管理</el-button>
            <el-button
              v-if="checkPermission('update')"
              size="small"
              @click="editDepartment(scope.row.id)"
            >编辑</el-button>
            <el-button
              v-if="checkPermission('delete')"
              type="danger"
              size="small"
              @click="deleteDepartment(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>

</template>

