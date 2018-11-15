<script>
/**
 * @overview 商品中心 - 订单管理 - 订单创建 - 选择学生
 *
 * @author suyanping
 */

import { form } from '@/mixins';

export default {
  name: 'StudentSelect',

  mixins: [form],

  props: {
    studentSelected: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {

      list: {},

      studentCol: [
        { prop: 'name', label: '学生姓名' },
        { prop: 'client_phone', label: '家长手机号码' },
        { prop: 'client_name', label: '家长姓名' },
        { prop: 'gender_name', label: '学生性别' },
        { prop: 'birth_at', label: '出生年月日' },
        { prop: 'school_name', label: '生源学校' },
        { prop: 'grade_name', label: '年级' },
      ],

      searchObj: {
        page: 1,
        per_page: 10,
      },

      inputValue: '',

      selectValue: '',

      currSelectList: [],

      // 控制页面加载状态
      loading: false,
    };
  },

  computed: {
    selectWidth() {
      const maxLength = Math.max(
        ...this.searchList.map(({ label }) => label.length),
      );

      return `${maxLength + 4}em`;
    },

    searchList() {
      const column = [
        { prop: 'name', label: '学生名称' },
        { prop: 'client_phone', label: '家长手机号' },
        { prop: 'client_name', label: '家长姓名' },
      ];

      return column;
    },
  },

  watch: {
    list() {
      this.currSelectList = [];
    },
  },

  created() {
    this.getStudentList();
  },

  methods: {
    getStudentList(page) {
      this.loading = true;

      this.searchObj = {
        page: page ? 1 : this.searchObj.page,
        per_page: this.searchObj.per_page,
      };

      if (this.selectValue) {
        this.searchObj[`like[${this.selectValue}]`] = this.inputValue;
      }

      const query = Object.keys(this.searchObj)
        .map(key => `${key}=${this.searchObj[key]}`)
        .join('&');

      this.$http.get(`/member_center/student?${query}`)
        .then((data) => {
          this.list = data;
        })
        .catch(() => {
          this.$message.error('数据请求发生错误');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onSizeChange(per_page) {
      this.searchObj = {
        ...this.searchObj,
        page: 1,
        per_page,
      };

      this.getStudentList();
    },

    onCurrentChange(page) {
      this.searchObj = {
        ...this.searchObj,
        page,
      };

      this.getStudentList();
    },

    getSelectList(val) {
      const studentLength = this.currSelectList.length;

      const lengths = val.length;

      if (studentLength > lengths) {
        this.delStudent(val);
      }

      if (studentLength < lengths) {
        this.addStudent(val);
      }

      this.currSelectList = val;
    },

    addStudent(val) {
      val.forEach((item) => {
        const student = this.studentSelected
          .find(valItem => item.id === valItem.id);

        if (!student) {
          this.studentSelected.push(item);
        }
      });

      this.sendStudentList();
    },

    delStudent(val) {
      this.currSelectList
        .forEach((item) => {
          const student = val.find(selItem => item.id === selItem.id);

          if (!student) {
            const delIndex = this.studentSelected
              .findIndex(totalItem => item.id === totalItem.id);

            this.studentSelected.splice(delIndex, 1);
          }
        });

      this.sendStudentList();
    },

    sendStudentList() {
      this.$emit('studentList', this.studentSelected);
    },
  },
};
</script>

<template>
  <div
    v-loading="loading"
    class="student-select">

    <div class="student-select__search">
      <el-input
        v-model="inputValue"
        class="student-select__input"
        placeholder="请输入关键字进行搜索"
        size="small"
        @keyup.enter.native="getStudentList('changePage')"
      >
        <el-select
          slot="prepend"
          v-model="selectValue"
          :style="{ width: selectWidth }"
          placeholder="请选择"
        >
          <el-option
            v-for="column in searchList"
            :key="column.prop"
            :label="column.label"
            :value="column.prop"
          />
        </el-select>
      </el-input>

      <el-button
        slot="append"
        icon="el-icon-search"
        size="small"
        class="student-select__button"
        @click="getStudentList('changePage')"
      />
    </div>

    <div style="clear:both;"/>

    <div
      v-if="studentSelected.length > 0"
      class="student-select__selected">
      <el-tag
        v-for="tag in studentSelected"
        :key="tag.id">
        {{ tag.name }}
      </el-tag>
    </div>

    <el-table
      :data="list.data"
      @selection-change="getSelectList"
    >

      <el-table-column
        type="selection"
        width="55"/>

      <el-table-column
        v-for="col in studentCol"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
      />

    </el-table>

    <footer
      class="student-select__footer"
    >
      <el-pagination
        v-if="list.total > 10"
        :current-page="list.current_page"
        :page-sizes="[10, 20, 50, 100, 500]"
        :page-size="10"
        :total="list.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </footer>
  </div>
</template>

<style lang="postcss">
.student-select{
}

.student-select__search{
  width: 350px;
  float: right;
}

.student-select__input{
  width: 300px;
}

.student-select__selected{
  max-height: 150px;
  overflow: auto;
  margin: 20px 0;
}

.student-select__selected .el-tag{
  margin: 5px 5px 0 0;
}

.student-select__footer{
  padding:  2em 0 1em;
  margin-top: auto;
}
</style>
