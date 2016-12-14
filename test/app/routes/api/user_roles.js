import test from 'ava'
import superkoa from 'superkoa'
import config from '../../../../config/sys.js'
//
// var model = 'roles'
//
// var role
//
var mock = {
    'userId': 212,
    'roleId': 2123
}

var mockUpdate = {
    'userId': 3123,
    'roleId': 4123
}
var tokenRequest

test.before('get token before', function *(t) {
    var res = yield superkoa('../../app.js')
                .post('/api/auth')
                .send({
                    'username': config.appId,
                    'password': config.appSecret
                })
    
    var json = res.body.data            

    t.is(200, res.status)
    t.truthy(json.token)

    tokenRequest = json.token
})

test.afterEach('destroy test data', function *(t) {
    if (t.context.savedId) {
        var res = yield superkoa('../../app.js')
                .del(`/api/user_roles/${t.context.savedId}`)
                .set('x-access-token',tokenRequest)

        t.is(200, res.status)     

        res = yield superkoa('../../app.js')
                .get(`/api/user_roles/${t.context.savedId}`)
                .set('x-access-token',tokenRequest)

        var json = res.body.data 
        t.is(200, res.status)
        t.is('no this data', json.message)      
    }
})

/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /api/user_roles[/]        => roles.api.list()
 *  GET    /api/user_roles/:id       => roles.api.show()
 *  POST   /api/user_roles[/]        => role.api.create()
 *  PATCH  /api/user_roles/:id       => roles.api.update()
 *  DELETE /api/user_roles/:id       => roles.api.destroy()
 *
 */


test('test role api', function * (t) {
    
    // *  POST   /api/user_roles[/]        => role.api.create()
    var res = yield superkoa('../../app.js')
                .post('/api/user_roles')
                .send(mock)
                .set('x-access-token',tokenRequest)
    var json = res.body.data 
    var savedId = json.result.savedId

    t.is(200, res.status, 'POST /api/user_roles pass')
    t.truthy(savedId)
    
    t.context.savedId = savedId

    //GET    /api/user_roles/:id       => roles.api.show()
    res = yield superkoa('../../app.js')
                .get(`/api/user_roles/${savedId}`)
                .set('x-access-token',tokenRequest)

    json = res.body.data 
    t.is(200, res.status, `GET /api/user_roles/${savedId} pass`)
    t.is(mock.userId, json.result.userId)
    
    //GET    /api/user_roles[/]        => roles.api.list()
    res = yield superkoa('../../app.js')
                .get('/api/user_roles')
                .query({
                    where : JSON.stringify(mock)
                })
                .set('x-access-token',tokenRequest)
    json = res.body.data 
    t.is(200, res.status)
    t.is(1, json.result.count)

    //PATCH  /api/user_roles/:id       => roles.api.update()
    res = yield superkoa('../../app.js')
                .patch(`/api/user_roles/${savedId}`)
                .send(mockUpdate)
                .set('x-access-token',tokenRequest)

    json = res.body.data 
    
    t.is(200, res.status, `PATCH /api/user_roles/${savedId} pass`)

    res = yield superkoa('../../app.js')
                .get(`/api/user_roles/${savedId}`)
                .set('x-access-token',tokenRequest)

    json = res.body.data 
    t.is(200, res.status, `GET /api/user_roles/${savedId} pass`)
    t.not(mock.userId, json.result.userId)

})




