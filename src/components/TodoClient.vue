<template>
  <section>
    <header>
      Todo List
      <el-dropdown class="float-right header-icon">
        <span class="el-dropdown-link">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="deleteDialogVisible = true">
            전체 삭제
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </header>
    <article>
      <el-input
        v-model="todoInput"
        @keypress.enter.native="addTodoClient"
        v-focus
        placeholder="할 일을 입력해주세요"
        class="margin-bottom"
        clearable
      >
        <el-button
          slot="append"
          @click.native="addTodoClient"
        >add</el-button>
      </el-input>
      <todo-list :todoList="todoList"></todo-list>
    </article>
    <el-dialog
      title="Warnings"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :before-close="handleDeleteDialogClose">
      <h2>정말로 모든 할 일을 삭제하시겠습니까?</h2>
      <p class="warn-message">삭제된 데이터는 복구되지 않습니다.</p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleDeleteDialogClose">취소</el-button>
    <el-button type="primary" @click="handelDeleteAll">확인</el-button>
  </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import TodoList from './TodoList';

export default {
  name: 'TodoClient',
  components: { TodoList },
  data() {
    return {
      todoInput: '',
      deleteDialogVisible: false,
    };
  },
  computed: {
    ...mapState({
      todoList: state => state.todos,
    }),
  },
  methods: {
    ...mapActions(['fetchTodos', 'addTodo', 'deleteAll']),
    async addTodoClient() {
      if (!this.todoInput) return;
      try {
        await this.addTodo(this.todoInput);
      } catch (error) {
        this.$notify.error({
          title: 'Error',
          message: error.message,
        });
      }
      this.todoInput = '';
    },
    handleDeleteDialogClose() {
      this.deleteDialogVisible = false;
    },
    handelDeleteAll() {
      this.deleteAll();
      this.deleteDialogVisible = false;
    },
  },
  mounted() {
    this.fetchTodos();
  },
};
</script>

<style lang="scss">
  .header-icon {
    font-size: 2rem;
    top: -50%;
    transform: translateY(35%);
  }
  .warn-message {
    color: red;
    font-weight: bold;
  }
  .el-input{
    &__inner {
      padding: 30px 14px;
    }
  }
</style>
