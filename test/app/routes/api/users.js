import test from 'ava'
import superkoa from 'superkoa'
import config from '../../../../config/sys.js'
//
// var model = 'users'
//
// var user
//
var mock = {
    'mobiePhone': '13422121829',
    'password': '000000'
}

var mockUpdate = {
    'mobiePhone': '13412314122',
    'password': '111111'
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
                .del(`/api/users/${t.context.savedId}`)
                .set('x-access-token',tokenRequest)

        t.is(200, res.status)     

        res = yield superkoa('../../app.js')
                .get(`/api/users/${t.context.savedId}`)
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
 *  GET    /api/users/check     => users.api.check()
 *  GET    /api/users[/]        => users.api.list()
 *  GET    /api/users/:id       => users.api.show()
 *  POST   /api/users[/]        => user.api.create()
 *  PATCH  /api/users/:id       => users.api.update()
 *  DELETE /api/users/:id       => users.api.destroy()
 *
 */

test.skip('test user api', function * (t) {
    var res = yield superkoa('../../app.js')
                .post('/api/users')
                .send({
                    id: 1,
                    nickname: 'Thomas Lau',
                    'mobiePhone': '13422517829',
                    'password': '000000'
                })
                .set('x-access-token',tokenRequest)
    var json = res.body.data 
    var savedId = json.result.savedId

    t.is(200, res.status, 'POST /api/users pass')
    t.truthy(savedId)
})


test('test user api', function * (t) {
    
    // *  POST   /api/users[/]        => user.api.create()
    var res = yield superkoa('../../app.js')
                .post('/api/users')
                .send(mock)
                .set('x-access-token',tokenRequest)
    var json = res.body.data 
    var savedId = json.result.savedId

    t.is(200, res.status, 'POST /api/users pass')
    t.truthy(savedId)
    
    t.context.savedId = savedId

    //GET    /api/users/:id       => users.api.show()
    res = yield superkoa('../../app.js')
                .get(`/api/users/${savedId}`)
                .set('x-access-token',tokenRequest)

    json = res.body.data 
    t.is(200, res.status, `GET /api/users/${savedId} pass`)
    t.is(mock.mobiePhone, json.result.mobiePhone)
    
    //GET    /api/users[/]        => users.api.list()
    res = yield superkoa('../../app.js')
                .get('/api/users')
                .query({
                    where : JSON.stringify({
                        mobiePhone : mock.mobiePhone
                    })
                })
                .set('x-access-token',tokenRequest)
    json = res.body.data 
    t.is(200, res.status)
    t.is(1, json.result.count)

    //GET    /api/users/check     => users.api.check()
    res = yield superkoa('../../app.js')
                .get('/api/users/check')
                .query(mock)
                .set('x-access-token',tokenRequest)
    json = res.body.data 
    t.is(200, res.status)
    t.true(json.result.isPass)
    t.truthy(json.result.id)

    res = yield superkoa('../../app.js')
                .get('/api/users/check')
                .query({
                    mobiePhone : mock.mobiePhone,
                    password : 123123
                })
                .set('x-access-token',tokenRequest)
    json = res.body.data 
    t.is(200, res.status)
    t.false(json.result.isPass)
    t.truthy(json.result.id)

    res = yield superkoa('../../app.js')
                .get('/api/users/check')
                .query(mockUpdate)
                .set('x-access-token',tokenRequest)
    json = res.body.data 
    t.is(200, res.status)
    t.false(json.result.isPass)
    t.falsy(json.result.id)

    //PATCH  /api/users/:id       => users.api.update()
    res = yield superkoa('../../app.js')
                .patch(`/api/users/${savedId}`)
                .send(mockUpdate)
                .set('x-access-token',tokenRequest)

    json = res.body.data 
    
    t.is(200, res.status, `PATCH /api/users/${savedId} pass`)

    res = yield superkoa('../../app.js')
                .get(`/api/users/${savedId}`)
                .set('x-access-token',tokenRequest)

    json = res.body.data 
    t.is(200, res.status, `GET /api/users/${savedId} pass`)
    t.not(mock.mobiePhone, json.result.mobiePhone)

})




