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
    <div class="course-list-item__control">
      <i
        class="el-icon-edit"
        @click="courseEdit"
      />
      <i
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
  justify-content: space-between;
  bottom: 0;
  left: 0;
  padding: .5em 1em;
  width: 100%;
  font-size: 20px;
}

.course-list-item__control > i:hover {
  cursor: pointer;
  color: var(--color-primary);
}
</style>
