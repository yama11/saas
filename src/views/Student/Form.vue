<template>
  <AppFormPage
    ref="studentForm"
    :model="studentForm"
    :rules="rules"
    :from="from"
    url="/student"
    object="学生"
    class="student-form"
    label-width="100px"
    @on-submit="submitForm"
  >
    <el-form-item
      class="student-form-contact"
    >
      <el-form-item
        label="第一联系人"
        prop="phone"
        class="student-form-contact__inputPhone"
      >
        <el-input
          v-model="studentForm.phone"
          placeholder="请输入手机号码"

        />
      </el-form-item>
      <el-form-item
        label="第二联系人"
        class="student-form-contact__inputPhone"
      >
        <el-input
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
          placeholder="请输入家长姓名"
        />
      </el-form-item>
      <el-form-item
        label="姓名"
        class="student-form-contact__inputPhone"
      >
        <el-input
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
          url="/student/upload"
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
      prop="department_id"
    >
      <el-select
        v-model="studentForm.department_id"
        placeholder="请选择生源地区"
      >
        <el-option
          v-for="list in studentStoreBefore.department"
          :key="list.value"
          :value="list.value"
          :label="list.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="生源学校"
      prop="school"
    >
      <el-select
        v-model="studentForm.school"
        placeholder="请输入生源学校"
      >
        <el-option
          v-for="list in studentStoreBefore.school"
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

<script>
/**
 * @desc 创建和编辑学生
 *
 * @author suyanping
*/
import { form } from '@/mixins';
import QRCode from 'qrcode';

export default {
  name: 'StudentForm',

  mixins: [form],

  data() {
    return {
      id: this.$route.params.id,

      studentForm: {
        head_url: '',
        birth_at: '',
        name: '',
        gender: 1,
        phone: '',
        school: null,
        grade: '',
        department_id: '',
        study_teacher_id: '',
      },

      rules: {
        head_url: [
          this.$rules.required('学员头像'),
        ],
        birth_at: [
          this.$rules.required('出生年月'),
        ],
        name: [
          this.$rules.required('学员姓名'),
          { ...this.$rules.name },
          {
            max: 5,
            message: '长度最多 5 个字符',
            trigger: 'blur,change',
          },
        ],
        gender: [
          this.$rules.required('学员性别', 'number'),
        ],
        phone: [
          this.$rules.required('第一联系人'),
          { ...this.$rules.mobile },
        ],
        school: [
          // this.$rules.required('学校', 'number'),
        ],
        grade: [
          // this.$rules.required('年级', 'number'),
        ],
        department_id: [
          this.$rules.required('校区', 'number'),
        ],
        study_teacher_id: [
          this.$rules.required('学管师', 'number'),
        ],
      },

      studentStoreBefore: {
        grade: [],
        gender: [],
        department: [],
        teachers: [],
        school: [],
      },

      imgUrl: '',
    };
  },

  methods: {
    // 获取学员数据源
    getFormBefore() {
      this.$http.get('/student/store_before')
        .then((res) => {
          this.studentStoreBefore = { ...res };
        });
    },

    // 获取当前学员信息
    getFormStore(id) {
      this.$http.get(`/student/${id}`)
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

          if (res.qrcode) {
            QRCode.toDataURL(res.qrcode)
              .then((url) => {
                this.imgUrl = url;
              });
          }
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
