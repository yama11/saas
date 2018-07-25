<template>
  <div>
    <AppList
      ref="list"
      :list.sync="list"
      :columns="columns"
      :date-picker="datePicker"
      api="/wechatuser"
      title="家长列表"
    >
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
                @click.native="openDetail(scope.row.id)"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </AppList>

    <!-- 详情 -->

    <detail
      v-if="dialogDetail"
      :id="id"
      :dialog-detail="dialogDetail"
      @closeDetail="closeDetail" />

  </div>
</template>

<script>
/**
 * @desc 家长列表
 *
 * @author lindongfang
*/
import Detail from './Form';

export default {
  name: 'ParentList',
  components: {
    Detail,
  },

  data() {
    return {
      columns: [
        { prop: 'phone', label: '手机号', search: true },
        { prop: 'name', label: '姓名', search: true },
        { prop: 'role_type_name', label: '账户余额' },
        { prop: 'role_type_name1', label: '角色' },
        { prop: 'nickname', label: '微信昵称' },
        { prop: 'student_count', label: '小孩数' },
        { prop: 'created_at', label: '注册时间' },
      ],
      datePicker: true,
      list: {},

      dialogDetail: false,
      id: null,
    };
  },

  methods: {
    openDetail(id) {
      this.$router.push(`/parent-info/${id}`);
    },
    closeDetail() {
      this.dialogDetail = false;
      this.id = null;
    },
  },
};
</script>
