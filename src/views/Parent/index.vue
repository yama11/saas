<script>
/**
 * @overview 家长管理 - 家长列表
 *
 * @author yehaifeng
*/
import list from '@/mixins/list';

export default {

  name: 'ParentList',

  mixins: [list],

  data() {
    return {

      columns: [
        { prop: 'phone', label: '手机号' },
        { prop: 'name', label: '姓名' },
        { prop: 'balance', label: '账户余额' },
        { prop: 'role_type_name', label: '角色' },
        { prop: 'wechat_name', label: '微信昵称' },
        { prop: 'student_count', label: '小孩数' },
        { prop: 'register_at', label: '注册时间' },
      ],

      list: {},

    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'name', label: '姓名' },
        { prop: 'phone', label: '手机号' },
      ];
      const searchList = [
        { componentType: 'AppSearchDate', searchType: 'register_at' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  methods: {
    parentInfo(id) {
      this.$router.push(`/client-info/${id}`);
    },
  },
};
</script>

<template>
  <div>
    <AppList
      ref="list"
      :list.sync="list"
      :columns="columns"
      api="/member_center/client"
      title="家长列表"
    >
      <AppSearch
        slot="search"
        :search-arr="searchArr"
      />
      <template slot-scope="props">
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
            width="150px"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                @click.native="parentInfo(scope.row.id)"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </AppList>
  </div>
</template>

