<script>
/**
 * @overview 课时列表 - 列表项
 *
 * @author huojinzhao
 */

export default {
  name: 'CourseListItem',

  props: {
    data: {
      type: Object,
      required: true,
    },

    canUpdate: {
      type: Boolean,
      default: true,
    },

    canDelete: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    courseEdit() {
      this.$emit('edit', this.data.id);
    },

    courseDelete() {
      this.$emit('delete', this.data.id);
    },
  },
};
</script>

<template>
  <div class="course-list-item">
    <span>{{ data.name }}</span>
    <div
      v-if="false"
      class="course-list-item__control"
    >
      <i
        v-if="canUpdate"
        class="el-icon-edit"
        @click="courseEdit"
      />
      <i
        v-if="canDelete"
        class="el-icon-delete"
        @click="courseDelete"
      />
    </div>
  </div>
</template>

<style lang="postcss">
.course-list-item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  width: 170px;
  height: 170px;
  border: 1px solid rgba(232,237,250);
  border-radius: 5px;
  font-size: 28px;
}

.course-list-item__control {
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
  padding: .5em 1em;
  width: 100%;
  font-size: 20px;
}

.subject-list-item__control > .el-icon-delete {
  margin-left: auto;
}

.course-list-item__control > i:hover {
  cursor: pointer;
  color: var(--color-primary);
}
</style>
