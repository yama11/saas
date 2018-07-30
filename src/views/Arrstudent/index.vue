<template>
  <AppList
    :key="$route.path"
    :list.sync="list"
    create-label="调度"
    title="约课学生"
    api="/user"
    @create="toCreateUser"
  >

    <template slot-scope="props">
      <el-table :data="props.listData">
        <el-table-column
          type="selection"/>
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
              type="small"
              size="small"
              @click="toDeleteUser(scope.row.id)"
            >查看</el-button>
            <el-button
              size="small"
              @click="updateProcess(scope.row)"

            >调度</el-button>
            <ProcessEdition
              :visible.sync="editionInfo.visible"
              :id="editionInfo.id"
              :data="editionInfo.data"
              width="458px"
              @on-submit="submitEdition"
            />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<script>
import { list } from '@/mixins';
import ProcessEdition from './Edition';

export default {
  name: 'UserList',

  components: {
    ProcessEdition,
  },

  mixins: [list],
  data() {
    return {

      list: {},

      editionInfo: {
        id: null,
        visible: false,
        data: {
          username: '',
          role_id: null,
          user_state_id: null,
        },
      },
    };
  },

  computed: {

    type() {
      return this.$route.params.type;
    },

    columns() {
      return [
        { prop: 'id', label: '学生姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'username', label: '约课课程' },
        { prop: 'user_state', label: '课时数' },
        { prop: 'user_state_name', label: '品类' },
        { prop: 'gender_name', label: '约课机构' },
        { prop: 'created_at', label: '上课时间' },
        { prop: 'name', label: '约课班级' },
      ];
    },
  },

  methods: {

    toDeleteUser(id) {
      this.$router.push(`/user-edit/${id}`);
    },
    toCreateUser() {
      this.$router.push('/user-create');
    },
    updateProcess({
      id,
      username,
      role_id,
      user_state_id,
    }) {
      this.editionInfo = {
        id,
        visible: true,
        data: {
          username,
          role_id,
          user_state_id,
        },
      };
    },
    submitEdition(submit) {
      submit().then(() => this.updateList(this.$refs.list));
    },

    updateList(listRef) {
      listRef.getList();
    },

  },
};
</script>
