<script>
/**
 * @overview  教室维护
 *
 * @author  suyanping
 */
import list from '@/mixins/list';
import { times } from '@/utils';

export default {

  name: 'ClassroomList',

  mixins: [list],

  data() {
    return {

      list: {},

      chinaJSON: this.$assets.chinaJSON,

      columns: [
        { prop: 'name', label: '教室名称' },
        { prop: 'account', label: '账号' },
        { prop: 'department_name', label: '所属机构' },
        { prop: 'classroom_status_name', label: '状态' },
      ],

      formData: {
        name: '',
        number: '',
        department_id: null,
        account: '',
        password: '',
      },

      formRules: {
        name: [
          this.$rules.required('教室名称'),
        ],
        number: [
          this.$rules.required('教室编码'),
        ],
        department_id: [
          this.$rules.required('所属机构', 'number'),
        ],
        account: [
          this.$rules.required('教室账号'),
        ],
        password: [
          this.$rules.required('教室密码'),
        ],
      },

      classroomId: null,

      palces: [],

      departmentList: [],

      visible: false,

      classUsageList: [],

      usageColumn: [
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'categories_name', label: '品类' },
        { prop: 'class_name', label: '班级' },
        { label: '上课日期',
          formatter: row =>
            `${times.dateChange(row.scheme.start_date)}至${times.dateChange(row.scheme.end_date)}`,
        },
        { label: '上课时间',
          formatter: (row) => {
            let schoolTime = '';
            if (row.scheme.calendar.length > 0) {
              schoolTime = this.getContent(row.scheme.calendar);
            }
            return schoolTime;
          } },
        { prop: 'class_status_name', label: '状态' },
      ],

      usageVisable: false,

      weekNames: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'name', label: '教室名称' },
        { prop: 'department_name', label: '所属机构' },
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
      return this.$permissions(`system.classroom.${key}`, text);
    },

    createClassroom() {
      this.visible = true;

      this.classroomId = null;

      this.palces = [];

      this.departmentList = [];

      this.formData = {
        name: '',
        number: '',
        department_id: null,
        account: '',
        password: '',
      };
    },

    getDepartmentPlaces(value) {
      this.departmentList = [];

      this.formData.department_id = null;

      if (value.length === 0) return;

      const addName = ['province_code', 'city_code', 'district_code'];

      const valObj = value.reduce(((acc, item, index) => {
        acc[addName[index]] = item;

        return acc;
      }), {});

      const condition = Object.keys(valObj)
        .map(key => `${key}=${valObj[key]}`)
        .join('&');

      this.$http.get(`/option/schedule_departments?${condition}`)
        .then((res) => {
          this.departmentList = res.departments;
        });
    },

    submitEdition(submit) {
      submit()
        .then(() => this.$refs.list.getList());
    },

    lookSituation(id) {
      this.classUsageList = [];

      this.usageVisable = true;

      this.$http.get(`/classroom/usage/${id}`)
        .then((res) => {
          if (!res.rotas) return;

          this.classUsageList = res.rotas;
        });
    },

    updateClassroom(data) {
      const palceList = Object.values(data.department);

      this.palces = palceList
        .filter(item => item && item !== 0);

      this.getDepartmentPlaces(this.palces);

      this.classroomId = data.id;

      this.visible = true;

      this.formData = {
        name: data.name,
        number: data.number,
        department_id: data.department_id,
        account: data.account,
        password: '',
      };
    },

    delClassroom(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '教室',
        '/classroom',
        this.$refs.list,
      );
    },

    disabledClassroom(id) {
      this.$http.patch(`/classroom/${id}/disabled`)
        .then(() => this.$refs.list.getList())
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },

    enabledClassroom(id) {
      this.$http.patch(`/classroom/${id}/enabled`)
        .then(() => this.$refs.list.getList())
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },

    getContent(subsidiary) {
      const arrWeek = [];

      const arrTime = subsidiary
        .reduce((acc, item) => {
          const num = arrWeek.indexOf(item.day);

          if (num !== -1) {
            acc[num].timeStr += ` ${this.timeChange(item.start_time)}-${this.timeChange(item.end_time)}`;

            return acc;
          }

          arrWeek.push(item.day);

          const week = this.weekNames[item.day - 1];

          acc.push({
            week_date: `${week}: `,
            day: item.day,
            timeStr: `${this.timeChange(item.start_time)}-${this.timeChange(item.end_time)}`,
          });

          return acc;
        }, []);

      arrTime.sort((a, b) => a.day - b.day);

      const strTime = arrTime
        .reduce((acc, { week_date, timeStr }) => `${acc}${week_date}${timeStr} `, '');

      return strTime;
    },

    timeChange(time) {
      let str = '';

      if (time !== '') {
        const timeArr = time.split(':');

        str = `${timeArr[0]}:${timeArr[1]}`;
      }

      return str;
    },

  },

};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store', '添加教室')"
    api="/classroom"
    title="机构教室维护"
    @create="createClassroom"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('index')"
      slot-scope="props">
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
          width="350px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('usage')"
              size="small"
              type="primary"
              @click="lookSituation(scope.row.id)"
            >查看使用情况</el-button>
            <el-button
              v-if="checkPermission('update')"
              size="small"
              @click="updateClassroom(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="checkPermission('delete')"
              type="danger"
              size="small"
              @click="delClassroom(scope.row.id)"
            >删除</el-button>
            <el-button
              v-if="scope.row.classroom_status === 1 && checkPermission('disabled')"
              size="small"
              @click="disabledClassroom(scope.row.id)"
            >
              禁用
            </el-button>
            <el-button
              v-if="scope.row.classroom_status === 2 && checkPermission('enabled')"
              size="small"
              @click="enabledClassroom(scope.row.id)"
            >启用</el-button>
          </template>
        </el-table-column>
      </el-table>

      <AppFormDialog
        :visible.sync="visible"
        :rules="formRules"
        :model="formData"
        :object="classroomId ? '修改教室' : '添加教室'"
        :id="classroomId"
        url="/classroom"
        width="450px"
        label-width="6em"
        @on-submit="submitEdition"
      >
        <el-form-item
          prop="name"
          label="教室名称"
        >
          <el-input
            v-model="formData.name"
            :maxlength="10"
            placeholder="请输入教室名称"
          />
        </el-form-item>

        <el-form-item
          prop="department_id"
          label="所属机构"
        >
          <el-cascader
            :options="chinaJSON"
            :change-on-select="true"
            v-model="palces"
            clearable
            placeholder="请选择地区"
            style="width:325px;margin-bottom:20px;"
            @change="getDepartmentPlaces(palces)"
          />

          <el-select
            v-model="formData.department_id"
            filterable
            placeholder="请选择所属机构"
            style="width:325px;">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item
          prop="number"
          label="教室编码"
        >
          <el-input
            v-model="formData.number"
            placeholder="请输入教室编码"
          />
        </el-form-item>

        <el-form-item
          prop="account"
          label="教室账号"
        >
          <el-input
            v-model="formData.account"
            placeholder="请输入教室账号"
          />
        </el-form-item>

        <el-form-item
          prop="password"
          label="教室密码"
        >
          <el-input
            v-model="formData.password"
            placeholder="请输入教室密码"
          />
        </el-form-item>

      </AppFormDialog>

      <el-dialog
        :visible.sync="usageVisable"
        title="教室占用情况"
        width="1000px"
        center>
        <div>
          <el-table
            :data="classUsageList"
            max-height="500">
            <el-table-column
              v-for="column in usageColumn"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :formatter="column.formatter"
            />
          </el-table>
        </div>
        <span
          slot="footer"
          class="dialog-footer">
          <el-button
            type="primary"
            @click="usageVisable = false">确 定</el-button>
        </span>
      </el-dialog>

    </template>
  </AppList>
</template>

<style lang="postcss">

</style>
