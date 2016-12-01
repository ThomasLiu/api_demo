
const cache = require('./cache')
const logger = require('./logger')(__filename.replace(__dirname, ''))

const api = require('./api')

const $models = require('./mount-models')(__dirname),
    ExhibitorJob = $models.exhibitorJob,
    Exhibitor = $models.exhibitor

const modelObj = {
    exhibitorJob : ExhibitorJob,
    exhibitor : Exhibitor
}


var getValue = function *(table,id,field) {
    var key = `${table}-${field}-${id}`
    var value = yield cache.get(key)
    if (value) {
        return value
    }

    var tableName = Enumeration.tableNameTypeObj[table]
    if (tableName) {
        var url = `${Config.base_host}/api/data/${table}/${field}/${id}`
        var {err, json} = yield api.request({url:url})
        if (err) {
            logger.error(`${url} err: ${JSON.stringify(err)}`)
        } else if (json && json.data.result) {
            value = json.data.result
            yield cache.set(key, value , 3600 * 24)
        } else {
            logger.error(`${url} err: ${json.data.message}`)
        }
    } else {
        var model = modelObj[table]
        if (model) {
            var instance = yield model.findById(id, {
                attributes :[field]
            })
            if (instance) {
                value = instance[field]
                if (value) {
                    yield cache.set(key, value , 3600 * 24)
                } else {
                    editError = `${key} err: not this field`
                }
            } else {
                editError = `${key} err: not this id instance`
            }
        } else {
            editError = `${key} err: not this table`
        }
    }

    return value
}

exports.getValue = getValue

exports.getInstantiation = function *(url,key) {
    var value = yield cache.get(key)
    if (value) {
        return value
    }
    var {err, json} = yield api.request({url:url})
    if (err) {
        logger.error(`${url} err: ${JSON.stringify(err)}`)
    } else if (json && json.data.result) {
        value = json.data.result
        yield cache.set(key, value , 3600 * 24)
    } else {
        logger.error(`${url} err: ${json.data.message}`)
    }

    return value
}


var toList = function *(list,table,idField,field){
    var returnList = new Array()
    for (var index in list) {
        var item = list[index]
        var id = item[idField]
        var value = yield getValue(table, id, field)

        var obj = {
            [idField] : id,
            [field] : value
        }
        returnList.push(obj)
    }
    return returnList
}

exports.toList = toList