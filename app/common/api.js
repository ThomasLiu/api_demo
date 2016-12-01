"use strict"

const superagent = require('superagent')

const cache = require('./cache')
const logger = require('./logger')(__filename.replace(__dirname, ''))


var request = function *({url , method = 'get' , query, send}){
    logger.debug(`request url :${url}, method:${method}, query: ${JSON.stringify(query)}, send : ${JSON.stringify(send)}`)

    var data = {},err

    var tokenRequest = yield getToken()

    data = tokenRequest.data
    if (tokenRequest.err) {
        return {err: tokenRequest.err}
    }

    var result = yield justRequest({url: url , method: method, query: query, send: send, token: data.token})

    var json = result.json

    err = result.err

    if (json.data && json.data.isTokenErr) {
        logger.debug(`request url :${url} , isTokenErr :${json.data.isTokenErr}`)

        yield getTokenRequest()

        return yield request({url: url , method: method, query: query, send: send})

    } else {
        return {err: err, json: json}
    }
}

var justRequest = function *({url , method = 'get' , query, send, token}){
    logger.debug(`justRequest url :${url}, method:${method}, query: ${JSON.stringify(query)}, send : ${JSON.stringify(send)}, token : ${token}`)
    var r = superagent[method](url).type('json').set('x-access-token',token)

    if (query) {
        r.query(query)
    }
    if (send) {
        r.send(send)
    }
    var res
    var err
    try {
        res = yield r
        if (!res.ok) {
            err = `api error: request.${method} not ok`
        }
    } catch (error) {
        err = error.message
        res = {body:{}}
    }
    
    return {err: err , json: res.body}
}


var getToken = function *(){
    var username = Config.appId
    var password = Config.appSecret
    logger.debug(`getToken username :${username}, password:${password}`)

    var cache_token = yield cache.get(`${Config.session_secret}-api-token-${username}`)

    if (cache_token) {
        var err
        return {err: err , data : {
            token : cache_token,
        }}
    } else {
        var {err, data} = yield getTokenRequest(username,password)
        return {err: err , data : {
            token : data.token,
            role : data.roleType,
            clientId : data.clientId
        }}
    }
}

var getTokenRequest = function *(){
    var username = Config.appId
    var password = Config.appSecret
    logger.debug(`getTokenRequest ${Config.base_host}/api/auth username :${username}, password:${password}`)

    var err, data, res

    try {
        res = yield superagent.post(`${Config.base_host}/api/auth`)
        .type('json')
        .send({username: username, password: password})

        if (!res.ok) {
            err = `getToken error: request.post not ok`
        } else {
            var json = res.body
            data = json.data

            if(data.token){
                yield cache.set(`${Config.session_secret}-api-token-${username}`, data.token , 3600 * 24)
            } else {
                err = `getToken error: ${data.message}`
            }
        }
    } catch (error) {
        err = error.message
        data = {token: ''}
    }    
    
    return {err: err , data : data}
}

exports.request = request

