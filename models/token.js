//Creates unique token for sign-in
var cryptojs = require('crypto-js');

module.exports = function (sequelize, DataTypes) {

	var Token = sequelize.define('Token', {
		token: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [1]
			},
			set: function (value) {
				var hash = cryptojs.MD5(value).toString();

				this.setDataValue('token', value);
				this.setDataValue('tokenHash', hash);
			}
		},
		tokenHash: DataTypes.STRING
	});
	return Token;
};