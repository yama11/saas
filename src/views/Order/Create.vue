<script>
/**
 * @overview 商品中心 - 订单管理 - 订单创建
 *
 * @author suyanping
 */

import { form } from '@/mixins';
import StudentSelect from './StudentSelect';
import ProductSelect from './ProductSelect';
import ArrangeClass from './ArrangeClass';
import SubmitOrder from './SubmitOrder';

export default {
  name: 'OrderCreate',

  components: {
    StudentSelect,
    ProductSelect,
    ArrangeClass,
    SubmitOrder,
  },

  mixins: [form],

  data() {
    return {
      steps: [
        { title: '选择学生' },
        { title: '选择商品' },
        { title: '约课' },
        { title: '确认订单' },
      ],

      currStep: 0,

      currStudentList: [],

      currProductList: [],

      classTableList: [],
    };
  },

  created() {

  },

  beforeRouterEnter(to, from, next) {
    next((vm) => {
      // eslint-disable-next-line
      vm.from = from;
    });
  },

  methods: {
    cancelForm() {
      if (this.from.matched.length) {
        return this.$router.back();
      }

      const prefix = this.$route.path.match(/^\/\w+-/)[0];

      const location = (prefix && prefix.concat('list')) || '/';

      return this.$router.push(location);
    },

    showFirst() {
      this.currStep = 0;
    },

    showSecond() {
      if (this.currStudentList.length === 0) {
        this.$message.error('请至少选择一个学生');

        return;
      }
      this.currStep = 1;
    },

    showThird() {
      if (this.currProductList.length === 0) {
        this.$message.error('请选择一个商品');

        return;
      }

      this.currStep = 2;
    },

    showFourth() {
      this.currStep = 3;
    },

    createOrder() {
      const student = this.currStudentList
        .map(item => item.id);

      const merchandise_id = this.currProductList[0].id;

      const curriculumList = this.classTableList
        .filter(item => item.class.id);

      const curriculum = curriculumList
        .map(item => ({
          curriculum_id: item.curriculum_id,
          class_id: item.class.id,
        }));

      const dataObj = { student, merchandise_id, curriculum };

      this.$http.post('/order/batch', dataObj)
        .then(() => this.cancelForm())
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },

    getStudentList(val) {
      this.currStudentList = val;
    },

    getProductList(val) {
      this.currProductList = val;

      this.getCurriculumList(val[0].id);
    },

    getCurriculumList(id) {
      this.$http.get(`/merchandise/${id}`)
        .then((res) => {
          this.classTableList = res.curriculum_merchandise
            .map(item => ({
              ...item,
              class: {},
              department: {},
              scheme: {},
            }));
        });
    },

    changeProductList(val) {
      const classes = this.classTableList
        .find(item => item.curriculum_id === val.id);

      const classChange = {
        ...classes,
        class: val.class,
        scheme: val.scheme,
        department: val.department,
      };

      const index = this.classTableList
        .findIndex(item => item.curriculum_id === val.id);

      this.classTableList.splice(index, 1, classChange);
    },
  },
};
</script>

<template>
  <div class="order-create">
    <header class="order-create__header">
      <h2 class="order-create__title">批量创建订单</h2>
    </header>

    <div class="order-create__step">
      <el-steps
        :active="currStep">
        <el-step
          v-for="item in steps"
          :key="item.title"
          :title="item.title"/>
      </el-steps>
    </div>

    <div
      v-if="currStep === 0"
      class="order-create__firStep">
      <StudentSelect
        :student-selected="currStudentList"
        @studentList="getStudentList"/>

      <span>
        <el-button
          type="primary"
          @click="showSecond">
          下一步
        </el-button>
      </span>
    </div>

    <div
      v-if="currStep === 1"
      class="order-create__secStep">
      <ProductSelect
        :product-select-list="currProductList"
        @productList="getProductList"/>

      <span>
        <el-button
          type="primary"
          @click="showFirst">
          上一步
        </el-button>

        <el-button
          type="primary"
          @click="showThird">
          下一步
        </el-button>
      </span>
    </div>

    <div
      v-if="currStep === 2"
      class="order-create__thiStep">
      <ArrangeClass
        :product-select-list="currProductList"
        :class-table-list="classTableList"
        @changeProduct="changeProductList"/>

      <span>
        <el-button
          type="primary"
          @click="showSecond">
          上一步
        </el-button>

        <el-button
          type="primary"
          @click="showFourth">
          下一步
        </el-button>
      </span>
    </div>

    <div
      v-if="currStep === 3"
      class="order-create__forStep">
      <SubmitOrder
        :student-selected="currStudentList"
        :product-select-list="currProductList"
        :class-table-list="classTableList"/>

      <span>
        <el-button
          type="primary"
          @click="showThird">
          上一步
        </el-button>

        <el-button
          type="primary"
          @click="createOrder">
          提交订单
        </el-button>
      </span>
    </div>

  </div>
</template>

<style lang="postcss">
.order-create {
  display: flex;
  flex-direction: column;
  padding: 0 2em;
}

.order-create__header {
  display: flex;
  align-items: center;
  padding: 1em 0 0.3em 0;
  border-bottom: 1px solid gainsboro;
}

.order-create__title {
  font-size: 1.2rem;
}

.order-create__step{
  width: 600px;
  margin: 20px 0;
}

.order-create__firStep>span,
.order-create__secStep>span,
.order-create__thiStep>span,
.order-create__forStep>span{
  display: inline-block;
  width: 100%;
  text-align: center;
  margin: 20px 0;
}
</style>
