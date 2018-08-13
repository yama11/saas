<script>
/**
 * @overview 课时列表 - 列表注意
 *
 * @author huojinzhao
 */

import { list } from '@/mixins';
import ListItem from './ListItem';

export default {
  name: 'CourseListMain',

  components: {
    ListItem,
  },

  mixins: [list],

  props: {
    list: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    dialogVisible: false,

    editID: null,

    formData: {
      name: '',
    },

    rules: {
      name: [
        { required: true, message: '请填写课时名称' },
        { max: 10, message: '名称不应大于10个字符' },
      ],
    },
  }),

  methods: {
    getList() {
      this.$emit('update');
    },

    preCourseCreate() {
      this.editID = null;

      this.formData = {
        name: '',
        subject_id: Number(this.$route.query.subject),
        structure_id: Number(this.$route.query['equal[structure_id]']),
      };

      this.dialogVisible = true;
    },

    preCourseEdit(id) {
      this.editID = id;

      this.$http.get(`/course/${id}`)
        .then((res) => {
          this.formData = res;

          this.dialogVisible = true;
        })
        .catch(() => this.$message.error('请求数据失败!'));
    },

    courseEdit(submit) {
      submit()
        .then(this.getList);
    },

    courseDelete(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '课时',
        '/course',
      );
    },

    /**
     * 改变每页条数
     * @param {number} per_page 每页条数
     */
    onSizeChange(per_page) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1,
          per_page,
        },
      });
    },

    /**
     * 翻页
     * @param {number} page 当前页数
     */
    onCurrentChange(page) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page,
        },
      });
    },
  },
};
</script>

<template>
  <div class="global-main course-list-main">
    <h2 class="course-list__title">
      <el-button
        type="primary"
        @click="preCourseCreate"
      >
        添加课时
      </el-button>
    </h2>
    <div class="course-list__body">
      <ListItem
        v-for="item in list.data"
        :key="item.id"
        :data="item"
        @delete="() => courseDelete(item.id)"
        @edit="() => preCourseEdit(item.id)"
      />
    </div>

    <AppFormDialog
      :model="formData"
      :rules="rules"
      :visible.sync="dialogVisible"
      :id="editID"
      :object="editID ? '编辑学科' : '添加学科'"
      label-width="6em"
      width="500px"
      url="/course"
      @on-submit="courseEdit"
    >
      <el-form-item
        label="学科名称"
        prop="name"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
    </AppFormDialog>

    <footer
      class="course-list-footer"
    >
      <el-pagination
        :current-page="list.current_page"
        :page-sizes="[10, 18]"
        :page-size="10"
        :total="list.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </footer>
  </div>
</template>

<style lang="postcss">
.course-list-main {
  flex-grow: 1;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

.course-list__body {
  flex-grow: 1;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

.course-list__title {
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(232,237,250);
}

.course-list__create {
  margin-left: auto;
}

.course-list__create:hover {
  cursor: pointer;
  color: var(--color-primary);
}

.course-list-footer {
  padding: 2em 0 1em;
  margin-top: auto;
}
</style>
