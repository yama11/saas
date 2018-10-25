<script>
/**
 * @overview 商品中心 - 品类管理
 *
 * @author suyanping
 */
import list from '@/mixins/list';

export default {
  name: 'CategoryList',

  mixins: [list],

  data() {
    return {
      list: {},

      courseRootId: null,

      categoryId: null,

      fatherColumns: [
        { prop: 'name', label: '品类名称' },
      ],

      formData: {
        parent_id: null,
        name: '',
      },

      formRules: {
        name: [
          this.$rules.required('品类名称'),
        ],
      },

      categoryListChange: [],

      SubCategoryList: [],

      category_id: null,

      category_name: '',

      subFormData: {
        name: '',
        product_type: null,
        default_unit_price: null,
        default_refund_calculate_rate: null,
      },

      subFormRules: {
        name: [
          this.$rules.required('子品类名称'),
        ],
        default_unit_price: [
          this.$rules.required('课时售价'),
          { ...this.$rules.prices },
        ],
        default_refund_calculate_rate: [
          this.$rules.required('扣课折扣'),
          { ...this.$rules.discount },
        ],
      },

      sonColumns: [
        { prop: 'name', label: '子品类' },
        { prop: 'default_unit_price', label: '课时售价/元' },
        { prop: 'default_refund_calculate_rate', label: '扣课折扣' },
      ],

      subCategoryId: null,

      product_type: [],

      visible: false,

      subVisible: false,
    };
  },

  computed: {
    subCategoryUrl() {
      const url = `/category/${this.category_id}/product`;

      return url;
    },
  },

  watch: {
    categoryListChange() {
      this.getLightCurrent();
    },
  },

  created() {
    this.getCreateBefore();
  },

  methods: {
    checkCategory(key, text) {
      return this.$permissions(`shop.category.${key}`, text);
    },


    checkProduct(key, text) {
      return this.$permissions(`shop.product.${key}`, text);
    },

    getCreateBefore() {
      this.$http.get('/category/create_before')
        .then((res) => {
          this.courseRootId = res.course_root_id;
        });
    },

    addCategory() {
      this.visible = true;

      this.categoryId = null;

      this.formData = {
        parent_id: this.courseRootId,
        name: '',
      };
    },

    submitEdition(submit) {
      submit()
        .then(() => this.$refs.list.getList())
        .finally(() => this.getLightCurrent());
    },

    updateCategory(id) {
      this.visible = true;

      this.$http.get(`/category/${id}`)
        .then((res) => {
          this.categoryId = res.id;

          this.formData = res;
        });
    },

    deleteCategory(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '品类', '/category');

      if (this.category_id === id) {
        this.categoryListChange = this.list.data;
      }
    },

    getLightCurrent() {
      const isExist = this.list.data.find(item => item.id === this.category_id);

      if (isExist) {
        this.category_id = isExist.id;

        this.category_name = isExist.name;

        this.getSubCategoryList();

        this.$refs.categortTable.setCurrentRow(isExist);

        return;
      }

      this.category_id = null;

      this.category_name = '';

      this.SubCategoryList = [];
    },

    getSubCategory(row) {
      this.category_id = row.id;
      this.category_name = row.name;

      this.getSubCategoryList();

      this.$http.get(`${this.subCategoryUrl}/create_before`)
        .then((res) => {
          this.product_type = res.product_type;
        });
    },

    getSubCategoryList() {
      this.$http.get(`/category/${this.category_id}/product`)
        .then((res) => {
          this.SubCategoryList = res;
        });
    },

    addSubcategory() {
      if (!this.category_id) {
        this.$message.error('请选择一个品类');

        return;
      }

      this.subVisible = true;

      this.subCategoryId = null;

      this.subFormData = {
        name: '',
        product_type: this.product_type[0].value,
        default_unit_price: null,
        default_refund_calculate_rate: null,
      };
    },

    subCategorySubmit(submit) {
      submit()
        .then(() => {
          this.getSubCategoryList();
        });
    },

    updateSubCategory(id) {
      this.subVisible = true;

      this.$http.get(`${this.subCategoryUrl}/${id}`)
        .then((res) => {
          this.subCategoryId = res.id;

          this.subFormData = {
            ...res,
            id: res.id,
            product_type: this.product_type[0].value,
          };
        });
    },

    deleteSubCategory(id) {
      this.$_listMixin_alertDeleteItem(id, this.SubCategoryList, '子品类', this.subCategoryUrl);
    },
  },
};
</script>

