const asyncWrap = require('../lib/asyncMiddleware');
const models = require('../models');
const HttpCodeException = require('../lib/httpcode-exception');

const controller = {};
const { todos: Todos, sequelize } = models;

const getAllList = async () => {
  try {
    const list = await Todos.findAll({
      where: { deleted: false },
      attributes: ['todoID', 'todo', 'priority', 'done'],
      order: [['done', 'ASC'], ['priority', 'ASC']],
    });
    return list;
  } catch (error) {
    console.error(error);
    throw new HttpCodeException(500, 'E500', '목록 조회에 실패하였습니다.');
  }
};

// 리스트를 받아서 우선순위가 있는 것들만 필터링하고, 있는것들의 우선순위를 재정렬
const reAssignPriorityAndReturnListFromDB = async (list, transaction) => {
  const filteredList = list
    .filter(item => typeof item.priority === 'number')
    .sort((a, b) => {
      if (a.priority > b.priority) {
        return 1;
      }
      if (a.priority < b.priority) {
        return -1;
      }
      return 0;
    });

  await filteredList.reduce(async (promise, todo, index) => {
    await promise;
    const item = await Todos.findById(todo.todoID);
    item.priority = index + 1;
    await item.save({ transaction });
  }, Promise.resolve());
};

controller.getAllTodos = asyncWrap(async (req, res) => {
  const allTodos = await getAllList();
  res.send(allTodos);
});

controller.createItem = asyncWrap(async (req, res) => {
  const { todo, authorID, priority } = req.body;
  if (!todo) {
    throw new HttpCodeException(400, 'E400', '할 일을 생성 할 수 없습니다. (내용이 전달되지 않았습니다)');
  }
  if (!authorID) {
    throw new HttpCodeException(400, 'E400', '할 일을 생성 할 수 없습니다. (작성자가 전달되지 않았습니다)');
  }
  if (!priority) {
    throw new HttpCodeException(400, 'E400', '할 일을 생성 할 수 없습니다. (우선순위가 전달되지 않았습니다)');
  }

  const transaction = await sequelize.transaction();
  const originList = await getAllList();

  if (originList.length) {
    try {
      const filteredList = originList.filter(item => item.priority);

      await filteredList.reduce(async (promise, originTodo) => {
        await promise;
        const item = await Todos.findById(originTodo.todoID);
        item.priority += 1;
        await item.save({ transaction });
      }, Promise.resolve());
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      throw new HttpCodeException(500, 'E500', '재정렬에 실패하였습니다.');
    }
  }

  try {
    await Todos.create({ todo, authorID, priority }, { transaction });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    throw new HttpCodeException(500, 'E500', '생성에 실패하였습니다.');
  }

  await transaction.commit();
  const newList = await getAllList();

  res.send(newList);
});

controller.editTodoContent = asyncWrap(async (req, res) => {
  const { todoID, todo } = req.body;
  if (!todoID) {
    throw new HttpCodeException(400, 'E400', '할 일을 수정 할 수 없습니다. (todoID가 전달되지 않았습니다)');
  }
  if (!todo) {
    throw new HttpCodeException(400, 'E400', '할 일을 수정 할 수 없습니다. (수정할 내용이 전달되지 않았습니다)');
  }

  try {
    const targetTodo = await Todos.findById(todoID);
    if (!targetTodo) {
      throw new HttpCodeException(404, 'E404', '할 일을 수정 할 수 없습니다. (해당 할 일을 찾을 수 없습니다)');
    }
    targetTodo.todo = todo;
    await targetTodo.save();
    res.send(targetTodo);
  } catch (error) {
    console.error(error);
    throw new HttpCodeException(500, 'E500', '수정에 실패하였습니다.');
  }
});

