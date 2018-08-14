<script>
/**
 * @overview 商品中心 - 排班 - 选择班级
 *
 * @author suyanping
 */

export default {
  name: 'ScheduleClass',

  props: {
    id: {
      type: Number,
      default: null,
    },

    schemeId: {
      type: Number,
      default: null,
    },

    classes: {
      type: Array,
      default: () => [],
    },

    departments: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      columns: [
        { prop: 'department_name', label: '机构' },
        { prop: 'name', label: '班级名称' },
        { prop: 'capacity', label: '班级容量' },
      ],

      classDialog: false,

      classId: null,

      classForm: {
        department_id: null,
        name: '',
        capacity: null,
      },

      classRules: {
        department_id: [
          this.$rules.required('所属机构', 'number'),
        ],

        name: [
          this.$rules.required('班级名称'),
        ],

        capacity: [
          this.$rules.required('班级容量'),
          { ...this.$rules.numbers },
        ],
      },
    };
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`curriculum_center.class.${key}`, text);
    },

    addClass() {
      this.classDialog = true;

      this.classId = null;

      this.classForm = {
        curriculum_id: this.id,
        scheme_id: this.schemeId,
        department_id: null,
        name: '',
        capacity: null,
        student_number: 0,
      };
    },

    submitClass(submit) {
      submit()
        .then(() => {
          this.$emit('getClassesData');
        });
    },

    updateClass(id) {
      this.classDialog = true;

      this.classId = id;

      this.$http.get(`/class/${id}`)
        .then((res) => {
          const department = this.departments
            .find(item => item.name === res.department_name);

          this.classForm = {
            ...res,
            department_id: department.department_id,
            capacity: res.capacity.toString(),
          };
        });
    },

    deleteClass(id) {
      this.$http.delete(`/class/${id}`)
        .then(() => {
          this.$emit('getClassesData');

          this.$message({
            message: '成功删除该班级',
            type: 'success',
          });
        })
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },
  },
};
</script>

<template>
  <div class="schedule-class">
    <p>意向班级：</p>
    <el-button
      v-if="checkPermission('store')"
      size="small"
      @click="addClass">添加班级</el-button>

    <el-table
      :data="classes"
      border
      class="schedule-class-body__table"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
      />

      <el-table-column
        label="操作"
        width="320px"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission('update')"
            size="small"
            @click="updateClass(scope.row.id)"
          >
            编辑
          </el-button>

          <el-button
            v-if="scope.row.student_number === 0 && checkPermission('delete')"
            size="small"
            type="danger"
            @click="deleteClass(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <AppFormDialog
      :visible.sync="classDialog"
      :rules="classRules"
      :model="classForm"
      :id="classId"
      :object="classId ? '编辑班级' : '添加班级'"
      url="/class"
      width="450px"
      label-width="6em"
      @on-submit="submitClass"
    >
      <el-form-item
        prop="department_id"
        label="所属机构"
      >
        <el-select
          v-if="classForm.student_number === 0"
          v-model="classForm.department_id"
          placeholder="请选择所属机构"
          style="width: 326px;"
        >
          <el-option
            v-for="item in departments"
            :key="item.id"
            :label="item.name"
            :value="item.department_id"
          />
        </el-select>

        <span v-else>
          {{ classForm.department_name }}
        </span>

      </el-form-item>

      <el-form-item
        prop="name"
        label="班级名称"
      >
        <el-input
          v-model="classForm.name"
          placeholder="请输入班级名称"
        />
      </el-form-item>

      <el-form-item
        prop="capacity"
        label="班级容量"
      >
        <el-input
          v-model="classForm.capacity"
          placeholder="请输入班级容量"
        />
      </el-form-item>
    </AppFormDialog>
  </div>
</template>

<style lang="postcss">
.schedule-class{
  background: #F0F0F0;
  padding-bottom: 20px;
  &>p{
    margin: 5px 10px;
    padding: 10px 0;
  }
  & button{
    margin: 0 0 10px 10px;
  }
}

.schedule-class-body__table{
  margin-left: 10px;
  width: 98%;
}
</style>
