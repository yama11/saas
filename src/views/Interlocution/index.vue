<script>
/**
 * @overview 家长端管理 - 帮助中心
 *
 * @author suyanping
 */
import list from '@/mixins/list';

export default {
  name: 'InterlocutionList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'title', label: '问题' },
        { prop: 'interlocution_type_name', label: '类型' },
      ],
    };
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`client.interlocution.${key}`, text);
    },

    createInterlocution() {
      this.$router.push('/interlocution-create');
    },

    updateInfo(id) {
      this.$router.push(`/interlocution-edit/${id}`);
    },

    lookInfo(id) {
      this.$router.push(`/interlocution-look/${id}_${id}`);
    },

    deleteInfo(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '消息',
        '/interlocution',
        this.$refs.list,
      );
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store') ? '新建问题' : null"
    api="/interlocution"
    title="帮助中心"
    @create="createInterlocution"
  >

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
          label="问题解答">
          <template slot-scope="scope">
            <div
              class="interlocution-list__text"
              v-html="scope.row.answer"/>
          </template>
        </el-table-column>

        <el-table-column
          prop="create_date"
          label="创建时间"/>

        <el-table-column
          label="操作"
          width="220px"
        >
          <template slot-scope="scope">

            <el-button
              v-if="checkPermission('edit')"
              size="small"
              @click="lookInfo(scope.row.id)"
            >
              查看
            </el-button>

            <el-button
              v-if="checkPermission('update')"
              size="small"
              type="primary"
              @click="updateInfo(scope.row.id)"
            >
              编辑
            </el-button>

            <el-button
              v-if="checkPermission('delete')"
              size="small"
              type="danger"
              @click="deleteInfo(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

  </AppList>
</template>

<style lang="postcss">
.interlocution-list__text{
  width: auto;
  overflow: hidden;
  height: 40px;
}

.interlocution-list__text img{
  width: 20px;
  height: 20px;
}
</style>
