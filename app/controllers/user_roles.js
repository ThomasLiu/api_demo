"use strict"

const validator = require('validator')

const logger = require('../common/logger')(__filename.replace(__dirname, ''))
const apiFormat = require('../common/res_api_format')
const api = require('../common/api')
const tools = require('../common/tools')
const log = require('../common/require_logger_util')
const restful = require('../common/restful_util')

const $models = require('../common/mount-models')(__dirname)
const UserRole = $models.user_role

// -- custom

// -- custom api
exports.api = {
    list: function *(next){
        log(logger, '/api/user_roles[/] => api.list', this)

        var where = {}

        if (this.query.where) {
            where = JSON.parse(this.query.where)
        }

        this.body = yield restful.list({
            model: UserRole,
            where : where,
            page : this.query.page,
            sort : this.query.sortby,
            limit : this.query.limit
        })

    },
    create: function *(next){
        log(logger, '/api/user_roles[/] => api.create', this)
        
        this.body = yield restful.create({
            body : this.request.body,
            getEditError : _getEditError,
            create : _create
        })
    },
    show: function *(next){
        log(logger, '/api/user_roles/:id => api.show', this)

        var id = this.params.id

        this.body = yield restful.show({
            model: UserRole,
            id: this.params.id,
            json : _json
        })
    },
    update: function *(next){
        log(logger, '/api/user_roles/:id => api.update', this)
        
        this.body = yield restful.update({
            body: this.request.body,
            id: this.params.id,
            getEditError : _getEditError,
            update: _update
        })

    },
    destroy: function *(next){
        log(logger, '/api/user_roles/:id => api.destroy', this)

        this.body = yield restful.destroy({
            model: UserRole,
            id: this.params.id
        })
    },
}


var _update = function *(obj, id) {
    return yield UserRole.update(
        obj,
        {where: {id: id}}
    )
}

var _create = function *(obj) {
    return yield UserRole.create(
        obj
    )
}

var _json = (user_role) => {
    return {
        userId : user_role.userId,
        roleId : user_role.roleId,
        createdAtFormat : user_role.createdAtFormat,
        updatedAtFormat : user_role.updatedAtFormat
    }
}

var _getEditError = (body) => {
    const userId = body.userId || undefined
    const roleId = body.roleId || undefined
    var editError

    if ([userId, roleId].some(function (item) { return item === undefined})) {
        editError = 'We need your userId and roleId'
    }
    return editError
}