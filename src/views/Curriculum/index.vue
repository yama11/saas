<script>
/**
 * @overview 商品中心 - 课程管理
 *
 * @author suyanping
 */
import list from '@/mixins/list';

export default {
  name: 'CurriculumList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'name', label: '课程名称' },
        { prop: 'categories_name', label: '品类' },
        { prop: 'course_number', label: '课时数' },
        { prop: 'code', label: '课程编码' },
        { prop: 'price', label: '课时单价' },
        { prop: 'refund_rate', label: '扣课折扣' },
        { prop: 'scheme_number', label: '已排课时' },
        { label: '关联商品',
          formatter: row => row.merchandise_name.join(', '),
        },
      ],

      formData: {
        name: '',
        category_name: '',
        product_name: '',
        course_number: null,
        refund_rate: null,
        price: null,
        code: '',
      },

      formRules: {
        name: [
          this.$rules.required('课程名称'),
        ],

        product_name: [
          this.$rules.required('所属品类'),
        ],

        course_number: [
          this.$rules.required('课时数'),
          { ...this.$rules.numbers },
        ],

        code: [
          this.$rules.required('课程编码'),
        ],
      },

      formBefore: {
        categories: [],
        product: [],
      },

      cascaderList: [],

      curriculumId: null,

      visible: false,

    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'name', label: '课程名称' },
        { prop: 'merchandise_name', label: '关联商品名称' },
      ];

      const searchList = [
        { selectValue: this.cascaderList,
          componentType: 'AppSearchCascader',
          searchType: ['category_name', 'product_name'],
        },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  created() {
    this.getIndexBefore();
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`curriculum_center.curriculum.${key}`, text);
    },

    onSkipPage() {
      this.$router.push('curriculum-timeTable');
    },

    getIndexBefore() {
      this.$http.get('/curriculum/index_before')
        .then((res) => {
          this.formBefore.catiesegor = res.categories;

          this.cascaderList = res.categories
            .map((item) => {
              const children = item.product
                .map(proItem => ({
                  value: proItem.product_name,
                  label: proItem.product_name,
                }));

              return {
                label: item.category_name,
                value: item.category_name,
                children,
              };
            });
        });
    },

    getProduct(name) {
      this.formData.product_name = '';

      this.formData.price = null;
      this.formData.refund_rate = null;

      this.getProductList(name);
    },

    getProductList(name) {
      this.formBefore.product = [];

      const subCategory = this.formBefore.categories
        .find(item => item.category_name === name);

      if (subCategory) {
        this.formBefore.product = subCategory.product;
      }
    },

    getPrice(name) {
      const productPrice = this.formBefore.product
        .find(item => item.product_name === name);

      if (productPrice) {
        this.formData.price = productPrice.price;
        this.formData.refund_rate = productPrice.refund_rate;
      }
    },

    createCurriculum() {
      this.visible = true;

      this.curriculumId = null;

      this.formData = {
        name: '',
        category_name: '',
        product_name: '',
        course_number: null,
        code: '',
      };
    },

    submitEdition(submit) {
      submit()
        .then(() => this.$refs.list.getList());
    },

    updateCurriculum(id) {
      this.visible = true;

      this.curriculumId = id;

      this.$http.get(`/curriculum/${id}`)
        .then((res) => {
          this.formData = {
            ...res,
            course_number: res.course_number
              ? res.course_number.toString()
              : null,
          };

          this.getProductList(res.category_name);
        });
    },

    classManage(id) {
      this.$router.push(`/curriculum-period/${id}`);
    },

    curriculumArrangement(id) {
      this.$router.push(`/curriculum-schedule/${id}`);
    },

    deleteCurriculum(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '课程', '/curriculum');
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('store', '课程创建')"
    skip-label= "时间模板"
    class="curriculum-list"
    api="/curriculum"
    title="课程管理"
    @create="createCurriculum"
    @skipPage="onSkipPage"
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
          width="320px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('update')"
              size="small"
              @click="updateCurriculum(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-if="checkPermission('course_index')"
              size="small"
              @click="classManage(scope.row.id)"
            >
              课时管理
            </el-button>
            <el-button
              v-if="checkPermission('schedule_index')"
              size="small"
              @click="curriculumArrangement(scope.row.id)"
            >
              排课
            </el-button>
            <el-button
              v-if="checkPermission('delete')"
              size="small"
              type="danger"
              @click="deleteCurriculum(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <AppFormDialog
        :visible.sync="visible"
        :rules="formRules"
        :model="formData"
        :object="curriculumId ? '课程编辑' : '课程创建'"
        :id="curriculumId"
        url="/curriculum"
        width="450px"
        label-width="6em"
        @on-submit="submitEdition"
      >
        <el-form-item
          prop="name"
          label="课程名称"
        >
          <el-input
            v-model="formData.name"
            :maxlength="20"
            placeholder="请输入课程名称"
          />
        </el-form-item>

        <el-form-item
          prop="product_name"
          label="所属品类"
          style="margin-bottom:0"
        >
          <div style="display:flex;">
            <el-select
              v-model="formData.category_name"
              placeholder="请选择品类"
              @change="getProduct(formData.category_name)">
              <el-option
                v-for="item in formBefore.categories"
                :key="item.category_name"
                :label="item.category_name"
                :value="item.category_name"/>
            </el-select>

            <el-select
              v-model="formData.product_name"
              placeholder="请选择子品类"
              style="margin-left:5px;"
              @change="getPrice(formData.product_name)">
              <el-option
                v-for="item in formBefore.product"
                :key="item.product_name"
                :label="item.product_name"
                :value="item.product_name"/>
            </el-select>
          </div>
          <span>
            单价
            <span v-if="formData.price">{{ formData.price }}元/时</span>
          </span>
        </el-form-item>

        <el-form-item
          prop="course_number"
          label="课时数"
        >
          <el-input
            v-model="formData.course_number"
            placeholder="请输入课时数"
          />
        </el-form-item>
        <el-form-item
          prop="code"
          label="课程编码"
        >
          <el-input
            v-model="formData.code"
            :maxlength="10"
            placeholder="请输入课程编码"
          />
        </el-form-item>
      </AppFormDialog>

    </template>
  </AppList>
</template>

<style lang="postcss">

</style>
