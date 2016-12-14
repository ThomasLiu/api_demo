"use strict"

const validator = require('validator')

const logger = require('../common/logger')(__filename.replace(__dirname, ''))
const apiFormat = require('../common/res_api_format')
const api = require('../common/api')
const tools = require('../common/tools')
const log = require('../common/require_logger_util')
const restful = require('../common/restful_util')

const $models = require('../common/mount-models')(__dirname)
const User = $models.user

// -- custom

// -- custom api
exports.api = {
    check: function *(next){
        log(logger, '/api/users/check => api.check', this)
        var mobiePhone = this.query.mobiePhone,
            password = this.query.password

        var user = yield User.findOne({
            where: {mobiePhone: mobiePhone}
        }) 
        var bool = false ,
            id, nickname
        if (user) {
            bool = yield tools.bcompare(`${mobiePhone}##${Config.session_secret}##${password}`,user.password)
            id = user.id
            nickname = user.nickname
        }
        
        var data = {
            success: true,
            message: 'Enjoy your data!',
            result: {
                isPass: bool,
                id: id,
                nickname: nickname
            }
        }
        this.body = apiFormat.api(data)
    },
    list: function *(next){
        log(logger, '/api/users[/] => api.list', this)

        var where = {}

        if (this.query.where) {
            where = JSON.parse(this.query.where)
        }

        this.body = yield restful.list({
            model: User,
            where : where,
            page : this.query.page,
            sort : this.query.sortby,
            limit : this.query.limit
        })

    },
    create: function *(next){
        log(logger, '/api/users[/] => api.create', this)
        
        this.body = yield restful.create({
            body : this.request.body,
            getEditError : _getEditError,
            create : _create
        })
    },
    show: function *(next){
        log(logger, '/api/users/:id => api.show', this)

        this.body = yield restful.show({
            model: User,
            id: this.params.id,
            json : _json
        })
    },
    update: function *(next){
        log(logger, '/api/users/:id => api.update', this)
        
        this.body = yield restful.update({
            body: this.request.body,
            id: this.params.id,
            getEditError : _getEditError,
            update: _update
        })

    },
    destroy: function *(next){
        log(logger, '/api/users/:id => api.destroy', this)

        this.body = yield restful.destroy({
            model: User,
            id: this.params.id
        })
    },
}


var _hashUserPassword = function *(user){

    const password = validator.trim(user.password)

    const hashPassword = yield tools.bhash(`${user.mobiePhone}##${Config.session_secret}##${user.password}`)

    user.password = hashPassword
    return user
}

var _update = function *(obj, id) {
    obj = yield _hashUserPassword(obj)

    return yield User.update(
        obj,
        {where: {id: id}}
    )
}

var _create = function *(obj) {
    obj = yield _hashUserPassword(obj)

    return yield User.create(
        obj
    )
}

var _json = (user) => {
    return {
        mobiePhone : user.mobiePhone,
        password : user.password,
        nickname : user.nickname,
        lastAtFormat : user.lastAtFormat,
        updatedAtFormat : user.updatedAtFormat
    }
}

var _getEditError = (body) => {
    const mobiePhone = validator.trim(body.mobiePhone || '')
    const password = validator.trim(body.password || '')
    var editError

    if ([mobiePhone, password].some(function (item) { return item === ''})) {
        editError = 'We need your mobiePhone and password'
    }
    return editError
}