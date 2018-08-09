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
    list: [],

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
  }),

  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.$_listMixin_getList('/subject')
        .then(({ data }) => {
          this.list = data;
        });
    },

    preCreateSubject() {
      this.formData = {
        name: '',
      };

      this.dialogVisible = true;
    },

    subjectCreate(submit) {
      submit()
        .then(this.getList);
    },

    subjectDelete(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list,
        '学科',
        '/subject',
      );
    },

    subjectEdit(id) {
      this.$router.push(`/subject-edition/${id}`);
    },
  },
};
</script>

<template>
  <div
    v-loading="loading"
    class="global-main subject-list"
  >
    <h2 class="subject-list__title">学科管理</h2>
    <div class="subject-list__body">
      <ListItem
        v-for="item in list"
        :key="item.id"
        :data="item"
        @delete="subjectDelete"
        @edit="subjectEdit"
      />
      <div
        class="module-subject__list-item subject-list__create"
        @click="preCreateSubject"
      >
        <i class="el-icon-plus" />
      </div>
    </div>

    <AppFormDialog
      :model="formData"
      :rules="rules"
      :visible.sync="dialogVisible"
      label-width="6em"
      width="500px"
      url="/subject"
      object="添加学科"
      @on-submit="subjectCreate"
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

div.subject-list__create {
  font-size: 48px;
}

.subject-list__create:hover {
  cursor: pointer;
  color: var(--color-primary);
}
</style>

<style src="./index.css" lang="postcss"></style>
