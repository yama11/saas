<template>
  <AppList
    :list.sync="list"
    :columns="columns"
    api="/role"
    title="约课班级"
    @create="toCreateUser"
  >
    <template slot-scope="props">
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
              size="small"
              @click="editRole(scope.row.id)"
            >查看</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteClass(scope.row.id)"
            >
              开班
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<script>
import list from '@/mixins/list';

export default {
  name: 'RoleList',
  mixins: [list],
  data() {
    return {
      columns: [
        { prop: 'id', label: '班级编码' },
        { prop: 'number', label: '课程名称' },
        { prop: 'description', label: '课时数' },
        { prop: 'role_type', label: '品类' },
        { prop: 'data_level', label: '机构名称' },
        { prop: 'created_at', label: '班级名称' },
        { prop: 'updated_at', label: '上课时间' },
        { prop: 'name', label: '约课/满课人数', search: true },
        { prop: 'role_type_name', label: '班级状态' },
      ],
      list: {},

    };
  },
  methods: {
    checkMembers(roleType, roleTypeName) {
      this.$router.push(`/user-list/${roleTypeName}-${roleType}`);
    },
    toCreateUser() {
      this.$router.push('/role-create');
    },
    editRole(id) {
      this.$router.push(`/role-edit/${id}`);
    },
    deleteClass(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '角色', '/role');
    },
  },
};
</script>