<template>
  <div style="display:flex;">
    <AppList
      ref="list"
      :list.sync="list"
      class="category-list"
      api="/category"
      title="品类管理"
    >

      <template
        v-if="checkCategory('index')"
        slot-scope="{ listData }">
        <el-button
          v-if="checkCategory('store')"
          type="primary"
          size="small"
          @click="addCategory">添加品类</el-button>
        <el-table
          ref="categortTable"
          :data="listData"
          highlight-current-row
          @row-click="getSubCategory"
        >
          <el-table-column
            v-for="col in fatherColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
          />

          <el-table-column
            label="操作"
            width="150px"
          >
            <template slot-scope="scope">
              <el-button
                v-if="checkCategory('update')"
                size="small"
                @click.stop="updateCategory(scope.row.id)"
              >
                编辑
              </el-button>
              <el-button
                v-if="checkCategory('delete')"
                size="small"
                type="danger"
                @click.stop="deleteCategory(scope.row.id)"
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
          :id="categoryId"
          :object="categoryId ? '编辑品类' : '添加品类'"
          url="/category"
          width="450px"
          label-width="6em"
          @on-submit="submitEdition"
        >
          <el-form-item
            prop="name"
            label="品类名称"
          >
            <el-input
              v-model="formData.name"
              :maxlength="10"
              placeholder="请输入品类名称"
            />
          </el-form-item>
        </AppFormDialog>

      </template>
    </AppList>

    <div
      v-if="checkProduct('index')"
      class="sub-category-list">
      <template>
        <el-button
          v-if="checkProduct('store')"
          type="primary"
          size="small"
          @click="addSubcategory">添加子品类</el-button>

        <el-table
          :data="SubCategoryList"
          style="width: 100%"
        >
          <el-table-column
            v-for="col in sonColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
          />

          <el-table-column
            label="操作"
            width="150px"
          >
            <template slot-scope="scope">
              <el-button
                v-if="checkProduct('update')"
                size="small"
                @click="updateSubCategory(scope.row.id)"
              >
                编辑
              </el-button>
              <el-button
                v-if="checkProduct('delete')"
                size="small"
                type="danger"
                @click="deleteSubCategory(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <AppFormDialog
          :visible.sync="subVisible"
          :rules="subFormRules"
          :model="subFormData"
          :url="subCategoryUrl"
          :id="subCategoryId"
          :object="subCategoryId ? '编辑子品类' : '添加子品类'"
          width="450px"
          label-width="7em"
          @on-submit="subCategorySubmit"
        >
          <el-form-item
            prop="category_name"
            label="所属品类"
          >
            <div>{{ category_name }}</div>
          </el-form-item>

          <el-form-item
            prop="name"
            label="子品类名称"
          >
            <el-input
              v-model="subFormData.name"
              :maxlength="10"
              placeholder="请输入子品类名称"
            />
          </el-form-item>

          <el-form-item
            prop="default_unit_price"
            label="课时售价"
          >
            <el-input
              v-model="subFormData.default_unit_price"
              placeholder="请输入课时售价"
            />
          </el-form-item>

          <el-form-item
            prop="default_refund_calculate_rate"
            label="扣课折扣"
          >
            <el-input
              v-model="subFormData.default_refund_calculate_rate"
              placeholder="请输入扣课折扣(0<扣课折扣<=1之间)"
            />
          </el-form-item>
        </AppFormDialog>
      </template>
    </div>
  </div>
</template>

<style lang="postcss">
.category-list {
  display: inline-block;
  width: 50%;
}
.sub-category-list{
  display: inline-block;
  padding-top: 75px;
  width: 50%;
}
</style>
