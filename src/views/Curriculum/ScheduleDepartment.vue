<script>
/**
 * @overview 商品中心 - 排班 - 选择意向机构
 *
 * @author suyanping
 */

export default {
  name: 'ScheduleDepartment',

  props: {
    id: {
      type: Number,
      default: null,
    },

    schemeId: {
      type: Number,
      default: null,
    },

    departments: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {

      chinaJSON: this.$assets.chinaJSON,

      departmentDialog: false,

      departmentId: null,

      departmentForm: {
        department: [],
      },

      departmentRules: {
        department: [
          this.$rules.required('意向机构', 'array'),
        ],
      },

      departmentObj: {
        palces: [],
        dealer_id: null,
      },

      formBefore: {
        departmentData: [],
        dealers: [],
      },
    };
  },

  created() {
    this.getDealers();
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`curriculum_center.curriculum.${key}`, text);
    },

    getDealers() {
      this.$http.get('/option/dealers')
        .then((res) => {
          this.formBefore.dealers = res.dealers;
        });
    },

    addDepartment() {
      this.departmentDialog = true;

      this.departmentId = null;

      this.formBefore.departmentData = [];

      this.departmentObj = {
        places: [],
        dealer_id: null,
      };

      this.departmentForm = {
        department: [],
      };
    },

    getDepartmentPlaces(places) {
      this.departmentObj.places = places;

      this.getDepartmentList();
    },

    getDepartmentDealers(id) {
      this.departmentObj.dealer_id = id;

      this.getDepartmentList();
    },

    getDepartmentList() {
      const places = this.departmentObj.places;

      let valObj = {};

      if (this.departmentObj.dealer_id) {
        valObj = { dealer_id: this.departmentObj.dealer_id };
      }

      if (places.length === 1) {
        valObj = {
          ...valObj,
          province_code: places[0],
        };
      }

      if (places.length === 2) {
        valObj = {
          ...valObj,
          province_code: places[0],
          city_code: places[1],
        };
      }

      if (places.length === 3) {
        valObj = {
          ...valObj,
          province_code: places[0],
          city_code: places[1],
          district_code: places[2],
        };
      }

      const conditionList = Object.keys(valObj);

      if (conditionList.length === 0) {
        this.formBefore.departmentData = [];

        return;
      }

      const condition = conditionList
        .map(key => `${key}=${valObj[key]}`)
        .join('&');

      this.$http.get(`/option/schedule_departments?${condition}`)
        .then((res) => {
          this.formBefore.departmentData = res.departments;
        });
    },

    getDealerArr(val) {
      this.departmentForm.department = val
        .map(item => ({
          curriculum_id: this.id,
          scheme_id: this.schemeId,
          department_id: item.id,
        }));
    },

    submitDepartment(submit) {
      submit()
        .then(() => {
          this.$emit('getDepartmentData');
        });
    },

    delDepartment(id) {
      this.$http.delete(`/curriculum/schedule/department/${id}`)
        .then((res) => {
          this.$emit('getDeleteData', res.department);
        })
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },
  },
};
</script>

<template>
  <div class="schedule-department">
    <el-button
      v-if="checkPermission('schedule_department_store')"
      size="small"
      @click="addDepartment">
      +选择意向机构
    </el-button>

    <p>已选机构 {{ departments.length }}个</p>

    <el-tag
      v-for="item in departments"
      :key="item.id"
      :closable="checkPermission('schedule_department_delete')"
      type="info"
      class="schedule-department__label"
      @close="delDepartment(item.id)">
      {{ item.name }}
    </el-tag>


    <AppFormDialog
      :visible.sync="departmentDialog"
      :rules="departmentRules"
      :model="departmentForm"
      url="/curriculum/schedule/department"
      object="选择意向机构"
      width="1000px"
      label-width="6em"
      @on-submit="submitDepartment"
    >
      <div style="display: flex;">
        <el-form-item
          prop="palces"
          label="所属机构"
        >
          <el-cascader
            :options="chinaJSON"
            :change-on-select="true"
            v-model="departmentObj.palces"
            clearable
            placeholder="请选择所属机构"
            style="width:300px;"
            @change="getDepartmentPlaces(departmentObj.palces)"
          />
        </el-form-item>

        <el-form-item
          prop="dealer_id"
          label="所属经销商"
          style="margin-left:50px;"
        >
          <el-select
            v-model="departmentObj.dealer_id"
            filterable
            clearable
            placeholder="选择经销商"
            style="width:300px;"
            @change="getDepartmentDealers(departmentObj.dealer_id)"
          >
            <el-option
              v-for="mate in formBefore.dealers"
              :key="mate.id"
              :label="mate.name"
              :value="mate.id"
            />
          </el-select>
        </el-form-item>

      </div>

      <hr>

      <el-form-item
        prop="department"
        label=" "
        class="departmentTable"
      >
        <el-table
          ref="departmentData"
          :data="formBefore.departmentData"
          border
          tooltip-effect="dark"
          class="department-dialog__table"
          @selection-change="getDealerArr">
          <el-table-column
            type="selection"
            label="全选"
            width="55"/>
          <el-table-column
            prop="name"
            label="培训机构"/>
          <el-table-column
            prop="address"
            label="详细地址"/>
          <el-table-column
            prop="dealer.name"
            label="所属经销商"/>
        </el-table>
      </el-form-item>

    </AppFormDialog>
  </div>
</template>

<style lang="postcss">
.schedule-department{
  background: #F0F0F0;
  margin: 15px 0;
  padding: 5px 10px;
}

.schedule-department__label{
  margin-right: 10px;
}

.department-dialog__table{
  max-height:500px;
  overflow:auto;
  margin-bottom:20px;
}

.departmentTable{
  position: relative;
  left: -45px;
}
</style>
