'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    like: {
      type: DataTypes.INTEGER
    },
    createdOn: {
    	type: DataTypes.STRING
    },
    usersName: {
      type: DataTypes.STRING
    },
    liker: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Like.belongsTo(models.User);
      }
    }
  });
  return Like;
};