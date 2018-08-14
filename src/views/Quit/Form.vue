<script>
/**
 * @overview 退班管理  - 退班列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'QuitForm',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'student_name', label: '学习姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '课程名称' },
        { label: '上课时间',
          formatter: row =>
            `
            ${row.start_date.split(' ')[0]}
            ~${row.end_date.split(' ')[0]}
          `,
        },
        { prop: 'department_name', label: '机构名称' },
        { prop: 'class_name', label: '班级名称' },
        { prop: 'class_code', label: '班级编码' },
        { prop: 'remain_hour', label: '剩余课时' },
      ],

      list: {},

      visible: false,

      formData: {
        hour_id: null,
        student_id: null,
        parent_id: null,
        curriculum_id: null,
        department_id: null,
        scheme_id: null,
        class_id: null,
        hour_total: null,
        hour_remain: null,
        hour_finish: null,
        refund_money: null,
        discount: null,
        paid_money: null,
      },

      package_productions: [],

    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'student_name', label: '学习姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'department_name', label: '机构名称' },
        { prop: 'class_name', label: '班级名称' },
        { prop: 'class_code', label: '班级编码' },
      ];

      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  created() {
    this.indexBefore();
  },

  methods: {

    formQuitClass(id) {
      this.visible = true;

      this.$http.post('/quit/create', { id })
        .then((res) => {
          this.formData = { ...res };
          console.log(this.formData);
        });
    },

    indexBefore() {
      this.$http.get('/quit/index_before')
        .then((res) => {
          this.package_productions = res.package_productions;
        });
    },

    submitEdition(submit) {
      submit().then(() => this.$refs.list.getList());
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :columns="columns"
    api="/quit/student"
    title="退班"
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
              @click="formQuitClass(scope.row.id)"
            >退班</el-button>

            <AppFormDialog
              :visible.sync="visible"
              :model="formData"
              url="/quit"
              object="退班"
              label-width="8em"
              class="process-edition"
              width="550px"
              @on-submit="submitEdition"
            >
              <el-form-item
                label="课程名称"
                prop="curriculum_name"
              >
                <span>{{ formData.curriculum_name }}</span>
              </el-form-item>
              <el-form-item
                label="单价"
                prop="price"
              >
                <span>{{ formData.price }}</span>
              </el-form-item>
              <el-form-item
                label="扣课折扣"
                prop="refund_rate"
              >
                <span>{{ formData.refund_rate }}</span>
              </el-form-item>
              <el-form-item
                label="总课时"
                prop="hour_total"
              >
                <span>{{ formData.hour_total }}</span>
              </el-form-item>
              <el-form-item
                label="实付金额"
                prop="paid"
              >
                <span>{{ formData.paid }}</span>
              </el-form-item>
              <el-form-item
                label="已耗课时"
                prop="hour_finish"
              >
                <span>{{ formData.hour_finish }}</span>
              </el-form-item>
              <el-form-item
                label="原订单优惠金额"
                prop="discount"
              >
                <span>{{ formData.discount }}</span>
              </el-form-item>
              <el-form-item
                label="退费金额"
                prop="refund_money"
              >
                <span>{{ formData.refund_money }}</span>
              </el-form-item>
            </AppFormDialog>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<style>

</style>
