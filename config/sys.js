var config = {
  name: 'Api demo', // 网站名名字
  description: 'Api demo', // 网站的描述
  keywords: '',

  session_secret: 'api_demo_secret', // 务必修改
  auth_cookie_name: 'api_demo',

  port: 3010,

  list_count: 20,


  host: 'http://localhost:3010',
  base_host: 'http://localhost:3000',
  appId: 'someAppId',
  appSecret: 'someAppSecret'
}

if (process.env.NODE_ENV === 'production') {
  config.host = 'http://doman.cn'
  config.base_host = 'http://base.doman.cn'
} else if (process.env.NODE_ENV === 'test') {
  config.host = 'http://test.doman.cn'
  config.base_host = 'http://base.test.doman.cn'
  config.port = 3110
}

module.exports = config
