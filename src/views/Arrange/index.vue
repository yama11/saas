
<script>
/**
 * @overview 上课安排  - 班级列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'ArrangeList',

  mixins: [list],

  data() {
    return {

      columns: [
        { prop: 'code', label: '班级编码' },
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'schedule_total', label: '课时数' },
        { prop: 'categories_name', label: '品类' },
        { prop: 'department_name', label: '机构' },
        { prop: 'name', label: '班级' },
        { label: '上课时间',
          formatter: row =>
            `
            ${row.start_date}
            至${row.end_date}
            `,
        },
        { label: '约课/满班人数',
          formatter: row =>
            `
          ${row.student_number}
          /${row.capacity}
          `,
        },
        { prop: 'class_status_name', label: '状态' },
        { prop: 'studio_name', label: '直播间' },
        { prop: 'anchor_name', label: '直播教师' },
        { prop: 'classroom_name', label: '教室' },
        { prop: 'audience_name', label: '辅师' },
      ],

      list: {},

      id: null,

      arrangeStatus: [],

      visible: false,

      formData: {
        id: null,
        class_id: null,
        curriculum_id: null,
        scheme_id: null,
        studio_id: null,
        anchor_id: null,
        classroom_id: null,
        audience_id: null,
      },

      editionInfo: {
        anchor: [],
        studio: [],
      },

      classData: {
        classrooms: [],
      },

      manageData: {
        manage_teachers: [],
      },

      categories: [],


    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'department_name', label: '校区' },
        { prop: 'name', label: '班级名称' },
      ];

      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '请选择机构' },
        { selectValue: this.arrangeStatus,
          componentType: 'AppSearchStatus',
          searchType: 'class_status' },
        { selectValue: this.categories,
          componentType: 'AppSearchCascader',
          searchType: ['category_name', 'product_name'] },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  created() {
    this.indexBefore();
  },

  methods: {

    indexBefore() {
      this.$http.get('/class/arrange_before')
        .then((res) => {
          this.arrangeStatus = res.status;

          this.categories = res.categories
            .map((item) => {
              const children = item.product
                .map(proItem => ({
                  value: proItem.product_name,
                  label: proItem.product_name,
                }));

              return {
                value: item.category_name,
                label: item.category_name,
                children,
              };
            });
        });
    },

    arrangeInfo(id) {
      this.$router.push(`/arrange-info/${id}`);
    },

    submitEdition(submit) {
      submit()
        .then(() => this.$refs.list.getList());
    },

    setClass(id, departmentId) {
      this.formData = {};

      this.id = id;

      this.visible = true;

      this.formData.class_id = this.id;

      this.$http.get(`/class/arrange/${id}`)
        .then((res) => {
          this.editionInfo = { ...res };
          this.formData.curriculum_id = this.editionInfo.rota.curriculum_id;
          this.formData.scheme_id = this.editionInfo.rota.scheme_id;
        });

      this.$http.get(`/option/classrooms?department_id=${departmentId}`)
        .then((res) => {
          this.classData = { ...res };
        });

      this.$http.get(`/option/manage_teachers?department_id=${departmentId}`)
        .then((res) => {
          this.manageData = { ...res };
        });
    },

  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    api="/class/arrange"
    title="上课安排"
  >
    <AppSearch
      slot="search"
      :search-arr="searchArr"
    />
    <template slot-scope="props">
      <el-table :data="props.listData">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :formatter="column.formatter"
        />
        <el-table-column
          label="操作"
          width="230px"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="arrangeInfo(scope.row.id)"
            >查看</el-button>
            <el-button
              v-if="scope.row.class_status_name!=='已结束'"
              type="small"
              size="small"
              @click="setClass(scope.row.id,scope.row.department_id)"
            >
              班级设置
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <AppFormDialog
        :visible.sync="visible"
        :model="formData"
        :url="'/class/rota/'+formData.class_id"
        label-width="5em"
        object="班级设置"
        width="500px"
        @on-submit="submitEdition"
      >
        <el-form-item
          label="直播间"
          prop="studio"
        >
          <el-select
            v-model="formData.studio_id"
            placeholder="请选择直播间"
          >
            <el-option
              v-for="role in editionInfo.studio"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="直播老师"
          prop="update_type"
        >
          <el-select
            v-model="formData.anchor_id"
            placeholder="请选择直播老师"
          >
            <el-option
              v-for="role in editionInfo.anchor"
              :key="role.id"
              :label="role.realname"
              :value="role.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="教室"
          prop="classrooms"
        >
          <el-select
            v-model="formData.classroom_id"
            placeholder="请选择教室"
          >
            <el-option
              v-for="role in classData.classrooms"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="辅师"
          prop="manage_teachers"
        >
          <el-select
            v-model="formData.audience_id"
            placeholder="请选择辅师"
          >
            <el-option
              v-for="role in manageData.manage_teachers"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </AppFormDialog>
    </template>

  </AppList>
</template>

