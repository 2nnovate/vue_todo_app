<template>
  <div>
    <el-row
      :gutter="12"
      v-for="item in todoList"
      :key="item.todoID"
      class="margin-bottom"
    >
      <el-col :span="24">
        <el-card shadow="hover" v-if="item.todoID !== editTargetID">
          {{ `${item.priority}. ${item.todo}` }}
          <el-dropdown class="float-right">
            <span class="el-dropdown-link">
              더보기<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
              @click.native="changeEditMode(item)">
                수정
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="deleteTodo(item.todoID)">
                삭제
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-card>
        <el-input
          v-if="item.todoID === editTargetID"
          v-model="editContent"
          clearable
          class="margin-bottom"
          v-focus
          @keyup.enter.native="editConfirm"
        >
          <el-button
            slot="append"
            @click.native="editConfirm"
          >edit</el-button>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'TodoList',
  props: {
    todoList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      editTargetID: null,
      editContent: null,
    };
  },
  methods: {
    ...mapActions(['deleteTodo', 'editTodo']),
    changeEditMode(item) {
      this.editTargetID = item.todoID;
      this.editContent = item.todo;
    },
    editConfirm() {
      if (!this.editTargetID) return;
      const editInfo = {
        todoID: this.editTargetID,
        todo: this.editContent,
      };
      this.editTodo(editInfo);
      this.editTargetID = null;
      this.editContent = null;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
  .el-card {
    &__body {
      padding: 14px !important;
    }
  }
</style>
