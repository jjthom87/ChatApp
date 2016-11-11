'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    like: {
      type: DataTypes.BOOLEAN
    },
    createdOn: {
    	type: DataTypes.STRING
    },
    usersName: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Like.belongsTo(models.User);
        Like.belongsTo(models.Message);
      }
    }
  });
  return Like;
};