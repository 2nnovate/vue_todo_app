module.exports = function (sequelize, DataTypes) {
  const model = sequelize.define('todos', {
    todoID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    todo: {
      type: DataTypes.STRING(400),
    },
    authorID: {
      type: DataTypes.STRING(36),
    },
    priority: {
      type: DataTypes.SMALLINT(4),
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,

    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: 'todos',
  });

  return model;
};
