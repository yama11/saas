<script>
/**
 * @overview  用户管理 - 入口列表
 *
 * @author  huojinzhao
 */
import { list } from '@/mixins';

export default {
  name: 'UserList',

  mixins: [list],

  data: () => ({
    list: {},

    columns: [
      {
        prop: 'realname',
        label: '姓名',
      },
      {
        prop: 'name',
        label: '登陆账号',
      },
      {
        prop: 'phone',
        label: '手机号',
      },
      {
        prop: 'role.name',
        label: '角色',
      },
      {
        prop: 'updated_at',
        label: '最近登陆时间',
      },
      {
        prop: 'user_status_name',
        label: '状态',
      },
    ],

    searchs: [
      {
        searchType: [
          {
            label: '角色名称',
            prop: 'role_name',
          },
          {
            label: '手机号码',
            prop: 'phone',
          },
          {
            label: '登陆账号',
            prop: 'name',
          },
          {
            label: '用户姓名',
            prop: 'realname',
          },
        ],
        componentType: 'AppSearchColumn',
        placeholder: '请输入搜索内容',
      },
    ],
  }),

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`system.user.${key}`, text);
    },

    toDeleteUser(id) {
      this.$_listMixin_alertDeleteItem(
        id, this.list.data, '用户', '/user',
      );
    },

    toCreateUser() {
      this.$router.push('/user-create');
    },

    toUpdateUser(id) {
      this.$router.push(`/user-edit/${id}`);
    },
  },
};
</script>

<template>
  <AppList
    :list.sync="list"
    :create-label="checkPermission('store', '添加用户')"
    title="用户管理"
    api="/user"
    @create="toCreateUser"
  >

    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchs"
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
          :formatter="column.formatter"
          :label="column.label"
        />
        <el-table-column
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('update')"
              size="small"
              @click="toUpdateUser(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-if="checkPermission('delete')"
              type="danger"
              size="small"
              @click="toDeleteUser(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>
