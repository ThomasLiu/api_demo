var dbSetting = {
  host: '127.0.0.1',
  database: 'database_test',
  user: 'root',
  password: '5201314',
  dialect: 'mysql',
    // socketPath: '/var/run/mysqld/mysqld.sock',
  port: '3306',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}

if (process.env.NODE_ENV === 'production') {
  dbSetting.database = 'database'
  dbSetting.host = 'database.mysql.rds.aliyuncs.com'
  dbSetting.user = 'username'
  dbSetting.password = 'password'
} else if (process.env.NODE_ENV === 'test') {
    // for test
  dbSetting.database = 'database_test'
  dbSetting.host = 'database.mysql.rds.aliyuncs.com'
  dbSetting.user = 'username'
  dbSetting.password = 'password'
}

module.exports = dbSetting
