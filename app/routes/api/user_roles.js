"use strict"

var router = require('koa-router')()
const co = require('co')

var $middlewares  = require('../../common/mount-middlewares')(__dirname)

// core controller
var $ = require('../../common/mount-controllers')(__dirname).user_roles

/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /api/user_roles[/]        => user_roles.api.list()
 *  GET    /api/user_roles/:id       => user_roles.api.show()
 *  POST   /api/user_roles[/]        => user_role.api.create()
 *  PATCH  /api/user_roles/:id       => user_roles.api.update()
 *  DELETE /api/user_roles/:id       => user_roles.api.destroy()
 *  
 */

// -- custom routes

router.get('/', $middlewares.check_api_token , $.api.list)

router.post('/', $middlewares.check_api_token , $.api.create)

router.get('/:id', $middlewares.check_api_token , $.api.show)

router.patch('/:id', $middlewares.check_api_token , $.api.update)

router.delete('/:id', $middlewares.check_api_token , $.api.destroy)




module.exports = router