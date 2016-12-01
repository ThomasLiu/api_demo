const bcrypt = require('bcryptjs')
const validator = require('validator')
var moment = require('moment')

moment.locale('zh-cn') // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date)

    if (friendly) {
        return date.fromNow()
    } else {
        return date.format('YYYY-MM-DD HH:mm')
    }

}

exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str)
}

exports.toUrlFormat = function (str) {
    var url = validator.trim(str).toLowerCase()
    url = url.replace('https://','').replace('http://','')
    url = `https://${url}`
    return url
}

exports.objArrayToIdStr = function (inputArray, fild) {
    fild = fild || 'id'
    var array = new Array()
    for (var index in inputArray){
        var item = inputArray[index]
        if(item[fild]){
            array.push(item[fild])
        }
    }
    return array.join(',')
}




exports.bhash = function *(str) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(str, 10, (err, passhash) => {
            if (err) {
                reject(err)
            } else {
                resolve(passhash)
            }
        })
    })
}

exports.bcompare = function *(str, hash) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(str, hash, (err, bool) => {
            if (err) {
                reject(err)
            } else {
                resolve(bool)
            }
        })
    })
}

