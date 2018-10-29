<script src="https://apps.bdimg.com/libs/jquery/1.10.2/jquery.min.js"></script>
<script>
/**
 * @overview 学生管理 - 学生列表
 *
 * @author yehaifeng
*/
import list from '@/mixins/list';

export default {

  name: 'StudentList',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'name', label: '学生姓名' },
        { prop: 'total_score', label: '总积分' },
        { prop: 'client_phone', label: '家长手机号码' },
        { prop: 'client_name', label: '家长姓名' },
        { prop: 'gender_name', label: '学生性别' },
        { prop: 'birth_at', label: '出生年月日' },
        { prop: 'school_name', label: '生源学校' },
        { prop: 'grade_name', label: '年级' },
      ],

      list: {},

      centerDialogVisible: false,

      url: '/member_center/student/import',

      fileData:{},

      reader:{},

    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'name', label: '学生姓名' },
        { prop: 'client_phone', label: '家长手机号码' },
        { prop: 'client_name', label: '家长姓名' },
        { prop: 'school_name', label: '生源学校' },
      ];
      const searchList = [
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },

  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`member_center.student.${key}`, text);
    },

    onCreate() {
      const url = 'https://final-admin-api.caihonggou.com/export?';

      window.location.href = `${url}`;
    },

    infoStudent(id) {
      this.$router.push(`/student-info/${id}`);
    },

    editStudent(id) {
      this.$router.push(`/student-edit/${id}`);
    },

    lookCourse(id, name) {
      this.$router.push(`/student-course/${id}_${name}`);
    },

    exportExcel() {
      this.fileData = {};
      this.reader = {};
      this.centerDialogVisible = true;
    },

    fileChange(e) {
      this.fileData = e.target.files[0];
      this.reader = new FormData();
      this.reader.append('excel',this.fileData);
      this.$refs.myfile.value = null;
    },

    fileUpload(){

     this.$http.post('/member_center/student/import',this.reader)
        .then(() => {
          this.$refs.list.getList();
          this.$message.success('文件上传成功!')
          this.centerDialogVisible = false;
        })
        .catch(() => {
          this.$message.error('文件上传失败，请重新上传!');
          this.centerDialogVisible = false;
        })
      }
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label ="checkPermission('import')?'导入模板下载':null"
    :skip-label ="checkPermission('import')?'导入excel':null"
    api="/member_center/student"
    title="学生管理"
    @create="onCreate"
    @skipPage="exportExcel"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('index')"
      slot-scope="props"
    >
      <el-table
        :data="props.listData"
      >
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :formatter="column.formatter"
        />
        <el-table-column
          label="操作"
          width="260px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('show')"
              size="small"
              @click="infoStudent(scope.row.id)"
            >查看</el-button>
            <el-button
              v-if="checkPermission('update')"

              size="small"
              @click="editStudent(scope.row.id)"
            >编辑</el-button>
            <el-button
              v-if="checkPermission('curriculum')"
              size="small"
              @click="lookCourse(scope.row.id,scope.row.name)"
            >查看课程</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :visible.sync="centerDialogVisible"
        title="学生导入"
        width="30%"
        center>
        <input
          id="myfile"
          ref="myfile"
          type="file"
          name="myfile"
          accept="application/vnd.ms-excel"
          class="inputfile"
          @change="fileChange"
        >
        <label
          for="myfile"
          class="btn btn-success">点击这里上传文件</label>
        <br>
        <span
          v-if="fileData.name"
          class="dialog-span"
        >{{ fileData.name }}</span>
        <span
          slot="footer"
          class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="fileUpload">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </AppList>

</template>


<style lang="postcss">
.student-list__img{
  width: 60px;
  height: 60px;
}
a{
  text-decoration: none;
}
.inputfile{
  opacity: 0;
}
.btn-success{
 padding: 4px 32px;
  height: 30px;
  line-height: 20px;
  margin-left: 170px;
  position: relative;
  cursor: pointer;
  color: #888;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1
}
.dialog-span{
    text-align: center;
    display: inherit;
    margin-top: 10px;
}

</style>
