<script>
/**
 * @overview  用户管理 - 用户编辑
 *
 * @author  huojinzhao
 */

import { form } from '@/mixins';

export default {
  name: 'UserForm',

  mixins: [form],

  data() {
    return {
      before: {
        genders: [],
        user_states: [],
        departments: [],
        roles: [],
      },

      userForm: {
        name: '',
        realname: '',
        phone: '',
        gender: 1,
        role_id: '',
        password: '',
        user_status: 1,
      },

      rules: {
        realname: [
          this.$rules.required('真实姓名'),
          { ...this.$rules.realName },
        ],
        phone: [
          this.$rules.mobile,
        ],
        gender: [
        //
        ],
        role_id: [
          this.$rules.required('角色', 'number'),
        ],
        name: [
          this.$rules.required('账号'),
          { ...this.$rules.userName },
          {
            min: 6,
            message: '仅允许输入6~20位的数字或者字母',
            trigger: 'blur',
          },
        ],
        password: [
          this.$rules.required('密码'),
          { ...this.$rules.userPassword },
        ],
        user_status: [
          this.$rules.required('状态', 'number'),
        ],
      },
    };
  },

  methods: {
    getFormBefore() {
      this.$http.get('/user/store_before')
        .then((res) => {
          this.before = res;
        });
    },

    getFormStore(id) {
      const url = `/user/${id}`;

      this.$http.get(url)
        .then((res) => {
          Object.keys(res).forEach((key) => {
            this.userForm[key] = res[key];
          });
        });
    },

    submitForm(submit) {
      submit();
    },
  },
};
</script>

<template>
  <AppFormPage
    ref="userForm"
    :model="userForm"
    :rules="rules"
    :from="from"
    url="/user"
    object="用户"
    class="user-form"
    label-width="6em"
    @on-submit="submitForm"
  >

    <!-- <AppSearch :search-arr="searchs" /> -->

    <el-form-item
      label="真实姓名"
      prop="realname"
    >
      <el-input
        v-model="userForm.realname"
        :maxlength="30"
        placeholder="请输入真实姓名"
      />
    </el-form-item>

    <el-form-item
      label="手机号码"
      prop="phone"
    >
      <el-input
        v-model="userForm.phone"
        placeholder="请输入手机号码"
      />
    </el-form-item>

    <el-form-item
      label="性别"
      prop="gender"
    >
      <el-radio
        v-for="gender in before.genders"
        v-model="userForm.gender"
        :key="gender.value"
        :label="gender.value"
      >
        {{ gender.name }}
      </el-radio>
    </el-form-item>

    <el-form-item
      label="角色"
      prop="role_id"
    >
      <el-select
        v-model="userForm.role_id"
        placeholder="请选择角色"
      >
        <el-option
          v-for="role in before.roles"
          :key="role.id"
          :value="role.id"
          :label="role.name"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="账号"
      prop="name"
    >
      <el-input
        v-model="userForm.name"
        :maxlength="20"
        placeholder="请输入账号"
      />
    </el-form-item>

    <el-form-item
      label="密码"
      prop="password"
      class="user-form__password"
    >
      <app-input-password
        v-model="userForm.password"
        :maxlength="20"
        placeholder="请输入密码"
        toggle
      />
    </el-form-item>

    <el-form-item
      label="状态"
      prop="user_status"
    >
      <el-radio
        v-for="state in before.user_status"
        v-model="userForm.user_status"
        :key="state.value"
        :label="state.value"
      >
        {{ state.name }}
      </el-radio>
    </el-form-item>
  </AppFormPage>
</template>

<style lang="postcss">
.user-form .app-form {
  max-width: 720px;
}

.user-form__password .el-input-group__append {

  & i:hover {
    color: var(--color-primary);
    cursor: pointer;
  }
}
</style>
