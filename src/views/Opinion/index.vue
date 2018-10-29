<script>
/**
 * @overview 家长端管理 - 意见反馈
 *
 * @author suyanping
 */
import list from '@/mixins/list';

export default {
  name: 'OpinionList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'content', label: '反馈内容' },
        { prop: 'opinion_type_name', label: '反馈类型' },
        { prop: 'phone', label: '反馈人' },
        { prop: 'create_date', label: '反馈时间' },
      ],
    };
  },

  created() {

  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`client.opinion.${key}`, text);
    },

    opinionInfo(id) {
      this.$router.push(`/opinion-info/${id}`);
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    api="/opinion"
    title="意见反馈"
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
          :formatter="column.formatter"
        />
        <el-table-column
          label="操作"
          width="230px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('show')"
              size="small"
              @click="opinionInfo(scope.row.id)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </template>

  </AppList>
</template>

<style lang="postcss">

</style>
