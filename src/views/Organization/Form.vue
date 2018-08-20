
<script>
/**
 * @overview 机构管理 - 添加机构
 *
 * @author yehaifeng
 */
import form from '@/mixins/form';
import { BaiduMap } from 'vue-baidu-map';

export default {

  name: 'PackageForm',

  components: {
    BaiduMap,
  },

  mixins: [form],

  data() {
    return {
      center: { lng: 0, lat: 0 },

      id: this.$route.params.id,

      deBefore: [],

      chinaJSON: this.$assets.chinaJSON,

      formDate: {},

      mapLngLat: null,

      address: '',

    };
  },

  created() {
    this.getFormBefore();
    if (this.id) {
      this.getForm(this.id);
    }
  },

  methods: {

    getFormBefore() {
      this.$http.get('/department/store_before')
        .then((res) => {
          this.deBefore = res.dealers;
        });
    },

    handler({ BMap, map }) {
      const point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point, 12);
      const geoc = new BMap.Geocoder();
      function myFun(result) {
        const cityName = result.name;
        map.setCenter(cityName);
      }
      const myCity = new BMap.LocalCity();
      myCity.get(myFun);
      map.addEventListener('click', (e) => {
        this.formDate.longitude = e.point.lng;
        this.formDate.latitude = e.point.lat;
        this.mapLngLat = `${e.point.lng},${e.point.lat}`;
        geoc.getLocation(e.point, (rs) => {
          const addComp = rs.addressComponents;
          this.address = addComp.street + addComp.streetNumber;
          this.formDate.address = this.address;
        });
      });
      map.enableScrollWheelZoom();
      map.enableContinuousZoom();
    },

    getForm(id) {
      this.$http.get(`/department/${id}`)
        .then((res) => {
          this.formDate = { ...res };
        });
    },

    submitEdition(submit) {
      submit();
    },

    cancelForm() {
      this.$refs.list.getList();
    },
  },
};
</script>
<template>
  <AppFormPage
    ref="formDate"
    :model="formDate"
    :from="from"
    :id="id"
    :object="id ?'编辑机构':'添加机构'"
    label-width="6em"
    url="/department"
    @on-submit="submitEdition"
    @on-cancel="cancelForm"
  >
    <div
      class="organization-form"
    >
      <div
        class="organization-form__data"
      >
        <el-form-item
          label="机构名称"
          prop="name"
        >
          <el-input
            v-model="formDate.name"
            :maxlength="20"
            placeholder="请输入机构名称"
          />
        </el-form-item>
        <el-form-item
          label="机构编码"
          prop="number"
        >
          <el-input
            v-model="formDate.number"
            :maxlength="10"
            placeholder="请输入机构编码"
          />
        </el-form-item>
        <el-form-item
          label="所属经销商"
          prop="dealer_id"
          class="organization-form__dealer"
        >
          <el-select
            v-model="formDate.dealer_id"
            placeholder="请输入所属经销商"
          >
            <el-option
              v-for="role in deBefore"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="phone"
        >
          <el-input
            v-model="formDate.phone"
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item
          label="管理员账号"
          prop="account"
        >
          <el-input
            v-model="formDate.account"
            placeholder="请输入管理员账号"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="formDate.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item
          prop="places"
          label="所在区域"
        >
          <el-cascader
            :options="chinaJSON"
            v-model="formDate.places"
            placeholder="请选择所在地区"
          />
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address"
        >
          <el-input
            v-if="address"
            v-model="address"
            placeholder="请输入详细地址"
          />
          <el-input
            v-else
            v-model="formDate.address"
            placeholder="请输入详细地址"
          />
        </el-form-item>
      </div>
      <div
        class="organization-form__map"
      >
        <baidu-map
          id="alimap"
          :center="center"
          class="map"
          ak="T9kb9PgCGdvSBOiHW7vMbEmU0S8gyTjK"
          @ready="handler"
        />
        <el-form-item
          label="经纬度"
          prop="longitude"
        >
          <div
            v-if="id"
          >
            {{ formDate.longitude }},{{ formDate.latitude }}
          </div>
          <div
            v-else
          >
            {{ mapLngLat }}
          </div>
        </el-form-item>
      </div>
    </div>
  </AppFormPage>
</template>
<style lang="postcss">
.organization-form .el-cascader,
.organization-form__dealer .el-select{
  width: 100%;
}
.organization-form .organization-form__map .el-form-item{
  font-size: 16px;
}
.organization-form{
  display: flex;
  justify-content: space-between;
}
.organization-form__data{
  width:400px;
}
.map{
  width: 650px;
  height: 350px;
  margin-right: 200px;
}
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}
.BMap_pop{
  display:none
  }
.BMap_shadow{
  display:none
  }
</style>

