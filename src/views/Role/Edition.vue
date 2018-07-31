<script>
/**
 * @overview  角色编辑
 *
 * @author  huojinzhao
 */

import { form } from '@/mixins';
import Permissions from './components/Permissions';

export default {
  name: 'RoleForm',

  components: {
    Permissions,
  },

  mixins: [form],

  data() {
    return {
      roleForm: {
        name: '',
        description: '',
        permissions: [],
      },

      rules: {
        name: [
          this.$rules.required('角色名称'),
          { ...this.$rules.rolename },
        ],
        description: [
          { ...this.$rules.roledescribe },
        ],
      },

      roleStoreBefore: {
        permissions: [],
      },

      remnant: 100,
    };
  },

  computed: {
    nameDisabled() {
      return !!this.currentId;
    },

    data() {
      const { name, ...data } = this.roleForm;
      return data;
    },
  },

  methods: {
    // 获取角色权限数据
    getFormBefore() {
      this.$http.get('/role/store_before')
        .then((res) => {
          this.roleStoreBefore = res;
        });
    },

    // 获取当前角色数据
    getFormStore(id) {
      this.$http.get(`/role/${id}`)
        .then(({ name, description, permissions }) => {
          this.roleForm = {
            name,
            description,
            permissions,
          };
        },
        );
    },

    // 获取当前角色描述字数
    descInput() {
      const txtVal = this.roleForm.description.length;
      this.remnant = 100 - txtVal;
    },

    submitForm(submit) {
      submit();
    },
  },
};
</script>

<template>
  <AppFormPage
    ref="roleForm"
    :model="roleForm"
    :data="data"
    :rules="rules"
    :from="from"
    url="/role"
    object="角色"
    class="role-form"
    label-width="100px"
    @on-submit="submitForm"
  >
    <el-form-item
      label="角色名称"
      prop="name"
    >
      <el-input
        v-model="roleForm.name"
        :disabled="nameDisabled"
        :maxlength="30"
        placeholder="请输入角色名称"
      />
    </el-form-item>

    <el-form-item
      prop="description"
      label="角色描述"
    >
      <el-input
        v-model="roleForm.description"
        :autosize="{ minRows: 4, maxRows: 100}"
        :maxlength="100"
        placeholder="请输入角色描述"
        type="textarea"
        @input="descInput"
      />
      <span class="role-form__description">
        还可以输入{{ remnant }}个字
      </span>
    </el-form-item>

    <el-form-item
      label="操作权限"
      class="role-form__permission"
    >
      <Permissions
        v-model="roleForm.permissions"
        :options="roleStoreBefore.permissions"
      />
    </el-form-item>
  </AppFormPage>
</template>

<style lang="postcss">
.role-form__permission .el-form-item__content {
  overflow: hidden;
}
.role-form__description{
  position: absolute;
  right: 0;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
}
</style>
