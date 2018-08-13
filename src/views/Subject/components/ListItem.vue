<script>
/**
 * @overview 学科列表 - 列表项
 *
 * @author huojinzhao
 */

export default {
  name: 'SubjectListItem',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  methods: {
    subjectEdit() {
      this.$emit('edit', this.data);
    },

    subjectDelete() {
      this.$emit('delete', this.data.id);
    },

    subjectCheck() {
      this.$emit('check', this.data.id);
    },
  },
};
</script>

<template>
  <div
    class="module-subject__list-item subject-list-item"
    @click="subjectCheck"
  >
    <span>{{ data.name }}</span>
    <div class="subject-list-item__control">
      <i
        class="el-icon-edit"
        @click.stop="subjectEdit"
      />
      <i
        class="el-icon-delete"
        @click.stop="subjectDelete"
      />
    </div>
  </div>
</template>

<style lang="postcss">
.subject-list-item:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, .4);
}

.subject-list-item > span {
  word-break: break-all;
}

.subject-list-item__control {
  position: absolute;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  padding: .5em 1em;
  width: 100%;
  font-size: 20px;
}

.subject-list-item__control > i:hover {
  cursor: pointer;
  color: var(--color-primary);
}
</style>
