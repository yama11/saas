<script>
/**
 * @overview 家长端管理 - 系统消息
 *
 * @author suyanping
 */
import list from '@/mixins/list';
import errorHandler from '@/components/AppFormAlert/errorHandler';

export default {
  name: 'NotificationList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'title', label: '消息标题' },
        { prop: 'content', label: '消息内容', hidden: true },
        { prop: 'push_time', label: '推送时间' },
        { prop: 'msg_status_name', label: '状态' },
      ],

      msgStatus: [],
    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'title', label: '消息标题' },
        { prop: 'content', label: '消息内容' },
      ];

      const searchList = [
        { selectValue: this.msgStatus, componentType: 'AppSearchStatus', searchType: 'msg_status' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  created() {
    this.getIndexList();
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`client.notifications.${key}`, text);
    },

    getIndexList() {
      this.$http.get('/notifications/index_before')
        .then((res) => {
          this.msgStatus = res.msg_status;
        });
    },

    createNotification() {
      this.$router.push('/notifications-creat');
    },

    lookInfo(id) {
      this.$router.push(`/notifications-info/${id}`);
    },

    updateInfo(id) {
      this.$router.push(`/notifications-edit/${id}`);
    },

    deleteInfo(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '消息',
        '/notifications',
        this.$refs.list,
      );
    },

    recallInfo(id) {
      this.$confirm(
        '确定撤回该消息？',
        '确认撤回',
        {
          showCancelButton: true,
          type: 'warning',
          confirmButtonText: '撤回',
          confirmButtonClass: 'el-button--danger',
        })
        .then(() => {
          this.sureRecall(id);
        })
        .catch(() => {});
    },

    sureRecall(id) {
      this.$http.patch(`/notifications/recall/${id}`)
        .then(() => {
          this.$alert(
            '撤回成功',
            '撤回确认',
            {
              confirmButtonText: '我知道了',
              type: 'success',
              confirmButtonClass: 'success',
            })
            .finally(() => {
              this.$refs.list.getList();
            });
        })
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },

    isShowRecall(status, times) {
      if (status !== 1) return true;

      const nowTime = new Date().getTime();
      const pushTime = new Date(times).getTime();

      return nowTime - pushTime < 3600000;
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store') ? '新建消息' : null"
    api="/notifications"
    title="系统消息"
    @create="createNotification"
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
          :show-overflow-tooltip="column.hidden"
        />

        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('show')"
              size="small"
              @click="lookInfo(scope.row.id)"
            >
              查看
            </el-button>

            <el-button
              v-if="checkPermission('update')
                && scope.row.msg_status !== 1
              && scope.row.msg_status !== 2"
              size="small"
              type="primary"
              @click="updateInfo(scope.row.id)"
            >
              编辑
            </el-button>

            <el-button
              v-if="checkPermission('destory')"
              size="small"
              type="danger"
              @click="deleteInfo(scope.row.id)"
            >
              删除
            </el-button>

            <el-button
              v-if="checkPermission('recall')
                && isShowRecall(scope.row.msg_status,scope.row.push_time)
              && scope.row.msg_status !== 2"
              size="small"
              @click="recallInfo(scope.row.id)"
            >
              撤回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

  </AppList>
</template>

<style lang="postcss">

</style>
