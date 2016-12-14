"use strict";

const Sequelize = require('sequelize')
const tools = require('../common/tools')
var db = require('../../db')

//const $models = require('../common/mount-models')(__dirname)

var UserRole = db.define('user_role', {
    roleId: {type:   Sequelize.INTEGER, allowNull: false,},
},{
    indexes: [
        {
            unique: true,
            fields: ['userId','roleId']
        }
    ],
    getterMethods   : {
        createdAtFormat: function() { return tools.formatDate(this.createdAt) },
        updatedAtFormat: function() { return tools.formatDate(this.updatedAt) },
    },
})


module.exports = UserRole



