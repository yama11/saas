
<script>
/**
 * 课程中心 - 时间表 - 列表
 *
 * @author suyanping
 */

import list from '@/mixins/list';
import SchoolTime from './../components/SchoolTime';

export default {
  name: 'CourseTimeTable',

  components: {
    SchoolTime,
  },

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'name', label: '名称' },
        { label: '上课时间',
          formatter: (row) => {
            let schoolTime = '';
            if (row.subsidiary.length > 0) {
              schoolTime = this.getContent(row.subsidiary);
            }
            return schoolTime;
          } },
        { prop: 'create_date', label: '创建时间' },
      ],

      weekList: [
        { weekTitle: '星期一', day: 1, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期二', day: 2, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期三', day: 3, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期四', day: 4, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期五', day: 5, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期六', day: 6, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期日', day: 7, timeVal: [{ start_end: '' }] },
      ],

      formData: {
        name: '',
        subsidiary: [],
      },

      formRules: {
        name: [
          this.$rules.required('名称'),
        ],

        subsidiary: [
          this.$rules.required('上课时间', 'array'),
        ],
      },

      otherForm: {},

      visible: false,

      id: null,

      weekNames: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],

    };
  },

  computed: {
    searchArr() {
      const searchList = [{ componentType: 'AppSearchDate', searchType: 'created_at' }];

      return searchList;
    },
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`curriculum_center.timetable.${key}`, text);
    },

    createTimeTable() {
      this.visible = true;

      this.id = null;

      this.formData = {
        name: '',
        subsidiary: [],
      };

      this.weekList = [
        { weekTitle: '星期一', day: 1, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期二', day: 2, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期三', day: 3, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期四', day: 4, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期五', day: 5, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期六', day: 6, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期日', day: 7, timeVal: [{ start_end: '' }] },
      ];
    },

    getCycleList(data) {
      this.formData.subsidiary = data;
    },

    submitEdition(submit) {
      submit()
        .then(() => this.$refs.list.getList());
    },

    updateTimeTable(id) {
      this.$http.get(`/timetable/${id}`)
        .then((res) => {
          this.visible = true;

          this.weekList = res.subsidiary;

          this.formData = res;

          this.id = res.id;
        })
        .catch(({ message }) => {
          this.$message({ type: 'error', message });
        });
    },

    deleteTimeTable(id) {
      this.$_listMixin_alertDeleteItem(
        id,
        this.list.data,
        '时间表',
        '/timetable',
        this.$refs.list,
      );
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
    :create-label="checkPermission('store', '创建时间表')"
    class="timeTable-list"
    api="/timetable"
    title="时间表"
    @create="createTimeTable()"
  >

    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"/>

    <template
      v-if="checkPermission('index')"
      slot-scope="{ listData }">
      <el-table
        :data="listData"
      >
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />

        <el-table-column
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('update')"
              size="small"
              @click="updateTimeTable(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-if="checkPermission('delete')"
              size="small"
              type="danger"
              @click="deleteTimeTable(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <AppFormDialog
        :visible.sync="visible"
        :model="formData"
        :rules="formRules"
        :id="id"
        :object="id ? '编辑时间' : '创建时间'"
        url="/timetable"
        class="timeTable-list__edition"
        width="1450px"
        label-width="6em"
        @on-submit="submitEdition"
      >
        <el-form-item
          prop="name"
          label="名称"
        >
          <el-input
            v-model="formData.name"
            :maxlength="10"
            placeholder="请输入名称"
            style="width:500px;"
          />
        </el-form-item>

        <el-form-item
          prop="subsidiary"
          label="上课时间"
        >
          <SchoolTime
            :id="id"
            :week-msg="weekList"
            :other-form="otherForm"
            @getCycle="getCycleList"
          />
        </el-form-item>

      </AppFormDialog>

    </template>
  </AppList>
</template>

<style lang="postcss">

</style>
