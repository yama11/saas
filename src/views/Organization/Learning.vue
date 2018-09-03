<script>
/**
 * @overview 机构管理 - 辅师管理
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'LearningTeacher',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'realname', label: '辅师姓名' },
        { prop: 'name', label: '辅师账号' },
        { prop: 'phone', label: '手机号' },
        { prop: 'created_at', label: '添加时间' },
        { prop: 'user_status_name', label: '状态' },
      ],

      formData: {},

      list: {},

      id: this.$route.params.id,

      visible: false,

      title: '',

      managerId: null,

      rules: {
        realname: [
          this.$rules.required('辅师姓名'),
        ],
        phone: [
          this.$rules.required('手机号'),
          { ...this.$rules.mobile },
        ],
        name: [
          this.$rules.required('辅师账号'),
        ],
        password: [
          this.$rules.required('密码'),
        ],
      },
    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'realname', label: '辅师姓名' },
        { prop: 'phone', label: '手机号码' },
      ];
      const searchList = [
        { componentType: 'AppSearchColumn',
          searchType: column,
        },
      ];
      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`system.manager_teacher.${key}`, text);
    },

    learningTeacher(id, name, realname, phone, password) {
      this.visible = true;
      if (id) {
        this.title = '编辑辅师';
        this.managerId = id;
        this.formData.name = name;
        this.formData.realname = realname;
        this.formData.phone = phone;
        this.formData.password = password;
        this.formData.department_id = this.id;
      } else {
        this.title = '添加辅师';
        this.formData = {};
        this.formData.department_id = this.id;
      }
    },

    disabledTeacher(id) {
      const url = `/department/${this.id}/manager_teacher/${id}/disabled`;
      this.$http.patch(url)
        .then(() => {
          this.$refs.list.getList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    enabledTeacher(id) {
      const url = `/department/${this.id}/manager_teacher/${id}/enabled`;
      this.$http.patch(url)
        .then(() => {
          this.$refs.list.getList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    deleteLearning(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '辅师', `/department/${this.id}/manager_teacher`);
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
    :id="id"
    :api="`/department/${id}/manager_teacher`"
    :create-label="checkPermission('store')?'添加辅师':null"
    title="辅师管理"
    @create="learningTeacher"
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
              v-if="scope.row.user_status_name === '启用'&&checkPermission('disabled')"
              size="small"
              @click="disabledTeacher(scope.row.id)"
            >禁用
            </el-button>
            <el-button
              v-else-if="checkPermission('enabled')"
              size="small"
              @click="enabledTeacher(scope.row.id)"
            >启用
            </el-button>
            <el-button
              v-if="checkPermission('update')"
              size="small"
              @click="learningTeacher(scope.row.id,scope.row.name,
                                      scope.row.realname,scope.row.phone,
                                      scope.row.password)"
            >编辑</el-button>
            <el-button
              v-if="checkPermission('delete')"
              type="danger"
              size="small"
              @click="deleteLearning(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <AppFormDialog
        :visible.sync="visible"
        :model="formData"
        :rules ="rules"
        :id ="managerId"
        :url="`/department/${id}/manager_teacher`"
        :object="title"
        label-width="7em"
        class="process-edition"
        width="500px"
        @on-submit="submitEdition"
      >
        <el-form-item
          label="辅师姓名"
          prop="realname"
        >
          <el-input
            v-model="formData.realname"
            maxlength="10"
            placeholder="请输入辅师姓名"
          />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phone"
        >
          <el-input
            v-model="formData.phone"
            placeholder="请输入辅师手机号码"
          />
        </el-form-item>
        <el-form-item
          label="辅师账号"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            placeholder="请输入辅师账号"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="formData.password"
            placeholder="请输入辅师密码"
          />
        </el-form-item>
      </AppFormDialog>
    </template>
  </AppList>
</template>

