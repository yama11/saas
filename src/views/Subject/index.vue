<script>
/**
 * @overview 学科管理 - 学科列表
 *
 * @author huojinzhao
 */

import { list } from '@/mixins';
import ListItem from './components/ListItem';

export default {
  name: 'SubjectList',

  components: {
    ListItem,
  },

  mixins: [list],

  data: () => ({
    list: null,

    dialogVisible: false,

    formData: {
      name: '',
    },

    rules: {
      name: [
        { required: true, message: '请填写学科名称' },
        { max: 10, message: '名称不应大于10个字符' },
      ],
    },

    editTargetID: null,
  }),

  created() {
    this.getList();
  },

  beforeRouteUpdate(to, from, next) {
    this.getList(to);

    next();
  },

  methods: {
    checkPermission(key) {
      return this.$permissions(`curriculum_center.subject.${key}`);
    },

    getList(route = this.$route) {
      this.$_listMixin_getList('/subject', { ...route.query, per_page: 23 })
        .then((res) => {
          this.list = res;
        });
    },

    subjectCreate() {
      this.editTargetID = null;

      this.formData = {
        name: '',
      };

      this.dialogVisible = true;
    },

    subjectSubmit(submit) {
      submit()
        .then(this.getList);
    },

    subjectDelete(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '学科',
        '/subject',
      );
    },

    subjectEdit({ name, id }) {
      this.editTargetID = id;

      this.formData = { name, id };

      this.$nextTick(() => {
        this.dialogVisible = true;
      });
    },

    subjectCheck(id) {
      this.$router.push(`/subject-edition/${id}`);
    },
  },
};
</script>

<template>
  <div
    v-loading="loading"
    v-if="list"
    class="global-main subject-list"
  >
    <h2 class="subject-list__title">学科管理</h2>
    <div
      v-if="checkPermission('index')"
      class="subject-list__body"
    >
      <div
        v-if="checkPermission('store')"
        class="module-subject__list-item subject-list__create"
        @click="subjectCreate"
      >
        <i class="el-icon-plus" />
      </div>
      <ListItem
        v-for="item in list.data"
        :key="item.id"
        :data="item"
        :can-update="checkPermission('update')"
        :can-delete="checkPermission('delete')"
        @delete="subjectDelete"
        @edit="subjectEdit"
        @check="subjectCheck"
      />
    </div>

    <footer
      class="subject-list__footer"
    >
      <el-pagination
        :current-page="list.current_page"
        :page-size="list.per_page"
        :total="list.total"
        layout="total, prev, pager, next, jumper"
        @size-change="$_listMixin_changeSize"
        @current-change="$_listMixin_changeIndex"
      />
    </footer>

    <AppFormDialog
      :model="formData"
      :rules="rules"
      :visible.sync="dialogVisible"
      :id="editTargetID"
      :object="editTargetID ? '编辑学科' : '添加学科'"
      label-width="6em"
      width="500px"
      url="/subject"
      @on-submit="subjectSubmit"
    >
      <el-form-item
        label="学科名称"
        prop="name"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
    </AppFormDialog>
  </div>
</template>

<style lang="postcss">
.subject-list {

}

.subject-list__title {

}

.subject-list__body {
  flex-grow: 1;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

.subject-list__footer {
  display: flex;
  justify-content: center;
}

div.subject-list__create {
  font-size: 48px;
}

.subject-list__create:hover {
  cursor: pointer;
  color: var(--color-primary);
}
</style>

<style src="./index.css" lang="postcss"></style>
