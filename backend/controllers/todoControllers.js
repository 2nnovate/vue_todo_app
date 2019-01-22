const asyncWrap = require('../lib/asyncMiddleware');
const models = require('../models');

const controller = {};
const { todos: Todos } = models;

controller.getAllTodos = asyncWrap(async (req, res) => {
  try {
    const allTodos = await Todos.findAll({
      where: { deleted: false },
      attributes: ['todoID', 'todo', 'priority'],
      order: [['priority', 'ASC']],
    });
    console.log('[allTodos.length]', allTodos.length);
    res.send(allTodos);
  } catch (error) {
    console.error(error);
  }
});

controller.createItem = asyncWrap(async (req, res) => {
  const { todo, authorID, priority } = req.body;
  if (!todo || !authorID || !priority) throw new Error('할 일을 생성 할 수 없습니다.');
  try {
    const newItem = await Todos.create({ todo, authorID, priority });
    res.send(newItem);
  } catch (error) {
    console.error(error);
  }
});

controller.editItem = asyncWrap(async (req, res) => {
  const { todoID, todo } = req.body;
  if (!todoID || !todo) throw new Error('할 일을 수정 할 수 없습니다.');
  try {
    const targetTodo = await Todos.findById(todoID);
    // TODO: todoID 는 들어왔지만 DB에 없는 경우 익셉션
    targetTodo.todo = todo;
    await targetTodo.save();
    res.send(targetTodo);
  } catch (error) {
    console.error(error);
  }
});

controller.deleteItem = asyncWrap(async (req, res) => {
  const { todoID } = req.body;
  if (!todoID) throw new Error('해당 할 일을 삭제할 수 없습니다.');
  try {
    await Todos.destroy({ where: { todoID } });

    const allTodos = await Todos.findAll({
      where: { deleted: false },
      attributes: ['todoID', 'todo', 'priority'],
      order: [['priority', 'ASC']],
    });

    await allTodos.reduce(async (promise, todo, index) => {
      await promise;
      const item = await Todos.findById(todo.todoID);
      item.priority = index + 1;
      await item.save();
    }, Promise.resolve());

    res.send({ message: '할 일을 삭제하였습니다.' });
  } catch (error) {
    console.error(error);
  }
});

controller.deleteAll = asyncWrap(async (req, res) => {
  try {
    await Todos.destroy({
      where: { authorID: 1 },
      truncate: true,
    });
    res.send({ message: '모든 데이터를 삭제하였습니다.' });
  } catch (error) {
    console.error(error);
  }
});

module.exports = controller;
