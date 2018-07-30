<script>

import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{
  name: 'RoleInfo',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,
      tableData: [
        {
          dataName: '小小彬',
          datatime: '2015-12-10',
        },
      ],

    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];

      const {
        number: Number,
        description: Description,
        role_type: roleType,
        updated_at: updatedAt,
      } = this.data;

      return [
        {
          label: '课程名称',
          content: Number,
        },
        {
          label: '课时数',
          content: Description,
        },
        {
          label: '品类',
          content: roleType.toString(),
        },
        {
          label: '上课时间',
          content: updatedAt,
        },
      ];
    },

    curriculum() {
      if (!this.data) return [];

      const {
        id: Id,
        data_level: dataLevel,
        created_at: createdAt,
        name: Name,
        role_type_name: roleTypeName,
      } = this.data;

      return [
        {
          label: '班级名称',
          content: createdAt,
        },
        {
          label: '机构名称',
          content: dataLevel.toString(),
        },
        {
          label: '班级编码',
          content: Id.toString(),
        },
        {
          label: '约课/满课人数',
          content: Name,
        },
        {
          label: '班级状态',
          content: roleTypeName,
        },
      ];
    },
  },

  created() {
    this.getOrderInfo();
  },

  methods: {

    getOrderInfo() {
      const url = `/role/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    disreguardRefund() {
      return this.$router.push('/role-list');
    },
  },
};
</script>


<template>
  <div class="package-info">
    <header class="package-info__header">
      <h2 class="package-info__title">班级详情</h2>
    </header>
    <div
      v-if="data"
      class="order-info__body"

    >
      <div class="role-info-head">
        课程信息
      </div>
      <section class="package-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          v-bind="note"
        />
      </section>
      <div class="role-info-head">
        班级信息
      </div>
      <section class="package-info__buyer">
        <InfoNote
          v-for="note in curriculum"
          :key="note.label"
          v-bind="note"
        />
      </section>
      <div class="role-info-foot">
        <span class="role-info-foot__student">班级学生</span>
        <el-table
          :data="tableData"
          style="width: 28%"
          border
        >
          <el-table-column
            prop="dataName"
            label="学生姓名"
            width="130"
          />
          <el-table-column
            prop="datatime"
            label="约课时间"
            width="130"
          />
        </el-table>
      </div>

      <div class="role-info-foot">
        <span class="role-info-foot__student">调入记录</span>
        <el-table
          :data="tableData"
          style="width: 28%"
          border
        >
          <el-table-column
            prop="dataName"
            label="学生姓名"
            width="130"
          />
          <el-table-column
            prop="datatime"
            label="调入记录"
            width="130"
          />
        </el-table>
      </div>

      <div class="role-info-foot">
        <span class="role-info-foot__student">调出记录</span>
        <el-table
          :data="tableData"
          style="width: 28%"
          border
        >
          <el-table-column
            prop="dataName"
            label="学生姓名"
            width="130"
          />
          <el-table-column
            prop="datatime"
            label="调出记录"
            width="130"
          />
        </el-table>
      </div>

      <div class="package-info__but">
        <el-button
          type="primary"
          @click="disreguardRefund"
        >
          确定
        </el-button>
      </div>

    </div>
  </div>
</template>


<style lang="postcss">
.role-info-foot{
  height: 120px;
  margin-left: 10px;
  margin-top: 20px;
}
.role-info-foot__student{
  float: left;
  margin-right: 25px;
}
.role-info-head{
  font-size: 20px;
  font-weight: 800;
  background-color:#ccc;
  margin-top: 10px;
}
.package-info__but{
  display: flex;
  justify-content: center;
}
.order-info__body{
  padding-left: 10px;
}
.package-info__buyer{
    display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
}
.package-info__buyer .order-info-note{
    margin: .5em 0;
    width: 40%;
    padding-top: 15px;
}
</style>

