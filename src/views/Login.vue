<script>
/**
 * @overview 登录页面
 *
 * @author huojinzhao
 */

import { userHistory } from '@/utils';

export default {
  name: 'Login',

  data() {
    return {
      user: {
        username: '',
        password: '',
      },

      rules: {
        username: [
          this.$rules.required('账号'),
        ],
        password: this.$rules.password(),
      },

      submitLoading: false,

      history: {
        rememberMe: false,
        records: [],
      },

      submitError: {},
    };
  },

  watch: {
    'history.rememberMe': 'preserveLoacalHistory',
  },

  created() {
    this.recoverUserHistory();
  },

  beforeDestroy() {
    this.preserveLoacalHistory();
  },

  /**
   * 使用localStorage进行登录账户的保存和现场还原
   * --UserHistory处理运行时history有关业务
   * --LocalHistory处理本地存储history有关业务
   */
  methods: {
    toggleSubmitLoading() {
      this.submitLoading = !this.submitLoading;
    },

    preSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) this.submit();
      });
    },

    submit() {
      this.toggleSubmitLoading();

      this.$http.post('/user/login', this.user)
        .then(this.submitSucceed)
        .catch(this.submitFailure)
        .finally(this.toggleSubmitLoading);
    },

    submitSucceed({ access_token: token }) {
      this.history = this.updateHistory(this.user);

      this.$http.init({
        baseHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.$token.set(token);

      this.$router.push('/');
    },

    submitFailure(error) {
      this.submitError = error;
    },

    updateHistory(record) {
      const { rememberMe } = this.history;

      return rememberMe
        ? userHistory.update(record, rememberMe, this.history)
        : this.history;
    },

    preserveLoacalHistory() {
      userHistory.preserve(this.history);
    },

    getUserRecords(val, callback) {
      const records = this.history.records;

      const list = records
        .filter(item => item.username.includes(val));

      callback(list);
    },

    selectUserRecord(record) {
      this.user = { ...record };
    },

    // 还原历史记录到本地，并载入最新登录账户
    recoverUserHistory() {
      this.history = userHistory.recover() || this.history;

      const { rememberMe, records } = this.history;

      if (rememberMe && records.length) {
        this.user = { ...records[0] };
      }
    },
  },
};
</script>

<template>
  <main
    :style="{
      'background-image': `url(${this.$assets.loginBg})`,
      'background-position': 'center bottom',
      'background-size': 'cover',
    }"
    class="login"
  >
    <div
      class="login__panel"
    >
      <header>作用中心管理后台</header>

      <el-form
        ref="form"
        :model="user"
        :rules="rules"
        class="login__form"
        @keydown.enter.native="preSubmit"
      >
        <el-form-item
          prop="username"
        >
          <el-autocomplete
            v-model="user.username"
            :fetch-suggestions="getUserRecords"
            :trigger-on-focus="true"
            prefix-icon="iconfont icon-person"
            value-key="username"
            @select="selectUserRecord"
          />
        </el-form-item>

        <el-form-item
          prop="password"
          style="padding-left:0px;"
        >
          <el-input
            v-model="user.password"
            type="password"
          >
            <i
              slot="prepend"
              class="iconfont icon-lock"
            />
          </el-input>
        </el-form-item>

        <el-form-item
          label-width="0"
        >
          <el-checkbox
            v-model="history.rememberMe"
          >
            记住密码
          </el-checkbox>
        </el-form-item>
      </el-form>

      <AppFormAlert
        :contents="submitError"
      />

      <el-button
        :loading="submitLoading"
        type="primary"
        @click="preSubmit"
      >
        登录
      </el-button>
    </div>
  </main>
</template>

<style lang="postcss">
:root {
  --login-panel-right: calc((41% - 420px) / 2);
}

.login {
  position: relative;
  display: flex;
  min-width: 1280px;
  height: 100vh;
}

.login__panel {
  position: absolute;
  display: flex;
  top: 50%;
  right: var(--login-panel-right);
  transform: translateY(-50%);
  flex-flow: column nowrap;
  padding: 42px 38px 38px 38px;
  width: 420px;
  background-color: rgba(0,0,0,0.6);
  border-radius: var(--bd-radius);
  color: white;
}

.login__panel > header {
  font-size: 24px;
  margin-bottom: 36px;
}

.login__form {
  margin-bottom: auto;
}

/* elementUI 样式重置 */
.login {

  & .iconfont {
    color: white;
    font-size: 1.5em;
  }

  & .el-form {

    & .el-icon-info::before {
      color: white;
      font-size: 1.5em;
    }
  }

  & .el-form-item__label {
    color: white;

    &::before {
      display: none;
    }
  }

  & .el-autocomplete {
    display: block;
  }

  & .el-checkbox {
    color: white;
  }

  & .el-form-item:last-child {
    margin: -10px 0 10px 0;
  }

  & .el-input__prefix {
    width: 40px;
    height: 40px;
    left: 0;
    background-color: #aaaaaa;
  }

  & .el-input__inner {
    padding-left: calc(40px + 0.5em);
    border-radius: 0;
  }

  & .el-button {
    border-radius: 0;
  }

  & .el-alert {
    padding: 8px;
    border-radius: 0;
    background: rgba(255, 255, 255, .3);
    color: white;
  }

  & .el-alert__icon {
    display: none;
  }

  & .el-alert__content {
    padding: 2px 0;
  }
}

.login__panel .el-input-group__append,
.login__panel .el-input-group__prepend{
  background: #aaaaaa !important;
  padding: 0 9px !important;
}

.login__panel .el-input-group--prepend>input{
  padding-left: 9px !important;
}
</style>
