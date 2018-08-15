
<script>

/**
 * @desc 商品中心 - 商品管理 - 添加、编辑、查看商品
 *
 * @author suyanping
*/
import { form } from '@/mixins';
import list from '@/mixins/list';
import { times } from '@/utils';
import AddressMulti from './../components/AddressMulti';

export default {
  name: 'ProductForm',

  components: {
    AddressMulti,
  },

  mixins: [form, list],

  data() {
    return {
      list: {},

      productId: this.$route.params.id,

      productStatus: 1,

      orderCount: 0,

      lookId: this.$route.params.id
        ? this.$route.params.id.split('_')[1]
        : undefined,

      pickerTime: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },

      columns: [
        { prop: 'name', label: '课程名称' },
        { prop: 'categories_name', label: '品类' },
        { prop: 'course_number', label: '课时数' },
        { prop: 'price', label: '课时单价' },
        { prop: 'refund_rate', label: '扣课折扣' },
        { label: '课程金额',
          formatter: (row) => {
            const coursePrice = row.price * row.course_number;

            return coursePrice.toFixed(2);
          } },
      ],

      courseList: [],

      dataForm: {
        cover: '',
        name: '',
        brief: '',
        merchandise_administrative_division: [],
        description: '',
        curriculum: [],
        original_price: null,
        unit_price: null,
        shelve_time: '',
      },

      rules: {
        cover: [
          this.$rules.required('商品封面'),
        ],
        name: [
          this.$rules.required('商品标题'),
        ],
        merchandise_administrative_division: [
          this.$rules.required('开放区域', 'array'),
        ],
        description: [
          this.$rules.required('商品详情'),
        ],
        curriculum: [
          this.$rules.required('课程售价需要填写完善或者课程', 'array'),
        ],
        unit_price: [
          this.$rules.required('商品售价'),
        ],
        shelve_time: [
          this.$rules.required('上架时间', 'date'),

          {
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error('上架时间不能为空'));

                return;
              }

              const nowTime = new Date().getTime();

              const changeTime = new Date(value).getTime();

              if (nowTime > changeTime) {
                callback(new Error('请选择大于当前的时间'));

                return;
              }

              callback();
            },
          },
        ],
      },

      division: [],

      addressTags: [],

      editor: '',

      totalPrice: null,

      visible: false,

      courseCol: [
        { prop: 'name', label: '课程名称' },
        { prop: 'categories_name', label: '品类' },
        { prop: 'course_number', label: '课时数' },
        { prop: 'price', label: '课时单价' },
        { prop: 'refund_rate', label: '扣课折扣' },
        { prop: 'scheme_number', label: '已排课时' },
      ],

      courseForm: {

      },

      courseRules: {},

      totalCourseList: [],

      selectCourseList: [],

    };
  },

  computed: {
    productTitle() {
      if (this.lookId) {
        return '查看商品';
      }

      if (this.$route.params.id) {
        return '编辑商品';
      }

      return '添加商品';
    },
  },

  watch: {
    list() {
      this.selectCourseList = [];
    },
  },

  created() {
    this.getFormData();
  },

  mounted() {
    setTimeout(() => {
      window.CKEDITOR.replace('editor', {
        height: '300px',
        width: '100%',
        toolbar: 'Full',
        language: 'zh-cn',
      });

      this.editor = window.CKEDITOR.instances.editor;

      this.editor.on('instanceReady', () => {
        if (this.lookId) {
          this.editor.setReadOnly(true);
        }

        this.editor.addCommand('image', {
          exec() {
          // const uploadSelect =
          // document.querySelector('#product-form-detail__upload [name=file]');

          // uploadSelect.click();
          },
        });
      });

      this.editor.on('change', () => {
        this.dataForm.description = this.editor.getData();
      });

      this.editor.on('focus', () => {
        const address = document.getElementsByClassName('address-multi__select')[0];

        if (address) {
          address.style.display = 'none';
        }
      });
    }, 300);
  },

  methods: {
    getFormData() {
      if (!this.productId) return;

      this.$http.get(`/merchandise/${this.productId}`)
        .then((res) => {
          this.dataForm = {
            ...res,
            shelve_time: new Date(res.shelve_time),
          };

          this.productStatus = res.status;

          this.orderCount = res.order_count;

          this.dataForm.merchandise_administrative_division
          = res.merchandise_administrative_division
              .map(item => item.administrative_division_code);

          this.division = res.merchandise_administrative_division
            .map(item => item.administrative_division_code);

          this.addressTags = res.merchandise_administrative_division
            .map(item => ({
              name: item.administrative_division_full_name,
              value: item.administrative_division_code,
              count: res.order_count,
            }));

          this.dataForm.curriculum = res.curriculum_merchandise
            .map(item => ({
              curriculum_id: item.curriculum_id,
              price: item.price,
            }));

          this.courseList = res.curriculum_merchandise
            .map(item => ({
              ...item.curriculum,
              sell_price: item.price,
              count: res.order_count,
            }));
        });
    },

    getCoverUrl(url) {
      this.dataForm.cover = url;
    },

    getDivisionCode(value) {
      this.dataForm.merchandise_administrative_division = value;
    },

    selectCourse() {
      this.visible = true;

      this.totalCourseList = [];

      this.selectCourseList = [];

      setTimeout(() => {
        this.$refs.multipleTable.clearSelection();
      }, 1);
    },

    getCourseArr(val) {
      const courseLength = this.selectCourseList.length;

      const lengths = val.length;

      if (courseLength > lengths) {
        this.delTotal(val);
      }

      if (courseLength < lengths) {
        this.addTotal(val);
      }

      this.selectCourseList = val;
    },

    delTotal(val) {
      this.selectCourseList
        .forEach((item) => {
          const course = val.find(selItem => item.id === selItem.id);

          if (!course) {
            const delIndex = this.totalCourseList
              .findIndex(totalItem => item.id === totalItem.id);

            this.totalCourseList.splice(delIndex, 1);
          }
        });
    },

    addTotal(val) {
      val.forEach((item) => {
        const course = this.totalCourseList
          .find(valItem => item.id === valItem.id);

        if (!course) {
          this.totalCourseList.push(item);
        }
      });
    },

    submitCourse(submit) {
      submit()
        .then(() => {
          this.totalCourseList
            .forEach((item) => {
              const course = this.courseList
                .find(valItem => item.id === valItem.id);

              if (!course) {
                this.courseList.push({
                  ...item,
                  count: 0,
                });
              }
            });

          this.getCoursePrice();
        });
    },

    delCourse(id) {
      const delIndex = this.courseList
        .findIndex(item => item.id === id);

      if (delIndex !== -1) {
        this.courseList.splice(delIndex, 1);
      }

      this.getCoursePrice();

      this.getUnitPrice();
    },

    getCoursePrice() {
      const originalPrice = this.courseList
        .reduce((acc, item) => {
          const price = item.price * item.course_number;

          const totalPrice = acc + price;

          return totalPrice;
        }, 0);

      this.dataForm.original_price = originalPrice.toFixed(2);
    },

    getPrice(val) {
      const pattern = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{2}$)/;

      const price = val.course_number * val.price;

      const isLegal = pattern.test(val.sell_price);

      const courseIndex = this.courseList
        .findIndex(item => item.id === val.id);

      if (!isLegal) {
        this.$message.error('请输入正整数或者保留两位小数');

        this.courseList[courseIndex].sell_price = null;

        return;
      }

      if (val.sell_price > price) {
        this.$message.error('输入的售价不能大于课程金额');

        this.courseList[courseIndex].sell_price = null;
      }

      this.getUnitPrice();
    },

    getUnitPrice() {
      let price = 0;

      const unitPrice = this.courseList
        .reduce((acc, item) => {
          if (item.sell_price) {
            price = acc + Number(item.sell_price);
          }

          return price;
        }, 0);

      this.dataForm.unit_price = unitPrice.toFixed(2);

      this.dataForm.curriculum = [];

      this.dataForm.curriculum = this.courseList
        .map(item => (
          {
            curriculum_id: item.id,
            price: item.sell_price,
          }
        ));
    },

    initTime() {
      const isEmpty = this.dataForm.shelve_time;

      if (isEmpty) return;

      this.dataForm.shelve_time = times.dateChange(new Date(), 'total');
    },

    submitForm(submit) {
      const priceIndex = this.courseList
        .findIndex(item => !item.sell_price);

      if (priceIndex !== -1) {
        return;
      }

      if (this.dataForm.shelve_time) {
        this.dataForm.shelve_time = times.dateChange(this.dataForm.shelve_time, 'total');
      }

      if (this.lookId || this.productStatus !== 1 || this.orderCount > 0) {
        this.$refs.dataForm.clearValidate(['shelve_time']);
      }

      submit()
        .then(() => {

        })
        .catch(() => {
          if (this.dataForm.shelve_time) {
            this.dataForm.shelve_time = new Date(this.dataForm.shelve_time);
          }
        });
    },

  },
};
</script>

