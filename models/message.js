'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    message: {
      type: DataTypes.TEXT
    },
    createdOn: {
    	type: DataTypes.STRING
    },
    usersName: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.User);
      }
    }
  });
  return Message;
};