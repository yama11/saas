<template>
  <AppFormDialog
    :visible="visible"
    :model="data"
    :id="id"
    label-width="5em"
    url="/user"
    object="学生"
    class="process-edition"
    width="500px"
    @on-submit="submitEdition"
    @update:visible="value => $emit('update:visible', value)"
  >
    <el-form-item
      label="校区"
      prop="department_id"
    >
      <el-select
        v-model="data.department_id"
        placeholder="请选择校区"
      >
        <el-option
          v-for="role in before.departments"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="时间"
      prop="apply_role_id"
    >
      <el-select
        v-model="data.apply_role_id"
        placeholder="请选择时间"
      >
        <el-option
          v-for="role in before.roles"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="班级"
      prop="pass_role_id"
    >
      <el-select
        v-model="data.pass_role_id"
        placeholder="请选择班级"
      >
        <el-option
          v-for="role in before.roles"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        />
      </el-select>
    </el-form-item>
  </AppFormDialog>
</template>

<script>
/**
 *
 */
export default {
  name: 'ProcessEdition',

  props: {
    id: {
      type: Number,
      default: null,
    },

    visible: {
      type: Boolean,
      required: true,
    },

    // 编辑数据
    data: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      // 表单填写选项前置数据请求
      before: {
        departments: [],
        roles: [],
        user_states: [],
      },
    };
  },

  created() {
    this.getBefore();
  },

  methods: {
    getBefore() {
      this.$http.get('/user/store_before')
        .then((res) => {
          this.before = { ...this.before, ...res };
        });
    },

    submitEdition(submit) {
      this.$emit('on-submit', submit);
    },
  },
};
</script>

<style lang="postcss">
/* 重置Appform组件内部样式 */
.process-edition .el-input,
.process-edition .el-select {
  display: block;
}
</style>
