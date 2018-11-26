
<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=T9kb9PgCGdvSBOiHW7vMbEmU0S8gyTjK"></script>
<script>
/**
 * @overview 机构管理 - 添加机构
 *
 * @author yehaifeng
 */
import errorHandler from '@/components/AppFormAlert/errorHandler';
import form from '@/mixins/form';
import { BaiduMap } from 'vue-baidu-map';
import organizationEdition from './Edition';

export default {

  name: 'PackageForm',

  components: {
    BaiduMap,
    organizationEdition,
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

      rules: {
        name: [
          this.$rules.required('机构名称'),
        ],
        number: [
          this.$rules.required('机构编码'),
        ],
        dealer_id: [
          this.$rules.required('所属区域运营商', 'number'),
        ],
        phone: [
          this.$rules.required('联系电话'),
          { ...this.$rules.mobile },
        ],
        account: [
          this.$rules.required('管理员账号'),
        ],
        password: [
          this.$rules.required('密码'),
          { ...this.$rules.userPassword },
        ],
        places: [
          this.$rules.required('所在区域', 'array'),
        ],
        address: [
          this.$rules.required('详细地址'),
        ],
      },

      visible: false,

      found: true,

      formEdition: {
        platform_percentage: null,
        partner_percentage: null,
        department_percentage: null,
        dealer_percentage: null,
        department_id: null,
        platform_id: null,
        partner_id: null,
        dealer_id: null,
        platform_name: '',
        partner_name: '',
        dealer_name: '',
        department_name: '',
      },

      departmentId: null,

      list: {},

      searchData: '',

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

    handler() {
      const map = new BMap.Map('alimap');
      const point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point,12);
      function myFun(result) {
        const cityName = result.name;
        map.setCenter(cityName);
      }
      const myCity = new BMap.LocalCity();
      myCity.get(myFun);
        const geoc = new BMap.Geocoder();
        setTimeout(() =>{
          geoc.getPoint(this.searchData, (point) => {
          if (point) {
              map.centerAndZoom(this.searchData, 16);
              map.addOverlay(new BMap.Marker(point));
          } else {
              alert('您选择地址没有解析到结果!');
          }
          });
        },300)

      map.addEventListener('click', (e) => {
        this.bd09togcj02(e.point.lng, e.point.lat);

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
        })
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },

    bd09togcj02(bd_lng, bd_lat) {
      const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
      const bd_lon = +bd_lng;
      const bd_lot = +bd_lat;
      const x = bd_lon - 0.0065;
      const y = bd_lot - 0.006;
      const z = Math.sqrt((x * x) + (y * y)) - (0.00002 * Math.sin(y * x_PI));
      const theta = Math.atan2(y, x) - (0.000003 * Math.cos(x * x_PI));
      const gg_lng = z * Math.cos(theta);
      const gg_lat = z * Math.sin(theta);

      this.formDate.longitude = gg_lng;
      this.formDate.latitude = gg_lat;

      this.mapLngLat = `${gg_lng},${gg_lat}`;
    },

    submitEdition() {
      if (this.id) {
        this.$http.put(`/department/${this.id}`, this.formDate)
          .then(() => {
            this.cancelForm();
          })
          .catch((error) => {
            const errorMessage = errorHandler(error);

            this.$message.error(errorMessage[0]);
          });
        return;
      }
      this.$http.post('/department', this.formDate)
        .then((res) => {
          this.departmentId = res.id;
          this.divideDepartment();
        })
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },

    divideDepartment() {
      this.formEdition = {
        platform_percentage: null,
        partner_percentage: null,
        department_percentage: null,
        dealer_percentage: null,
        department_id: null,
        platform_id: null,
        partner_id: null,
        dealer_id: null,
        platform_name: '',
        partner_name: '',
        dealer_name: '',
        department_name: '',
      };
      this.$http.get(`/department/proportion/${this.departmentId}`)
        .then((res) => {
          this.formEdition = { ...res };
          this.formEdition.id = res.department_id;
          this.visible = true;
        })
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },

    cancelForm() {
      if (this.from.matched.length) {
        return this.$router.back();
      }
      const prefix = this.$route.path.match(/^\/\w+-/)[0];
      const location = (prefix && prefix.concat('list')) || '/';
      return this.$router.push(location);
    },

  },
};
</script>
<template>
  <AppFormPage
    :model="formDate"
    :from="from"
    :rules="rules"
    :id="id"
    :object="id ?'编辑机构':'添加机构'"
    label-width="9em"
    url="/department"
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
          label="所属区域运营商"
          prop="dealer_id"
          class="organization-form__dealer"
        >
          <el-select
            v-model="formDate.dealer_id"
            placeholder="请输入所属区域运营商"
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
        <div
          class="organization-form__search"
        >
          <el-input
            v-model="searchData"
            placeholder="请输入搜索地址"
          />
          <el-button
            icon="el-icon-search"
            @click="handler"

          />
        </div>
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
    <div slot="footer">
      <el-button
        type="primary"
        @click="submitEdition"
      >
        提交
      </el-button>
      <el-button
        @click="cancelForm"
      >
        取消
      </el-button>
    </div>
    <organizationEdition
      :visible.sync="visible"
      :id="formEdition.id"
      :form-data="formEdition"
      :found="found"
      width="458px"
      @getData="cancelForm"
    />
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
.organization-form__search{
  margin-bottom: 20px;
}
.organization-form__search .el-input{
  width: 40%;
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

