"use strict"
const apiFormat = require('./res_api_format')


exports.list = function *({model, where, page, sort = 'createdAt DESC', limit = Config.list_count, include}){
    page = parseInt(page, 10) || 1
    page = page > 0 ? page : 1
    limit = parseInt(limit)

    var data = {
        success: false,
        message: 'Enjoy your data!'
    }

    var result = yield model.findAndCountAll({
        where : where,
        offset: (page - 1) * limit,
        limit: limit,
        order: sort,
        include: include
    })

    data.success = true

    data.result = result
    return apiFormat.api(data)
}

exports.create = function *({body, getEditError, create}){
    var editError = getEditError(body)
        
    var data = {
        success: false,
        message: 'Enjoy your data!'
    }

    if (!editError) {
        try {
            var obj = yield create(body)
            data.result = {savedId: obj.id}
        } catch(err) {
            editError = err.message
        }
    }

    if (editError) {
        data.message = editError
        return apiFormat.api_error(data)
    } else {
        data.success = true
        return apiFormat.api(data)
    }
}

exports.show = function *({model, id, json}){
    var data = {
        success: false,
        message: 'Enjoy your data!'
    }

    var obj = yield model.findById(id)

    if (!obj) {
        data.message = 'no this data'
        return apiFormat.api_error(data)
    } else {
        data.success = true
        data.result = json(obj)
        return apiFormat.api(data)
    }
}

exports.update = function *({body, id, getEditError, update}){
    var editError = getEditError(body)

    var data = {
        success: false,
        message: 'Enjoy your data!'
    }

    if (!editError) {
        try {
            var obj = yield update(body, id)
            data.result = {savedId: obj.id}
        } catch(err) {
            editError = err.message
        }
    }

    if (editError) {
        data.message = editError
        return apiFormat.api_error(data)
    } else {
        data.success = true
        return apiFormat.api(data)
    }
}

exports.destroy = function *({model, id}){
    var editError
    var data = {
        success: false,
        message: 'delete success!'
    }
    try {
        yield model.destroy({
            where: {
                id: id
            },
        })
    } catch(err) {
        editError = err.message
    }

    if (editError) {
        data.message = editError
        return apiFormat.api_error(data)
    } else {
        data.success = true
        return apiFormat.api(data)
    }
}

