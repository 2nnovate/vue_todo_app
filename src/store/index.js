import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: [],
  },
  getters: {
    async getTodos(state) {
      return state.todos;
    },
    // getters의 메소드들은 세 개의 인자를 받을 수 있다. (state, getters, rootState)
    // state 는 현대 스토어의 상태 (모듈일 경우 현재 모듈)
    // getters 는 다른 getter 를 호출하기 위한 getters
    // rootState 는 다른 모듈의 상태에 접근할 수 있는 파라메터
  },
  mutations: {
    // mutataions 에 들어올 수 있는 기본 인자는 state
    // actions 를 통해 전달받는 인자는 state 다음에 처리
    updateTodos(state, { data }) {
      state.todos = data;
    },
    addNewTodo(state, { item }) {
      state.todos.push(item);
    },
    patchTodo(state, { item }) {
      const updateTodos = state.todos.map((todo) => {
        if (todo.todoID !== item.todoID) return todo;
        return item;
      });
      state.todos = updateTodos;
    },
    deleteAll(state) {
      state.todos = [];
    },
  },
  actions: {
    // actions 에 들어올 수 있는 기본인자는 commit 과 state
    async fetchTodos({ commit }) {
      const response = await axios.get('/v1/todo/all');
      commit('updateTodos', { data: response.data });
    },

    async addTodo({ commit }, todo) {
      const bodyObject = {
        todo,
        authorID: 1,
        priority: 1,
      };
      const response = await axios.post('/v1/todo/item', bodyObject)
        .catch((error) => {
          const errorMessage = error.response.data.message;
          throw new Error(errorMessage);
        });
      commit('updateTodos', { data: response.data });
    },

    async editTodo({ commit }, editInfo) {
      const response = await axios.patch('/v1/todo/content', editInfo);
      if (response.status === 200) {
        commit('patchTodo', { item: response.data });
      }
    },
    async reassignPriority({ commit }, list) {
      await list.reduce(async (promise, todo, index) => {
        await promise;
        await axios.patch('/v1/todo/priority', {
          todoID: todo.todoID,
          priority: index + 1,
        }).catch((error) => {
          // axios 에서 에러 객체는 err.response.data (api 에서 json 으로 리턴한 경우)
          const errorMessage = error.response.data.message;
          throw new Error(errorMessage);
        });
      }, Promise.resolve());

      const response = await axios.get('/v1/todo/all');

      commit('updateTodos', { data: response.data });
    },
    async toggleStatus({ commit }, editInfo) {
      const { todoID, done } = editInfo;
      const response = await axios.patch('/v1/todo/status', {
        todoID,
        status: !done,
      }).catch((error) => {
        const errorMessage = error.response.data.message;
        throw new Error(errorMessage);
      });
      commit('updateTodos', { data: response.data });
    },
    async deleteTodo({ commit }, todoID) {
      const response = await axios.delete('/v1/todo/item', { data: { todoID } });
      if (response.status === 200) {
        const updatedTodosResponse = await axios.get('/v1/todo/all');
        commit('updateTodos', { data: updatedTodosResponse.data });
      }
    },
    async deleteAll({ commit }) {
      const response = await axios.delete('/v1/todo/all');
      console.log('[response.data.message]', response.data.message);
      if (response.status === 200) {
        commit('deleteAll');
      }
    },
  },
});
