<script>
/**
 * @overview 生源学校 - 学校列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {
  name: 'SchoolList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        {
          label: '学校名称',
          prop: 'name',
        },
        {
          label: '地区',
          prop: 'places',
          formatter({
            province,
            city,
            district,
          }) {
            const provinceName = province ? province.name : '';
            const cityName = city ? city.name : '';
            const districtName = district ? district.name : '';

            return `${provinceName}${cityName}${districtName}`;
          },
        },
      ],

      visible: false,

      rules: {
        name: [
          this.$rules.required('学校名称'),
          { ...this.$rules.schoolName },
        ],
        names: [
          this.$rules.required('学校名称'),
          { ...this.$rules.moreSchoolName },
          {
            validator(rule, value, callback) {
              const schoolNameArr = value.split('\n');
              const schoolIndex = schoolNameArr.findIndex(item => item.length > 30);
              return (schoolIndex !== -1)
                ? callback('学校名称的长度不能超过30个字符')
                : callback();
            },
          },
        ],
      },

      chinaJSON: this.$assets.chinaJSON,

      formData: {},

      title: '',

    };
  },
  computed: {
    form() {
      if (!this.formData.names) return this.formData;

      const names = this.formData.names.split('\n');

      return { ...this.formData, names };
    },
    searchArr() {
      const column = [
        { prop: 'name', label: '学校名称' },
      ];

      const region = this.$assets.chinaJSON;

      const searchList = [
        { selectValue: region, componentType: 'AppSearchAddress', searchType: 'code', placeholder: '请选择地区' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`system.school.${key}`, text);
    },

    createSchool(id, value) {
      this.visible = true;

      if (id) {
        this.title = '编辑学校';
        this.formData = {
          id,
          name: value.name,
          places: [value.province_code, value.city_code, value.district_code],
        };
      } else {
        this.title = '添加学校';
        this.formData = {};
      }
    },

    deleteSchool(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '学校', '/school');
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
    :create-label="checkPermission('store')?'添加学校':null"
    title="生源学校"
    api="/school"
    @create="createSchool"
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
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />
        <el-table-column
          width="150px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('update')"
              size="small"
              @click="createSchool(scope.row.id, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="checkPermission('delete')"
              type="danger"
              size="small"
              @click="deleteSchool(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <AppFormDialog
        :visible.sync="visible"
        :rules="rules"
        :model="formData"
        :value="form"
        :id="formData.id"
        :object="title"
        url="/school"
        label-width="6em"
        class="school-edition"
        width="500px"
        @on-submit="submitEdition"
      >
        <el-form-item
          label="地区"
          prop="places"
        >
          <el-cascader
            :options="chinaJSON"
            v-model="formData.places"
            placeholder="请选择学校所在地区"
          />
        </el-form-item>

        <template v-if="!formData.id">
          <div class="school-edition__description">
            输入学校名称（每行新增一个学校）
          </div>

          <el-form-item prop="names">
            <el-input
              v-model="formData.names"
              :maxlength="200"
              :rows="8"
              type="textarea"
            />
          </el-form-item>
        </template>

        <el-form-item
          v-else
          label="学校名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            :maxlength="30"
            placeholder="请输入学校名称"
            type="text"
          />
        </el-form-item>
      </AppformDialog>
    </template>
  </AppList>
</template>


<style lang="postcss">

</style>
