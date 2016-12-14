"use strict";

const Sequelize = require('sequelize')
const tools = require('../common/tools')
var db = require('../../db')

const $models = require('../common/mount-models')(__dirname)

const UserRole = $models.user_role

var User = db.define('user', {
    mobiePhone: {type: Sequelize.STRING, allowNull: false,},
    password: {type: Sequelize.STRING, allowNull: false, },
    nickname: {type: Sequelize.STRING, allowNull: false, defaultValue: 'New comer', },
    lastAt: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW,},
    isLock: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false,},
},{
    indexes: [
        {
            unique: true,
            fields: ['mobiePhone','password']
        }
    ],
    getterMethods   : {
        createdAtFormat: function() { return tools.formatDate(this.createdAt) },
        updatedAtFormat: function() { return tools.formatDate(this.updatedAt) },
        lastAtFormat: function() { return tools.formatDate(this.lastAt) },
    },
})

User.hasMany(UserRole,{constraints: false})

//User.sync({force: true})

module.exports = User



