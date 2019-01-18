<template>
  <div>
    <el-row
      :gutter="12"
      v-for="item in todoList"
      :key="item.todo"
      class="margin-bottom"
    >
      <el-col :span="24">
        <el-card shadow="hover">
          {{ item.todo }}
          <el-dropdown class="float-right">
            <span class="el-dropdown-link">
              더보기<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
              @click.native="delete1">
                삭제
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TodoList',
  props: {
    todoList: {
      type: Array,
      required: true,
    },
  },
  methods: {
    delete1() {
      console.log('[delete]');
    },
  },
  mounted() {
    console.log('[this.todoList]', this.todoList);
  },
};
</script>

<style lang="scss" scoped>
  .el-card {
    &__body {
      padding: 14px !important;
    }
  }
</style>
