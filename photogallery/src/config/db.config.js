const config = {
  //for debug/dev setup
    HOST: "localhost",
    // for cluster
    //HOST: "mysql",
    USER: "gorman",
    PASSWORD: "gorman",
    DB: "photos",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
  if (process.env.DB_HOST) {
    config.HOST = process.env.DB_HOST
  }
module.exports = {...config};