<script>
/**
 * @overview  角色列表
 *
 * @author  huojinzhao
 */
import list from '@/mixins/list';

export default {
  name: 'RoleList',

  mixins: [list],

  data: () => ({
    list: {},

    columns: [
      {
        prop: 'name',
        label: '角色名称',
      },
      {
        prop: 'description',
        label: '角色描述',
      },
    ],
  }),

  methods: {
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

<template>
  <AppList
    :list.sync="list"
    :columns="columns"
    :create-label="'添加角色'"
    api="/role"
    title="角色列表"
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
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteClass(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>
