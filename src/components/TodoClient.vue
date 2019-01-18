<template>
  <section>
    <header>
      Todo List
    </header>
    <article>
      <el-input
        placeholder="Please input"
        v-model="todoInput"
        clearable
        class="margin-bottom"
      >
        <el-button slot="append">add</el-button>
      </el-input>
      <todo-list :todoList="todoList"></todo-list>
    </article>
  </section>
</template>

<script>
import TodoList from './TodoList';

export default {
  name: 'TodoClient',
  components: { TodoList },
  data() {
    return {
      todoInput: '',
      selectedList: '',
      todoList: [
        {
          todo: '빨래하기',
        },
        {
          todo: '설거지하기',
        },
        {
          todo: '청소하기',
        },
        {
          todo: '운동하기',
        },
        {
          todo: '낮잠자기',
        },
      ],
    };
  },
  mounted() {
    console.log('Component mounted!');
    console.log('[this.todoList]', this.todoList);
  },
};
</script>

<style lang="scss" scoped>
</style>
