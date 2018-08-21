<script>
/**
 * @overview 学员管理 - 编辑学生
 *
 * @author yehaifeng
*/
import { form } from '@/mixins';

export default {

  name: 'StudentForm',

  mixins: [form],

  data() {
    return {

      id: this.$route.params.id,

      chinaJSON: this.$assets.chinaJSON,

      schoolname: [],

      studentForm: {
        name: '',
        gender: null,
        school: null,
        grade: null,
        head_name: '',
        head_url: '',
        birth_at: '',
        places: [],
      },

      rules: {
        name: [
          this.$rules.required('学生姓名'),
          { ...this.$rules.name },
        ],
        head_url: [
          this.$rules.required('学生头像', 'string'),
        ],
        gender: [
          this.$rules.required('性别', 'number'),
        ],
      },

      studentStoreBefore: {
        grade: [],
        gender: [],
        school: [],
      },

      imgUrl: '',
    };
  },
  created() {
    this.getFormBefore();
  },

  methods: {
    // 获取学员数据
    getFormBefore() {
      this.$http.get('/member_center/student/store_before')
        .then((res) => {
          this.studentStoreBefore = { ...res };
        });
    },

    // 获取当前学员信息
    getFormStore(id) {
      this.$http.get(`/member_center/student/${id}`)
        .then((res) => {
          const {
            created_at: createdAt,
            deleted_at: deletedAt,
            updated_at: updatedAt,
            ...other
          } = res;

          this.studentForm = {
            ...this.studentForm,
            ...other,
          };
          this.studentForm.school = Number(this.studentForm.school);

          this.changeCode(res.places);
        });
    },

    changeCode(value) {
      if (value.length === 0) return;

      const address = value.join('/');

      this.$http.get(`/member_center/student/school/${address}`)
        .then((res) => {
          this.schoolname = res;
        });
    },

    avatarUploadSuccess(head_url, head_name, face_token) {
      this.studentForm.head_url = head_url;
      this.studentForm.head_name = head_name;
      this.studentForm.face_token = face_token;
    },

    // 提交表单
    submitForm(submit) {
      submit();
    },
  },
};
</script>
<template>
  <AppFormPage
    ref="studentForm"
    :model="studentForm"
    :rules="rules"
    :from="from"
    :id ="id"
    url="/member_center/student"
    object="编辑学生"
    class="student-form"
    label-width="100px"
    @on-submit="submitForm"
  >
    <el-form-item
      class="student-form-contact"
    >
      <el-form-item
        label="第一联系人"
        prop="client_phone"
        class="student-form-contact__inputPhone"
      >
        <el-input
          v-model="studentForm.client_phone"
          placeholder="请输入手机号码"

        />
      </el-form-item>
      <el-form-item
        label="第二联系人"
        prop="client_second_phone"
        class="student-form-contact__inputPhone"
      >
        <el-input
          v-model="studentForm.client_second_phone"
          placeholder="请输入手机号码"
        />
      </el-form-item>
    </el-form-item>

    <el-form-item
      class="student-form-contact"
    >
      <el-form-item
        label="家长姓名"
        class="student-form-contact__inputPhone"
      >
        <el-input
          v-model="studentForm.client_name"
          placeholder="请输入家长姓名"
        />
      </el-form-item>
    </el-form-item>

    <el-form-item
      label="学生姓名"
      prop="name"
    >
      <el-input
        v-model="studentForm.name"
        placeholder="请输入学生姓名"
        maxlength="10"
        class="student-form__input"
      />
    </el-form-item>
    <el-form-item
      label="性别"
      prop="gender"
    >
      <el-radio
        v-for="list in studentStoreBefore.gender"
        v-model="studentForm.gender"
        :key="list.value"
        :label="list.value"
      >
        {{ list.name }}
      </el-radio>
    </el-form-item>
    <div
      class="student-form__block">
      <el-form-item
        label="学生头像"
        prop="head_url"
      >
        <AppCropUploader
          v-model="studentForm.head_url"
          url="/member_center/student/upload"
          post-name="head_url"
          @on-success="avatarUploadSuccess"
        />

      </el-form-item>
    </div>

    <el-form-item
      label="出生年月"
      prop="birth_at"
    >
      <el-date-picker
        v-model="studentForm.birth_at"
        type="date"
        placeholder="选择出生年月"
        value-format="yyyy-MM-dd"/>
    </el-form-item>

    <el-form-item
      label="生源地区"
      prop="places"
    >
      <el-cascader
        :options="chinaJSON"
        v-model="studentForm.places"
        placeholder="请选择生源地区"
        @change="changeCode(studentForm.places)"
      />
    </el-form-item>
    <el-form-item
      label="生源学校"
      prop="school_name"
    >
      <el-select
        v-model="studentForm.school_id"
        placeholder="请输入生源学校"
      >
        <el-option
          v-for="list in schoolname"
          :key="list.value"
          :value="list.value"
          :label="list.name"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="就读年级"
      prop="grade"
    >
      <el-select
        v-model="studentForm.grade"
        placeholder="请选择年级"
      >
        <el-option
          v-for="list in studentStoreBefore.grade"
          :key="list.value"
          :value="list.value"
          :label="list.name"
        />
      </el-select>
    </el-form-item>

  </AppFormPage>
</template>


<style lang="postcss">
.student-form__input{
  width: 200px;
}
.el-form .student-form-contact{
  margin-left:-100px;
}
.student-form-contact .student-form-contact__inputPhone{
  float: left;
  width: 300px;

}
.student-form__block{
  position: relative;
}
.student-form__block .el-form-item{
  display: inline-block;
}
.student-form__code{
  position: absolute;
}
.student-form-code__codeImg{
  width: 100px;
  height: 100px;
  border: 1px solid gainsboro;
  & img{
    width: 100%;
  }
}
</style>
