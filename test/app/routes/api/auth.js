import test from 'ava'
import superkoa from 'superkoa'
import config from '../../../../config/sys.js'
//
// var model = 'users'
//
// var user
//
var mockUser = {
    'username': config.appId,
    'password': config.appSecret
}

/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  POST   /api/auth            => index.auth()
 *  POST   /api/auth/check      => index.check()
 */

// *  POST   /api/auth            => index.auth()
test('POST /api/auth the username or password error', function *(t) {
    var res = yield superkoa('../../app.js')
                .post('/api/auth')
                .send({
                    username: 'test',
                    password: 'test'
                })

    var json = res.body.data            

    t.is(200, res.status)
    t.is('the username or password error', json.message)
})

// *  POST   /api/auth            => index.auth()
test('POST /api/auth the username and password right', function *(t) {
    var res = yield superkoa('../../app.js')
                .post('/api/auth')
                .send(mockUser)

    var json = res.body.data            

    t.is(200, res.status)
    t.truthy(json.token)
})

// *  POST   /api/auth/check      => index.check()
test('POST /api/auth/check', function *(t) {
    var res = yield superkoa('../../app.js')
                .post('/api/auth/check')
                .send({
                    username: 'test',
                    password: 'test',
                })

    var json = res.body.data            

    t.is(200, res.status)
    t.is(`connect ECONNREFUSED 127.0.0.1:3000`, json.message)
})
