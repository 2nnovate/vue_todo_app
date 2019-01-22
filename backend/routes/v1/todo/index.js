const express = require('express');

const todoControllers = require('../../../controllers/todoControllers');

const router = express.Router();

router.post('/item', todoControllers.createItem);

router.get('/all', todoControllers.getAllTodos);

router.delete('/item', todoControllers.deleteItem)

router.delete('/all', todoControllers.deleteAll);

module.exports = router;
