<script>
/**
 * @overview 机构管理 - 培训机构
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';
import organizationEdition from './Edition';

export default {
  name: 'Organization',

  components: {
    organizationEdition,
  },

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

      title: '',

      formData: {
        platform_percentage: null,
        partner_percentage: null,
        department_percentage: null,
        dealer_percentage: null,
        department_id: null,
        platform_id: null,
        partner_id: null,
        dealer_id: null,
        platform_name: '',
        partner_name: '',
        dealer_name: '',
        department_name: '',
      },

      list: {},

      visible: false,

    };
  },
  computed: {
    searchArr() {
      const column = this.$store.state.roleType === 31 ? [
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

    divideDepartment(id) {
      this.formData = {
        platform_percentage: null,
        partner_percentage: null,
        department_percentage: null,
        dealer_percentage: null,
        department_id: null,
        platform_id: null,
        partner_id: null,
        dealer_id: null,
        platform_name: '',
        partner_name: '',
        dealer_name: '',
        department_name: '',
      };
      this.visible = true;
      this.$http.get(`/department/proportion/${id}`)
        .then((res) => {
          this.formData = { ...res };
          this.formData.id = res.department_id;
          this.formData.platform_percentage = res.platform_percentage;
          this.formData.partner_percentage = res.partner_percentage;
          this.formData.department_percentage = res.department_percentage;
          this.formData.dealer_percentage = res.dealer_percentage;
        })
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },

    submitEdition() {
      this.$refs.list.getList();
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
          width="320px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="Permission('index')"
              size="small"
              @click="managerTeacher(scope.row.id)"
            >辅师管理</el-button>
            <el-button
              v-if="checkPermission('proportion_show')"
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
      <organizationEdition
        :visible.sync="visible"
        :id="formData.id"
        :form-data="formData"
        width="458px"
        @getData="submitEdition"
      />
    </template>
  </AppList>

</template>
<style>

</style>

