<script>
/**
 * @overview 挂起管理  - 挂起管理列表
 *
 * @author yehaifeng
 */
import errorHandler from '@/components/AppFormAlert/errorHandler';
import list from '@/mixins/list';
import ChangeEdition from '../Change/Edition';
import QuitEdition from '../Quit/Edition';

export default {

  name: 'FreezeList',

  components: {
    ChangeEdition,
    QuitEdition,
  },

  mixins: [list],


  data() {
    return {

      columns: [
        { prop: 'student_name', label: '学生姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'hour_remain', label: '挂起课时' },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'class_name', label: '班级' },
        { prop: 'audit_date', label: '挂起时间' },
      ],

      list: {},

      freeze_status: [],

      visible: false,

      editionInfo: {
        id: null,
        visible: false,
        formData: {
          primordial: {
            classes: {
              scheme: {
                start_date: '',
                end_date: '',
              },
            },
          },
          current: {
            scheme: {},
          },
          schemeArr: [],
        },
      },

      editionQuit: {
        id: null,
        visible: false,
        formData: {},
      },

      unvisible: false,

      unformData: {
        hour_id: null,
        student_id: null,
        parent_id: null,
        curriculum_id: null,
        department_id: null,
        scheme_id: null,
        hour_total: null,
        hour_remain: null,
        hour_finish: null,
        refund_money: null,
      },

      unfreezeId: null,

      cancelId: null,

    };
  },

  computed: {

    searchArr() {
      const column = [
        { prop: 'student_name', label: '学生姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'curriculum_name', label: '课程名称' },
      ];

      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '请选择机构' },
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { selectValue: this.freeze_status, componentType: 'AppSearchStatus', searchType: 'freeze_status', placeholder: '请选择状态' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  created() {
    this.indexBefore();
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`dispatch_center.freeze.${key}`, text);
    },

    changeClass(value, id) {
      this.visible = true;

      this.editionInfo = {
        id: null,
        visible: false,
        formData: {
          primordial: {
            classes: {
              scheme: {
                start_date: '',
                end_date: '',
              },
            },
          },
          current: {
            scheme: {},
          },
          schemeArr: [],
        },
      };
      this.editionInfo.visible = true;

      this.$http.post('/change/create', { id })
        .then((res) => {
          this.editionInfo.formData.primordial = res.primordial;
          this.editionInfo.formData.primordial.class_id = res.primordial.classes.id;
          this.editionInfo.formData.primordial.curriculum_id = res.primordial.curriculum_id;
          this.editionInfo.formData.primordial.scheme_id = res.primordial.classes.scheme.id;

          this.editionInfo.formData.current = { ...res.current };
          this.editionInfo.formData.student_id = res.student_id;
          this.editionInfo.formData.parent_id = res.parent_id;
          this.editionInfo.formData.hour_id = res.hour_id;

          this.editionInfo.formData.primordial.classes.scheme = res.primordial.classes.scheme;

          const currCourse = res.current
            .find(item => item.id === this.editionInfo.formData.primordial.curriculum_id);
          if (currCourse) {
            this.editionInfo.formData.current.curriculum_id = currCourse.id;

            const arrs = currCourse.scheme
              .filter(item => item.start_date);

            this.editionInfo.formData.schemeArr = arrs
              .map(item => ({
                ...item,
                date: `${item.start_date.split(' ')[0]}~${item.end_date.split(' ')[0]}`,
              }));
          }
        })
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
      this.editionInfo.id = value.id;
    },

    quitDeal(id) {
      this.editionQuit.visible = true;
      this.editionQuit.id = id;
      this.$http.post('/quit/create', { id })
        .then((res) => {
          this.editionQuit.formData = { ...res };
        })
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },

    unfreeze(id) {
      this.unfreezeId = id;
      this.unvisible = true;
    },

    freezeInfo(id) {
      this.$router.push(`/freeze-info/${id}`);
    },

    freezeDeal(id) {
      this.$router.push(`/freeze-deal/${id}`);
    },

    indexBefore() {
      this.$http.get('/freeze/index_before')
        .then((res) => {
          this.freeze_status = res.freeze_status;
        })
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },

    toCreateFreeze() {
      this.$router.push('/freeze-create');
    },

    submitEdition(submit) {
      submit().then(() => this.$refs.list.getList());
    },

    submitUnfreeze(id) {
      this.cancelId = parseFloat(id);
      this.$http.post(`/freeze/cancel/${this.cancelId}`)
        .then(() => this.$refs.list.getList())
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        })
        .finally(() => {
          this.unvisible = false;
        });
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store')?'挂起':null"
    api="/freeze"
    title="挂起管理"
    @create="toCreateFreeze"
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
        />
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.operation.show && checkPermission('show')"
              size="small"
              @click="freezeInfo(scope.row.id)"
            >查看</el-button>
            <el-button
              v-if="scope.row.operation.change"
              size="small"
              @click="changeClass(scope.row,scope.row.hour_id)"
            >转班</el-button>
            <el-button
              v-if="scope.row.operation.quit "
              size="small"
              @click="quitDeal(scope.row.hour_id)"
            >退班</el-button>
            <el-button
              v-if="scope.row.operation.thaw &&checkPermission('cancel')"
              size="small"
              @click="unfreeze(scope.row.id)"
            >解冻</el-button>
            <el-button
              v-if="scope.row.operation.deal &&checkPermission('deal')"
              size="small"
              @click="freezeDeal(scope.row.id)"
            >挂起处理</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 转班 -->
      <ChangeEdition
        :visible.sync="visible"
        :id="editionInfo.id"
        :form-data="editionInfo.formData"
        width="458px"
        @on-submit="submitEdition"
      />
      <!-- 退班 -->
      <QuitEdition
        :visible.sync="editionQuit.visible"
        :id="editionQuit.id"
        :form-data="editionQuit.formData"
        width="458px"
        @on-submit="submitEdition"
      />
      <AppFormDialog
        :visible.sync="unvisible"
        url="/freeze"
        label-width="5em"
        object="解冻"
        width="500px"
        class="freeze-popup"
        @on-submit="submitUnfreeze(unfreezeId)"
      >
        <span
          class="freeze-popup__span"
        >确定解冻该学生该课程?</span>
      </AppFormDialog>
    </template>
  </AppList>
</template>

<style>
.change-edition .change-info__classtime__week{
  margin-top: 10px;
  display: block;
}
</style>
