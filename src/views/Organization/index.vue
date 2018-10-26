<script>
/**
 * @overview 机构管理 - 培训机构
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {
  name: 'Organization',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'name', label: '机构名称' },
        { prop: 'number', label: '机构编码' },
        { prop: 'dealer.name', label: '所属区域运营商' },
        { prop: 'account', label: '管理员账号' },
        { label: '地区',
          formatter: (row) => {
            let arr = '';
            if (row.province) {
              arr += row.province.name;
            }
            if (row.city) {
              arr += row.city.name;
            }
            if (row.district) {
              arr += row.district.name;
            }
            return arr;
          },
        },
        { prop: 'address', label: '详细地址' },
        { prop: 'phone', label: '联系电话' },
      ],
      departments: [],

      dialog: false,

      title: '',

      formData: {},

      list: {},

      roleType: this.$store.state.roleType,

      divide: false,

    };
  },
  computed: {
    searchArr() {
      const column = this.roleType === 31 ? [
        { prop: 'name', label: '机构名称' },
        { prop: 'number', label: '机构编码' },
        { prop: 'account', label: '账号' },
      ] :
        [
          { prop: 'name', label: '机构名称' },
          { prop: 'number', label: '机构编码' },
          { prop: 'dealer_name', label: '所属区域运营商' },
          { prop: 'account', label: '账号' },
        ];

      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '选择机构' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`system.department.${key}`, text);
    },

    Permission(key, text) {
      return this.$permissions(`system.manager_teacher.${key}`, text);
    },

    toCreate() {
      this.$router.push('/organization-create');
    },

    editDepartment(id) {
      this.$router.push(`/organization-edit/${id}`);
    },

    managerTeacher(id) {
      this.$router.push(`/organization-teacher/${id}`);
    },

    deleteDepartment(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '机构', '/department');
    },

    divideDepartment() {
      this.divide = true;
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
    :create-label="checkPermission('store')?'新增机构':null"
    title="培训机构"
    api="/department"
    @create="toCreate"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('index')"
      slot-scope="props"
    >
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
          width="280px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="Permission('index')"
              size="small"
              @click="managerTeacher(scope.row.id)"
            >辅师管理</el-button>
            <el-button
              size="small"
              @click="divideDepartment(scope.row.id)"
            >分成</el-button>
            <el-button
              v-if="checkPermission('update')"
              size="small"
              @click="editDepartment(scope.row.id)"
            >编辑</el-button>
            <el-button
              v-if="checkPermission('delete')"
              type="danger"
              size="small"
              @click="deleteDepartment(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <AppFormDialog
        :visible.sync="divide"
        url="/freeze"
        label-width="5em"
        object="分成比例"
        width="500px"
        @on-submit="submitEdition"
      >
        <div class="department-popup">
          <div class="department_title">总部</div>
          <div class="department_content">麦克斯韦</div>
          <div class="department_data">
            <el-input
              maxlength="10"
              placeholder="请输入"
            />&nbsp;%
          </div>
        </div>
        <div class="department-popup">
          <div class="department_title">城市合伙人</div>
          <div class="department_content">厦门城市合伙人</div>
          <div class="department_data">
            <el-input
              maxlength="10"
              placeholder="请输入"
            />&nbsp;%
          </div>
        </div>
        <div class="department-popup">
          <div class="department_title">区域运营商</div>
          <div class="department_content">思明区运营商</div>
          <div class="department_data">
            <el-input
              maxlength="10"
              placeholder="请输入"
            />&nbsp;%
          </div>
        </div>
        <div class="department-popup">
          <div class="department_title">机构</div>
          <div class="department_content">心超越枋湖校区</div>
          <div class="department_data">
            <el-input
              maxlength="10"
              placeholder="请输入"
            />&nbsp;%
          </div>
        </div>
      </AppFormDialog>
    </template>
  </AppList>

</template>
<style>
.department-popup{
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  margin-bottom: 15px;
}
.department-popup .el-input{
  width: 80%;
}
.department_title{
  width: 30%
}
.department_content{
  width: 35%
}
.department_data{
  width: 20%
}
</style>

