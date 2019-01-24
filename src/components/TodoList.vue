<template>
  <draggable
    :list="todoList"
    @end="onDragEnd"
  >
    <el-row
      :gutter="12"
      v-for="item in todoList"
      :key="item.todoID"
      class="margin-bottom"
    >
      <el-col :span="24" draggable>
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
  </draggable>
</template>

<script>
import { mapActions } from 'vuex';
import draggable from 'vuedraggable';

export default {
  name: 'TodoList',
  props: {
    todoList: {
      type: Array,
      required: true,
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      editTargetID: null,
      editContent: null,
    };
  },
  methods: {
    ...mapActions(['deleteTodo', 'editTodo', 'reassignPriority']),
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
    async onDragEnd() {
      const reSorted = this.todoList;
      try {
        await this.reassignPriority(reSorted);
      } catch (error) {
        this.$notify.error({
          title: 'Error',
          message: error.message,
        });
      }
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
