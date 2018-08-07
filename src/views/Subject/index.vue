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
  }),

  created() {
    this.$_listMixin_getList('/subject')
      .then(({ data }) => {
        this.list = data;
      });
  },
};
</script>

<template>
  <div class="subject-list">
    <h2 class="subject-list__title">学科管理</h2>
    <div class="subject-list__body">
      <ListItem
        v-for="item in list"
        :key="item.id"
        :data="item"
      />
      <div class="subject-list__create module-subject__list-item">
        <i class="el-icon-plus" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.subject-list {
  display: flex;
  flex-direction: column;
  padding: 0 2em;
}

.subject-list__title {
  padding: 1em 0;
  font-size: 1rem;
}

.subject-list__body {
  flex-grow: 1;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

.subject-list__create:hover {
  cursor: pointer;
  color: var(--color-primary);
}
</style>

<style src="./index.css" lang="postcss"></style>