controller.editPriority = asyncWrap(async (req, res) => {
  const { todoID, priority } = req.body;
  if (!todoID) {
    throw new HttpCodeException(400, 'E400', '할 일의 순서를 변경할 수 없습니다. (todoID가 전달되지 않았습니다)');
  }
  if (!priority) {
    throw new HttpCodeException(400, 'E400', '할 일의 순서를 변경할 수 없습니다. (순서가 전달되지 않았습니다)');
  }

  try {
    const targetTodo = await Todos.findById(todoID);
    if (!targetTodo) {
      throw new HttpCodeException(404, 'E404', '할 일의 순서를 변경할 수 없습니다. (해당 할 일을 찾을 수 없습니다)');
    }
    targetTodo.priority = priority;
    await targetTodo.save();
    res.send(targetTodo);
  } catch (error) {
    console.error(error);
    throw new HttpCodeException(500, 'E500', '순서변경에 실패하였습니다.');
  }
});

controller.toggleStatus = asyncWrap(async (req, res) => {
  const { todoID, status } = req.body;
  if (!todoID) {
    throw new HttpCodeException(400, 'E400', '할 일의 상태를 변경할 수 없습니다. (todoID가 전달되지 않았습니다)');
  }
  if (!typeof status === 'boolean' || status === undefined) {
    throw new HttpCodeException(406, 'E406', '할 일의 상태를 변경할 수 없습니다. (전달된 상태값이 올바르지 않습니다)');
  }

  const targetTodo = await Todos.findById(todoID);
  if (!targetTodo) {
    throw new HttpCodeException(404, 'E404', '할 일의 상태를 변경할 수 없습니다. (해당 할 일을 찾을 수 없습니다)');
  }

  if (status) {
    // 미완료 -> 완료로 변경하는 경우
    const originPriority = targetTodo.priority;
    try {
      targetTodo.done = status;
      targetTodo.priority = null;
      await targetTodo.save();
    } catch (error) {
      targetTodo.done = !status;
      targetTodo.priority = originPriority;
      await targetTodo.save();
      throw new HttpCodeException(500, 'E500', '할 일의 상태를 변경하는데 실패하였습니다.');
    }
  } else {
    // 완료 -> 미완료로 변경하는 경우
    try {
      targetTodo.done = status;
      targetTodo.priority = 0;
      await targetTodo.save();
    } catch (error) {
      targetTodo.done = !status;
      targetTodo.priority = null;
      await targetTodo.save();
      throw new HttpCodeException(500, 'E500', '할 일의 상태를 변경하는데 실패하였습니다.');
    }
  }

  const transaction = await sequelize.transaction();
  try {
    // *주의: 바로 이전 try catch 문에서 부터 트랜젝션을 걸면 저장이 안 된 상태로 리스트를 불러온다
    const allList = await getAllList();
    await reAssignPriorityAndReturnListFromDB(allList, transaction);
  } catch (error) {
    await transaction.rollback();
    throw new HttpCodeException(500, 'E500', '재정렬에 실패하였습니다.');
  }

  await transaction.commit();
  const allTodos = await await getAllList();
  res.send(allTodos);
});


controller.deleteItem = asyncWrap(async (req, res) => {
  const { todoID } = req.body;
  if (!todoID) {
    throw new HttpCodeException(400, 'E400', '할 일의 삭제할 수 없습니다. (todoID가 전달되지 않았습니다)');
  }

  try {
    await Todos.destroy({ where: { todoID } });
  } catch (error) {
    throw new HttpCodeException(500, 'E500', '데이터를 삭제하는데 실패하였습니다.');
  }

  const transaction = await sequelize.transaction();
  const allTodos = await getAllList();
  try {
    await allTodos
      .filter(item => !item.done)
      .reduce(async (promise, todo, index) => {
        await promise;
        const item = await Todos.findById(todo.todoID);
        item.priority = index + 1;
        await item.save({ transaction });
      }, Promise.resolve());
  } catch (error) {
    await transaction.rollback();
    throw new HttpCodeException(500, 'E500', '삭제하고 남은 할 일들의 상태를 변경하는데 실패하였습니다.');
  }

  await transaction.commit();
  res.send({ message: '할 일을 삭제하였습니다.' });
});

controller.deleteAll = asyncWrap(async (req, res) => {
  try {
    await Todos.destroy({
      where: { authorID: 1 },
      truncate: true,
    });
    res.send({ message: '모든 데이터를 삭제하였습니다.' });
  } catch (error) {
    throw new HttpCodeException(500, 'E500', '모든 데이터를 삭제하는데 실패하였습니다.');
  }
});

module.exports = controller;
