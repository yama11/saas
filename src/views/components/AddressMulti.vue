<script>
/**
 * @overview  地区多选
 *
 * @author suyanping
 */

export default {
  name: 'AddressMulti',

  props: {
    division: {
      type: Array,
      default: () => [],
    },

    addressTags: {
      type: Array,
      default: () => [],
    },

    // 是否3级联动地区
    isLinkage: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      chinaJSON: this.$assets.chinaJSON,

      proId: null,

      pro_city: [],

      pro_name: '',

      cityId: null,

      city_area: [],

      city_name: '',
    };
  },

  mounted() {
    window.document.addEventListener('click', (e) => {
      const isClassName = e.target.className === 'address-multi__show';

      const address = document.getElementsByClassName('address-multi__select')[0];

      if (isClassName) {
        address.style.display = 'block';

        return;
      }

      if (address) {
        address.style.display = 'none';

        this.pro_city = [];

        this.proId = null;

        this.city_area = [];

        this.cityId = null;
      }
    });
  },

  methods: {

    getCitys(city, value, name) {
      this.pro_city = [];

      this.proId = value;

      this.pro_name = '';

      this.city_area = [];

      this.city_name = '';

      this.cityId = null;

      if (!city) return;

      this.pro_city = city;

      this.pro_name = name;
    },

    cityChange(children, value, name) {
      if (children && this.isLinkage) return;

      const isCityIndex = this.division
        .findIndex(item => item === value);

      const isExist = this.addressTags
        .find(item => item.value === value);

      if (isExist && isExist.count > 0) return;

      if (isCityIndex === -1) {
        this.division.push(value);

        this.addressTags.push({
          name: this.pro_name + name,
          value,
        });

        this.getAddress();

        return;
      }

      this.division.splice(isCityIndex, 1);

      this.addressTags.splice(isCityIndex, 1);

      this.getAddress();
    },

    delCitys(value) {
      const cityIndex = this.addressTags
        .findIndex(item => item.value === value);

      this.division.splice(cityIndex, 1);

      this.addressTags.splice(cityIndex, 1);

      this.getAddress();
    },

    getAddress() {
      this.$emit('divisionCode', this.division);
    },

    stopDefault(children, value, label) {
      if (children) return;

      const isCityIndex = this.division
        .findIndex(item => item === value);

      const isExist = this.addressTags
        .find(item => item.value === value);

      if (isExist && isExist.count > 0) return;

      if (isCityIndex === -1) {
        this.division.push(value);

        this.addressTags.push({
          name: label,
          value,
        });

        this.getAddress();

        return;
      }

      this.division.splice(isCityIndex, 1);

      this.addressTags.splice(isCityIndex, 1);

      this.getAddress();
    },

    getAreas(area, value, name) {
      if (!this.isLinkage) return;

      this.city_area = [];

      this.city_name = '';

      this.cityId = value;

      if (!area) return;

      this.city_area = area;

      this.city_name = name;
    },

    areaChange(value, name) {
      const isAreaIndex = this.division
        .findIndex(item => item === value);

      const isExist = this.addressTags
        .find(item => item.value === value);

      if (isExist && isExist.count > 0) return;

      if (isAreaIndex === -1) {
        this.division.push(value);

        this.addressTags.push({
          name: this.pro_name + this.city_name + name,
          value,
        });

        this.getAddress();

        return;
      }

      this.division.splice(isAreaIndex, 1);

      this.addressTags.splice(isAreaIndex, 1);

      this.getAddress();
    },

  },
};
</script>

<template>
  <div class="address-multi">
    <div
      class="address-multi__show">
      <el-tag
        v-for="tag in addressTags"
        :key="tag.value"
        :closable="tag.count > 0 ? false : true"
        @close="delCitys(tag.value)">
        {{ tag.name }}
      </el-tag>
    </div>

    <div class="address-multi__select">

      <div class="address-multi-select__pro">
        <div
          v-for="pro in chinaJSON"
          :key="pro.value"
          :class="pro.value === proId
          ? 'address-multi-select__back' : ''"
          @click.stop="stopDefault(pro.children,pro.value,pro.label)"
          @mousemove="getCitys(pro.children,pro.value,pro.label)">
          {{ pro.label }}
          <span v-if="division.includes(pro.value)">
            <i class="el-icon-check"/>
          </span>
        </div>
      </div>

      <div
        v-if="pro_city.length > 0"
        class="address-multi-select__city">
        <div
          v-for="city in pro_city"
          :key="city.value"
          class="address-multi-selected"
          @click.stop="cityChange(city.children,city.value,city.label)"
          @mousemove="getAreas(city.children,city.value,city.label)">
          {{ city.label }}
          <span v-if="division.includes(city.value)">
            <i class="el-icon-check"/>
          </span>
        </div>
      </div>

      <div
        v-if="city_area.length > 0"
        class="address-multi-select__area">
        <div
          v-for="area in city_area"
          :key="area.value"
          class="address-multi-selected"
          @click.stop="areaChange(area.value,area.label)">
          {{ area.label }}
          <span v-if="division.includes(area.value)">
            <i class="el-icon-check"/>
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="postcss">
.address-multi{
  width: 400px;
}

.address-multi__show{
  width: 400px;
  min-height: 40px;
  border: 1px solid gainsboro;
  border-radius: 5px;
  & .el-tag{
    margin-left: 5px;
  }
}

.address-multi__select{
  position: relative;
  display: none;
}

.address-multi-select__back{
  background: ghostwhite;
}

.address-multi-select__pro,
.address-multi-select__city,
.address-multi-select__area{
  cursor: pointer;
  position: absolute;
  z-index: 1000;
  top: 2px;
  left: 0;
  background: white;
  text-align: center;
  overflow: auto;
  max-height: 160px;
  width: 150px;
  border: 1px solid #D2D2D2;
}

.address-multi-select__pro div:hover{
  background: ghostwhite;
}

.address-multi-select__city{
  left: 150px;
  width: 250px;
  & span{
    position: absolute;
    right: 10px;
  }
}

.address-multi-select__city div:hover,
.address-multi-select__area div:hover{
  background: ghostwhite;
}

.address-multi-select__area{
  left: 400px;
  width: 250px;
  & span{
    position: absolute;
    right: 10px;
  }
}
</style>