<template>
  <AppFormPage
    ref="dataForm"
    :model="dataForm"
    :rules="rules"
    :from="from"
    :object="productTitle"
    url="/merchandise"
    class="product-form"
    label-width="100px"
    @on-submit="submitForm"
  >

    <el-form-item
      label="商品封面图"
      prop="cover"
    >

      <AppUploader
        v-if="!lookId"
        v-model="dataForm.cover"
        @on-success="getCoverUrl"
      />

      <img
        v-else
        :src="dataForm.cover"
        class="product-form-uploader__displayImg"
      >
    </el-form-item>

    <el-form-item
      label="商品标题"
      prop="name"
    >
      <el-input
        v-model="dataForm.name"
        :readonly="lookId ? true : false"
        :maxlength="30"
        type="text"
        placeholder="请输入商品标题"
        class="product-form__text"/>
    </el-form-item>

    <el-form-item
      label="商品简介"
      prop="brief"
    >
      <el-input
        v-model="dataForm.brief"
        :readonly="lookId ? true : false"
        :maxlength="30"
        type="text"
        placeholder="请输入商品简介"
        class="product-form__text"/>
    </el-form-item>

    <el-form-item
      label="开放区域"
      prop="merchandise_administrative_division"
    >

      <AddressMulti
        v-if="!lookId"
        :division="division"
        :address-tags="addressTags"
        @divisionCode="getDivisionCode"/>

      <div
        v-else
        class="product-form__address">
        <el-tag
          v-for="tag in addressTags"
          :key="tag.value">
          {{ tag.name }}
        </el-tag>
      </div>

    </el-form-item>

    <el-form-item
      label="商品详情"
      prop="description"
    >
      <textarea
        id="editor"
        v-model="dataForm.description"
        rows="10"
        cols="80"/>

        <!-- <el-upload
        id="product-form-detail__upload"
        :on-success="detailUploadSuccess"
        :on-error="uploadError"
        :action="uploadURL"
        :headers="uploadHeaders"
        :show-file-list="false"
        accept="image/jpg,image/jpeg,image/png"
        name="resource"
      /> -->

        <!-- <AppUploader
        v-if="!lookId"
        id="product-form-detail__upload"
        v-model="dataForm.cover"
        name="resource"
        @on-success="getCoverUrl"
      /> -->

    </el-form-item>

    <el-form-item
      label="选择课程"
      prop="curriculum"
    >

      <el-button
        v-if="!lookId"
        size="small"
        @click="selectCourse">
        选择课程
      </el-button>

      <el-table
        :data="courseList"
      >
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />

        <el-table-column
          prop="sell_price"
          label="售价"
          width="100px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.sell_price"
              :readonly="lookId ? true : false"
              @change="getPrice(scope.row)"/>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!lookId"
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.count < 1"
              size="small"
              type="danger"
              @click="delCourse(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <div>
        已选课程总价：{{ dataForm.original_price }}
      </div>
    </el-form-item>

    <el-form-item
      label="商品售价"
      prop="unit_price"
    >
      {{ dataForm.unit_price }}
    </el-form-item>

    <el-form-item
      label="上架时间"
      prop=""
    >
      <el-date-picker
        v-model="dataForm.shelve_time"
        :readonly="(lookId || productStatus !== 1 || orderCount > 0) ? true : false"
        :picker-options="pickerTime"
        format="yyyy-MM-dd HH:mm"
        type="datetime"
        placeholder="上架时间"
        @focus="initTime"/>
    </el-form-item>

    <AppFormDialog
      :visible.sync="visible"
      :rules="courseRules"
      :model="courseForm"
      object="选择课程"
      width="1000px"
      class="product-form__dialog"
      @on-submit="submitCourse"
    >

      <div
        class="product-form-dialog__course">
        <el-tag
          v-for="item in totalCourseList"
          :key="item.id">
          {{ item.name }}
        </el-tag>
      </div>

      <el-form-item
        prop="calendar"
        label=""
      >

        <AppList
          ref="list"
          :list.sync="list"
          api="/curriculum"
          title=""
        >

          <template slot-scope="{ listData }">
            <el-table
              ref="multipleTable"
              :data="listData"
              max-height="387"
              border
              @selection-change="getCourseArr"
            >
              <el-table-column
                type="selection"
                width="55"/>

              <el-table-column
                v-for="col in courseCol"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :formatter="col.formatter"
              />

            </el-table>

          </template>
        </AppList>
      </el-form-item>
    </AppFormDialog>

  </AppFormPage>

</template>

<style lang="postcss">
.product-form__text{
  width: 600px;
}

.product-form__address{
  width: 400px;
  min-height: 40px;
  border: 1px solid gainsboro;
  border-radius: 5px;
}

.product-form__address .el-tag{
  margin-left: 5px;
}

.product-form-uploader__placeholder {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid gainsboro;
}

.product-form-uploader__display {
  width: 100px;
  height: 100px;
  display: block;
}

.product-form-uploader__displayImg{
  width: 100px;
  height: 100px;
  display: block;
  position:relative;
  top: 16px;
}

.product-form-dialog__course{
  width: 900px;
  margin-left: 30px;
}

.product-form-dialog__course .el-tag{
  margin-right: 5px;
}

/* elementUI样式重置 */

.product-form-uploader .el-upload {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.product-form-uploader .el-upload:hover {
  border-color: #409EFF;
}

#product-form-detail__upload{
  display: none;
}

.product-form__price{
  width: 220px;
}

.product-form__dialog .el-dialog__body{
  padding-top: 0px;
}
</style>
